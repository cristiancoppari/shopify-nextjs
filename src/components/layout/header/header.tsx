import { Navbar } from "~/components/layout/navbar/navbar";
import CartModal from "~/components/cart/modal";
import Search from "~/components/layout/navbar/search";

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-10 flex w-full items-center justify-between bg-white p-4 shadow-sm">
      <div className="lg:w-1/3">
        <Navbar />
      </div>
      <div className="flex w-1/2 md:justify-end lg:w-2/3 xl:justify-between">
        <div className="w-full lg:w-1/2">
          <Search />
        </div>
        <div>
          <CartModal />
        </div>
      </div>
    </header>
  );
}
