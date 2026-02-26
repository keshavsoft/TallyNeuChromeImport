import fs from "fs";
import path from "path";
import { sendToTally } from "./tallyclient.js";

const salesFilePath = path.resolve("../HttpFiles/Json/Import/sales.json");

async function importSales() {
  try {
    let salesData = JSON.parse(fs.readFileSync(salesFilePath, "utf8"));

    console.log("Original JSON Loaded");

    salesData.tallymessage.forEach(voucher => {

      voucher.metadata.action = "Alter";
      voucher.vouchernumber = "16";   

      voucher.partyname = "Praveen";
      voucher.partyledgername = "Praveen";
      voucher.basicbuyername = "Praveen";
      voucher.partymailingname = "Praveen";
      voucher.consigneemailingname = "Praveen";

      // Ledger change
      voucher.ledgerentries.forEach(l => {
        if (l.ledgername === "Kumar") l.ledgername = "Praveen";
      });

      // Item change
      voucher.allinventoryentries.forEach(item => {
        if (item.stockitemname === "Pista") item.stockitemname = "Pista";
      });
    });

    console.log("Modified JSON Before Sending:");
    console.log(JSON.stringify(salesData, null, 2));

    const response = await sendToTally(salesData);

    console.log("TALLY RESPONSE:");
    console.log(response.data);

  } catch (error) {
    console.error(" Import Failed");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

importSales();