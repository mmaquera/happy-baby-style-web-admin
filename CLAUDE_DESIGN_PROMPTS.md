# Claude Design Prompts — Happy Baby Style ERP

> **Cómo usar este archivo:**
>
> 1. Abrí [claude.ai](https://claude.ai/) (o Claude Desktop) con artifacts habilitados.
> 2. Copiá y pegá uno de los prompts numerados de este archivo en una nueva conversación.
> 3. Claude generará un **artifact HTML+Tailwind** (mockup visual interactivo) que podés inspeccionar, capturar y luego portar a `styled-components`.
> 4. Iterá pidiendo ajustes ("hacelo más denso", "cambiá la paleta a brand theme", etc.).
> 5. Una vez aprobado un mockup, copiá el HTML y úsalo como referencia para implementar el componente con styled-components en `src/`.
>
> **Por qué HTML+Tailwind y no React+styled-components:** Tailwind es la lingua franca de artifacts y produce mockups visuales fieles en una sola pasada, sin pelear con configuración. Sólo es para *visualización*. La implementación final usa styled-components (el stack del proyecto).
>
> **Acompaña a:** `ROADMAP_ERP_ODOO.md` (el plan estratégico).

---

## Preámbulo de contexto (pegar al inicio si la conversación no lo tiene)

> **Contexto del proyecto Happy Baby Style ERP**
>
> Estoy evolucionando un panel de admin de e-commerce (Happy Baby Style) hacia un ERP propio inspirado en Odoo 17+. Stack actual: React 18 + TypeScript + Vite + styled-components + Apollo GraphQL + react-hook-form + lucide-react. Necesito mockups visuales en HTML+Tailwind (single-file, autocontenido, con iconos de Lucide vía CDN o SVG inline) para validar la dirección de diseño antes de implementar.
>
> **Dos temas que conviven:**
>
> - **Brand theme** (actual, soft consumer):
>   - Primario: `#A285D1` (púrpura claro), Acento: `#FF7B5A` (coral), Secundario: `#5CBDB4` (turquesa)
>   - Fondo: `#F8F8F8`, Texto: `#2C2C2C` / `#8B8680`
>   - Fuentes: Quicksand (body), Montserrat (headings)
>   - Border radius: 16-20px, sombras generosas
>
> - **ERP theme** (nuevo, denso utilitario tipo Odoo):
>   - Primario: `#875A7B` (púrpura profundo Odoo), Acentos semánticos planos
>   - Fondo: `#F0EEEE`, Texto: `#212529` / `#6C757D`
>   - Fuentes: Inter o Open Sans/Roboto
>   - Border radius: 4-6px, sombras sutiles (`0 1px 2px rgba(0,0,0,0.05)`)
>   - Densidad: paddings 8-12px en filas, headers compactos
>
> Salvo que diga lo contrario, los mockups deben usar **ERP theme**. Mostrá data de ejemplo realista de productos de bebé (body, mamadera, biberón, pañal, juguete, etc.) en español.

---

## Índice de prompts

### Fase P1 — Base visual ERP
1. [Theme Showcase — paleta + tokens ERP vs Brand](#prompt-1--theme-showcase)
2. [App Shell — Sidebar + Header + Breadcrumbs](#prompt-2--app-shell)
3. [DataTable de Productos (list view con sort/filter/multi-select/bulk actions)](#prompt-3--datatable-productos)
4. [Search Panel — Filters / Group By / Favorites](#prompt-4--search-panel)
5. [StatusBar — estados clicables (Order workflow)](#prompt-5--statusbar)
6. [Coupons — nueva ruta sobre schema existente](#prompt-6--coupons)
7. [Reviews — nueva ruta sobre schema existente](#prompt-7--reviews)

### Fase P2 — Patrones ERP profundos
8. [Form View dedicado de Producto (header + tabs + chatter)](#prompt-8--form-view-producto)
9. [Chatter / activity log lateral](#prompt-9--chatter)
10. [Kanban View de Pedidos por status](#prompt-10--kanban-pedidos)
11. [Dashboard ERP con métricas reales](#prompt-11--dashboard)
12. [Inventory Module (transactions + stock alerts)](#prompt-12--inventory)

### Fase P3 — Módulos ERP nuevos
13. [CRM Pipeline (Leads/Opportunities Kanban)](#prompt-13--crm-pipeline)
14. [Purchase Order (form view ERP completo)](#prompt-14--purchase-order)
15. [Helpdesk Tickets](#prompt-15--helpdesk)
16. [Settings page con sub-secciones](#prompt-16--settings)

---

## Prompt 1 — Theme Showcase

```text
[PEGAR EL PREÁMBULO DE CONTEXTO ARRIBA]

Generá un artifact HTML+Tailwind con un "Design System Showcase" para Happy Baby Style ERP que tenga:

1. Un toggle en la parte superior para alternar entre Brand theme y ERP theme (data-attribute en <html>, sin frameworks).
2. Sección "Colors": swatches con el nombre del token, hex, y rol semántico (primary, secondary, success, warning, error, info, surface, background, text-primary, text-secondary, border).
3. Sección "Typography": muestra h1, h2, h3, body, caption, mono. Con la familia de fuente activa del tema.
4. Sección "Spacing scale": barras horizontales de 4, 8, 12, 16, 24, 32, 48, 64 px.
5. Sección "Border radius": cuadrados con border-radius 2, 4, 6, 8, 12, 16, 20 px.
6. Sección "Shadows": cards con shadow-sm/base/md/lg.
7. Sección "Components preview": render lado a lado de Button (primary/secondary/outline/ghost/danger, sizes sm/md/lg), Input (default/error/disabled), Badge (status), Card (con header/body/footer).

Cada token tiene que ser visualmente claro. Mostrá el hex al lado del swatch. El toggle Brand ↔ ERP debe re-renderizar todo el showcase aplicando el set de tokens correspondiente. Iconos: Lucide vía CDN.
```

---

## Prompt 2 — App Shell

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del shell completo de la app en ERP theme:

LAYOUT:
- Sidebar fijo a la izquierda, 240px expandido / 56px colapsado, color de fondo `#F8F9FA`, borde derecho `1px solid #DEE2E6`.
- Header superior fijo, 48px de alto, fondo blanco, borde inferior sutil.
- Área de contenido principal con padding 16px.

SIDEBAR:
- Logo "HBS ERP" arriba (compacto, 40px alto), con botón de colapsar al hado derecho.
- Search input "Buscar..." al tope del menú.
- Secciones de menú con encabezados en uppercase 11px (#6C757D): VENTAS, CATÁLOGO, INVENTARIO, CONFIGURACIÓN.
- Items con icono Lucide + label, altura 32px, hover background `rgba(135,90,123,0.08)`, activo con border-left 3px `#875A7B` y background `rgba(135,90,123,0.12)`.
- Items: Dashboard, Pedidos (badge "12" naranja), Cupones, Reseñas, Clientes (en VENTAS); Productos, Categorías, Imágenes (en CATÁLOGO); Movimientos, Alertas de Stock (badge "3" rojo), Almacenes (en INVENTARIO); Settings, Audit Log, Notificaciones (en CONFIGURACIÓN).

HEADER:
- Breadcrumbs a la izquierda: "Catálogo / Productos / Body de algodón orgánico 0-3m"
- Search global al centro (max-width 400px, icono lupa, placeholder "Buscar en toda la app...")
- A la derecha: icono campana con badge "5", icono ayuda, avatar de usuario circular con dropdown (nombre + rol + logout)

CONTENIDO:
- Mostrar un placeholder con un título "Body de algodón orgánico 0-3m" y un sub-toolbar con botones (Editar, Duplicar, Imprimir, kebab de más acciones).

Producir una sola pantalla autocontenida, sin tabs activos, solo la estructura.
```

---

## Prompt 3 — DataTable Productos

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind de la list view de Productos al estilo Odoo (ERP theme).

ESTRUCTURA TOP-DOWN:
1. Breadcrumbs: "Catálogo / Productos"
2. Title bar: H1 "Productos" + contador "(248)" + a la derecha: ViewSwitcher (List | Kanban | Form, con List activo), botón primario "+ Nuevo Producto", botón secundario "Importar", icono de Print, icono kebab.
3. Search panel: input grande "Buscar..." con dropdowns secundarios "▼ Filtros", "▼ Agrupar por", "▼ Favoritos". Debajo, chips de filtros activos: "Categoría: Bodies", "Stock > 0", "✕".
4. Bulk action bar (oculta hasta selección): "8 productos seleccionados — Archivar | Exportar | Cambiar categoría | Aplicar descuento | ✕"
5. DataTable:
   - Header: checkbox global, Imagen, Nombre, SKU, Categoría, Precio, Stock, Estado, Acciones
   - Headers con sort indicator (flecha) en Nombre y Stock
   - Filas (15 ejemplos): checkbox por fila, thumb 32x32px, nombre+descripción 2 líneas, SKU mono, badge categoría, precio en S/, stock con color (verde >10, naranja 1-10, rojo 0), badge estado (Activo verde / Inactivo gris), kebab de acciones
   - Densidad compacta: altura de fila 44px, padding horizontal 12px
   - Hover row: background `#F8F9FA`
   - Fila seleccionada: background `rgba(135,90,123,0.06)`
6. Footer paginación: "Mostrando 1-15 de 248" + controles Anterior/Siguiente + selector "15 / página"

DATOS de ejemplo (mezcla):
- Body algodón orgánico 0-3m | BODY-001 | Bodies | S/ 45.00 | Stock 23 | Activo
- Mamadera anti-cólico 250ml | MAM-014 | Alimentación | S/ 38.00 | Stock 5 | Activo
- Pañal premium talla 2 (x40) | PAN-202 | Pañales | S/ 89.00 | Stock 0 | Activo
- Sonajero osito | JUG-007 | Juguetes | S/ 22.00 | Stock 145 | Inactivo
- ... (12 más realistas de productos para bebé)

Pre-seleccioná 3 filas para que la bulk action bar se vea. Iconos Lucide.
```

---

## Prompt 4 — Search Panel

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del componente "Search Panel" estilo Odoo, mostrado en 3 estados lado a lado dentro del mismo artifact:

ESTADO 1: cerrado (sólo el search input)
ESTADO 2: dropdown "Filtros" abierto
ESTADO 3: dropdown "Agrupar por" abierto + chips de filtros activos abajo

CADA ESTADO mostrar:
- Input principal "Buscar productos..." con icono de lupa a la izquierda y X de clear a la derecha
- 3 dropdowns: "▼ Filtros", "▼ Agrupar por", "▼ Favoritos"

DROPDOWN "Filtros" (estado 2):
- Sección con headers en uppercase 11px
- Estado: ☐ Activos, ☐ Inactivos, ☑ Con stock, ☐ Sin stock
- Categoría: lista con search interna + checkboxes (Bodies, Mamaderas, Pañales, Juguetes, Alimentación, Higiene)
- Precio: dos inputs Min/Max
- Stock: dos inputs Min/Max
- Fecha creación: rango de fechas
- Botón "Aplicar" / "Limpiar"

DROPDOWN "Agrupar por" (estado 3):
- Radio buttons: ○ Sin agrupar, ◉ Categoría, ○ Estado, ○ Rango de precio, ○ Disponibilidad de stock, ○ Mes de creación

CHIPS ACTIVOS (estado 3, debajo del input):
- "Con stock ✕", "Categoría: Bodies, Mamaderas ✕", "Precio: 20-100 ✕"
- Link "Limpiar todo"

FAVORITOS dropdown (mencionar al hover, opcional):
- "Mis filtros guardados:", "Productos sin stock", "Bodies activos en promoción", "Nuevos del mes"
- Botón "+ Guardar filtros actuales"

ERP theme. Iconos Lucide. Diseño compacto y denso.
```

---

## Prompt 5 — StatusBar

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del componente "StatusBar" estilo Odoo para el workflow de una Orden. Mostrar 4 variantes en el mismo artifact (una debajo de otra), cada una representando un pedido en un estado diferente:

ESTADOS DEL FLUJO (en este orden):
Pendiente → Confirmado → Procesando → Enviado → Entregado
(Cancelado y Reembolsado como estados alternativos)

ESTRUCTURA DEL STATUSBAR:
- Una fila horizontal de "pills" conectados por líneas
- Cada pill: pequeño rectángulo con texto del estado, altura ~24px, esquinas redondeadas 4px
- Estado completado: background `#875A7B`, texto blanco
- Estado actual: background `#875A7B` con anillo de glow + texto blanco bold
- Estado futuro (disponible): background blanco, borde `#DEE2E6`, texto gris, clickeable
- Estado futuro (no disponible aún por flujo): background `#F8F9FA`, texto `#ADB5BD`, no clickeable
- Líneas conectoras: 1px, `#DEE2E6` (gris) entre futuros, `#875A7B` (sólido) entre completados
- A la derecha del statusbar: botones de acción contextuales según estado actual (ej: en "Confirmado" mostrar botones "Marcar como Enviado", "Cancelar")

LAS 4 VARIANTES:
1. ORD-001 (estado actual: Confirmado) — Pendiente ✓, Confirmado ●, Procesando ○, Enviado ○, Entregado ○. Acciones: [Procesar] [Cancelar]
2. ORD-002 (estado actual: Enviado) — todos previos ✓, Enviado ●, Entregado ○. Acciones: [Marcar como Entregado]
3. ORD-003 (estado: Entregado) — todos ✓ en verde, fin del flujo. Acciones: [Reembolsar]
4. ORD-004 (estado: Cancelado) — Mostrar el flujo cortado en "Pendiente" + un statusbar separado en rojo "Cancelado"

Cada variante con título arriba ("Pedido ORD-001 — Cliente: María García"). ERP theme. Iconos Lucide.
```

---

## Prompt 6 — Coupons

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind de la nueva ruta /coupons en estilo Odoo. Dos vistas dentro del mismo artifact con un tabs switcher arriba: "Lista" y "Crear cupón".

VISTA "LISTA":
- Breadcrumbs: "Ventas / Cupones"
- Title bar: H1 "Cupones (24)" + ViewSwitcher (List | Kanban con Kanban como nuevo) + Botón "+ Nuevo cupón"
- Search panel (input + filtros)
- DataTable:
  - Columnas: checkbox, Código, Nombre, Tipo descuento (badge: %, S/, Envío gratis), Valor, Válido desde, Válido hasta, Usos (12/100), Estado (badge: Activo/Expirado/Agotado), Acciones
  - 10 filas de ejemplo: BABY10 (10% off), MAMA50 (50 PEN flat), PRIMER (envío gratis primera compra), AGOTADO (100/100), etc.

VISTA "CREAR CUPÓN":
- Breadcrumbs: "Ventas / Cupones / Nuevo"
- StatusBar arriba: Borrador → Activo → Expirado
- Form view de dos columnas:
  - Izquierda (60%):
    - Tab activo "Detalles", otros tabs: "Aplicabilidad", "Uso"
    - Field "Código" (input + botón Generar)
    - Field "Nombre"
    - Field "Descripción" (textarea)
    - Field "Tipo de descuento" (radio: % | Monto fijo | Envío gratis)
    - Field "Valor del descuento" (input numérico con sufijo)
    - Field "Compra mínima" (input)
    - Fields "Válido desde" / "Válido hasta" (date pickers)
    - Field "Límite de usos totales" + "Límite por usuario"
  - Derecha (40%): Chatter component placeholder (timeline con eventos: "Cupón creado", "Activado por María")
- Botones inferiores: [Guardar] [Cancelar]

ERP theme, denso, Lucide.
```

---

## Prompt 7 — Reviews

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind de la nueva ruta /reviews (moderación de reseñas de productos) en estilo Odoo:

LAYOUT split: lista a la izquierda (40%), detalle de review seleccionada a la derecha (60%).

LISTA IZQUIERDA:
- Breadcrumbs: "eCommerce / Reseñas"
- Title bar: H1 "Reseñas (47)" + tabs "Todas | Pendientes (8) | Aprobadas | Rechazadas"
- Search input compacto
- Lista de cards de reseñas (cada item):
  - Avatar usuario + Nombre
  - Estrellas (1-5)
  - Título "Excelente calidad"
  - Producto reseñado (con thumb): "Body algodón orgánico 0-3m"
  - Fecha
  - Badge estado (Pendiente naranja / Aprobada verde / Rechazada rojo)
  - Indicador "📷 3" si tiene fotos, "👍 12 / 👎 2" votos

Mostrar 8 ítems de ejemplo, primero seleccionado (background `rgba(135,90,123,0.06)`)

DETALLE DERECHO:
- Header con avatar grande, nombre, fecha
- Producto reseñado con thumbnail y link
- 5 estrellas grandes (rating: 4)
- Título grande
- Cuerpo de la review (3 párrafos lorem en español sobre el producto bebé)
- 3 fotos thumbnails (placeholders)
- Sección "Votos": "12 personas marcaron como útil, 2 no"
- Botones de acción: [✓ Aprobar] [✗ Rechazar] [⚐ Reportar] [Responder]
- Chatter abajo (toggleable): timeline con eventos ("Review recibida 2026-05-20", "Marcada para revisión por sistema") + textarea de comentario interno

ERP theme, Lucide.
```

---

## Prompt 8 — Form View Producto

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del Form View de un producto al estilo Odoo (no es un modal, es una ruta dedicada `/products/:id`):

ESTRUCTURA:
1. Breadcrumbs: "Catálogo / Productos / Body de algodón orgánico 0-3m"
2. Toolbar superior:
   - Izquierda: botón "← Volver", contadores "1 / 248" con flechas prev/next
   - Centro: botones de acción "Guardar | Descartar"
   - Derecha: kebab con "Duplicar | Archivar | Eliminar | Imprimir | Exportar PDF"
3. Header del producto (banner blanco):
   - Avatar/foto grande del producto (96x96, esquinas 6px)
   - Title "Body de algodón orgánico 0-3m" (h1 inline-editable)
   - Subtitle "SKU: BODY-001 | Categoría: Bodies"
   - StatusBar: Borrador → Publicado → Pausado (publicado activo)
   - A la derecha: stat cards mini: "S/ 45.00 Precio" / "23 Stock" / "4.6 ★ (89)" / "127 Ventas"
4. Tabs: Detalles | Variantes | Imágenes | Inventario | Reseñas | Ventas | Historial
5. Contenido del tab activo "Detalles":
   - Dos columnas grid
   - Columna izq: Nombre, Descripción (rich-text mock), Categoría (dropdown), Tags (chips), Precio, Precio oferta, SKU
   - Columna der: Stock, Peso, Dimensiones, ¿Es activo? (toggle), ¿Destacado? (toggle), URL slug, Meta description
6. Sidebar derecho (Chatter, ~320px ancho):
   - Tabs: Mensajes | Log | Archivos
   - Timeline de actividad:
     - Hace 2h | María actualizó el precio (S/ 42 → S/ 45)
     - Hace 1d | Sistema | Stock bajó a 23
     - Hace 3d | Juan creó la variante "Talla 3-6m"
     - Hace 1w | María creó el producto
   - Textarea "Escribir mensaje..." con botón Enviar
   - Sección "Seguidores": 3 avatares + botón [+ Seguir]

ERP theme, denso. Lucide. Mantener proporciones: contenido principal ~70%, chatter ~30%.
```

---

## Prompt 9 — Chatter

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del componente Chatter aislado (lateral derecho de un form view) en versión EXPANDIDA, con todos los estados visibles:

ESTRUCTURA:
- Header con tabs: "Mensajes (12) | Log (47) | Archivos (3)"
- Sección "Seguidores": 4 avatares overlapping + "+ Seguir / Dejar de seguir" + tooltip "Te avisaremos de cambios"
- Composer:
  - Avatar usuario actual a la izquierda
  - Textarea "Escribir mensaje o /comando..." (mostrar placeholder)
  - Toolbar mini: 📎 adjuntar, 😀 emoji, @ mencionar, # tag
  - Botones: "Enviar mensaje" (primario) | "Log nota interna" (secundario)
- Timeline (estado "Mensajes"):
  - 5 entradas con avatar, nombre, timestamp, contenido, acciones (👍 reply edit delete)
  - Mensaje 1: María García | hace 2h | "Subí el precio a S/45 por ajuste de costos del proveedor"
  - Mensaje 2: SISTEMA | hace 5h | "Stock bajó a 23 — alerta de stock bajo creada" (con badge naranja "Auto")
  - Mensaje 3: Juan Pérez | ayer | "@maria Confirmar si seguimos con el proveedor Y" (con mención highlighted)
  - Mensaje 4 (reply nesteado): María García | ayer | "Sí, hasta fin de mes"
  - Mensaje 5: Juan Pérez | hace 3 días | "Agregué la variante talla 3-6m" + attachment chip "spec-3-6m.pdf"
- Estado tab "Log" (mostrar también, abajo o como switch):
  - Eventos del sistema en formato compacto, sin avatares, monospace en valores
  - "2026-05-26 10:42 | precio | S/ 42.00 → S/ 45.00 | maria@hbs.com"
  - "2026-05-26 08:15 | stock | 25 → 23 | sistema"
  - "2026-05-25 14:20 | tags | + ['organic', 'premium'] | juan@hbs.com"

ERP theme, ancho 360px, Lucide. Diseño compacto.
```

---

## Prompt 10 — Kanban Pedidos

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind de la vista Kanban de Pedidos por status, estilo Odoo:

ESTRUCTURA:
- Breadcrumbs: "Ventas / Pedidos"
- Title bar: H1 "Pedidos (87)" + ViewSwitcher (List | Kanban activo | Form) + "+ Nuevo pedido" + Filters
- Tablero horizontal scrolleable con 5 columnas:
  - PENDIENTE (12)
  - CONFIRMADO (18)
  - PROCESANDO (15)
  - ENVIADO (24)
  - ENTREGADO (18)
- Cada columna:
  - Header con título uppercase + contador + monto total "S/ 4,250" + kebab
  - Cards de pedidos draggable (mostrar handle visual)
  - Background columna: `#F8F9FA`
  - Ancho columna: 280px
- Cada card de pedido:
  - Header: "ORD-001" + badge color del status pequeño + chip prioridad (★)
  - Cliente: avatar + "María García"
  - Producto principal + "+3 más"
  - Total: "S/ 156.00" bold
  - Fecha: "Hace 2h"
  - Footer: 3 mini-tags (badges pequeños): "envío express", "primera compra", "cupón"
  - Hover state visible en una card
- Una card mostrar siendo "arrastrada" (rotada +2deg, sombra grande, opacity en su origen)
- Mostrar 4-5 cards por columna con data realista

Tip: usar overflow-x-auto en el contenedor de columnas. Cada columna con altura fija con scroll vertical interno. ERP theme. Lucide.
```

---

## Prompt 11 — Dashboard

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del Dashboard ERP de Happy Baby Style, denso y rico en métricas, estilo Odoo / Tremor:

ESTRUCTURA:
1. Breadcrumbs: "Dashboard"
2. Title bar: H1 "Dashboard" + selector de período (Hoy / 7 días / 30 días / Trimestre / Año) + botón "Exportar"
3. Fila de 4 stat cards (KPIs):
   - Pedidos del mes: 247 (+12% vs anterior) — sparkline
   - Ingresos: S/ 28,450 (+8%) — sparkline ascendente
   - Productos vendidos: 1,124 (+15%) — sparkline
   - Clientes nuevos: 89 (+22%) — sparkline
   Cada card: número grande, label, % change con flecha verde/roja, mini sparkline al fondo
4. Grid 2 columnas, principal a la izquierda (60%), sidebar derecho (40%):

   IZQUIERDA:
   - Card "Ingresos por mes" — gráfico de barras (12 meses) con tooltip activado en mayo
   - Card "Top 10 productos" — tabla compacta con thumb, nombre, ventas, ingresos
   - Card "Pedidos por status" — donut chart con leyenda lateral

   DERECHA:
   - Card "Pedidos pendientes" (lista compacta, 5 items con prioridad)
   - Card "Stock bajo" (lista con badge alerta, 4 items)
   - Card "Reviews pendientes de aprobación" (3 items con estrellas)
   - Card "Acciones rápidas" (4 botones grandes con icono: Nuevo producto, Nuevo pedido, Importar stock, Ver reportes)

DENSIDAD: padding cards 12px, headers 13px uppercase, números grandes 24px-32px. ERP theme. Gráficos pueden ser mockeados con SVG inline (sin librerías). Lucide.
```

---

## Prompt 12 — Inventory

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del módulo Inventory (nueva ruta `/inventory`) en estilo Odoo:

ESTRUCTURA con tabs principales: "Movimientos | Alertas de Stock | Almacenes | Productos"

PANTALLA con tab "Movimientos" activo:
1. Breadcrumbs: "Inventario / Movimientos"
2. Title bar: H1 "Movimientos de Inventario (1,247)" + "+ Nuevo movimiento" + filtros
3. Search panel con filtros: Tipo (compra/venta/devolución/ajuste/transferencia), Producto, Rango de fechas
4. Stat cards mini (3): "Stock total: 4,820 unidades" / "Movimientos hoy: 23" / "Alertas activas: 8"
5. DataTable de InventoryTransaction:
   - Cols: Fecha, Tipo (badge color: compra azul, venta verde, devolución amarillo, ajuste gris, transferencia púrpura), Producto (con thumb), Cantidad (con signo +/-), Referencia (orden ID), Usuario, Notas
   - 15 filas de ejemplo realistas: "2026-05-26 14:32 | Venta | Body 0-3m | -2 | ORD-2451 | sistema | -"
   - Filas alternadas con fondo sutil

PANEL LATERAL DERECHO colapsable (320px) con tab "Alertas de Stock":
- Filtro: Tipo (Low Stock | Out of Stock | Overstock)
- Lista de alertas activas:
  - 🔴 Pañal premium talla 2 — Stock: 0 (umbral 10) | "Hace 2 días"
  - 🟠 Mamadera 250ml — Stock: 3 (umbral 5) | "Hoy"
  - 🟠 Body 0-3m — Stock: 4 (umbral 8) | "Hace 1 día"
  - 🟡 Sonajero osito — Stock: 145 (umbral max 100, overstock) | "Hace 3 días"
- Cada alerta con botones [Resolver] [Crear PO]

Bottom: paginación. ERP theme, denso. Lucide.
```

---

## Prompt 13 — CRM Pipeline

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del módulo CRM con Pipeline Kanban estilo Odoo CRM. Este es módulo NUEVO (no existe en backend aún).

ESTRUCTURA:
1. Breadcrumbs: "CRM / Pipeline"
2. Title bar: H1 "Pipeline de Oportunidades" + selector de pipeline ("Ventas B2C ▼") + "+ Nueva oportunidad"
3. Resumen: "47 oportunidades activas · S/ 124,500 ponderado · S/ 198,200 esperado"
4. Tablero Kanban con 6 etapas (cols):
   - LEADS NUEVOS (15) — S/ 18k
   - CALIFICADOS (12) — S/ 32k
   - PROPUESTA ENVIADA (8) — S/ 45k
   - NEGOCIACIÓN (6) — S/ 38k
   - GANADO (4) — S/ 28k (color verde)
   - PERDIDO (2) — S/ 12k (color rojo, opacidad 0.7)
5. Cards de oportunidad (8 ejemplos distribuidos):
   - Logo/avatar de empresa
   - Nombre oportunidad: "Distribución 50 cunas - Hospital San Juan"
   - Empresa cliente: "Hospital San Juan"
   - Monto: "S/ 12,500"
   - Probabilidad: barra "60%"
   - Owner: avatar
   - Fecha cierre esperada
   - Tags: chips
   - Activity indicator (📞 llamada hoy / ✉️ email pendiente)
6. En cada columna mostrar progress bar mini representando avance vs objetivo

ERP theme con acento Odoo. Lucide. Datos realistas en español de productos para bebé B2B.
```

---

## Prompt 14 — Purchase Order

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del form view de una Purchase Order (módulo Purchase, NUEVO) en estilo Odoo:

ESTRUCTURA:
1. Breadcrumbs: "Compras / Órdenes de compra / PO-2026-042"
2. Toolbar: ← Volver | 12/47 | Guardar / Descartar | Confirmar / Cancelar | kebab
3. Header banner:
   - Title: "PO-2026-042"
   - Subtitle: "Proveedor: Textiles Andina S.A.C."
   - StatusBar: Borrador → Enviada → Confirmada → Recibida → Facturada (Confirmada activo)
   - Stat cards mini: Total S/ 28,400 | Items 4 | Fecha entrega 2026-06-05
4. Tabs: Líneas | Términos | Entrega | Facturación | Historial
5. Tab "Líneas" activo:
   - Header del PO: Proveedor (dropdown), Referencia, Fecha pedido, Fecha entrega esperada, Almacén destino
   - Tabla editable de items:
     - Cols: Producto (autocomplete), Descripción, Cantidad, Unidad, Precio unitario, Impuesto, Subtotal
     - 4 filas con productos: Body 0-3m algodón (200 uds × S/ 18 = S/3,600), Body 3-6m (200 × 18 = 3,600), Body 6-9m (200 × 18 = 3,600), Pañales talla 2 (50 × S/ 75 = 3,750)
     - Última fila: link "+ Agregar línea" / "+ Agregar sección"
   - Totales a la derecha (alineados): Subtotal, Impuestos (18%), Total grand
6. Sidebar derecho Chatter con 4 eventos
7. Bottom info: "Documentos relacionados: Factura proveedor F-2400, Recepción RC-0042"

ERP theme. Lucide. Datos peruanos (proveedor Andina, IGV 18%, soles).
```

---

## Prompt 15 — Helpdesk

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind del módulo Helpdesk (NUEVO) en estilo Odoo, vista split de Tickets:

ESTRUCTURA principal con tabs arriba: "Mis tickets | Equipo | Todos | Sin asignar"

LAYOUT split:
- Lista izquierda (35%) de tickets
- Detalle derecho (65%) del ticket seleccionado

LISTA IZQUIERDA:
- Search + filtros mini (SLA, prioridad, status)
- Ítems de ticket (10 ejemplos):
  - Indicador prioridad ▌ color (rojo urgente, naranja alta, gris normal)
  - Título: "Mi pedido llegó con un body manchado"
  - Customer: "María García"
  - Status badge + SLA indicator (clock icon con tiempo restante "2h 15min" o "Vencido" en rojo)
  - Tags mini: "devolución", "calidad"
  - Última actividad timestamp
- Item seleccionado con background highlighted

DETALLE DERECHO:
- Header: Ticket # + título grande + breadcrumbs internos (Customer / Pedido relacionado)
- StatusBar horizontal: Nuevo → Asignado → En progreso → Esperando cliente → Resuelto → Cerrado
- Cuerpo: cuerpo del ticket inicial (3 párrafos lorem) + atajos arriba (Asignar, Mover de equipo, Cambiar prioridad, Vincular a pedido)
- Sidebar interno derecho compacto con metadata: SLA (countdown), Prioridad, Equipo asignado, Asignado a, Tags, Customer card mini (con link al perfil), Pedido vinculado ORD-2451
- Composer + timeline de respuestas (3 mensajes alternados cliente/agente con avatares, timestamps, attachments)
- Botones bottom: Responder | Nota interna | Cerrar ticket

ERP theme, Lucide. Crear sensación de tablero de soporte productivo y denso.
```

---

## Prompt 16 — Settings

```text
[PEGAR PREÁMBULO]

Generá un artifact HTML+Tailwind de la página `/settings` consolidada estilo Odoo (panel de configuración del ERP):

ESTRUCTURA:
1. Breadcrumbs: "Configuración"
2. Title bar: H1 "Configuración" + search "Buscar ajuste..." (filtra tarjetas)
3. Tabs verticales / sidebar interno con módulos:
   General | Empresa | Usuarios y permisos | eCommerce | Inventario | Envíos | Pagos | Impuestos | Notificaciones | Lealtad | Integraciones | Avanzado

VISTA principal con tab "eCommerce" activo:
- Sub-secciones con cards (cada una con toggle si aplica + descripción + botón "Configurar"):
  - "Catálogo": permitir reseñas (toggle on), permitir wishlist (on), mostrar stock al cliente (on), precios con IGV incluido (off)
  - "Cupones y descuentos": activar cupones (on), generación automática (off), máximo descuento (input)
  - "Carrito": expiración carrito abandonado (input días), email recuperación (on)
  - "Reseñas": moderación manual (on), permitir fotos (on), votos útiles (on)
  - "Programa de Lealtad": activar puntos (on), conversión punto/sol (input), expiración (meses)

DENSIDAD: cards de settings con título 14px, descripción 12px gris, toggle a la derecha, padding 12px. Grid 2 cols en desktop. ERP theme, Lucide.

Adicionalmente al final mostrar UNA card grande "Store Settings" con un sub-form de campos:
- Nombre de la tienda, Email de contacto, Teléfono, Dirección física, Moneda principal (PEN), Idioma por defecto (es), Zona horaria (America/Lima), Logo (upload mock), Favicon (upload mock)
```

---

## Patrón de iteración recomendado

Una vez generado el artifact, iterá con prompts cortos como:

- "Hacelo 20% más denso, reducí padding de filas a 36px"
- "Cambiá a Brand theme manteniendo la estructura"
- "Reemplazá los iconos por SVG inline en lugar de CDN"
- "Mostrá el estado mobile (sidebar colapsado, tabla con scroll horizontal)"
- "Agregá un estado vacío (empty state) con ilustración SVG mock"
- "Convertí a React+styled-components siguiendo el tema en `src/styles/theme.ts`"
- "Hacelo accesible: roles ARIA, focus visible, contraste WCAG AA"

## Convención de captura

Cuando aprobés un mockup, guardá en `/docs/design-mockups/`:
- `01-theme-showcase.html`
- `02-app-shell.html`
- ... etc.

Cada uno con su HTML autocontenido. Después podés revisarlos visualmente abriéndolos en el navegador o servirlos con `npx serve docs/design-mockups`.

---

## Tips para el portado a styled-components

1. **Tokens primero:** antes de migrar JSX, asegurate que `src/styles/theme.ts` tenga los `erpTokens` definidos.
2. **Variant prop:** componentes nuevos (`<DataTable>`, `<StatusBar>`, `<Chatter>`) deben aceptar `density: 'comfortable' | 'compact'` para reutilizarse en ambos temas.
3. **No copiar Tailwind:** los mockups son **referencia visual**, no código de producción. Reescribí cada componente con styled-components siguiendo `DEVELOPMENT_STANDARDS.md`.
4. **Tabla:** la implementación real usa `@tanstack/react-table v8` (headless), no el HTML estático del mockup.
5. **Estados:** capturar pantalla del mockup en `default` / `hover` / `selected` / `loading` / `empty` / `error` antes de implementar.
