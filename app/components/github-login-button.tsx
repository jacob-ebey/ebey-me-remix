import type { To } from "history";
import { useHref } from "remix";

export default function GitHubLoginButton({
  basePath,
  redirect,
  ...props
}: JSX.IntrinsicElements["a"] & { basePath: string; redirect?: To }) {
  const redirectUrl = useHref(redirect || "/");
  const href = `https://github.com/login/oauth/authorize?client_id=${
    process.env.GITHUB_CLIENT_ID
  }&redirect_uri=${basePath + "login"}${
    redirectUrl ? `?redirect=${redirectUrl}` : ""
  }`;

  return <a {...props} href={href} />;
}
