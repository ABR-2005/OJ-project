const express = require("express");
const cors = require("cors");
const bodyParser =require("body-parser");
const routes=require("./routes");
const fs=require("fs");
const path=require("path");

["codes","input","output"].forEach((dir) => {
  const fullpath =path.join(__dirname,dir);
  if(!fs.existsSync(fullpath)){
    fs.mkdirSync(fullpath);
    console.log(`created missing folder: ${dir}`);
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/",routes);

const PORT= process.env.PORT || 5001;
app.listen(PORT,()=> console.log(`Compiler backend running on port ${PORT}`));

