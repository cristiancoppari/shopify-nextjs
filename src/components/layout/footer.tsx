import Link from "next/link";

import { getMenu } from "~/lib/shopify";

export default async function Footer() {
  const navMenu = getMenu("nextjs-frontend-menu");
  const footerMenu = getMenu("nextjs-footer-menu");

  const [nav, footer] = await Promise.all([navMenu, footerMenu]);
  const menu = [...nav, ...footer];

  return (
    <footer className="bg-zinc-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 lg:px-8">
        <nav
          aria-label="Footer"
          className="flex flex-col flex-wrap items-center justify-center gap-4 py-8 text-sm/6 md:flex-row md:gap-8"
        >
          {menu.map((item) => (
            <Link key={item.title} href={item.path} className="text-lg text-zinc-100 hover:text-white">
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="bg-zinc-100 py-4 text-center text-sm text-black">
        <p className="mb-2">&copy; Plataforma de E-commerce desarrollada con Shopify y Next.js</p>
        <p className="text-[12px]">
          Desarrollada por{" "}
          <a href="https://desarrolladorweb.com.ar" className="underline underline-offset-2">
            desarrolladorweb.com.ar
          </a>
        </p>
      </div>
    </footer>
  );
}
