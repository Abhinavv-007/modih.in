import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://modih.in/",
      lastModified: new Date()
    },
    {
      url: "https://modih.in/feed",
      lastModified: new Date()
    },
    {
      url: "https://modih.in/explore",
      lastModified: new Date()
    }
  ];
}
