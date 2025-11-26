import multer from "multer";
import path from "path";
import fs from "fs";

// ensure folder exists
const dir = "./uploads/profile";
if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination(req,file,cb){
    cb(null, "./uploads/profile");
  },
  filename(req,file,cb){
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export default multer({ storage });
