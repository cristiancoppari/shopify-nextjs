import { getMenu } from "~/lib/shopify";

import { NavbarClient } from "./navbar.client";

export default async function Navbar() {
  // key of the menu in Shopify
  const menu = await getMenu("nextjs-frontend-menu");

  return <NavbarClient items={menu} />;
}
