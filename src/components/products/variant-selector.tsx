"use client";

import { useProduct, useUpdateUrl } from "~/context/product.context";
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

  if (hasNoOptionsOrJustOneOption) return;

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

  console.log({ options });

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

              // Filter out invalid options and check if the options combination is available for sale
              const filtered = Object.entries(optionParams).filter(([key, value]) =>
                options.find((option) => option.name.toLowerCase() === key && option.values.includes(value)),
              );

              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(([key, value]) => combination[key] === value && combination.isAvailableForSale),
              );

              // The option is active if it's in the selected options
              const isActive = state[optionNameLowerCase] === value;

              return (
                <Button
                  formAction={() => {
                    const newState = updateOption(optionNameLowerCase, value);
                    updateURL(newState);
                  }}
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                  className={cn("flex min-w-[48px] items-center justify-center rounded-full border px-2 py-1 text-sm", {
                    "cursor-default ring-2 ring-blue-600": isActive,
                    "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600":
                      !isActive && isAvailableForSale,
                    "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                      !isAvailableForSale,
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
