import { PassThrough } from "stream";
// @ts-ignore
import { pipeToNodeWritable } from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";

function renderToStringWithWritable(element: any, timeout = 10000) {
  return new Promise<string>((resolve, reject) => {
    const writable = new PassThrough();
    let res = "";
    writable.on("data", (d) => {
      res += String(d);
    });

    writable.on("end", () => {
      resolve(res);
    });

    writable.on("error", (err) => {
      reject(err);
    });

    const { startWriting, abort } = pipeToNodeWritable(element, writable, {
      onCompleteAll() {
        startWriting();
      },
      onError(err: Error) {
        reject(err);
      },
    });

    setTimeout(abort, timeout);
  });
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = await renderToStringWithWritable(
    <RemixServer context={remixContext} url={request.url} />
  );

  return new Response(markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
