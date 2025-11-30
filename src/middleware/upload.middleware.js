const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "/src/uploads");
  },
  filename: function (req, file, cd) {
    cd(null, Date.now().path.extname(file.originalname)); //New Name
  },
});

const upload = multer({ storage });
module.exports = upload;
