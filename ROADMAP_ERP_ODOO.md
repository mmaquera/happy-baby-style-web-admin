# Roadmap: Happy Baby Style → ERP propio inspirado en Odoo

> Documento estratégico. Define la evolución de **Happy Baby Style Admin** desde un panel de e-commerce hacia un **ERP propio inspirado en Odoo 17+**, manteniendo el stack actual.
>
> **Acompaña a:** `CLAUDE_DESIGN_PROMPTS.md` (prompts para generar mockups visuales del nuevo diseño con Claude artifacts).

---

## Context

**Happy Baby Style Admin Frontend** es un panel administrativo de e-commerce para productos de bebés construido con React 18 + TypeScript + Vite + styled-components + Apollo GraphQL.

Cubre hoy 5 módulos funcionales (Auth, Productos, Categorías, Pedidos, Usuarios) sobre un schema GraphQL que ya expone muchas más entidades de las que el frontend usa (reviews, cupones, inventario, carriers, shipping zones, loyalty points, notificaciones, audit logs).

**Decisión del producto:** evolucionar la app hacia un **ERP propio inspirado en Odoo 17+**, manteniendo el stack actual pero adoptando los patrones funcionales y de UX de Odoo y ampliando el alcance más allá de e-commerce.

**Por qué importa:** el schema backend ya está sobre-dimensionado vs. el frontend (capacidades ocultas). Hay una oportunidad enorme de superficie de funcionalidad sin tocar el backend, mientras se sienta una base UX tipo ERP.

---

## Fase 1 — Diagnóstico (estado actual)

### 1.1 ¿Qué es este sistema?

| Aspecto | Hallazgo |
|---|---|
| **Problema de negocio** | Gestión de tienda online de productos para bebés: catálogo, ventas, clientes |
| **Industria** | Retail / e-commerce especializado (baby & kids) |
| **Roles detectados** | `admin`, `staff`, `customer` (enum `UserRole`) |
| **Tipo de app** | Admin SPA tipo back-office (no consumer-facing) |

### 1.2 Funcionalidades existentes

**Rutas implementadas** (`src/App.tsx`):

| Ruta | Estado | Componente |
|---|---|---|
| `/login` | ✅ Completo | `Login.tsx` |
| `/` (Dashboard) | ⚠️ Básico | `Dashboard.tsx` (sin gráficos reales) |
| `/products` | ✅ Completo | `Products.tsx` + 10 componentes |
| `/categories` | ✅ Completo | `Categories.tsx` + 9 componentes |
| `/orders` | ✅ Funcional | `Orders.tsx` (solo lectura/filtros) |
| `/users` | ✅ Maduro | `Users.tsx` + 14 componentes |
| `/images` | 🚧 ComingSoon | — |
| `/analytics` | 🚧 ComingSoon | — |
| `/settings` | 🚧 ComingSoon | — |

**Schema GraphQL** (`src/graphql/schema.graphql`, ~1763 líneas): **48 queries + 55 mutations** que cubren mucho más que la UI actual:

- Expuestos en UI: User, Product, Category, Order, OrderItem, UserSession, UserAccount, UserAddress
- **En schema pero NO en UI** (oportunidades inmediatas): `Coupon`, `ProductReview`, `ReviewVote`, `InventoryTransaction`, `StockAlert`, `Carrier`, `OrderTracking`, `ShippingZone`, `ShippingRate`, `DeliverySlot`, `LoyaltyProgram`, `RewardPoint`, `PushNotification`, `NotificationTemplate`, `NewsletterSubscription`, `SavedPaymentMethod`, `Transaction`, `AuditLog`, `SecurityEvent`, `StoreSettings`, `TaxRate`, `Image`, `ShoppingCart`, `UserFavorite`.

### 1.3 Stack técnico

