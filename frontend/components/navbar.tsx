"use client"

import LogoWhite from "@/components/logo-white.png"
import Logo from "@/components/logo.png"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <nav className="bg-background/80 backdrop-blur-md fixed w-full z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              {theme === "dark" ? (
                <Image
                  src={LogoWhite}
                  alt="logo"
                  className="w-44"
                  quality={100}
                  draggable={false}
                />
              ) : (
                <Image
                  src={Logo}
                  alt="logo"
                  className="w-44"
                  quality={100}
                  draggable={false}
                />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-foreground/80 hover:text-amber-500 transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#integrations"
              className="text-foreground/80 hover:text-amber-500 transition-colors"
            >
              Intégrations
            </Link>
            <Link
              href="#waitlist"
              className="text-foreground/80 hover:text-amber-500 transition-colors"
            >
              Liste d&lsquo;attente
            </Link>
            <Link href="/login">
              <Button className="bg-amber-500 hover:bg-amber-700 text-white">
                Espace membre
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-amber-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-background">
            <div className="flex flex-col space-y-4 px-2 pb-3 pt-2">
              <Link
                href="#features"
                className="text-foreground/80 hover:text-amber-500 transition-colors px-3 py-2"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#integrations"
                className="text-foreground/80 hover:text-amber-500 transition-colors px-3 py-2"
              >
                Intégrations
              </Link>
              <Link
                href="#waitlist"
                className="text-foreground/80 hover:text-amber-500 transition-colors px-3 py-2"
              >
                Liste d&lsquo;attente
              </Link>
              <Link href="/login">
                <Button className="bg-amber-500 hover:bg-amber-700 text-white">
                  Espace membre
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
