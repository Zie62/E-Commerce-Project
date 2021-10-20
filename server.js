const express = require("express");
const port = process.env.PORT || 5000;
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({extended:"false"}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get("/"), (req, res) =>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
}

app.listen(port)