- **Frontend:** React 18 + TypeScript 5.2 + Vite 5
- **Estilos:** styled-components 6 con tema centralizado en `src/styles/theme.ts`
- **Estado/Data:** Apollo Client 3.13 + GraphQL Codegen
- **Router:** `react-router-dom` v6
- **Formularios:** `react-hook-form` v7.62
- **Notificaciones:** `react-hot-toast`
- **Iconos:** `lucide-react` v0.294 (**no Font Awesome**)
- **Fechas:** `date-fns`
- **Arquitectura:** Clean Architecture + SOLID (capas Domain/Application/Infrastructure/Presentation), 29 hooks personalizados

### 1.4 Sistema de diseño actual (`src/styles/theme.ts`)

| Token | Valor actual | Odoo 17+ | Gap |
|---|---|---|---|
| Color primario | `#A285D1` púrpura claro | `#875A7B` púrpura profundo | Moderado |
| Color acento | `#FF7B5A` coral | (no aplica) | — |
| Color secundario | `#5CBDB4` turquesa | (no aplica) | — |
| Fondo app | `#F8F8F8` | `#F0EEEE` | Menor |
| Fuente body | `Quicksand` | `Open Sans` / `Roboto` | Moderado |
| Fuente headings | `Montserrat` | `Open Sans` / `Roboto` | Moderado |
| Grid base | 4px (`spacing.1 = 4px`) | 8px | Compatible (4px es múltiplo) |
| Border radius preferido | 16-20px (`lg`/`xl`) | 4-8px | **Crítico para look ERP** |
| Iconos | `lucide-react` | Font Awesome + propios | Menor (lucide es válido) |
| Sombras | Generosas (`card: 0 10px 30px`) | Sutiles | Moderado |

**Diagnóstico visual:** la identidad actual es **consumer-friendly / soft** (pastel, cards generosas, radios grandes) — opuesta al look ERP de Odoo, que es **dense / utilitario** (radios pequeños, cards planas, mayor densidad por pantalla).

### 1.5 Patrones UX de ERP — estado actual

| Patrón Odoo | Estado actual | Archivo de referencia |
|---|---|---|
| Sidebar jerárquico colapsable | ✅ Sí | `src/components/layout/Sidebar.tsx` |
| Top-nav con buscador global | ⚠️ Parcial (no es búsqueda global) | `src/components/layout/Header.tsx` |
| Breadcrumbs contextuales | ❌ No existen | — |
| List view con sort/filter/paginación/multi-select | ❌ Falta (TODO en código) | `ProductListView.tsx` |
| Kanban view | ❌ No existe | — |
| Form view (header + tabs + chatter) | ❌ Hay modales, no form views dedicados | Modales en cada módulo |
| Statusbar de estados clicable (flujo) | ❌ Solo badges read-only | `OrderStatusBadge` |
| Chatter / activity log | ❌ No existe | — |
| Barra de búsqueda con Filters/Group By/Favorites | ⚠️ Filtros simples, sin Group By/Favorites | `ProductFilters.tsx` |
| Acciones en masa (multi-select + menú) | ❌ No existe | — |
| Vistas intercambiables (List/Kanban/Form) | ⚠️ Grid+List solamente | — |
| Print/Export desde toolbar | ⚠️ Botones en header, sin engine real | `ProductHeader.tsx` |

---

## Fase 2 — Mapeo Odoo y plan de evolución

### 2.1 Módulos de Odoo: alineación actual y gap

