import { exec } from "child_process";
import { Axios, AxiosResponse } from "axios";

const npmStartProcess = exec("npm run start");

npmStartProcess.on("spawn", () => {
  performTestRequests();
});

const axios = new Axios({
  headers: { "Content-Type": "application/json" },
});

function performTestRequests() {
  Promise.all([sendPostRequest(), sendGetRequest()])
    .then((responses) => {
      responses.forEach((response) => {
        console.log(
          "--------------------------------------------------------------------------------"
        );
        console.log(
          `Result of ${response.config.method} ${response.config.url}`
        );
        if (response.config.data) {
          console.log(JSON.parse(response.config.data));
        }
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(JSON.parse(response.data));
        console.log(
          "--------------------------------------------------------------------------------"
        );
      });
      npmStartProcess.kill();
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      npmStartProcess.kill();
      process.exit(1);
    });
}

// curl --location --request POST 'http://localhost:3000' --header 'Content-Type: application/json' --data-raw '{"text":"This is my translator built with AWS CDK and AWS SAM","languages":["de","fr"]}'
function sendPostRequest() {
  const url = "http://localhost:3000";
  console.log(`Send request: ${url}`);
  return axios.post(
    url,
    JSON.stringify({
      text: "This is my translator built with AWS CDK and AWS SAM",
      languages: ["de", "fr"],
    })
  );
}

// curl --location --request GET 'http://localhost:3000'
function sendGetRequest() {
  const url = "http://localhost:3000";
  console.log(`Send request: ${url}`);
  return axios.get(url);
}
