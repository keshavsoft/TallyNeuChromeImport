// --------------------------------------------------
// Imports
// --------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { startFunc as ForLedger } from "./ForLedger/entryFile.js";
import { startFunc as ForInventory } from "./ForInventory/entryFile.js";
import { startFunc as ReadClientData } from "./ReadClientData/entryFile.js";

// --------------------------------------------------
// Path Helpers
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --------------------------------------------------
// Constants
// --------------------------------------------------

const CommonLedgerName = "3F Industries Limited";

const startFunc = () => {
    try {
        const filePath = path.join(__dirname, "..", "..", "..", "Data", "sales.json");
        let template = fs.readFileSync(filePath, "utf8");

        const LocalClientData = ReadClientData();

        const LocalInventoryItem = ForInventory({ inItemsJsonAsArray: LocalClientData.allinventoryentries });
        const LocalLedgerItem = ForLedger({ inItemsJsonAsArray: LocalClientData.allinventoryentries });

        let data = JSON.parse(template);

        // --------------------------------------------------
        // Party Details
        // --------------------------------------------------
        changeCustomerDetails({
            inLedgerName: LocalClientData.LedgerName,
            inData: data
        });

        data.tallymessage[0].allinventoryentries = LocalInventoryItem;
        data.tallymessage[0].ledgerentries = LocalLedgerItem;

        return data;
    } catch (err) {

        console.error("Import Failed");
        console.log(err.response?.data || err.message);

    };
};

const changeCustomerDetails = ({ inLedgerName, inData }) => {
    const CommonLedgerName = inLedgerName;

    inData.tallymessage[0].partyname = CommonLedgerName;
    inData.tallymessage[0].basicbuyername = CommonLedgerName;
    inData.tallymessage[0].partyledgername = CommonLedgerName;
    inData.tallymessage[0].consigneemailingname = CommonLedgerName;
    inData.tallymessage[0].partymailingname = CommonLedgerName;
    inData.tallymessage[0].basicbasepartyname = CommonLedgerName;
};

export { startFunc };