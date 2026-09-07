const VAT_DEFAULT = 15;
const MATERIAL_MARKUP = 45;
let selectedSupplier = 'plumblink';
const currency = value => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(Number(value) || 0);
const $ = id => document.getElementById(id);
let materials = [];
let services = [];
let sitePhotos = [];
let loadedQuoteIndex = null;
let isAmended = false;
const defaultLabourItems = () => [
    { description: 'Call-out fee', unit: 'Each', quantity: 1, rate: 650, type: 'callout' },
    { description: 'Inspection & evaluation', unit: 'Day', quantity: 0, rate: 500, type: 'labour' },
    { description: 'Additional labour', unit: 'Day', quantity: 0, rate: 500, type: 'labour' }
];
let labourItems = defaultLabourItems();
let importedServiceRates = {};
let settings = JSON.parse(localStorage.getItem('pipewise-settings') || '{}');
settings.name ||= 'Architectural Glass and Aluminium (Pty) Ltd';
settings.preparedBy ||= 'Jan Myburgh';
settings.phone ||= '010 597 6616';
settings.email ||= 'info@agasouthafrica.co.za';
settings.taxNumber ||= '105 976 616';
let quotes = JSON.parse(localStorage.getItem('pipewise-quotes') || '[]');
const glassCatalogue = {
    'Glass products': {
        'Toughened safety glass': { sizes: { '6mm per m2': 950, '8mm per m2': 1250, '10mm per m2': 1650, '12mm per m2': 2100 }, markup: MATERIAL_MARKUP },
        'Laminated safety glass': { sizes: { '6.38mm per m2': 1450, '8.38mm per m2': 1800, '10.38mm per m2': 2250 }, markup: MATERIAL_MARKUP },
        'Float glass': { sizes: { '3mm per m2': 420, '4mm per m2': 520, '5mm per m2': 650, '6mm per m2': 780 }, markup: MATERIAL_MARKUP },
        'Frosted glass': { sizes: { '4mm per m2': 720, '6mm per m2': 950 }, markup: MATERIAL_MARKUP },
        'Tinted glass': { sizes: { '4mm per m2': 680, '6mm per m2': 890, '8mm per m2': 1150 }, markup: MATERIAL_MARKUP },
        Mirror: { sizes: { '4mm per m2': 850, '6mm per m2': 1100 }, markup: MATERIAL_MARKUP },
        'Shower glass panel': { sizes: { '8mm clear per m2': 2350, '10mm clear per m2': 2800 }, markup: MATERIAL_MARKUP },
        'Glass balustrade panel': { sizes: { '10mm toughened per m2': 2950, '12mm toughened per m2': 3500 }, markup: MATERIAL_MARKUP }
    },
    'Aluminium systems': {
        'Aluminium window frame': { sizes: { 'Standard per m2': 1650, 'Heavy duty per m2': 2100 }, markup: MATERIAL_MARKUP },
        'Aluminium door frame': { sizes: { 'Standard per m2': 1950, 'Heavy duty per m2': 2500 }, markup: MATERIAL_MARKUP },
        'Shopfront section': { sizes: { 'Per metre': 480, 'Per m2 glazed': 2650 }, markup: MATERIAL_MARKUP },
        'Sliding door kit': { sizes: { '2 panel per m2': 3200, '3 panel per m2': 3600, '4 panel per m2': 3950 }, markup: MATERIAL_MARKUP },
        'Aluminium extrusion': { sizes: { 'Per metre': 145 }, markup: 30 }
    },
    Doors: {
        'Aluminium sliding door': { sizes: { '2 panel': 6800, '3 panel': 9500, '4 panel': 12500 }, markup: MATERIAL_MARKUP },
        'Aluminium pivot door': { sizes: { Single: 5400, Double: 8900 }, markup: MATERIAL_MARKUP },
        'Aluminium hinged door': { sizes: { Single: 4600, 'Stable door': 6200 }, markup: MATERIAL_MARKUP },
        'Glass door patch fittings': { sizes: { 'Set per door': 1450 }, markup: MATERIAL_MARKUP }
    },
    Windows: {
        'Aluminium sliding window': { sizes: { 'Per m2': 2100 }, markup: MATERIAL_MARKUP },
        'Aluminium top-hung window': { sizes: { 'Per m2': 2300 }, markup: MATERIAL_MARKUP },
        'Aluminium side-hung window': { sizes: { 'Per m2': 2250 }, markup: MATERIAL_MARKUP },
        'Aluminium fixed window': { sizes: { 'Per m2': 1650 }, markup: MATERIAL_MARKUP }
    },
    Hardware: {
        'Door handle set': { sizes: { Standard: 380, Premium: 850 }, markup: MATERIAL_MARKUP },
        'Window handle': { sizes: { Standard: 145, Locking: 260 }, markup: MATERIAL_MARKUP },
        'Sliding door rollers': { sizes: { Pair: 320 }, markup: MATERIAL_MARKUP },
        'Hinge set': { sizes: { Standard: 180 }, markup: MATERIAL_MARKUP },
        'Door closer': { sizes: { Standard: 680 }, markup: MATERIAL_MARKUP }
    },
    'Glazing consumables': {
        'Silicone sealant': { sizes: { '280ml': 95 }, markup: MATERIAL_MARKUP },
        'Glazing rubber gasket': { sizes: { 'Per metre': 28 }, markup: MATERIAL_MARKUP },
        'Setting blocks': { sizes: { 'Pack of 100': 120 }, markup: MATERIAL_MARKUP },
        'Aluminium rivets': { sizes: { 'Pack of 100': 65 }, markup: MATERIAL_MARKUP },
        'Glazing tape': { sizes: { Roll: 180 }, markup: MATERIAL_MARKUP },
        'Glass cleaner': { sizes: { '750ml': 55 }, markup: MATERIAL_MARKUP }
    }
};
const catalogueCategories = Object.keys(glassCatalogue);
const serviceCatalogue = {
    'Glazing work': ['Measure opening', 'Remove broken glass', 'Cut glass to size', 'Install glass panel', 'Install mirror', 'Seal glass with silicone', 'Replace shopfront glass', 'Install aluminium window', 'Install aluminium door', 'Install sliding door', 'Install shower enclosure', 'Install glass balustrade', 'Fit glazing gaskets', 'Re-glaze window', 'Adjust sliding door', 'Replace door rollers'],
    'Frame & installation work': ['Remove old frame', 'Drill and fix frame', 'Pack and level frame', 'Install frame anchors', 'Cut aluminium profile', 'Assemble frame section', 'Install shopfront framework', 'Fit door hardware', 'Fit window hardware'],
    'Site & preparation': ['Site inspection', 'Measure and quote', 'Scaffold hire', 'Remove and dispose of broken glass', 'Protect work area', 'Clean work area'],
    'Additional labour': ['Load or unload materials', 'Remove building rubble', 'Clean glass panels', 'Assist glazier'],
    Equipment: ['Scaffold tower hire', 'Glass suction lifter hire', 'Glass cutting table hire']
};
serviceCatalogue['Glazing work'].push('Call-out and inspection', 'Site measurement', 'Temper glass to size', 'Deliver glass to site', 'Test door operation', 'Final inspection');
serviceCatalogue['Site & preparation'].push('Remove old glass panel', 'Prepare opening', 'Check opening squareness');
const serviceRates = { 'Measure opening': 350, 'Remove broken glass': 450, 'Install glass panel': 850, 'Install mirror': 650, 'Seal glass with silicone': 250, 'Replace shopfront glass': 1200, 'Install aluminium window': 950, 'Install aluminium door': 1450, 'Install sliding door': 1850, 'Install shower enclosure': 1250, 'Install glass balustrade': 1650, 'Site inspection': 350, 'Scaffold hire': 950, 'Clean work area': 250, 'Scaffold tower hire': 850, 'Glass suction lifter hire': 450, 'Glass cutting table hire': 600 };
const storedServiceRates = JSON.parse(localStorage.getItem('pipewise-service-rates') || '{}');
Object.assign(serviceRates, storedServiceRates);
const serviceUnits = JSON.parse(localStorage.getItem('pipewise-service-units') || '{}');
const scenarios = {
    'shopfront-glass': { services: [{ category: 'Glazing work', task: 'Measure opening', quantity: 1, rate: 350 }, { category: 'Frame & installation work', task: 'Install shopfront framework', quantity: 1, rate: 1500 }, { category: 'Glazing work', task: 'Replace shopfront glass', quantity: 1, rate: 1200 }, { category: 'Glazing work', task: 'Seal glass with silicone', quantity: 1, rate: 250 }, { category: 'Site & preparation', task: 'Clean work area', quantity: 1, rate: 250 }], materials: [{ category: 'Aluminium systems', type: 'Shopfront section', size: 'Per m2 glazed', quantity: 1, description: 'Shopfront section - Per m2 glazed', cost: 2650, markup: MATERIAL_MARKUP }, { category: 'Glass products', type: 'Toughened safety glass', size: '10mm per m2', quantity: 1, description: 'Toughened safety glass - 10mm per m2', cost: 1650, markup: MATERIAL_MARKUP }] },
    'aluminium-window': { services: [{ category: 'Frame & installation work', task: 'Remove old frame', quantity: 1, rate: 450 }, { category: 'Glazing work', task: 'Install aluminium window', quantity: 1, rate: 950 }, { category: 'Site & preparation', task: 'Clean work area', quantity: 1, rate: 250 }], materials: [{ category: 'Windows', type: 'Aluminium sliding window', size: 'Per m2', quantity: 1, description: 'Aluminium sliding window - Per m2', cost: 2100, markup: MATERIAL_MARKUP }] },
    'sliding-door': { services: [{ category: 'Frame & installation work', task: 'Remove old frame', quantity: 1, rate: 450 }, { category: 'Glazing work', task: 'Install sliding door', quantity: 1, rate: 1850 }, { category: 'Frame & installation work', task: 'Fit door hardware', quantity: 1, rate: 350 }, { category: 'Site & preparation', task: 'Clean work area', quantity: 1, rate: 250 }], materials: [{ category: 'Doors', type: 'Aluminium sliding door', size: '2 panel', quantity: 1, description: 'Aluminium sliding door - 2 panel', cost: 6800, markup: MATERIAL_MARKUP }] },
    'shower-enclosure': { services: [{ category: 'Glazing work', task: 'Measure opening', quantity: 1, rate: 350 }, { category: 'Glazing work', task: 'Install shower enclosure', quantity: 1, rate: 1250 }, { category: 'Glazing work', task: 'Seal glass with silicone', quantity: 1, rate: 250 }], materials: [{ category: 'Glass products', type: 'Shower glass panel', size: '8mm clear per m2', quantity: 1, description: 'Shower glass panel - 8mm clear per m2', cost: 2350, markup: MATERIAL_MARKUP }, { category: 'Glazing consumables', type: 'Glazing rubber gasket', size: 'Per metre', quantity: 3, description: 'Glazing rubber gasket - Per metre', cost: 28, markup: MATERIAL_MARKUP }] },
    'broken-window': { services: [{ category: 'Site & preparation', task: 'Site inspection', quantity: 1, rate: 350 }, { category: 'Glazing work', task: 'Remove broken glass', quantity: 1, rate: 450 }, { category: 'Glazing work', task: 'Install glass panel', quantity: 1, rate: 850 }], materials: [{ category: 'Glass products', type: 'Float glass', size: '4mm per m2', quantity: 1, description: 'Float glass - 4mm per m2', cost: 520, markup: MATERIAL_MARKUP }] },
    'balustrade': { services: [{ category: 'Glazing work', task: 'Measure opening', quantity: 1, rate: 350 }, { category: 'Glazing work', task: 'Install glass balustrade', quantity: 1, rate: 1650 }, { category: 'Site & preparation', task: 'Scaffold hire', quantity: 1, rate: 950 }], materials: [{ category: 'Glass products', type: 'Glass balustrade panel', size: '10mm toughened per m2', quantity: 1, description: 'Glass balustrade panel - 10mm toughened per m2', cost: 2950, markup: MATERIAL_MARKUP }] },
    'mirror-install': { services: [{ category: 'Glazing work', task: 'Measure opening', quantity: 1, rate: 350 }, { category: 'Glazing work', task: 'Install mirror', quantity: 1, rate: 650 }], materials: [{ category: 'Glass products', type: 'Mirror', size: '4mm per m2', quantity: 1, description: 'Mirror - 4mm per m2', cost: 850, markup: MATERIAL_MARKUP }] }
};
const scenarioEntries = {
    'glass-replacement': [['Glazing work', 'Call-out and inspection'], ['Glazing work', 'Measure opening'], ['Glazing work', 'Remove broken glass'], ['Glazing work', 'Cut glass to size'], ['Glazing work', 'Install glass panel'], ['Glazing work', 'Seal glass with silicone'], ['Site & preparation', 'Clean work area']],
    'shopfront-doors': [['Site & preparation', 'Site inspection'], ['Glazing work', 'Site measurement'], ['Frame & installation work', 'Remove old frame'], ['Frame & installation work', 'Install shopfront framework'], ['Frame & installation work', 'Assemble frame section'], ['Glazing work', 'Install glass panel'], ['Frame & installation work', 'Fit door hardware'], ['Glazing work', 'Test door operation'], ['Site & preparation', 'Clean work area']],
    'window-bank': [['Site & preparation', 'Site inspection'], ['Glazing work', 'Site measurement'], ['Frame & installation work', 'Remove old frame'], ['Frame & installation work', 'Drill and fix frame'], ['Frame & installation work', 'Pack and level frame'], ['Glazing work', 'Install aluminium window'], ['Glazing work', 'Fit glazing gaskets'], ['Glazing work', 'Final inspection'], ['Site & preparation', 'Clean work area']],
    'frame-only': [['Site & preparation', 'Site inspection'], ['Frame & installation work', 'Cut aluminium profile'], ['Frame & installation work', 'Assemble frame section'], ['Frame & installation work', 'Drill and fix frame'], ['Frame & installation work', 'Pack and level frame'], ['Site & preparation', 'Clean work area']]
};
Object.values(scenarios).forEach(scenario => scenario.services.forEach(({ category, task, rate }) => { if (!serviceCatalogue[category]) serviceCatalogue[category] = []; if (!serviceCatalogue[category].includes(task)) serviceCatalogue[category].push(task); if (serviceRates[task] === undefined && Number.isFinite(Number(rate))) serviceRates[task] = Number(rate); }));
Object.entries(scenarioEntries).forEach(([id, entries]) => { scenarios[id] = { services: entries.map(([category, task]) => ({ category, task, quantity: 1, rate: serviceRates[task] || 350 })), materials: [] }; });
const masterScenarioLibrary = [
    ['Shopfronts & entrances', 'Shopfront glass replacement', 'Site inspection|Measure opening|Order glass|Protect work area|Remove broken glass|Remove old gaskets|Cut glass to size|Deliver glass to site|Install glass panel|Fit glazing gaskets|Seal glass with silicone|Test installation|Clean glass|Remove rubble|Clean work area'],
    ['Shopfronts & entrances', 'New aluminium shopfront', 'Site inspection|Measure and quote|Final measure|Fabricate framework|Deliver to site|Remove existing shopfront|Install shopfront framework|Install frame anchors|Glaze panels|Fit door hardware|Install glass door|Seal joints|Test door operation|Final inspection|Clean work area'],
    ['Shopfronts & entrances', 'Aluminium entrance door replacement', 'Site inspection|Measure opening|Order door and glass|Remove old door|Remove old frame|Prepare opening|Install aluminium door frame|Pack and level frame|Install door|Fit door hardware|Install door closer|Seal and silicone|Test door operation|Clean work area'],
    ['Windows & doors', 'Aluminium window installation', 'Site inspection|Measure opening|Order windows|Remove old window|Remove old frame|Prepare opening|Install aluminium window|Pack and level frame|Install frame anchors|Fit glazing gaskets|Seal perimeter|Test operation|Clean glass|Clean work area'],
    ['Windows & doors', 'Aluminium sliding door installation', 'Site inspection|Measure opening|Order sliding door|Remove old door|Prepare opening|Install door frame|Pack and level frame|Install sliding panels|Fit rollers|Fit door hardware|Seal perimeter|Test sliding operation|Adjust rollers|Clean work area'],
    ['Windows & doors', 'Window re-glazing', 'Site inspection|Measure opening|Order glass|Remove old glass|Clean frame rebate|Cut glass to size|Install glass panel|Fit setting blocks|Fit glazing gaskets|Seal with silicone|Clean glass|Clean work area'],
    ['Windows & doors', 'Sliding door repair', 'Call-out and inspection|Diagnose fault|Remove door panel|Replace door rollers|Clean tracks|Adjust sliding door|Fit door hardware|Test sliding operation|Lubricate tracks|Clean work area'],
    ['Interiors & bathrooms', 'Shower enclosure installation', 'Site inspection|Measure opening|Order glass and hardware|Prepare shower area|Install wall profiles|Install glass panels|Fit hinges|Fit handles|Fit seals and gaskets|Seal glass with silicone|Test operation|Clean glass|Clean work area'],
    ['Interiors & bathrooms', 'Mirror installation', 'Site inspection|Measure wall area|Order mirror|Prepare wall surface|Install mirror|Seal edges|Clean mirror|Clean work area'],
    ['Interiors & bathrooms', 'Glass splashback installation', 'Site inspection|Measure area|Order glass|Prepare wall surface|Install splashback|Seal edges|Clean glass|Clean work area'],
    ['Balustrades & safety', 'Glass balustrade installation', 'Site inspection|Measure opening|Engineering check|Order glass and fittings|Scaffold hire|Install base channels|Install glass panels|Fit clamps and spigots|Torque all fasteners|Seal joints|Final inspection|Clean glass|Clean work area'],
    ['Balustrades & safety', 'Frameless glass balustrade', 'Site inspection|Measure opening|Engineering check|Order glass|Install spigots|Install glass panels|Level and align panels|Seal joints|Final inspection|Clean glass|Clean work area'],
    ['Glass replacement & repair', 'Broken window emergency replacement', 'Call-out and inspection|Make area safe|Remove broken glass|Board up opening if required|Measure opening|Order glass|Install glass panel|Fit glazing gaskets|Seal with silicone|Clean glass|Clean work area'],
    ['Glass replacement & repair', 'Toughened glass panel replacement', 'Site inspection|Measure opening|Order toughened glass|Remove damaged panel|Clean frame rebate|Install glass panel|Fit setting blocks|Fit glazing gaskets|Seal with silicone|Test installation|Clean glass|Clean work area'],
    ['Maintenance & inspections', 'Glazing maintenance inspection', 'Call-out and inspection|Inspect all glass panels|Check seals and gaskets|Check door operation|Check window operation|Check for delamination|Photograph defects|Provide inspection report|Provide quotation for repairs'],
    ['Maintenance & inspections', 'Silicone and gasket refurbishment', 'Site inspection|Remove old silicone|Remove old gaskets|Clean joints|Install new gaskets|Apply new silicone|Tool silicone joints|Clean glass|Clean work area']
];
const libraryCategoryMap = { 'Shopfronts & entrances': 'Glazing work', 'Windows & doors': 'Glazing work', 'Interiors & bathrooms': 'Glazing work', 'Balustrades & safety': 'Glazing work', 'Glass replacement & repair': 'Glazing work', 'Maintenance & inspections': 'Site & preparation' };
masterScenarioLibrary.forEach(([libraryCategory, name, tasks], index) => { scenarios[`library-${index + 1}`] = { services: tasks.split('|').map(task => ({ category: libraryCategoryMap[libraryCategory], task, quantity: 1, rate: serviceRates[task] || 350 })), materials: [] }; });
const storedScenarioServices = JSON.parse(localStorage.getItem('pipewise-scenario-services') || '{}');
Object.entries(storedScenarioServices).forEach(([id, services]) => { if (scenarios[id] && Array.isArray(services)) scenarios[id].services = services; });
const customScenarios = JSON.parse(localStorage.getItem('pipewise-custom-scenarios') || '[]').filter(scenario => scenario && typeof scenario.id === 'string' && typeof scenario.name === 'string' && Array.isArray(scenario.services));
customScenarios.forEach(scenario => { scenarios[scenario.id] = { services: scenario.services, materials: [] }; });
const standardGlazingServices = {
    'Glazing work': ['Install glass splashback', 'Install frameless glass door', 'Install glass partition', 'Install glass canopy', 'Install glass pool fence', 'Replace window glass', 'Replace door glass', 'Frosted glass film', 'Safety film application', 'Sandblasting glass'],
    'Frame & installation work': ['Install aluminium partition framing', 'Install curtain wall framing', 'Repair damaged frame', 'Re-align door frame', 'Replace window handles', 'Replace hinges', 'Fabricate aluminium section'],
    'Site & preparation': ['Emergency make-safe service', 'Board up broken opening', 'Crane or hoist hire', 'Delivery and handling', 'Site assessment and quotation'],
    'Compliance & testing': ['Balustrade load test', 'Safety glass compliance certificate', 'Glazing warranty inspection']
};
Object.entries(standardGlazingServices).forEach(([category, tasks]) => { if (!serviceCatalogue[category]) serviceCatalogue[category] = []; tasks.forEach(task => { if (!serviceCatalogue[category].includes(task)) serviceCatalogue[category].push(task); }); });
const storedServiceCatalogue = JSON.parse(localStorage.getItem('pipewise-service-catalogue') || '{}');
Object.entries(storedServiceCatalogue).forEach(([category, tasks]) => { if (!Array.isArray(tasks)) return; if (!serviceCatalogue[category]) serviceCatalogue[category] = []; tasks.forEach(task => { if (typeof task === 'string' && !serviceCatalogue[category].includes(task)) serviceCatalogue[category].push(task); }); });
const serviceCategories = Object.keys(serviceCatalogue);
const supplierInfo = {
    pg: { name: 'PG Glass', url: 'https://www.pgglass.co.za/' },
    glassfit: { name: 'Glassfit', url: 'https://www.glassfit.co.za/' },
    wispeco: { name: 'Wispeco Aluminium', url: 'https://www.wispeco.co.za/' }
};
const supplierOptions = Object.keys(supplierInfo);
const supplierPrices = {
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
};
const supplierAvailability = {
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
    wispeco: new Set(Object.keys(supplierPrices.wispeco))
};
const priceCheckKey = 'pipewise-last-price-check';
function getBestMaterialPrice(material) {
    if (!material.description) return { cost: getValue(material.cost), suppliers: [] };
    const baseCost = glassCatalogue[material.category]?.[material.type]?.sizes[material.size] ?? getValue(material.cost);
    const prices = [{ supplier: 'pg', cost: baseCost }, ...Object.entries(supplierPrices).filter(([, catalogue]) => catalogue[material.description] !== undefined).map(([supplier, catalogue]) => ({ supplier, cost: catalogue[material.description] }))].filter(({ cost }) => Number.isFinite(cost) && cost > 0);
    if (!prices.length) return { cost: 0, suppliers: [] };
    const cost = Math.min(...prices.map(price => price.cost));
    return { cost, suppliers: prices.filter(price => price.cost === cost).map(price => price.supplier) };
}
function getSupplierCost(material) { return getBestMaterialPrice(material).cost; }
function getMaterialSuppliers(material) {
    if (!material.description) return 'Select material';
    const bestPrice = getBestMaterialPrice(material);
    if (!bestPrice.suppliers.length) return 'No price match';
    return `${currency(bestPrice.cost)} - ${bestPrice.suppliers.map(supplier => supplierInfo[supplier].name).join(', ')}`;
}
function getQuantity(material) { return Math.max(1, Number(material.quantity) || 1); }
function getLineArea(item) { const w = Number(item.width) || 0, h = Number(item.height) || 0; return w > 0 && h > 0 ? (w * h) / 1e6 : 0; }
function areaLabel(item) { const a = getLineArea(item); return a ? ` (${(Number(item.width) / 1000).toFixed(2)}m x ${(Number(item.height) / 1000).toFixed(2)}m = ${a.toFixed(2)}m2)` : ''; }
function getMaterialEffectiveQty(material) { return getQuantity(material) * (getLineArea(material) || 1); }
function getServiceEffectiveQty(service) { return getServiceQuantity(service) * (getLineArea(service) || 1); }
function getServiceQuantity(service) { return Math.max(1, Number(service.quantity) || 1); }
function getServiceRate(service) { const priceListRate = serviceRates[service.task]; return priceListRate === undefined ? Number(service.rate) || 350 : priceListRate; }
function getServiceUnit(service) { return service.unit || serviceUnits[service.task] || 'Each'; }
function importPriceList(event) {
    const file = event.target.files[0];
    if (!file || typeof XLSX === 'undefined') { showToast('Excel parser could not be loaded'); return; }
    const reader = new FileReader();
    reader.onload = () => {
        const workbook = XLSX.read(reader.result, { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Master Price List'] || workbook.Sheets[workbook.SheetNames[0]], { defval: '' });
        let count = 0;
        rows.forEach(row => {
            const category = String(row.Category || 'Imported price list').trim();
            const task = String(row.Item || '').trim();
            const rate = Number(row['Default Price (ZAR)']);
            if (!task || !Number.isFinite(rate)) return;
            if (!serviceCatalogue[category]) serviceCatalogue[category] = [];
            if (!serviceCatalogue[category].includes(task)) serviceCatalogue[category].push(task);
            importedServiceRates[task] = rate;
            serviceRates[task] = rate;
            serviceUnits[task] = String(row.Unit || 'Each').trim();
            count += 1;
        });
        serviceCategories.splice(0, serviceCategories.length, ...Object.keys(serviceCatalogue));
        persistServiceCatalogue();
        localStorage.setItem('pipewise-service-rates', JSON.stringify(serviceRates));
        localStorage.setItem('pipewise-service-units', JSON.stringify(serviceUnits));
        $('price-list-status').textContent = `${count} Excel prices loaded from ${file.name}`;
        renderServices();
        if ($('price-list-body')) renderPriceList();
        showToast(`${count} master prices loaded`);
    };
    reader.readAsArrayBuffer(file);
}
function getServiceTasks(service) { const tasks = serviceCatalogue[service.category] || []; return service.task && !tasks.includes(service.task) ? [...tasks, service.task] : tasks; }
function categoryOptions(selected) { return `<option value="">Select category</option>${serviceCategories.map(category => `<option value="${escapeHtml(category)}" ${selected === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}`; }
function persistServiceCatalogue() { localStorage.setItem('pipewise-service-catalogue', JSON.stringify(serviceCatalogue)); }
const unitOptions = ['Each', 'Hour', 'Day', 'Metre', 'mÂ²', 'mÂ³', 'Job', 'Connection', 'Load', 'Hole'];
function unitSelect(selected, label) { const options = unitOptions.includes(selected) ? unitOptions : [selected, ...unitOptions]; return `<select class="price-unit" aria-label="${label}">${options.map(unit => `<option value="${escapeHtml(unit)}" ${unit === selected ? 'selected' : ''}>${escapeHtml(unit)}</option>`).join('')}</select>`; }
function renderPriceList() {
    const query = ($('price-list-search')?.value || '').toLowerCase();
    const rows = Object.entries(serviceCatalogue).flatMap(([category, tasks]) => tasks.map(task => ({ category, task, unit: serviceUnits[task] || 'Each', rate: getServiceRate({ task }) }))).filter(row => `${row.category} ${row.unit} ${row.task}`.toLowerCase().includes(query));
    $('price-list-body').innerHTML = rows.map(row => `<tr class="price-entry" data-task="${escapeHtml(row.task)}"><td><select class="price-category" aria-label="Category for ${escapeHtml(row.task)}">${categoryOptions(row.category)}</select></td><td>${unitSelect(row.unit, `Type or unit for ${escapeHtml(row.task)}`)}</td><td><input class="price-line-item" value="${escapeHtml(row.task)}" aria-label="Line item ${escapeHtml(row.task)}"></td><td><input class="price-rate" data-task="${escapeHtml(row.task)}" type="number" min="0" step="0.01" value="${row.rate}" aria-label="Rate for ${escapeHtml(row.task)}"></td><td><button class="delete-price" type="button" aria-label="Delete ${escapeHtml(row.task)}">Ã—</button></td></tr>`).join('');
    document.querySelectorAll('.delete-price').forEach(button => button.addEventListener('click', () => deletePrice(button.closest('.price-entry'))));
    $('price-list-count').textContent = `${rows.length} prices`;
}
function deletePrice(row) {
    const task = row.dataset.task;
    if (!task || !window.confirm(`Delete "${task}" from the price list?`)) return;
    Object.values(serviceCatalogue).forEach(tasks => { const index = tasks.indexOf(task); if (index >= 0) tasks.splice(index, 1); });
    delete serviceRates[task];
    delete serviceUnits[task];
    persistServiceCatalogue();
    localStorage.setItem('pipewise-service-rates', JSON.stringify(serviceRates));
    localStorage.setItem('pipewise-service-units', JSON.stringify(serviceUnits));
    renderPriceList();
    renderServices();
    showToast('Price removed');
}
function savePriceList() {
    document.querySelectorAll('.price-entry').forEach(row => { const oldTask = row.dataset.task; const task = row.querySelector('.price-line-item').value.trim(); const category = row.querySelector('.price-category').value; if (!task || !category) return; if (oldTask && oldTask !== task) { Object.values(serviceCatalogue).forEach(tasks => { const oldIndex = tasks.indexOf(oldTask); if (oldIndex >= 0) tasks.splice(oldIndex, 1); }); delete serviceRates[oldTask]; delete serviceUnits[oldTask]; } if (!serviceCatalogue[category].includes(task)) serviceCatalogue[category].push(task); serviceRates[task] = getValue(row.querySelector('.price-rate').value); serviceUnits[task] = row.querySelector('.price-unit').value || 'Each'; });
    persistServiceCatalogue();
    localStorage.setItem('pipewise-service-rates', JSON.stringify(serviceRates));
    localStorage.setItem('pipewise-service-units', JSON.stringify(serviceUnits));
    renderServices();
    showToast('Price list saved');
}
function getLabourTotals() {
    const callout = labourItems.filter(item => item.type === 'callout').reduce((sum, item) => sum + getValue(item.quantity) * getValue(item.rate), 0);
    const labour = labourItems.filter(item => item.type !== 'callout').reduce((sum, item) => sum + getValue(item.quantity) * getValue(item.rate), 0);
    return { callout, labour, total: callout + labour };
}
function updatePriceCheckStatus() {
    const today = new Date().toISOString().slice(0, 10);
    const lastCheck = localStorage.getItem(priceCheckKey);
    $('price-check-status').textContent = lastCheck === today ? `Prices checked today Â· ${new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}` : 'Morning price check due';
}
function runPriceCheck() {
    localStorage.setItem(priceCheckKey, new Date().toISOString().slice(0, 10));
    materials.forEach(material => { if (material.description) material.cost = getBestMaterialPrice(material).cost; });
    updatePriceCheckStatus();
    renderMaterials();
    showToast('Current material prices updated');
}

function getNumber(id) { return Math.max(0, Number($(id).value) || 0); }
function nextQuoteNumber() { return `AGA-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`; }
function calculate() {
    const { callout, labour, total: labourTotal } = getLabourTotals();
    const materialsTotal = materials.reduce((sum, material) => sum + getSupplierCost(material) * getMaterialEffectiveQty(material) * (1 + MATERIAL_MARKUP / 100), 0);
    const servicesTotal = services.reduce((sum, service) => sum + getServiceRate(service) * getServiceEffectiveQty(service), 0);
    const subtotal = callout + labour + materialsTotal + servicesTotal;
    const vatRate = Number($('vat-rate').value || VAT_DEFAULT);
    const vat = $('vat-enabled').checked ? subtotal * vatRate / 100 : 0;
    $('labour-total').textContent = currency(labourTotal);
    $('summary-callout').textContent = currency(callout);
    $('summary-labour').textContent = currency(labour);
    $('summary-materials').textContent = currency(materialsTotal);
    $('summary-services').textContent = currency(servicesTotal);
    $('grand-total').textContent = currency(subtotal + vat);
    $('vat-rate-label').textContent = `${vatRate}%`;
    updatePrintDetails({ callout, labour, materialsTotal, servicesTotal, subtotal, vat, total: subtotal + vat, vatRate });
    return { callout, labour, materialsTotal, servicesTotal, subtotal, vat, total: subtotal + vat, vatRate };
}
function updatePrintDetails(totals = calculateTotals()) {
    const customer = $('customer-name').value.trim() || 'New customer';
    const phone = $('customer-phone').value.trim() || 'Not provided';
    const address = $('customer-address').value.trim() || 'Not provided';
    const description = $('service-description').value.trim();
    const amendmentReason = $('amendment-reason').value.trim() || 'Reason not provided';
    const labourRows = labourItems.map(item => `<tr><td>${escapeHtml(item.description)}</td><td>${escapeHtml(item.unit)}</td><td>${getValue(item.quantity)}</td><td>${currency(item.rate)}</td><td>${currency(getValue(item.quantity) * getValue(item.rate))}</td></tr>`).join('');
    const rows = materials.filter(material => material.description).map(material => `<tr><td>${escapeHtml(material.description)}</td><td>${getQuantity(material)}${areaLabel(material)}</td><td>${currency(getSupplierCost(material) * getMaterialEffectiveQty(material) * (1 + MATERIAL_MARKUP / 100))}</td></tr>`).join('');
    const serviceRows = services.filter(service => service.task).map(service => `<tr><td>${escapeHtml(service.task)}</td><td>${escapeHtml(getServiceUnit(service))}</td><td>${getServiceQuantity(service)}${areaLabel(service)}</td><td>${currency(getServiceRate(service))}</td><td>${currency(getServiceRate(service) * getServiceEffectiveQty(service))}</td></tr>`).join('');
    const supportingPhotos = sitePhotos.length ? `<section class="print-supporting-photos"><h3>Supporting photos</h3><div>${sitePhotos.map((photo, index) => `<figure><img src="${photo.data}" alt="Supporting photo ${index + 1}"><figcaption>${escapeHtml(photo.description || `Supporting photo ${index + 1}`)}</figcaption></figure>`).join('')}</div></section>` : '';
    $('print-details').innerHTML = `<div class="print-document-title"><span>${isAmended ? 'AMENDED QUOTATION' : 'QUOTATION'}</span><strong>${escapeHtml($('quote-number').textContent)}</strong></div><div class="print-customer"><strong>${escapeHtml(customer)}</strong><span>${escapeHtml(phone)}</span><span>${escapeHtml(address)}</span>${description ? `<span><b>Requested services:</b> ${escapeHtml(description)}</span>` : ''}</div><h3>Labour &amp; call-out</h3><table><thead><tr><th>Description</th><th>Unit</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${labourRows}</tbody></table><h3>Materials</h3><table><thead><tr><th>Description</th><th>Qty</th><th>Selling price</th></tr></thead><tbody>${rows || '<tr><td colspan="3">No materials added</td></tr>'}</tbody></table><h3>Services &amp; site work</h3><table><thead><tr><th>Task</th><th>Unit</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${serviceRows || '<tr><td colspan="5">No additional services</td></tr>'}</tbody></table><div class="print-totals"><span>Subtotal: ${currency(totals.subtotal)}</span><span>VAT (${totals.vatRate}%): ${currency(totals.vat)}</span><strong>Total: ${currency(totals.total)}</strong></div>${isAmended ? `<div class="print-amendment"><strong>Reason for amended quote</strong><span>${escapeHtml(amendmentReason)}</span></div>` : ''}${supportingPhotos}`;
}
function calculateTotals() {
    const { callout, labour } = getLabourTotals();
    const materialsTotal = materials.reduce((sum, material) => sum + getSupplierCost(material) * getMaterialEffectiveQty(material) * (1 + MATERIAL_MARKUP / 100), 0);
    const servicesTotal = services.reduce((sum, service) => sum + getServiceRate(service) * getServiceEffectiveQty(service), 0);
    const subtotal = callout + labour + materialsTotal + servicesTotal;
    const vatRate = Number($('vat-rate').value || VAT_DEFAULT);
    const vat = $('vat-enabled').checked ? subtotal * vatRate / 100 : 0;
    return { callout, labour, materialsTotal, servicesTotal, subtotal, vat, total: subtotal + vat, vatRate };
}
function renderServices() {
    $('service-list').innerHTML = services.map((service, index) => { const group = service.scenario || 'Additional services'; const previousGroup = index ? services[index - 1].scenario || 'Additional services' : ''; const heading = group === previousGroup ? '' : `<div class="service-group-label">${escapeHtml(group)}</div>`; return `${heading}<div class="material-row service-row" data-index="${index}"><select class="service-category" aria-label="Service category"><option value="">Select category</option>${serviceCategories.map(category => `<option ${service.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}</select><select class="service-task" aria-label="Service task"><option value="">Select task</option>${getServiceTasks(service).map(task => `<option ${service.task === task ? 'selected' : ''}>${escapeHtml(task)}</option>`).join('')}</select><input class="service-width" type="number" min="0" step="1" value="${Math.round(Number(service.width) || 0)}" placeholder="W mm" aria-label="Width in mm"><input class="service-height" type="number" min="0" step="1" value="${Math.round(Number(service.height) || 0)}" placeholder="H mm" aria-label="Height in mm">${unitSelect(getServiceUnit(service), `Unit for ${service.task || 'service'}`).replace('class="price-unit"', 'class="service-unit"')}<input class="service-quantity" type="number" min="1" step="1" value="${getServiceQuantity(service)}" aria-label="Service quantity"><span class="service-rate">${currency(getServiceRate(service))}</span><span class="service-total">${currency(getServiceRate(service) * getServiceEffectiveQty(service))}</span><button class="remove-material" type="button" aria-label="Remove service">Ã—</button></div>`; }).join('');
    $('service-empty').style.display = services.length ? 'none' : 'block';
    document.querySelectorAll('.service-row').forEach(row => { const index = Number(row.dataset.index); row.querySelector('.service-category').addEventListener('change', event => { services[index] = { ...services[index], category: event.target.value, task: '', unit: 'Each', quantity: 1, rate: 350 }; renderServices(); }); row.querySelector('.service-task').addEventListener('change', event => { services[index].task = event.target.value; services[index].unit = serviceUnits[event.target.value] || 'Each'; services[index].rate = serviceRates[event.target.value] || 350; renderServices(); }); row.querySelector('.service-unit').addEventListener('change', event => { services[index].unit = event.target.value; }); row.querySelector('.service-quantity').addEventListener('input', event => { services[index].quantity = getServiceQuantity({ quantity: event.target.value }); renderServices(); calculate(); });
        row.querySelector('.service-width').addEventListener('input', event => { services[index].width = getValue(event.target.value); renderServices(); calculate(); });
        row.querySelector('.service-height').addEventListener('input', event => { services[index].height = getValue(event.target.value); renderServices(); calculate(); }); row.querySelector('.remove-material').addEventListener('click', () => { services.splice(index, 1); renderServices(); calculate(); }); });
}
function renderScenarioEditor() {
    const scenario = scenarios[$('scenario-editor-select').value];
    $('scenario-editor-list').innerHTML = scenario ? scenario.services.map((service, index) => `<div class="scenario-editor-row" data-index="${index}"><select class="scenario-editor-category" aria-label="Scenario service category"><option value="">Select category</option>${serviceCategories.map(category => `<option ${service.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}</select><select class="scenario-editor-task" aria-label="Scenario service task"><option value="">Select task</option>${getServiceTasks(service).map(task => `<option ${service.task === task ? 'selected' : ''}>${escapeHtml(task)}</option>`).join('')}</select>${unitSelect(getServiceUnit(service), `Unit for ${service.task || 'scenario service'}`).replace('class="price-unit"', 'class="scenario-editor-unit"')}<input class="scenario-editor-quantity" type="number" min="1" step="1" value="${getServiceQuantity(service)}" aria-label="Scenario service quantity"><span class="scenario-editor-rate">${currency(getServiceRate(service))}</span><span>${currency(getServiceRate(service) * getServiceEffectiveQty(service))}</span><button class="remove-material" type="button" aria-label="Remove scenario service">Ã—</button></div>`).join('') : '';
    $('scenario-editor-empty').style.display = scenario ? (scenario.services.length ? 'none' : 'block') : 'block';
    document.querySelectorAll('.scenario-editor-row').forEach(row => { const index = Number(row.dataset.index); row.querySelector('.scenario-editor-category').addEventListener('change', event => { scenario.services[index] = { ...scenario.services[index], category: event.target.value, task: '', unit: 'Each', quantity: 1, rate: 350 }; renderScenarioEditor(); }); row.querySelector('.scenario-editor-task').addEventListener('change', event => { scenario.services[index].task = event.target.value; scenario.services[index].unit = serviceUnits[event.target.value] || 'Each'; scenario.services[index].rate = serviceRates[event.target.value] || 350; renderScenarioEditor(); }); row.querySelector('.scenario-editor-unit').addEventListener('change', event => { scenario.services[index].unit = event.target.value; }); row.querySelector('.scenario-editor-quantity').addEventListener('input', event => { scenario.services[index].quantity = getServiceQuantity({ quantity: event.target.value }); renderScenarioEditor(); }); row.querySelector('.remove-material').addEventListener('click', () => { scenario.services.splice(index, 1); renderScenarioEditor(); }); });
}
function saveScenarioServices() { const id = $('scenario-editor-select').value; if (!id) { showToast('Select a scenario first'); return; } const savedServices = Object.fromEntries(Object.entries(scenarios).map(([scenarioId, scenario]) => [scenarioId, scenario.services])); customScenarios.forEach(scenario => { scenario.services = scenarios[scenario.id].services; }); localStorage.setItem('pipewise-scenario-services', JSON.stringify(savedServices)); localStorage.setItem('pipewise-custom-scenarios', JSON.stringify(customScenarios)); showToast('Scenario services saved'); }
function syncMasterScenarioOptions() { ['scenario-select', 'scenario-editor-select'].forEach(selectId => { const select = $(selectId); select.querySelectorAll('[data-master-scenario]').forEach(optionGroup => optionGroup.remove()); const categories = [...new Set(masterScenarioLibrary.map(([category]) => category))]; categories.forEach(category => { const group = document.createElement('optgroup'); group.label = category; group.dataset.masterScenario = 'true'; masterScenarioLibrary.filter(([libraryCategory]) => libraryCategory === category).forEach(([, name], index) => { const option = document.createElement('option'); option.value = `library-${masterScenarioLibrary.findIndex(([, scenarioName]) => scenarioName === name) + 1}`; option.textContent = name; group.append(option); }); select.append(group); }); }); }
function syncCustomScenarioOptions() { ['scenario-select', 'scenario-editor-select'].forEach(selectId => { const select = $(selectId); select.querySelectorAll('[data-custom-scenario]').forEach(option => option.remove()); let group = [...select.querySelectorAll('optgroup')].find(optionGroup => optionGroup.label === 'Custom scenarios'); if (!group) { group = document.createElement('optgroup'); group.label = 'Custom scenarios'; select.append(group); } customScenarios.forEach(scenario => { const option = document.createElement('option'); option.value = scenario.id; option.textContent = scenario.name; option.dataset.customScenario = 'true'; group.append(option); }); }); }
function createScenario(event) { event.preventDefault(); const name = $('new-scenario-name').value.trim(); if (!name) { $('new-scenario-name').focus(); return; } const id = `custom-${Date.now()}`; const scenario = { id, name, services: [] }; customScenarios.push(scenario); scenarios[id] = { services: scenario.services, materials: [] }; localStorage.setItem('pipewise-custom-scenarios', JSON.stringify(customScenarios)); syncCustomScenarioOptions(); $('scenario-editor-select').value = id; $('scenario-dialog').close(); $('scenario-form').reset(); renderScenarioEditor(); showToast('New scenario created'); }
function renderLabourItems() {
    $('labour-list').innerHTML = labourItems.map((item, index) => `<div class="labour-row" data-index="${index}"><span>${escapeHtml(item.description)}</span><span>${escapeHtml(item.unit)}</span><input class="labour-quantity" type="number" min="0" step="1" value="${getValue(item.quantity)}" aria-label="Quantity for ${escapeHtml(item.description)}"><input class="labour-rate" type="number" min="0" step="0.01" value="${getValue(item.rate)}" aria-label="Cost per day for ${escapeHtml(item.description)}"><strong>${currency(getValue(item.quantity) * getValue(item.rate))}</strong></div>`).join('');
    document.querySelectorAll('.labour-row').forEach(row => { const index = Number(row.dataset.index); row.querySelector('.labour-quantity').addEventListener('input', event => { labourItems[index].quantity = getValue(event.target.value); renderLabourItems(); calculate(); }); row.querySelector('.labour-rate').addEventListener('input', event => { labourItems[index].rate = getValue(event.target.value); renderLabourItems(); calculate(); }); });
}
function addScenario() { const scenario = scenarios[$('scenario-select').value]; if (!scenario) { showToast('Select a job scenario first'); return; } const scenarioName = $('scenario-select').selectedOptions[0].textContent.trim(); services.push(...scenario.services.map(service => ({ ...service, scenario: scenarioName }))); materials.push(...scenario.materials.map(material => ({ ...material }))); renderMaterials(); renderServices(); calculate(); showToast('Scenario added. Remove any items you do not need.'); }
function renderMaterials() {
    $('material-list').innerHTML = materials.map((material, index) => `
    <div class="material-row" data-index="${index}">
                <select class="material-category" aria-label="Material category"><option value="">Select category</option>${catalogueCategories.map(category => `<option ${material.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}</select>
            <select class="material-type" aria-label="Material type"><option value="">Select type</option>${material.category && glassCatalogue[material.category] ? Object.keys(glassCatalogue[material.category]).map(type => `<option ${material.type === type ? 'selected' : ''}>${escapeHtml(type)}</option>`).join('') : ''}</select>
            <select class="material-size" aria-label="Material size"><option value="">Select size</option>${material.category && material.type && glassCatalogue[material.category]?.[material.type] ? Object.keys(glassCatalogue[material.category][material.type].sizes).map(size => `<option ${material.size === size ? 'selected' : ''}>${escapeHtml(size)}</option>`).join('') : ''}</select>
            <input class="material-width" type="number" min="0" step="1" value="${Math.round(Number(material.width) || 0)}" placeholder="W mm" aria-label="Width in mm"><input class="material-height" type="number" min="0" step="1" value="${Math.round(Number(material.height) || 0)}" placeholder="H mm" aria-label="Height in mm">
            <input class="material-quantity" type="number" min="1" step="1" value="${getQuantity(material)}" aria-label="Material quantity">
        <span class="material-best-price">${material.description ? currency(getSupplierCost(material)) : 'â€”'}</span>
    <input class="material-markup" type="number" value="${MATERIAL_MARKUP}" aria-label="Material markup percentage" readonly>
    <span class="material-total">${currency(getSupplierCost(material) * getMaterialEffectiveQty(material) * (1 + MATERIAL_MARKUP / 100))}</span>
      <button class="remove-material" type="button" aria-label="Remove material">Ã—</button>
    </div>`).join('');
    $('material-empty').style.display = materials.length ? 'none' : 'block';
    document.querySelectorAll('#material-list .material-row').forEach(row => {
        const index = Number(row.dataset.index);
        row.querySelector('.material-category').addEventListener('change', event => { materials[index] = { category: event.target.value, type: '', size: '', description: '', cost: 0, markup: MATERIAL_MARKUP }; renderMaterials(); });
        row.querySelector('.material-type').addEventListener('change', event => { materials[index].type = event.target.value; materials[index].size = ''; materials[index].markup = MATERIAL_MARKUP; renderMaterials(); });
        row.querySelector('.material-size').addEventListener('change', event => { const item = glassCatalogue[materials[index].category]?.[materials[index].type]; if (!item || !event.target.value) return; materials[index].size = event.target.value; materials[index].description = `${materials[index].type} - ${event.target.value}`; materials[index].cost = item.sizes[event.target.value]; materials[index].markup = MATERIAL_MARKUP; renderMaterials(); });
        row.querySelector('.material-quantity').addEventListener('input', event => { materials[index].quantity = Math.max(1, Math.floor(getValue(event.target.value))); renderMaterials(); calculate(); });
        row.querySelector('.material-width').addEventListener('input', event => { materials[index].width = getValue(event.target.value); renderMaterials(); calculate(); });
        row.querySelector('.material-height').addEventListener('input', event => { materials[index].height = getValue(event.target.value); renderMaterials(); calculate(); });
        materials[index].markup = MATERIAL_MARKUP;
        row.querySelector('.remove-material').addEventListener('click', () => { materials.splice(index, 1); renderMaterials(); calculate(); });
    });
    calculate();
}
function getValue(value) { return Math.max(0, Number(value) || 0); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char])); }
function showToast(message) { const toast = $('toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function updateSummary() { $('summary-customer').textContent = $('customer-name').value.trim() || 'New customer'; $('summary-address').textContent = $('customer-address').value.trim() || 'Add a service address'; }
function updateSitePhotoPreview() { $('site-photo-preview').innerHTML = sitePhotos.map((photo, index) => `<div class="site-photo-card"><img src="${photo.data}" alt="Site photo ${index + 1}"><label>Photo description<input class="site-photo-description" data-photo-index="${index}" type="text" value="${escapeHtml(photo.description || '')}" placeholder="e.g. Existing leak under basin"></label><button class="remove-photo" type="button" data-photo-index="${index}" aria-label="Remove site photo ${index + 1}">Ã—</button></div>`).join(''); $('site-photo-status').textContent = sitePhotos.length ? `${sitePhotos.length} photo${sitePhotos.length === 1 ? '' : 's'} attached` : 'No photos selected'; document.querySelectorAll('[data-photo-index]').forEach(button => button.addEventListener('click', () => { sitePhotos.splice(Number(button.dataset.photoIndex), 1); updateSitePhotoPreview(); })); document.querySelectorAll('.site-photo-description').forEach(input => input.addEventListener('input', event => { sitePhotos[Number(event.target.dataset.photoIndex)].description = event.target.value; updatePrintDetails(); })); updatePrintDetails(); }
function compressSitePhoto(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error('Photo could not be read')); reader.onload = () => { const image = new Image(); image.onerror = () => reject(new Error('Photo could not be opened')); image.onload = () => { const scale = Math.min(1, 1600 / Math.max(image.width, image.height)); const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL('image/jpeg', .82)); }; image.src = reader.result; }; reader.readAsDataURL(file); }); }
function markQuoteAmended() { if (loadedQuoteIndex === null || isAmended) return; isAmended = true; $('quote-status').textContent = 'AMENDED'; $('amendment-panel').hidden = false; updatePrintDetails(); }
function resetForm() { loadedQuoteIndex = null; isAmended = false; $('quote-status').textContent = 'NEW'; $('amendment-panel').hidden = true;['customer-name', 'customer-phone', 'customer-address', 'service-description', 'amendment-reason'].forEach(id => { $(id).value = ''; }); sitePhotos = []; $('site-photo').value = ''; updateSitePhotoPreview(); labourItems = defaultLabourItems(); $('vat-enabled').checked = true; materials = []; services = []; $('quote-number').textContent = nextQuoteNumber(); updateSummary(); renderLabourItems(); renderMaterials(); renderServices(); }
function saveQuote() {
    const name = $('customer-name').value.trim();
    if (!name) { $('customer-name').focus(); showToast('Add the customer name first'); return; }
    const totals = calculate();
    const quote = { id: $('quote-number').textContent, date: new Date().toISOString(), customer: { name, phone: $('customer-phone').value.trim(), address: $('customer-address').value.trim(), serviceDescription: $('service-description').value.trim(), sitePhotos }, labour: { items: labourItems.map(item => ({ ...item })) }, materials: [...materials], services: [...services], totals, amended: isAmended, amendmentReason: $('amendment-reason').value.trim() };
    if (loadedQuoteIndex === null) quotes.unshift(quote); else quotes[loadedQuoteIndex] = quote;
    localStorage.setItem('pipewise-quotes', JSON.stringify(quotes)); saveQuotesToDrive(true); $('quote-count').textContent = quotes.length; showToast(isAmended ? `Amended quote ${quote.id} saved` : `Quote ${quote.id} saved`); resetForm(); renderSavedQuotes();
}
function renderSavedQuotes() {
    $('quote-count').textContent = quotes.length;
    $('saved-quotes').innerHTML = quotes.length ? quotes.map((quote, index) => `<article class="saved-quote"><div><strong>${escapeHtml(quote.customer.name)}</strong><small>${escapeHtml(quote.id)} Â· ${new Date(quote.date).toLocaleDateString('en-ZA')}</small></div><div><small>Service address</small><span>${escapeHtml(quote.customer.address || 'Not provided')}</span></div><div class="saved-quote-total">${currency(quote.totals.total)}<small>${quote.materials.length} material${quote.materials.length === 1 ? '' : 's'}</small></div><div class="quote-actions"><button data-load="${index}">Open</button><button data-pdf="${index}" title="View quote as PDF" aria-label="View ${escapeHtml(quote.id)} as PDF">PDF</button><button data-delete="${index}" aria-label="Delete quote">Ã—</button></div></article>`).join('') : '<div class="material-empty">Saved quotes will appear here.</div>';
    document.querySelectorAll('[data-load]').forEach(button => button.addEventListener('click', () => loadQuote(Number(button.dataset.load))));
    document.querySelectorAll('[data-pdf]').forEach(button => button.addEventListener('click', () => viewSavedQuotePdf(Number(button.dataset.pdf))));
    document.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => { quotes.splice(Number(button.dataset.delete), 1); localStorage.setItem('pipewise-quotes', JSON.stringify(quotes)); saveQuotesToDrive(true); renderSavedQuotes(); showToast('Quote deleted'); }));
}
function loadQuote(index) { const quote = quotes[index]; loadedQuoteIndex = index; isAmended = Boolean(quote.amended); $('quote-status').textContent = isAmended ? 'AMENDED' : 'SAVED'; $('amendment-panel').hidden = !isAmended; $('customer-name').value = quote.customer.name; $('customer-phone').value = quote.customer.phone; $('customer-address').value = quote.customer.address; $('service-description').value = quote.customer.serviceDescription || ''; $('amendment-reason').value = quote.amendmentReason || ''; sitePhotos = (quote.customer.sitePhotos || (quote.customer.sitePhoto ? [quote.customer.sitePhoto] : [])).map(photo => typeof photo === 'string' ? { data: photo, description: '' } : photo); updateSitePhotoPreview(); labourItems = quote.labour.items ? quote.labour.items.map(item => ({ ...item })) : [{ description: 'Call-out fee', unit: 'Each', quantity: 1, rate: quote.labour.callout ?? 650, type: 'callout' }, { description: 'Inspection & evaluation', unit: 'Day', quantity: quote.labour.hours ?? 0, rate: quote.labour.plumberHourlyRate ?? quote.labour.hourlyRate ?? 500, type: 'labour' }, { description: 'Additional labour', unit: 'Day', quantity: quote.labour.extraWorkers ?? 0, rate: quote.labour.extraWorkerHourlyRate ?? 500, type: 'labour' }]; materials = quote.materials; services = quote.services || []; $('quote-number').textContent = quote.id; updateSummary(); renderLabourItems(); renderMaterials(); renderServices(); switchView('new-quote'); }
// ===================== GOOGLE DRIVE SYNC =====================
// Replace with your OAuth Client ID from Google Cloud Console (see README steps).
const GOOGLE_CLIENT_ID = '550031555566-mtvat3oqerd8iva15qj73gr8kf6kgump.apps.googleusercontent.com';
const DRIVE_FILE_NAME = 'aga-quotes.json';
const DRIVE_FOLDER_NAME = 'AGA Quotes';
let driveFolderId = null;
let googleToken = null;
let googleEmail = null;
let driveFileId = null;
let tokenClient = null;

