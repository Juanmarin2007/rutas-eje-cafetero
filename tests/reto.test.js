const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { rutas } = require('../js/datos.js');
const { ordenarRutas } = require('../js/app.js');

describe('RETO · ordenarRutas(lista, criterio)', () => {
  test('ordena por nombre de A a Z respetando tildes', () => {
    // Preparar
    const lista = [{ nombre: 'Zeta' }, { nombre: 'Álamo' }, { nombre: 'Beta' }];
    // Ejecutar
    const resultado = ordenarRutas(lista, 'nombre');
    // Verificar
    assert.deepEqual(resultado.map((r) => r.nombre), ['Álamo', 'Beta', 'Zeta']);
  });

  test('ordena por precio de menor a mayor (las gratis primero)', () => {
    const resultado = ordenarRutas(rutas, 'precio');
    for (let i = 1; i < resultado.length; i++) {
      assert.ok(resultado[i - 1].precio <= resultado[i].precio);
    }
    assert.equal(resultado[0].precio, Math.min(...rutas.map((r) => r.precio)));
  });

  test('ordena por duración de menor a mayor', () => {
    const resultado = ordenarRutas(rutas, 'duracion');
    for (let i = 1; i < resultado.length; i++) {
      assert.ok(resultado[i - 1].duracionHoras <= resultado[i].duracionHoras);
    }
  });

  test('no modifica la lista original', () => {
    const antes = rutas.map((r) => r.nombre);
    ordenarRutas(rutas, 'precio');
    assert.deepEqual(rutas.map((r) => r.nombre), antes);
  });

  test('un criterio desconocido devuelve una copia en el mismo orden', () => {
    const resultado = ordenarRutas(rutas, 'inventado');
    assert.deepEqual(resultado, rutas);
    assert.notEqual(resultado, rutas); // es otro arreglo, no el mismo
  });

  test('una lista vacía devuelve una lista vacía', () => {
    assert.deepEqual(ordenarRutas([], 'precio'), []);
  });
});