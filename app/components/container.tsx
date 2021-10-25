import type { FC, ComponentProps } from "react";
import cn from "../utils/classnames";

export type ContainerProps<TTag extends keyof JSX.IntrinsicElements = "main"> =
  {
    tag?: TTag;
  } & ComponentProps<TTag>;

const Container: FC<ContainerProps> = ({
  tag: Tag = "main",
  className,
  ...props
}) => <Tag {...props} className={cn("max-w-2xl px-4 mx-auto mb-6")} />;

export default Container;

