# Plan: Migración a Best Practices — Happy Baby Style Admin

> Plan técnico-estratégico para migrar el panel **Happy Baby Style Admin** hacia una base
> **desacoplada (Clean Architecture + SOLID)**, con la capa de datos/estado modernizada,
> calidad de código alta y seguridad endurecida.
>
> **Complementa a** `ROADMAP_ERP_ODOO.md` (evolución funcional hacia ERP). Este plan es la
> **fundación técnica** sobre la que se construyen los módulos ERP; se aplica **interleaved**
> (se endurece a medida que se avanza), arrancando por **lo primordial inmediato**.
>
> **Skills usados para fundamentar:** `senior-frontend`, `react-best-practices`, `senior-security`, `senior-architect`.

---

## Context

El proyecto declara en su historial git "Clean Architecture + SOLID", pero el diagnóstico
muestra que **esos principios no están implementados**: la lógica de negocio vive dispersa en
30+ hooks, hay God components (modales de 850–1200 líneas), ~357 usos de `any`, duplicación
~70% entre Create/Edit, ~3% de cobertura de tests y hallazgos de seguridad reales. A la vez se
quiere evolucionar la app hacia un ERP (roadmap aparte), lo que **multiplicaría la deuda** si se
construye sobre la base actual.

**Decisión del usuario (esta conversación):**

- Migración **no conservadora**: abiertos a cambiar de librerías y adoptar mejores prácticas, no atados al stack actual.
- **Desacoplar** siguiendo Clean Architecture + SOLID de verdad (ports/adapters, casos de uso, DI).
- Modernizar la **capa de datos/estado**.
- Arrancar por **lo primordial inmediato**; la seguridad profunda se aborda en un **plan dedicado posterior** (los fixes críticos de seguridad sí entran ya, en Fase 0).
- Entregable: **plan completo con checklist** que se va marcando conforme se ejecuta.

**Resultado buscado:** una base donde cada módulo (existente y futuro-ERP) se construye sobre
capas limpias, tipadas, testeables y seguras, sin reescribir todo de golpe (vertical slices).

---

## Diagnóstico (estado actual, verificado)

| Dimensión          | Hallazgo original                                                                                                                                                                             | Estado                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Stack**          | ~~Vite 5~~ · React 18 · TS 5.x (strict ✅) · Apollo Client 3.13 · ~~styled-components 6~~ · react-hook-form 7 · react-router-dom 6.30.3 · GraphQL Codegen · ~~Jest~~                          | ✅ Fase 0+Stack — **pnpm 11 · NX 22 · Vitest 2 · Tailwind+shadcn/ui pendiente**              |
| **Arquitectura**   | "Clean Architecture" declarada pero **inexistente**: no hay `domain/` `application/` `infrastructure/`. Lógica de negocio en 30+ hooks (`useProductActions` 435 L, `useAuthManagement` 570 L) | ✅ domain+application+infrastructure para los 4 módulos; ⏳ UI/presentation roll-out         |
| **God components** | `EditProductModal` 1202 L, `CreateProductModal` 1175 L, `ProductDetailModal` 931 L, `ImprovedCreateUserModal` 930 L. Duplicación Create/Edit ~70%. Dos `CreateUserModal` coexistiendo         | ✅ Products descompuestos; ⏳ Users/Orders/Categories pendiente                              |
| **Tipos**          | ~357 `any`; conversores `convertGraphQLXToX(any)` en `src/types/unified.ts`; `noUnusedLocals/Parameters: false`                                                                               | ⏳ Fase 2 — mappers tipados creados para los 4 módulos; `any` en unified.ts aún pendiente    |
| **Validación**     | Sin zod/yup; regex de email duplicado; validación imperativa dispersa                                                                                                                         | ✅ Schemas zod para product/category/user/auth — ⏳ wiring a todos los formularios pendiente |
| **Tests**          | 4 archivos / 137 fuentes ≈ **3%**; `collectCoverage:false`; threshold 70% no aplicado                                                                                                         | ✅ Mecanism Fase 0; cobertura Fase 3                                                         |
| **Higiene**        | ~~51 `console.*`~~; 16 TODO; ~~sin script `lint` ni `format`~~                                                                                                                                | ✅ Fase 0 — **0 console.\*, lint/format/husky operativos**                                   |
| **Seguridad**      | `.env.*` ~~versionados~~ (sólo URLs, sin secrets); tokens en `localStorage`; authz solo cliente; ~~playground+sourcemaps en staging~~; ~~funciones auth en `window.*`~~                       | ✅ Críticos Fase 0; resto plan dedicado                                                      |
| **Deps**           | ~~`@apollo/client` en devDeps~~; ~~`apollo@2.34`~~; ~~`react-router-dom@6.20.1`~~                                                                                                             | ✅ Fase 0 — 0 vulns runtime                                                                  |
| **DevOps**         | Sin CI/CD; sin error tracking; ~~sin Error Boundary~~                                                                                                                                         | ✅ ErrorBoundary Fase 0; CI/CD Fase 3                                                        |

> ⚠️ **Descartado del diagnóstico previo:** la afirmación "axios con 16 CVEs" es falsa — **axios
> no está en el árbol de dependencias** (Apollo usa `fetch`). El `npm audit` real se corre en Fase 0.

---

## Decisión clave: capa de datos — **mantener Apollo, usarlo bien** (no migrar a TanStack)

Pediste justificar TanStack Query vs Apollo. Análisis honesto para **esta** app (GraphQL-first, entidades normalizadas):

| Criterio            | Apollo Client                                                                                                                    | TanStack Query                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Cache**           | **Normalizado por entidad (`__typename`+id)**: editás un producto en un lugar y se actualiza en todas las vistas automáticamente | Cache por _query key_, **no normalizado**: hay que invalidar manualmente cada key en cada mutation |
| **GraphQL**         | Nativo; integra con tu **codegen** (hooks `useProductsQuery` tipados ya generados) + uploads (`apollo-upload-client` ya en uso)  | Agnóstico; con GraphQL necesitás `graphql-request` y perdés la normalización                       |
| **Ergonomía async** | Buena, algo más verbosa                                                                                                          | **La mejor** (devtools, retry, stale-while-revalidate, infinite) — pero brilla sobre **REST**      |
| **Costo de migrar** | 0                                                                                                                                | Alto: reescribir data-layer + perder cache normalizado + re-cablear codegen                        |

