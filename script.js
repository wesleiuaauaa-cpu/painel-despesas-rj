const yearly = {
  2020: 30489.0,
  2021: 32442.0,
  2022: 38757.8,
  2023: 43242.3,
  2024: 46313.1,
  2025: 46433.9
};

const funcs = {
  "2025": [
    ["Saúde", 7754.1],
    ["Educação", 7713.7],
    ["Previdência Social", 6925.9],
    ["Urbanismo", 3804.9],
    ["Encargos Especiais", 3514.8],
    ["Administração", 2329.8],
    ["Transporte", 1933.8],
    ["Legislativa", 1222.0]
  ],
  "2024": [
    ["Saúde", 7642.6],
    ["Educação", 7151.2],
    ["Previdência Social", 6789.8],
    ["Urbanismo", 4642.2],
    ["Encargos Especiais", 3241.9],
    ["Administração", 2229.4],
    ["Transporte", 2201.1],
    ["Legislativa", 1092.5]
  ],
  "2023": [
    ["Saúde", 7019.0],
    ["Educação", 6700.0],
    ["Previdência Social", 6360.1],
    ["Urbanismo", 4520.0],
    ["Encargos Especiais", 3110.0],
    ["Administração", 2150.0],
    ["Transporte", 1880.0],
    ["Legislativa", 1050.0]
  ],
  "2022": [
    ["Saúde", 6820.5],
    ["Educação", 6100.0],
    ["Previdência Social", 5935.8],
    ["Urbanismo", 4200.0],
    ["Encargos Especiais", 2900.0],
    ["Administração", 1950.0],
    ["Transporte", 1750.0],
    ["Legislativa", 980.0]
  ],
  "2021": [
    ["Saúde", 5800.0],
    ["Educação", 5645.7],
    ["Previdência Social", 5705.2],
    ["Urbanismo", 3500.0],
    ["Encargos Especiais", 2600.0],
    ["Administração", 1800.0],
    ["Transporte", 1600.0],
    ["Legislativa", 920.0]
  ],
  "2020": [
    ["Saúde", 4908.2],
    ["Educação", 4800.0],
    ["Previdência Social", 5619.8],
    ["Urbanismo", 3100.0],
    ["Encargos Especiais", 2400.0],
    ["Administração", 1650.0],
    ["Transporte", 1450.0],
    ["Legislativa", 870.0]
  ]
};

const colors = ["#7DF3FF","#41CDA6","#FFB84C","#6B7B8C","#315784","#A8C7D8","#9FC7C0","#D0A65B"];

const fmt = (x, d = 1) => x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const money = x => {
  if (x >= 1000) {
    return "R$ " + fmt(x / 1000, 2) + " bi";
  }
  return "R$ " + fmt(x, 1) + " mi";
};

function svgEl(tag, attrs, text) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  if (text) n.textContent = text;
  return n;
}

function renderBars(year) {
  const svg = document.querySelector("#barChart");
  const data = funcs[year] || [];
  const total = yearly[year] || 0;
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 720 342");
  const left = 160, right = 60, top = 12, row = 37, plotW = 720 - left - right, max = 8500;

  [0, 2000, 4000, 6000, 8000].forEach(t => {
    const x = left + t / max * plotW;
    svg.append(svgEl("line", { x1: x, y1: 4, x2: x, y2: top + row * 8 - 2, class: "gridline" }));
    svg.append(svgEl("text", { x, y: top + row * 8 + 17, "text-anchor": "middle", class: "axis" }, t === 0 ? "0" : (t/1000) + " bi"));
  });

  data.forEach(([name, val], i) => {
    const y = top + i * row;
    const barW = val / max * plotW;
    const pct = val / total * 100;
    svg.append(svgEl("text", { x: left - 11, y: y + 19, "text-anchor": "end", class: "axis" }, name));
    svg.append(svgEl("rect", { x: left, y: y + 4, width: plotW, height: 18, rx: 5, fill: "#F0F3F6" }));
    const bar = svgEl("rect", {
      x: left, y: y + 4, width: Math.max(3, barW), height: 18, rx: 5,
      fill: colors[i] || "#ccc", class: "point",
      "data-tip": name + ": " + money(val) + " · " + fmt(pct) + "% do total",
      tabindex: "0", role: "button",
      "aria-label": name + ", " + money(val) + ", " + fmt(pct) + " por cento"
    });
    svg.append(bar);
    svg.append(svgEl("text", { x: left + barW + 8, y: y + 18, class: "data-label" }, money(val) + " (" + fmt(pct) + "%)"));
  });

  const legend = document.querySelector("#functionLegend");
  legend.innerHTML = "";
  data.forEach(([name, val], i) => {
    const pct = val / total * 100;
    const item = document.createElement("div");
    item.innerHTML = "<span class=\"legend-name\"><i class=\"swatch\" style=\"background:" + (colors[i] || "#ccc") + "\"></i>" + name + "</span><span class=\"legend-value\">" + money(val) + " · " + fmt(pct) + "%</span>";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "6px";
    item.style.fontSize = "12px";
    item.style.color = "#30445e";
    const swatch = item.querySelector(".swatch");
    swatch.style.display = "inline-block";
    swatch.style.width = "10px";
    swatch.style.height = "10px";
    swatch.style.borderRadius = "2px";
    legend.append(item);
  });

  document.querySelector("#functionSubtitle").textContent = "Oito maiores funções · " + year;
  document.querySelector("#functionFoot").textContent = "Total de " + money(total) + " em despesas empenhadas no exercício.";
}

