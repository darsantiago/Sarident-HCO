#!/bin/bash

# Script para configurar la integración con Metrosalud
# Uso: ./scripts/setup-metrosalud.sh <URL_DEL_GOOGLE_APPS_SCRIPT>

set -e

echo "🔧 Configurador de Integración Metrosalud"
echo "========================================="
echo ""

# Verificar si se proporcionó la URL
if [ -z "$1" ]; then
  echo "❌ Error: Debes proporcionar la URL del Google Apps Script Web App"
  echo ""
  echo "Uso:"
  echo "  ./scripts/setup-metrosalud.sh <URL>"
  echo ""
  echo "Ejemplo:"
  echo "  ./scripts/setup-metrosalud.sh https://script.google.com/macros/s/AKfycby.../exec"
  echo ""
  echo "📖 Para obtener la URL, sigue la guía en: CONFIGURAR_METROSALUD.md"
  exit 1
fi

METROSALUD_URL="$1"

# Validar que la URL tenga el formato correcto
if [[ ! "$METROSALUD_URL" =~ ^https://script\.google\.com/macros/s/.*/exec$ ]]; then
  echo "⚠️  Advertencia: La URL no parece tener el formato correcto"
  echo "    Se esperaba: https://script.google.com/macros/s/.../exec"
  echo "    Recibido: $METROSALUD_URL"
  echo ""
  read -p "¿Continuar de todos modos? (s/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
  fi
fi

# Actualizar .env.local
echo "📝 Actualizando .env.local..."
if [ -f .env.local ]; then
  # Verificar si ya existe la variable
  if grep -q "VITE_METROSALUD_API_URL=" .env.local; then
    # Actualizar la variable existente (descomentada)
    sed -i "s|^#*\s*VITE_METROSALUD_API_URL=.*|VITE_METROSALUD_API_URL=$METROSALUD_URL|" .env.local
    echo "✅ Variable VITE_METROSALUD_API_URL actualizada en .env.local"
  else
    # Agregar la variable
    echo "" >> .env.local
    echo "# Metrosalud Google Apps Script Web App" >> .env.local
    echo "VITE_METROSALUD_API_URL=$METROSALUD_URL" >> .env.local
    echo "✅ Variable VITE_METROSALUD_API_URL agregada a .env.local"
  fi
else
  echo "⚠️  Archivo .env.local no encontrado, creando uno nuevo..."
  cat > .env.local <<EOF
# Metrosalud Google Apps Script Web App
VITE_METROSALUD_API_URL=$METROSALUD_URL
EOF
  echo "✅ Archivo .env.local creado"
fi

echo ""
echo "✅ Configuración local completada"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Reiniciar el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "2. Probar la sincronización:"
echo "   - Abrir http://localhost:5173"
echo "   - Ir a Sincronización"
echo "   - Click en 'Sincronizar Ahora'"
echo ""
echo "3. Configurar en Vercel (Producción):"
echo "   - Ir a: https://vercel.com/dashboard"
echo "   - Proyecto: Sarident-HCO"
echo "   - Settings → Environment Variables"
echo "   - Agregar:"
echo "     Name: VITE_METROSALUD_API_URL"
echo "     Value: $METROSALUD_URL"
echo "   - Hacer un redeploy"
echo ""
echo "📚 Documentación completa en:"
echo "   - CONFIGURAR_METROSALUD.md"
echo "   - METROSALUD_INTEGRATION.md"
echo ""
echo "🎉 ¡Listo!"
