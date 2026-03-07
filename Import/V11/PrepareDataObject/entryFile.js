// --------------------------------------------------
// Imports
// --------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { startFunc as ForLedger } from "./ForLedger/entryFile.js";
import { startFunc as ForInventory } from "./ForInventory/entryFile.js";

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
        const filePath = path.join(__dirname, "..", "..", "..", "Data", "sales.json");
        let template = fs.readFileSync(filePath, "utf8");

        const LocalInventoryItem = ForInventory();
        const LocalLedgerItem = ForLedger({ inItemsJsonAsArray: CommonFileDataAsJson });

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

export { startFunc };