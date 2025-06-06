// report-tags-to-clean.js

import fs from 'fs/promises'; // Para leer archivos de forma asíncrona
import path from 'path'; // Para manejar rutas de archivos
import matter from 'gray-matter'; // Para parsear frontmatter

// Instala esta librería si no la tienes: pnpm add gray-matter

// --- CONFIGURACIÓN ---
const BLOG_CONTENT_PATH = './src/content/blog'; // Ruta a tus posts de blog
const MIN_POSTS_PER_TAG = 2; // Umbral: Los tags con menos de este número de posts serán candidatos a eliminar.
                           // Si pones 2, se eliminarán los tags con 1 solo post.
                           // Si pones 3, se eliminarán los tags con 1 o 2 posts.
// --------------------

async function generateTagReport() {
    console.log('Generando informe de tags para limpieza...');
    console.log(`Umbral de posts por tag para limpieza: ${MIN_POSTS_PER_TAG} o menos.`);

    // 1. Obtener todos los archivos Markdown y sus datos
    const postFileNames = await fs.readdir(BLOG_CONTENT_PATH);
    const markdownFiles = postFileNames.filter(name => name.endsWith('.md') || name.endsWith('.mdx'));

    const allPostsParsed = [];
    for (const fileName of markdownFiles) {
        const filePath = path.join(BLOG_CONTENT_PATH, fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(fileContent); // Solo necesitamos el frontmatter (data)

        allPostsParsed.push({
            filePath,
            fileName,
            title: data.title || fileName, // Título del post para el informe
            tags: data.tags || [] // Tags del post, si existen
        });
    }

    // 2. Contar las ocurrencias de cada tag a nivel global
    const globalTagCounts = new Map(); // Map: { 'tag-slug': count }
    allPostsParsed.forEach(post => {
        if (Array.isArray(post.tags)) { // Asegurarse de que 'tags' es un array
            post.tags.forEach(tag => {
                const tagLower = tag.toLowerCase(); // Normalizar a minúsculas para contar
                globalTagCounts.set(tagLower, (globalTagCounts.get(tagLower) || 0) + 1);
            });
        }
    });

    // 3. Identificar tags que serán eliminados (los que están por debajo del umbral)
    const tagsToBeRemovedGlobally = new Set();
    globalTagCounts.forEach((count, tagLower) => {
        if (count < MIN_POSTS_PER_TAG) {
            tagsToBeRemovedGlobally.add(tagLower);
        }
    });

    console.log('\n--- Resumen Global de Etiquetas y sus Cuentas ---');
    Array.from(globalTagCounts.entries())
        .sort((a, b) => b[1] - a[1]) // Ordenar por cuenta descendente
        .forEach(([tagLower, count]) => {
            const status = tagsToBeRemovedGlobally.has(tagLower) ? '(SE ELIMINARÁ GLOBALMENTE)' : '';
            console.log(`Tag: ${tagLower} | Posts: ${count} ${status}`);
        });
    console.log('---------------------------------------------------\n');

    if (tagsToBeRemovedGlobally.size === 0) {
        console.log(`¡Excelente! Ninguna etiqueta tiene menos de ${MIN_POSTS_PER_TAG} posts. No hay tags para eliminar.`);
        return;
    }

    console.log(`\n--- Informe Detallado por Post ---`);
    console.log(`Las etiquetas marcadas como "(Eliminar)" son aquellas que aparecen menos de ${MIN_POSTS_PER_TAG} veces en TODO el blog.`);
    console.log(`(Esto no modifica tus archivos. Es solo un informe para limpieza manual.)`);
    console.log('-----------------------------------\n');

    // 4. Generar el informe detallado por post
    let postsAffectedCount = 0;
    for (const post of allPostsParsed) {
        const originalTags = post.tags;
        if (!Array.isArray(originalTags) || originalTags.length === 0) {
            continue; // Saltar si el post no tiene tags
        }

        const tagsToKeep = [];
        const tagsFlaggedForRemoval = [];

        originalTags.forEach(tag => {
            const tagLower = tag.toLowerCase();
            if (tagsToBeRemovedGlobally.has(tagLower)) {
                tagsFlaggedForRemoval.push(tag);
            } else {
                tagsToKeep.push(tag);
            }
        });

        if (tagsFlaggedForRemoval.length > 0) {
            postsAffectedCount++;
            console.log(`Archivo: ${post.fileName} (Título: "${post.title}")`);
            console.log(`  Tags Originales: ${originalTags.join(', ')}`);
            console.log(`  Tags a Conservar: ${tagsToKeep.length > 0 ? tagsToKeep.join(', ') : '(Ninguna)'}`);
            console.log(`  Tags a Eliminar (de este post): ${tagsFlaggedForRemoval.join(', ')} (Eliminar)`);
            console.log('---');
        }
    }

    if (postsAffectedCount === 0) {
        console.log('No se encontraron posts que contengan las etiquetas a eliminar.');
    } else {
        console.log(`\n¡Informe completado! Total de posts afectados: ${postsAffectedCount}.`);
        console.log('Por favor, revisa el informe y realiza la limpieza en tus archivos Markdown manualmente.');
        console.log('---------------------------------------------------\n');
    }
}

// Ejecutar el script
generateTagReport().catch(console.error);