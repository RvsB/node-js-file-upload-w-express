const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    //this function is a closure and will have access to allowedExtArray var even after the fileExtLimiter function has ran and finished as the parameter is in the lexical scope of the returned function

    const files = req.files;

    const fileExtensions = [];
    Object.keys(files).forEach((key) => {
      const fileObj = files[key];
      fileExtensions.push(path.extname(fileObj.name));
    });

    //Are the file extensions allowed?
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
          ",",
          ", "
        );

      return res.status(422).json({ status: "error", message }); //Error 422 is an HTTP code that tells you that the server can't process your request, although it understands it. The full name of the error code is 422 “unprocessable entity.”
    }

    next();
  };
};

module.exports = fileExtLimiter;
