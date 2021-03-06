// write an express app
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// use dotenv
require("dotenv").config();

const { startCreating, buildSetup } = require("./src/main.js");

const { upload } = require("./uploadImages.js");
const { uploadImagesToIPFS } = require("./src/uploadFileIPFS.js");
const { uploadMetaToIPFS } = require("./src/uploadMetadataIPFS.js");

const { getNFT, getCollection } = require("./src/getnfts.js");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

// set a view engine
app.set("view engine", "ejs");

// set a static folder
app.use(express.static(path.join(__dirname, "public")));

// set to expect json
app.use(express.json());
// set to expect urlencoded
app.use(express.urlencoded({ extended: true }));
// set to expect images
// app.use(express.static("public/images"));

// set to parse cookies
app.use(cookieParser());

// write a function to handle requests
app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.render("home");
});


// let uploaeImagesDone = false;
// let layerNumber = 0;

app.post("/upload-layers", upload.array("images", 10), function (req, res) {
  let layerNumber;
  if (req.cookies.layerNumber) {
    console.log("COOKIE EXITS");
    layerNumber = Number(req.cookies.layerNumber) + 1;
    res.cookie("layerNumber", layerNumber);
  } else {
    console.log("COOKIE DOES NOT EXITS");
    res.cookie("layerNumber", 0);
    layerNumber = 0;
  }

  let newPath = "./pub/layer_" + layerNumber.toString();
  let oldPath = "./pub";

  if (fs.existsSync(newPath)) {
    fs.rmdirSync(newPath, { recursive: true });
  }
  fs.mkdirSync(newPath);

  // moving files from pub to newPath
  fs.readdir(oldPath, (err, files) => {
    console.log(files.length, files);

    if (err) throw err;
    for (const file of files) {
      if (!file.includes("layer_")) {
        fs.rename(path.join(oldPath, file), path.join(newPath, file), (err) => {
          if (err) throw err;
          else console.log("DONE......");
        });
      }
    }
  });
  res.send("uploaded Layers" + layerNumber.toString());
});

// this creates the 'build folder'
app.post("/generate", (req, res) => {
  console.log("Generating...", req.body);
  buildSetup();
  startCreating(req.body.editionSize);
  console.log("Generated");

  // res.send("Hello World!");
  res.render('redirect',{'message':'generating Images'});
});


app.post("/upload-images-to-ipfs", async (req, res) => {
  console.log("uploading images to ipfs");
  uploadImagesToIPFS();
  // uploadMetaToIPFS();
  console.log("UPLOADEDDDDDDDDDDDDDDDDD");
  // res.send("uploaded images to ipfs");
  res.render('redirect',{'message':'uploaded images to ipfs'});
});

app.post("/upload-metadata-to-ipfs", async (req, res) => {
  console.log("uploading metadata to ipfs");
  // uploadImagesToIPFS();
  uploadMetaToIPFS();
  console.log("UPLOADEDDDDDDDDDDDDDDDDD");
  // res.send("uploaded metadata to ipfs");
  res.render('redirect',{'message':'uploaded metadata to ipfs'});
});


app.get("/minting", async (req, res) => {
  console.log("Miniting......");
  res.render('redirect',{'message':'minting your collection wait for a moment'});
});




app.get("/my-nfts", async (req, res) => {
  let collections = getCollection();
  res.render("my-nfts", { collections });

  // res.render("card");
});

// listen on port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Learnings from this project:

// How to upload multiple files in express
// points to remeber when you enctype="multipart/form-data"
// alway use the multer package and use the middleware to process it
// otherwise you will get othr form fields values in req.body