**Veredicto:** para un **ERP con muchas entidades interrelacionadas**, el cache normalizado de
Apollo es la mejor práctica; TanStack Query es la mejor práctica cuando el backend es **REST**.
Los dolores detectados (sin optimistic updates, invalidación manual, `toast`/`console` en la capa
de datos) **no son límites de Apollo sino mal uso** — migrar a TanStack no los arregla y encima
cuesta la normalización. Esto **no es conservadurismo**: es elegir la herramienta correcta para GraphQL.

**Cómo SÍ modernizamos la capa de datos/estado (sin reemplazar Apollo):**

- **Apollo bien usado:** `typePolicies` (paginación/merge), `optimistic responses`, `errorPolicy`, fragmentos colocados, y la lógica fuera de los hooks (a casos de uso).
- **Zustand** para **estado de UI efímero** (sidebar, theme toggle, view-switcher, selección multi-fila): reemplaza Context+reducer hechos a mano donde sólo es UI. **No** para server-state.
- **zod** como validador único (formularios + boundaries), compartido entre Create/Edit.
- _(Alternativa evaluada y descartada: `urql` con Graphcache — churn sin payoff dado que codegen ya apunta a Apollo.)_

> Si en el futuro se integran APIs **REST** externas (ej. pasarela de pago, carriers), ahí sí
> TanStack Query entra para esas fuentes puntuales, conviviendo con Apollo para GraphQL.

---

## Arquitectura objetivo (Clean Architecture + SOLID, pragmática)

Regla de dependencia (hacia adentro): **presentation → application → domain**; **infrastructure**
implementa los puertos del domain/application. El **domain no importa React ni Apollo**.

```
src/
  core/
    domain/                 # entidades + invariantes + tipos de negocio (sin React/Apollo)
      product/  Product.ts          ProductRepository.ts (puerto/interface)
      order/    Order.ts            OrderRepository.ts
      user/     User.ts             UserRepository.ts
    application/            # casos de uso (orquestación), framework-agnostic
      product/  CreateProduct.ts  UpdateProduct.ts  ListProducts.ts
      ...
    shared/
      Result.ts             # Result<T,E> — sin throw a través de capas
      validation/           # esquemas zod como validadores de dominio
  infrastructure/           # adapters que implementan los puertos
    graphql/
      apollo/               # client, links, typePolicies (mover desde services/graphql.ts)
      repositories/         # ApolloProductRepository implements ProductRepository
      mappers/              # DTO GraphQL <-> entidad de dominio (reemplaza unified.ts `any`)
    storage/                # adapter de tokens (cookie httpOnly / fallback)
    monitoring/             # adapter de logger + error tracking (Sentry)
  presentation/
    features/
      products/  components/ (UI tonta)  containers/ (cablean casos de uso)  hooks/ (UI state fino)
      orders/    users/    categories/   auth/
    shared/
      ui/                   # design system: Button, Input, Card, DataTable, StatusBar...
      layout/
  app/                      # composition root
    di/                     # contenedor DI: cablea adapters -> casos de uso
    providers/              # Apollo, Auth, Theme, ErrorBoundary, Toaster
    router/
```

Principios aplicados:

- **Ports & Adapters (hexagonal):** los casos de uso dependen de **interfaces** de repositorio; Apollo queda **oculto** detrás. Si algún día se cambia Apollo, sólo cambian los adapters.
- **DI / Composition root:** contenedor liviano hecho a mano (factories + Context) — sin `reflect-metadata`. _(Opción `tsyringe` si se quiere DI por decoradores; evaluar, no obligatorio.)_
- **`Result<T,E>`** en application/domain; los errores se mapean a mensajes UI sólo en presentation.
- **Mappers tipados** reemplazan los `convertGraphQLXToX(any)` de `src/types/unified.ts` → mata `any` en el límite.
- **Hooks finos:** llaman casos de uso y sólo manejan estado de UI. La lógica de negocio sale de los 30+ hooks.
- **Container/Presentational + compound components:** rompe los God modals; el form schema zod se comparte entre Create/Edit (mata el ~70% de duplicación).

**Estrategia de ejecución: vertical slices.** No se reescribe todo de una. Se implementa **Products
como slice de referencia** end-to-end con las capas nuevas, y luego se replica el patrón a Orders,
Users, Categories y a cada módulo ERP nuevo (interleaved).

---

## Monorepo NX — Estructura objetivo y nomenclatura _(análisis senior-architect)_

> **Diagnóstico verificado (2026-05-30):** el proyecto NO es un monorepo NX real. `nx.json` y `project.json` existen pero todo el código vive bajo un único `src/`. NX se usa como **wrapper** para cache/runners — sin `apps/` ni `libs/`, sin tags, sin `enforce-module-boundaries`. Hay 20 895 archivos TS/TSX, 13 God components (>500 L), 55 archivos con `styled-components` coexistiendo con 42 archivos shadcn/Tailwind. Es un "NX-flavored single-package" — buena base, pero el monorepo está sin materializar.

### "Solo admin" + modular ≠ over-engineering — cómo escala a ERP

**Punto clave (responde a tu pregunta):** preparar la estructura para crecer a ERP **no implica** crear hoy apps que no existen. Significa **separar las capas en `libs/`** para que cuando ERP crezca, podamos elegir:

- **Caso (a) — ERP como feature libs dentro de admin** _(camino más probable para Happy Baby Style)_: cada módulo ERP (`feature-inventory`, `feature-accounting`, `feature-crm`, `feature-pos`) es una **`lib`** que `apps/admin/` consume. La UI sigue siendo un solo deploy con rutas (`/inventory`, `/accounting`, `/crm`). Ventajas: deploy único, sesión única, sin duplicación de auth/menu/layout.

