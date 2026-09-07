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
