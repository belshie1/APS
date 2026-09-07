import { readFileSync, writeFileSync } from 'fs';
const path = 'c:/Users/elsje.bekker/OneDrive - Labware, Inc/Documents/GitHub/AGA/app.js';
let s = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const D = '@D@', B = '@B@';
let failed = false;
const R = (from, to) => {
    if (!s.includes(from)) { console.error('MISS: ' + from.slice(0, 70)); failed = true; return; }
    s = s.split(from).join(to);
};

R("settings.name ||= 'APS Architectural Plumbing Services';", "settings.name ||= 'AGA Architectural Glass & Aluminium';");
R('return `PW-${new Date().getFullYear()}', 'return `AGA-${new Date().getFullYear()}');

R(`    plumblink: { name: 'Plumblink', url: 'https://www.plumblink.co.za/all-products' },
    builders: { name: 'Builders', url: 'https://www.builders.co.za/Plumbing-Bathroom-and-Kitchen/c/13' },
    bathroom: { name: 'Bathroom Bizarre', url: 'https://bathroom.co.za/' }`,
    `    pg: { name: 'PG Glass', url: 'https://www.pgglass.co.za/' },
    glassfit: { name: 'Glassfit', url: 'https://www.glassfit.co.za/' },
    wispeco: { name: 'Wispeco Aluminium', url: 'https://www.wispeco.co.za/' }`);

R(`const supplierPrices = {
    builders: {
        'HDPE drainage pipe - 110mm x 5m': 349,
        'HDPE water pipe - 25mm x 100m': 29,
        'HDPE water pipe - 32mm x 100m': 35,
        'Copper pipe - 15mm x 5.5m': 445,
        'PVC pressure pipe - 50mm x 6m': 205,
        'PVC pressure pipe - 110mm x 6m': 349,
        'Copper elbow - 15mm': 6,
        'Copper tee - 15mm': 13,
        'Geyser - 150L': 4699,
        'Toilet - Standard': 1589
    },
    bathroom: {
        'Basin mixer - 15mm': 2205.75,
        'Basin - Standard': 995,
        'Toilet - Standard': 1999,
        'Shower screen - 900 x 2000mm': 2295,
        'Vanity cabinet - 600mm': 3195,
        'Sink mixer - 15mm': 2205.75
    }
};`,
    `const supplierPrices = {
    glassfit: {
        'Toughened safety glass - 6mm per m2': 920,
        'Toughened safety glass - 10mm per m2': 1590,
        'Float glass - 4mm per m2': 495,
        'Mirror - 4mm per m2': 820,
        'Shower glass panel - 8mm clear per m2': 2290
    },
    wispeco: {
        'Aluminium window frame - Standard per m2': 1580,
        'Aluminium door frame - Standard per m2': 1890,
        'Shopfront section - Per metre': 465,
        'Aluminium sliding door - 2 panel': 6650,
        'Aluminium extrusion - Per metre': 138
    }
};`);

R(`const supplierAvailability = {
    plumblink: new Set([
        'HDPE drainage pipe - 110mm x 5m',
        'HDPE water pipe - 25mm x 100m',
        'HDPE water pipe - 32mm x 100m',
        'Copper pipe - 15mm x 5.5m',
        'PVC pressure pipe - 50mm x 6m',
        'PVC pressure pipe - 110mm x 6m',
        'Copper elbow - 15mm',
        'Copper tee - 15mm',
        'Geyser - 150L',
        'Toilet - Standard'
    ]),
    builders: new Set(Object.keys(supplierPrices.builders)),
    bathroom: new Set(Object.keys(supplierPrices.bathroom))`,
    `const supplierAvailability = {
    pg: new Set([
        'Toughened safety glass - 6mm per m2',
        'Toughened safety glass - 8mm per m2',
        'Toughened safety glass - 10mm per m2',
        'Toughened safety glass - 12mm per m2',
        'Laminated safety glass - 6.38mm per m2',
        'Laminated safety glass - 8.38mm per m2',
        'Frosted glass - 4mm per m2',
        'Tinted glass - 6mm per m2',
        'Glass balustrade panel - 10mm toughened per m2',
        'Glass balustrade panel - 12mm toughened per m2'
    ]),
    glassfit: new Set(Object.keys(supplierPrices.glassfit)),
    wispeco: new Set(Object.keys(supplierPrices.wispeco))`);

R("plumbingCatalogue[material.category]", "glassCatalogue[material.category]");
R("const prices = [{ supplier: 'plumblink', cost: baseCost }", "const prices = [{ supplier: 'pg', cost: baseCost }");
R("plumbingCatalogue[materials[index].category]", "glassCatalogue[materials[index].category]");

