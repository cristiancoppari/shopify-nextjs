import type { ElementType } from "react";

import { cva, type VariantProps } from "class-variance-authority";

const titleVariants = cva("font-bold text-gray-900", {
  variants: {
    size: {
      h1: "text-4xl md:text-5xl lg:text-6xl",
      h2: "text-3xl md:text-4xl lg:text-5xl",
      h3: "text-2xl md:text-3xl lg:text-4xl",
      h4: "text-xl md:text-xl lg:text-2xl font-normal",
    },
  },
  defaultVariants: {
    size: "h1",
  },
});

interface TitleProps extends VariantProps<typeof titleVariants> {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
}

export default function Title({ as, children, size, className }: TitleProps) {
  const Comp = as || (size as ElementType) || "h1";

  return <Comp className={titleVariants({ size, className })}>{children}</Comp>;
}
