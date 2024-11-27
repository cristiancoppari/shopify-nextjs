import Link from "next/link";

import { getMenu } from "~/lib/shopify";

export default async function Footer() {
  const menu = await getMenu("nextjs-footer-menu");

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav aria-label="Footer" className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
          {menu.map((item) => (
            <Link key={item.title} href={item.path} className="text-gray-400 hover:text-white">
              {item.title}
            </Link>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm/6 text-gray-400">&copy; 2024 Desarrollador Web.</p>
      </div>
    </footer>
  );
}
