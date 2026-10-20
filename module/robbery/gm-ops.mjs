/**
 * CAT BURGLARS — GM-authoritative operations (AUTOMATION.md §1; the pattern
 * from Heisty Spideys, docs/reference/heisty-automation-design.md §8).
 *
 * Players write only their own actors and their own chat messages. Anything
 * else a player does (move their cat in the robbery, answer a temptation, …)
 * is an operation that runs on the ACTIVE GM's client:
 *   gm.run(op, args)  — runs locally on the active GM, or sends it there with
 *                       User#query (CONFIG.queries[QUERY]); if User#query is
 *                       missing, a request/answer on the system socket.
 * v13 query handlers do NOT receive the sender (docs/LESSONS.md), so the payload
 * carries `userId` and every op checks it itself (e.g. that the user owns the
 * cat). The GM remembers recent request ids so a retry never applies twice.
 */
import { QUERY, SOCKET } from "../contracts.mjs";

const handlers = new Map();
const recent = new Map(); // requestId → result
const RECENT_CAP = 200;
const waiting = new Map(); // socket fallback: requestId → resolve

export const isActiveGM = () => !!game.user?.isGM && game.users?.activeGM?.id === game.user.id;

/** Does this user own this actor (or is a GM)? */
export function owns(user, actor) {
  if (!user || !actor) return false;
  if (user.isGM) return true;
  return actor.testUserPermission?.(user, "OWNER") ?? false;
}

export const gm = {
  /** Register an operation: check(args, user) returns an error string or null; apply(args, user) does it. */
  register(name, { check = null, apply }) {
    if (handlers.has(name)) throw new Error(`GM op ${name} registered twice`);
    handlers.set(name, { check, apply });
  },
  has: name => handlers.has(name),
  names: () => [...handlers.keys()],

  /** Run an op as the current user. Resolves to { ok, ...result } or { ok: false, error }. */
  async run(op, args = {}) {
    const userId = game.user?.id;
    const requestId = foundry.utils.randomID();
    if (isActiveGM()) return gm.handle({ op, args, userId, requestId });
    const target = game.users?.activeGM;
    if (!target) {
      ui.notifications?.warn("The Storyteller isn't connected — nothing was changed.");
      return { ok: false, error: "no-gm" };
    }
    try {
      if (typeof target.query === "function") return await target.query(QUERY, { op, args, userId, requestId }, { timeout: 10000 });
      return await socketRequest({ op, args, userId, requestId });
    } catch (err) {
      ui.notifications?.warn(`The Storyteller's client didn't answer: ${err?.message ?? err}`);
      return { ok: false, error: String(err?.message ?? err) };
    }
  },

  /** On the active GM: check and apply one op. */
  async handle({ op, args = {}, userId, requestId } = {}) {
    if (requestId && recent.has(requestId)) return recent.get(requestId);
    const h = handlers.get(op);
    let result;
    if (!isActiveGM()) result = { ok: false, error: "not the active GM" };
    else if (!h) result = { ok: false, error: `unknown operation ${op}` };
    else {
      const user = game.users.get(userId) ?? null;
      try {
        const err = h.check ? await h.check(args, user) : null;
        result = err ? { ok: false, error: err } : { ok: true, ...((await h.apply(args, user)) ?? {}) };
      } catch (e) {
        console.error(`Cat Burglars | GM op ${op} failed`, e);
        result = { ok: false, error: e?.message ?? String(e) };
      }
    }
    if (requestId) {
      recent.set(requestId, result);
      if (recent.size > RECENT_CAP) recent.delete(recent.keys().next().value);
    }
    return result;
  }
};

/** CONFIG.queries handler + socket fallback listener. Call once at init. */
export function registerTransport() {
  CONFIG.queries ??= {};
  CONFIG.queries[QUERY] = data => gm.handle(data);
  game.socket?.on?.(SOCKET, async msg => {
    if (msg?.type === "op" && isActiveGM()) {
      const result = await gm.handle(msg);
      game.socket.emit(SOCKET, { type: "opResult", requestId: msg.requestId, to: msg.userId, result });
    } else if (msg?.type === "opResult" && msg.to === game.user?.id && waiting.has(msg.requestId)) {
      waiting.get(msg.requestId)(msg.result);
      waiting.delete(msg.requestId);
    }
  });
}

function socketRequest(payload) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { waiting.delete(payload.requestId); reject(new Error("timed out")); }, 10000);
    waiting.set(payload.requestId, result => { clearTimeout(timer); resolve(result); });
    game.socket.emit(SOCKET, { type: "op", ...payload });
  });
}
