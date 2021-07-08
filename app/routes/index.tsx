import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { Link } from "react-router-dom";
import { format, parse } from "fecha";

import sanity from "../lib/sanity";
import Container from "../components/container";

export let meta: MetaFunction = () => {
  return {
    title: "ebey.me",
    description: "Welcome to my site!",
  };
};

export let loader: LoaderFunction = async () => {
  const posts = (
    await sanity.fetch(`*[_type == "post" && published == true] | order(publishedAt desc) {
    "id": _id,
    slug,
    title,
    publishedAt,
  }[0...50]`)
  ).map((post: any) => ({
    ...post,
    publishedAt:
      post.publishedAt &&
      format(parse(post.publishedAt, "isoDateTime")!, "MMMM Do, YYYY"),
  }));

  return { posts };
};

export default function Index() {
  let data = useRouteData();

  return (
    <Container>
      <ul>
        {data.posts.map((post: any) => (
          <li key={post.id} className="mb-4 md:mb-2">
            <span className="block font-light text-gray-500 md:inline-block text-base md:text-right md:pr-3 md:w-44">
              {post.publishedAt}
            </span>
            <Link
              to={`/blog/${post.slug.current}`}
              className="inline-block font-semibold text-lg text-indigo-600 transition-colors duration-200 ease-in-out md:p-2 hover:bg-gray-200"
            >
              <h1>{post.title}</h1>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
