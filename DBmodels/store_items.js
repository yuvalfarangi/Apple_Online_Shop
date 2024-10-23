const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    color: { type: String, required: false },
    storageSize: { type: String, required: false },
    qty: { type: Number, required: true, min: 0 },
});

const itemSchema = new mongoose.Schema(
    {
        category: { type: String, required: true },
        categoryBitmap: { type: String, required: false },
        displayName: { type: String, required: true },
        description_short: { type: String, required: true },
        description_long: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        priceUnit: { type: String, required: true },
        image_src: { type: String, required: true },
        color: { type: [String], required: false },
        storageSize: { type: [String], required: false },
        variants: { type: [variantSchema], required: true }
    });


itemSchema.statics.checkStock = async function ({ product_id, color, storageSize }) {
    const item = await DBstore_item.findById(product_id);

    for (let variant of item.variants) {
        if (variant.color == color && variant.storageSize == storageSize) {
            return variant.qty > 0;
        }
    }
}

itemSchema.statics.findVariantAndSell = async function (productsArray) {
    const storeItems = await DBstore_item.find();
    for (let orderedProduct of productsArray) {
        for (let storeItem of storeItems) {
            if (storeItem._id.toString() == orderedProduct.productID) {
                for (let variant of storeItem.variants) {
                    if (variant.storageSize == orderedProduct.storageSize && variant.color == orderedProduct.color) {
                        variant.qty--;
                    }
                }
            }
            await storeItem.save();
        }
    }
}

const DBstore_item = mongoose.model('Store_item', itemSchema);

const categories = {
    AirPods: "/pictures/productsBitmap/AirPods.png",
    iPhone: "/pictures/productsBitmap/iPhone.png",
    HomeKit: "/pictures/productsBitmap/AppleTV.png",
    Mac: "/pictures/productsBitmap/Mac.png",
    iPad: "/pictures/productsBitmap/iPad.png",
    Watch: "/pictures/productsBitmap/AppleWatch.png"
}

const applayCategoriesBitmap = async () => {
    const items = await DBstore_item.find();
    for (let item of items) {
        await DBstore_item.updateOne(
            { _id: item._id },
            { categoryBitmap: categories[item.category] }
        );
    }
};