- **Caso (b) — Apps separadas**: si algún módulo necesita despliegue propio o usuarios distintos (ej. POS para caja física, app de warehouse staff con UX simplificada), nace `apps/pos/` o `apps/warehouse/` que **reusa exactamente las mismas `libs/`**. Sin restructurar nada.

En ambos casos `libs/domain/*`, `libs/application/*`, `libs/infrastructure/*`, `libs/shared/*` se reusan sin tocar. **Esa es la inversión.** Hoy solo existe admin, pero estamos creando los **boundaries físicos** para que el crecimiento no genere deuda.

### Estructura objetivo del workspace

```
happy-baby-style/
├── apps/
│   └── admin/                                  # SPA actual (React + Vite + Tailwind/shadcn)
│       ├── src/
│       │   ├── app/                            # composition root
│       │   │   ├── providers/                  # ApolloProvider, AuthProvider, ThemeProvider, ErrorBoundary
│       │   │   ├── router/                     # react-router, lazy routes
│       │   │   └── di/                         # cablea adapters → casos de uso
│       │   ├── pages/                          # un componente por ruta (thin, delega a feature libs)
│       │   ├── main.tsx
│       │   └── styles.css                      # tailwind directives
│       ├── index.html
│       ├── vite.config.ts
│       ├── tsconfig.{app,spec}.json
│       └── project.json                        # tags: ["type:app","scope:admin"]
│
├── libs/
│   ├── domain/                                 # ⚪ PURE TS — sin React, sin Apollo, sin nada
│   │   ├── product/      src/{Product.ts, ProductRepository.ts, errors.ts, index.ts}
│   │   ├── order/        src/{Order.ts, OrderRepository.ts, errors.ts, index.ts}
│   │   ├── user/         src/{User.ts, UserRepository.ts, errors.ts, index.ts}
│   │   ├── category/     src/{Category.ts, CategoryRepository.ts, errors.ts, index.ts}
│   │   └── shared/       src/{Result.ts, DomainError.ts, validation/*Schema.ts}
│   │
│   ├── application/                            # 🟢 Casos de uso, framework-agnostic
│   │   ├── product/      src/{CreateProductUseCase.ts, UpdateProductUseCase.ts, ...}
│   │   ├── order/        src/{CreateOrderUseCase.ts, UpdateOrderStatusUseCase.ts, ...}
│   │   ├── user/         src/{CreateUserUseCase.ts, ActivateUserUseCase.ts, ...}
│   │   └── category/     src/{CreateCategoryUseCase.ts, ...}
│   │
│   ├── infrastructure/                         # 🟡 Adapters (Apollo, browser APIs OK)
│   │   ├── graphql/      src/{apollo/, repositories/, mappers/, generated/graphql.ts}
│   │   ├── storage/      src/{TokenStorage.ts, LocalTokenStorage.ts, SessionTokenStorage.ts}
│   │   ├── cache/        src/{AuthCache.ts, MemoryAuthCache.ts, LocalStorageAuthCache.ts}
│   │   └── monitoring/   src/{logger.ts, SentryAdapter.ts}
│   │
│   ├── features/                               # 🔵 UI por feature: containers + components + hooks
│   │   ├── products/     src/{components/, containers/, hooks/, index.ts}
│   │   ├── orders/       src/{components/, containers/, hooks/, index.ts}
│   │   ├── users/        src/{components/, containers/, hooks/, index.ts}
│   │   ├── categories/   src/{components/, containers/, hooks/, index.ts}
│   │   └── auth/         src/{components/, containers/, hooks/, index.ts}
│   │                                           # → futuro ERP: feature-inventory, feature-pos, etc.
│   │
│   ├── shared/
│   │   ├── ui/           src/components/{Button, Card, Dialog, DataTable, ...}     # design system
│   │   ├── icons/        src/                  # re-exports tree-shakables de lucide-react
│   │   ├── hooks/        src/{useDebounce.ts, useMediaQuery.ts, useClickOutside.ts}
│   │   ├── utils/        src/{cn.ts, formatters.ts, imageUtils.ts}
│   │   └── stores/       src/{useUIPreferencesStore.ts, useSidebarStore.ts}
│   │
│   └── testing/
│       ├── msw-handlers/ src/{auth.ts, products.ts, orders.ts, ...}
│       └── test-utils/   src/{renderWithProviders.tsx, fixtures/}
│
├── tools/
│   ├── eslint/                                 # reglas + tags compartidas, boundaries
│   └── tsconfig/                               # base.json, react.json, lib.json
│
├── nx.json
├── pnpm-workspace.yaml                         # packages: ["apps/*", "libs/**"]
├── tsconfig.base.json                          # paths: @happy-baby/<lib> → libs/<lib>/src/index.ts
├── package.json                                # workspace root, scripts NX
└── .nx/cache/
```

### Nomenclatura — convenciones obligatorias

| Elemento              | Convención                                         | Ejemplo                                                           |
| --------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| **Librería NX**       | `kebab-case` directorio, scope `@happy-baby/<lib>` | `libs/features/products/` → `from '@happy-baby/feature-products'` |
| **Carpetas internas** | `kebab-case`                                       | `libs/features/products/src/containers/`                          |
| **Componentes React** | `PascalCase.tsx`                                   | `ProductCard.tsx`, `EditProductDialog.tsx`                        |
| **Hooks**             | `camelCase.ts` con prefijo `use`                   | `useProductForm.ts`, `useDebounce.ts`                             |
| **Casos de uso**      | `PascalCase.ts` con sufijo `UseCase`               | `CreateProductUseCase.ts`                                         |
| **Repositorios**      | `PascalCase.ts` con prefijo de adapter             | `ApolloProductRepository.ts`                                      |
| **Mappers**           | `camelCase.ts` con sufijo `Mapper`                 | `productMapper.ts`                                                |
| **Stores Zustand**    | `camelCase.ts` con prefijo `use…Store`             | `useSidebarStore.ts`                                              |
| **Schemas zod**       | `camelCase.ts` con sufijo `Schema`                 | `productSchema.ts`                                                |
| **Tests**             | `*.spec.ts(x)` (convención NX)                     | `CreateProductUseCase.spec.ts`                                    |
| **Barrel exports**    | `index.ts` en raíz de `src/` por lib               | re-export público de la lib                                       |

