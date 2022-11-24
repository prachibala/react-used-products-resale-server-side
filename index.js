const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
// middle wares
app.use(cors());
app.use(express.json());
const categories = require("./categories.json");
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/categories", (req, res) => {
    res.send(categories);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
