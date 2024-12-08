"use client";

import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer";
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
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function NavbarClient({ items }: { items: Menu[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!isMobile) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref prefetch={true}>
              <NavigationMenuLink className={cn(buttonVariants(), "bg-black")}>Your Logo</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {items.map((item, i) => (
            <NavigationMenuItem key={i} className="relative">
              {item.items ? (
                <>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {item.items.map((subItem, j) => (
                      <ul key={j} className="w-[420px] gap-2 p-4">
                        <li className="grid grid-cols-[repeat(2,minmax(0,auto))] items-center justify-start gap-4">
                          {subItem.resource?.image && (
                            <Image
                              className="w-32 rounded-sm"
                              src={subItem.resource?.image?.url}
                              alt={subItem.resource?.title}
                              width={200}
                              height={200}
                            />
                          )}
                          <Link href={subItem.path} legacyBehavior passHref prefetch={true}>
                            <NavigationMenuLink className={(cn(navigationMenuTriggerStyle()), "flex flex-col gap-1")}>
                              <span className="font-semibold">{subItem.title}</span>
                              <span className="text-zinc-500">{subItem.resource?.description}</span>
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
  } else {
    return (
      <Drawer>
        <DrawerTrigger className={cn(buttonVariants(), "fixed bottom-8 right-4 h-14 w-14 rounded-full")}>
          <MenuIcon />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="mt-4">
            <DrawerTitle>Your logo here</DrawerTitle>
          </DrawerHeader>
          <ul className="space-y-4 p-8 text-lg">
            {items.map((item, i) => (
              <li key={i}>
                {item.items ? (
                  <>
                    <div className="font-medium">{item.title}</div>
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.items.map((subItem, j) => (
                        <li key={j}>
                          <Link href={subItem.path} prefetch={true}>
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.path} prefetch={true}>
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    );
  }
}
