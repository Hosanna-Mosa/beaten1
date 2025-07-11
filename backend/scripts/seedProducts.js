const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const Product = require("../models/Product");

// Sample product data with variants
const sampleProducts = [
  {
    name: "Premium Street T-Shirt",
    description:
      "Premium quality streetwear t-shirt crafted with exceptional materials and attention to detail. Perfect for urban style enthusiasts who demand both comfort and style.",
    brand: "Beaten",
    categories: ["T-shirts", "Streetwear"],
    tags: ["premium", "streetwear", "urban", "casual"],
    mainImage: "/images/1.png",
    images: [
      "/images/1.png",
      "/images/2.png",
      "/images/3.png",
      "/images/4.png",
    ],
    variants: [
      {
        sku: "TS-PREM-BLK-S",
        color: "Black",
        size: "S",
        price: 1299,
        stock: 25,
        images: ["/images/1.png", "/images/2.png"],
      },
      {
        sku: "TS-PREM-BLK-M",
        color: "Black",
        size: "M",
        price: 1299,
        stock: 30,
        images: ["/images/1.png", "/images/2.png"],
      },
      {
        sku: "TS-PREM-BLK-L",
        color: "Black",
        size: "L",
        price: 1299,
        stock: 20,
        images: ["/images/1.png", "/images/2.png"],
      },
      {
        sku: "TS-PREM-WHT-S",
        color: "White",
        size: "S",
        price: 1299,
        stock: 22,
        images: ["/images/3.png", "/images/4.png"],
      },
      {
        sku: "TS-PREM-WHT-M",
        color: "White",
        size: "M",
        price: 1299,
        stock: 28,
        images: ["/images/3.png", "/images/4.png"],
      },
      {
        sku: "TS-PREM-WHT-L",
        color: "White",
        size: "L",
        price: 1299,
        stock: 18,
        images: ["/images/3.png", "/images/4.png"],
      },
    ],
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    name: "Oversized Graphic T-Shirt",
    description:
      "Trendy oversized t-shirt with unique graphic design. Perfect for street style and casual wear.",
    brand: "Beaten",
    categories: ["T-shirts", "Oversized"],
    tags: ["oversized", "graphic", "street", "trendy"],
    mainImage: "/images/2.png",
    images: [
      "/images/2.png",
      "/images/3.png",
      "/images/4.png",
      "/images/5.png",
    ],
    variants: [
      {
        sku: "TS-OVR-BLK-M",
        color: "Black",
        size: "M",
        price: 1499,
        stock: 15,
        images: ["/images/2.png", "/images/3.png"],
      },
      {
        sku: "TS-OVR-BLK-L",
        color: "Black",
        size: "L",
        price: 1499,
        stock: 20,
        images: ["/images/2.png", "/images/3.png"],
      },
      {
        sku: "TS-OVR-BLK-XL",
        color: "Black",
        size: "XL",
        price: 1499,
        stock: 12,
        images: ["/images/2.png", "/images/3.png"],
      },
      {
        sku: "TS-OVR-WHT-M",
        color: "White",
        size: "M",
        price: 1499,
        stock: 18,
        images: ["/images/4.png", "/images/5.png"],
      },
      {
        sku: "TS-OVR-WHT-L",
        color: "White",
        size: "L",
        price: 1499,
        stock: 16,
        images: ["/images/4.png", "/images/5.png"],
      },
      {
        sku: "TS-OVR-WHT-XL",
        color: "White",
        size: "XL",
        price: 1499,
        stock: 10,
        images: ["/images/4.png", "/images/5.png"],
      },
    ],
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    reviews: 95,
  },
  {
    name: "Classic Crew Neck T-Shirt",
    description:
      "Classic crew neck t-shirt with perfect fit and comfort. Essential for every wardrobe.",
    brand: "Beaten",
    categories: ["T-shirts", "Classic"],
    tags: ["classic", "crew", "essential", "basic"],
    mainImage: "/images/3.png",
    images: [
      "/images/3.png",
      "/images/4.png",
      "/images/5.png",
      "/images/6.png",
    ],
    variants: [
      {
        sku: "TS-CREW-WHT-S",
        color: "White",
        size: "S",
        price: 999,
        stock: 35,
        images: ["/images/3.png", "/images/4.png"],
      },
      {
        sku: "TS-CREW-WHT-M",
        color: "White",
        size: "M",
        price: 999,
        stock: 40,
        images: ["/images/3.png", "/images/4.png"],
      },
      {
        sku: "TS-CREW-WHT-L",
        color: "White",
        size: "L",
        price: 999,
        stock: 30,
        images: ["/images/3.png", "/images/4.png"],
      },
      {
        sku: "TS-CREW-BLK-S",
        color: "Black",
        size: "S",
        price: 999,
        stock: 32,
        images: ["/images/5.png", "/images/6.png"],
      },
      {
        sku: "TS-CREW-BLK-M",
        color: "Black",
        size: "M",
        price: 999,
        stock: 38,
        images: ["/images/5.png", "/images/6.png"],
      },
      {
        sku: "TS-CREW-BLK-L",
        color: "Black",
        size: "L",
        price: 999,
        stock: 28,
        images: ["/images/5.png", "/images/6.png"],
      },
      {
        sku: "TS-CREW-GRY-S",
        color: "Grey",
        size: "S",
        price: 999,
        stock: 25,
        images: ["/images/7.png", "/images/8.png"],
      },
      {
        sku: "TS-CREW-GRY-M",
        color: "Grey",
        size: "M",
        price: 999,
        stock: 30,
        images: ["/images/7.png", "/images/8.png"],
      },
      {
        sku: "TS-CREW-GRY-L",
        color: "Grey",
        size: "L",
        price: 999,
        stock: 22,
        images: ["/images/7.png", "/images/8.png"],
      },
    ],
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviews: 156,
  },
  {
    name: "Casual Linen Shirt",
    description:
      "Comfortable linen shirt perfect for casual occasions. Breathable fabric keeps you cool.",
    brand: "Beaten",
    categories: ["Shirts", "Casual"],
    tags: ["linen", "casual", "breathable", "summer"],
    mainImage: "/images/4.png",
    images: [
      "/images/4.png",
      "/images/5.png",
      "/images/6.png",
      "/images/7.png",
    ],
    variants: [
      {
        sku: "SH-LIN-WHT-S",
        color: "White",
        size: "S",
        price: 1899,
        stock: 12,
        images: ["/images/4.png", "/images/5.png"],
      },
      {
        sku: "SH-LIN-WHT-M",
        color: "White",
        size: "M",
        price: 1899,
        stock: 15,
        images: ["/images/4.png", "/images/5.png"],
      },
      {
        sku: "SH-LIN-WHT-L",
        color: "White",
        size: "L",
        price: 1899,
        stock: 10,
        images: ["/images/4.png", "/images/5.png"],
      },
      {
        sku: "SH-LIN-BLU-S",
        color: "Blue",
        size: "S",
        price: 1899,
        stock: 8,
        images: ["/images/6.png", "/images/7.png"],
      },
      {
        sku: "SH-LIN-BLU-M",
        color: "Blue",
        size: "M",
        price: 1899,
        stock: 12,
        images: ["/images/6.png", "/images/7.png"],
      },
      {
        sku: "SH-LIN-BLU-L",
        color: "Blue",
        size: "L",
        price: 1899,
        stock: 8,
        images: ["/images/6.png", "/images/7.png"],
      },
    ],
    isActive: true,
    isFeatured: false,
    rating: 4.4,
    reviews: 89,
  },
  {
    name: "Formal Cotton Shirt",
    description:
      "Professional formal shirt suitable for office and business meetings.",
    brand: "Beaten",
    categories: ["Shirts", "Formal"],
    tags: ["formal", "professional", "office", "business"],
    mainImage: "/images/5.png",
    images: [
      "/images/5.png",
      "/images/6.png",
      "/images/7.png",
      "/images/8.png",
    ],
    variants: [
      {
        sku: "SH-FOR-WHT-S",
        color: "White",
        size: "S",
        price: 2199,
        stock: 20,
        images: ["/images/5.png", "/images/6.png"],
      },
      {
        sku: "SH-FOR-WHT-M",
        color: "White",
        size: "M",
        price: 2199,
        stock: 25,
        images: ["/images/5.png", "/images/6.png"],
      },
      {
        sku: "SH-FOR-WHT-L",
        color: "White",
        size: "L",
        price: 2199,
        stock: 18,
        images: ["/images/5.png", "/images/6.png"],
      },
      {
        sku: "SH-FOR-LBL-S",
        color: "Light Blue",
        size: "S",
        price: 2199,
        stock: 15,
        images: ["/images/7.png", "/images/8.png"],
      },
      {
        sku: "SH-FOR-LBL-M",
        color: "Light Blue",
        size: "M",
        price: 2199,
        stock: 20,
        images: ["/images/7.png", "/images/8.png"],
      },
      {
        sku: "SH-FOR-LBL-L",
        color: "Light Blue",
        size: "L",
        price: 2199,
        stock: 15,
        images: ["/images/7.png", "/images/8.png"],
      },
    ],
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviews: 112,
  },
  {
    name: "Premium Hoodie",
    description:
      "Comfortable premium hoodie perfect for casual wear and street style.",
    brand: "Beaten",
    categories: ["Hoodies", "Casual"],
    tags: ["hoodie", "premium", "casual", "street"],
    mainImage: "/images/6.png",
    images: [
      "/images/6.png",
      "/images/7.png",
      "/images/8.png",
      "/images/9.png",
    ],
    variants: [
      {
        sku: "HD-PREM-BLK-S",
        color: "Black",
        size: "S",
        price: 2499,
        stock: 18,
        images: ["/images/6.png", "/images/7.png"],
      },
      {
        sku: "HD-PREM-BLK-M",
        color: "Black",
        size: "M",
        price: 2499,
        stock: 22,
        images: ["/images/6.png", "/images/7.png"],
      },
      {
        sku: "HD-PREM-BLK-L",
        color: "Black",
        size: "L",
        price: 2499,
        stock: 16,
        images: ["/images/6.png", "/images/7.png"],
      },
      {
        sku: "HD-PREM-GRY-S",
        color: "Grey",
        size: "S",
        price: 2499,
        stock: 15,
        images: ["/images/8.png", "/images/9.png"],
      },
      {
        sku: "HD-PREM-GRY-M",
        color: "Grey",
        size: "M",
        price: 2499,
        stock: 20,
        images: ["/images/8.png", "/images/9.png"],
      },
      {
        sku: "HD-PREM-GRY-L",
        color: "Grey",
        size: "L",
        price: 2499,
        stock: 14,
        images: ["/images/8.png", "/images/9.png"],
      },
    ],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 95,
  },
  {
    name: "Denim Jacket",
    description:
      "Classic denim jacket with modern styling. Perfect for layering and street style.",
    brand: "Beaten",
    categories: ["Jackets", "Denim"],
    tags: ["denim", "jacket", "classic", "street"],
    mainImage: "/images/7.png",
    images: [
      "/images/7.png",
      "/images/8.png",
      "/images/9.png",
      "/images/1.png",
    ],
    variants: [
      {
        sku: "JK-DEN-BLU-S",
        color: "Blue",
        size: "S",
        price: 3499,
        stock: 8,
        images: ["/images/7.png", "/images/8.png"],
      },
      {
        sku: "JK-DEN-BLU-M",
        color: "Blue",
        size: "M",
        price: 3499,
        stock: 12,
        images: ["/images/7.png", "/images/8.png"],
      },
      {
        sku: "JK-DEN-BLU-L",
        color: "Blue",
        size: "L",
        price: 3499,
        stock: 10,
        images: ["/images/7.png", "/images/8.png"],
      },
      {
        sku: "JK-DEN-BLK-S",
        color: "Black",
        size: "S",
        price: 3499,
        stock: 6,
        images: ["/images/9.png", "/images/1.png"],
      },
      {
        sku: "JK-DEN-BLK-M",
        color: "Black",
        size: "M",
        price: 3499,
        stock: 8,
        images: ["/images/9.png", "/images/1.png"],
      },
      {
        sku: "JK-DEN-BLK-L",
        color: "Black",
        size: "L",
        price: 3499,
        stock: 6,
        images: ["/images/9.png", "/images/1.png"],
      },
    ],
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    reviews: 67,
  },
  {
    name: "Cargo Pants",
    description:
      "Comfortable cargo pants with multiple pockets. Perfect for casual and outdoor wear.",
    brand: "Beaten",
    categories: ["Bottom Wear", "Cargo"],
    tags: ["cargo", "pants", "casual", "outdoor"],
    mainImage: "/images/8.png",
    images: [
      "/images/8.png",
      "/images/9.png",
      "/images/1.png",
      "/images/2.png",
    ],
    variants: [
      {
        sku: "PT-CRG-KHA-S",
        color: "Khaki",
        size: "S",
        price: 1899,
        stock: 0,
        images: ["/images/8.png", "/images/9.png"],
      },
      {
        sku: "PT-CRG-KHA-M",
        color: "Khaki",
        size: "M",
        price: 1899,
        stock: 0,
        images: ["/images/8.png", "/images/9.png"],
      },
      {
        sku: "PT-CRG-KHA-L",
        color: "Khaki",
        size: "L",
        price: 1899,
        stock: 0,
        images: ["/images/8.png", "/images/9.png"],
      },
      {
        sku: "PT-CRG-BLK-S",
        color: "Black",
        size: "S",
        price: 1899,
        stock: 5,
        images: ["/images/1.png", "/images/2.png"],
      },
      {
        sku: "PT-CRG-BLK-M",
        color: "Black",
        size: "M",
        price: 1899,
        stock: 8,
        images: ["/images/1.png", "/images/2.png"],
      },
      {
        sku: "PT-CRG-BLK-L",
        color: "Black",
        size: "L",
        price: 1899,
        stock: 6,
        images: ["/images/1.png", "/images/2.png"],
      },
    ],
    isActive: true,
    isFeatured: false,
    rating: 4.1,
    reviews: 42,
  },
];

// Connect to MongoDB and seed data
const seedProducts = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error("❌ Error: MONGODB_URI is not defined in your .env file.");
      console.error(
        "📝 Please create a .env file in the backend directory with the following content:"
      );
      console.error("");
      console.error("# Server Configuration");
      console.error("PORT=5000");
      console.error("NODE_ENV=development");
      console.error("");
      console.error("# MongoDB Configuration");
      console.error("MONGODB_URI=mongodb://localhost:27017/beaten_db");
      console.error("");
      console.error("# JWT Configuration");
      console.error(
        "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
      );
      console.error("JWT_EXPIRE=7d");
      console.error("");
      console.error(
        "💡 You can copy from env.example file: cp env.example .env"
      );
      console.error("");
      throw new Error(
        "MONGODB_URI is not defined in your .env file. Please check your environment configuration."
      );
    }

    console.log("Attempting to connect to MongoDB...");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI.substring(0, 20) + "..."
    );

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products`);

    // Display summary
    console.log("\nSeeded Products Summary:");
    insertedProducts.forEach((product) => {
      console.log(`- ${product.name}: ${product.variants.length} variants`);
    });

    console.log("\nDatabase seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedProducts();
