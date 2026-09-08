/* =========================================================
   AGA ARCHITECTURAL GLASS & ALUMINIUM
   Customer Production Email System
   ========================================================= */

"use strict";

const EMAIL_COMPANY = {
    name: "AGA Architectural Glass & Aluminium",
    email: "info@agasouthafrica.co.za",
    phone: "010 597 6616"
};

const EMAIL_ENDPOINT = "/api/send-production-email";

/*
   IMPORTANT:
   A browser cannot hold an SMTP password or secret API key.
   The function below POSTs to your backend endpoint
   (/api/send-production-email) when one is deployed, e.g. a
   small serverless function that sends via your mail provider.

   When the app runs as a static site (GitHub Pages / local)
   there is no backend, so the email is gracefully skipped and
   the update still succeeds.
*/

async function sendProductionEmail(windowItem, status) {

    try {

        if (!windowItem) {
            console.error("No window information supplied.");
            return false;
        }

        const customerEmail = windowItem.customerEmail
            || windowItem.project?.customerEmail;

        if (!customerEmail) {
            return false;
        }

        if (!status) {
            status = windowItem.status || "Updated";
        }

        const subject = getProductionEmailSubject(status);

        const html = createProductionEmailHtml(windowItem, status);

        const response = await fetch(EMAIL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: customerEmail,
                subject,
                html,
                windowId: windowItem.id,
                windowNumber: windowItem.windowNumber,
                status
            })
        });

        if (!response.ok) {
            console.warn(
                `Email endpoint returned ${response.status}; update still saved.`
            );
            return false;
        }

        const result = await response.json();

        if (!result.success) {
            console.warn(
                result.message || "Email could not be sent; update still saved."
            );
            return false;
        }

        console.log("Production email sent successfully.");
        return true;

    } catch (error) {

        /*
           A missing / unreachable backend must NOT block the
           workshop from updating the production status.
        */
        console.warn("Email skipped (no backend available):", error.message);
        return false;
    }
}

/* =========================================================
   EMAIL SUBJECT
   ========================================================= */

function getProductionEmailSubject(status) {

    const subjects = {
        "Measured": "Your AGA Window Measurements Have Been Recorded",
        "In Production": "Your AGA Window Order Is Now in Production",
        "Frame Manufactured": "Your AGA Window Frame Has Been Manufactured",
        "Glazed": "Your AGA Window Has Been Glazed",
        "Quality Checked": "Your AGA Window Has Passed Quality Check",
        "Ready for Installation": "Your AGA Window Is Ready for Installation",
        "Installed": "Your AGA Window Has Been Installed",
        "Completed": "Your AGA Window Order Has Been Completed"
    };

    return subjects[status] || `Update on Your AGA Window Order`;
}

/* =========================================================
   CREATE EMAIL HTML
   ========================================================= */

