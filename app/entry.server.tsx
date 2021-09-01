// import { PassThrough } from "stream";
import { renderToString } from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";

// function renderToStringWithWritable(element: any, timeout = 10000) {
//   return new Promise<string>((resolve, reject) => {
//     const writable = new PassThrough();
//     let res = "";
//     writable.on("data", (d) => {
//       res += String(d);
//     });

//     writable.on("end", () => {
//       resolve(res);
//     });

//     writable.on("error", (err) => {
//       reject(err);
//     });

//     const { startWriting, abort } = pipeToNodeWritable(element, writable, {
//       onCompleteAll() {
//         startWriting();
//       },
//       onError(err: Error) {
//         reject(err);
//       },
//     });

//     setTimeout(abort, timeout);
//   });
// }

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
