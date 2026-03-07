import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "templates", "inventory.json");

export const buildInventory = (items) => {

    return items.map(item => {

        const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));

        const amount = item.Rate * item.Qty;
        const rateWithTax = item.Rate * (1 + item.TaxPer / 100);

        template.stockitemname = item.ItemName;

        template.rate = `${item.Rate}.00/${item.Uom}`;
        template.amount = `${amount}.00`;

        template.actualqty = `${item.Qty}.00 ${item.Uom}`;
        template.billedqty = `${item.Qty}.00 ${item.Uom}`;

        template.mrprate = `${rateWithTax}.00/${item.Uom}`;
        template.inclvatrate = `${rateWithTax}.00/${item.Uom}`;

        return template;
    });

};