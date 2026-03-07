// --------------------------------------------------
// Imports
// --------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { startFunc as prepareInventory } from "./prepareInventory.js";
import { startFunc as prepareLedger } from "./prepareLedger.js";


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
        return prepareInventory({
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


    const LocalLedgerEntry = prepareLedger({
        inLedgerName: CommonLedgerName,
        inAmount: `-${LocalAmount}.00`
    });

    LocalArray.push(LocalLedgerEntry);


    const LocalCGST = prepareLedger({
        inLedgerName: "CGST Output",
        inAmount: `${(LocalAmount - LocalOnlyAmount) / 2}.00`
    });

    LocalArray.push(LocalCGST);


    const LocalSGST = prepareLedger({
        inLedgerName: "SGST Output",
        inAmount: `${(LocalAmount - LocalOnlyAmount) / 2}.00`
    });

    LocalArray.push(LocalSGST);

    return LocalArray;
};

export { startFunc };