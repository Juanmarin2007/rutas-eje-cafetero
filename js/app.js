/*
 * app.js - Rutas del Eje
 * Flujo: rutas -> filtrarPorTipo() -> buscarPorTexto() -> ordenarRutas() -> pintarRutas()
 * Verifica tu avance con:  node --test
 */

const ETIQUETAS_TIPO = {
  naturaleza: 'Naturaleza',
  cultura: 'Cultura',
  cafe: 'Café',
  aventura: 'Aventura'
};

function formatearPrecio(valor) {
  if (valor === 0) return 'Gratis';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

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

function pintarRutas(lista, contenedor, mensaje) {
  contenedor.innerHTML = lista.map(crearCard).join('');

  if (lista.length === 0) {
    mensaje.textContent = 'No encontramos rutas con ese filtro. Prueba con otra búsqueda.';
  } else {
    mensaje.textContent = `${lista.length} rutas encontradas`;
  }
}

function filtrarPorTipo(lista, tipo) {
  if (tipo === 'todos') return [...lista];
  return lista.filter((ruta) => ruta.tipo === tipo);
}

function buscarPorTexto(lista, texto) {
  const buscado = normalizar(texto);
  if (buscado === '') return [...lista];
  return lista.filter(
    (ruta) =>
      normalizar(ruta.nombre).includes(buscado) ||
      normalizar(ruta.municipio).includes(buscado)
  );
}

/* RETO · ordenarRutas(lista, criterio) -> nuevo arreglo ordenado */
function ordenarRutas(lista, criterio) {
  const copia = [...lista]; // sort() modifica el arreglo, por eso se ordena una copia
  if (criterio === 'nombre') {
    return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }
  if (criterio === 'precio') {
    return copia.sort((a, b) => a.precio - b.precio);
  }
  if (criterio === 'duracion') {
    return copia.sort((a, b) => a.duracionHoras - b.duracionHoras);
  }
  return copia;
}

const estado = { tipo: 'todos', texto: '', orden: '' };

function aplicarFiltros() {
  let resultado = filtrarPorTipo(rutas, estado.tipo) ?? rutas;
  resultado = buscarPorTexto(resultado, estado.texto) ?? resultado;
  resultado = ordenarRutas(resultado, estado.orden) ?? resultado;
  pintarRutas(resultado, document.querySelector('#lista-rutas'), document.querySelector('#resultado'));
}

function iniciar() {
  const botones = document.querySelectorAll('[data-tipo]');

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

  const buscador = document.querySelector('#buscador');
  buscador.addEventListener('input', (evento) => {
    estado.texto = evento.target.value;
    aplicarFiltros();
  });

  const selectOrden = document.querySelector('#orden');
  selectOrden.addEventListener('change', (evento) => {
    estado.orden = evento.target.value;
    aplicarFiltros();
  });

  aplicarFiltros();
}

if (typeof document !== 'undefined') iniciar();
if (typeof module !== 'undefined') {
  module.exports = { formatearPrecio, normalizar, crearCard, pintarRutas, filtrarPorTipo, buscarPorTexto, ordenarRutas };
}