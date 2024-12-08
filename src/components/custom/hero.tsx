import Title from "~/components/typography/title";
import Paragraph from "~/components/typography/paragraph";
import Carousel from "~/components/custom/carousel";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-8 mt-24">
        <Title as="h1" size="h2" className="mb-2">
          Bienvenido a nuestra tienda
        </Title>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor.
        </Paragraph>
      </div>

      <Carousel />
    </section>
  );
}
