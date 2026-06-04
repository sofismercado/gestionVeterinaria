const { describe, it } = require("node:test");
const assert = require("node:assert");

function obtenerColorDia(estado) {
  if (estado === "sin_atencion") return "gray";
  if (estado === "disponible") return "green";
  return null;
}

describe("Pruebas del calendario", () => {
  it("Debe retornar gray cuando el dia esta marcado como sin_atencion", () => {
    assert.strictEqual(obtenerColorDia("sin_atencion"), "gray");
  });
});