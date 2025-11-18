# 🚀 Guía de Deployment - Sarident HC

Esta guía te llevará de **código a producción en 30 minutos**.

## 💰 Costo Total: $25/mes

- **Cloudflare Pages**: $0/mes (gratis para uso comercial)
- **Supabase Pro**: $25/mes (REQUERIDO para producción)

---

## 📋 Checklist Pre-Deployment

Antes de empezar, asegúrate de tener:

- [ ] Cuenta de GitHub con el repositorio pusheado
- [ ] Tarjeta de crédito para Supabase Pro
- [ ] 30 minutos de tiempo
- [ ] (Opcional) Dominio personalizado en GoDaddy

---

## PASO 1: Configurar Supabase (15 minutos)

### 1.1. Crear Proyecto

1. Ir a **[supabase.com](https://supabase.com)**
2. Click en **"New Project"**
3. Configurar:
   - **Name**: `sarident-hc-prod`
   - **Database Password**: ⚠️ **Guárdala en lugar seguro**
   - **Region**: Seleccionar la más cercana (ej: South America)
4. Click **"Create new project"**
5. ⏱️ Esperar 2-3 minutos mientras se crea

### 1.2. Upgrade a Plan Pro (OBLIGATORIO)

⚠️ **¿Por qué es obligatorio?**
- ✅ Backups automáticos diarios (plan Free NO tiene)
- ✅ Sin pausa por inactividad (plan Free se pausa cada 7 días)
- ✅ 8 GB de base de datos vs 500 MB
- ✅ 100 GB para fotos vs 1 GB

**Pasos:**
1. Click en **Settings** (⚙️ abajo a la izquierda)
2. Click en **Billing**
3. Seleccionar **"Pro Plan - $25/month"**
4. Ingresar datos de tarjeta
5. Confirmar upgrade

### 1.3. Ejecutar Schema de Base de Datos

1. En el panel de Supabase, ir a **SQL Editor** (icono </> en sidebar)
2. Click en **"New query"**
3. Abrir el archivo `supabase-schema.sql` de tu proyecto local
4. **Copiar TODO el contenido**
5. **Pegar** en el editor SQL de Supabase
6. Click en **"Run"** (▶️)
7. ✅ Deberías ver: **"Success. No rows returned"**

### 1.4. Crear Bucket de Storage

1. Ir a **Storage** en el sidebar
2. Click en **"New bucket"**
3. Configurar:
   - **Name**: `fotos-clinicas`
   - **Public**: ❌ **Dejar DESACTIVADO** (privado)
4. Click **"Create bucket"**

### 1.5. Configurar Políticas de Storage

1. Click en el bucket `fotos-clinicas` que acabas de crear
2. Click en **"Policies"** (tab superior)
3. Click en **"New policy"**
4. Seleccionar **"Create a policy from scratch"**
5. Configurar la política:

**Política 1: INSERT (Subir fotos)**
```sql
Policy name: Usuarios autenticados pueden subir fotos

Target roles: authenticated

WITH CHECK expression:
auth.role() = 'authenticated'

Policy command: INSERT
```
Click **"Save"**

**Política 2: SELECT (Ver fotos)**
```sql
Policy name: Usuarios autenticados pueden ver fotos

Target roles: authenticated

USING expression:
auth.role() = 'authenticated'

Policy command: SELECT
```
Click **"Save"**

**Política 3: DELETE (Eliminar fotos)**
```sql
Policy name: Usuarios autenticados pueden eliminar fotos

Target roles: authenticated

USING expression:
auth.role() = 'authenticated'

Policy command: DELETE
```
Click **"Save"**

### 1.6. Obtener Credenciales

1. Ir a **Settings** → **API**
2. ✅ **Copiar y guardar:**
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **Guardar estas credenciales - las necesitarás en el siguiente paso**

### 1.7. Crear Primer Usuario

1. Ir a **Authentication** → **Users**
2. Click **"Add user"**
3. Ingresar:
   - **Email**: tu email
   - **Password**: contraseña segura
   - **Auto Confirm User**: ✅ Activar
4. Click **"Create user"**

✅ **Supabase configurado completamente**

---

## PASO 2: Configurar Cloudflare Pages (10 minutos)

### 2.1. Crear Cuenta

1. Ir a **[pages.cloudflare.com](https://pages.cloudflare.com)**
2. Click **"Sign up"** o **"Log in"** si ya tienes cuenta
3. Completar registro (gratis, no requiere tarjeta)

### 2.2. Conectar con GitHub

1. Click en **"Create a project"**
2. Click en **"Connect to Git"**
3. Seleccionar **"GitHub"**
4. Autorizar Cloudflare en GitHub
5. Seleccionar el repositorio: **`Sarident-HCO`**
6. Click **"Begin setup"**

### 2.3. Configurar Build

En la página de configuración, ingresar:

```
Project name:         sarident-hc
Production branch:    claude/complete-remaining-work-015kHxUz7Eh8gtfJCS1iHRnP
Build command:        npm run build
Build directory:      dist
Framework preset:     Vite
```

### 2.4. Configurar Variables de Entorno

1. Scroll down hasta **"Environment variables"**
2. Click **"Add variable"** y agregar:

**Variable 1:**
```
Variable name:  VITE_SUPABASE_URL
Value:          https://xxxxx.supabase.co  (tu Project URL de paso 1.6)
```

**Variable 2:**
```
Variable name:  VITE_SUPABASE_ANON_KEY
Value:          eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (tu anon key de paso 1.6)
```

### 2.5. Deploy

1. Click **"Save and Deploy"**
2. ⏱️ Esperar 2-4 minutos mientras compila
3. ✅ Cuando termine verás: **"Success! Your site is deployed"**

### 2.6. Obtener URL

1. En la pantalla de éxito, verás una URL como: **`https://sarident-hc.pages.dev`**
2. Click en la URL para abrir tu aplicación
3. ✅ **Debería abrir la página de login**

### 2.7. Probar Login

1. En la URL de Cloudflare, ir a `/login`
2. Ingresar el email y password del usuario creado en paso 1.7
3. Click **"Iniciar Sesión"**
4. ✅ Deberías entrar al sistema

🎉 **¡DEPLOYMENT COMPLETO!**

---

## PASO 3: Configurar Dominio Personalizado (Opcional - 10 minutos)

Si tienes un dominio en GoDaddy (ej: `sarident.com`):

### 3.1. Agregar Dominio en Cloudflare

1. En Cloudflare Pages, ir a tu proyecto
2. Click en **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Ingresar tu dominio: `sarident.com` o `app.sarident.com`
5. Click **"Continue"**

### 3.2. Configurar DNS en GoDaddy

Cloudflare te mostrará instrucciones específicas. Generalmente:

1. Ir a **[godaddy.com](https://godaddy.com)** → **My Products**
2. Click en **DNS** junto a tu dominio
3. Agregar/Modificar registro:

**Para dominio raíz (sarident.com):**
```
Type:   CNAME
Name:   @
Value:  sarident-hc.pages.dev
TTL:    1 Hour
```

**Para subdominio (app.sarident.com):**
```
Type:   CNAME
Name:   app
Value:  sarident-hc.pages.dev
TTL:    1 Hour
```

4. **Guardar** cambios
5. ⏱️ Esperar 10-60 minutos para propagación DNS
6. ✅ Tu sitio estará en `https://sarident.com` con HTTPS automático

---

## 📊 Verificación Final

Checklist de que todo funciona:

- [ ] URL de Cloudflare abre correctamente
- [ ] Login funciona con usuario de Supabase
- [ ] Puedes crear un paciente de prueba
- [ ] Puedes abrir una historia clínica
- [ ] Puedes subir una foto (probar captura con cámara)
- [ ] La foto se ve en la galería
- [ ] PWA se puede instalar (en Chrome: menú → "Instalar app")

---

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Verificar que las variables de entorno en Cloudflare estén correctas
- No debe haber espacios extra al copiar/pegar
- Rebuild el proyecto: Settings → Deployments → tres puntos → Retry deployment

### Error: "Storage bucket not found"
- Verificar que el bucket `fotos-clinicas` existe en Supabase
- Verificar que las políticas de storage están configuradas

### Login no funciona
- Verificar que el usuario existe en Supabase → Authentication → Users
- Verificar que "Auto Confirm User" está activado
- Probar hacer reset de password desde Supabase

### Fotos no se suben
- Verificar políticas de storage en paso 1.5
- Abrir DevTools (F12) → Console para ver errores específicos
- Verificar que estás logueado (token válido)

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios al código:

1. `git add .`
2. `git commit -m "Descripción del cambio"`
3. `git push`
4. ✅ Cloudflare **automáticamente** detecta el cambio y redeploya
5. ⏱️ Nueva versión live en 2-3 minutos

---

## 💡 Próximos Pasos Recomendados

1. **Reemplazar iconos SVG** en `/public/` con iconos profesionales de tu marca
2. **Configurar dominio personalizado** (paso 3)
3. **Agregar usuarios adicionales** en Supabase → Authentication
4. **Configurar backups** en Supabase → Database → Backups (automático en Pro)
5. **Monitorear uso** en Supabase → Reports

---

## 📞 Soporte

- **Supabase Docs**: https://supabase.com/docs
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **GitHub Issues del proyecto**: Para bugs específicos de Sarident HC

---

**¡Listo para monetizar! 💰**