function updateDriveStatus(message) { const el = $('drive-status'); if (el) el.textContent = message; }

function updateDriveButtons() {
    const signedIn = Boolean(googleToken);
    $('google-signin-button').hidden = signedIn;
    $('drive-save-button').hidden = !signedIn;
    $('drive-load-button').hidden = !signedIn;
}

function initGoogleSignIn(retries = 0) {
    if (!window.google || !google.accounts || !google.accounts.oauth2) {
        if (retries < 40) { setTimeout(() => initGoogleSignIn(retries + 1), 300); return; }
        updateDriveStatus('Google sign-in library could not load — check your internet connection or ad blocker');
        return;
    }
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file email',
        callback: response => {
            if (response.access_token) { googleToken = response.access_token; updateDriveButtons(); updateDriveStatus('Connected to Google Drive'); findDriveFile().then(() => loadQuotesFromDrive()); }
            else if (response.error) { updateDriveStatus('Google sign-in failed: ' + response.error); }
        }
    });
}

function signInGoogle() {
    if (GOOGLE_CLIENT_ID.startsWith('YOUR_CLIENT_ID')) { showToast('Add your Google Client ID in app.js first'); return; }
    tokenClient.requestAccessToken({ prompt: 'consent' });
}

async function driveFetch(url, options = {}) {
    options.headers = { ...(options.headers || {}), Authorization: `Bearer ${googleToken}` };
    const response = await fetch(url, options);
    if (response.status === 401) { googleToken = null; updateDriveButtons(); updateDriveStatus('Google session expired â€” sign in again'); throw new Error('unauthorised'); }
    if (!response.ok) throw new Error(`Drive request failed (${response.status})`);
    return response;
}