| Módulo Odoo | Alineación | Justificación | Falta para matchear |
|---|---|---|---|
| **eCommerce** | 🟢 Alta | Productos + Categorías + Cart + Reviews + Cupones (parcial) | Surface reviews/cupones en UI, conectar wishlist (`UserFavorite`) |
| **Sales** | 🟢 Alta | `Order` con flujo completo `pending → delivered`, tracking, transactions | Cotizaciones/quotations, pricelist, salesperson assignment |
| **Inventory** | 🟡 Media | Schema tiene `InventoryTransaction`, `StockAlert`, productos con `stockQuantity` | UI inexistente; faltan warehouses, ubicaciones, movimientos manuales |
| **Invoicing** | 🟡 Media | Hay `Transaction`, `TaxRate`, `PaymentMethod` | UI inexistente; faltan invoices/bills como entidad, journals, account moves |
| **CRM** | 🟠 Baja | Hay `User` (customer), historial de órdenes | Faltan leads, opportunities, pipeline kanban |
| **Marketing** | 🟠 Baja | `NewsletterSubscription`, `NotificationTemplate`, `PushNotification` | Campaign manager, segmentación, automation |
| **POS** | 🟠 Baja | `OrderStatus` workflow compatible | Faltan `POSSession`, terminal, cashier |
| **Purchase** | ⚫ Nula | — | Vendors, RFQ, PurchaseOrder |
| **Helpdesk** | ⚫ Nula | — | Tickets, SLAs, asignaciones |
| **HR** | ⚫ Nula | — | Employees, attendance, leaves |
| **Project** | ⚫ Nula | — | Project, Task, stages, timesheets |
| **Manufacturing** | ⚫ Nula | — | (probablemente no aplica al negocio) |

**Conclusión:** el sistema es hoy un **e-commerce admin** con base sólida para extenderse a **Inventory + Invoicing + CRM** con esfuerzo razonable. Los demás módulos (Purchase, HR, Project, Helpdesk) requieren entidades nuevas en backend.

### 2.2 Mejoras de diseño UI (vs. Odoo 17+)

| Área | Estado actual | Gap | Mejora concreta |
|---|---|---|---|
| **Paleta** | Púrpura claro pastel `#A285D1` | Moderado | Crear modo `ERP theme` con `#875A7B` primario, fondo `#F0EEEE`. Mantener tema actual como `Brand theme` togglable |
| **Tipografía** | Quicksand/Montserrat | Moderado | Migrar a Open Sans (body) + Roboto (headings) en `theme.ts`; o adoptar `Inter` (alternativa moderna que pega con ambos) |
| **Border radius** | 16-20px (look soft) | **Crítico** | Bajar a 4-8px para densidad ERP. Excepción: avatares circulares |
| **Densidad** | Padding generoso (24-32px) | **Crítico** | Crear variant `dense` en Card/Input/Button (paddings 8-12px) para list/form views |
| **Sombras** | Pronunciadas (`0 10px 30px`) | Moderado | Sombras sutiles (`0 1px 2px`) para look plano ERP |
| **Tablas** | Sin librería, JSX manual | **Crítico** | Adoptar `@tanstack/react-table` (headless, integra con styled-components) para sort/filter/group/multi-select |
| **Iconos** | lucide-react (válido) | Menor | Mantener lucide; alternativamente añadir alias para íconos clave de Odoo (`fa-solid` mapping) |
| **Statusbar** | Badges read-only | **Crítico** | Componente `<StatusBar>` con estados clicables (transiciones permitidas por rol) |
| **Chatter** | No existe | Alto | Componente `<Chatter>` lateral derecho en form views (comentarios, log de cambios, archivo adjunto) |
| **Breadcrumbs** | No existen | Alto (quick win) | Componente `<Breadcrumbs>` derivado de la ruta + contexto de entidad |

### 2.3 Mejoras funcionales (patrones UX ERP)

