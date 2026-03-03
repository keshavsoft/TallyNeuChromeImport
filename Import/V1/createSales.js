import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

async function createSalesVoucher() {
  try {
    // Read template file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "..", "..", "Data", "sales.json");
    let template = fs.readFileSync(filePath, "utf8");

    let data = JSON.parse(template);

    data.tallymessage[0].partyname = "Suryanarayana Side Tailor";
    data.tallymessage[0].basicbuyername = "Suryanarayana Side Tailor";
    data.tallymessage[0].partyledgername = "Suryanarayana Side Tailor";
    data.tallymessage[0].consigneemailingname = "Suryanarayana Side Tailor";
    data.tallymessage[0].partymailingname = "Suryanarayana Side Tailor";
    data.tallymessage[0].basicbasepartyname = "Suryanarayana Side Tailor";
    data.tallymessage[0].ledgerentries[0].ledgername = "Suryanarayana Side Tailor";

    // console.log("Sending Voucher to Tally...", data.tallymessage[0]);

    const res = await fetch("http://localhost:9000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TallyRequest": "Import",
        "Type": "Data",
        "Id": "Vouchers"
      },
      body: JSON.stringify(data)
    });

    // console.log("TALLY RESPONSE:", res);
    const reader = await res.json();

    console.log("TALLY RESPONSE:", reader);
    // console.log(JSON.stringify(res.data, null, 2));

  } catch (err) {
    console.error("Import Failed");
    console.log(err.response?.data || err.message);
  }
}

createSalesVoucher();