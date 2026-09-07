import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 70 = fond du hero (poids réduit), 75 = valeur par défaut de next/image ailleurs
    qualities: [70, 75],
    // Autorise le "?v=<date>" ajouté aux images de maillots/logo pour casser
    // le cache quand un fichier est remplacé sous le même nom (voir
    // resolve-maillot-images.ts). Restreint aux dossiers d'images locaux du
    // site, pas de chemin arbitraire.
    localPatterns: [
      { pathname: "/maillots/**" },
      { pathname: "/logos/**" },
      { pathname: "/logo-v2.png" },
      { pathname: "/uploads/**" },
    ],
    // Images des maillots "Pays/Nations" / "Autre" uploadées depuis l'admin,
    // hébergées sur Vercel Blob (voir actions.ts de /admin/products/custom).
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
