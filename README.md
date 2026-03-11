# ACSA · Atención Primaria — PWA de Seguimiento de Acreditación

## Estructura del proyecto

```
acsa-pwa/
├── src/
│   ├── main.jsx          → Punto de entrada (no tocar)
│   ├── config.js         → ⚙️  AQUÍ SE CAMBIA LA CLAVE DE ACCESO
│   ├── Access.jsx        → Pantalla de login
│   └── App.jsx           → Aplicación principal
├── public/
│   ├── favicon.svg
│   ├── pwa-192.png
│   ├── pwa-512.png
│   └── apple-touch-icon.png
├── index.html
├── vite.config.js
├── netlify.toml
└── package.json
```

---

## 🔑 Cambiar la clave de acceso

Edita **`src/config.js`** y cambia el valor de `ACCESS_TOKEN`:

```js
export const ACCESS_TOKEN = "nueva-clave-aqui";
```

Luego haz commit y push a GitHub → Netlify redesplegará automáticamente.

---

## 🚀 Despliegue en Netlify (primera vez)

### Opción A — Desde GitHub (recomendado)

1. Sube la carpeta a un repositorio GitHub (puede ser privado).
2. En [netlify.com](https://netlify.com) → **Add new site → Import from Git**.
3. Selecciona el repositorio.
4. Netlify detecta automáticamente la configuración del `netlify.toml`.
5. Pulsa **Deploy site**.
6. En **Site settings → Domain management** puedes cambiar la URL o añadir un dominio propio.

### Opción B — Drag & drop (sin GitHub)

1. Ejecuta `npm install && npm run build` en local.
2. En netlify.com → **Add new site → Deploy manually**.
3. Arrastra la carpeta `dist/` generada.

---

## 📱 Instalar como app en el móvil

**iPhone/iPad (Safari):**
1. Abre la URL en Safari.
2. Introduce la clave de acceso.
3. Pulsa el botón de compartir (cuadrado con flecha) → **"Añadir a pantalla de inicio"**.

**Android (Chrome):**
1. Abre la URL en Chrome.
2. Chrome mostrará automáticamente un banner de instalación, o bien:
   Menú (⋮) → **"Instalar aplicación"**.

**PC (Chrome/Edge):**
- Aparece un icono de instalación en la barra de direcciones.

---

## 💾 Persistencia de datos

- Los estados de cada estándar se guardan automáticamente en el **localStorage** del dispositivo.
- Cada dispositivo/navegador guarda su propio progreso.
- Si el usuario borra los datos del navegador, se perderá el progreso (es un tracker offline).

---

## 🛡️ Control de acceso / anti-plagio

La clave se verifica en el cliente. Para mayor seguridad ante difusión no autorizada:

1. **Cambia la clave** en `config.js` y redesplega — los usuarios con la clave antigua quedarán bloqueados en el siguiente acceso.
2. **Cambia la URL** en Netlify (Site settings → Domain) — el enlace anterior dejará de funcionar.
3. Ambas acciones juntas garantizan control total sobre quién accede.

---

## 🛠️ Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173
