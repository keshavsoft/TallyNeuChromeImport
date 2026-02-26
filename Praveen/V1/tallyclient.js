import axios from "axios";

const TALLY_URL = "http://localhost:9000";

export async function sendToTally(payload) {
  return axios.post(TALLY_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "TallyRequest": "Import",
      "Type": "Data",
      "Id": "Vouchers"
    }
  });
}