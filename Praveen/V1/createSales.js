import axios from "axios";

async function createSalesVoucher() {

  const data = {
    static_variables: [
      { name: "svVchImportFormat", value: "json" },
      { name: "svCurrentCompany", value: "PraveenStore" }
    ],

    tallymessage: [
      {
        metadata: {
          type: "Voucher",
          action: "Create",
          vchtype: "Sales"
        },

        date: "20250401",
        vouchertypename: "Sales",
        partyledgername: "Thanveer",
        narration: "Created from Node.js",

        allinventoryentries: [
          {
            stockitemname: "Pista",
            rate: "300.00/Kgs",
            actualqty: "10.00 Kgs",
            billedqty: "10.00 Kgs",
            amount: "3000.00",

            accountingallocations: [
              {
                ledgername: "5% Sales",
                amount: "3000.00",
                isdeemedpositive: false
              }
            ]
          }
        ],

        ledgerentries: [
          {
            ledgername: "Thanveer",
            amount: "-3000.00",
            isdeemedpositive: true
          }
        ]
      }
    ]
  };

  try {
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