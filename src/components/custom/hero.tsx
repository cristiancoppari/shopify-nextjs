import Carousel from "~/components/custom/carousel";
import Title from "~/components/typography/title";
import Paragraph from "~/components/typography/paragraph";

export default function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section>
      <Carousel />

      <div className="container mx-auto flex flex-col gap-2 px-4 py-8 text-center">
        <Title>{title}</Title>
        <Paragraph>{subtitle}</Paragraph>
      </div>
    </section>
  );
}