R("function getQuantity(material) { return Math.max(1, Number(material.quantity) || 1); }",
    "function getQuantity(material) { return Math.max(1, Number(material.quantity) || 1); }\n" +
    "function getLineArea(item) { const w = Number(item.width) || 0, h = Number(item.height) || 0; return w > 0 && h > 0 ? (w * h) / 1e6 : 0; }\n" +
    "function areaLabel(item) { const a = getLineArea(item); return a ? " + B + " (" + D + "{(Number(item.width) / 1000).toFixed(2)}m x " + D + "{(Number(item.height) / 1000).toFixed(2)}m = " + D + "{a.toFixed(2)}m2)" + B + " : ''; }\n" +
    "function getMaterialEffectiveQty(material) { return getQuantity(material) * (getLineArea(material) || 1); }\n" +
    "function getServiceEffectiveQty(service) { return getServiceQuantity(service) * (getLineArea(service) || 1); }");

R('getSupplierCost(material) * getQuantity(material) * (1 + MATERIAL_MARKUP / 100)', 'getSupplierCost(material) * getMaterialEffectiveQty(material) * (1 + MATERIAL_MARKUP / 100)');
R('getServiceRate(service) * getServiceQuantity(service)', 'getServiceRate(service) * getServiceEffectiveQty(service)');

R('<td>${getQuantity(material)}</td>', '<td>${getQuantity(material)}${areaLabel(material)}</td>');
R('<td>${getServiceQuantity(service)}</td><td>${currency(getServiceRate(service))}</td>', '<td>${getServiceQuantity(service)}${areaLabel(service)}</td><td>${currency(getServiceRate(service))}</td>');

R('<input class="material-quantity" type="number" min="1" step="1" value="${getQuantity(material)}" aria-label="Material quantity">',
    '<input class="material-width" type="number" min="0" step="1" value="${Math.round(Number(material.width) || 0)}" placeholder="W mm" aria-label="Width in mm"><input class="material-height" type="number" min="0" step="1" value="${Math.round(Number(material.height) || 0)}" placeholder="H mm" aria-label="Height in mm">\n            <input class="material-quantity" type="number" min="1" step="1" value="${getQuantity(material)}" aria-label="Material quantity">');

R("row.querySelector('.material-quantity').addEventListener('input', event => { materials[index].quantity = Math.max(1, Math.floor(getValue(event.target.value))); renderMaterials(); calculate(); });",
    "row.querySelector('.material-quantity').addEventListener('input', event => { materials[index].quantity = Math.max(1, Math.floor(getValue(event.target.value))); renderMaterials(); calculate(); });\n" +
    "        row.querySelector('.material-width').addEventListener('input', event => { materials[index].width = getValue(event.target.value); renderMaterials(); calculate(); });\n" +
    "        row.querySelector('.material-height').addEventListener('input', event => { materials[index].height = getValue(event.target.value); renderMaterials(); calculate(); });");

R('${unitSelect(getServiceUnit(service), `Unit for ${service.task || \'service\'}`).replace(\'class="price-unit"\', \'class="service-unit"\')}<input class="service-quantity" type="number" min="1" step="1" value="${getServiceQuantity(service)}" aria-label="Service quantity">',
    '<input class="service-width" type="number" min="0" step="1" value="${Math.round(Number(service.width) || 0)}" placeholder="W mm" aria-label="Width in mm"><input class="service-height" type="number" min="0" step="1" value="${Math.round(Number(service.height) || 0)}" placeholder="H mm" aria-label="Height in mm">' + D + '{unitSelect(getServiceUnit(service), ' + B + 'Unit for ' + D + '{service.task || \'service\'}' + B + ').replace(\'class="price-unit"\', \'class="service-unit"\')}<input class="service-quantity" type="number" min="1" step="1" value="${getServiceQuantity(service)}" aria-label="Service quantity">');

R("row.querySelector('.service-quantity').addEventListener('input', event => { services[index].quantity = getServiceQuantity({ quantity: event.target.value }); renderServices(); calculate(); });",
    "row.querySelector('.service-quantity').addEventListener('input', event => { services[index].quantity = getServiceQuantity({ quantity: event.target.value }); renderServices(); calculate(); });\n" +
    "        row.querySelector('.service-width').addEventListener('input', event => { services[index].width = getValue(event.target.value); renderServices(); calculate(); });\n" +
    "        row.querySelector('.service-height').addEventListener('input', event => { services[index].height = getValue(event.target.value); renderServices(); calculate(); });");

if (failed) { console.error('NOT WRITTEN — fix misses first'); process.exit(1); }
s = s.split('@D@').join('$').split('@B@').join('`');
writeFileSync(path, s);
console.log('app.js patched OK');
