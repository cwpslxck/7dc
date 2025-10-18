"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/constants/items";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const timeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className={cn(
          `flex z-50 overflow-hidden flex-col w-full absolute top-0 right-0 left-0`,
          isMenuOpen ? "bg-transparent" : "bg-zinc-200/50 backdrop-blur-xl"
        )}
      >
        <div
          dir="ltr"
          className="flex mx-auto container items-center h-16 w-full justify-between px-4"
        >
          <div className="inline-flex gap-2 items-center">
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="flex flex-col gap-1 p-2 cursor-pointer"
              aria-label="Menu"
            >
              <span
                className={`w-6 h-0.5 bg-black rounded-full origin-center transition-transform duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-0.5" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-black rounded-full origin-center transition-transform duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </button>
          </div>
          <div className="inline-flex items-center text-sm gap-3">
            <Link href={"https://github.com/cwpslxck"}></Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xl"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          <div
            className={`absolute top-0 left-0 right-0 w-full transition-transform container mx-auto duration-200 ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex flex-col max-w-md mx-auto px-6 pt-20 gap-2">
              {MENU_ITEMS.map((item, i) => {
                const isCurrentPage = item.href === pathname;

                return isCurrentPage ? (
                  <button
                    key={i}
                    onClick={() =>
                      setTimeout(() => {
                        setIsMenuOpen(false);
                      }, 200)
                    }
                    className="flex items-center hover:bg-white/5 rounded-md transition-colors w-full justify-center gap-2 text-white text-lg font-medium py-2 hoveranim"
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center hover:bg-white/5 rounded-md transition-colors w-full justify-center gap-2 text-white text-lg font-medium py-2 hoveranim"
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
