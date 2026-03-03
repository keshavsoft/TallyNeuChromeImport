import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CommonLedgerName = "3F Industries Limited";

async function createSalesVoucher() {
  try {
    // Read template file

    const filePath = path.join(__dirname, "..", "..", "Data", "sales.json");
    let template = fs.readFileSync(filePath, "utf8");

    const LocalInventoryItem = LocalFuncInventoryArray();
    const LocalLedgerItem = LocalFuncForLedgerEntries();

    let data = JSON.parse(template);

    data.tallymessage[0].partyname = CommonLedgerName;
    data.tallymessage[0].basicbuyername = CommonLedgerName;
    data.tallymessage[0].partyledgername = CommonLedgerName;
    data.tallymessage[0].consigneemailingname = CommonLedgerName;
    data.tallymessage[0].partymailingname = CommonLedgerName;
    data.tallymessage[0].basicbasepartyname = CommonLedgerName;

    //    data.tallymessage[0].allinventoryentries.push(LocalInventoryItem);
    data.tallymessage[0].allinventoryentries = LocalInventoryItem;
    data.tallymessage[0].ledgerentries = LocalLedgerItem;
    // console.log("Sending Voucher to Tally...", data.tallymessage[0]);

    fs.writeFileSync("k1.json", JSON.stringify(data));


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

    console.log("TALLY RESPONSE:", reader.data.import_result);
    // console.log(JSON.stringify(res.data, null, 2));

  } catch (err) {
    console.error("Import Failed");
    console.log(err.response?.data || err.message);
  }
}

const LocalFuncInventoryArray = () => {
  let LocalArray = [];

  const LocalInventoryItem = LocalFuncPrepareInventory({
    inItemName: "Fishing Material-Nos-7325-18%",
    inTaxPer: 18, inUom: "Nos",
    inRate: 100
  });

  LocalArray.push(LocalInventoryItem);

  return LocalArray;
};

const LocalFuncForInventory = () => {
  const filePath = path.join(__dirname, "..", "..", "Data", "inventory.json");
  let template = fs.readFileSync(filePath, "utf8");

  let data = JSON.parse(template);
  const LocalItemName = "AABL 2-Elec Goods-nos-8513-18%";

  data.hsnitemsource = "AABL 2-Elec Goods-nos-8513-18%";
  data.gstitemsource = LocalItemName;
  data.stockitemname = LocalItemName;

  data.mrprate = "118.00/kgs";
  data.inclvatrate = "118.00/kgs";

  data.amount = "1000.00";
  data.rate = "100.00/kgs";
  data.actualqty = "10.00 kgs";
  data.billedqty = "10.00 kgs";

  return data;
};

const LocalFuncPrepareInventory = ({ inItemName, inTaxPer, inUom, inRate }) => {
  const filePath = path.join(__dirname, "..", "..", "Data", "inventory.json");
  let template = fs.readFileSync(filePath, "utf8");

  let data = JSON.parse(template);
  const LocalItemName = inItemName;
  const LocalUom = inUom;

  data.hsnitemsource = "AABL 2-Elec Goods-nos-8513-18%";
  data.gstitemsource = LocalItemName;
  data.stockitemname = LocalItemName;

  data.mrprate = `118.00/${LocalUom}`;
  data.inclvatrate = `118.00/${LocalUom}`;

  data.amount = "1000.00";
  data.rate = `100.00/${LocalUom}`;
  data.actualqty = `10.00 ${LocalUom}`;
  data.billedqty = `10.00 ${LocalUom}`;

  return data;
};

const LocalFuncForLedgerEntries = () => {
  let LocalArray = [];

  const LocalLedgerEntry = LocalFuncForPrepareLedger({ inLedgerName: CommonLedgerName, inAmount: "-1180.00" });
  LocalArray.push(LocalLedgerEntry);

  const LocalCGST = LocalFuncForPrepareLedger({ inLedgerName: "CGST Output", inAmount: "90.00" });
  LocalArray.push(LocalCGST);

  const LocalSGST = LocalFuncForPrepareLedger({ inLedgerName: "SGST Output", inAmount: "90.00" });
  LocalArray.push(LocalSGST);

  return LocalArray;
};

const LocalFuncForPrepareLedger = ({ inLedgerName, inAmount }) => {
  const filePath = path.join(__dirname, "..", "..", "Data", "ledgers.json");
  let template = fs.readFileSync(filePath, "utf8");

  let data = JSON.parse(template);

  data.ledgername = inLedgerName;
  data.amount = inAmount;

  return data;
};

createSalesVoucher();