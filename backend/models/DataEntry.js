const mongoose = require("mongoose");

const DataEntrySchema = new mongoose.Schema(
  {
    slideImages: {
      type: [String],
      required: true,
      default: [],
    },
    mobileSlideImages: {
        type: [String],
        required: true,
        default: [],
      },
    newsContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataEntry", DataEntrySchema);
