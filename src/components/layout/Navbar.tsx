import Link from "next/link";
import { ShanyraqMark } from "../ui/heritage/ShanyraqMark";
import { KazakhOrnament } from "../ui/heritage/KazakhOrnament";
import { MobileMenu } from "./MobileMenu";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b border-gold/10 h-20 sticky top-0 z-50 bg-background/70 backdrop-blur-xl flex justify-center transition-colors duration-500">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('/textures/sand.png')] mix-blend-overlay" />

      <div className="w-full max-w-7xl flex justify-between items-center px-6 relative z-10">
        {/* LOGO */}
        <div className="flex gap-8 items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <ShanyraqMark
              size="sm"
              className="text-gold group-hover:rotate-90 transition-transform duration-700"
            />
            <span className="font-display text-2xl tracking-widest text-foreground uppercase group-hover:text-gold transition-colors duration-300">
              ULY DALA
            </span>
          </Link>

          <div className="hidden md:flex gap-1 items-center ml-4">
            <NavLink href="/games">ОЙЫНДАР</NavLink>
            <span className="text-gold/30 px-2">
              <KazakhOrnament
                variant="geometric"
                animate="spin"
                className="w-2 h-2 opacity-50"
              />
            </span>
            <NavLink href="/map">ҚАЗАҚСТАН</NavLink>
            <span className="text-gold/30 px-2">
              <KazakhOrnament
                variant="geometric"
                animate="spin"
                className="w-2 h-2 opacity-50"
              />
            </span>
            <NavLink href="/culture">МҰРА</NavLink>
            <span className="text-gold/30 px-2">
              <KazakhOrnament
                variant="geometric"
                animate="spin"
                className="w-2 h-2 opacity-50"
              />
            </span>
            <NavLink href="/kyzylorda-museum">ҚЫЗЫЛОРДА</NavLink>
          </div>
        </div>

        {/* ACTIONS & MOBILE MENU */}
        <div className="flex gap-4 items-center">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-foreground/70 hover:text-gold font-heading text-xs uppercase tracking-widest px-3 py-2 transition-colors duration-300 relative group"
    >
      {children}
      <span className="absolute bottom-0 left-1/2 w-0 h-px bg-gold group-hover:w-1/2 transition-all duration-300 -translate-x-1/2 opacity-50" />
    </Link>
  );
}
