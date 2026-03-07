import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "templates", "ledger.json");

export const buildLedgers = (items, partyName) => {

    const total = items.reduce((a, i) =>
        a + i.Rate * i.Qty * (1 + i.TaxPer / 100), 0);

    const base = items.reduce((a, i) =>
        a + i.Rate * i.Qty, 0);

    const tax = (total - base) / 2;

    const makeLedger = (name, amount) => {
        const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));
        template.ledgername = name;
        template.amount = amount;
        return template;
    };

    return [
        makeLedger(partyName, `-${total}.00`),
        makeLedger("CGST Output", `${tax}.00`),
        makeLedger("SGST Output", `${tax}.00`)
    ];
};