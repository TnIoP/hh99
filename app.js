const express = require("express");
const app = express();
const connect = require("./models/index");
connect();
const router = require("./routes/router");
const cors = require("cors");
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const fs = require("fs");
const http = require("http");
const https = require("https");
require("dotenv").config();

app.use(express.static("public"));

const corsOptions = {
    origin: [process.env.DEPLOY_URL_01, process.env.DEPLOY_URL_02],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res, next) => {
    res.sendStatus(404);
});
app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

const options = {
    // letsencrypt로 받은 인증서 경로를 입력
    ca: fs.readFileSync(process.env.HTTPS_CA),
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT),
};
http.createServer(app).listen(3000);
https.createServer(options, app).listen(443);