| Patrón | Estado | Acción |
|---|---|---|
| **Vistas intercambiables List/Kanban/Form** | Parcial (Grid+List) | Añadir `<ViewSwitcher>` global; implementar Kanban para Orders por status, para Products por categoría |
| **Form view dedicado (no modal)** | Modales solamente | Migrar edición a rutas dedicadas (`/products/:id`) con layout `<FormView>`: header + statusbar + tabs + chatter |
| **Statusbar clicable** | Solo badges | Componente con estados encadenados; click transiciona (con confirmación si requerido) |
| **Search bar con Filters/Group By/Favorites** | Filtros simples | Componente `<SearchPanel>` con dropdowns Filters/Group By/Favorites como Odoo |
| **Bulk actions** | No existe | Checkbox de selección por fila + barra contextual "N seleccionados" con acciones |
| **Breadcrumbs** | No | Implementar con `react-router` + contexto de entidad activa |
| **Chatter / activity log** | No | Aprovechar `AuditLog` del schema; UI con timeline |
| **Acciones rápidas en lista** | Sí (icon buttons) | Convertir a menú `<MoreActions>` (kebab) estándar ERP |
| **Print/Export** | Botones placeholder | Implementar export CSV/PDF para list views y print para form views |

---

## Tabla de prioridades final

Ordenado por **impacto/esfuerzo** (P1 = quick wins; P2 = mediano plazo; P3 = roadmap largo).

| # | Mejora | Área | Módulo Odoo | Impacto | Esfuerzo | Prioridad |
|---|---|---|---|---|---|---|
| 1 | **Theme dual: ERP tokens (radios 4-8px, sombras sutiles, densidad)** | UI | (transversal) | Alto | Bajo | **P1** |
| 2 | **Breadcrumbs contextuales** | UX | (transversal) | Alto | Bajo | **P1** |
| 3 | **DataTable con `@tanstack/react-table` (sort/filter/paginate/multi-select)** | UI/UX | (transversal) | Alto | Medio | **P1** |
| 4 | **Statusbar clicable (reemplaza `OrderStatusBadge`)** | UX | Sales | Alto | Bajo | **P1** |
| 5 | **Bulk actions (multi-select + menú contextual)** | UX | (transversal) | Alto | Bajo | **P1** |
| 6 | **Search panel con Filters / Group By / Favorites** | UX | (transversal) | Alto | Medio | **P1** |
| 7 | **Surface reviews y cupones en UI (ya están en schema)** | Función | eCommerce | Medio | Bajo | **P1** |
| 8 | **Migrar fuentes a Open Sans / Roboto (o Inter)** | UI | (transversal) | Medio | Bajo | **P1** |
| 9 | **Form view en ruta dedicada (`/products/:id`) con tabs** | UX | (transversal) | Alto | Medio | **P2** |
| 10 | **Chatter / activity log (usar `AuditLog`)** | UX | (transversal) | Alto | Medio | **P2** |
| 11 | **Módulo Inventory (UI sobre `InventoryTransaction`, `StockAlert`)** | Función | Inventory | Alto | Medio | **P2** |
| 12 | **Kanban view (Orders por status, Products por categoría)** | UX | Sales/eCommerce | Medio | Medio | **P2** |
| 13 | **Dashboard funcional con métricas reales (`dashboardMetrics` ya existe en schema)** | Función | (transversal) | Medio | Medio | **P2** |
| 14 | **Print/Export (CSV+PDF)** | UX | (transversal) | Medio | Medio | **P2** |
| 15 | **Módulo Invoicing (entidades `Invoice`/`Bill` nuevas en backend)** | Función | Invoicing | Alto | Alto | **P2** |
| 16 | **Módulo CRM (entidades `Lead`/`Opportunity` nuevas)** | Función | CRM | Medio | Alto | **P3** |
| 17 | **Módulo Purchase (entidades `Vendor`/`PurchaseOrder` nuevas)** | Función | Purchase | Medio | Alto | **P3** |
| 18 | **Módulo Helpdesk (entidades `Ticket` nuevas)** | Función | Helpdesk | Medio | Alto | **P3** |
| 19 | **Módulo HR (entidades `Employee` nuevas)** | Función | HR | Bajo | Alto | **P3** |
| 20 | **Módulo Projects (entidades `Project`/`Task` nuevas)** | Función | Project | Bajo | Alto | **P3** |
| 21 | **Settings + StoreSettings + TaxRate UI** | Función | (transversal) | Medio | Medio | **P3** |
| 22 | **Marketing (campañas, segmentación)** | Función | Marketing | Bajo | Alto | **P3** |

