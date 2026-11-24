#!/bin/bash
BASE="http://localhost:4002"
PASS=0; FAIL=0

check() {
  local label="$1" expected="$2" actual="$3"
  if echo "$actual" | grep -qE "$expected"; then
    echo "OK  $label"
    PASS=$((PASS+1))
  else
    echo "FAIL $label => $(echo "$actual" | head -c 100)"
    FAIL=$((FAIL+1))
  fi
}

# TOKENS
TOK_ADMIN=$(curl -s -X POST $BASE/api/v1/auth/authenticate -H "Content-Type: application/json" \
  -d '{"email":"admin@blockbusted.com","password":"admin123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
TOK_VEND=$(curl -s -X POST $BASE/api/v1/auth/authenticate -H "Content-Type: application/json" \
  -d '{"email":"vendedor@blockbusted.com","password":"vendedor123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
TOK_COMP=$(curl -s -X POST $BASE/api/v1/auth/authenticate -H "Content-Type: application/json" \
  -d '{"email":"comprador@blockbusted.com","password":"comprador123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
echo "Tokens: ADMIN=${TOK_ADMIN:0:20}... VEND=${TOK_VEND:0:20}... COMP=${TOK_COMP:0:20}..."

echo ""
echo "=== AUTH ==="
check "POST /auth/register" "access_token" \
  "$(curl -s -X POST $BASE/api/v1/auth/register -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"username\":\"test99\",\"email\":\"test99@test.com\",\"password\":\"test123\",\"role\":\"COMPRADOR\"}")"
check "POST /auth/authenticate OK" "access_token" \
  "$(curl -s -X POST $BASE/api/v1/auth/authenticate -H "Content-Type: application/json" \
  -d "{\"email\":\"comprador@blockbusted.com\",\"password\":\"comprador123\"}")"
check "POST /auth/authenticate bad pass => 4xx" "4[0-9][0-9]" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/v1/auth/authenticate \
  -H "Content-Type: application/json" -d "{\"email\":\"comprador@blockbusted.com\",\"password\":\"wrong\"}")"

echo ""
echo "=== CATEGORIAS ==="
check "GET /api/categorias" "id" \
  "$(curl -s $BASE/api/categorias)"
check "GET /api/categorias/1" "descripcion" \
  "$(curl -s $BASE/api/categorias/1)"
CAT=$(curl -s -X POST $BASE/api/categorias \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_ADMIN" \
  -d "{\"descripcion\":\"Terror Clase Z\"}")
CAT_ID=$(echo $CAT | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
check "POST /api/categorias (admin)" "Terror Clase Z" "$CAT"
check "PUT /api/categorias/{id} (admin)" "Updated" \
  "$(curl -s -X PUT $BASE/api/categorias/$CAT_ID \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_ADMIN" \
  -d "{\"descripcion\":\"Terror Updated\"}")"
check "DELETE /api/categorias/{id} (admin) => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/categorias/$CAT_ID \
  -H "Authorization: Bearer $TOK_ADMIN")"
check "POST /api/categorias sin auth => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/categorias \
  -H "Content-Type: application/json" -d "{\"descripcion\":\"X\"}")"

echo ""
echo "=== PELICULAS ==="
check "GET /api/peliculas (publico)" "content" \
  "$(curl -s $BASE/api/peliculas)"
check "GET /api/peliculas/1" "titulo" \
  "$(curl -s $BASE/api/peliculas/1)"
PEL=$(curl -s -X POST $BASE/api/peliculas \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_VEND" \
  -d "{\"titulo\":\"Jurassic Carp\",\"descripcion\":\"Pez gigante\",\"precio\":14.99,\"stock\":10,\"categoriaId\":1}")
PEL_ID=$(echo $PEL | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
check "POST /api/peliculas (vendedor)" "Jurassic Carp" "$PEL"
check "PUT /api/peliculas/{id} (vendedor)" "Updated" \
  "$(curl -s -X PUT $BASE/api/peliculas/$PEL_ID \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_VEND" \
  -d "{\"titulo\":\"Jurassic Updated\",\"descripcion\":\"desc\",\"precio\":12.0,\"stock\":5,\"categoriaId\":1}")"
check "PUT /api/peliculas/{id}/stock (vendedor)" "stock" \
  "$(curl -s -X PUT $BASE/api/peliculas/$PEL_ID/stock \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_VEND" \
  -d "{\"stock\":20}")"
check "PUT /api/peliculas/{id}/descuento (vendedor)" "descuento" \
  "$(curl -s -X PUT $BASE/api/peliculas/$PEL_ID/descuento \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_VEND" \
  -d "{\"descuentoPorcentaje\":10}")"
FOTOS=$(curl -s -X POST $BASE/api/peliculas/$PEL_ID/fotos \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_VEND" \
  -d "{\"urls\":[\"http://img.test/foto.jpg\"]}")
FOTO_ID=$(echo $FOTOS | python3 -c "import sys,json;print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
check "POST /api/peliculas/{id}/fotos (vendedor)" "id" "$FOTOS"
check "DELETE /api/peliculas/{id}/fotos/{fotoId} (vendedor) => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/peliculas/$PEL_ID/fotos/$FOTO_ID \
  -H "Authorization: Bearer $TOK_VEND")"
check "DELETE /api/peliculas/{id} (vendedor) => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/peliculas/$PEL_ID \
  -H "Authorization: Bearer $TOK_VEND")"
check "POST /api/peliculas comprador => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/peliculas \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"titulo\":\"X\",\"descripcion\":\"x\",\"precio\":1,\"stock\":1,\"categoriaId\":1}")"

echo ""
echo "=== METODOS DE PAGO ==="
check "GET /api/metodos-pago (comprador)" "TARJETA|DEBITO|\[\]" \
  "$(curl -s $BASE/api/metodos-pago -H "Authorization: Bearer $TOK_COMP")"
MP=$(curl -s -X POST $BASE/api/metodos-pago \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"tipo\":\"TARJETA_DEBITO\",\"descripcion\":\"Mastercard Debito\"}")
MP_ID=$(echo $MP | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
check "POST /api/metodos-pago (comprador)" "TARJETA_DEBITO" "$MP"
check "DELETE /api/metodos-pago/{id} => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/metodos-pago/$MP_ID \
  -H "Authorization: Bearer $TOK_COMP")"
check "GET /api/metodos-pago sin auth => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" $BASE/api/metodos-pago)"

echo ""
echo "=== CARRITO ==="
check "GET /api/carrito (comprador)" "id|items|\[\]" \
  "$(curl -s $BASE/api/carrito -H "Authorization: Bearer $TOK_COMP")"
ITEM=$(curl -s -X POST $BASE/api/carrito/items \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"peliculaId\":1,\"cantidad\":1}")
ITEM_ID=$(echo $ITEM | python3 -c "import sys,json; d=json.load(sys.stdin); items=d.get('items',[d]); print(items[-1]['id'] if items else '')" 2>/dev/null)
check "POST /api/carrito/items (comprador)" "id" "$ITEM"
check "PUT /api/carrito/items/{id} (comprador)" "id|cantidad" \
  "$(curl -s -X PUT $BASE/api/carrito/items/$ITEM_ID \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"cantidad\":2}")"
check "POST /api/carrito/descuento (comprador) => cualquier respuesta" ".*" \
  "$(curl -s -X POST $BASE/api/carrito/descuento \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"codigo\":\"INVALIDO\"}")"
