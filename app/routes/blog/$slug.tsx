import type { MetaFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { format, parse } from "fecha";

import BlockContent from "../../components/block-content";
import Container from "../../components/container";
import CountAPI from "../../components/count-api";
import sanity from "../../lib/sanity";

export let meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.post.title} | ebey.me`,
    description: data.post.description,
  };
};

export let loader: LoaderFunction = async ({ params: { slug } }) => {
  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug] {
      "id": _id,
      slug,
      title,
      description,
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

  return {
    post: {
      ...post,
      publishedAt:
        post.publishedAt &&
        format(parse(post.publishedAt, "isoDateTime")!, "MMMM Do, YYYY"),
    },
  };
};

function countCallback(r: any) {
  var e = document.getElementById("view-count");
  if (r && r.value && e) {
    e.innerText = String(r.value) + " views";
  }
}

export default function BlogPost() {
  let data = useRouteData();

  return (
    <>
      <Container>
        <h1 className="mb-1 text-2xl lg:text-3xl font-semibold">
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
        </article>
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