---

## Roadmap por fases

### **Fase P1 — Transformación visual + base UX ERP (1-2 sprints, ~3-4 semanas)**

**Objetivo:** que la app *se sienta* ERP sin tocar backend.

Archivos críticos a modificar:
- `src/styles/theme.ts` — añadir `erpTokens` (radios 4-8px, sombras sutiles, paleta `#875A7B`) y mecanismo de switch
- `src/components/ui/Card.tsx`, `Button.tsx`, `Input.tsx` — añadir variant `dense`
- `src/components/layout/` — agregar `<Breadcrumbs.tsx>` nuevo
- **Nuevos:** `src/components/data/DataTable.tsx` (TanStack Table), `src/components/data/SearchPanel.tsx`, `src/components/data/BulkActionsBar.tsx`, `src/components/data/StatusBar.tsx`, `src/components/data/ViewSwitcher.tsx`
- Refactorizar `ProductListView.tsx`, `Orders.tsx`, `Users.tsx` para usar `DataTable`
- Reemplazar `OrderStatusBadge` por `StatusBar` en form views de pedidos
- **Nuevo:** página de Reviews (`/reviews`) y Cupones (`/coupons`) consumiendo queries existentes

Reutilizables existentes:
- `useProductsGraphQL`, `useOrdersGraphQL`, `useUsersGraphQL` — ya hay hooks, solo cambia la presentación
- `theme.ts` ya tiene tokens; ampliar, no reemplazar

### **Fase P2 — Patrones ERP profundos + módulo Inventory (2-3 sprints, ~6-8 semanas)**

**Objetivo:** consolidar UX tipo Odoo y abrir el primer módulo ERP nuevo.

Trabajo principal:
- **Form view en ruta** — extraer la lógica de los modales `EditProductModal`, `EditCategoryModal`, etc., a páginas `/products/:id`, `/categories/:id`, `/orders/:id`. Patrón: `<FormViewLayout>` con header, statusbar, tabs (`Detalles`, `Variantes`, `Historial`, `Notas`), chatter lateral.
- **Chatter component** — consumir queries existentes `userAuditLogs`, `userSecurityEvents`. Componente `<Chatter resource="product" id={id} />`.
- **Inventory module** — nueva ruta `/inventory` con:
  - List view de `InventoryTransaction`
  - Form view para crear movimientos (`createInventoryTransaction`)
  - Vista de `StockAlert` (low stock, out of stock, overstock)
  - Dashboard de stock por producto
- **Kanban view** — `<KanbanView>` con drag-and-drop. Pedidos por status, productos por categoría.
- **Dashboard real** — consumir `dashboardMetrics`, `productAnalytics`, `orderAnalytics`, `userAnalytics` del schema; gráficos con `recharts` o `tremor`.
- **Print/Export** — `jsPDF` + `papaparse`.
- **Invoicing** (requiere backend nuevo) — definir entidades `Invoice`, `Bill`, `Journal` en el schema GraphQL y exponer UI.

### **Fase P3 — Expansión ERP completa (multi-trimestre)**

**Objetivo:** alcanzar paridad funcional con Odoo en módulos relevantes al negocio.

Trabajo por módulo (cada uno necesita backend nuevo + UI):
- **CRM:** `Lead`, `Opportunity`, `Pipeline`, vistas Kanban del pipeline
- **Purchase:** `Vendor`, `RFQ`, `PurchaseOrder`, `VendorBill`
- **Helpdesk:** `Ticket`, `TicketCategory`, `SLA`, asignaciones
- **HR:** `Employee`, `Department`, `Attendance`, `Leave`
- **Projects:** `Project`, `Task`, `Stage`, timesheets
- **Settings:** `/settings` real con sub-rutas (General, Taxes, Shipping Zones, Carriers, Loyalty Program, Notification Templates, Store Settings) — **mucho ya existe en schema**, solo falta UI
- **Marketing:** campañas, segmentación de usuarios, automation (newsletter ya existe)

