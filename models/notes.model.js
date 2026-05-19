import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    subject: {
      type: String
    },

    fileUrl: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      enum: ["pdf", "doc", "docx", "txt"]
    },

    originalName: {
      type: String
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    size: {
      type: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);