> **Sobre tests legacy:** los tests actuales usan `*.test.ts(x)` en `__tests__/`. Vitest soporta ambos patrones — **no renombrar masivamente**. La convención `.spec.ts` aplica a tests nuevos en `libs/`. Los tests legacy se renombran cuando su archivo se mueve a su lib (no antes).

> **Inconsistencias actuales detectadas a corregir al mover:**
>
> - Servicios en mezcla `PascalCase` (`UnifiedAuthService.ts`) + `camelCase` (`authMiddleware.ts`) → unificar a la convención por tipo
> - Stores en `camelCase` sin prefijo `use` (`sidebarStore.ts`) → renombrar a `useSidebarStore.ts`
> - Hooks GraphQL `useProductsGraphQL` mezclan capas → desaparecen al moverse a `libs/application` (no es un hook UI, es un caso de uso)

### NX tags + boundary rules (reemplazan `eslint-plugin-boundaries`)

Cada `project.json` declara `tags` que definen QUÉ puede importar QUÉ. Se enforza por ESLint en cada PR con `@nx/enforce-module-boundaries`:

| Tag                   | Aplica a                                                       | Puede importar                                                                                   |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `type:app`            | `apps/admin`                                                   | `type:feature`, `type:application`, `type:infrastructure`, `type:ui`, `type:domain`, `type:util` |
| `type:feature`        | `libs/features/*`                                              | `type:application`, `type:domain`, `type:ui`, `type:util`                                        |
| `type:application`    | `libs/application/*`                                           | `type:domain`                                                                                    |
| `type:infrastructure` | `libs/infrastructure/*`                                        | `type:domain`, `type:util`                                                                       |
| `type:ui`             | `libs/shared/ui`, `libs/shared/icons`                          | `type:util`                                                                                      |
| `type:domain`         | `libs/domain/*`                                                | **nada** (puro)                                                                                  |
| `type:util`           | `libs/shared/utils`, `libs/shared/hooks`, `libs/shared/stores` | `type:util`                                                                                      |
| `type:testing`        | `libs/testing/*`                                               | cualquiera (solo desde `*.spec.ts`)                                                              |

**Regla de oro:** `domain` no importa NADA externo (ni React, ni Apollo). `application` solo importa `domain`. `infrastructure` puede importar `domain` y librerías externas (Apollo, browser APIs). `feature` y `ui` pueden importar React. **Una violación de tag rompe el lint → bloquea el merge.**

### Stack tecnológico — evaluación y veredicto

| Capa      | Stack actual                                                             | Veredicto                                                                  | Razón                                                                                                                                          |
| --------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | React 18 + Vite 5                                                        | ✅ **Mantener**                                                            | Admin SPA autenticada — Next.js/RSC no aporta (sin SEO, sin streaming público). Vite es el build más rápido del ecosistema.                    |
| Lenguaje  | TypeScript 5.2 strict                                                    | ✅ **Mantener**                                                            | Subir a `noUnusedLocals/Parameters` cuando God components estén descompuestos.                                                                 |
| Datos     | Apollo Client 3.13                                                       | ✅ **Mantener**                                                            | Cache normalizado por `__typename+id` es óptimo para ERP con entidades interrelacionadas. Decisión ya documentada arriba.                      |
| Forms     | react-hook-form 7 + zod 4 + @hookform/resolvers 5                        | ✅ **Mantener**                                                            | Ya integrados. Falta wiring a formularios pendientes (auth, user, category).                                                                   |
| State UI  | Zustand 5                                                                | ✅ **Mantener**                                                            | Ya migrado para UI efímero (sidebar, theme).                                                                                                   |
| Styling   | styled-components 6 (55 archivos) + Tailwind 4 + shadcn/ui (42 archivos) | 🟡 **Eliminar styled-components**                                          | Coexisten durante transición. Cada God component descompuesto pasa a Tailwind/shadcn. Meta: 0 archivos con styled-components al cerrar Fase 4. |
| Routing   | react-router-dom 6.30                                                    | ✅ **Mantener**                                                            | Estable, lazy routes ya soportadas.                                                                                                            |
| Testing   | Vitest 2 + RTL 16 + MSW 2.14                                             | ✅ **Mantener**                                                            | MSW ya instalado pero sin handlers. Crear `libs/testing/msw-handlers/`.                                                                        |
| Linting   | ESLint 8 + Prettier 3 + Husky 9 + lint-staged 17                         | 🟡 **Migrar `eslint-plugin-boundaries` → `@nx/enforce-module-boundaries`** | El plugin de NX integra con `tags` automáticamente; el actual requiere mantenimiento manual de paths.                                          |
| Monorepo  | NX 22 (wrapper)                                                          | 🔄 **Materializar workspace real**                                         | Fase 4 (abajo).                                                                                                                                |
| Errores   | ErrorBoundary global + logger                                            | 🟡 **Integrar Sentry**                                                     | Adapter ya stub; falta DSN + integración real (Fase 3).                                                                                        |
| CI/CD     | (ninguno)                                                                | 🔴 **Crear GitHub Actions**                                                | Bloquea visibility en PRs (Fase 3).                                                                                                            |

**Sin cambios de stack drásticos.** El stack actual está bien elegido — la deuda es estructural (no es monorepo real) y de capas (God components, styled-components residual), no de tecnología.

---

## Plan por fases — Checklist

### Fase 0 — Primordial inmediato (fundación + fixes críticos) — _empezar acá_

