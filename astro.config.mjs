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
    sitemap({
      filter: (page) => 
        page !== 'https://calculadora-de-iva.es/autor/-index' &&
        page !== 'https://calculadora-de-iva.es/autor/javier-rodriguez-perez' &&
        page !== 'https://calculadora-de-iva.es/aviso-legal' &&
        page !== 'https://calculadora-de-iva.es/politica-de-cookies' &&
        page !== 'https://calculadora-de-iva.es/politica-de-privacidad' &&
        page !== 'https://calculadora-de-iva.es/categories/iva' &&
        page !== 'https://calculadora-de-iva.es/contacto' &&
        page !== 'https://calculadora-de-iva.es/sobre-nosotros' &&
        page !== 'https://calculadora-de-iva.es/tags/*' &&
        page !== 'https://calculadora-de-iva.es/tags/autonomos-espana' &&
page !== 'https://calculadora-de-iva.es/tags/calculo-iva' &&
page !== 'https://calculadora-de-iva.es/tags/cesta-de-la-compra' &&
page !== 'https://calculadora-de-iva.es/tags/dia-sin-iva' &&
page !== 'https://calculadora-de-iva.es/tags/FFindex' &&
page !== 'https://calculadora-de-iva.es/tags/fiscalidad' &&
page !== 'https://calculadora-de-iva.es/tags/fiscalidad-espana' &&
page !== 'https://calculadora-de-iva.es/tags/guia-iva' &&
page !== 'https://calculadora-de-iva.es/tags/impuesto-sobre-el-valor-anadido' &&
page !== 'https://calculadora-de-iva.es/tags/impuestos-alimentacion' &&
page !== 'https://calculadora-de-iva.es/tags/impuestos-espana' &&
page !== 'https://calculadora-de-iva.es/tags/impuestos-turistas-espana' &&
page !== 'https://calculadora-de-iva.es/tags/inversion-sujeto-pasivo' &&
page !== 'https://calculadora-de-iva.es/tags/iva' &&
page !== 'https://calculadora-de-iva.es/tags/iva-4' &&
page !== 'https://calculadora-de-iva.es/tags/iva-10' &&
page !== 'https://calculadora-de-iva.es/tags/iva-2025' &&
page !== 'https://calculadora-de-iva.es/tags/iva-alimentos' &&
page !== 'https://calculadora-de-iva.es/tags/iva-autonomos' &&
page !== 'https://calculadora-de-iva.es/tags/iva-construccion' &&
page !== 'https://calculadora-de-iva.es/tags/iva-general' &&
page !== 'https://calculadora-de-iva.es/tags/iva-intracomunitario' &&
page !== 'https://calculadora-de-iva.es/tags/iva-reducido' &&
page !== 'https://calculadora-de-iva.es/tags/iva-superreducido' &&
page !== 'https://calculadora-de-iva.es/tags/modelo-303' &&
page !== 'https://calculadora-de-iva.es/tags/obligaciones-fiscales' &&
page !== 'https://calculadora-de-iva.es/tags/porcentaje-iva' &&
page !== 'https://calculadora-de-iva.es/tags/precios-alimentos' &&
page !== 'https://calculadora-de-iva.es/tags/sujeto-pasivo-iva' &&
page !== 'https://calculadora-de-iva.es/tags/tipos-de-iva'
    }),
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