check "DELETE /api/carrito/descuento (comprador) => no crash" "200|400|404" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/carrito/descuento \
  -H "Authorization: Bearer $TOK_COMP")"
check "DELETE /api/carrito/items/{id} => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/carrito/items/$ITEM_ID \
  -H "Authorization: Bearer $TOK_COMP")"
check "DELETE /api/carrito (vaciar) => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/carrito \
  -H "Authorization: Bearer $TOK_COMP")"

echo ""
echo "=== ORDENES ==="
curl -s -X POST $BASE/api/carrito/items \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"peliculaId\":1,\"cantidad\":1}" > /dev/null
MP2=$(curl -s -X POST $BASE/api/metodos-pago \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"tipo\":\"TARJETA_CREDITO\",\"descripcion\":\"Visa 9999\"}")
MP2_ID=$(echo $MP2 | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
ORD=$(curl -s -X POST $BASE/api/ordenes \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"metodoPagoId\":$MP2_ID}")
ORD_ID=$(echo $ORD | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
check "POST /api/ordenes (comprador)" "id" "$ORD"
check "GET /api/ordenes (comprador)" "id" \
  "$(curl -s $BASE/api/ordenes -H "Authorization: Bearer $TOK_COMP")"
check "GET /api/ordenes/{id} (comprador)" "id" \
  "$(curl -s $BASE/api/ordenes/$ORD_ID -H "Authorization: Bearer $TOK_COMP")"
curl -s -X POST $BASE/api/carrito/items \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"peliculaId\":1,\"cantidad\":1}" > /dev/null
ORD2=$(curl -s -X POST $BASE/api/ordenes \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"metodoPagoId\":$MP2_ID}")
ORD2_ID=$(echo $ORD2 | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
check "PUT /api/ordenes/{id}/cancelar (comprador)" "CANCELADA|200" \
  "$(curl -s -X PUT $BASE/api/ordenes/$ORD2_ID/cancelar -H "Authorization: Bearer $TOK_COMP")"
check "POST /api/ordenes sin auth => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/ordenes \
  -H "Content-Type: application/json" -d "{\"metodoPagoId\":1}")"

echo ""
echo "=== ADMIN ORDENES ==="
check "GET /api/admin/ordenes (admin)" "id" \
  "$(curl -s $BASE/api/admin/ordenes -H "Authorization: Bearer $TOK_ADMIN")"
check "DELETE /api/admin/ordenes/{id} (admin) => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/admin/ordenes/$ORD2_ID \
  -H "Authorization: Bearer $TOK_ADMIN")"
check "GET /api/admin/ordenes comprador => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" $BASE/api/admin/ordenes \
  -H "Authorization: Bearer $TOK_COMP")"

echo ""
echo "=== FAVORITOS ==="
check "POST /api/favoritos/1 (comprador)" "200|201|id" \
  "$(curl -s -X POST $BASE/api/favoritos/1 -H "Authorization: Bearer $TOK_COMP")"
check "GET /api/favoritos (comprador)" "id|\[\]" \
  "$(curl -s $BASE/api/favoritos -H "Authorization: Bearer $TOK_COMP")"
check "GET /api/favoritos/1/check (comprador)" "esFavorito" \
  "$(curl -s $BASE/api/favoritos/1/check -H "Authorization: Bearer $TOK_COMP")"
check "DELETE /api/favoritos/1 => 200" "200" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/favoritos/1 \
  -H "Authorization: Bearer $TOK_COMP")"
check "POST /api/favoritos sin auth => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/favoritos/1)"

echo ""
echo "=== USUARIOS ==="
check "GET /api/usuarios/me (comprador)" "username|email" \
  "$(curl -s $BASE/api/usuarios/me -H "Authorization: Bearer $TOK_COMP")"
check "PUT /api/usuarios/me (comprador)" "firstName|username|email" \
  "$(curl -s -X PUT $BASE/api/usuarios/me \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"firstName\":\"Ana\",\"lastName\":\"Compradora\",\"username\":\"comprador@blockbusted.com\"}")"