> **✅ Fase 0 COMPLETADA (2026-05-28):** 4 commits en `feature/migrate`:
> `9ef2eab` deps/tooling · `a6caa9c` Prettier sweep · `0a7318d` ErrorBoundary+logger · `035f5a5` ESLint hardening.
> Resultado verificado: 0 type errors · 0 console._ en producción · 0 vulns runtime · lint/format/husky operativos
> · ErrorBoundary global wrapeando la app · logger con nivel VITE_LOG_LEVEL · no-console: error en ESLint.
> `.env._`ya no estaban versionados (sólo URLs sin secrets en historia antigua — purga con`filter-repo`pendiente confirmación).`consistent-type-imports` desactivado (rompe enums) — retomar en Fase 2 tras refactors.

**Higiene de tooling y dependencias**

- [x] Mover `@apollo/client` de `devDependencies` → `dependencies` (es runtime)
- [x] Eliminar `apollo@2.34` (CLI legacy deprecado); conservar `@apollo/rover` — **pruneó 371 paquetes**
- [x] Actualizar `react-router-dom` a último 6.x estable (→ `6.30.3`, cierra el advisory del router)
- [x] Correr `npm audit` real: **0 vulns de runtime**; ~20 dev-only restantes (codegen/jest/eslint/rover) requieren `--force` (mayores) → tarea aparte, no se fuerzan
- [x] Agregar scripts `"lint"`, `"lint:fix"`, `"format"`, `"test:coverage"` + arreglar la config de ESLint que estaba rota
- [x] Husky + lint-staged: pre-commit corre `prettier --write` sobre archivos staged (eslint --fix desactivado — bloquearía por legacy errors durante migración)
- [x] Prettier format sweep en 133 archivos — commit aislado `a6caa9c` en `.git-blame-ignore-revs`
- [x] Activar `collectCoverage` + threshold 5% inicial (gradual → 70% en Fase 3); script `test:coverage` — _`noUnusedLocals/Parameters` diferido a fin de Fase 2_

**Fixes de seguridad críticos (el resto va al plan de seguridad dedicado)**

- [x] `.env.*` ya no estaban versionados — `.gitignore` correctamente configurado; `.env.example` como template
- [ ] Purgar historia antigua con `git filter-repo` (sólo URLs sin tokens, severidad baja) — _pendiente confirmación usuario_
- [x] Quitar exposición de funciones de auth en `window.*` (`src/utils/authUtils.ts`)
- [x] Desactivar source maps en staging/producción (`vite.config.ts`)
- [ ] Verificar que el **backend** aplique authz por rol en cada resolver (out-of-scope frontend)

**Plataforma de calidad transversal**

- [x] `ErrorBoundary` global en `src/components/shared/ErrorBoundary.tsx` — wrapeando toda la app en `App.tsx`
- [x] Abstracción `logger` en `src/utils/logger.ts` — 119 `console.*` reemplazados; `no-console: error` en ESLint
- [ ] Integrar error tracking (Sentry) detrás del adapter de monitoring — _Fase 3_
- [x] ESLint endurecido: `no-console: error`; reglas de formato delegadas a Prettier; `consistent-type-imports: off`

### Fase 1 — Esqueleto arquitectónico + slice de referencia (Products)

> **✅ Slice Products COMPLETADO (2026-05-28):** estructura de capas, casos de uso, mapper, repositorio, DI, modales descompuestos, y suite de 51 tests verdes. `npx tsc --noEmit` limpio.

**Fundación arquitectónica**

- [x] Crear estructura `core/domain`, `core/application`, `core/shared`, `infrastructure/`, `app/di`, `presentation/features`
- [x] Definir `Result<T,E>` y convención de errores (`core/shared/Result.ts`) — sin throw a través de capas
- [x] Agregar `eslint-plugin-boundaries` + `no-restricted-imports` overrides para hacer cumplir la regla de dependencia en tiempo de lint — presentación no puede importar `infrastructure` directamente (ni por `@/` ni por rutas relativas)

**Slice Products (domain → application → infrastructure → presentation)**

- [x] Entidad `Product` + puerto `ProductRepository` interface (`core/domain/product/`)
- [x] Casos de uso `CreateProduct` / `UpdateProduct` / `ListProducts` / `DeleteProduct` + `UploadProductImage` (`core/application/product/`)
- [x] `productMapper` tipado (DTO GraphQL ↔ entidad dominio) en `infrastructure/graphql/mappers/` — elimina `convertGraphQLProductToProduct(any)` de `unified.ts`
- [x] `ApolloProductRepository` implements `ProductRepository` — Apollo **oculto** detrás del puerto
- [ ] Mover config Apollo a `infrastructure/graphql/apollo/` con `typePolicies` + optimistic responses + `fetchPolicy` documentado por entidad (`cache-and-network` para listas, `cache-first` para detalle)
- [x] Esquema **zod** de Product compartido (Create/Edit) en `core/shared/validation/productSchema.ts`
- [x] Contenedor DI mínimo + `ProductProvider` / hook `useProductUseCases` que expone casos de uso (`app/di/products.tsx`)
- [x] Refactor `useProductActions` → hook fino que solo invoca casos de uso y maneja estado de UI local
- [x] Romper `EditProductModal`/`CreateProductModal` → container + `ProductFormFields` (presentational) + `useProductForm` + `styles.ts` compartidos (elimina ~70% duplicación)

**Tests del slice**

- [x] Tests unitarios de casos de uso: `CreateProductUseCase` (9), `UpdateProductUseCase` (7), `DeleteProductUseCase` (4), `UploadProductImageUseCase` (7) — **27 tests**, todos verdes
- [x] Tests de mapper: `productMapper.test.ts` — **24 tests** cubriendo `toDomain`, `toCreateDTO`, `toUpdateDTO`, null-handling, tipo Decimal, fechas UTC
- [ ] Tests de componente con **MSW** (Mock Service Worker) en lugar de Apollo MockedProvider — MSW intercepta a nivel HTTP, más realista y reutilizable entre tests
- [x] Agregar script `codegen:check` en `package.json` — `graphql-codegen && git diff --exit-code src/generated/graphql.ts` (v5 no tiene `--check` nativo; también sincronizado el archivo generado con el plugin actual)

