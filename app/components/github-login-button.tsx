import type { To } from "history";
import { useHref } from "react-router-dom";

const githubClientId = "c2749d34301434b92a1a";

export default function GithubLoginButton({
  basePath,
  redirect,
  ...props
}: JSX.IntrinsicElements["a"] & { basePath: string; redirect?: To }) {
  const redirectUrl = useHref(redirect || "/");
  const href = `https://github.com/login/oauth/authorize?scope=user&client_id=${githubClientId}&redirect_uri=${
    basePath + "login"
  }${redirectUrl ? `?redirect=${redirectUrl}` : ""}`;

  return <a {...props} href={href} />;
}
