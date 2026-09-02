```javascript
/* =========================================================
   PROFESSIONAL QUOTATION / PRINT DETAILS
   ========================================================= */

function getQuotePaymentTerms() {
    return `
    < div class="quote-payment-box" >
            <h3>Payment Terms</h3>

            <p>
                <strong>Standard payment terms:</strong>
            </p>

            <ul>
                <li>80% deposit upon acceptance of the quotation for material procurement, mobilisation and scheduling.</li>
                <li>20% balance upon practical completion and prior to handover of any applicable Compliance Certificate.</li>
            </ul>

            <p>
                <strong>Project-specific payment arrangements:</strong>
                Where agreed in writing, alternative payment terms may apply.
            </p>
        </div >
    `;
}

function getQuoteProjectNotes() {
    return `
    < section class="quote-section" >
            <h2>Project Notes & Recommendations</h2>

            <div class="quote-note">
                <h3>Urgent Sewer Repairs</h3>
                <p>
                    The proposed works are intended to assist with the urgent
                    repair and rectification of the sewer system in accordance
                    with the findings and recommendations contained in the
                    applicable WSA report.
                </p>
            </div>

            <div class="quote-note">
                <h3>Future Maintenance & Asset Management</h3>
                <p>
                    To assist with the ongoing management of the sewer
                    infrastructure, the following services are recommended:
                </p>

                <ul>
                    <li>Annual sewer inspection and preventative maintenance.</li>
                    <li>Identification of recurring problem areas.</li>
                    <li>Condition monitoring of the sewer network.</li>
                    <li>Full CCTV inspection of the sewer network for asset management records.</li>
                </ul>
            </div>

            <div class="quote-note">
                <h3>Compliance Certification</h3>
                <p>
                    Where applicable, a Compliance Certificate will be issued
                    for completed work subject to the relevant inspection and
                    compliance requirements.
                </p>
            </div>
        </section >
    `;
}

function getQuoteTermsAndConditions() {
    return `
    < section class="quote-section quote-terms" >
            <h2>Terms & Conditions</h2>

            <div class="terms-item">
                <h3>1. Scope of Work</h3>
                <p>
                    This quotation covers only the works, services and
                    materials specifically detailed in the quotation.
                    Additional work or changes requested after acceptance
                    will be treated as a variation and quoted separately.
                </p>
            </div>

            <div class="terms-item">
                <h3>2. Quotation Validity</h3>
                <p>
                    This quotation is valid for 30 days from the date of issue.
                    After this period, pricing may be reviewed to accommodate
                    changes in material, labour, transport or supplier costs.
                </p>
            </div>

            <div class="terms-item">
                <h3>3. Payment Terms</h3>
                <p>
                    Payment terms are as stated in this quotation.
                    Late payments may be subject to interest and/or recovery
                    costs where applicable.
                </p>
            </div>

            <div class="terms-item">
                <h3>4. Materials</h3>
                <p>
                    All materials are subject to supplier availability.
                    Where a specified product is unavailable, a suitable
                    alternative may be proposed for client approval.
                    Material price increases or substitutions may result in
                    an adjustment to the quoted price.
                </p>
            </div>

            <div class="terms-item">
                <h3>5. Variations & Additional Work</h3>
                <p>
                    Any changes to the agreed scope must be requested and
                    approved in writing. Variations may include additional
                    labour, materials, excavation, reinstatement, repairs,
                    inspections or unforeseen work.
                </p>
            </div>

            <div class="terms-item">
                <h3>6. Project Timeline</h3>
                <p>
                    Estimated completion periods may be affected by weather,
                    material availability, supplier delays, unforeseen site
                    conditions, client changes, restricted access or required
                    inspections and approvals.
                </p>
            </div>

            <div class="terms-item">
                <h3>7. Access to Site</h3>
                <p>
                    The client must provide reasonable access to the property
                    and work areas. Water, electricity and required permissions
                    must be available where necessary.
                </p>
            </div>

            <div class="terms-item">
                <h3>8. Health & Safety</h3>
                <p>
                    Work will be carried out with reasonable regard to
                    applicable health and safety requirements. The contractor
                    is not responsible for pre-existing hazards or unsafe
                    conditions that were not disclosed or reasonably
                    identifiable before work commenced.
                </p>
            </div>

            <div class="terms-item">
                <h3>9. Permits, Approvals & Compliance</h3>
                <p>
                    Unless specifically included in this quotation, the client
                    is responsible for obtaining required permits, approvals
                    and permissions. Related costs are excluded unless stated
                    otherwise.
                </p>
            </div>

            <div class="terms-item">
                <h3>10. Workmanship Warranty</h3>
                <p>
                    Workmanship is warranted for 12 months from practical
                    completion or site handover unless otherwise stated.
                    Manufacturer warranties applicable to products and
                    materials will be passed on where available.
                </p>

                <p>
                    The workmanship warranty does not cover normal wear and
                    tear, misuse, lack of maintenance, third-party alterations,
                    existing defects or structural movement.
                </p>
            </div>

            <div class="terms-item">
                <h3>11. Damage & Liability</h3>
                <p>
                    Reasonable care will be taken during the execution of the
                    work. The contractor is not responsible for hidden defects,
                    concealed conditions, existing structural issues or
                    unidentified underground services.
                </p>
            </div>

            <div class="terms-item">
                <h3>12. Cancellation</h3>
                <p>
                    Cancellation must be made in writing. Where materials have
                    been purchased, equipment hired, labour committed or work
                    commenced, costs already incurred may be payable by the
                    client.
                </p>
            </div>

            <div class="terms-item">
                <h3>13. Site Cleanup & Waste</h3>
                <p>
                    Basic cleanup of the immediate work area is included where
                    stated. Removal and disposal of substantial quantities of
                    rubble, soil, concrete or other waste may be charged
                    separately unless specifically included.
                </p>
            </div>

            <div class="terms-item">
                <h3>14. Underground & Concealed Services</h3>
                <p>
                    Where excavation or underground work is required, pricing
                    is based on conditions reasonably visible or identifiable
                    at the time of assessment. Additional work resulting from
                    unknown underground conditions will be treated as a
                    variation.
                </p>
            </div>
        </section >
    `;
}

function getQuoteAcceptance() {
    return `
    < section class="quote-acceptance" >
            <h2>Acceptance of Quotation</h2>

            <p>
                By signing below, the client confirms that they have read and
                understood the quotation, scope of work, pricing and Terms &
                Conditions.
            </p>

            <p>
                The client accepts the quotation and authorises the contractor
                to proceed with the approved works in accordance with this
                quotation.
            </p>

            <div class="signature-grid">

                <div class="signature-field">
                    <span>Client Name</span>
                    <div class="signature-line"></div>
                </div>

                <div class="signature-field">
                    <span>Company / Body Corporate</span>
                    <div class="signature-line"></div>
                </div>

                <div class="signature-field">
                    <span>Contact Number</span>
                    <div class="signature-line"></div>
                </div>

                <div class="signature-field">
                    <span>Email Address</span>
                    <div class="signature-line"></div>
                </div>

                <div class="signature-field">
                    <span>Client Signature</span>
                    <div class="signature-line"></div>
                </div>

                <div class="signature-field">
                    <span>Date</span>
                    <div class="signature-line"></div>
                </div>

            </div>
        </section >
    `;
}

function updatePrintDetails(totals = calculateTotals()) {
    const printDetails = $('print-details');

    if (!printDetails) return;

    const customer =
        $('customer-name')?.value.trim() ||
        'New customer';

    const phone =
        $('customer-phone')?.value.trim() ||
        'Not provided';

    const address =
        $('customer-address')?.value.trim() ||
        'Not provided';

    const quoteNumber =
        $('quote-number')?.textContent ||
        nextQuoteNumber();

    const quoteDate =
        $('quote-date')?.textContent ||
        new Date().toLocaleDateString(
            'en-ZA',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );

    const materialRows = materials
        .filter(material => material.description)
        .map(material => {
            const cost = getSupplierCost(material);
            const quantity = getQuantity(material);
            const markup = getMaterialMarkup(material);

            const total =
                cost *
                quantity *
                (1 + markup / 100);

            return `
    < tr >
                    <td>
                        ${escapeHtml(material.description)}
                    </td>

                    <td class="text-right">
                        ${quantity}
                    </td>

                    <td class="text-right">
                        ${currency(cost)}
                    </td>

                    <td class="text-right">
                        ${markup}%
                    </td>

                    <td class="text-right">
                        ${currency(total)}
                    </td>
                </tr >
    `;
        })
        .join('');

    const serviceRows = services
        .filter(service => service.task)
        .map(service => {
            const rate = getServiceRate(service);
            const quantity = getServiceQuantity(service);
            const unit = getServiceUnit(service);

            return `
    < tr >
                    <td>
                        ${escapeHtml(service.task)}
                    </td>

                    <td>
                        ${escapeHtml(unit)}
                    </td>

                    <td class="text-right">
                        ${quantity}
                    </td>

                    <td class="text-right">
                        ${currency(rate)}
                    </td>

                    <td class="text-right">
                        ${currency(rate * quantity)}
                    </td>
                </tr >
    `;
        })
        .join('');

    printDetails.innerHTML = `

    < !--QUOTATION HEADER-- >

        <div class="quote-print-header">

            <div class="quote-company">

                <img
                    src="APSLOGO.jpeg"
                    alt="APS Architectural Plumbing Services"
                    class="quote-logo"
                >

                <div class="quote-company-details">
                    <h1>
                        ${escapeHtml(
                            settings.name ||
                            'APS Architectural Plumbing Services'
                        )}
                    </h1>

                    <p>
                        Professional Plumbing Services
                    </p>

                    <p>
                        ${escapeHtml(
                            settings.phone ||
                            '076 705 8718'
                        )}
                        ·
                        ${escapeHtml(
                            settings.email ||
                            'cheyenne@agasouthafrica.co.za'
                        )}
                    </p>

                    <p>
                        Tax / Registration No:
                        ${escapeHtml(
                            settings.taxNumber ||
                            '105 976 616'
                        )}
                    </p>
                </div>

            </div>

            <div class="quote-title-block">
                <h2>QUOTATION</h2>

                <div class="quote-meta">
                    <div>
                        <span>Quote No.</span>
                        <strong>
                            ${escapeHtml(quoteNumber)}
                        </strong>
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>
                            ${escapeHtml(quoteDate)}
                        </strong>
                    </div>

                    <div>
                        <span>Prepared By</span>
                        <strong>
                            ${escapeHtml(
                                settings.preparedBy ||
                                'Cheyenne'
                            )}
                        </strong>
                    </div>
                </div>
            </div>

        </div>


        <!--CLIENT DETAILS-- >

        <section class="quote-section">

            <div class="section-heading">
                <span>01</span>
                <h2>Client & Site Details</h2>
            </div>

            <div class="client-details-grid">

                <div>
                    <label>Client</label>
                    <strong>
                        ${escapeHtml(customer)}
                    </strong>
                </div>

                <div>
                    <label>Contact Number</label>
                    <strong>
                        ${escapeHtml(phone)}
                    </strong>
                </div>

                <div class="full-width">
                    <label>Service Address</label>
                    <strong>
                        ${escapeHtml(address)}
                    </strong>
                </div>

            </div>

        </section>


        <!--SCOPE OF WORK-- >

        <section class="quote-section">

            <div class="section-heading">
                <span>02</span>
                <h2>Scope of Work & Pricing</h2>
            </div>

            <table class="quote-table">

                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Unit Cost</th>
                        <th class="text-right">Markup</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>

                <tbody>

                    ${
                        materialRows ||
                        `
                            <tr>
                                <td colspan="5" class="empty-row">
                                    No materials included
                                </td>
                            </tr>
                        `
                    }

                </tbody>

            </table>

            <h3 class="subsection-title">
                Labour, Services & Site Work
            </h3>

            <table class="quote-table">

                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Unit</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Rate</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>

                <tbody>

                    ${
                        serviceRows ||
                        `
                            <tr>
                                <td colspan="5" class="empty-row">
                                    No additional services included
                                </td>
                            </tr>
                        `
                    }

                </tbody>

            </table>

        </section>


        <!--TOTALS -->

        <section class="quote-total-section">

            <div class="quote-total-row">
                <span>Call-out</span>
                <strong>
                    ${currency(totals.callout)}
                </strong>
            </div>

            <div class="quote-total-row">
                <span>Labour</span>
                <strong>
                    ${currency(totals.labour)}
                </strong>
            </div>

            <div class="quote-total-row">
                <span>Materials</span>
                <strong>
                    ${currency(totals.materialsTotal)}
                </strong>
            </div>

            <div class="quote-total-row">
                <span>Services & Site Work</span>
                <strong>
                    ${currency(totals.servicesTotal)}
                </strong>
            </div>

            <div class="quote-total-row subtotal">
                <span>Subtotal</span>
                <strong>
                    ${currency(totals.subtotal)}
                </strong>
            </div>

            <div class="quote-total-row">
                <span>
                    VAT (${totals.vatRate}%)
                </span>

                <strong>
                    ${currency(totals.vat)}
                </strong>
            </div>

            <div class="quote-grand-total">
                <span>TOTAL QUOTATION</span>

                <strong>
                    ${currency(totals.total)}
                </strong>
            </div>

        </section>


        <!--PAYMENT TERMS-- >

        <section class="quote-section">

            <div class="section-heading">
                <span>03</span>
                <h2>Payment Terms</h2>
            </div>

            ${getQuotePaymentTerms()}

        </section>


        <!--PROJECT NOTES-- >

    ${ getQuoteProjectNotes() }


        < !--TERMS -->

    ${ getQuoteTermsAndConditions() }


        < !--ACCEPTANCE -->

    ${ getQuoteAcceptance() }


        < !--FOOTER -->

    <footer class="quote-print-footer">

        <strong>
            ${escapeHtml(
                settings.name ||
                'APS Architectural Plumbing Services'
            )}
        </strong>

        <span>
            ${escapeHtml(
                settings.phone ||
                '076 705 8718'
            )}
        </span>

        <span>
            ${escapeHtml(
                settings.email ||
                'cheyenne@agasouthafrica.co.za'
            )}
        </span>

        <span>
            Quote ${escapeHtml(quoteNumber)}
        </span>

    </footer>
`;
}
```