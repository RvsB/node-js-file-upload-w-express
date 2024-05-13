const express = require("express");
const fileUpload = require("express-fileupload"); //middleware
const path = require("path");

const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");
const filesPayloadExists = require("./middleware/filesPayloadExists");

const PORT = process.env.PORT || 3500;

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;
    console.log("files", files);

    Object.keys(files).forEach((key) => {
      const filepath = path.join(__dirname, "files", files[key].name);
      files[key].mv(filepath, (err) => {
        if (err) {
          return res.status(500).json({ status: "error", message: err });
        }
      });
    });

    return res.json({
      status: "success",
      message: Object.keys(files).toString(),
    });
  }
);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