function createProductionEmailHtml(windowItem, status) {

    const customerName = escapeEmailHtml(windowItem.customerName || "Customer");
    const projectName = escapeEmailHtml(windowItem.projectName || "");
    const windowNumber = escapeEmailHtml(windowItem.windowNumber || windowItem.id || "");
    const location = escapeEmailHtml(windowItem.windowLocation || "");
    const windowType = escapeEmailHtml(windowItem.windowType || "");
    const frameColour = escapeEmailHtml(
        windowItem.customFrameColour || windowItem.frameColour || ""
    );
    const glass = escapeEmailHtml(windowItem.glassType || "");
    const manufacturer = escapeEmailHtml(
        windowItem.manufacturedBy || windowItem.checkedBy || "Workshop"
    );
    const formattedStatus = escapeEmailHtml(status);

    const width = windowItem.finalWidth || windowItem.width || "-";
    const height = windowItem.finalHeight || windowItem.height || "-";

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AGA Production Update</title>
    </head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#222;">

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="background:#f3f4f6;padding:30px 10px;">
            <tr>
                <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0" border="0"
                        style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">

                        <!-- HEADER -->
                        <tr>
                            <td style="background:#111827;padding:25px;text-align:center;">
                                <h1 style="margin:0;color:#ffffff;font-size:24px;">${EMAIL_COMPANY.name}</h1>
                                <p style="margin:8px 0 0;color:#d1d5db;font-size:14px;">
                                    Architectural Glass &amp; Aluminium
                                </p>
                            </td>
                        </tr>

                        <!-- CONTENT -->
                        <tr>
                            <td style="padding:30px;">

                                <h2 style="margin-top:0;font-size:21px;color:#111827;">Production Update</h2>

                                <p style="font-size:16px;line-height:1.6;">Dear ${customerName},</p>

                                <p style="font-size:16px;line-height:1.6;">
                                    We are pleased to provide you with an update regarding your
                                    architectural glass and aluminium order.
                                </p>

                                <!-- STATUS -->
                                <table width="100%" cellpadding="0" cellspacing="0"
                                    style="margin:25px 0;border:1px solid #e5e7eb;border-radius:6px;">
                                    <tr>
                                        <td style="padding:20px;text-align:center;">
                                            <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;color:#6b7280;letter-spacing:1px;">
                                                Current Status
                                            </p>
                                            <p style="margin:0;font-size:22px;font-weight:bold;color:#111827;">
                                                ${formattedStatus}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- DETAILS -->
                                <table width="100%" cellpadding="8" cellspacing="0"
                                    style="font-size:14px;border-collapse:collapse;">

                                    <tr>
                                        <td style="border-bottom:1px solid #eeeeee;font-weight:bold;width:40%;">Order Number</td>
                                        <td style="border-bottom:1px solid #eeeeee;">${windowNumber}</td>
                                    </tr>

                                    <tr>
                                        <td style="border-bottom:1px solid #eeeeee;font-weight:bold;width:40%;">Project</td>
                                        <td style="border-bottom:1px solid #eeeeee;">${projectName || "-"}</td>
                                    </tr>

                                    <tr>
                                        <td style="border-bottom:1px solid #eeeeee;font-weight:bold;width:40%;">Location</td>
                                        <td style="border-bottom:1px solid #eeeeee;">${location || "-"}</td>
                                    </tr>

                                    <tr>
                                        <td style="border-bottom:1px solid #eeeeee;font-weight:bold;width:40%;">Type</td>
                                        <td style="border-bottom:1px solid #eeeeee;">${windowType || "-"}</td>
                                    </tr>

                                    <tr>
                                        <td style="border-bottom:1px solid #eeeeee;font-weight:bold;width:40%;">Size</td>
                                        <td style="border-bottom:1px solid #eeeeee;">${width} × ${height} mm</td>
                                    </tr>

                                    <tr>
                                        <td style="border-bottom:1px solid #eeeeee;font-weight:bold;width:40%;">Frame Colour</td>
                                        <td style="border-bottom:1px solid #eeeeee;">${frameColour || "-"}</td>
                                    </tr>

                                    <tr>
                                        <td style="border-bottom:1px solid #eeeeee;font-weight:bold;width:40%;">Glass</td>
                                        <td style="border-bottom:1px solid #eeeeee;">${glass || "-"}</td>
                                    </tr>

                                    <tr>
                                        <td style="font-weight:bold;">Workshop</td>
                                        <td>${manufacturer}</td>
                                    </tr>

                                </table>

                                <p style="margin-top:25px;font-size:15px;line-height:1.6;">
                                    We will continue to update you as your item progresses
                                    through the manufacturing process.
                                </p>

                                <p style="font-size:15px;line-height:1.6;">
                                    If you have any questions regarding your order, please contact
                                    us using the details below.
                                </p>

                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td style="background:#f9fafb;padding:25px;text-align:center;border-top:1px solid #e5e7eb;">
                                <p style="margin:0 0 8px;font-weight:bold;">${EMAIL_COMPANY.name}</p>
                                <p style="margin:4px 0;font-size:14px;">${EMAIL_COMPANY.phone}</p>
                                <p style="margin:4px 0;font-size:14px;">${EMAIL_COMPANY.email}</p>
                                <p style="margin:15px 0 0;font-size:12px;color:#6b7280;">
                                    This is an automated production update.
                                    Please do not reply directly to this email.
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeEmailHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}