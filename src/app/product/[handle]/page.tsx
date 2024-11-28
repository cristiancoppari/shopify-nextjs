import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ProductProvider } from "~/context/product-context";
import Gallery from "~/components/products/gallery";
import { getProduct, getProductRecommendations } from "~/lib/shopify";
import ProductDescription from "~/components/products/product-description";
import { GridTileImage } from "~/components/grid/grid-tile-image";

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const parameters = (await params) as { handle: string };
  const product = await getProduct(parameters.handle);

  if (!product) notFound();

  return (
    <ProductProvider>
      <div className="mx-auto px-4">
        <div className="flex flex-col rounded-lg border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense fallback={<div>Loading...</div>}>
              <Gallery
                images={product.images.slice(0, 5).map((image) => ({
                  url: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
          <div className="basis-full lg:basis-2/6">
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
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li key={product.id} className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/4 lg:w-1/5">
            <Link href={`/product/${product.handle}`} className="relative h-full w-full">
              <div className="flex h-full w-full items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 transition-colors hover:border-blue-600 dark:border-neutral-800 dark:bg-black">
                <GridTileImage
                  src={product.featuredImage.url}
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                  }}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
                <div className="ml-4 flex flex-col justify-between">
                  <h3 className="mb-2 text-lg font-medium">{product.title}</h3>
                  <p className="text-sm text-neutral-500">{product.priceRange.maxVariantPrice.amount}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
