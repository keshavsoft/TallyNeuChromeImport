// --------------------------------------------------
// Imports
// --------------------------------------------------

import path from "path";
import { fileURLToPath } from "url";
import { startFunc as prepareInventory } from "./prepareInventory.js";

// --------------------------------------------------
// Path Helpers
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creates inventory entries array from items.json
const startFunc = () => {
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

export { startFunc };