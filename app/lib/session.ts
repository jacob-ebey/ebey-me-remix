import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // This is either a Cookie (or a set of CookieOptions) that
    // describe the session cookie to use.
    cookie: {
      name: "_vercel_no_cache",
      secrets: [process.env.SESSION_SECRET as string],
      sameSite: "lax",
      httpOnly: true,
    },
  });

export { getSession, commitSession, destroySession };
