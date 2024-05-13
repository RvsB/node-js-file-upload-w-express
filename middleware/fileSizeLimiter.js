const MB = 5; // 5 MB
const FILE_SIZE_LIMIT = MB * 1000 * 1000;

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;

  const filesOverLimit = [];

  //which files are over the limit?
  Object.keys(files).forEach((key) => {
    const fileObj = files[key];
    if (fileObj.size > FILE_SIZE_LIMIT) {
      filesOverLimit.push(fileObj.name); //we can push the value of the key too as its value and name are the same
    }
  });

  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";

    const sentence =
      `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
        ",",
        ", "
      );

    const message =
      filesOverLimit.length < 3
        ? sentence.replace(",", " and")
        : sentence.replace(/,(?=[^,]*$)/, " and");

    return res.status(413).json({ status: "error", message }); //413 status code indicates "Content Too Large"
  }

  next();
};

module.exports = fileSizeLimiter;
