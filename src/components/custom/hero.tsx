import Carousel from "~/components/custom/carousel";
import Title from "~/components/typography/title";

export function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section>
      <Carousel />

      <div className="container mx-auto flex flex-col gap-2 px-4 py-8 text-center">
        <Title>{title}</Title>
        <Title as="p" size={"h4"}>
          {subtitle}
        </Title>
      </div>
    </section>
  );
}
