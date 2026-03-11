import { startFunc as prepareDataObject } from "./PrepareDataObject/entryFile.js";

async function createSalesVoucher() {
    try {
        const data = prepareDataObject();
        const result = await sendToTally(data);

        console.log("TALLY RESPONSE:", result);
    } catch (err) {
        console.error("Import Failed");
        console.log(err.response?.data || err.message);
    };
};

async function sendToTally(data) {
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

    return await res.json();
}

createSalesVoucher();