### Fase 2 — Roll-out a módulos existentes + calidad/tipos

**Stack (completado en sesión 2026-05-28)**

- [x] pnpm como package manager (pnpm-lock.yaml reemplaza package-lock.json)
- [x] NX v22 workspace wrapeando el proyecto — `nx.json`, `project.json` con targets build/test/lint/type-check
- [x] Vitest v2 reemplaza Jest+ts-jest — todos los tests migrados a `vi.fn()`, `vi.mock()`, `vi.mocked()`
- [x] **Tailwind CSS v4 + shadcn/ui (base-nova)** — fundación completada (2026-05-28): `src/index.css` con CSS variables de marca, `cn()` util, `components.json`, todos los componentes base generados (Button, Input, Card, Tooltip, Badge, Label, Dialog, Select, Textarea, Separator). Card con compound pattern (`Card.Header`, `Card.Title`…). Props de backward-compat en Card/Input/Button. `pnpm type-check`: 0 errores. `styled-components` sigue vivo en páginas/layout — se reemplaza interleaved al reescribir cada componente.

**Clean Architecture — roll-out**

- [x] Replicar el patrón del slice a **Orders**, **Users**, **Categories** — domain + application + infrastructure (domain entities, use cases con tests, Apollo repositories con tests, DI containers) ✅ — UI/presentation ⏳ pendiente
- [ ] Unificar los dos `CreateUserModal` en uno (eliminar `ImprovedCreateUserModal`)
- [ ] Reemplazar **todos** los conversores `any` de `src/types/unified.ts` por mappers tipados → meta: `grep ": any" src | wc -l` < 20
- [ ] Activar `noUnusedLocals` y `noUnusedParameters` en `tsconfig.json` (diferido de Fase 0 — God components ya reescritos)
- [ ] Activar `@typescript-eslint/consistent-type-imports` (diferido de Fase 0 — ya no hay enums/valores mezclados)
- [x] zod schemas para product/category/user/auth en `core/shared/validation/` — ⏳ wiring a formularios login/registro/usuario/categoría pendiente
- [x] Zustand para estado de UI efímero — `useUIPreferencesStore` + `useSidebarStore` implementados con tests
- [ ] `lucide-react`: imports directos (`import Check from 'lucide-react/dist/esm/icons/check'`) — elimina barrel import que carga toda la lib
- [ ] Code-splitting (`React.lazy` + `Suspense`) de los modales/vistas pesadas — priorizar los 4 God components
- [ ] Resolver/retirar los 16 TODO (implementar o documentar como issue en el repo)

### Fase 3 — Testing + DevOps / observabilidad

> **En progreso (2026-05-30):** 20+ archivos de test añadidos en hooks, repositorios, servicios, stores. Cobertura: branches 72% · functions 43% · lines/statements 18%.

- [x] Subir threshold: 5% → **18%** (branches 72, functions 43, lines/statements 18) — ⏳ continuar hacia 30%/50%/70%
- [x] Tests unitarios de casos de uso + mappers al 100% — **todos los 4 módulos** (Products, Orders, Users, Categories)
- [x] Tests unitarios de repositorios Apollo — ApolloProductRepository (17), ApolloCategoryRepository (12), ApolloOrderRepository (12), ApolloUserRepository (16)
- [x] Tests de hooks: useProductActions, useUserActions, useOrderActions, useCategoryActions, useCategoryFilters, useCategoryMutations, useSidebarTooltip, useUploadNotifications, useSetUserPassword, useTags, useImageUpload, useSVGUpload, useRegisterForm (200+ tests totales)
- [x] Tests de servicios: TokenStorage (24 tests), AuthCache (25 tests)
- [ ] Tests de componente con MSW para flujos críticos (login, crear/editar producto, gestión de usuarios)
- [ ] Tests de integración: login → crear producto → transición de estado (flujo end-to-end con MSW)
- [ ] CI/CD (GitHub Actions): jobs `pnpm lint` + `type-check` + `codegen:check` + `pnpm test` + `nx run admin:build` en cada PR — aprovechar cache NX en CI
- [ ] Integrar Sentry detrás de `infrastructure/monitoring/` — el `ErrorBoundary` ya llama al adapter
- [ ] Dependabot/renovate para actualizaciones de dependencias
- [ ] Subir threshold de cobertura a 70% en `vitest.config.ts`

### Fase 4 — Migración a workspace NX real (libs/_ + apps/_) — _enfoque incremental_

> **Estrategia confirmada (2026-05-30):** vertical slices, **NO big-bang**. Cada sprint extrae una capa, valida que `apps/admin` sigue funcionando, y commitea. Aproximadamente 5-6 PRs revisables. El `src/` actual co-existe con las libs durante la transición y se vacía al final.
>
> **Por qué incremental:** un big-bang tocaría >200 archivos a la vez → revisión imposible, riesgo de regresión masiva, bloqueo de otros desarrollos durante 1-2 semanas. Incremental permite seguir avanzando otras tareas en paralelo y revertir un sprint sin perder el resto.

**Sprint 1 — Workspace scaffolding (mecánico, sin restructurar contenido)**

- [ ] Crear `apps/admin/` con `project.json` generado por `pnpm nx g @nx/react:application admin --bundler=vite --routing=true`
- [ ] Mover `src/` → `apps/admin/src/`, `index.html` → `apps/admin/`, `vite.config.ts` → `apps/admin/`
- [ ] Crear `tsconfig.base.json` con paths `@happy-baby/*` (vacíos por ahora)
- [ ] Actualizar `pnpm-workspace.yaml`: `packages: ["apps/*", "libs/**"]`
- [ ] Tags al `project.json` de admin: `["type:app", "scope:admin"]`
- [ ] Verificar: `pnpm nx serve admin` levanta como antes; tests verdes; `pnpm nx affected -t lint,test,type-check,build` funciona
- [ ] Actualizar `package.json` scripts root para usar `nx run admin:*` en lugar de scripts directos

