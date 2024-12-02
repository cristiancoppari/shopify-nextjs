import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const paragraphVariants = cva("text-base leading-7", {
  variants: {
    variant: {
      default: "text-slate-700",
      muted: "text-slate-500",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof paragraphVariants> {}

export default function Paragraph({ className, variant, size, children, ...props }: ParagraphProps) {
  return (
    <p className={cn(paragraphVariants({ variant, size, className }))} {...props}>
      {children}
    </p>
  );
}
