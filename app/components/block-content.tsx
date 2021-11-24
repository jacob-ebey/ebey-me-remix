import { Link } from "remix";
// @ts-expect-error
import SanityBlockContent from "@sanity/block-content-to-react";
import Highlight, { defaultProps } from "prism-react-renderer";
import prismTheme from "prism-react-renderer/themes/vsLight";

import cn from "../utils/classnames";

const serializers = {
  unknownTypes: ["code"],
  marks: {
    link: (props: any) => {
      const classNames = "underline font-semibold";
      if (props.mark.href && props.mark.href.startsWith("local:")) {
        return (
          <Link
            className={classNames}
            to={props.mark.href.replace(/^local:/, "")}
          >
            {props.children}
          </Link>
        );
      }
      return (
        <a className={classNames} href={props.mark.href}>
          {props.children}
        </a>
      );
    },
  },
  types: {
    code: (props: any) => {
      return (
        <Highlight
          {...defaultProps}
          theme={prismTheme}
          code={props.node.source}
          language={props.node.language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(
                className,
                "block overflow-x-auto border border-black p-4 mb-4"
              )}
              style={style}
            >
              <code className="block w-full">
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i });
                  return (
                    <div
                      {...lineProps}
                      className={cn(lineProps.className, "block w-full")}
                    >
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      );
    },
  },
};

export default function BlockContent({ blocks }: { blocks: any[] }) {
  return <SanityBlockContent blocks={blocks} serializers={serializers} />;
}
