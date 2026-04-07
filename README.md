# Humantyx Jobs — Frontend

> Portal de empleo con inteligencia artificial para el mercado peruano.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Auth0](https://img.shields.io/badge/Auth0-SPA-EB5424?logo=auth0)

---

## Stack

- **React 18** + **Vite**
- **React Router DOM v6**
- **@auth0/auth0-react** — autenticación OAuth
- **Recharts** — gráficos del panel admin
- **CSS Variables** — sistema de diseño
- **Syne** (display) + **DM Sans** (body) — tipografías

---

## Requisitos

- Node.js >= 18
- Cuenta en [Auth0](https://auth0.com)
- Backend de Humantyx corriendo en `localhost:4000`

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/humantyx-frontend.git
cd humantyx-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_AUTH0_DOMAIN=dev-xxxxxxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=tu_client_id
VITE_AUTH0_AUDIENCE=https://[tu.0auth-api]
VITE_API_URL=http:(https://[//localhost:4000].onrender.com
```

---

## Configuración Auth0

1. Crear una aplicación **Single Page Application** en Auth0
2. Configurar las siguientes URLs:

| Campo | Valor (desarrollo) |
|---|---|
| Allowed Callback URLs | `http://localhost:5173` |
| Allowed Logout URLs | `http://localhost:5173` |
| Allowed Web Origins | `http://localhost:5173` |

3. Agregar un **Action** en `Triggers > Login > post-login`:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  api.accessToken.setCustomClaim('email', event.user.email)
  api.accessToken.setCustomClaim('name', event.user.name)
  api.accessToken.setCustomClaim('picture', event.user.picture)
}
```

---

## Scripts

```bash
npm run dev      # Servidor de desarrollo en localhost:5173
npm run build    # Build de producción en /dist
npm run preview  # Preview del build
```

---

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── VacancyCard.jsx
│   ├── VacancyModal.jsx
│   ├── VacancyRecommendations.jsx
│   ├── EducationSection.jsx
│   ├── CandidateProfileModal.jsx
│   ├── AdminAnalytics.jsx
│   ├── PointsBadge.jsx
│   ├── InviteModal.jsx
│   ├── OwnerInfo.jsx
│   └── ScrollToTop.jsx
├── pages/
│   ├── Vacancies.jsx        # Página principal de vacantes
│   ├── Profile.jsx          # Perfil del candidato
│   ├── Dashboard.jsx        # Dashboard de empresa
│   ├── AdminDashboard.jsx   # Panel administrativo
│   ├── MisPostulaciones.jsx # Postulaciones del candidato
│   ├── Login.jsx            # Página de login
│   ├── RegisterEmpresa.jsx  # Registro público de empresa
│   ├── Registro.jsx         # Aceptar invitación
│   ├── Terminos.jsx
│   ├── Privacidad.jsx
│   ├── FAQ.jsx
│   └── Acerca.jsx
├── context/
│   └── AuthContext.jsx      # Rol, token, funciones de auth
├── services/
│   ├── auth.service.js      # API_URL, buildHeaders
│   ├── vacancy.service.js
│   ├── company.service.js
│   ├── ai.service.js
│   └── admin.services.js
├── routes/
│   └── ProtectedRoute.jsx
├── main.jsx                 # BrowserRouter > Auth0Provider > App
└── AppRoutes.jsx
```

---

## Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Vacancies | Público |
| `/login` | Login | Público |
| `/registro` | Registro | Público (invitaciones) |
| `/registro-empresa` | RegisterEmpresa | Público |
| `/profile` | Profile | candidate |
| `/mis-postulaciones` | MisPostulaciones | candidate |
| `/dashboard` | Dashboard | company |
| `/admin` | AdminDashboard | admin |
| `/terminos` | Terminos | Público |
| `/privacidad` | Privacidad | Público |
| `/faq` | FAQ | Público |
| `/acerca` | Acerca | Público |

---

## Roles del Sistema

| Rol | Descripción |
|---|---|
| `candidate` | Busca empleo, postula vacantes, sube CV |
| `company` | Publica vacantes, gestiona postulantes |
| `admin` | Acceso total al sistema |

---

## Despliegue en Netlify

1. Conectar el repositorio en [netlify.com](https://netlify.com)
2. Configurar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Agregar variables de entorno `VITE_*` en Netlify
4. Crear el archivo `public/_redirects`:
   ```
   /* /index.html 200
   ```
5. Actualizar las URLs en Auth0 con el dominio de Netlify

---

## Licencia

MIT © Humantyx Jobs 2026
