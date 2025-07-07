const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: "dam4ncavy",
  api_key: "838286945919515",
  api_secret: "i05VUoijYO8yfln4_TQx_6iyVFs", // ← apna secret key yahan daalo
});

// ✅ Multer setup to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Image Upload Utility Function
async function imageUploadUtil(fileBuffer) {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          throw error;
        }
        return result;
      }
    );

    // Return a Promise to wait for stream upload
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

module.exports = { upload, imageUploadUtil };