async function ensureDriveFolder() {
    try {
        const q = encodeURIComponent(`name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
        const r1 = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`);
        const d1 = await r1.json();
        if (d1.files && d1.files.length) { driveFolderId = d1.files[0].id; return driveFolderId; }
        const r2 = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=id', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: DRIVE_FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }) });
        driveFolderId = (await r2.json()).id;
        return driveFolderId;
    } catch { return null; }
}
async function findDriveFile() {
    try {
        if (!driveFolderId) await ensureDriveFolder();
        const folderClause = driveFolderId ? ` and '${driveFolderId}' in parents` : '';
        const query = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false${folderClause}`);
        const response = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`);
        const data = await response.json();
        driveFileId = data.files && data.files.length ? data.files[0].id : null;
        updateDriveStatus(driveFileId ? `Backing up to Drive: ${DRIVE_FOLDER_NAME}/${DRIVE_FILE_NAME}` : 'No Drive backup yet â€” it will be created on next save');
    } catch { /* silent â€” status already handled in driveFetch for 401s */ }
}

async function saveQuotesToDrive(silent = false) {
    if (!googleToken) return;
    try {
        if (!driveFileId) await findDriveFile();
        const boundary = 'pipewise' + Date.now();
        const metadata = { name: DRIVE_FILE_NAME, mimeType: 'application/json', ...(driveFolderId ? { parents: [driveFolderId] } : {}) };
        const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({ exported: new Date().toISOString(), quotes }, null, 2)}\r\n--${boundary}--`;
        const url = driveFileId
            ? `https://www.googleapis.com/upload/drive/v3/files/${driveFileId}?uploadType=multipart`
            : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';
        const response = await driveFetch(url, { method: driveFileId ? 'PATCH' : 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body });
        if (!driveFileId) driveFileId = (await response.json()).id;
        if (!silent) showToast('Quotes saved to Google Drive');
        updateDriveStatus(`Backed up to Drive Â· ${new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
        if (error.message !== 'unauthorised') { updateDriveStatus('Drive backup failed â€” will retry on next save'); if (!silent) showToast('Could not save to Google Drive'); }
    }
}

async function loadQuotesFromDrive() {
    if (!googleToken) { updateDriveStatus('Sign in to Google first'); return; }
    try {
        if (!driveFileId) await findDriveFile();
        if (!driveFileId) { showToast('No backup found in Drive yet'); return; }
        const response = await driveFetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`);
        const data = JSON.parse(await response.text());
        const incoming = Array.isArray(data) ? data : data.quotes;
        if (!Array.isArray(incoming)) throw new Error('bad format');
        const existingIds = new Set(quotes.map(quote => quote.id));
        const added = incoming.filter(quote => quote && quote.id && !existingIds.has(quote.id));
        if (!added.length) { showToast('Quotes already up to date with Drive'); return; }
        quotes = incoming.filter(quote => quote && quote.id);
        localStorage.setItem('pipewise-quotes', JSON.stringify(quotes));
        renderSavedQuotes();
        showToast(`${added.length} quote${added.length === 1 ? '' : 's'} loaded from Drive`);
    } catch (error) {
        if (error.message !== 'unauthorised') showToast('Could not read backup from Drive');
    }
}
// =================== END GOOGLE DRIVE SYNC ===================

