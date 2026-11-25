/*
 * app.js - Rutas del Eje
 * ------------------------------------------------------------
 * Flujo de la interfaz: DATOS (datos.js) -> TARJETAS (HTML) -> EVENTOS
 *
 *   rutas -> filtrarPorTipo() -> buscarPorTexto() -> pintarRutas() -> #lista-rutas
 *
 * Los eventos (clic en un filtro, escribir en el buscador) cambian el estado
 * y vuelven a ejecutar ese recorrido.
 *
 * Verifica tu avance con:  node --test
 */

const ETIQUETAS_TIPO = {
  naturaleza: 'Naturaleza',
  cultura: 'Cultura',
  cafe: 'Café',
  aventura: 'Aventura'
};

/* RESUELTA 1 · formatearPrecio(valor)
 * Convierte 25000 en "$ 25.000". Si el precio es 0, devuelve "Gratis". */
function formatearPrecio(valor) {
  if (valor === 0) return 'Gratis';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
}

/* RESUELTA 2 · normalizar(texto)
 * Minúsculas, sin tildes y sin espacios a los lados. */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/* G3.1 · crearCard(ruta) -> string con el HTML de UNA tarjeta */
function crearCard(ruta) {
  return `
    <div class="col">
      <article class="card h-100 ruta-card">
        <img src="${ruta.imagen}" class="card-img-top" alt="">
        <div class="card-body">
          <span class="badge badge-${ruta.tipo}">${ETIQUETAS_TIPO[ruta.tipo]}</span>
          <h3 class="card-title h5">${ruta.nombre}</h3>
          <p class="card-subtitle">${ruta.municipio}, ${ruta.departamento}</p>
          <p class="card-text">${ruta.descripcion}</p>
        </div>
        <div class="card-footer">
          <span>${ruta.duracionHoras} h</span>
          <strong class="precio">${formatearPrecio(ruta.precio)}</strong>
        </div>
      </article>
    </div>`;
}

/* G3.2 · pintarRutas(lista, contenedor, mensaje) */
function pintarRutas(lista, contenedor, mensaje) {
  contenedor.innerHTML = lista.map(crearCard).join('');

  if (lista.length === 0) {
    mensaje.textContent = 'No encontramos rutas con ese filtro. Prueba con otra búsqueda.';
  } else {
    mensaje.textContent = `${lista.length} rutas encontradas`;
  }
}

/* G4.1 · filtrarPorTipo(lista, tipo) -> nuevo arreglo */
function filtrarPorTipo(lista, tipo) {
  if (tipo === 'todos') return [...lista];
  return lista.filter((ruta) => ruta.tipo === tipo);
}

/* G4.2 · buscarPorTexto(lista, texto) -> nuevo arreglo */
function buscarPorTexto(lista, texto) {
  const buscado = normalizar(texto);
  if (buscado === '') return [...lista];
  return lista.filter(
    (ruta) =>
      normalizar(ruta.nombre).includes(buscado) ||
      normalizar(ruta.municipio).includes(buscado)
  );
}

/* RETO · ordenarRutas(lista, criterio) -> nuevo arreglo ordenado
 * Enunciado completo, rúbrica y enlaces de consulta en RETO.md.
 * Tus pruebas van en tests/reto.test.js. */
function ordenarRutas(lista, criterio) {
  // TODO: implementar (RETO)
}

/* Estado de la interfaz + aplicarFiltros()  (ya resuelto) */
const estado = { tipo: 'todos', texto: '' };

function aplicarFiltros() {
  // ?? rutas -> mientras una función no esté implementada (devuelve undefined), se usan todas las rutas
  let resultado = filtrarPorTipo(rutas, estado.tipo) ?? rutas;
  resultado = buscarPorTexto(resultado, estado.texto) ?? resultado;
  // RETO: aquí también se aplica ordenarRutas(resultado, estado.orden)
  pintarRutas(resultado, document.querySelector('#lista-rutas'), document.querySelector('#resultado'));
}

/* G4.3 · iniciar() - conecta los EVENTOS */
function iniciar() {
  const botones = document.querySelectorAll('[data-tipo]');

  // Paso 1: eventos 'click' de los botones de filtro
  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      estado.tipo = boton.dataset.tipo;
      botones.forEach((b) => {
        b.classList.toggle('active', b === boton);
        b.setAttribute('aria-pressed', b === boton ? 'true' : 'false');
      });
      aplicarFiltros();
    });
  });

  // Paso 2: evento 'input' del buscador
  const buscador = document.querySelector('#buscador');
  buscador.addEventListener('input', (evento) => {
    estado.texto = evento.target.value;
    aplicarFiltros();
  });

  aplicarFiltros(); // pinta todas las rutas al cargar
}

// En el navegador arranca la app; en Node (pruebas) exporta las funciones.
if (typeof document !== 'undefined') iniciar();
if (typeof module !== 'undefined') {
  module.exports = { formatearPrecio, normalizar, crearCard, pintarRutas, filtrarPorTipo, buscarPorTexto, ordenarRutas };
}