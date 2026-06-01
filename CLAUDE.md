# CLAUDE.md — Happy Baby Style Admin

> Guía operativa para Claude (y agentes) trabajando en este repositorio. Scaneable; cada sección debe leerse en <30 s.

---

## 1. ¿Qué es este proyecto?

Panel administrativo de e-commerce de productos para bebés (`apps/admin`) construido sobre Clean Architecture en monorepo NX. **Dirección estratégica:** evolución progresiva a **ERP propio inspirado en Odoo 17+**, ampliando alcance desde e-commerce hacia Inventory, Invoicing, CRM, Purchase, Helpdesk, HR.

- Roadmap producto y fases P1/P2/P3 → [`ROADMAP_ERP_ODOO.md`](./ROADMAP_ERP_ODOO.md).
- Prompts para mockups visuales (Brand vs ERP theme) → [`CLAUDE_DESIGN_PROMPTS.md`](./CLAUDE_DESIGN_PROMPTS.md).

El backend vive en repo separado (`happy-baby-style-backend`). Este repo es **frontend-only** + integración GraphQL.

---

## 2. Stack

| Capa           | Tecnología                                                         |
| -------------- | ------------------------------------------------------------------ |
| Runtime        | React 18 + TypeScript 5.2 + Vite 5                                 |
| Monorepo       | pnpm 11.3 + NX 22.7                                                |
| Data           | Apollo Client 3.13 + GraphQL Codegen                               |
| UI             | Tailwind v4 + shadcn/ui + lucide-react 0.294                       |
| Estado         | Zustand 5 + react-hook-form 7 + zod 4                              |
| Test           | Vitest 2 + Testing Library + MSW 2                                 |
| Observabilidad | Sentry (wiring en curso) → `@happy-baby/infrastructure-monitoring` |

`tsconfig.base.json` activa `strict + exactOptionalPropertyTypes + noUncheckedIndexedAccess + noPropertyAccessFromIndexSignature`. Asumí esto en cualquier código nuevo.

---

## 3. Arquitectura — Clean Architecture en capas

Las capas se enforcan por `@nx/enforce-module-boundaries` con tags NX en cada `project.json`. **No bypassear**.

```
apps/admin                (tag: type:app)            → puede importar TODO
  ↓
libs/features/*           (tag: type:feature)        → application + domain + ui + util
  ↓
libs/application/*        (tag: type:application)    → solo domain
  ↓
libs/domain/*             (tag: type:domain)         → PURO, sin deps externas
libs/infrastructure/*     (tag: type:infrastructure) → domain + util
libs/shared/ui            (tag: type:ui)             → solo util
libs/shared/{utils,hooks,stores}  (tag: type:util)   → solo entre util
```

Tags `scope:*` también existen (`scope:products`, `scope:users`, etc.) — agruparán features cuando crezca el cross-scope.

### Path aliases (`tsconfig.json`)

```
@happy-baby/domain-{product,order,user,category,shared}
@happy-baby/application-{product,order,user,category}
@happy-baby/infrastructure-{graphql,storage,monitoring}
@happy-baby/shared-{ui,utils,stores,hooks}
@happy-baby/feature-{products,categories,orders,users,auth}
@/*  → apps/admin/src/*  (solo para código app-specific: di, pages, layout, config)
```

**Al crear código nuevo:** importar siempre desde `@happy-baby/*`. **No** crear shims/barrels nuevos en `apps/admin/src/`.

---

## 4. Convenciones críticas (DO / DON'T)

Estas ya pisaron mina — respetalas sin excepción:

- **zod + forms:** `exactOptionalPropertyTypes` rompe `z.coerce.number()` (input type queda `unknown`, incompatible con `ResolverOptions`). Usar `z.number()` + `register('field', { valueAsNumber: true })`.
- **lucide-react@0.294:** no soporta imports directos por ESM. **NO** migrar a `lucide-react/dist/esm/icons/*` hasta upgrade ≥0.400.
- **React imports:** `import type React from 'react'` solo trae el _tipo_. Para hooks, named imports: `import { useState, useEffect } from 'react'`. **No** usar `React.useState`.
- **Logger, no console:** `no-console` es `error` en ESLint. Usar logger de `@happy-baby/infrastructure-monitoring`.
- **Reglas SOLID enforced:** `max-params: 3 (error)`, `max-lines-per-function: 50 (warn)`, `complexity: 10 (warn)`, `max-depth: 4 (warn)`.
- **Type imports:** `@typescript-eslint/consistent-type-imports` activo con `fixStyle: 'inline-type-imports'`.
- **Sin shims:** post-Sprint Final no quedan barrels viejos en `apps/admin/src/`. No los recrees.

---

## 5. Comandos esenciales

