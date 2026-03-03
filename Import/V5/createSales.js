import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CommonLedgerName = "3F Industries Limited";

const CommonfilePath = path.join(__dirname, "items.json");
const CommonFileData = fs.readFileSync(CommonfilePath, "utf8");

const CommonFileDataAsJson = JSON.parse(CommonFileData);

async function createSalesVoucher() {
  try {
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

  return CommonFileDataAsJson.map(element => {
    return LocalFuncPrepareInventory({
      inItemName: element.ItemName,
      inTaxPer: element.TaxPer,
      inUom: element.Uom,
      inRate: element.Rate,
      inQty: element.Qty
    })
  });

  LocalArray.push(LocalInventoryItem2);

  // const LocalInventoryItem2 = LocalFuncPrepareInventory({
  //   inItemName: "Fishnets Kgs-5608-5%",
  //   inTaxPer: 18, inUom: "Nos",
  //   inRate: 100
  // });

  // LocalArray.push(LocalInventoryItem2);

  //  return LocalArray;
  return CommonFileDataAsJson;
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

const LocalFuncPrepareInventory = ({ inItemName, inTaxPer, inUom, inRate, inQty }) => {
  const filePath = path.join(__dirname, "..", "..", "Data", "inventory.json");
  let template = fs.readFileSync(filePath, "utf8");

  let data = JSON.parse(template);
  const LocalItemName = inItemName;
  const LocalUom = inUom;
  const LocalQty = inQty;
  const LocalRate = inRate;
  const LocalRateWithTax = LocalRate * (1 + (inTaxPer / 100));
  const LocalAmount = LocalRate * LocalQty;

  data.hsnitemsource = LocalItemName;
  data.gstitemsource = LocalItemName;
  data.stockitemname = LocalItemName;

  data.mrprate = `${LocalRateWithTax}.00/${LocalUom}`;
  data.inclvatrate = `${LocalRateWithTax}.00/${LocalUom}`;

  data.amount = `${LocalAmount}.00`;
  data.rate = `${LocalRate}.00/${LocalUom}`;
  data.actualqty = `${LocalQty}.00 ${LocalUom}`;
  data.billedqty = `${LocalQty}.00 ${LocalUom}`;

  data.batchallocations[0].amount = LocalRate * LocalQty;
  data.batchallocations[0].actualqty = `${LocalQty}.00 ${LocalUom}`;
  data.batchallocations[0].billedqty = `${LocalQty}.00 ${LocalUom}`;

  data.accountingallocations[0].classrate = `${LocalRate}.00`;
  data.accountingallocations[0].amount = `${LocalAmount}.00`;

  return data;
};

const LocalFuncForLedgerEntries = () => {
  let LocalArray = [];

  const LocalAmount = CommonFileDataAsJson.map(element => {
    return element.Rate * element.Qty * (1 + (element.TaxPer / 100));
  });

  const LocalOnlyAmount = CommonFileDataAsJson.map(element => {
    return element.Rate * element.Qty;
  });

  const LocalLedgerEntry = LocalFuncForPrepareLedger({ inLedgerName: CommonLedgerName, inAmount: `-${LocalAmount}.00` });
  LocalArray.push(LocalLedgerEntry);

  const LocalCGST = LocalFuncForPrepareLedger({ inLedgerName: "CGST Output", inAmount: `${(LocalAmount - LocalOnlyAmount) / 2}.00` });
  LocalArray.push(LocalCGST);

  const LocalSGST = LocalFuncForPrepareLedger({ inLedgerName: "SGST Output", inAmount: `${(LocalAmount - LocalOnlyAmount) / 2}.00` });
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