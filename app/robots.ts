import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/account",
          "/account/",
          "/account/*",
          "/checkout",
          "/checkout/",
          "/checkout/*",
          "/cart",
          "/cart/",
          "/wishlist",
          "/wishlist/",
          "/login",
          "/login/",
          "/register",
          "/register/",
          "/forgot-password",
          "/forgot-password/",
          "/reset-password",
          "/reset-password/",
          "/search",
          "/search/",
          "/api/",
          "/api/*",
        ],
      },
    ],
    sitemap: "https://baundule.com/sitemap.xml",
  };
}
