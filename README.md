# Humatchy — Frontend

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
- Backend de Humatchy corriendo en `localhost:4000`

---

## Instalación

```bash
git clone https://github.com/tu-usuario/humatchy-frontend.git
cd humatchy-frontend
npm install
cp .env.example .env
# Editar .env con tus valores
npm run dev
```

---

## Variables de Entorno

```env
VITE_AUTH0_DOMAIN=dev-xxxxxxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=tu_client_id
VITE_AUTH0_AUDIENCE=https://humatchy-api
VITE_API_URL=http://localhost:4000
```

---

## Configuración Auth0

1. Crear aplicación **Single Page Application** en Auth0
2. Configurar URLs:

| Campo | Valor (desarrollo) |
|---|---|
| Allowed Callback URLs | `http://localhost:5173` |
| Allowed Logout URLs | `http://localhost:5173` |
| Allowed Web Origins | `http://localhost:5173` |

3. Habilitar conexiones: `google-oauth2`, `linkedin`, `windowslive`, `Username-Password-Authentication`
4. En `Username-Password-Authentication` → Settings → desactivar **Disable Sign Ups**
5. Agregar **Action** en `Triggers → Login → post-login`:

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
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ScrollToTop.jsx
│   ├── VacancyCard.jsx
│   ├── VacancyModal.jsx
│   ├── VacancyRecommendations.jsx
│   ├── EducationSection.jsx
│   ├── CandidateProfileModal.jsx
│   ├── PostulacionModal.jsx
│   ├── AdminAnalytics.jsx
│   ├── PointsBadge.jsx
│   ├── InviteModal.jsx
│   └── OwnerInfo.jsx
├── pages/
│   ├── Vacancies.jsx         # Página principal
│   ├── Profile.jsx           # Perfil candidato
│   ├── Dashboard.jsx         # Dashboard empresa
│   ├── AdminDashboard.jsx    # Panel admin
│   ├── MisPostulaciones.jsx  # Postulaciones candidato
│   ├── Login.jsx             # Login email/OAuth
│   ├── RegisterEmpresa.jsx   # Registro empresa pública
│   ├── Registro.jsx          # Aceptar invitación
│   ├── Pricing.jsx           # Planes Premium (Pay-me)
│   ├── Terminos.jsx
│   ├── Privacidad.jsx
│   ├── FAQ.jsx
│   └── Acerca.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── auth.service.js
│   ├── vacancy.service.js
│   ├── company.service.js
│   ├── ai.service.js
│   └── admin.services.js
├── routes/
│   └── ProtectedRoute.jsx
├── main.jsx
└── AppRoutes.jsx
```

---

## Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Vacancies | Público |
| `/login` | Login | Público |
| `/registro?token=X` | Registro | Público |
| `/registro-empresa` | RegisterEmpresa | Público |
| `/profile` | Profile | candidate |
| `/mis-postulaciones` | MisPostulaciones | candidate |
| `/dashboard` | Dashboard | company |
| `/admin` | AdminDashboard | admin |
| `/premium` | Pricing | Autenticado |
| `/terminos` | Terminos | Público |
| `/privacidad` | Privacidad | Público |
| `/faq` | FAQ | Público |
| `/acerca` | Acerca | Público |

---

## Roles del Sistema

| Rol | Descripción |
|---|---|
| `candidate` | Busca empleo, postula vacantes, sube CV, invita hasta 5 personas |
| `company` | Publica vacantes, gestiona postulantes, invita candidatos y empresas |
| `admin` | Acceso total, invita cualquier rol |

---

## Funcionalidades Principales

### Candidato
- Perfil: datos personales, habilidades, idiomas, CV PDF, estudios académicos
- Solo nombre y apellido son obligatorios
- Postularse y cancelar postulaciones propias
- Ver estado de postulaciones con modal de detalle
- Recomendaciones IA (1/día gratis, ilimitadas con Premium)
- Sistema de puntos mensual con niveles
- Invitar hasta 5 personas

### Empresa
- Dashboard: Resumen, Vacantes, Postulantes, Mi Empresa
- Crear/editar/eliminar vacantes
- Ver perfiles de postulantes (modal clickeable en toda la card)
- Aceptar/rechazar desde lista y recomendaciones IA
- Sistema de puntos por vacantes y hitos de postulantes
- Invitar candidatos y empresas

### Admin
- KPIs y gráficos Recharts en tiempo real
- Gestión de candidatos, empresas, vacantes
- Aprobar/rechazar solicitudes de empresa
- Invitar cualquier rol (candidate, company, admin)

---

## Sistema de Puntos (mensual)

### Candidatos
| Acción | Puntos |
|---|---|
| Postularse a vacante | +5 |
| Subir CV | +50 (1×/mes) |
| Completar perfil 100% | +50 (1×/mes) |
| Invitar usuario | +20 |

### Empresas
| Acción | Puntos |
|---|---|
| Crear vacante | +30 |
| Llegar a 5/10/20 postulantes | +20 c/u |
| Cada 50 postulantes adicionales | +100 |

**Premium multiplica todos los puntos x1.3**

### Niveles
| Nivel | Puntos |
|---|---|
| 🌱 Nuevo | 0 – 49 |
| 🔥 Activo | 50 – 99 |
| ⭐ Pro | 100 – 199 |
| 🏆 Elite | 200+ |

---

## Plan Premium — Pay-me

| Plan | Precio |
|---|---|
| Mensual | S/ 19.90/mes |
| Anual | S/ 202.98/año (-15%) |

Beneficios: IA ilimitada · puntos x1.3 · mayor visibilidad · badge Premium ⭐

Integración de pagos: **[Pay-me / Alignet](https://pay-me.com)** (adquirente directo Perú)

---

## Despliegue en Netlify

1. Conectar repositorio en [netlify.com](https://netlify.com)
2. Configurar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Agregar variables de entorno `VITE_*`
4. Crear `public/_redirects`:
   ```
   /* /index.html 200
   ```
5. Actualizar Callback/Logout URLs en Auth0 con dominio de Netlify
6. Actualizar `VITE_API_URL` con la URL de Render

---

## Colores del Sistema

```css
--ink: #0f1035;
--cream: #faf8f3;
--surface: #f4f1eb;
--accent: #1E2EB8;   /* Azul Humatchy */
--accent-2: #E8472A; /* Rojo Humatchy */
```

---

## Licencia

MIT © Humatchy 2026
