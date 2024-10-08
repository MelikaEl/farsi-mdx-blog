"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Span } from "next/dist/trace";

import BlogButton from "@/components/nav/blog-button";

import Image from "next/image";

const NavComponent: React.FC = () => {
  const direction = "rtl";

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="sm:flex gap-4 items-center hidden">
      <Link href="/">
      <div style={{ textAlign: 'center' }}>
        <Image
          src="/atripa.png"
          alt="Picture of the author"
          width={100}
          height={100}
        />
        <p>
        <span>وبلاگ </span>
        <span className="primary-color">آتریپا</span>
        </p>
        </div>
        </Link>
        {/*<div className="font-bold text-2xl tracking-tight">
          <Link className="pr-2" href="/">
            <span>وبلاگ </span>
            <span className="primary-color">آتریپا</span>
          </Link>
        </div>*/}
        <div className="flex gap-4 font-semibold">
          <Link className="text-sm" href="/blog">
            وبلاگ
          </Link>
          <Link className="text-sm" href="/about">
            درباره ما
          </Link>
        </div>
      </div>

      <button
        onClick={toggleMenu}
        className="sm:hidden"
        aria-label="Toggle Menu"
      >
        <HamburgerMenuIcon className="w-[32px] h-[32px]" />
      </button>

      {/* Mobile Side Menu */}
      <div
        ref={menuRef}
        className={`text-xl h-screen w-1/2 shadow-xl absolute top-0 ${
          direction === "rtl" ? "right-0" : "left-0"
        } bg-white dark:bg-background z-50 transform ${
          isMenuOpen
            ? "translate-x-0"
            : direction === "rtl"
            ? "translate-x-full"
            : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col gap-6 px-12 py-8 sm:hidden`}
      >
        <Link href="/" onClick={closeMenu}>
        <div style={{ textAlign: 'center' }}>
        <Image
          src="/atripa.png"
          alt="Picture of the author"
          width={100}
          height={100}
        />
        <p>
        <span>وبلاگ </span>
        <span className="primary-color">آتریپا</span>
        </p>
        </div>
        </Link>
        <Link href="/blog" onClick={closeMenu}>
          وبلاگ
        </Link>
        <Link href="/about" onClick={closeMenu}>
          درباره ما
        </Link>
        <Link href="/contact" onClick={closeMenu}>
          تماس با ما
        </Link>
        {/* Add other mobile navigation links here, each with onClick={closeMenu} */}
      </div>
    </div>
  );
};

export default NavComponent;