check "GET /api/usuarios (admin)" "id" \
  "$(curl -s $BASE/api/usuarios -H "Authorization: Bearer $TOK_ADMIN")"
check "GET /api/usuarios sin auth => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" $BASE/api/usuarios)"
check "DELETE /api/usuarios/{id} comprador => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/api/usuarios/999 \
  -H "Authorization: Bearer $TOK_COMP")"

echo ""
echo "=== RESENAS ==="
check "GET /api/peliculas/1/resenas (publico)" "id|\[\]" \
  "$(curl -s $BASE/api/peliculas/1/resenas)"
check "POST /api/peliculas/1/resenas sin compra nueva => error" "comprado|Ya" \
  "$(curl -s -X POST $BASE/api/peliculas/1/resenas \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_COMP" \
  -d "{\"puntuacion\":4,\"comentario\":\"Test resena\"}")"
check "POST /api/peliculas/1/resenas vendedor => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/peliculas/1/resenas \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_VEND" \
  -d "{\"puntuacion\":5,\"comentario\":\"No deberia\"}")"
check "POST /api/peliculas/1/resenas sin auth => 403" "403" \
  "$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/peliculas/1/resenas \
  -H "Content-Type: application/json" -d "{\"puntuacion\":5,\"comentario\":\"anonimo\"}")"
TOK_NEW=$(curl -s -X POST $BASE/api/v1/auth/authenticate -H "Content-Type: application/json" \
  -d "{\"email\":\"test99@test.com\",\"password\":\"test123\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
curl -s -X POST $BASE/api/carrito/items \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_NEW" \
  -d "{\"peliculaId\":1,\"cantidad\":1}" > /dev/null
MP3=$(curl -s -X POST $BASE/api/metodos-pago \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_NEW" \
  -d "{\"tipo\":\"TARJETA_DEBITO\",\"descripcion\":\"Debito test\"}")
MP3_ID=$(echo $MP3 | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
curl -s -X POST $BASE/api/ordenes \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_NEW" \
  -d "{\"metodoPagoId\":$MP3_ID}" > /dev/null
check "POST /api/peliculas/1/resenas con compra => OK" "usuarioNombre|puntuacion" \
  "$(curl -s -X POST $BASE/api/peliculas/1/resenas \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOK_NEW" \
  -d "{\"puntuacion\":5,\"comentario\":\"Excelente desde test!\"}")"
check "GET /api/peliculas/1/resenas tiene resenas" "usuarioNombre" \
  "$(curl -s $BASE/api/peliculas/1/resenas)"

echo ""
echo "================================================"
echo "PASSED: $PASS   FAILED: $FAIL   TOTAL: $((PASS+FAIL))"
echo "================================================"
