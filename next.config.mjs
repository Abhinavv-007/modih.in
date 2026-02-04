/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.ytimg.com",
      "img.youtube.com",
      "i.redd.it",
      "external-preview.redd.it",
      "p16-sign-va.tiktokcdn.com",
      "p16-sign.tiktokcdn-us.com",
      "instagram.fmaa1-1.fna.fbcdn.net",
      "scontent.cdninstagram.com",
      "scontent.xx.fbcdn.net",
      "platform-lookaside.fbsbx.com"
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.tiktok.com https://www.reddit.com https://www.instagram.com https://www.facebook.com; frame-src https://www.youtube.com https://www.tiktok.com https://www.reddit.com https://www.instagram.com https://www.facebook.com; connect-src 'self' https://www.googleapis.com https://firestore.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
