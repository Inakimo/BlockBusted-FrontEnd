# BlockBusted — UI Design Specifications

## Design System

### Identity
**BlockBusted** is an online movie store with a **retro comic-book / vintage cinema aesthetic**. Think old movie posters, comic panels, bold ink outlines, and pop-art colors. Every element should feel like it belongs on a marquee or a comic page.

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#0F0E17` | Page background (near-black, deep indigo) |
| `cream` | `#FFF8E7` | Primary text on dark backgrounds |
| `card` | `#FFFFFF` | Card / form backgrounds |
| `yellow` | `#FFD700` | Primary CTA buttons, badges, accents |
| `red` | `#E53935` | Prices, destructive actions, danger states |
| `blue` | `#1E88E5` | Category labels, links, focus rings |
| `black` | `#000000` | Borders, shadows, text on light backgrounds |
| `muted` | `#6B7280` | Secondary text, disabled states |

### Typography
- **Display / Headings:** `Bangers` (Google Fonts) — uppercase, letter-spacing 0.05em. Used for all `h1`–`h6`, titles, badges, prices.
- **Body / UI:** `Montserrat` — weights 400 / 600 / 700 / 800. Used for labels, body text, buttons.

### Border & Shadow System (Comic Ink Style)
All interactive elements use **solid black borders + hard offset box-shadows** (no blur). This creates the comic panel / sticker effect.

| Component tier | Border | Shadow |
|----------------|--------|--------|
| Cards, modals | `3px solid #000` | `4px 4px 0px #000` |
| Buttons (primary) | `3px solid #000` | `4px 4px 0px #000` |
| Inputs | `3px solid #000` | focus: `3px 3px 0px #1E88E5` |
| Error boxes | `3px solid #E53935` | `3px 3px 0px #000` |

**Hover effect on buttons and cards:** `transform: translate(-2px, -2px)` + increase shadow to `6–7px 6–7px 0px #000`. Creates a "lift" feeling.
**Active/press effect:** `transform: translate(2px, 2px)` + reduce shadow to `1–2px`.

### Spacing & Layout
- Max content width: `1280px`, centered, `padding: 0 1.5rem`
- Section padding: `2rem 1.5rem`
- Grid gap: `1.5rem`
- Border radius: `8–12px` on cards and inputs

---

## Screen 1 — Navigation Bar (all pages)

**Height:** 72px  
**Background:** `#000000`  
**Bottom border:** `4px solid #FFD700`  
**Box shadow below border:** `0 4px 0 #E53935` (creates a double-stripe effect: yellow then red)  
**Position:** sticky top

**Layout (horizontal flex, space-between):**
- **Left:** Logo image (`/logo.png`), height 58px. On hover: scale 1.06, slight rotation -1deg, drop-shadow turns red.
- **Right:** Navigation links list, horizontal, gap 1.5rem.

**Link styles:**
- Regular links: `#FFF8E7`, font 0.85rem, weight 700, uppercase. Hover → `#FFD700`
- "Registrarse" button: yellow pill (`#FFD700`), black text, `border: 3px solid #000`, `box-shadow: 4px 4px 0 #000`, border-radius 8px. Hover lifts.
- "Salir" button: muted gray `#9CA3AF`, same hover → yellow.

**Responsive (≤768px):** Reduce logo to 42px, reduce gap to 0.9rem.

**Link sets by role:**
- Guest: Catálogo · Iniciar sesión · [Registrarse pill]
- COMPRADOR: Catálogo · Carrito · Mis órdenes · [username] · Salir
- VENDEDOR: Catálogo · Mis películas · [username] · Salir
- ADMIN: Catálogo · Categorías · Usuarios · Órdenes · [username] · Salir

---

## Screen 2 — Catálogo (Home, public)

**Background:** `#0F0E17`

**Header row (flex, space-between, align-items center):**
- Left: `<h1>` "Catálogo" — Bangers font, large, cream color
- Right: Category filter — label "Categoría" (small, uppercase, muted) + `<select>` styled with black border, comic shadow. Options: "Todas" + list of categories.

**Notification banner (conditional, full width):**
- Success: green-tinted background, black border, green text — "¡Película agregada al carrito!"
- Error: red-tinted background, red border — error message from backend

**Movie grid:**
- CSS Grid, `repeat(auto-fill, minmax(220px, 1fr))`, gap 1.5rem
- Empty state: centered paragraph "No hay películas en esta categoría."

**Loading state:** centered paragraph "Cargando películas..."

**Each card → see Screen 3 (Movie Card)**

---

## Screen 3 — Movie Card (TarjetaPelicula)

**Card container:**
- Background: `#FFFFFF`
- Border: `3px solid #000`
- Box-shadow: `4px 4px 0 #000`
- Border-radius: 10px
- Flex column
- Hover: lifts (`translate(-3px,-3px)`, shadow `7px 7px 0 #000`)

