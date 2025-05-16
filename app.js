const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.get("", (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + "/public/student_registeration.html");
    });
app.get("/admin", (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + "/public/admin_page.html");
    });
module.exports = app;
