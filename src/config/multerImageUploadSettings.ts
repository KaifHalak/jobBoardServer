import multer from "multer"

const storage = multer.memoryStorage()
const limits = {
    fileSize: 1500,
    files: 1
}

let upload = multer({storage: storage, limits}).single("chunk")

export default upload