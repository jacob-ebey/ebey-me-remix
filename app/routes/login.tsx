import { json, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { redirect } from "remix";
import FormData from "form-data";

import { saveAuthToken } from "../lib/auth";
import { withSession } from "../lib/request";

const githubClientId = "c2749d34301434b92a1a";

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
      data.append("client_id", githubClientId);
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
        return json({
          error: "Error logging in",
        });
      }

      saveAuthToken(session, accessToken);

      return redirect(redirectPath || "/", {
        headers: {
          "Set-Cookie": "_vercel_no_cache=1; HttpOnly",
        },
      });
    }

    return json({});
  });
};

export default function Login() {
  const data = useRouteData();

  return <h1>{data.error}</h1>;
}
