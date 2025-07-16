const mongoose = require("mongoose");
const DataEntry = require("../models/DataEntry");
const dotenv = require("dotenv");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(
"mongodb+srv://sunandvemavarapu:NnqszrAB584zCkY9@beaten1.vknkzsa.mongodb.net/?retryWrites=true&w=majority&appName=beaten1",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    
    // Clear existing entries
    await DataEntry.deleteMany();

    // Seed data
    const entry = new DataEntry({
      slideImages: [
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583011/1_ch6hh4.png",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583070/2_zadfhe.png",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583072/4_se3imx.png",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583072/5_np9pgw.png",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583072/6_usdkbw.png",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583107/7_qvotk3.png",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583113/8_sykiry.png",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752583127/9_kji5ri.png",
      ],
      mobileSlideImages: [
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590569/1_kcaing.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590569/2_r70yzn.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590569/5_sxlqzm.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590569/3_anbzmc.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590569/6_pipkxl.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590569/4_xjsrqk.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590569/7_j4a63u.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590570/8_rcrrrj.jpg",
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1752590570/9_qeizzr.jpg",
      ],

      newsContent:
        "Welcome to BEATEN! Enjoy our premium drops and secret sales. changed to cloud",
    });

    await entry.save();
    const storeData = await DataEntry.find();
    console.log("DataEntry seeded successfully!", storeData);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
