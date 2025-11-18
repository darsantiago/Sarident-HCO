# ✅ Checklist de Deployment - Sarident HCO

Use este checklist para asegurarse de que todo esté configurado correctamente antes de lanzar a producción.

---

## 📋 Pre-Deployment

### Supabase
- [ ] Proyecto creado en Supabase
- [ ] Schema SQL ejecutado (`supabase-schema.sql`)
- [ ] Storage bucket `fotos-clinicas` creado
- [ ] Políticas de storage configuradas (upload, select, delete)
- [ ] RLS (Row Level Security) habilitado en todas las tablas
- [ ] Autenticación por email habilitada
- [ ] (Opcional) Google OAuth configurado
- [ ] Credenciales copiadas:
  - [ ] Project URL
  - [ ] Anon/Public Key

### Desarrollo Local
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env.local` creado
- [ ] Variables de entorno configuradas
- [ ] Servidor de desarrollo funciona (`npm run dev`)
- [ ] Al menos un usuario de prueba creado
- [ ] Tests ejecutados exitosamente (`npm test`)
- [ ] Build de producción exitoso (`npm run build`)

---

## 🚀 Deployment a Vercel

### Configuración Inicial
- [ ] Cuenta de Vercel creada
- [ ] Repositorio GitHub vinculado a Vercel
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas en Vercel:
  ```
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
  ```

### Deployment
- [ ] Primer deployment exitoso
- [ ] URL de producción accesible
- [ ] App carga correctamente
- [ ] Login funciona
- [ ] Crear paciente funciona
- [ ] Subir foto funciona
- [ ] PWA es instalable
- [ ] Modo offline funciona

---

## 🔍 Post-Deployment Testing

### Funcionalidad Básica
- [ ] **Autenticación**
  - [ ] Registro de usuario
  - [ ] Login con email/password
  - [ ] (Si aplica) Login con Google
  - [ ] Logout
  - [ ] Recuperar contraseña

- [ ] **Gestión de Pacientes**
  - [ ] Crear paciente
  - [ ] Listar pacientes
  - [ ] Buscar paciente
  - [ ] Editar paciente
  - [ ] Ver detalle de paciente

- [ ] **Historias Clínicas**
  - [ ] Crear historia clínica
  - [ ] Ver historia clínica
  - [ ] Agregar procedimiento
  - [ ] Ver timeline de procedimientos

- [ ] **Fotos Clínicas**
  - [ ] Subir foto desde archivo
  - [ ] Capturar foto con cámara
  - [ ] Ver galería de fotos
  - [ ] Eliminar foto

- [ ] **Exportación**
  - [ ] Exportar a PDF
  - [ ] Imprimir historia clínica

### Testing en Dispositivos
- [ ] Desktop (Chrome)
- [ ] Desktop (Firefox)
- [ ] Desktop (Safari)
- [ ] Mobile Android (Chrome)
- [ ] Mobile iOS (Safari)
- [ ] Tablet (iPad/Android)

### Performance
- [ ] Lighthouse score > 90
- [ ] Tiempo de carga < 3 segundos
- [ ] PWA instalable correctamente
- [ ] Service Worker funcionando
- [ ] Modo offline operativo

---

## 🔒 Seguridad

- [ ] Variables de entorno NO están en el código
- [ ] `.env` está en `.gitignore`
- [ ] RLS habilitado en Supabase
- [ ] Storage privado (no público)
- [ ] Headers de seguridad configurados en `vercel.json`:
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] X-XSS-Protection
- [ ] HTTPS forzado
- [ ] Cookies seguras

---

## 📊 Monitoreo (Opcional)

- [ ] Sentry configurado (errores)
- [ ] Google Analytics (opcional)
- [ ] Vercel Analytics habilitado
- [ ] Logs de Supabase revisados

---

## 📝 Documentación

- [ ] README.md actualizado
- [ ] SETUP_COMPLETO.md disponible
- [ ] Variables de entorno documentadas
- [ ] Manual de usuario creado (opcional)
- [ ] Changelog iniciado

---

## 🎯 Go-Live

- [ ] Todos los items anteriores completados
- [ ] Equipo notificado
- [ ] URL de producción compartida
- [ ] Usuarios de prueba creados
- [ ] Plan de rollback definido
- [ ] Backup de base de datos realizado

---

## 🚨 Plan de Rollback

En caso de problemas críticos:

1. **Revertir en Vercel:**
   ```bash
   vercel rollback
   ```

2. **Restaurar base de datos:**
   - Ve a Supabase → Database → Backups
   - Selecciona el backup más reciente
   - Click en "Restore"

3. **Notificar a usuarios:**
   - Enviar email/mensaje explicando el issue
   - Estimar tiempo de resolución

---

## 📞 Contactos de Emergencia

- **Desarrollador:** [Tu nombre/email]
- **Supabase Support:** https://supabase.com/support
- **Vercel Support:** https://vercel.com/support

---

## ✅ Deployment Completado

Fecha: _______________
Responsable: _______________
URL de producción: _______________
Notas adicionales:
_______________________________________________
_______________________________________________

---

**¡Felicidades!** 🎉 Tu aplicación está ahora en producción.
