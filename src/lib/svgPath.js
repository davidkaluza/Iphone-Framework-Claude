/**
 * Erzeugt SVG-Pfad-Strings (Linie + Fläche) aus einer Punktreihe.
 * points: Array von Zahlen (y-Werte), gleichmäßig auf der x-Achse verteilt.
 */
export function buildLinePath(values, width, height, padding = 4) {
  if (!values || values.length === 0) {
    return { linePath: "", areaPath: "", coords: [] };
  }

  if (values.length === 1) {
    const y = height / 2;
    return {
      linePath: `M ${padding} ${y} L ${width - padding} ${y}`,
      areaPath: "",
      coords: [{ x: width / 2, y }]
    };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const coords = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * innerWidth;
    const y = padding + innerHeight - ((value - min) / range) * innerHeight;
    return { x, y };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(" ");

  const areaPath =
    `M ${coords[0].x.toFixed(2)} ${height} ` +
    coords.map((c) => `L ${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(" ") +
    ` L ${coords[coords.length - 1].x.toFixed(2)} ${height} Z`;

  return { linePath, areaPath, coords, min, max };
}
