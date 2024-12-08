import { Navbar } from "~/components/layout/navbar/navbar";
import CartModal from "~/components/cart/modal";
import Search from "~/components/layout/navbar/search";

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-10 flex w-full items-center bg-white p-4 shadow-sm md:justify-center lg:justify-between">
      <Navbar />

      <div className="flex w-full gap-x-4 md:w-1/2 lg:w-2/3 lg:justify-end xl:justify-between">
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
