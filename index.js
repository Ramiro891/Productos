const express = require("express");
const path = require("path");
const router = require("./routes/usuariosRutas");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view/")); 
app.use("/", express.static(path.join(__dirname, "/web")));
app.use(express.urlencoded({extended: true}));
app.use("/", router);

const port = process.env.PORT || 3012;
app.listen(port, () => {
    console.log("Sitio en http://localhost:" + port);
});
require('dotenv').config();