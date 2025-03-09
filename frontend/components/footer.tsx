"use client"

import LogoWhite from "@/components/logo-white.png"
import Logo from "@/components/logo.png"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const { theme } = useTheme()
  return (
    <footer className="bg-card text-card-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
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
            <p className="text-muted-foreground mt-2">
              La plateforme des créateurs de formations
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="#features"
              className="hover:text-amber-700 transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#integrations"
              className="hover:text-amber-700 transition-colors"
            >
              Intégrations
            </Link>
            <Link
              href="mailto:contact@myui-training.com"
              className="hover:text-amber-700 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/mentions-legales"
              className="hover:text-amber-700 transition-colors"
            >
              Mentions légales
            </Link>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} MYUI Training. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
