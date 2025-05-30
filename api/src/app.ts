import express, { Request, Response } from "express";
import exampleRoutes from "./routes/example";
var bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.json()); // for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", exampleRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
