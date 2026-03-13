import path from "path";
import { fileURLToPath } from "url";
import { startFunc as prepareInventory } from "./prepareInventory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creates inventory entries array from items.json
const startFunc = ({ inItemsJsonAsArray }) => {
    const LocalInItemsJsonAsArray = inItemsJsonAsArray;

    const mappedArray = LocalInItemsJsonAsArray.map(element => {
        return prepareInventory({
            inItemName: element.ItemName,
            inTaxPer: element.TaxPer,
            inUom: element.Uom,
            inRate: element.Rate,
            inQty: element.Qty
        });
    });

    return mappedArray;
};

export { startFunc };