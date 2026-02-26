# TallyNeuChromeImport

cloned from

https://github.com/keshavsoft/TallyNeuChrome

steps to follow

1. nodejs 24 + version
2. https://neutralino.js.org/
3. neu update --latest

Overview

Because of cors restriction from browser we are running chrome

     "args": "--disable-web-security --disable-gpu --start-maximized",

to avoid cors
 

for Developers

run the index.html in resources folder

using live server

https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer


for the delivery

run neu build latest

21 Feb 2026

resources 

https://help.tallysolutions.com/tally-prime-integration-using-json-1/#1761806780007-1f70f256-4a67

today started http files with json in HttpFiles folder in root

---------------------------------------------------------------------------------------------------------------------------------------------------

Tally Sales Voucher Imported Using Node.js

This imported the Sales Vouchers into Tally (running on localhost:9000) using:

1. Node.js

2. Axios

3. JSON payload

4. Tally HTTP JSON interface

The script reads a sales.json file and sends it to Tally for voucher creation.


Prerequisites

Before running this project, ensure:

✅ Node.js installed

✅ Tally is running

✅ Tally is configured to accept HTTP requests

Install Dependencies

npm install axios express fs

If not initialized:

npm init -y

---------------------------------------------------------------------------------------------------------------------------------------------------

Altering Existing Voucher

To alter an existing voucher:

Change:

"action": "Alter"

And ensure:

1. Correct remoteid

2. Correct voucher number

3. Existing voucher number

⚠ If these IDs are wrong, Tally will reject the alteration.



Voucher Header Details

Important fields used:


1. partyname

2. partyledgername

Required Matching in Tally

1. Stock Item must exist

2. Unit (nos) must exist

3. Sales Ledger must exist

---------------------------------------------------------------------------------------------------------------------------------------------------