function renderCompare() {
  const svg = document.querySelector("#compareChart");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 600 290");
  const L = 65, R = 24, T = 24, B = 47, W = 600 - L - R, H = 290 - T - B, max = 55000;

  [0, 10000, 20000, 30000, 40000, 50000].forEach(v => {
    const y = T + H - (v / max * H);
    svg.append(svgEl("line", { x1: L, y1: y, x2: 600 - R, y2: y, class: "gridline" }));
    svg.append(svgEl("text", { x: L - 9, y: y + 4, "text-anchor": "end", class: "axis" }, v === 0 ? "0" : (v/1000) + " bi"));
  });

  const yrs = [2024, 2025];
  const barW = 80;
  const gap = 90;
  const startX = L + (W - (barW * 2 + gap)) / 2;

  yrs.forEach((yr, i) => {
    const val = yearly[yr] || 0;
    const x = startX + i * (barW + gap);
    const barH = val / max * H;
    const y = T + H - barH;
    const color = i === 0 ? "#6B7B8C" : "#7DF3FF";

    svg.append(svgEl("rect", {
      x, y, width: barW, height: barH, rx: 6, fill: color, class: "point",
      "data-tip": yr + ": " + money(val)
    }));

    svg.append(svgEl("text", { x: x + barW / 2, y: y - 8, "text-anchor": "middle", class: "data-label" }, money(val)));
    svg.append(svgEl("text", { x: x + barW / 2, y: T + H + 22, "text-anchor": "middle", class: "axis" }, String(yr)));
  });

  const diff = yearly[2025] - yearly[2024];
  const pct = (diff / yearly[2024]) * 100;
  const pctSign = pct >= 0 ? "+" : "";

  document.querySelector("#statTotal").textContent = money(yearly[2025]);
  document.querySelector("#statVar").textContent = pctSign + fmt(pct, 2) + "%";
  document.querySelector("#statVarNote").textContent = money(yearly[2024]) + " → " + money(yearly[2025]) + " (+" + money(diff) + ")";

  const totAcum = ((yearly[2025] - yearly[2020]) / yearly[2020]) * 100;
  document.querySelector("#statAcum").textContent = "+" + fmt(totAcum, 1) + "%";
  document.querySelector("#trendStat").textContent = "+" + fmt(totAcum, 1) + "%";

  const topFunc = funcs["2025"][0];
  document.querySelector("#statTop").textContent = topFunc[0];
  document.querySelector("#statTopNote").textContent = money(topFunc[1]) + " · " + fmt(topFunc[1] / yearly[2025] * 100, 1) + "%";
}

function renderLine() {
  const svg = document.querySelector("#lineChart");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 1100 295");
  const L = 65, R = 30, T = 28, B = 42, W = 1100 - L - R, H = 295 - T - B, max = 55000;

  [0, 10000, 20000, 30000, 40000, 50000].forEach(v => {
    const y = T + H - (v / max * H);
    svg.append(svgEl("line", { x1: L, y1: y, x2: 1100 - R, y2: y, class: "gridline" }));
    svg.append(svgEl("text", { x: L - 9, y: y + 4, "text-anchor": "end", class: "axis" }, v === 0 ? "0" : (v/1000) + " bi"));
  });

  const yrs = [2020, 2021, 2022, 2023, 2024, 2025];
  const stepX = W / (yrs.length - 1);
  const pts = [];

  yrs.forEach((yr, i) => {
    const val = yearly[yr] || 0;
    const x = L + i * stepX;
    const y = T + H - (val / max * H);
    pts.push({ x, y, yr, val });

    const el = document.querySelector("#y" + yr);
    if (el) el.textContent = fmt(val / 1000, 1) + " bi";
  });

  const pathD = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
  svg.append(svgEl("path", { d: pathD, fill: "none", stroke: "#0A1F44", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }));

  pts.forEach(p => {
    svg.append(svgEl("circle", { cx: p.x, cy: p.y, r: 6, fill: "#7DF3FF", stroke: "#0A1F44", "stroke-width": 2 }));
    svg.append(svgEl("text", { x: p.x, y: p.y - 12, "text-anchor": "middle", class: "data-label" }, money(p.val)));
    svg.append(svgEl("text", { x: p.x, y: T + H + 22, "text-anchor": "middle", class: "axis" }, String(p.yr)));
  });
}

document.querySelector("#yearSelect").addEventListener("change", function(e) {
  renderBars(e.target.value);
});

renderBars("2025");
renderCompare();
renderLine();
