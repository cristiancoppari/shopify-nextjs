"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Menu } from "~/lib/shopify/types";
import { cn } from "~/lib/utils";

export function NavbarClient({ items }: { items: Menu[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item, i) => (
          <NavigationMenuItem key={i}>
            {item.items ? (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.items.map((subItem, j) => (
                    <ul key={j} className="grid w-[200px] gap-2 p-2">
                      <li>
                        <Link href={subItem.path} legacyBehavior passHref prefetch={true}>
                          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full")}>
                            {subItem.title}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.path} legacyBehavior passHref prefetch={true}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
