// --------------------------------------------------
// Imports
// --------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --------------------------------------------------
// Path Helpers
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prepares single inventory entry
const startFunc = ({ inItemName, inTaxPer, inUom, inRate, inQty }) => {
    const filePath = path.join(__dirname, "..", "..", "Data", "inventory.json");
    let template = fs.readFileSync(filePath, "utf8");

    let data = JSON.parse(template);
    // --------------------------------------------------
    // Local Variables
    // --------------------------------------------------

    const LocalItemName = inItemName;
    const LocalUom = inUom;
    const LocalQty = inQty;
    const LocalRate = inRate;

    const LocalRateWithTax = LocalRate * (1 + (inTaxPer / 100));
    const LocalAmount = LocalRate * LocalQty;


    // --------------------------------------------------
    // Item Details
    // --------------------------------------------------

    data.hsnitemsource = LocalItemName;
    data.gstitemsource = LocalItemName;
    data.stockitemname = LocalItemName;


    // --------------------------------------------------
    // Rate Information
    // --------------------------------------------------

    data.mrprate = `${LocalRateWithTax}.00/${LocalUom}`;
    data.inclvatrate = `${LocalRateWithTax}.00/${LocalUom}`;


    // --------------------------------------------------
    // Quantity & Amount
    // --------------------------------------------------

    data.amount = `${LocalAmount}.00`;
    data.rate = `${LocalRate}.00/${LocalUom}`;
    data.actualqty = `${LocalQty}.00 ${LocalUom}`;
    data.billedqty = `${LocalQty}.00 ${LocalUom}`;


    // --------------------------------------------------
    // Batch Allocation
    // --------------------------------------------------

    data.batchallocations[0].amount = LocalRate * LocalQty;
    data.batchallocations[0].actualqty = `${LocalQty}.00 ${LocalUom}`;
    data.batchallocations[0].billedqty = `${LocalQty}.00 ${LocalUom}`;


    // --------------------------------------------------
    // Accounting Allocation
    // --------------------------------------------------

    data.accountingallocations[0].classrate = `${LocalRate}.00`;
    data.accountingallocations[0].amount = `${LocalAmount}.00`;

    return data;
};

export { startFunc };