---

## Recomendaciones arquitectónicas críticas

1. **No tirar el tema actual** — mantenerlo como `Brand theme` togglable. La identidad púrpura/coral/turquesa es un activo de marca. El `ERP theme` debe convivir.
2. **Adoptar TanStack Table** (`@tanstack/react-table` v8) — es headless, integra perfectamente con styled-components, y resuelve sort/filter/group/multi-select sin pelearse con tu stack.
3. **Migrar de modales a routes para edición** — los modales no escalan a forms ERP con tabs+chatter. Mantener modales solo para "create quick" y confirmaciones.
4. **Antes de añadir módulos nuevos, surface todo lo que ya está en el schema** — Reviews, Coupons, Inventory, Loyalty, Notifications, Audit, Settings: todo eso es UI nueva sobre backend existente. Es el ROI más alto.
5. **Consolidar el código de status** — hoy hay `OrderStatusBadge` ad-hoc por entidad. Crear un único `<StatusBar entity={...} states={...} currentState={...} onTransition={...} />` reusable.
6. **Densidad como prop, no como tema** — `<Card density="comfortable|compact">` permite mezclar look ERP (en tablas) con look consumer (en dashboard) sin duplicar componentes.

---

## Verificación

Cómo validar la evolución end-to-end:

1. **Por fase P1:**
   - Levantar `npm run dev` y comparar visualmente con capturas de Odoo 17+ (sales/list view, product/form view).
   - Recorrer `/products`, `/orders`, `/users`: confirmar que tabla soporta sort, filter, paginación, multi-select, bulk actions, breadcrumbs visibles, statusbar interactivo en pedidos.
   - Toggle de tema `Brand ↔ ERP` debe cambiar sin recargar (persistido en localStorage o user settings).
   - Página nueva `/reviews` y `/coupons` con datos reales del backend GraphQL.

2. **Por fase P2:**
   - Navegar a `/products/:id` y validar form view: header con datos clave, tabs, statusbar, chatter con timeline lateral.
   - Crear movimiento de inventario manual en `/inventory` y verificar que `StockAlert` se actualiza.
   - Cambiar entre vistas List/Kanban/Form en `/orders` sin perder filtros aplicados.
   - Exportar listado de productos a CSV y form de pedido a PDF.

3. **Por fase P3:**
   - Pipeline CRM con leads convertibles a orders.
   - Workflow PO completo: crear RFQ → confirmar PO → recibir → factura proveedor.
   - Ticket Helpdesk creado, asignado, escalado por SLA.

4. **Tests:**
   - Unit tests para nuevos componentes (`DataTable`, `StatusBar`, `Chatter`, `SearchPanel`) con Jest + Testing Library (ya configurado: `jest.config.js`).
   - Integration tests para flujos críticos (crear orden → transicionar estado → ver chatter): `test:integration` script ya existe.

---

## Archivos críticos a revisar antes de empezar

- `src/App.tsx` (35-69) — routing actual, donde añadir rutas nuevas
- `src/styles/theme.ts` — tokens de diseño, fuente de verdad
- `src/components/layout/Sidebar.tsx` — navegación principal, añadir nuevos módulos
- `src/components/products/ProductListView.tsx` — TODO de sorting/filtering visible
- `src/graphql/schema.graphql` — el inventario de oportunidades sin UI (reviews, coupons, inventory, loyalty, notifications, audit, settings)
- `src/hooks/` (29 hooks) — patrón a seguir para nuevos módulos
- `src/types/unified.ts` — convención de tipos unificados
- `DEVELOPMENT_STANDARDS.md`, `ERROR_HANDLING_STANDARDS.md` — estándares del proyecto a respetar
