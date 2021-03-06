import type { HtmlMetaDescriptor, MetaFunction, LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";

import BlockContent from "~/components/block-content";
import Container from "~/components/container";
import CountAPI from "~/components/count-api";
import sanity from "~/lib/sanity";

export let meta: MetaFunction = ({ data }): HtmlMetaDescriptor => {
  if (!data) {
    return {
      title: "Uh oh",
    };
  }

  const title = `${data.event.title} | ebey.me`;
  return {
    title,
    description: data.event.description,
    "og:title": title,
    "og:description": data.event.description,
  };
};

export let loader: LoaderFunction = async ({ request, params: { slug } }) => {
  let url = new URL(request.url);
  url.search = "";
  let shareLink = url.toString();

  let event = await sanity.fetch(
    `*[_type == "event" && slug.current == $slug] {
        "id": _id,
            slug,
            title,
            date,
            time,
            published,
            body,
            location->{
              name,
              description,
              link,
            },
      }[0]`,
    { slug }
  );

  if (!event) {
    throw json(null, { status: 404 });
  }

  return json({
    shareLink,
    event,
  });
};

export default function BlogPost() {
  const data = useLoaderData();

  return (
    <>
      <Container>
        <h1 className="mb-1 text-2xl font-semibold lg:text-3xl">
          {!data.event.published ? <span>Draft: </span> : null}
          {data.event.title}
        </h1>
        <div className="flex flex-wrap items-center mb-8 text-sm text-gray-700">
          <span>{data.event.location.name}</span>
          <span className="mx-4 text-lg font-thin text-gray-400">/</span>
          <span className="flex-grow mr-2">{data.event.date}</span>
        </div>
        <article className="prose-lg">
          <section>
            <BlockContent blocks={data.event.body} />
          </section>
        </article>

        <h2 className="text-2xl font-semibold my-6">Details</h2>
        <div className="md:flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">Time</h3>
            <p>
              {data.event.date} @ {data.event.time}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Location</h3>
            <p>
              <a
                target="_blank"
                className="underline font-semibold"
                href={data.event.location.link}
              >
                {data.event.location.name}
              </a>
            </p>
          </div>
        </div>

        <div className="prose-lg my-6">
          <p>
            <a
              target="_blank"
              className="underline font-semibold"
              href={`http://twitter.com/intent/tweet?text=${encodeURIComponent(
                `I'll be attending ${data.event.title} @ ${data.event.location.name} with @ebey_jacob!\n\n${data.shareLink}`
              )}`}
            >
              Tweet me to let me know your coming!
            </a>
          </p>
        </div>
      </Container>

      <CountAPI
        identifier={
          (data.event.published ? "" : "draft--") +
          "event-" +
          data.event.slug.current
        }
      />
    </>
  );
}
