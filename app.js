const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// get image
app.get("/", async (req, res) => {
  try {
    const images = await ImageModel.find();

    res.status(200).json({ images: images });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// image upload with multer
app.post("/uploadPhoto", upload.single("myImage"), (req, res) => {
  const obj = {
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  const newImage = new ImageModel({
    image: obj.img,
  });

  newImage.save((err) => {
    err ? console.error(err) : res.json({ msg: "success" });
  });
});

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.error(err);

    app.listen(5000, () => {
      console.log("Server is listening on port 5000");
    });
  }
);

const imageSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
});

const ImageModel = mongoose.model("Image", imageSchema);
