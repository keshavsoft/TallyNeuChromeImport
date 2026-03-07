import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { buildInventory } from "./inventoryBuilder.js";
import { buildLedgers } from "./ledgerBuilder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PARTY_NAME = "3F Industries Limited";

const items = JSON.parse(
    fs.readFileSync(path.join(__dirname, "items.json"), "utf8")
);

const salesTemplatePath = path.join(__dirname, "templates", "sales.json");
const salesTemplate = JSON.parse(fs.readFileSync(salesTemplatePath, "utf8"));

async function createSalesVoucher() {

    const inventoryEntries = buildInventory(items);
    const ledgerEntries = buildLedgers(items, PARTY_NAME);

    salesTemplate.tallymessage[0].partyname = PARTY_NAME;
    salesTemplate.tallymessage[0].basicbuyername = PARTY_NAME;
    salesTemplate.tallymessage[0].partyledgername = PARTY_NAME;

    salesTemplate.tallymessage[0].allinventoryentries = inventoryEntries;
    salesTemplate.tallymessage[0].ledgerentries = ledgerEntries;

    const res = await fetch("http://localhost:9000", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "TallyRequest": "Import",
            "Type": "Data",
            "Id": "Vouchers"
        },
        body: JSON.stringify(salesTemplate)
    });

    const result = await res.json();
    console.log(result.data.import_result);
}

createSalesVoucher();