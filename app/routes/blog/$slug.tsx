import { MetaFunction, LoaderFunction, json } from "remix";
import { useRouteData } from "remix";
import { useLocation } from "react-router-dom";
import { format, parse } from "fecha";

import BlockContent from "../../components/block-content";
import Container from "../../components/container";
import CountAPI from "../../components/count-api";
import sanity from "../../lib/sanity";
import { withAuthToken } from "../../lib/request";

import GitHubLoginButton from "../../components/github-login-button";

export let meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.post.title} | ebey.me`,
    description: data.post.description,
  };
};

export let loader: LoaderFunction = async ({ request, params: { slug } }) => {
  return withAuthToken(request.headers.get("Cookie"))(async (authToken) => {
    const url = new URL(
      request.url.replace("://localhost/", "://localhost:3000/")
    );
    url.pathname = "";
    url.search = "";
    const basePath = url.toString();

    let post = await sanity.fetch(
      `*[_type == "post" && slug.current == $slug] {
        "id": _id,
        slug,
        title,
        description,
        paywall,
        published,
        publishedAt,
        body,
        categories []->{
          _id,
          title,
        },
      }[0]`,
      { slug }
    );

    let authorized = false;
    if (post.paywall && authToken) {
      const res = await fetch(
        "https://api.github.com/user/following/jacob-ebey",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${authToken}`,
          },
        }
      );

      authorized = res.ok;
    }

    if (post.paywall && !authorized) {
      post.body = post.body.slice(0, 2);
    }

    return json({
      basePath,
      authorized,
      loggedIn: !!authToken,
      post: {
        ...post,
        publishedAt:
          post.publishedAt &&
          format(parse(post.publishedAt, "isoDateTime")!, "MMMM Do, YYYY"),
      },
    });
  });
};

function countCallback(r: any) {
  var e = document.getElementById("view-count");
  if (r && r.value && e) {
    e.innerText = String(r.value) + " views";
  }
}

export default function BlogPost() {
  const data = useRouteData();
  const location = useLocation();

  const paywallBlock = !data.authorized && data.post.paywall;

  return (
    <>
      <Container>
        <h1 className="mb-1 text-2xl font-semibold lg:text-3xl">
          {!data.post.published ? <span>Draft: </span> : null}
          {data.post.title}
        </h1>
        <div className="flex flex-wrap items-center mb-8 text-sm text-gray-700">
          <a
            className="inline-flex items-center"
            href="https://twitter.com/ebey_jacob"
            title="Check me out on twitter"
          >
            <img
              alt=""
              className="w-6 h-6 mr-2 rounded-full"
              src="https://pbs.twimg.com/profile_images/1253463555388530689/TWhkn5IZ_x96.jpg"
            />
            <span>ebey_jacob</span>
          </a>
          <span className="mx-4 text-lg font-thin text-gray-400">/</span>
          <span className="flex-grow mr-2">{data.post.publishedAt}</span>
          <span id="view-count" className="hidden md:inline" />
        </div>
        <article className="prose-lg">
          <BlockContent blocks={data.post.body} />
          {paywallBlock ? <p>....</p> : null}
        </article>
        {paywallBlock ? (
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 transform -skew-y-6 shadow-lg bg-gradient-to-r from-blue-300 to-blue-600 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <div className="max-w-md mx-auto">
                <div>
                  <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
                    Oops, looks like you don't have access.
                  </h2>
                  <p className="mb-4 text-lg">
                    If you wish to read this article, please login and make sure
                    you follow me on GitHub.
                  </p>
                  {data.loggedIn ? (
                    <p>
                      Follow me{" "}
                      <a href="https://github.com/jacob-ebey/">@jacob-ebey</a>{" "}
                      on GitHub.
                    </p>
                  ) : (
                    <GitHubLoginButton
                      className="p-2 text-xs font-semibold text-white bg-black"
                      basePath={data.basePath}
                      redirect={location}
                    >
                      Login with GitHub
                    </GitHubLoginButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>

      <CountAPI
        countCallback={countCallback}
        identifier={
          (data.post.published ? "" : "draft--") + data.post.slug.current
        }
      />
    </>
  );
}
