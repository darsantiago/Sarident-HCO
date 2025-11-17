#!/bin/bash

# Script para generar iconos PWA placeholder
# En producción, estos deberían ser reemplazados con iconos profesionales

SIZES=(72 96 128 144 152 192 384 512)
OUTPUT_DIR="public"

# Crear SVG base (logo simple)
cat > /tmp/icon-base.svg << 'SVGEOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3b82f6"/>
  <g transform="translate(256,256)">
    <path d="M-60,-80 L60,-80 L60,0 L30,0 L30,60 L-30,60 L-30,0 L-60,0 Z" fill="white" stroke="white" stroke-width="8"/>
    <circle cx="0" cy="-40" r="20" fill="white"/>
  </g>
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">HC</text>
</svg>
SVGEOF

echo "Generando iconos PWA..."

# Nota: En un entorno real, usar ImageMagick o similar
# Para este script, creamos archivos placeholder
for size in "${SIZES[@]}"; do
    # Crear un placeholder simple (en producción usar convert de ImageMagick)
    cp /tmp/icon-base.svg "${OUTPUT_DIR}/icon-${size}x${size}.svg"
    echo "Creado icon-${size}x${size}.svg (placeholder)"
done

# Favicon
cp /tmp/icon-base.svg "${OUTPUT_DIR}/favicon.svg"

echo "¡Iconos generados! IMPORTANTE: Reemplazar con iconos profesionales antes de producción."
echo "Sugerencia: Usar https://realfavicongenerator.net/ para generar iconos profesionales"

