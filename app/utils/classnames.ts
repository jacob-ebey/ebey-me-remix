export default function classnames(...classes: any[]) {
  return classes.filter((cn) => typeof cn === "string").join(" ");
}
