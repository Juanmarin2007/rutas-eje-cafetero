# Mis aprendizajes · Rutas del Eje

**Aprendiz:** TU NOMBRE

---

## Issue #1 · G1 Guía de estilo

**Consulté:**
- MDN, variables CSS: https://developer.mozilla.org/es/docs/Web/CSS/Using_CSS_custom_properties → encontré que las variables se declaran en `:root` y se usan con `var(--nombre)`.
- Bootstrap, variables de botones: https://getbootstrap.com/docs/5.3/components/buttons/#variables → encontré que cada botón lee sus propias variables `--bs-btn-*`.
- WebAIM, contraste: https://webaim.org/resources/contrastchecker/ → sirve para medir que el texto se lea bien (mínimo 4.5:1).

1. **Ventaja de las variables:** escribo el color una sola vez en `:root` y lo uso en todo el sitio con `var()`. Si quiero cambiar el verde, lo cambio en un solo lugar y se actualiza en todas partes. Si pusiera el hex en cada regla, tendría que buscarlo y cambiarlo uno por uno.

2. **De dónde sale el color del botón:** el valor de `--bs-btn-bg` sale de la regla `.btn-primary` de mi `estilos.css`, donde le puse `var(--eje-primario)`. Cambiar solo `--bs-primary` no habría cambiado el botón, porque el botón no lee `--bs-primary`: lee sus propias variables `--bs-btn-*`.

3. **Si enlazo `estilos.css` antes de Bootstrap:** gana el último CSS que se carga. Bootstrap quedaría después y pisaría mis variables, así que los botones y los colores volverían a los de Bootstrap por defecto. Por eso mi CSS va después de Bootstrap.

---

## Issue #2 · G2 Componentes

**Consulté:**
- Bootstrap, Navbar: https://getbootstrap.com/docs/5.3/components/navbar/#responsive-behaviors → encontré cómo se arma el botón de menú y el bloque que se esconde.
- Bootstrap, Button group: https://getbootstrap.com/docs/5.3/components/button-group/ → encontré que el grupo lleva `role="group"` y `aria-label`.
- MDN, aria-pressed: https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA/Attributes/aria-pressed → encontré que sirve para decir si un botón está activado o no.
- MDN, atributos data-*: https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/data-* → encontré que sirven para guardar datos propios en el HTML.

1. **Relación entre `data-bs-target` y `id`:** el botón dice con `data-bs-target="#menu"` cuál es el bloque que debe abrir o cerrar, y el `id="menu"` del div es el nombre de ese bloque. Los dos tienen que coincidir. Quien lee ese atributo es el JavaScript de Bootstrap.

2. **`aria-expanded`:** cuando abro el menú, el valor pasa a `true`, y cuando lo cierro pasa a `false`. Lo cambia Bootstrap solo. Sirve para las personas que usan lector de pantalla, porque así saben si el menú está abierto o cerrado.

3. **Si escribo `data-tipo="café"` con tilde:** el botón no funcionaría. En `datos.js` el tipo está escrito `cafe` sin tilde, y el filtro compara con `===`, así que `"café"` no es igual a `"cafe"` y no saldría ninguna tarjeta.

---

## Issue #3 · G3 Datos → tarjetas

**Consulté:**
- MDN, template literals: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals → encontré las comillas invertidas y `${ }`.
- MDN, map(): https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map → encontré que devuelve un arreglo nuevo del mismo tamaño.
- MDN, join(): https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/join → encontré que si no le doy separador, usa la coma.
- MDN, innerHTML: https://developer.mozilla.org/es/docs/Web/API/Element/innerHTML → encontré que reemplaza todo lo que había adentro.

1. **Predicciones:**

   | Línea | Mi predicción | Resultado real |
   |---|---|---|
   | `[1, 2, 3].map((n) => n * 10)` | `[10, 20, 30]` | `[10, 20, 30]` |
   | `['a', 'b', 'c'].join('')` | `'abc'` | `'abc'` |
   | `['a', 'b', 'c'].join(' - ')` | `'a - b - c'` | `'a - b - c'` |
   | `rutas.map((r) => r.nombre).length` | `11` | `11` |

