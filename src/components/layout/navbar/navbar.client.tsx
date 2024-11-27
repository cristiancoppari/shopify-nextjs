"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Menu } from "~/lib/shopify/types";

export function NavbarClient({ items }: { items: Menu[] }) {
  return (
    <NavigationMenu className="mx-auto py-4">
      <NavigationMenuList>
        {items.map((item, i) => (
          <NavigationMenuItem key={i}>
            <Link href={item.path} legacyBehavior passHref prefetch={true}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
