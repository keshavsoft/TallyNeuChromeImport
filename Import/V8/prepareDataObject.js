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


// --------------------------------------------------
// Constants
// --------------------------------------------------

const CommonLedgerName = "3F Industries Limited";


// --------------------------------------------------
// Load Common Data
// --------------------------------------------------

const CommonfilePath = path.join(__dirname, "items.json");
const CommonFileData = fs.readFileSync(CommonfilePath, "utf8");
const CommonFileDataAsJson = JSON.parse(CommonFileData);

const startFunc = () => {
    try {
        const filePath = path.join(__dirname, "..", "..", "Data", "sales.json");
        let template = fs.readFileSync(filePath, "utf8");

        const LocalInventoryItem = LocalFuncInventoryArray();
        const LocalLedgerItem = LocalFuncForLedgerEntries();

        let data = JSON.parse(template);

        // --------------------------------------------------
        // Party Details
        // --------------------------------------------------

        data.tallymessage[0].partyname = CommonLedgerName;
        data.tallymessage[0].basicbuyername = CommonLedgerName;
        data.tallymessage[0].partyledgername = CommonLedgerName;
        data.tallymessage[0].consigneemailingname = CommonLedgerName;
        data.tallymessage[0].partymailingname = CommonLedgerName;
        data.tallymessage[0].basicbasepartyname = CommonLedgerName;


        // --------------------------------------------------
        // Inventory and Ledger Entries
        // --------------------------------------------------

        data.tallymessage[0].allinventoryentries = LocalInventoryItem;
        data.tallymessage[0].ledgerentries = LocalLedgerItem;

        return data;
    } catch (err) {

        console.error("Import Failed");
        console.log(err.response?.data || err.message);

    };
};

// --------------------------------------------------
// Inventory Functions
// --------------------------------------------------


// Creates inventory entries array from items.json
const LocalFuncInventoryArray = () => {

    let LocalArray = [];

    return CommonFileDataAsJson.map(element => {
        return LocalFuncPrepareInventory({
            inItemName: element.ItemName,
            inTaxPer: element.TaxPer,
            inUom: element.Uom,
            inRate: element.Rate,
            inQty: element.Qty
        });

    });

    LocalArray.push(LocalInventoryItem2);

    return CommonFileDataAsJson;
};


// Prepares single inventory entry
const LocalFuncPrepareInventory = ({ inItemName, inTaxPer, inUom, inRate, inQty }) => {

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


// --------------------------------------------------
// Ledger Functions
// --------------------------------------------------


// Creates ledger entries for voucher
const LocalFuncForLedgerEntries = () => {

    let LocalArray = [];

    const LocalAmount = CommonFileDataAsJson.map(element => {
        return element.Rate * element.Qty * (1 + (element.TaxPer / 100));
    });

    const LocalOnlyAmount = CommonFileDataAsJson.map(element => {
        return element.Rate * element.Qty;
    });


    const LocalLedgerEntry = LocalFuncForPrepareLedger({
        inLedgerName: CommonLedgerName,
        inAmount: `-${LocalAmount}.00`
    });

    LocalArray.push(LocalLedgerEntry);


    const LocalCGST = LocalFuncForPrepareLedger({
        inLedgerName: "CGST Output",
        inAmount: `${(LocalAmount - LocalOnlyAmount) / 2}.00`
    });

    LocalArray.push(LocalCGST);


    const LocalSGST = LocalFuncForPrepareLedger({
        inLedgerName: "SGST Output",
        inAmount: `${(LocalAmount - LocalOnlyAmount) / 2}.00`
    });

    LocalArray.push(LocalSGST);

    return LocalArray;
};


// Prepares single ledger entry
const LocalFuncForPrepareLedger = ({ inLedgerName, inAmount }) => {

    const filePath = path.join(__dirname, "..", "..", "Data", "ledgers.json");
    let template = fs.readFileSync(filePath, "utf8");

    let data = JSON.parse(template);

    data.ledgername = inLedgerName;
    data.amount = inAmount;

    return data;
};

export { startFunc };