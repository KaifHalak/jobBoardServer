import multer from "multer"

const storage = multer.memoryStorage()
const limits = {
    fileSize: 1500, // bytes
    files: 1
}

// an object with the key "chunk" will hold the file data
let upload = multer({storage: storage, limits}).single("chunk")

export default upload