import express from "express"
import multer from "multer"

const uploadRouter = express.Router()

const storage = multer.memoryStorage()

const upload = multer({ storage })

uploadRouter.post(
  "/",
  upload.single("file"),
  async (req, res) => {

    try {

      console.log(req.file)

      res.json({
        success: true,
        file: req.file.originalname
      })

    } catch (err) {

      res.status(500).json({
        message: err.message
      })
    }
  }
)

export default uploadRouter