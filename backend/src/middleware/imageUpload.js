const multer = require("multer");
const { cloudinary } = require("../utils/cloudinary");
const {promisify} = require('util');
const fs = require('fs');
// const streamifier = require("streamifier");

const storage = multer.diskStorage({
  filename: (req, file, cb) => cb(null, file.originalname),
});

const multerUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log("Multer file filter hit");
    if (file.mimetype.startsWith("image/")) {
      console.log("it is an image");
      cb(null, true);
    } else {
      console.log("This is not an image");
      cb(new Error("File is not an image. Please choose only images"));
    }
  },
});

const removeFileFromDisk = promisify(fs.unlink);

const cloudinaryProcessImageAndUpload =  (req, res, next) => {
  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log(req.file);

   cloudinary.uploader.upload(
    req.file.path,
    {
      asset_folder: "solid_profilepics",
      transformation: [
        { gravity: "face", aspect_ratio: "1.0", height: "200", crop: "auto" },
        { radius: "max" },
      ],
    },
    async (error, result) => {
      if (error) {
        console.error("Error uploading image:", error); 
        await removeFileFromDisk(req.file.path);
        return res
          .status(400)
          .json({
            status: "error",
            msg: "Error uploading image to Cloudinary",
          });
      }
      console.log("Upload result:", result);
      await removeFileFromDisk(req.file.path);
      req.result = result.secure_url;
      next();
    }
  ); 
};

/* ----- Using memory storage which uses a buffer, requires streamify --------  */

// const storage = multer.memoryStorage()

// const multerUpload = multer({
//     storage: storage,
//     limits: {fileSize: 5_000_000},
//     fileFilter: (req, file, cb) => {
//         console.log('Multer file filter hit')
//         if (file.mimetype.startsWith('image/'))
//             cb(null, true);
//         else cb(new Error('File is not an image. Please choose only images'))
//     }
// });

// const cloudinaryMiddleware = (buffer, options = {}) => {
//     return new Promise((resolve, reject) => {
//       console.log('Cloudinary Middleware');
//       const uploadStream = cloudinary.uploader.upload_stream(buffer, options, (error, result) => {
//         if (error) 
//           { console.log('Cloudinary upload error')
//               reject(error);}
//         else {
//           console.log('Cloudinary upload success');
//           resolve(result);}}
//       )
//       streamifier.createReadStream(buffer).pipe(uploadStream);
//     });}

//       const cloudinaryProcessImageAndUpload = async (req, res, next) => {
//         if (!req.file) {
//           console.log('No file uploaded');
//           return next();}
//         try {
//           const result = await cloudinaryMiddleware(req.file.buffer, {
//             folder: "solid_profilepics",
//             transformation: [
//               { gravity: "face", aspect_ratio: "1.0", height: "200", crop: "auto" },
//               { radius: "max" },
//               { border: "3px_solid_lightblue" },
//             ],
//           });
//           console.log('Upload Result', result);
//           res.status(200).json({ status: "ok", url: result.secure_url });
//         } catch (error) {
//           console.error(error.message);
//           res.status(400).json({ status: "error", msg: "Error uploading photo to Cloudinary" });
//         }
//       };
    

module.exports = { multerUpload, cloudinaryProcessImageAndUpload };
