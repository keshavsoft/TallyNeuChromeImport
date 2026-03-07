// --------------------------------------------------
// Imports
// --------------------------------------------------

import { startFunc as prepareDataObject } from "./PrepareDataObject/entryFile.js";

// --------------------------------------------------
// Main Function
// --------------------------------------------------

async function createSalesVoucher() {
    try {
        const data = prepareDataObject();

        // --------------------------------------------------
        // Send to Tally
        // --------------------------------------------------

        const res = await fetch("http://localhost:9000", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "TallyRequest": "Import",
                "Type": "Data",
                "Id": "Vouchers"
            },
            body: JSON.stringify(data)
        });

        const reader = await res.json();

        console.log("TALLY RESPONSE:", reader.data.import_result);

    } catch (err) {

        console.error("Import Failed");
        console.log(err.response?.data || err.message);

    }
};

// --------------------------------------------------
// Execute
// --------------------------------------------------

createSalesVoucher();