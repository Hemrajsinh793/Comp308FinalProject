const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const morgan = require("morgan");
const compress = require("compression");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const dbconfigure = () => {
  mongoose
    .connect(
      "mongodb+srv://hemraj:12345@cluster0-0rizn.gcp.mongodb.net/test?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Database Connected...");
    })
    .catch((err) => console.error("COuld not connect", err));

  require("./app/model/emergency.server.model");
  require("./app/model/reportuser.server.model");
  require("./app/model/reportnurse.server.model");
  require("./app/model/user.server.model");
};

dbconfigure();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: true,
  credentials: true,
};
app.options("*", cors(corsOptions));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(methodOverride("_method"));


const emergencyroute = require("./app/route/emergency.server.routes");
app.use("/", emergencyroute);
const userroute = require("./app/route/users.server.routes");
app.use("/", userroute);

app.get("/", (req, res) => {
  res.send("Server is Running....");
});

app.get("/api", (req, res) => {
  res.send([1, 2, 3]);
});

//configuration
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`${app.get("env")}`);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
