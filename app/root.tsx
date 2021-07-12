import type { LinksFunction, LoaderFunction } from "remix";
import { json, Meta, Links, LiveReload, useRouteData } from "remix";
import { Outlet } from "react-router-dom";

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
    return json(
      {
        loggedIn: !!authToken,
      },
      {
        status: authToken ? 201 : 200,
      }
    );
  });
};

function Document({
  children,
  loggedIn,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
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
  const { loggedIn } = useRouteData();

  return (
    <Document loggedIn={loggedIn}>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document loggedIn={false}>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}
