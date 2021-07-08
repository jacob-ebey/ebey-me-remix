// @ts-ignore
import { name } from "../../package.json";

const env = process.env.NODE_ENV || "development";

function dCountCallback() {}

export type CountAPIProps = {
  identifier?: string;
  method?: "hit" | "get";
  countCallback?: (r: any) => void;
};

export default function CountAPI({
  identifier = "",
  countCallback = dCountCallback,
  method = "hit"
}: CountAPIProps) {
  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html:
          typeof window === "undefined"
            ? `
              <script>${countCallback.toString()}</script>
              <script async="" src=${JSON.stringify(
                `https://api.countapi.xyz/${method}/${name}${
                  env === "production" ? "" : `-${env}`
                }/${identifier}${
                  countCallback ? `?callback=${countCallback.name}` : ""
                }`
              )}></script>
            `
            : " ",
      }}
    />
  );
}
