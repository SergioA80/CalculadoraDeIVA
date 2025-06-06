import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "https://calculadora-de-iva.es",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
        "@/shortcodes/ExternalLink",
      ],
    }),
    mdx(),
  ],

   // *** ¡NUEVA SECCIÓN DE REDIRECCIONES! ***
  redirects: {
    '/iva-aceite-de-oliva-2024': '/iva-aceite-de-oliva', // Redirección 301 permanente por defecto
    'iva-de-la-luz-en-2024': 'iva-de-la-luz',
    'dia-sin-iva-en-mediamarkt-2024': 'dia-sin-iva-en-mediamarkt'
  },

  markdown: {
    remarkPlugins: [
      // *** CAMBIO CLAVE AQUÍ ***
      [remarkToc, { heading: 'Índice de Contenido' }], // <--- Ahora remarkToc buscará 'Contenido'
      // Y remarkCollapse seguirá buscando 'Table of contents' o 'Tabla de Contenido' (si lo cambiaste)
      [remarkCollapse, { test: "Índice de Contenido", summary: "Ver Índice"  }], // <--- Si quieres que sea colapsable y el título sea 'Tabla de Contenido'
    ],
    shikiConfig: { theme: "one-dark-pro", wrap: true },
    extendDefaultPlugins: true,
  },
});