function exportQuotes() {
    if (!quotes.length) { showToast('No saved quotes to export'); return; }
    const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), quotes }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pipewise-quotes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`${quotes.length} quote${quotes.length === 1 ? '' : 's'} saved to file`);
}

function importQuotes(file) {
    const reader = new FileReader();
    reader.onerror = () => showToast('File could not be read');
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            const incoming = Array.isArray(data) ? data : data.quotes;
            if (!Array.isArray(incoming)) throw new Error('bad format');
            const existingIds = new Set(quotes.map(quote => quote.id));
            const added = incoming.filter(quote => quote && quote.id && !existingIds.has(quote.id));
            if (!added.length) { showToast('No new quotes found in file'); return; }
            quotes = [...added, ...quotes];
            localStorage.setItem('pipewise-quotes', JSON.stringify(quotes));
            renderSavedQuotes();
            showToast(`${added.length} quote${added.length === 1 ? '' : 's'} imported`);
        } catch { showToast('That file is not a valid quotes file'); }
    };
    reader.readAsText(file);
}

function viewSavedQuotePdf(index) { loadQuote(index); requestAnimationFrame(() => window.print()); }
function switchView(view) { document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view)); document.querySelectorAll('.view').forEach(item => item.classList.remove('active-view')); $(`${view}-view`).classList.add('active-view'); $('page-title').textContent = view === 'new-quote' ? 'Quote' : view === 'quotes' ? 'Saved quotes' : view === 'price-list' ? 'Price list' : view === 'scenarios' ? 'Scenarios' : 'Company settings'; if (view === 'price-list') renderPriceList(); if (view === 'scenarios') renderScenarioEditor(); }
function loadSettings() { $('company-name').value = settings.name || ''; $('company-phone').value = settings.phone || ''; $('company-email').value = settings.email || ''; $('prepared-by').value = settings.preparedBy || ''; $('tax-number').value = settings.taxNumber || ''; $('print-prepared-by').textContent = settings.preparedBy || 'Jan Myburgh'; $('print-contact').textContent = settings.phone || '010 597 6616'; $('print-email').textContent = settings.email || 'info@agasouthafrica.co.za'; $('print-tax-number').textContent = settings.taxNumber || '105 976 616'; $('vat-rate').value = settings.vatRate ?? VAT_DEFAULT; $('quote-date').textContent = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }); }

