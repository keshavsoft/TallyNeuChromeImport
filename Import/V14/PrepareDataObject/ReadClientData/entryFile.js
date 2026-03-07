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
// Load Common Data
// --------------------------------------------------

const startFunc = () => {
    let LocalCustomerData = readCustomerData();
    let LocalItemsData = readItems();

    return {
        customerDetails: LocalCustomerData,
        allinventoryentries: LocalItemsData
    }
};

const readItems = () => {

    const CommonfilePath = path.join(__dirname, "items.json");
    const CommonFileData = fs.readFileSync(CommonfilePath, "utf8");
    const CommonFileDataAsJson = JSON.parse(CommonFileData);

    return CommonFileDataAsJson;
};

const readCustomerData = () => {

    const CommonfilePath = path.join(__dirname, "customer.json");
    const CommonFileData = fs.readFileSync(CommonfilePath, "utf8");
    const CommonFileDataAsJson = JSON.parse(CommonFileData);

    return CommonFileDataAsJson;
};

export { startFunc };