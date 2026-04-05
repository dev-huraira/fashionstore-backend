/**
 * FashionStore Product Seeding Script
 * ------------------------------------
 * Adds 30 products per subcategory × 12 subcategories = 360 products.
 * Categories: Men, Women, Kids
 * Subcategories per: Tops & Tees, Bottoms, Activewear, Shoes
 *
 * Usage:
 *   node seed-products.js
 *
 * Safe: Uses insertMany — does NOT delete existing products or users.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// ── Minimal Product schema (matches Product.js) ─────────────────────────────
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    description: { type: String, required: true },
    features: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ── Unsplash fashion image pools ────────────────────────────────────────────
const IMAGE_POOLS = {
    'Men-Tops & Tees': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    ],
    'Men-Bottoms': [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600',
    ],
    'Men-Activewear': [
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600',
        'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600',
        'https://images.unsplash.com/photo-1555708982-8645ec9ce3cc?w=600',
    ],
    'Men-Shoes': [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
    ],
    'Women-Tops & Tees': [
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
        'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600',
    ],
    'Women-Bottoms': [
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600',
        'https://images.unsplash.com/photo-1548549557-dbe9946621da?w=600',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
        'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600',
        'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600',
    ],
    'Women-Activewear': [
        'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=600',
        'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
        'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=600',
        'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=600',
    ],
    'Women-Shoes': [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
        'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
        'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600',
        'https://images.unsplash.com/photo-1625048787666-10c28ce8c35e?w=600',
    ],
    'Kids-Tops & Tees': [
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
    ],
    'Kids-Bottoms': [
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    ],
    'Kids-Activewear': [
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600',
        'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600',
        'https://images.unsplash.com/photo-1555708982-8645ec9ce3cc?w=600',
    ],
    'Kids-Shoes': [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
    ],
};

// ── Product name templates ────────────────────────────────────────────────────
const NAMES = {
    'Tops & Tees': [
        'Classic Crew Neck Tee', 'Slim Fit V-Neck Shirt', 'Premium Cotton Polo',
        'Relaxed Graphic Tee', 'Long Sleeve Henley', 'Striped Casual Shirt',
        'Linen Button-Down Shirt', 'Vintage Wash Tee', 'Essential Plain Tee',
        'Pocket Crew Tee', 'Color Block Tee', 'Oversized Drop Shoulder Tee',
        'Contrast Collar Polo', 'Muscle Fit Tee', 'Thermal Waffle Shirt',
        'Printed Statement Tee', 'Performance Stretch Tee', 'Oxford Button-Up',
        'French Terry Sweatshirt', 'Modal Scoop Neck Tee', 'Tie-Dye Tee',
        'Ribbed Tank Top', 'Cropped Crewneck', 'Mock Neck Tee',
        'Floral Print Shirt', 'Camouflage Tee', 'Solid Pocket Polo',
        'Athletic Dri-Fit Tee', 'Corduroy Western Shirt', 'Quarter-Zip Pullover',
    ],
    'Bottoms': [
        'Slim Fit Chinos', 'Relaxed Jogger Pants', 'Classic Straight Jeans',
        'Cargo Utility Pants', 'Linen Wide-Leg Trousers', 'Stretch Slim Jeans',
        'Drawstring Sweatpants', 'Khaki Flat-Front Pants', 'Fleece Lounge Pants',
        'High-Rise Skinny Jeans', 'Distressed Boyfriend Jeans', 'Plaid Flannel Pants',
        'Woven Track Pants', 'Twill Shorts', 'Five-Pocket Corduroy Pants',
        'Printed Jogger Shorts', 'Stretch Dress Pants', 'Paper Bag Trousers',
        'Wide Leg Culotte', 'Flare Leg Pants', 'Bermuda Shorts',
        'Athletic Shorts', 'Denim Cutoffs', 'Palzzo Pants',
        'Chino Short', 'Cargo Shorts', 'Relaxed Denim Jeans',
        'Cropped Trousers', 'Linen Shorts', 'Velvet Flare Pants',
    ],
    'Activewear': [
        'Compression Leggings', 'Quick-Dry Running Shorts', 'Racerback Sports Bra',
        'Moisture-Wicking Tank', 'Full-Zip Hoodie', 'Seamless Yoga Pants',
        'Training Jogger Pants', 'Mesh Panel Tee', 'High-Impact Sports Bra',
        'Trail Running Jacket', 'Gym Shorts with Liner', 'Open Back Workout Top',
        'Thermal Running Tights', 'Breathable Track Jacket', 'Longline Sport Bra',
        'Cropped Sweatshirt', 'Performance Polo', 'Cycling Shorts',
        'Zip-Off Training Pants', 'Reflective Running Top', 'Athletic Windbreaker',
        'Printed Yoga Shorts', 'Compression Shirt', 'Recovery Joggers',
        'Sports Long Sleeve Top', 'Studio Hoodie', 'Stretch Training Tank',
        'Packable Rain Jacket', 'Warm-Up Half Zip', 'Core 7/8 Leggings',
    ],
    'Shoes': [
        'Classic White Sneakers', 'Leather Oxford Shoes', 'Running Shoes',
        'Canvas Slip-On Shoes', 'Suede Chelsea Boots', 'High-Top Basketball Shoes',
        'Casual Loafers', 'Athletic Trail Runners', 'Platform Sneakers',
        'Mesh Running Trainers', 'Hiking Boots', 'Ankle Strap Sandals',
        'Leather Derby Shoes', 'Knit Sock Sneakers', 'Slip-On Espadrilles',
        'Water Resistant Boots', 'Crossfit Training Shoes', 'Wedge Sandals',
        'Retro Tennis Shoes', 'Memory Foam Slide Sandals', 'Vegan Leather Boots',
        'Arch Support Walking Shoes', 'Cushioned Everyday Sneakers', 'Square Toe Mules',
        'Flip-Flop Sandals', 'Rhinestone Embellished Flats', 'Suede Moccasins',
        'Pointed Toe Heels', 'Chunky Sole Boots', 'Foam Runner Slides',
    ],
};

const SIZE_SETS = {
    tops: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    bottoms: ['28', '30', '32', '34', '36', '38'],
    kids: ['2T', '3T', '4T', '5', '6', '7', '8', '10', '12'],
    shoes: ['6', '7', '8', '9', '10', '11', '12'],
    women_shoes: ['5', '6', '7', '8', '9', '10'],
    kids_shoes: ['10', '11', '12', '1', '2', '3'],
};

const COLOR_SETS = {
    basics: ['Black', 'White', 'Navy', 'Grey', 'Olive'],
    bright: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Pink'],
    neutrals: ['Beige', 'Tan', 'Cream', 'Charcoal', 'Stone'],
    sporty: ['Black', 'White', 'Neon Green', 'Royal Blue', 'Coral'],
};

function rnd(min, max) { return Math.round(min + Math.random() * (max - min)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function getDescs(cat, subCat, index) {
    const descs = [
        `Premium quality ${subCat} for ${cat} — crafted with care for everyday comfort and style.`,
        `Elevate your ${cat} wardrobe with this versatile ${subCat} piece featuring superior fabric and modern fit.`,
        `Designed for the fashion-forward ${cat}, this ${subCat} combines style with exceptional comfort.`,
        `Experience all-day comfort in this expertly crafted ${subCat}. Perfect for casual or semi-formal occasions.`,
        `High-quality ${cat} ${subCat} made from sustainable materials with a flattering contemporary silhouette.`,
    ];
    return descs[index % descs.length];
}

function getSizes(cat, subCat) {
    if (cat === 'Kids') {
        return subCat === 'Shoes' ? SIZE_SETS.kids_shoes : SIZE_SETS.kids;
    }
    if (cat === 'Women' && subCat === 'Shoes') return SIZE_SETS.women_shoes;
    if (subCat === 'Shoes') return SIZE_SETS.shoes;
    if (subCat === 'Bottoms') return SIZE_SETS.bottoms;
    return SIZE_SETS.tops;
}

// ── Build all products ──────────────────────────────────────────────────────
function buildProducts() {
    const categories = ['Men', 'Women', 'Kids'];
    const subCategories = ['Tops & Tees', 'Bottoms', 'Activewear', 'Shoes'];
    const products = [];

    for (const cat of categories) {
        for (const subCat of subCategories) {
            const key = `${cat}-${subCat}`;
            const images = IMAGE_POOLS[key] || IMAGE_POOLS['Men-Tops & Tees'];
            const names = NAMES[subCat];
            const sizes = getSizes(cat, subCat);

            for (let i = 0; i < 30; i++) {
                const name = `${cat}'s ${names[i % names.length]} ${i < 10 ? '' : `— Style ${i + 1}`}`.trim();
                const price = rnd(1499, 12999) / 100; // $14.99 – $129.99
                const discount = Math.random() > 0.6 ? pick([5, 10, 15, 20, 25, 30]) : 0;
                const rating = (3 + Math.random() * 2).toFixed(1);
                const numReviews = rnd(0, 340);
                const colorSet = pick([COLOR_SETS.basics, COLOR_SETS.bright, COLOR_SETS.neutrals, COLOR_SETS.sporty]);
                const colors = pickN(colorSet, rnd(2, 4));
                const image = images[i % images.length];

                products.push({
                    name,
                    category: cat,
                    subCategory: subCat,
                    price,
                    discount,
                    description: getDescs(cat, subCat, i),
                    features: [
                        `Premium quality ${subCat.toLowerCase()}`,
                        'Machine washable',
                        'Available in multiple colors',
                        'True-to-size fit',
                    ],
                    sizes,
                    colors,
                    images: [image],
                    averageRating: parseFloat(rating),
                    numReviews,
                });
            }
        }
    }
    return products;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB:', mongoose.connection.db.databaseName);

    const products = buildProducts();
    console.log(`📦 Seeding ${products.length} products (30 per subcategory × 12 subcategories)...`);

    const result = await Product.insertMany(products, { ordered: false });
    console.log(`✅ Successfully inserted ${result.length} products!`);
    console.log('\nBreakdown:');
    ['Men', 'Women', 'Kids'].forEach(cat => {
        ['Tops & Tees', 'Bottoms', 'Activewear', 'Shoes'].forEach(sub => {
            console.log(`  ${cat} — ${sub}: 30 products`);
        });
    });

    await mongoose.disconnect();
    console.log('\n🎉 Seeding complete! Visit /category/men or /category/women to see your products.');
}

main().catch(err => {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
});
