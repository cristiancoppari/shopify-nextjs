import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { ProductProvider } from "~/context/product.context";
import { ProductsCarousel } from "~/components/products/carousel";
import Gallery from "~/components/products/gallery";
import { getProduct, getProductRecommendations } from "~/lib/shopify";
import ProductDescription from "~/components/products/product-description";
import { HIDDEN_PRODUCT_TAG } from "~/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const paramsStore = await params;
  const product = await getProduct(paramsStore.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const parameters = await params;
  const product = await getProduct(parameters.handle);

  if (!product) notFound();

  return (
    <ProductProvider>
      <div className="mx-auto mt-24 px-4">
        <div className="flex flex-col rounded-lg border-neutral-200 bg-white md:py-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full overflow-hidden rounded-lg lg:basis-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <Gallery
                images={product.images.slice(0, 5).map((image) => ({
                  url: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
          <div className="basis-full lg:basis-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>

        <RelatedProducts id={product.id} />
      </div>
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts) return;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Productos relacionados</h2>

      <ProductsCarousel items={relatedProducts} />
    </div>
  );
}
