import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { startFunc as ForLedger } from "./ForLedger/entryFile.js";
import { startFunc as ForInventory } from "./ForInventory/entryFile.js";
import { startFunc as ReadClientData } from "./ReadClientData/entryFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startFunc = () => {
    try {
        const filePath = path.join(__dirname, "..", "..", "..", "Data", "sales.json");
        let template = fs.readFileSync(filePath, "utf8");

        const LocalClientData = ReadClientData();

        const LocalInventoryItem = ForInventory({ inItemsJsonAsArray: LocalClientData.allinventoryentries });

        const LocalLedgerItem = ForLedger({
            inItemsJsonAsArray: LocalClientData.allinventoryentries,
            inLedgerDetails: LocalClientData.customerDetails
        });

        let data = JSON.parse(template);

        // --------------------------------------------------
        // Party Details
        // --------------------------------------------------
        changeCustomerDetails({
            inLedgerName: LocalClientData.customerDetails.LedgerName,
            inData: data
        });

        data.tallymessage[0].allinventoryentries = LocalInventoryItem;

        fs.writeFileSync("import.json", JSON.stringify(data));

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