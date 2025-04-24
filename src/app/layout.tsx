import type React from "react";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";
import BottomNav from "@/src/components/layout/bottom-nav";
import { UserRoleProvider } from "@/src/hooks/use-user-role";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import { CartProvider } from "@/src/hooks/use-cart";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Farm Marketplace",
  description: "Decentralized marketplace for agricultural products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.className} min-h-screen flex flex-col bg-[url('/subtle-texture.png')] bg-repeat`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserRoleProvider>
            <CartProvider>
              <ProtectedRoute requireAuth={false}>
                <main className="flex-1 container mx-auto px-4 pb-20">
                  {children}
                </main>
                <BottomNav />
              </ProtectedRoute>
            </CartProvider>
          </UserRoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
