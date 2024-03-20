const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

// connecting to mongodb
const mongoUrl =
  "mongodb+srv://sarabjeet:sarabjeet@cluster0.d6zxygg.mongodb.net/";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.fileName;

  try {
    await PdfSchema.create({ pdf: fileName, title: title });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

// API
app.get("/", async (req, res) => {
  res.send("success!!!");
});

app.listen(5000, () => {
  console.log("Server Started");
});
