import dotenv from "dotenv";
import { connectDB } from "../config/database";
import { User } from "../models/User";
import { Item } from "../models/Item";

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting to seed database...");

    // Create admin user
    const adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@rewear.com",
      password: "admin123",
      phone: "+1234567890",
      role: "admin",
      address: {
        street: "123 Admin St",
        city: "Admin City",
        state: "AC",
        zipCode: "12345",
      },
      isVerified: true,
      points: 1000,
    });

    console.log("✅ Admin user created");

    // Create test users
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        fullName: `Test User ${i}`,
        email: `user${i}@test.com`,
        password: "password123",
        phone: `+123456789${i}`,
        address: {
          street: `${i}23 Test St`,
          city: "Test City",
          state: "TC",
          zipCode: `1234${i}`,
        },
        isVerified: true,
        points: 100,
      });
      users.push(user);
    }

    console.log("✅ Test users created");

    // Create sample items
    const categories = [
      "dresses",
      "tops",
      "bottoms",
      "accessories",
      "shoes",
      "outerwear",
    ];
    const conditions = ["new", "like-new", "good", "fair"];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const colors = [
      "black",
      "white",
      "blue",
      "red",
      "green",
      "pink",
      "gray",
      "brown",
    ];
    const brands = ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Gap", "Levi's"];

    const items = [];
    for (let i = 1; i <= 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomCondition =
        conditions[Math.floor(Math.random() * conditions.length)];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];

      const item = await Item.create({
        title: `${randomBrand} ${
          randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)
        } Item ${i}`,
        description: `A beautiful ${randomColor} ${randomCategory} in ${randomCondition} condition. Perfect for casual wear and made from quality materials.`,
        category: randomCategory,
        type: randomCategory,
        size: randomSize,
        condition: randomCondition,
        color: randomColor,
        brand: randomBrand,
        images: [
          `https://via.placeholder.com/400x400/000000/FFFFFF?text=${randomCategory}1`,
          `https://via.placeholder.com/400x400/000000/FFFFFF?text=${randomCategory}2`,
        ],
        tags: [randomColor, randomBrand.toLowerCase(), randomCategory],
        owner: randomUser._id,
        isApproved: i <= 15, // Approve first 15 items, leave 5 pending
      });
      items.push(item);
    }

    console.log("✅ Sample items created");

    console.log(`
🎉 Database seeded successfully!

📊 Created:
- 1 Admin user (admin@rewear.com / admin123)
- 5 Test users (user1@test.com to user5@test.com / password123)
- 20 Sample items (15 approved, 5 pending)

🚀 You can now start the server and test the application!
    `);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedData();