```bash
# Dev / build
pnpm dev                    # nx run admin:dev
pnpm build                  # nx run admin:build
pnpm preview

# Calidad
pnpm type-check             # tsc --noEmit por proyecto
pnpm lint                   # eslint + @nx/enforce-module-boundaries
pnpm lint:fix
pnpm format                 # prettier write
pnpm format:check

# Tests
pnpm test                   # vitest run
pnpm test:watch
pnpm test:coverage

# GraphQL
pnpm graphql:download-schema  # rover introspect → apps/admin/src/graphql/schema.graphql
pnpm codegen                  # regenera apps/admin/src/generated/graphql.ts
pnpm codegen:check            # CI: falla si el generated está desincronizado
```

Si tocás `.graphql`, **siempre** corré `pnpm codegen` y commiteá `generated/graphql.ts` en el mismo PR.

---

## 6. Orquestación de skills — cuándo invocar qué

| Disparador                                                                    | Skill                  | Cuándo aplicarlo                                                                                                                                                    |
| ----------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decisión arquitectónica, nueva lib, cambio de capas/tags, evaluación de stack | `senior-architect`     | Antes de tocar `project.json`, `depConstraints`, agregar lib nueva, o elegir entre 2 enfoques con blast radius >1 carpeta                                           |
| Implementación de feature FE, componente, página, refactor React              | `senior-frontend`      | Crear/modificar código en `libs/features/*`, `libs/shared/ui`, `apps/admin/src/pages`                                                                               |
| Diseño visual, design tokens, paleta, densidad, componente shadcn nuevo       | `ui-design-system`     | Al tocar tema (Brand vs ERP), definir un componente nuevo, o cuando hay duda de tokens. Contexto Brand/ERP en `CLAUDE_DESIGN_PROMPTS.md`                            |
| Vulnerabilidades, manejo de tokens, auth flows, CSP, XSS, deps inseguras      | `senior-security`      | Antes de mergear cambios en `libs/features/auth`, `libs/infrastructure/storage` (TokenStorage), `apps/admin/src/hooks/useUnifiedAuth.ts`, o al revisar `pnpm audit` |
| Performance React (re-renders, memoization, bundle)                           | `react-best-practices` | Al detectar problemas o como gate en pages pesadas antes de merge                                                                                                   |
| Verificar cambio en navegador                                                 | `verify` o `run`       | Antes de marcar tarea como complete en features con UI                                                                                                              |
| Code review del diff                                                          | `code-review`          | Al cerrar feature, antes del PR                                                                                                                                     |
| Security review de la rama                                                    | `security-review`      | Antes de mergear ramas que tocan auth / storage / cookies                                                                                                           |

**Regla de precedencia** (si la tarea cruza categorías): `senior-security` > `senior-architect` > `senior-frontend` > `ui-design-system`.

---

## 7. Agentes — orquestación

### 7.1 Mapa de agentes

