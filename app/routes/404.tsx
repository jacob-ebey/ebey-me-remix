import type { MetaFunction } from "remix";
import Container from "~/components/container";

export let meta: MetaFunction = () => {
  return { title: "Ain't nothing here" };
};

export default function FourOhFour() {
  return (
    <Container>
      <h1 className="text-2xl lg:text-3xl">
        404 Page Not Found
      </h1>
    </Container>
  );
}
