import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

export const seedAdmin = async () => {
    try {
        const adminEmail = "admin@selectdresses.com";
        const adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            console.log("Seeding Admin User...");
            await User.create({
                name: "Admin User",
                email: adminEmail,
                password: "Admin@123",
                role: "admin",
                profile: {
                    public_id: "default_admin",
                    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"
                }
            });
            console.log("✅ Admin User seeded successfully!");
        }
    } catch (error) {
        console.error("❌ Error seeding Admin User:", error.message);
    }
};

const SAMPLE_PRODUCTS = [
    {
        name: "Premium Floral Dress",
        description: "Elegant floral dress perfect for summer outings.",
        price: 1299,
        category: "Dress-Material",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
    },
    {
        name: "Casual Cotton T-shirt",
        description: "Comfortable 100% cotton T-shirt for everyday wear.",
        price: 499,
        category: "Tshirts",
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
    }
];

export const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) return;

        console.log("Seeding Sample Products...");
        const admin = await User.findOne({ role: "admin" });
        if (!admin) return;

        for (const item of SAMPLE_PRODUCTS) {
            const result = await cloudinary.uploader.upload(item.imageUrl, {
                folder: "products",
            });

            await Product.create({
                ...item,
                user: admin._id,
                image: [{
                    public_id: result.public_id,
                    url: result.secure_url
                }]
            });
        }
        console.log("✅ Sample Products seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding products:", error.message);
    }
};
