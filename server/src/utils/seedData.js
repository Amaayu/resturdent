import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create customer user
    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
      phone: '555-0123',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    });

    // Create restaurants
    const restaurants = await Restaurant.create([
      {
        name: 'Pizza Palace',
        description: 'Authentic Italian pizza made with fresh ingredients',
        address: { street: '456 Pizza Ave', city: 'New York', state: 'NY', zipCode: '10002' },
        phone: '555-1111',
        email: 'info@pizzapalace.com',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        cuisineType: ['Italian', 'Pizza'],
        priceRange: 'Moderate',
        rating: 4.5,
        totalReviews: 120,
        deliveryTime: '30-40 min',
        isActive: true,
        owner: admin._id
      },
      {
        name: 'Sushi Master',
        description: 'Fresh sushi and Japanese cuisine',
        address: { street: '789 Sushi Blvd', city: 'New York', state: 'NY', zipCode: '10003' },
        phone: '555-2222',
        email: 'info@sushimaster.com',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        cuisineType: ['Japanese', 'Sushi'],
        priceRange: 'Expensive',
        rating: 4.8,
        totalReviews: 95,
        deliveryTime: '40-50 min',
        isActive: true,
        owner: admin._id
      },
      {
        name: 'Burger House',
        description: 'Juicy burgers and crispy fries',
        address: { street: '321 Burger St', city: 'New York', state: 'NY', zipCode: '10004' },
        phone: '555-3333',
        email: 'info@burgerhouse.com',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        cuisineType: ['American', 'Burgers'],
        priceRange: 'Budget',
        rating: 4.3,
        totalReviews: 200,
        deliveryTime: '20-30 min',
        isActive: true,
        owner: admin._id
      },
      {
        name: 'Spice of India',
        description: 'Traditional Indian cuisine with authentic spices',
        address: { street: '654 Curry Lane', city: 'New York', state: 'NY', zipCode: '10005' },
        phone: '555-4444',
        email: 'info@spiceofindia.com',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        cuisineType: ['Indian', 'Curry'],
        priceRange: 'Moderate',
        rating: 4.6,
        totalReviews: 150,
        deliveryTime: '35-45 min',
        isActive: true,
        owner: admin._id
      }
    ]);

    // ============================
    // Menu Items (25 dishes total)
    // ============================

    // Pizza Palace (6 dishes)
    await MenuItem.create([
      {
        restaurant: restaurants[0]._id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 12.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni and cheese',
        price: 14.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing',
        price: 8.99,
        category: 'Salads',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Veggie Delight Pizza',
        description: 'Loaded with fresh veggies and mozzarella',
        price: 13.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1601924582971-4f2272b197f6?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken with BBQ sauce and cheese',
        price: 15.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1594007652187-7f28b1c0ef1a?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Greek Salad',
        description: 'Fresh salad with feta cheese, olives, and cucumber',
        price: 9.99,
        category: 'Salads',
        image: 'https://images.unsplash.com/photo-1566843972731-0e0c25c91dc5?w=400',
        isAvailable: true,
        isVegetarian: true
      }
    ]);

    // Sushi Master (6 dishes)
    await MenuItem.create([
      {
        restaurant: restaurants[1]._id,
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber',
        price: 10.99,
        category: 'Rolls',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over rice',
        price: 12.99,
        category: 'Nigiri',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Miso Soup',
        description: 'Traditional Japanese soup',
        price: 4.99,
        category: 'Soups',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Tuna Roll',
        description: 'Fresh tuna with sushi rice and seaweed',
        price: 11.99,
        category: 'Rolls',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Eel Nigiri',
        description: 'Grilled eel on top of sushi rice',
        price: 13.99,
        category: 'Nigiri',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Edamame',
        description: 'Steamed soybeans with sea salt',
        price: 5.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        isAvailable: true,
        isVegetarian: true
      }
    ]);

    // Burger House (7 dishes)
    await MenuItem.create([
      {
        restaurant: restaurants[2]._id,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and cheese',
        price: 9.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Bacon Cheeseburger',
        description: 'Double patty with bacon and cheese',
        price: 12.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 4.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Cheese Fries',
        description: 'Fries topped with melted cheese',
        price: 5.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Veggie Burger',
        description: 'Grilled veggie patty with lettuce and tomato',
        price: 10.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Chicken Nuggets',
        description: 'Crispy chicken bites',
        price: 6.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Onion Rings',
        description: 'Golden fried onion rings',
        price: 4.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isAvailable: true,
        isVegetarian: true
      }
    ]);

    // Spice of India (6 dishes)
    await MenuItem.create([
      {
        restaurant: restaurants[3]._id,
        name: 'Chicken Tikka Masala',
        description: 'Tender chicken in creamy tomato sauce',
        price: 15.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        isAvailable: true,
        spiceLevel: 'medium'
      },
      {
        restaurant: restaurants[3]._id,
        name: 'Vegetable Biryani',
        description: 'Fragrant rice with mixed vegetables',
        price: 13.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        isAvailable: true,
        isVegetarian: true,
        spiceLevel: 'mild'
      },
      {
        restaurant: restaurants[3]._id,
        name: 'Garlic Naan',
        description: 'Fresh baked bread with garlic',
        price: 3.99,
        category: 'Breads',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        isAvailable: true,
        isVegetarian: true
      },
      {
        restaurant: restaurants[3]._id,
        name: 'Paneer Butter Masala',
        description: 'Soft paneer cubes in creamy tomato gravy',
        price: 14.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        isAvailable: true,
        isVegetarian: true,
        spiceLevel: 'medium'
      },
      {
        restaurant: restaurants[3]._id,
        name: 'Lamb Rogan Josh',
        description: 'Tender lamb cooked in rich curry',
        price: 16.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        isAvailable: true,
        spiceLevel: 'hot'
      },
      {
        restaurant: restaurants[3]._id,
        name: 'Roti',
        description: 'Whole wheat flatbread',
        price: 2.99,
        category: 'Breads',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        isAvailable: true,
        isVegetarian: true
      }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Customer: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
