import type { Response, Session } from "remix";
import { commitSession, getSession } from "./session";

import { AUTH_TOKEN_SESSION_KEY } from "./auth";

// If two loaders set cookies, the parent route takes precedence.
// Make sure that if two loaders that can be called on the same request use this, only one of them has readOnly = false.
export function withSession(cookieHeader: string | null, readOnly = false) {
  return async (fn: (session: Session) => Response | Promise<Response>) => {
    const session = await getSession(cookieHeader);
    const result = await fn(session);
    if (!readOnly) {
      result.headers.set("Set-Cookie", await commitSession(session));
    }
    return result;
  };
}

export function withAuthToken(cookieHeader: string | null) {
  return async function <T>(fn: (token: string | null) => T | Promise<T>) {
    const session = await getSession(cookieHeader);
    const token = session.get(AUTH_TOKEN_SESSION_KEY) || null;
    return fn(token);
  };
}