**Sprint 2 — `libs/domain/*` + `libs/application/*` (pure TS, sin React)**

- [ ] Generar libs: `pnpm nx g @nx/js:lib domain-{product,order,user,category,shared} --bundler=tsc --unitTestRunner=vitest`
- [ ] Mover `apps/admin/src/core/domain/*` → `libs/domain/<entity>/src/`
- [ ] Mover `apps/admin/src/core/application/*` → `libs/application/<entity>/src/`
- [ ] Mover `apps/admin/src/core/shared/*` → `libs/domain/shared/src/`
- [ ] Tags: `libs/domain/* → ["type:domain"]`, `libs/application/* → ["type:application"]`
- [ ] Reescribir imports en `apps/admin` para usar `@happy-baby/domain-product`, `@happy-baby/application-product`, etc.
- [ ] Verificar: los tests de los 4 módulos (use cases + Result + mappers) corren desde la lib; `domain` no tiene react/apollo en su `package.json`
- [ ] Activar `@nx/enforce-module-boundaries` con las primeras 2 reglas (domain ⊥ application)

**Sprint 3 — `libs/infrastructure/*` (adapters Apollo / storage / cache / monitoring)**

- [ ] `libs/infrastructure-graphql/` ← `apps/admin/src/infrastructure/graphql/` (repos + mappers + Apollo client + generated)
- [ ] `libs/infrastructure-storage/` ← `apps/admin/src/services/storage/`
- [ ] `libs/infrastructure-cache/` ← `apps/admin/src/services/cache/`
- [ ] `libs/infrastructure-monitoring/` ← `apps/admin/src/utils/logger.ts` + stub `SentryAdapter.ts`
- [ ] **`apps/admin/src/services/` desaparece** (todo el contenido reubicado)
- [ ] Codegen actualizado: `codegen.yml` apunta a `libs/infrastructure-graphql/src/generated/graphql.ts`
- [ ] Boundary rules: `infrastructure → domain + util` (no puede importar application ni feature)

**Sprint 4 — `libs/shared/*` (UI, icons, utils, hooks, stores)**

- [ ] `libs/shared-ui/` ← `apps/admin/src/components/ui/` (shadcn/ui + design system)
- [ ] `libs/shared-icons/` ← crear re-exports tree-shakables de `lucide-react` (`import Check from '@happy-baby/shared-icons/check'`)
- [ ] `libs/shared-utils/` ← `apps/admin/src/utils/{cn,imageUtils,authUtils}.ts`
- [ ] `libs/shared-stores/` ← `apps/admin/src/stores/` (renombrar `sidebarStore.ts` → `useSidebarStore.ts`)
- [ ] `libs/shared-hooks/` ← hooks genéricos sin dominio (`useDebounce`, `useSidebarTooltip`, `useUploadNotifications`)
- [ ] Tags: `type:ui`, `type:util`

**Sprint 5+ — `libs/features/*` (un slice por sprint, interleaved con Clean Architecture roll-out)**

- [ ] `libs/feature-products/` — extraer `components/products/` + `hooks/useProduct*` + `app/di/products.tsx`
- [ ] `libs/feature-auth/` — extraer `components/auth/` + `hooks/useAuth*` + `contexts/AuthContext.tsx` (523 L → descomponer al mover)
- [ ] `libs/feature-orders/` — extraer cuando se descomponga la página Orders
- [ ] `libs/feature-users/` — extraer cuando se descomponga `Users.tsx` (1017 L), `CreateUserModal.tsx` (795 L), `PasswordManagementModal.tsx` (767 L), `UserSessionsManager.tsx` (829 L)
- [ ] `libs/feature-categories/` — extraer cuando categorías estén descompuestas
- [ ] Cada `apps/admin/src/pages/<X>.tsx` queda como adaptador delgado: importa el container de la feature lib y conecta al router

**Sprint final — Cleanup + boundaries totales**

- [ ] `apps/admin/src/` solo contiene `app/`, `pages/` y `main.tsx`. Todo lo demás está en `libs/`
- [ ] `apps/admin/src/types/unified.ts` **eliminado** (reemplazado por mappers en `libs/infrastructure-graphql/mappers/`)
- [ ] `eslint-plugin-boundaries` **eliminado** — reemplazado por `@nx/enforce-module-boundaries` con tags
- [ ] `libs/testing/msw-handlers/` + `libs/testing/test-utils/` listos para los MSW tests de Fase 3
- [ ] `tsconfig.base.json` con todos los path aliases finales y `composite: true` por lib
- [ ] Documento `tools/eslint/` con la matriz de tags y reglas
- [ ] Verificación: `pnpm nx graph` muestra el grafo de dependencias limpio (sin ciclos, sin violaciones)

**Verificación Fase 4:**

- `pnpm nx affected -t build,test,lint,type-check` ejecuta solo proyectos impactados por el diff
- `pnpm nx graph` visualiza el DAG sin violaciones de boundary
- `apps/admin` sigue funcionando idéntico para el usuario final (no hay cambios de UX)
- Coverage por lib reportada independientemente (NX puede agregar)
- Time-to-build con cache caliente: `pnpm nx run admin:build` reusa cache de libs no tocadas

### Seguridad — plan dedicado (follow-up, tras Fase 0)

> Se arma un plan propio. Cubre: migración de tokens `localStorage` → **cookies httpOnly/secure/SameSite**
> (requiere backend), CSRF, CSP headers, política de contraseñas (zxcvbn), authz server-side auditada,
> sanitización de render, rate limiting. Los ítems críticos inmediatos ya están en **Fase 0**.

---

## Archivos críticos — estado

**✅ Completados en Fase 0:**

