# AGENTS.md

SPA de gestión de una sala de emergencias (pacientes, médicos, consultorios, especialidades).
React 19 + Vite 8 + TypeScript 6 + Tailwind 4. El backend es un repo aparte: acá solo se consume su API REST.

La UI, los comentarios y los nombres del dominio están en español (`Paciente`, `Medico`, `Turno`). Mantené esa convención.

## Comandos

- `npm install`
- `npm run dev` — Vite. Ejecutalo desde la raíz del repo: `vite.config.ts` resuelve el alias `@` con `process.cwd()`.
- `npm run lint` — ESLint flat config sobre `**/*.{ts,tsx}`. Es la única verificación automática del repo.
- `npx vite build` — compila el bundle; hoy es la forma confiable de verificar que el proyecto compila.
- `npm run preview` — sirve `dist/` (requiere un `npx vite build` previo).

No hay tests, ni script de test, ni CI, ni framework de test instalado. No inventes comandos de test.

## `npm run build` está roto (no es tu cambio)

`npm run build` ejecuta `tsc -b && vite build`, y `tsc -b` falla siempre por la versión de TypeScript instalada (6.0.3):

```
tsconfig.app.json(11,5): error TS5101: Option 'baseUrl' is deprecated...
```

- No lo reportes como regresión propia ni "arregles" el código de la app por esto.
- Si la tarea es arreglar el build: agregá `"ignoreDeprecations": "6.0"` en `tsconfig.app.json`, o quitá `baseUrl` (los `paths` ya funcionan sin él; verificado).
- El flag `--ignoreDeprecations` no se puede usar junto con `tsc -b`; tiene que ir en el tsconfig.

## Arquitectura

Flujo de datos por capas: `pages/` → `hooks/` (TanStack Query) → `api/*.api.ts` (instancia axios) → `types/`.

- Entrypoint: `src/main.tsx` → `QueryProvider` → `src/App.tsx` → `AuthProvider` → `src/router/AppRouter.tsx`.
- `ProtectedRoute` envuelve todas las rutas salvo `/login`; dentro va `components/layout/DashboardLayout`, que aporta sidebar, header y `SidebarProvider`.
- `@/` apunta a `src/` tanto en Vite como en `tsconfig.app.json`.
- React Query: `staleTime` 5 min y `retry: 1` global. Las mutaciones invalidan la key base (`["pacientes"]`, `["medicos"]`, etc.), que también cubre las variantes con filtros por match de prefijo.
- Los filtros forman parte del `queryKey` (`["medicos", filters]`). Si agregás filtros, pasalos por el hook para no romper la caché.

## API

- Cliente único en `src/api/axios.ts`; `baseURL: import.meta.env.VITE_API_URL` (en este entorno `http://localhost:3000/api/v1`). `.env` está gitignoreado: un clone nuevo necesita crearlo con `VITE_API_URL`.
- Envelope de respuesta: `{ success, timestamp, message, total, data }`. Las funciones devuelven `response.data` (el envelope completo), no `data.data`.
- Ojo con los GET por ID: el backend no tiene `GET /recurso/:id`. Se usa `GET /medicos?id=...`, `GET /especialidades?id=...`, `GET /consultorios?id=...` y devuelve un array de un elemento. `getMedico` y `getConsultorio` ya desenvuelven el primer elemento; `getEspecialidad` NO lo hace, devuelve el array.
- Borrados: `DELETE /pacientes/:id` es físico; `DELETE /consultorios/:id` es lógico (`activo = false`); médicos y especialidades usan `PATCH /:id/toggle-estado` para baja/alta lógica y `DELETE /:id/permanente` para borrado físico.
- El backend filtra por query (`activo` en médicos; `estado=todos|activos|inactivos` en especialidades), pero las páginas actuales traen todo y filtran en el cliente.
- Un 401 dispara el evento de ventana `auth:session-expired`; `AuthContext` lo escucha y hace logout. No agregues manejo de 401 por llamada.
- No hay llamada para validar el token al iniciar: la sesión se considera válida si existen `localStorage.token` y `localStorage.usuario`.

## UI

- shadcn/ui con estilo `base-nova`, pero los primitives son `@base-ui/react` (no Radix). No importes `@radix-ui/*`.
- Tailwind 4 sin `tailwind.config`: `src/index.css` solo hace `@import "tailwindcss"`. No agregues un config de Tailwind ni `@tailwind` directives.
- Sintaxis Tailwind 4: gradientes `bg-linear-to-r` (no `bg-gradient-to-r`), tamaños `size-*`, etc.
- `src/components/ui/*` son archivos generados por shadcn: usan 2 espacios y sin punto y coma. El código propio usa 4 espacios, comillas dobles y punto y coma. No reformatees los generados.
- Los formularios usan shadcn `Dialog`/`AlertDialog` y `toast` de `sonner`; el `Toaster` se monta en `QueryProvider`.

## Convenciones de código

- `verbatimModuleSyntax` + `erasableSyntaxOnly`: usá `import type` para tipos y evitá `enum`, namespaces y parameter properties.
- `noUnusedLocals` y `noUnusedParameters` están activos: el lint/build falla por variables sin usar.
- Validación: schema Zod en `src/schemas/*.schema.ts`, tipo inferido con `z.infer`, y `useForm` + `zodResolver` en el formulario (Zod 4, con la forma `z.string().email()` heredada).
- Antes de mutar, los formularios normalizan: nombres/calles en mayúsculas, email en minúsculas y `trim()` en todos los strings. Replicá esa normalización al crear formularios nuevos.
- Contextos partidos a propósito: `contexts/*-context.ts` define `createContext` y el provider vive en `contexts/PascalCase.tsx`; el consumo va por `hooks/use*.ts`. Seguí ese patrón (por eso existen `auth-context.ts` + `AuthContext.tsx` + `useAuth.ts`).

## Archivos muertos y placeholders

- El layout real es `src/components/layout/DashboardLayout.tsx`. `src/layouts/DashboardLayout.tsx` está vacío y no se usa.
- `src/api/turnos.api.ts` está vacío.
- `/turnos`, `/recepcion` y `/historias-clinicas` renderizan placeholders inline en `AppRouter`.
- El sidebar linkea `/configuracion`, que no existe: cae en `path="*"` y redirige a `/`.
- `README.md` es el template genérico de Vite; no lo uses como fuente de verdad.
