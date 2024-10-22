const multer = require("multer");
const upload = multer({
  /* your multer config */
});

// Custom error handling middleware for Multer
function MulterError(err, req, res, next) {
  if (err) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      return res.status(400).json({ error: err.message });
    } else {
      // Handle any other errors
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
  next();
}
module.exports = MulterError;
