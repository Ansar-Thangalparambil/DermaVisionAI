import axios from "axios";

const apiClent = axios.create({
  baseURL:
    "https://dermavision-fyhaesd5e5dvb4f4.southindia-01.azurewebsites.net", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClent;
