"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamUpload = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// import {Multer} from "multer"
const streamUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Check if a file is uploaded
    if (!req.file) {
        throw new Error("No file uploaded");
    }
    try {
        console.log(cloudinary_1.default.uploader);
        const stream = cloudinary_1.default.uploader.upload_stream((error, result) => {
            if (error) {
                throw error.message; // Re-throw the error
            }
            return result;
        });
        console.log("stream", stream);
        // Pipe the uploaded file buffer directly to the stream
        req.file.buffer.pipe(stream);
        console.log("bufferStream", (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) === null || _b === void 0 ? void 0 : _b.pipe(stream));
        // Await the promise returned by stream.on("end")
        const uploadedFile = yield new Promise((resolve, reject) => {
            stream.on("end", resolve).on("error", reject);
        });
        console.log("uploadedFile", uploadedFile);
        return uploadedFile; // Return the uploaded file information
    }
    catch (error) {
        console.error("Error uploading file:", error);
        // Handle upload error (optional: throw or return an error object)
    }
});
exports.streamUpload = streamUpload;
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
