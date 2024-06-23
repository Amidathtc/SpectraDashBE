import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads"); // Adjust path as needed
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("avatar");
