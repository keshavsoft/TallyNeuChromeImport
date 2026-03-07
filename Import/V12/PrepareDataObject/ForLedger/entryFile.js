// --------------------------------------------------
// Imports
// --------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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

// Creates ledger entries for voucher
const startFunc = ({ inItemsJsonAsArray }) => {
    let LocalArray = [];
    const LocalInItemsJsonAsArray = inItemsJsonAsArray;

    const LocalAmount = LocalInItemsJsonAsArray.map(element => {
        return element.Rate * element.Qty * (1 + (element.TaxPer / 100));
    });

    const LocalOnlyAmount = LocalInItemsJsonAsArray.map(element => {
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