**Image area (top, fixed height 200px):**
- `object-fit: cover`
- Border-bottom: `3px solid #000`
- No image fallback: centered 🎬 emoji (3.5rem), red color, light red background
- **Discount badge** (absolute, top-right corner): yellow pill (`#FFD700`), black text, Bangers font, black border + shadow. Shows "10% DTO" style text. Only visible when discount > 0.

**Card body (padding 0.9rem, flex column, gap 0.35rem):**
- **Title:** Bangers, 1.15rem, black, uppercase
- **Category:** 0.72rem, blue (`#1E88E5`), bold, uppercase, high letter-spacing
- **Price row:**
  - If discounted: original price in muted gray with strikethrough + final price in red Bangers 1.3rem
  - If no discount: just the price in red Bangers
- **Stock:** small muted text "Stock: X"

**Action area (bottom of card, pushed with `margin-top: auto`):**
- If COMPRADOR + stock > 0: quantity input (58px wide, centered number) + yellow CTA button "Agregar al carrito"
- If stock = 0: muted uppercase text "Sin stock"
- If not logged in or VENDEDOR/ADMIN: no action shown
- CTA button: yellow, black border 3px, shadow `3px 3px 0 #000`, press effect on active

---

## Screen 4 — Login

**Layout:** centered vertically and horizontally, page background `#0F0E17`

**Card (max-width 460px):**
- Background: `#FFFFFF`
- Border: `3px solid #000`
- Border-radius: 12px
- Box-shadow: `6px 6px 0 #000`
- Padding: 2.5rem 2rem

**Title:** "Iniciar sesión" — Bangers, 2.2rem, black, text-shadow `2px 2px 0 #FFD700` (yellow shadow on black text)

**Error box (conditional, above form):**
- Light red background, dark red text, `3px solid #E53935`, shadow `3px 3px 0 #000`

**Form fields (vertical stack, gap 1.1rem):**
- Each field: label (0.75rem, uppercase, weight 700, dark gray) + input below
- Input: light gray background `#f9fafb`, black text, `3px solid #000`, border-radius 8px, padding 0.6rem. Focus: blue border + blue offset shadow.
- Fields: Email, Contraseña

**Submit button (full width):**
- Yellow `#FFD700`, black text, black border 3px, shadow `4px 4px 0 #000`, uppercase, weight 800
- Loading state: text changes to "Ingresando...", disabled + opacity 0.5

**Footer link:**
- "¿No tenés cuenta? Registrate" — muted gray + blue underlined link. Hover → red.

---

## Screen 5 — Registro

Same layout and card as Login.

**Title:** "Registrarse"

**Fields (vertical stack):**
- Username, Nombre, Apellido, Email, Contraseña
- Role select: options COMPRADOR / VENDEDOR

**Submit button:** "Crear cuenta" → loading "Registrando..."

**Footer:** "¿Ya tenés cuenta? Iniciá sesión"

---

## Screen 6 — Carrito (COMPRADOR)

**Background:** `#0F0E17`

**Header row:**
- Left: `<h1>` "Mi carrito" — Bangers, cream
- Right: "Vaciar carrito" — secondary button (outlined, light background, black border, press effect)

**Empty state:** centered "Tu carrito está vacío."

**Items list (vertical stack, gap):**

Each item row (card-like, white background, black border, shadow):
- Left section: movie title (bold, dark) + price + discount % if applicable
- Center section: quantity controls — minus button `−` | number | plus button `+` (each button: circular or square, black border, shadow, press effect)
- Right section: "Quitar" button (red text or outlined red)

**Footer (bottom of page, right-aligned):**
- "Confirmar compra" — large yellow CTA button. Loading state: "Procesando..." + disabled.

---

## Screen 7 — Mis Órdenes (COMPRADOR)

**Background:** `#0F0E17`

**Title:** `<h1>` "Mis órdenes" — Bangers, cream

**Empty state:** "No tenés órdenes todavía."

**Orders list (vertical stack):**

Each order card (white background, black border, shadow):
- Header row: Order ID + date + status badge + total
- **Status badge:**
  - CONFIRMADA: green background, black text, black border, shadow
  - CANCELADA: red background, white or black text, black border, shadow
- Order details (collapsed or always visible): table or list of items — title, quantity, unit price, discount %, subtotal
- Footer of card: "Cancelar orden" button — only if status is CONFIRMADA. Red outlined button, press effect.

---

## Screen 8 — Mis Películas (VENDEDOR)

**Background:** `#0F0E17`

**Title:** `<h1>` "Mis películas" — Bangers, cream

### Create form section

White card, black border, shadow. Title "Agregar nueva película".

Fields (some in a row — precio / stock / categoría side by side):
- Título (text)
- Descripción (textarea, taller)
- Precio ($) | Stock | Categoría (select) — 3-column row on desktop
- Submit: "Crear película" yellow CTA

