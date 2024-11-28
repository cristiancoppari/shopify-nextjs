"use client";

import { useProduct, useUpdateUrl } from "~/context/product-context";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { ProductOption, ProductVariant } from "~/lib/shopify/types";

type Combination = {
  id: string;
  isAvailableForSale: boolean;
  [key: string]: string | boolean;
};

export default function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateUrl();
  const hasNoOptionsOrJustOneOption = !options.length || (options.length === 1 && options[0].values.length === 1);

  const combinations: Combination[] = variants.map((variant) => {
    return {
      id: variant.id,
      isAvailableForSale: variant.availableForSale,
      ...variant.selectedOptions.reduce(
        (acc, option) => ({
          ...acc,
          [option.name.toLowerCase()]: option.value,
        }),
        {},
      ),
    };
  });

  return options.map((option) => {
    return (
      <form key={option.id}>
        <dl className="mb-8">
          <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
          <dd className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();

              // Base option params on current selectedOptions so we can preserve any other param state
              const optionParams = { ...state, [optionNameLowerCase]: value };

              // Filter out invalid options and check if the option combination is available for sale
              const filtered = Object.entries(optionParams).filter(([key, value]) =>
                options.find((option) => option.name.toLowerCase() === key && option.values.includes(value)),
              );

              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(([key, value]) => combination[key] === value && combination.isAvailableForSale),
              );

              // The options is active if it's in the selected options
              const isActive = state[optionNameLowerCase] === value;

              return (
                <Button
                  key={value}
                  disabled={!isAvailableForSale}
                  className={cn({
                    "ring-2 ring-black": isActive,
                    "cursor-not-allowed bg-neutral-100": !isAvailableForSale,
                  })}
                >
                  {value}
                </Button>
              );
            })}
          </dd>
        </dl>
      </form>
    );
  });
}
