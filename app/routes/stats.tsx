import type { MetaFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";

import sanity from "../lib/sanity";
import Container from "../components/container";
import CountAPI from "../components/count-api";

export let meta: MetaFunction = () => {
  return {
    title: "ebey.me",
    description: "Welcome to my site!",
  };
};

export let loader: LoaderFunction = async () => {
  const posts =
    await sanity.fetch(`*[_type == "post"] | order(publishedAt desc) {
    "id": _id,
    slug,
    title,
    published,
  }[0...50]`);

  return { posts };
};

function homeCountCallback(args: any) {
  document.getElementById("homePageViews")!.innerText = `${args.value} views`;
}

export default function Index() {
  let data = useRouteData();

  return (
    <Container>
      <div className="mb-4 md:mb-2">
        <div className="inline-flex text-lg font-semibold md:p-2">
          <h1 className="mr-4">Home page</h1>
          <p id="homePageViews" className="font-light">
            <CountAPI method="get" countCallback={homeCountCallback} />
          </p>
        </div>
      </div>

      <ul>
        {data.posts.map((post: any) => {
          const id = "id" + post.id.replace(/-/g, "");
          const countCallback = new Function(
            "return function countCallback" +
              id +
              `(args){ if (args.code !== 200) return; document.getElementById(${JSON.stringify(
                id
              )}).innerText = "" + args.value + " views"; }`
          )();

          return (
            <li key={post.id} className="mb-4 md:mb-2">
              <div className="inline-flex text-lg font-semibold md:p-2">
                <h1 className="mr-4">{post.title}</h1>
                <p id={id} className="font-light">
                  <CountAPI
                    method="get"
                    identifier={
                      (post.published ? "" : "draft--") + post.slug.current
                    }
                    countCallback={countCallback}
                  />
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
