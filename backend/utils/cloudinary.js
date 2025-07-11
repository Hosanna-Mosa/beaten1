const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dk6rrrwum",
  api_key: process.env.CLOUDINARY_API_KEY || "862928933218424",
  api_secret: process.env.CLOUDINARY_API_SECRET || "d8SVdViROd7pf6mgRgS2ndZbLwM",
});

module.exports = cloudinary;
