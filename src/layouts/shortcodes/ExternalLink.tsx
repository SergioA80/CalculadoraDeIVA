// src/layouts/shortcodes/ExternalLink.tsx

import React from 'react';

/**
 * Componente ExternalLink para enlaces salientes.
 *
 * Este shortcode (`<ExternalLink />`) se usa en archivos Markdown/MDX para crear enlaces
 * externos, asegurando que tengan `target="_blank"` y `rel="noopener noreferrer"` por defecto.
 *
 * @param {string} href - La URL a la que apunta el enlace. Obligatorio.
 * @param {boolean} [nofollow] - Si es `true`, añade `rel="nofollow"`. Por defecto es `false` (follow).
 * @param {string} [rel] - Atributo `rel` personalizado. Sobrescribe `nofollow` y `noopener noreferrer`.
 * @param {string} [target] - Atributo `target` personalizado. Por defecto es `_blank`.
 * @example
 * // Uso básico (follow por defecto):
 * <ExternalLink href="https://ejemplo.com">Mi Sitio</ExternalLink>
 *
 * @example
 * // Enlace con 'nofollow' explícito:
 * <ExternalLink href="https://ejemplo.com/no-seguir" nofollow={true}>No Seguir Este Enlace</ExternalLink>
 *
 * @example
 * // Enlace con 'follow' (por defecto, o explícito):
 * <ExternalLink href="https://ejemplo.com/seguir" nofollow={false}>Seguir Este Enlace</ExternalLink>
 *
 * @example
 * // Enlace con un 'rel' personalizado (ej. sponsored):
 * <ExternalLink href="https://ejemplo.com/patrocinado" rel="sponsored">Enlace Patrocinado</ExternalLink>
 */
interface ExternalLinkProps {
  href: string;
  nofollow?: boolean; 
  rel?: string; 
  target?: string;
  children?: React.ReactNode; 
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ 
  href, 
  nofollow, 
  rel: customRel, 
  target: customTarget,
  children 
}) => {
  const defaultTarget = '_blank';
  const defaultRel = 'noopener noreferrer'; 

  let finalRel = defaultRel;

  if (nofollow === true) {
    finalRel = `${defaultRel} nofollow`;
  } else if (customRel) {
    finalRel = customRel;
  }

  const finalTarget = customTarget || defaultTarget;

  return (
    <a href={href} target={finalTarget} rel={finalRel}>
      {children}
    </a>
  );
};

export default ExternalLink;