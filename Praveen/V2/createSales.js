import axios from "axios";
import fs from "fs";

async function createSalesVoucher() {
  try {
    // Read template file
    let template = fs.readFileSync("./sales.json", "utf8");

    // Replace placeholders dynamically
    template = template
      .replace(/{{COMPANY_NAME}}/g, "PraveenStore")
      .replace(/{{YYYYMMDD}}/g, "20250401")
      .replace(/{{VOUCHER_NUMBER}}/g, "24")
      .replace(/{{PARTY_NAME}}/g, "Thanveer")
      .replace(/{{STATE_NAME}}/g, "Andhra Pradesh")
      .replace(/{{ITEM_NAME}}/g, "Pista")
      .replace(/{{QTY}}/g, "5")
      .replace(/{{UNIT}}/g, "Kgs")
      .replace(/{{RATE}}/g, "500")
      .replace(/{{AMOUNT}}/g, "2500")
      .replace(/{{GODOWN_NAME}}/g, "Main Location")
      .replace(/{{SALES_LEDGER_NAME}}/g, "5% Sales")
      .replace(/{{TOTAL_AMOUNT}}/g, "2500");

    const data = JSON.parse(template);

    console.log("Sending Voucher to Tally...");

    const res = await axios.post("http://localhost:9000", data, {
      headers: {
        "Content-Type": "application/json",
        "TallyRequest": "Import",
        "Type": "Data",
        "Id": "Vouchers"
      }
    });

    console.log("TALLY RESPONSE:");
    console.log(JSON.stringify(res.data, null, 2));

  } catch (err) {
    console.error("Import Failed");
    console.log(err.response?.data || err.message);
  }
}

createSalesVoucher();