import { readFileSync, writeFileSync } from 'fs';
const path = 'c:/Users/elsje.bekker/OneDrive - Labware, Inc/Documents/GitHub/AGA/index.html';
let s = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
let failed = false;
const R = (from, to) => {
    if (!s.includes(from)) { console.error('MISS: ' + from.slice(0, 70)); failed = true; return; }
    s = s.split(from).join(to);
};

R('<meta name="description" content="Offline plumbing quote and pricing calculator">', '<meta name="description" content="Offline glass and aluminium quote and pricing calculator">');
R('<title>Pipewise Quote Calculator</title>', '<title>AGA Quote Calculator</title>');
R('src="APSLOGO.jpeg" alt="APS Architectural Plumbing Services"', 'src="AGA_LOGO.png" alt="AGA Architectural Glass & Aluminium"');
R('PLUMBING OPERATIONS', 'GLASS & ALUMINIUM OPERATIONS');
R('PW-2026-001', 'AGA-2026-001');

R(`<button class="supplier-tab active" data-supplier="plumblink" role="tab" type="button">
                                    Plumblink
                                </button>`,
    `<button class="supplier-tab active" data-supplier="pg" role="tab" type="button">
                                    PG Glass
                                </button>`);
R(`<button class="supplier-tab" data-supplier="builders" role="tab" type="button">
                                    Builders
                                </button>`,
    `<button class="supplier-tab" data-supplier="glassfit" role="tab" type="button">
                                    Glassfit
                                </button>`);
R(`<button class="supplier-tab" data-supplier="bathroom" role="tab" type="button">
                                    Bathroom Bizarre
                                </button>`,
    `<button class="supplier-tab" data-supplier="wispeco" role="tab" type="button">
                                    Wispeco Aluminium
                                </button>`);
R(`Prices shown from Plumblink reference
                                catalogue ·`,
    `Prices shown from PG Glass reference
                                catalogue ·`);
R('https://www.plumblink.co.za/all-products', 'https://www.pgglass.co.za/');

R('ARCHITECTURAL PLUMBING SERVICES\n                            </span>', 'AGA ARCHITECTURAL GLASS & ALUMINIUM\n                            </span>');
R('APS ARCHITECTURAL PLUMBING SERVICES', 'AGA ARCHITECTURAL GLASS & ALUMINIUM');

// Measurement columns in headings
R(`<span>Size</span>
                                <span>Qty</span>`,
    `<span>Size</span>
                                <span>Width (mm)</span>
                                <span>Height (mm)</span>
                                <span>Qty</span>`);
R(`<span>Unit</span>
                                <span>Qty</span>`,
    `<span>Unit</span>
                                <span>Width (mm)</span>
                                <span>Height (mm)</span>
                                <span>Qty</span>`);

// Glass scenario dropdown
const scenarioSelect = /(<select id="scenario-select" aria-label="Job scenario">)([\s\S]*?)(<\/select>)/;
const glassOptions = `

                                    <option value="">
                                        Select a job scenario
                                    </option>

                                    <optgroup label="Shopfronts &amp; entrances">

                                        <option value="shopfront-glass">
                                            Shopfront glass replacement
                                        </option>

                                        <option value="shopfront-doors">
                                            New aluminium shopfront &amp; doors
                                        </option>

                                    </optgroup>

                                    <optgroup label="Windows &amp; doors">

                                        <option value="aluminium-window">
                                            Aluminium window installation
                                        </option>

                                        <option value="sliding-door">
                                            Aluminium sliding door
                                        </option>

                                        <option value="window-bank">
                                            Window bank re-glazing
                                        </option>

                                        <option value="broken-window">
                                            Broken window replacement
                                        </option>

                                    </optgroup>

                                    <optgroup label="Interiors &amp; bathrooms">

                                        <option value="shower-enclosure">
                                            Shower glass enclosure
                                        </option>

                                        <option value="mirror-install">
                                            Mirror installation
                                        </option>

                                    </optgroup>

                                    <optgroup label="Balustrades &amp; safety">

                                        <option value="balustrade">
                                            Glass balustrade installation
                                        </option>

                                    </optgroup>

                                    <optgroup label="Repairs">

                                        <option value="glass-replacement">
                                            Glass panel replacement
                                        </option>

                                        <option value="frame-only">
                                            Aluminium frame supply &amp; fit
                                        </option>

                                    </optgroup>

                                `;
if (!scenarioSelect.test(s)) { console.error('MISS: scenario select'); failed = true; }
else s = s.replace(scenarioSelect, (m, a, b, c) => a + glassOptions + c);

// placeholder for scenario dialog
R('placeholder="e.g. Replace kitchen mixer"', 'placeholder="e.g. Install shopfront glass"');

if (failed) { console.error('NOT WRITTEN'); process.exit(1); }
writeFileSync(path, s);
console.log('index.html patched OK');
