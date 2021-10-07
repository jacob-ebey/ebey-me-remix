import type { ActionFunction, LoaderFunction } from "remix";
import { json, redirect, useRouteData } from "remix";
import FormData from "form-data";

import { saveAuthToken } from "~/lib/auth";
import { withSession } from "~/lib/request";
import { destroySession } from "~/lib/session";

export const action: ActionFunction = ({ request, params }) => {
  return withSession(
    request.headers.get("Cookie"),
    true
  )(async (session) => {
    const redirectTo = new URL(request.url).searchParams.get("redirect");
    return redirect(redirectTo || "/", {
      headers: {
        "Cache-Control": "no-cache",
        "Set-Cookie": await destroySession(session),
      },
    });
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return withSession(request.headers.get("Cookie"))(async (session) => {
    const url = new URL(
      request.url.replace("://localhost/", "://localhost:3000/")
    );
    url.pathname = "";
    url.search = "";
    const basePath = url.toString();

    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");
    const redirectPath = searchParams.get("redirect");

    if (code) {
      const data = new FormData();
      data.append("client_id", process.env.GITHUB_CLIENT_ID);
      data.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
      data.append("code", code);
      data.append("redirect_uri", basePath + "login");

      const { accessToken, error } = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          body: data as any,
        }
      )
        .then((response) => response.text())
        .then((paramsString) => {
          let params = new URLSearchParams(paramsString);
          const accessToken = params.get("access_token");

          // Request to return data of a user that has been authenticated
          return { error: null, accessToken };
        })
        .catch((error) => {
          return {
            error,
            accessToken: null,
          };
        });

      if (error || !accessToken) {
        return json(
          {
            error: "Error logging in",
          },
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );
      }

      saveAuthToken(session, accessToken);

      return redirect(redirectPath || "/", {
        headers: {
          "Cache-Control": "no-cache",
          "Set-Cookie": "_vercel_no_cache=1",
        },
      });
    }

    return json({
      error: "Something went wrong when logging in. Please try again.",
    });
  });
};

export default function Login() {
  const data = useRouteData();

  return <h1>{data.error}</h1>;
}
