import { cn } from "~/lib/utils";

export default function Prose({ className, html }: { className?: string; html: string }) {
  return (
    <div
      className={cn("prose mx-auto max-w-6xl text-base leading-7 text-black", className)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