document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => switchView(item.dataset.view)));
document.querySelectorAll('.supplier-tab').forEach(tab => tab.addEventListener('click', () => { selectedSupplier = tab.dataset.supplier; document.querySelectorAll('.supplier-tab').forEach(item => item.classList.toggle('active', item === tab)); $('supplier-source').innerHTML = `Prices shown from ${supplierInfo[selectedSupplier].name} reference catalogue Â· <a href="${supplierInfo[selectedSupplier].url}" target="_blank" rel="noopener">Open supplier â†—</a>`; renderMaterials(); }));
document.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', () => { updateSummary(); calculate(); }));
document.querySelector('#new-quote-view').addEventListener('input', event => { if (event.target.id !== 'amendment-reason') markQuoteAmended(); });
document.querySelector('#new-quote-view').addEventListener('change', event => { if (event.target.id !== 'amendment-reason') markQuoteAmended(); });
$('site-photo').addEventListener('change', async event => { const files = [...event.target.files]; if (!files.length) return; if (files.some(file => !file.type.startsWith('image/'))) { showToast('Choose image files only'); event.target.value = ''; return; } try { sitePhotos.push(...(await Promise.all(files.map(compressSitePhoto))).map(data => ({ data, description: '' }))); updateSitePhotoPreview(); } catch { showToast('One or more photos could not be added'); } finally { event.target.value = ''; } });
$('scenario-editor-select').innerHTML = $('scenario-select').innerHTML;
syncMasterScenarioOptions();
syncCustomScenarioOptions();
$('scenario-editor-select').addEventListener('change', renderScenarioEditor);
$('new-scenario').addEventListener('click', () => { $('scenario-dialog').showModal(); $('new-scenario-name').focus(); });
$('cancel-scenario').addEventListener('click', () => $('scenario-dialog').close());
$('scenario-form').addEventListener('submit', createScenario);
$('add-scenario-service').addEventListener('click', () => { const scenario = scenarios[$('scenario-editor-select').value]; if (!scenario) { showToast('Select a scenario first'); return; } scenario.services.push({ category: '', task: '', unit: 'Each', quantity: 1, rate: 350 }); renderScenarioEditor(); });
$('save-scenario').addEventListener('click', saveScenarioServices);
$('add-material').addEventListener('click', () => { materials.push({ category: '', type: '', size: '', quantity: 1, description: '', cost: 0, markup: MATERIAL_MARKUP }); renderMaterials(); document.querySelector('.material-category:last-of-type')?.focus(); });
$('add-service').addEventListener('click', () => { services.push({ category: '', task: '', quantity: 1, rate: 350, scenario: 'Additional services' }); renderServices(); document.querySelector('.service-category:last-of-type')?.focus(); });
$('add-scenario').addEventListener('click', addScenario);
function clearQuote() { resetForm(); showToast('Quote cleared'); }
$('save-quote').addEventListener('click', saveQuote); $('clear-quote').addEventListener('click', clearQuote); $('clear-quote-top').addEventListener('click', clearQuote); $('print-button').addEventListener('click', () => window.print()); $('pdf-button').addEventListener('click', () => window.print()); $('export-quotes-button').addEventListener('click', exportQuotes);
$('import-quotes-button').addEventListener('click', () => $('import-quotes-file').click());
$('import-quotes-file').addEventListener('change', event => { const file = event.target.files[0]; if (file) importQuotes(file); event.target.value = ''; });
$('google-signin-button').addEventListener('click', signInGoogle);
$('drive-save-button').addEventListener('click', () => saveQuotesToDrive(false));
$('drive-load-button').addEventListener('click', loadQuotesFromDrive);
initGoogleSignIn();
$('new-quote-button').addEventListener('click', () => { resetForm(); switchView('new-quote'); });
$('check-prices-button').addEventListener('click', runPriceCheck);
$('price-list-file-page').addEventListener('change', importPriceList);
$('price-list-search').addEventListener('input', renderPriceList);
$('save-price-list').addEventListener('click', savePriceList);
$('add-price').addEventListener('click', () => { const row = document.createElement('tr'); row.className = 'price-entry new-price-entry'; row.dataset.task = ''; row.innerHTML = `<td><select class="price-category" aria-label="New price category">${categoryOptions('')}</select></td><td>${unitSelect('Each', 'New price type or unit')}</td><td><input class="price-line-item" placeholder="New line item" aria-label="New price line item"></td><td><input class="price-rate" type="number" min="0" step="0.01" value="0" aria-label="New price rate"></td><td></td>`; $('price-list-body').prepend(row); row.querySelector('.price-line-item').focus(); });
$('save-settings').addEventListener('click', () => { settings = { name: $('company-name').value.trim(), phone: $('company-phone').value.trim(), email: $('company-email').value.trim(), preparedBy: $('prepared-by').value.trim(), taxNumber: $('tax-number').value.trim(), vatRate: getNumber('vat-rate') }; localStorage.setItem('pipewise-settings', JSON.stringify(settings)); loadSettings(); calculate(); showToast('Company settings saved'); });
loadSettings(); resetForm(); renderSavedQuotes(); renderPriceList(); updatePriceCheckStatus();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => { });
