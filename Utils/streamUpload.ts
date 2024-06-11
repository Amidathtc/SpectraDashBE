import cloudinary from "../config/cloudinary";
// import {Multer} from "multer"

export const streamUpload = async(req: any) => {
  // Check if a file is uploaded
  if (!req.file) {
    throw new Error("No file uploaded");
  }

  try {
    console.log(cloudinary)
    const stream = cloudinary.uploader.upload_stream((error:any, result) => {
      if (error) {
        throw error.message; // Re-throw the error
      }
      return result;
    });
console.log("stream",stream)
// Pipe the uploaded file buffer directly to the stream
req.file.buffer.pipe(stream);
console.log("bufferStream",req.file.buffer.pipe(stream))

    // Await the promise returned by stream.on("end")
    const uploadedFile = await new Promise((resolve, reject) => {
      stream.on("end", resolve).on("error", reject);
    });
    console.log("uploadedFile", uploadedFile);
    return uploadedFile; // Return the uploaded file information
  } catch (error) {
    console.error("Error uploading file:", error);
    // Handle upload error (optional: throw or return an error object)
  }
}


// import cloudinary from "../config/cloudinary";
// import streamifier from "streamifier";

// export const streamUpload = async (req: any) => {
//   return new Promise(async (resolve, reject) => {
//     let stream = cloudinary.uploader.upload_stream(
//       (error: Error, result: any) => {
//         if (result) {
//           return resolve(result);
//         } else {
//           return reject(error);
//         }
//       }
//     );
//     console.log("su", req.buffer);
//     streamifier.createReadStream(req.file.buffer).pipe(stream);
//   });
// };\