- `package.json` — deps corregidas, scripts lint/format/test:coverage, husky
- `.gitignore` — `.env.*` excluidos; `.env.example` template creado
- `vite.config.ts` — sourcemaps off en staging/prod
- `src/utils/authUtils.ts` — window.\* removido
- `src/utils/logger.ts` — **NUEVO** logger abstraction
- `src/components/shared/ErrorBoundary.tsx` — **NUEVO** ErrorBoundary global
- `src/App.tsx` — ErrorBoundary wrapeando la app
- `.eslintrc.cjs` — arreglado (nunca corría), no-console: error, Prettier owner de formato
- `.git-blame-ignore-revs` — **NUEVO** skip del commit de formato

**✅ Completados en Fase 1 (2026-05-28):**

- `src/core/domain/product/` — entidad + puerto
- `src/core/application/product/` — 5 casos de uso + 27 tests verdes
- `src/core/shared/Result.ts` — Result<T,E>
- `src/core/shared/validation/productSchema.ts` — zod schema compartido
- `src/infrastructure/graphql/repositories/ApolloProductRepository.ts`
- `src/infrastructure/graphql/mappers/productMapper.ts` — 24 tests verdes
- `src/app/di/products.tsx` — composition root + ProductProvider
- `src/hooks/useProductActions.ts` — adelgazado (lógica → casos de uso)
- `src/components/products/EditProductModal.tsx` / `CreateProductModal.tsx` — descompuestos

**✅ Completados en Fase 2 — stack (2026-05-28):**

- `pnpm-lock.yaml` — reemplaza package-lock.json
- `nx.json` / `project.json` — NX workspace targets
- `vitest.config.ts` — Vitest v2 reemplaza Jest
- `src/index.css` — Tailwind v4 + CSS variables de marca
- `src/lib/utils.ts` — cn() utility
- `components.json` — shadcn/ui base-nova config
- `src/components/ui/Button.tsx` — shadcn (@base-ui/react) + CVA + compat props
- `src/components/ui/Input.tsx` — shadcn + compat props (leftIcon, rightIcon, label, error)
- `src/components/ui/Card.tsx` — shadcn + compound pattern + compat props
- `src/components/ui/{badge,label,select,textarea,separator,dialog,Tooltip}.tsx` — generados con shadcn

**✅ Completados en Fase 2 — Clean Architecture roll-out (2026-05-30):**

- `src/core/domain/order/` / `src/core/domain/user/` / `src/core/domain/category/` — entidades + puertos
- `src/core/application/order/` / `src/core/application/user/` / `src/core/application/category/` — casos de uso con tests
- `src/infrastructure/graphql/repositories/ApolloOrderRepository.ts` — 12 tests verdes
- `src/infrastructure/graphql/repositories/ApolloUserRepository.ts` — 16 tests verdes
- `src/infrastructure/graphql/repositories/ApolloCategoryRepository.ts` — 12 tests verdes
- `src/infrastructure/graphql/mappers/orderMapper.ts` / `userMapper.ts` / `categoryMapper.ts`
- `src/app/di/orders.tsx` / `src/app/di/users.tsx` / `src/app/di/categories.tsx` — DI containers
- `src/stores/useUIPreferencesStore.ts` / `src/stores/useSidebarStore.ts` — Zustand UI state con tests
- `src/core/shared/validation/categorySchema.ts` / `userSchema.ts` / `authSchema.ts` — zod schemas

**✅ Completados en Fase 3 — Tests (2026-05-30):**

- `src/hooks/__tests__/use{Product,User,Order,Category}Actions.test.tsx` — hooks principales testeados
- `src/hooks/__tests__/useCategoryFilters.test.ts` — 19 tests paginación/filtros/sorting
- `src/hooks/__tests__/useCategoryMutations.test.ts` — 16 tests create/update con validación
- `src/hooks/__tests__/use{SidebarTooltip,UploadNotifications,SetUserPassword,Tags,ImageUpload,SVGUpload,RegisterForm}.test.ts`
- `src/services/storage/__tests__/TokenStorage.test.ts` — 24 tests
- `src/services/cache/__tests__/AuthCache.test.ts` — 25 tests

**⏳ Pendientes (Fase 2 — roll-out arquitectura):**

- `src/services/graphql/` → mover a `infrastructure/graphql/apollo/` con typePolicies + fetchPolicy
- UI/presentation para Orders, Users, Categories (containers + components descompuestos)
- `src/components/users/ImprovedCreateUserModal.tsx` — unificar con `CreateUserModal.tsx`
- `src/types/unified.ts` — reemplazar conversores `any` por mappers tipados → meta: `< 20` ocurrencias
- `tsconfig.json` — activar `noUnusedLocals/Parameters` (diferido hasta que God components estén reescritos)
- `@typescript-eslint/consistent-type-imports` — reactivar (diferido de Fase 0)
- zod wiring a formularios: login, registro, usuario, categoría
- `lucide-react` — pasar a imports directos (eliminar barrel)
- `React.lazy` + `Suspense` en modales/vistas pesadas (4 God components restantes)
- Resolver/retirar 16 TODO
- Reemplazar `styled-components` restante con Tailwind (interleaved con cada God component)

## Verificación

- **Fase 0:** `npm run lint`, `npm run type-check`, `npm audit` limpios; pre-commit bloquea; `git ls-files | grep env` vacío; build de staging sin sourcemaps/playground; `console.*` = 0 (vía lint).
- **Fase 1:** slice Products funciona end-to-end con `npm run dev` (crear/editar producto); tests del slice en verde; la UI no importa Apollo directamente (sólo casos de uso).
- **Fase 2:** Orders/Users/Categories migrados; conteo de `any` baja drásticamente (`grep -rn ": any" src | wc -l`); un solo modal de creación de usuario.
- **Fase 3:** cobertura ≥70% en `npm run test:coverage`; CI verde en PR; Sentry recibe eventos de prueba.
- **Fase 4:** `pnpm nx graph` muestra DAG limpio sin violaciones; `apps/admin` funciona idéntico; `apps/admin/src/` solo contiene `app/`, `pages/` y `main.tsx`.
- **Funcional/UX:** levantar `npm run dev` y recorrer cada módulo migrado verificando que no hubo regresiones.
