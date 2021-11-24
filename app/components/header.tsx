import { Form, Link, useHref, useLocation } from "remix";

export default function Header({ loggedIn }: { loggedIn: boolean }) {
  const location = useLocation();
  const redirect = useHref(location);

  return (
    <header className="flex flex-wrap items-center max-w-2xl px-4 py-4 mx-auto mb-4">
      <Link
        to="/"
        className="inline-flex items-center p-2 pl-0 mr-2 hover:bg-yellow-100"
        aria-label="ebey.me"
      >
        <svg className="inline-block w-5 h-5 mr-3 bg-black">
          <path d="M0 0h19v19H0z" />
        </svg>
        <span className="hidden text-lg font-semibold sm:inline">ebey.me</span>
      </Link>

      <nav className="inline-flex items-center justify-end flex-grow">
        <Link
          className="p-2 mr-2 text-xs font-semibold text-gray-700"
          to="/events"
        >
          Events
        </Link>
        <a
          className="p-2 mr-2 text-xs font-semibold text-gray-700"
          href="https://github.com/jacob-ebey/ebey-me-remix"
        >
          Source
        </a>
        <a
          href="https://twitter.com/ebey_jacob"
          className="p-2 text-xs font-semibold text-white bg-black"
        >
          Follow Me
        </a>
        {loggedIn ? (
          <Form
            action={`/login?redirect=${redirect}`}
            method="post"
            className="inline-block"
          >
            <button
              type="submit"
              className="p-2 ml-2 text-xs font-semibold text-white bg-black"
            >
              Logout
            </button>
          </Form>
        ) : null}
      </nav>
    </header>
  );
}
