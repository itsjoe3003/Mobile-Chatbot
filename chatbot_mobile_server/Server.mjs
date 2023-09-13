import { BingChat } from "bing-chat";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
let app = express();
let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

const PORT = 8989;

const bingAPI = new BingChat({
  cookie:
    "13jhJ4Zm2-Mn4zXZZ0nhYoUZ0XgBHrZbO0V3ctaTQKODLrOQrWd5QZVJ9Xe0KQu7UDpg6luXaY9e6yUiRk0Ir3zZ0Ard6-7HAPWit03D31BfECuwIbRgNFZdLIsN4U4G8_ehkvAPQ8Gn3ossptyPYeSEZw2e4iUTgujKxPxsC-paEIuVBCVq-uvLVI2D9DryQvCORHUCdDyNbc18kUQwryA"
});
app.use(cors());

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("Welcome Home");
});

app.post("/hello", function (req, res) {
  res.send("HI from server");
});

app.post("/searchBing", jsonParser, async (req, res) => {
  // bingAPI.sendMessage()
  console.log(req.body);
  await bingAPI.sendMessage(req.body.query).then((response) => {
    console.log(response);
    res.send({ response: response });
  });
});

// Handle 404 - Keep this as a last route
app.post(function (req, res, next) {
  res.status(404);
  res.send("404: File Not Found");
});

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});

// async function example() {
//   const res = await bingAPI.sendMessage(
//     "how long does light take to travel from earth to pluto"
//   );
//   console.log(res.text);
// }

// example();
