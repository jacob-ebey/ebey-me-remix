import type { LinksFunction, LoaderFunction } from "remix";
import { json, Meta, Links, LiveReload, useCatch, useLoaderData } from "remix";
import { Outlet } from "react-router-dom";

import Container from "./components/container";
import Header from "./components/header";
import { withAuthToken } from "./lib/request";
import stylesUrl from "./styles/global.css";
import tailwindUrl from "./styles/tailwind.css";

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: tailwindUrl },
  ];
};

export let loader: LoaderFunction = ({ request }) => {
  return withAuthToken(request.headers.get("Cookie"))((authToken) => {
    return json({
      loggedIn: !!authToken,
    });
  });
};

function Document({
  children,
  loggedIn,
  title,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <meta charSet="utf-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header loggedIn={loggedIn} />

        {children}

        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  const { loggedIn } = useLoaderData();

  return (
    <Document loggedIn={loggedIn}>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  let { status, statusText } = useCatch();

  return (
    <Document loggedIn={false} title={statusText}>
      <Container>
        <h1 className="text-2xl lg:text-3xl">
          {status} {statusText}
        </h1>
      </Container>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document loggedIn={false} title="Oh no!">
      <Container>
        <h1>Something went terribly wrong!</h1>
      </Container>
    </Document>
  );
}