2. **Sin `.join('')`:** aparecen comas entre las tarjetas. `map()` devuelve un arreglo, y cuando `innerHTML` recibe un arreglo lo convierte en texto separando los elementos con comas. Con `.join('')` los une sin nada en medio.

3. **Comillas invertidas y `${ }`:** las comillas invertidas permiten escribir texto en varias líneas, que es perfecto para HTML. Y `${ }` sirve para meter un valor adentro del texto, por ejemplo `${ruta.nombre}`. Con comillas simples `${ }` no funciona, saldría escrito tal cual.

---

## Issue #4 · G4 Filtros y eventos

**Consulté:**
- MDN, filter(): https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter → encontré que no modifica el arreglo original, devuelve uno nuevo.
- MDN, includes(): https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/includes → encontré que dice si un texto contiene a otro.
- MDN, addEventListener(): https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener → encontré cómo ejecutar una función cuando pasa un evento.
- MDN, evento input: https://developer.mozilla.org/es/docs/Web/API/Element/input_event → encontré que se dispara cada vez que escribo.
- MDN, dataset: https://developer.mozilla.org/es/docs/Web/API/HTMLElement/dataset → encontré que `boton.dataset.tipo` lee el `data-tipo` del HTML.
- MDN, aria-live: https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA/Attributes/aria-live → encontré que el lector de pantalla anuncia los cambios del texto.

1. **Cuánto vale `rutas.length` después de filtrar:** sigue valiendo 11. `filter()` no cambia el arreglo original, crea uno nuevo solo con las rutas que cumplen. Por eso `rutas` siempre conserva todas.

2. **Recorrido al hacer clic en "Cultura":**
   1. Hago clic y se dispara el evento `click` del botón.
   2. El código guarda `estado.tipo = "cultura"`, leyendo `boton.dataset.tipo`.
   3. Se actualizan `active` y `aria-pressed` en los botones.
   4. Se llama a `aplicarFiltros()`.
   5. `aplicarFiltros()` usa `filtrarPorTipo()` (y `buscarPorTexto()`) para sacar solo las rutas de cultura.
   6. `pintarRutas()` crea las tarjetas nuevas con `map().join('')`, las pone en la página y actualiza el mensaje.

3. **Si uso `change` en vez de `input`:** con `change` el buscador solo se actualiza cuando termino de escribir y salgo del campo o presiono Enter. Con `input` se actualiza con cada letra que escribo.

---

## Reto · Ordenar rutas

**Consulté:**
- MDN, sort(): https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort → encontré que `sort()` cambia el arreglo original y cómo funciona la función de comparación.
- MDN, localeCompare(): https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare → encontré que sirve para ordenar textos con tildes.
- MDN, spread: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax → encontré que `[...lista]` hace una copia del arreglo.
- MDN, evento change: https://developer.mozilla.org/es/docs/Web/API/HTMLElement/change_event → encontré que se dispara cuando cambio la opción de un select.

1. **Por qué la copia con `[...lista]`:** porque `sort()` modifica el arreglo sobre el que se usa. Si no hago la copia, `rutas` quedaría desordenado para siempre y los filtros partirían de una lista cambiada. Mi prueba "no modifica la lista original" lo demuestra: guarda los nombres antes, ordena, y comprueba que siguen en el mismo orden.

2. **Negativo, cero o positivo:** si la función devuelve un número negativo, `a` va antes que `b`. Si devuelve cero, quedan igual. Si devuelve positivo, `a` va después de `b`. En `a.precio - b.precio`, si `a` es más barato el resultado es negativo y queda primero, así que ordena de menor a mayor.

3. **Mi prueba y el error que detecta:** la prueba "no modifica la lista original" fallaría si alguien quitara la copia `[...lista]`, porque entonces `sort()` cambiaría `rutas`. Y las pruebas de precio y duración fallarían si alguien cambiara `a - b` por `b - a`, porque ordenaría de mayor a menor.