Error box (same style as Login) shown above form if backend error.

### Movie list

Each movie card (white, black border, shadow):

**Card header row:**
- Left: title (Bangers, black) + meta line (category · $price · discount% · Stock: X)
- Right: action buttons row — Editar / Stock / Descuento / Fotos / Eliminar

Button styles:
- Editar / Stock / Descuento / Fotos: small outlined buttons, black border, shadow, press effect
- Eliminar: red text or red outlined, same shadow system

**Inline panels (appear below card header when button clicked, toggle):**

Each panel is a light-gray inset section inside the card:

- **Editar panel:** fields for Título, Descripción, Precio, Categoría + Guardar / Cancelar
- **Stock panel:** single number input + Guardar / Cancelar (horizontal row)
- **Descuento panel:** single number input 0–100 + Guardar / Cancelar (horizontal row)
- **Fotos panel:**
  - Grid of existing photo thumbnails (small, rounded, each with a "Quitar" button below)
  - Input for new URL + "Agregar" button
  - "Cerrar" button

---

## Screen 9 — Categorías (ADMIN)

**Background:** `#0F0E17`

**Title:** `<h1>` "Categorías" — Bangers, cream

**Create form (top, white card):**
- Single text input "Descripción" + "Crear categoría" yellow CTA button (horizontal row)
- Error box if 409 conflict

**Categories list (vertical stack or table):**

Each row (white card or table row):
- Category name
- "Editar" button → shows inline input to edit name + Guardar / Cancelar
- "Eliminar" button (red) → soft delete

---

## Screen 10 — Usuarios (ADMIN)

**Background:** `#0F0E17`

**Title:** `<h1>` "Usuarios" — Bangers, cream

**Users table or card list:**

Each user row:
- Username · Email · Current role
- Role `<select>` with options ADMIN / VENDEDOR / COMPRADOR + "Cambiar" button
- "Eliminar" button (red)

Table style: white background, black border, each row separated by thin border. Header row with uppercase bold labels.

---

## Screen 11 — Órdenes Admin (ADMIN)

**Background:** `#0F0E17`

**Title:** `<h1>` "Órdenes" — Bangers, cream

**Orders table:**
- Columns: ID · Fecha · Comprador · Estado · Total
- Status badges same as Screen 7 (CONFIRMADA green / CANCELADA red)
- Expandable detail rows or separate card per order showing items

---

## Screen 12 — Mi Perfil

**Background:** `#0F0E17`

**Layout:** centered card, max-width 560px — same style as Login card

**Title:** "Mi perfil" — Bangers, yellow text-shadow

**View mode:**
- Display username, nombre, apellido, email, role
- Email and role are read-only (no edit)
- "Editar perfil" button — outlined secondary button

**Edit mode (replaces view):**
- Fields: Username, Nombre, Apellido (email and role disabled/grayed)
- Guardar / Cancelar buttons

---

## Screen 13 — Detalle Película

**Background:** `#0F0E17`

**Layout (two-column on desktop, single column mobile):**
- Left: image carousel or single large image (same card style, black border)
- Right: title (Bangers, large, cream), category (blue), description, price (red Bangers), stock, add-to-cart action (if COMPRADOR)

---

## Shared UI Patterns

### Loading state
Centered `<p>` "Cargando..." in cream color, muted. Optional: pulsing opacity animation.

### Error state
Centered `<p>` with red color. Or use the error box component (red border, light red background).

### Alert / toast notifications
Full-width banner below the page header:
- Success: `background #d1fae5`, border `#10b981`, dark green text
- Error: `background #fee2e2`, border `#E53935`, dark red text
Auto-dismiss after 3–4 seconds.

### Secondary button style
- Background: transparent or very light
- Border: `3px solid #000`
- Shadow: `3px 3px 0 #000`
- Press effect on active

### Destructive button style (Eliminar)
- Background: transparent or light red
- Text: `#E53935`
- Border: `3px solid #E53935`
- Shadow: `3px 3px 0 #000`

### Disabled state (all buttons)
- `opacity: 0.5`
- `cursor: not-allowed`
- No transform/shadow effects

### Focus styles (accessibility)
- Inputs: `border-color: #1E88E5` + `box-shadow: 3px 3px 0 #1E88E5`
- Buttons: outline offset in yellow

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| `≤ 768px` | Single column grid, stacked nav, smaller logo, form cards full width |
| `> 768px` | Multi-column grid (auto-fill 220px min), two-column detail view |

---

## Overall Mood Reference

- **Style:** Retro comic book / vintage cinema marquee
- **Feeling:** Bold, playful, high contrast, slightly over-the-top
- **Key textures:** Hard black ink borders, offset box shadows (no blur), uppercase display font
- **Inspiration:** Classic movie posters, DC/Marvel silver-age comics, blockbuster video store aesthetics