| Agente                           | Especialidad                            | Cuándo invocarlo                                                                                                                                |
| -------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend-security-auditor`      | Seguridad FE, auth, tokens, deps        | Cambios en `libs/features/auth`, `libs/infrastructure/storage`, `useUnifiedAuth`, cookies, CSP, `dangerouslySetInnerHTML`, bumps con riesgo CVE |
| `frontend-architect-advisor`     | Arquitectura Clean, capas, contratos    | Nueva lib, cambio de `tags`/`depConstraints`, mover código entre capas, evaluación de trade-offs con blast radius >1 carpeta                    |
| `ux-ui-design-critic`            | UX/UI, tema Brand vs ERP, design system | Antes de implementar nueva página, después de cerrar feature UI, dudas de tokens/densidad, revisión de flujos confusos                          |
| `frontend-implementation-expert` | Implementación React/TS                 | Features, componentes, hooks, páginas, refactors, migración a Clean Architecture, performance                                                   |
| `Explore`                        | Búsqueda en código (read-only)          | Localizar archivos/símbolos/referencias antes de un cambio amplio                                                                               |
| `Plan`                           | Estrategia de implementación            | Diseñar plan antes de codear cuando hay >1 enfoque viable                                                                                       |
| `claude` / `general-purpose`     | Fallback                                | Tareas que no encajan en los anteriores                                                                                                         |

### 7.2 Precedencia (cuando una tarea cruza dominios)

```
frontend-security-auditor  >  frontend-architect-advisor  >  ux-ui-design-critic  >  frontend-implementation-expert
```

Seguridad **bloquea merge**; arquitectura define contratos; UX define experiencia; implementación ejecuta. Si dos categorías aplican y son independientes, **invocar en paralelo** (un solo mensaje con múltiples `Agent` calls).

### 7.3 Pipelines por tipo de tarea

| Tarea                                          | Pipeline                                                                                                                                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Nueva feature con UI**                       | `Plan` → `frontend-architect-advisor` (validar capa) → `ux-ui-design-critic` (proponer UX) → `frontend-implementation-expert` (codear) → skill `verify` → skill `code-review`              |
| **Migrar feature legacy a Clean Architecture** | `frontend-architect-advisor` (plan de capas + aliases) → `frontend-implementation-expert` (ejecutar) → skill `code-review`                                                                 |
| **Cambio en auth / storage / tokens**          | `frontend-security-auditor` (gate previo) → `frontend-implementation-expert` (ejecutar) → `frontend-security-auditor` (review post) → skill `security-review` antes de merge               |
| **Refactor de performance**                    | `Explore` (mapear callers) → `frontend-implementation-expert` (aplica `react-best-practices`) → skill `verify`                                                                             |
| **Diseño de nueva página/dashboard**           | `ux-ui-design-critic` (layout + tema Brand/ERP) → `frontend-architect-advisor` (validar ubicación de feature) → `frontend-implementation-expert` (codear)                                  |
| **Bump de dep con potencial CVE**              | `frontend-security-auditor` (audit + alternativas) → decisión: mantener, parchear o reemplazar                                                                                             |
| **Cambio en `project.json` / tags / aliases**  | `frontend-architect-advisor` (obligatorio) → `frontend-implementation-expert` (aplicar) → `pnpm lint` para re-validar `@nx/enforce-module-boundaries`                                      |
| **Surface en UI de Reviews / Cupones (P1)**    | `Explore` (schema GraphQL existente) → `ux-ui-design-critic` (UX del módulo) → `frontend-architect-advisor` (definir `libs/features/{reviews,coupons}`) → `frontend-implementation-expert` |

### 7.4 Coordinación agente ↔ skill

Cada agente ya consume sus skills internamente — **no los invoques vos por encima** del agente. Mapeo:

| Agente                           | Skills que consume                                     |
| -------------------------------- | ------------------------------------------------------ |
| `frontend-architect-advisor`     | `senior-architect`                                     |
| `frontend-implementation-expert` | `senior-frontend`, `react-best-practices`              |
| `frontend-security-auditor`      | `senior-security`, `security-review`                   |
| `ux-ui-design-critic`            | `ui-design-system`, `frontend-design`, `ui-ux-pro-max` |

**Invocar skill directo (sin agente)** cuando: el cambio es menor (1 archivo, sin trade-offs), o cuando un agente terminó y necesitás un gate de verificación final: `verify`, `run`, `code-review`, `security-review`.

### 7.5 Paralelización

Cuando dos agentes son independientes (ej: `frontend-security-auditor` sobre el flujo de auth + `ux-ui-design-critic` sobre el form visual del login), **lanzarlos en el mismo mensaje** con múltiples `Agent` tool calls para que corran concurrentes. Si hay dependencia (ej: arquitectura → implementación), secuencial.

### 7.6 Gates obligatorios antes de PR

1. Si el diff toca `libs/features/auth`, `libs/infrastructure/storage`, cookies, tokens, CSP o `dangerouslySetInnerHTML` → `frontend-security-auditor` + skill `security-review`.
2. Si el diff toca `project.json`, tags NX, `depConstraints` o aliases → `frontend-architect-advisor` + `pnpm lint`.
3. Si el diff toca UI visible al usuario → `ux-ui-design-critic` + skill `verify`.
4. Siempre antes del PR → skill `code-review`.

---

## 8. Estilo de comunicación y commits

- Responder siempre en **español** (incluyendo análisis técnicos y mensajes al usuario).
- **Sin trailing summaries** — el usuario lee el diff. Terminar con el resultado, no con un resumen de lo hecho.
- Para decisiones técnicas pequeñas: **ejecutar directo**. Para decisiones con blast radius alto (arquitectura, deps, deletes masivos): **confirmar antes**.
- **Commits:** formato `type(scope): descripción breve` en español. **No** incluir `Co-Authored-By: Claude` ni ninguna firma de IA en el mensaje. Ej:
  - `feat(validation): wire zod to product form via productFormSchema`
  - `refactor(arch): Sprint Final — migrate tests to libs, delete dead code`
  - `test(component): add LoginForm + useProductActions integration tests`

---

## 9. Estado y pendientes vivos

Arquitectura Clean materializada (post-Sprint Final): libs extraídas con código real, 0 errores TS, 671 tests pasando. Próximos focos:

- Mover `apps/admin/src/services/cache/AuthCache.ts` → `libs/infrastructure/cache/`.
- Subir coverage threshold a 70% (hoy ~18% en lines).
- Cablear `zod` a los forms restantes: login, registro, usuario, categoría.
- Reemplazar `styled-components` residual con Tailwind.
- CI/CD (GitHub Actions) y Sentry wiring → Fase 3.
- Surface en UI: Reviews y Cupones (ya existen en schema). Ver `ROADMAP_ERP_ODOO.md` §P1.

Para roadmap completo a ERP → `ROADMAP_ERP_ODOO.md`.

---

## 10. Cómo verificar un cambio

Checklist mínimo antes de marcar una tarea como completa:

1. `pnpm type-check` → **0 errores**.
2. `pnpm lint` → 0 errores (warns aceptables, pero ideal bajar).
3. `pnpm test` → suite verde.
4. Si toca UI: levantar `pnpm dev` y validar **golden path + 1 edge case** en navegador (skill `verify` ayuda).
5. Si toca `.graphql`: `pnpm codegen` corrido y `generated/graphql.ts` commiteado en el mismo PR.
6. Si toca capas/tags/aliases: `pnpm lint` debe re-validar `@nx/enforce-module-boundaries`.
