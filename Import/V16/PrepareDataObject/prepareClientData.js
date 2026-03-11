import { startFunc as ForLedger } from "./ForLedger/entryFile.js";
import { startFunc as ForInventory } from "./ForInventory/entryFile.js";
import { startFunc as ReadClientData } from "./ReadClientData/entryFile.js";

const startFunc = ({ inTallyJson }) => {
    try {
        let data = inTallyJson;

        const LocalClientData = ReadClientData();

        const LocalInventoryItem = ForInventory({ inItemsJsonAsArray: LocalClientData.allinventoryentries });

        const LocalLedgerItem = ForLedger({
            inItemsJsonAsArray: LocalClientData.allinventoryentries,
            inLedgerDetails: LocalClientData.customerDetails
        });

        changeCustomerDetails({
            inLedgerName: LocalClientData.customerDetails.LedgerName,
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