const EXAMPLE_ITEMS =
    [
        {
            category: 'AirPods',
            displayName: 'AirPods Pro',
            description_short: '2nd generation',
            description_long: 'Experience unprecedented sound with pro-level Active Noise Cancellation, Footnote ³ Adaptive Audio for the right mix of noise control in any environment, Transparency mode to hear the world around you, Footnote ² and Conversation Awareness to seamlessly lower your media volume when you speak to someone nearby. Footnote ¹⁵ Both AirPods Pro 2 and the wireless MagSafe Charging Case (USB-C) are IP54 dust, sweat, and water resistant, Footnote ¹⁴ and you can use the Find My app to keep track of them.',
            price: 249,
            priceUnit: '$',
            image_src: '/pictures/airPods/AirPods_pro.jpeg',
            onSale: false,
            variants: [
                {
                    qty: 20
                }
            ]
        },
        {
            category: 'AirPods',
            displayName: 'AirPods',
            description_short: '3nd generation',
            description_long: 'The ultimate over-ear personal listening experience — now in fresh new colors. AirPods Max deliver stunningly detailed, high-fidelity audio. Personalized Spatial Audio with dynamic head tracking for sound that surrounds you. Footnote ⁴ Pro-level Active Noise Cancellation to remove unwanted sound. Footnote ³ Transparency mode to comfortably hear the world around you. Up to 20 hours of battery life on a single charge. Footnote ¹⁵ Effortless setup and on-head detection for a magical listening experience. Now with USB-C for easy charging.',
            price: 169,
            priceUnit: '$',
            image_src: '/pictures/airPods/AirPods3.jpeg',
            onSale: false,
            categoryBitmap: '/pictures/productsBitmap/AirPods.png',
            variants: [
                {
                    qty: 20
                }
            ]
        },
        {
            category: 'AirPods',
            displayName: 'AirPods Max',
            description_short: 'The ultimate listening experience',
            description_long: 'Pro‑level Active Noise Cancellation. With up to 2x more noise cancelled,1 pro‑level Active Noise Cancellation counters external sound with equal anti‑noise. With control over what you hear — and don’t hear — you can immerse yourself in music and podcasts, or simply stay focused, like never before. Transparency mode. Press the noise control button to switch to Transparency mode, which lets outside sound in so you can interact naturally with your surroundings.',
            price: 549,
            priceUnit: '$',
            image_src: '/pictures/airPods/AirPods_Max.png',
            onSale: false,
            categoryBitmap: '/pictures/productsBitmap/AirPods.png',
            variants: [
                {
                    qty: 20
                }
            ]
        },
        {
            category: 'iPhone',
            displayName: 'iPhone 20 pro',
            description_short: 'The first iPhone built for Apple Intelligence. Personal, private, powerful.',
            description_long: 'The first iPhone built for Apple Intelligence. Personal, private, powerful.So fast. So fluid. Get a feel for the all-new Camera Control. 4K 120 fps Dolby Vision. 4 studio-quality mics.A Pro studio in your pocket.',
            price: 999,
            priceUnit: '$',
            image_src: '/pictures/iphone/iphone_16_pro.png',
            onSale: false,
            color: [
                'DesertTitanium',
                'NaturalTitanium',
                'WhiteTitanium',
                'BlackTitanium'
            ],
            storageSize: ['256GB', '510GB', '1TB'],
            categoryBitmap: '/pictures/productsBitmap/iPhone.png',
            variants: [
                {
                    color: "DesertTitanium",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "DesertTitanium",
                    storageSize: "510GB",
                    qty: 20
                },
                {
                    color: "DesertTitanium",
                    storageSize: "1TB",
                    qty: 20
                },
                {
                    color: "NaturalTitanium",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "NaturalTitanium",
                    storageSize: "510GB",
                    qty: 20
                },
                {
                    color: "NaturalTitanium",
                    storageSize: "1TB",
                    qty: 20
                },
                {
                    color: "WhiteTitanium",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "WhiteTitanium",
                    storageSize: "510GB",
                    qty: 20
                },
                {
                    color: "WhiteTitanium",
                    storageSize: "1TB",
                    qty: 20
                },
                {
                    color: "BlackTitanium",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "BlackTitanium",
                    storageSize: "510GB",
                    qty: 20
                },
                {
                    color: "BlackTitanium",
                    storageSize: "1TB",
                    qty: 20
                }
            ]
        },

        {
            category: 'iPhone',
            categoryBitmap: '/pictures/productsBitmap/iPhone.png',
            displayName: 'iPhone 15 pro',
            description_short: 'Just the way you want it.',
            description_long: 'The first iPhone built for Apple Intelligence. Personal, private, powerful.So fast. So fluid. Get a feel for the all-new Camera Control. 4K 120 fps Dolby Vision. 4 studio-quality mics.A Pro studio in your pocket.',
            price: 999,
            priceUnit: '$',
            image_src: '/pictures/iphone/iphone_15_pro.png',
            color: [
                'DesertTitanium',
                'NaturalTitanium',
                'WhiteTitanium',
                'BlackTitanium'
            ],
            storageSize: ['256GB', '510GB', '1TB'],
            variants: [
                {
                    color: 'DesertTitanium',
                    storageSize: '256GB',
                    qty: 20
                },
                {
                    color: 'DesertTitanium',
                    storageSize: '510GB',
                    qty: 20
                },
                {
                    color: 'DesertTitanium',
                    storageSize: '1TB',
                    qty: 20
                },
                {
                    color: 'NaturalTitanium',
                    storageSize: '256GB',
                    qty: 20
                },
                {
                    color: 'NaturalTitanium',
                    storageSize: '510GB',
                    qty: 20
                },
                {
                    color: 'NaturalTitanium',
                    storageSize: '1TB',
                    qty: 20
                },
                {
                    color: 'WhiteTitanium',
                    storageSize: '256GB',
                    qty: 20
                },
                {
                    color: 'WhiteTitanium',
                    storageSize: '510GB',
                    qty: 20
                },
                {
                    color: 'WhiteTitanium',
                    storageSize: '1TB',
                    qty: 20
                },
                {
                    color: 'BlackTitanium',
                    storageSize: '256GB',
                    qty: 20
                },
                {
                    color: 'BlackTitanium',
                    storageSize: '510GB',
                    qty: 20
                },
                {
                    color: 'BlackTitanium',
                    storageSize: '1TB',
                    qty: 20
                }
            ],
        },
        {
            category: 'iPhone',
            displayName: 'iPhone SE',
            description_short: 'Love the price.',
            description_long: 'A highly efficient chip, an enhanced battery, and iOS 18 work together to boost battery life. When you do need to charge, just place iPhone SE on a wireless charger. Or connect a 20W or higher adapter to fast charge from zero to up to 50 percent charge in 30 minutes flat',
            price: 500,
            priceUnit: '$',
            image_src: '/pictures/iphone/iphone_SE.png',
            onSale: false,
            color: ['Midnight', 'Starlight', 'productRED'],
            storageSize: ['64GB', '128GB', '256GB'],
            categoryBitmap: '/pictures/productsBitmap/iPhone.png',
            variants: [
                {
                    color: "Midnight",
                    storageSize: "64GB",
                    qty: 20
                },
                {
                    color: "Midnight",
                    storageSize: "128GB",
                    qty: 20
                },
                {
                    color: "Midnight",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "Starlight",
                    storageSize: "64GB",
                    qty: 20
                },
                {
                    color: "Starlight",
                    storageSize: "128GB",
                    qty: 20
                },
                {
                    color: "Starlight",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "productRED",
                    storageSize: "64GB",
                    qty: 20
                },
                {
                    color: "productRED",
                    storageSize: "128GB",
                    qty: 20
                },
                {
                    color: "productRED",
                    storageSize: "256GB",
                    qty: 20
                }
            ]
        },
        {
            category: 'iPhone',
            displayName: 'iPhone 14',
            description_short: 'Your new iPhone awaits. Make it yours.',
            description_long: 'As part of our efforts to reach carbon neutrality by 2030, iPhone 14 and iPhone 14 Plus do not include a power adapter or EarPods. Included in the box is a USB‑C to Lightning Cable that supports fast charging and is compatible with USB‑C power adapters and computer ports.',
            price: 600,
            priceUnit: '$',
            image_src: '/pictures/iphone/iphone_14.png',
            onSale: false,
            color: ['Blue', 'Purple', 'Yellow', 'Midnight'],
            storageSize: ['64GB', '128GB', '256GB'],
            categoryBitmap: '/pictures/productsBitmap/iPhone.png',
            variants: [
                {
                    color: "Blue",
                    storageSize: "64GB",
                    qty: 20
                },
                {
                    color: "Blue",
                    storageSize: "128GB",
                    qty: 20
                },
                {
                    color: "Blue",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "Purple",
                    storageSize: "64GB",
                    qty: 20
                },
                {
                    color: "Purple",
                    storageSize: "128GB",
                    qty: 20
                },
                {
                    color: "Purple",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "Yellow",
                    storageSize: "64GB",
                    qty: 20
                },
                {
                    color: "Yellow",
                    storageSize: "128GB",
                    qty: 20
                },
                {
                    color: "Yellow",
                    storageSize: "256GB",
                    qty: 20
                },
                {
                    color: "Midnight",
                    storageSize: "64GB",
                    qty: 20
                },
                {
                    color: "Midnight",
                    storageSize: "128GB",
                    qty: 20
                },
                {
                    color: "Midnight",
                    storageSize: "256GB",
                    qty: 20
                },
            ]
        },
        {
            category: 'HomeKit',
            categoryBitmap: '/pictures/productsBitmap/AppleTV.png',
            displayName: 'Apple TV 4K',
            description_short: 'The Apple experience Cinematic in every sense.',
            description_long: 'Apple TV 4K unites your favorite Apple services with all your streaming apps in our best-ever picture and sound quality — thanks to the blazing‑fast A15 Bionic chip. Enjoy a FaceTime experience on TV1 that brings your friends and family into your living room — and onto the biggest screen in your home. And with seamless interaction with all your devices and smart home accessories,2 it’s everything you love about Apple — at its cinematic best.',
            price: 129,
            priceUnit: '$',
            image_src: '/pictures/appleTV&home/appleTV_4K.png',
            onSale: false,
            color: [],
            storageSize: [],
            variants: [
                {
                    qty: 20
                }
            ]
        },
        {
            category: 'HomeKit',
            categoryBitmap: '/pictures/productsBitmap/AppleTV.png',
            displayName: 'HomePod',
            description_short: 'Profound sound.',
            description_long: 'HomePod is a powerhouse of a speaker. Apple‑engineered audio technology and advanced software deliver high‑fidelity sound throughout the room. It intelligently adapts to whatever it’s playing — or wherever it’s playing — and surrounds you in immersive audio that makes everything you listen to sound incredible.',
            price: 299.9,
            priceUnit: '$',
            image_src: '/pictures/appleTV&home/HomePod.png',
            onSale: false,
            color: ['White', 'Midnight'],
            storageSize: [],
            variants: [
                {
                    color: "White",
                    qty: 20
                },
                {
                    color: "Midnight",
                    qty: 20
                }
            ]
        },
        {
            category: 'HomeKit',
            categoryBitmap: '/pictures/productsBitmap/AppleTV.png',
            displayName: 'HomePod mini',
            description_short: 'You’ve never heard color like this.',
            description_long: 'Jam-packed with innovation, HomePod mini delivers unexpectedly big sound for a speaker of its size. At just 3.3 inches tall, it takes up almost no space but fills the entire room with rich 360‑degree audio that sounds amazing from every angle. Add more than one HomePod mini for truly expansive sound.',
            price: 99.9,
            priceUnit: '$',
            image_src: '/pictures/appleTV&home/HomePod_mini.png',
            onSale: false,
            color: ['White', 'Midnight', 'Blue', 'Yellow', 'Orange'],
            storageSize: [],
            variants: [
                {
                    color: "White",
                    qty: 20
                },
                {
                    color: "Midnight",
                    qty: 20
                },
                {
                    color: "Blue",
                    qty: 20
                },
                {
                    color: "Yellow",
                    qty: 20
                },
                {
                    color: "Orange",
                    qty: 20
                }
            ]
        },
        {
            category: "Mac",
            displayName: "MacBook Air",
            description_short: "Superlight and under half an inch thin.",
            description_long: "MacBook Air fits easily into your life and is built with the planet in mind. MacBook Air with M3 is made with 50 percent recycled materials — an Apple first. And all MacBook Air laptops have a durable recycled aluminum enclosure.",
            price: 1499,
            priceUnit: "$",
            image_src: "/pictures/mac/MacBook_Air.png",
            color: ["Midnight", "Starlight", "SpaceGray", "Silver"],
            storageSize: ["256GB", "512GB", "1TB"],
            variants: [
                {
                    color: "Midnight",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Midnight",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Midnight",
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    color: "Starlight",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Starlight",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Starlight",
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "1TB",
                    qty: 30
                },
            ]
        },
        {
            category: "Mac",
            displayName: "MacBook Pro",
            description_short: "Hardware-accelerated ray tracing.",
            description_long: "For the first time, MacBook Pro features hardware-accelerated ray tracing. Combined with the new graphics architecture, it enables pro apps to deliver up to two and a half times faster rendering performance and allows games to provide more realistic shadows and reflections.",
            price: 1799,
            priceUnit: "$",
            image_src: "/pictures/mac/MacBook_Pro.png",
            color: ["Midnight", "SpaceGray", "Silver"],
            storageSize: ["256GB", "512GB", "1TB"],
            variants: [
                {
                    color: "Midnight",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Midnight",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Midnight",
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "1TB",
                    qty: 30
                },
            ]
        },
        {
            category: "Mac",
            displayName: "Mac Pro",
            description_short: "Mind-blowing performance now comes standard.",
            description_long: "The new Mac Pro is a game-changing combination of Apple silicon performance and PCIe expansion for specialized workflows. And every configuration comes with the incredible new M2 Ultra — our most powerful and capable chip ever.",
            price: 6999,
            priceUnit: "$",
            image_src: "/pictures/mac/MacPro.png",
            storageSize: ["1TB", "2TB", "4TB"],
            variants: [
                {
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    storageSize: "2TB",
                    qty: 30
                },
                {
                    storageSize: "4TB",
                    qty: 30
                }
            ]
        },
        {
            category: "Mac",
            displayName: "Mac Studio",
            description_short: "A true powerhouse.",
            description_long: "Embraced by creative pros everywhere, Mac Studio now delivers next-generation power in the form of the lightning-fast M2 Max and the boundary-breaking M2 Ultra. It packs outrageous performance and extensive connectivity in an unbelievably compact form, putting everything you need within easy reach and transforming any space into a studio.",
            price: 3999,
            priceUnit: "$",
            image_src: "/pictures/mac/MacStudio.png",
            storageSize: ["1TB", "2TB", "4TB"],
            variants: [
                {
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    storageSize: "2TB",
                    qty: 30
                },
                {
                    storageSize: "4TB",
                    qty: 30
                }
            ]
        },
        {
            category: "iPad",
            displayName: "iPad Pro",
            description_short: "The world’s most advanced display.",
            description_long: "The all-new iPad Pro packs astonishing power into an unbelievably thin, light, and portable design. Push the limits of what’s possible on iPad with a superportable 11-inch model and an expansive 13-inch model that is the thinnest product Apple has ever created",
            price: 1499,
            priceUnit: "$",
            image_src: "/pictures/ipad/iPad_Pro.png",
            color: ["Midnight", "SpaceGray", "Silver"],
            storageSize: ["256GB", "512GB", "1TB"],
            variants: [
                {
                    color: "Midnight",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Midnight",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Midnight",
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "1TB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "1TB",
                    qty: 30
                },
            ]
        },
        {
            category: "iPad",
            displayName: "iPad Air",
            description_short: "Infinite possibilities.",
            description_long: "The incredibly fast M2 chip brings breakout performance to iPad Air. With a powerful CPU, GPU, and Neural Engine, it’s nearly 50 percent faster than the previous generation. So you can easily plan your house remodel in Trimble SketchUp, play the latest triple-A games like Zenless Zone Zero, or use AI-enabled motion tracking in Onform to fine-tune your golf swing. All with amazing efficiency for all-day battery life",
            price: 999,
            priceUnit: "$",
            image_src: "/pictures/ipad/iPad_Air.png",
            color: ["SpaceGray", "Silver"],
            storageSize: ["64GB", "256GB", "512GB"],
            variants: [
                {
                    color: "SpaceGray",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "SpaceGray",
                    storageSize: "64GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "256GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "512GB",
                    qty: 30
                },
                {
                    color: "Silver",
                    storageSize: "64GB",
                    qty: 30
                },
            ]
        }, {
            category: "Watch",
            displayName: "Apple Watch 10",
            description_short: "Thinstant classic.",
            description_long: "Series 10 is a major milestone for Apple Watch. It features our biggest and most advanced display yet, showing more information onscreen than ever. With Apple’s first wide-angle OLED Display, the screen is brighter when viewed from an angle, making it easier to read with a quick glance.",
            price: 699,
            priceUnit: "$",
            image_src: "/pictures/watch/appleWatch_10.png",
            color: ["Silver", "SpaceGray", "Gold"],
            variants: [
                {
                    color: "Silver",
                    qty: 50
                },
                {
                    color: "SpaceGray",
                    qty: 50
                },
                {
                    color: "Gold",
                    qty: 50
                }
            ]
        },
        {
            category: "Watch",
            displayName: "Apple Watch SE",
            description_short: "A great deal to love.",
            description_long: "Easy ways to stay connected. Motivating fitness metrics. Innovative health and safety features. Fresh band colors. Apple Watch SE is packed with features at a feel-good price.",
            price: 249,
            priceUnit: "$",
            image_src: "/pictures/watch/appleWatch_SE.png",
            color: ["Silver", "RoseGold", "Black"],
            variants: [
                {
                    color: "Silver",
                    qty: 50
                },
                {
                    color: "RoseGold",
                    qty: 50
                },
                {
                    color: "Black",
                    qty: 50
                }
            ]
        },
        {
            category: "Watch",
            displayName: "Apple Watch Ultra",
            description_short: "2nd generation",
            description_long: "Featuring a stunning, new black titanium case, Apple Watch Ultra 2 is the ultimate sports and adventure watch. It has all the connectivity, health, and safety features for the everyday. And it takes training further with the most accurate GPS in a sports watch",
            price: 799,
            priceUnit: "$",
            image_src: "/pictures/watch/appleWatch_Ultra.png",
            color: ["Natural", "Black"],
            variants: [
                {
                    color: "Silver",
                    qty: 50
                },
                {
                    color: "Natural",
                    qty: 50
                }
            ]
        }, {
            category: "Watch",
            displayName: "Apple Watch Hermès",
            description_short: "A new season of legacy unfolds.",
            description_long: "Building on a shared foundation of craftsmanship and beauty, the Apple Watch Hermès portfolio is expanding with iconic new designs. The latest collection offers a journey into uncharted territory with deeply hued textiles, luxurious materials, nautical-inspired details, and the debut of the elegantly durable Apple Watch Hermès.",
            price: 1899,
            priceUnit: "$",
            image_src: "/pictures/watch/appleWatch_Hermes.png",
            variants: [
                {
                    qty: 50
                },
            ]
        }

    ]


// initialized database with fake data wiithout duplication
async function initializeDataBase() {
    for (let item of EXAMPLE_ITEMS) {
        const foundItem = await DBstore_item.findOne({ displayName: item.displayName });
        if (!foundItem) {
            await DBstore_item.create(item);
        }
    }
}
initializeDataBase().then(() => { applayCategoriesBitmap() });



module.exports = DBstore_item;