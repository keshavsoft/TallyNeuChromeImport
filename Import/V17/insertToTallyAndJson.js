import { startFunc as prepareDataObject } from "./PrepareDataObject/entryFile.js";
import { startFunc as sendToTally } from "./sendToTally.js";
import fs from "fs";

async function createSalesVoucher() {
    try {
        const data = prepareDataObject();
        const result = await sendToTally(data);

        if (result.data.import_result.created === 1) {
            insertToJson({ inData: data });

            console.log(`data inserted to import.json`);
        };

        console.log("TALLY RESPONSE:", result);
    } catch (err) {
        console.error("Import Failed");
        console.log(err.response?.data || err.message);
    };
};

const insertToJson = ({ inData }) => {
    fs.writeFileSync("import.json", JSON.stringify(inData));
};

createSalesVoucher();