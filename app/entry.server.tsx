import { renderToString } from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // let markup = await renderToStringWithWritable(
  //   <RemixServer context={remixContext} url={request.url} />
  // );
  let markup = await renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  let headers = new Headers(responseHeaders);
  headers.set("Content-Type", "text/html");

  return new Response(markup, {
    status: responseStatusCode,
    headers,
  });
}
