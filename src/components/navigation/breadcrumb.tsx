"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useUserRole } from "@/src/hooks/use-user-role";

interface BreadcrumbProps {
  className?: string;
  homeHref?: string;
}

// Define route mappings for human-readable names
const routeLabels: Record<string, string> = {
  "buyer-home": "Home",
  "seller-home": "Home",
  marketplace: "Marketplace",
  products: "Products",
  orders: "Orders",
  wallet: "Wallet",
  profile: "Profile",
  cart: "Shopping Cart",
  checkout: "Checkout",
  product: "Product Details",
  "escrow-demo": "Escrow Demo",
};

// Define dashboard home routes based on role
const dashboardHomes: Record<string, string> = {
  buyer: "/buyer-home",
  seller: "/seller-home",
};

export function Breadcrumb({ className, homeHref }: BreadcrumbProps) {
  const pathname = usePathname();
  const { role } = useUserRole();

  // Skip rendering breadcrumbs on auth pages or root
  if (
    !pathname ||
    pathname === "/" ||
    pathname === "/select-role" ||
    pathname === "/profile-setup"
  ) {
    return null;
  }

  // Get the dashboard home based on role
  const dashboardHome = role ? dashboardHomes[role] : "/";
  const finalHomeHref = homeHref || dashboardHome || "/";

  // Split the path into segments and remove empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Don't show breadcrumbs if we're at the dashboard home
  if (pathname === dashboardHome) {
    return null;
  }

  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    // Build the href for this segment
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    // Get the label for this segment
    let label = routeLabels[segment] || segment;

    // Handle dynamic routes (e.g., /product/[id])
    if (segment.match(/^[0-9a-fA-F]+$/) && segments[index - 1] === "product") {
      label = "Product Details";
    }

    // Capitalize first letter if not found in routeLabels
    if (!routeLabels[segment]) {
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    return { href, label };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm", className)}
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href={finalHomeHref}
            className="text-muted-foreground hover:text-foreground flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <Fragment key={item.href}>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li>
              {index === breadcrumbItems.length - 1 ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
