import type { MetaFunction, LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";

import sanity from "~/lib/sanity";
import Container from "~/components/container";
import CountAPI from "~/components/count-api";

export let meta: MetaFunction = () => {
  return {
    title: "events | ebey.me",
    description: "Checkout upcoming events that I'm hosting!",
  };
};

export let loader: LoaderFunction = async () => {
  const events = (
    await sanity.fetch(`*[_type == "event" && published == true] | order(date desc) {
      "id": _id,
      slug,
      title,
      date,
      location->{
        name,
        description,
      },
    }[0...50]`)
  ).map((event: any) => ({
    ...event,
    date: event.date,
  }));

  return { events };
};

export default function Index() {
  let data = useLoaderData();

  return (
    <>
      <Container>
        <ul>
          {data.events.map((event: any) => (
            <li key={event.id} className="mb-4 md:mb-2">
              <span className="block text-base font-light text-gray-500 md:inline-block md:text-right md:pr-3 md:w-44">
                {event.date}
              </span>
              <Link
                to={`/events/${event.slug.current}`}
                className="inline-block text-lg font-semibold text-indigo-600 transition-colors duration-200 ease-in-out md:p-2 hover:bg-gray-200"
              >
                <h1>{event.title}</h1>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <CountAPI identifier="events" />
    </>
  );
}
