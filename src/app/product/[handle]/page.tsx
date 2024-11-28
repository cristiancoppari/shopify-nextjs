import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProductProvider } from "~/context/product-context";
import Gallery from "~/components/products/gallery";
import { getProduct } from "~/lib/shopify";

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
          {/* <div className="basis-full lg:basis-2/6">
          <ProductDescription />
        </div> */}
        </div>

        {/* <RelatedProducts /> */}
      </div>
    </ProductProvider>
  );
}
