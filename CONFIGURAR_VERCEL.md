# 🚀 Configurar Variable de Entorno en Vercel

Ya configuramos la URL de Metrosalud localmente. Ahora solo falta configurarla en Vercel para producción.

## Pasos Rápidos (3 minutos)

### 1. Ir a Vercel Dashboard

Abrir: https://vercel.com/dashboard

### 2. Seleccionar el Proyecto

Buscar y hacer click en: **Sarident-HCO**

### 3. Ir a Settings → Environment Variables

- Click en **"Settings"** (menú lateral izquierdo)
- Click en **"Environment Variables"**

### 4. Agregar Nueva Variable

Click en **"Add New"** o **"Add"**

Configurar:

**Name:**
```
VITE_METROSALUD_API_URL
```

**Value:**
```
https://script.google.com/macros/s/AKfycbywjgodKbOE9BfRjI3_H9xPN4BPykmk0bd6492OLBtQrqU-u9xaZOzbBFZWs7AJw-qVsw/exec
```

**Environments:** (Marcar TODOS)
- ✅ Production
- ✅ Preview
- ✅ Development

Click en **"Save"**

### 5. Redeploy el Proyecto

**Opción A - Automático (esperar 2-3 minutos):**
Vercel detectará el nuevo push y hará auto-deploy.

**Opción B - Manual (más rápido):**
1. Click en **"Deployments"** (menú lateral)
2. Click en los **tres puntos (...)** del deployment más reciente
3. Click en **"Redeploy"**
4. Confirmar en **"Redeploy"**

### 6. Verificar que Funciona

Una vez que el deployment termine (círculo verde ✅):

1. Abrir: https://sarident-hco-nltq.vercel.app/
2. Login si es necesario
3. Ir a: **Sincronización** (menú lateral)
4. Click en: **"Sincronizar Ahora"**

Deberías ver:
```
✅ Sincronización con Metrosalud exitosa
   X pacientes sincronizados en Y segundos
```

## 🎉 ¡Listo!

Ahora la integración con Metrosalud está funcionando tanto en:
- ✅ Desarrollo (localhost)
- ✅ Producción (Vercel)

## 📋 Checklist Final

- ✅ URL de Google Apps Script obtenida
- ✅ Configurado en `.env.local` (desarrollo)
- ⏳ Configurado en Vercel (producción) ← **ESTO ES LO QUE FALTA**
- ⏳ Redeploy en Vercel
- ⏳ Probar sincronización en producción

---

**Nota:** La URL ya está configurada localmente, así que si haces `npm run dev` ya debería funcionar la sincronización en tu computadora.
