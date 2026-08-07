import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './src/models/Destination.js';
import Package from './src/models/Package.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/b2bholidays';

const internationalList = [
  { name: 'Bali', country: 'Indonesia' },
  { name: 'Vietnam', country: 'Vietnam' },
  { name: 'Bhutan', country: 'Bhutan' },
  { name: 'Nepal', country: 'Nepal' }
];

const domesticList = [
  { name: 'Golden Triangle', state: 'Delhi/Agra/Jaipur' },
  { name: 'Rajasthan', state: 'Rajasthan' },
  { name: 'Gujarat', state: 'Gujarat' },
  { name: 'Himachal Pradesh', state: 'Himachal Pradesh' },
  { name: 'Pilgrim Package', state: 'Various' },
  { name: 'Madhya Pradesh', state: 'Madhya Pradesh' },
  { name: 'Meghalaya Assam', state: 'Meghalaya/Assam' },
  { name: 'Sikkim', state: 'Sikkim' },
  { name: 'Arunachal Pradesh', state: 'Arunachal Pradesh' },
  { name: 'Kashmir', state: 'Jammu & Kashmir' },
  { name: 'Ladakh', state: 'Ladakh' },
  { name: 'Coorg Mysore', state: 'Karnataka' },
  { name: 'Odisha', state: 'Odisha' },
  { name: 'Uttarakhand', state: 'Uttarakhand' },
  { name: 'Goa', state: 'Goa' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Maharashtra', state: 'Maharashtra' },
  { name: 'West Bengal', state: 'West Bengal' }
];

const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const runSync = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    console.log('Clearing existing Destinations and Packages...');
    await Destination.deleteMany({});
    await Package.deleteMany({});

    let displayOrder = 1;

    for (const item of internationalList) {
      console.log(`Creating International: ${item.name}`);
      const dest = await Destination.create({
        name: item.name,
        slug: generateSlug(item.name),
        country: item.country,
        type: 'international',
        displayOrder: displayOrder++,
        popular: true,
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000&q=80',
        shortDescription: `Experience the breathtaking beauty of ${item.name}.`,
        tourCount: 1,
        startingPrice: 25000,
        rating: 4.8,
        reviewCount: 120
      });

      await Package.create({
        title: `Best of ${item.name} Tour`,
        slug: generateSlug(`Best of ${item.name} Tour`),
        destination: dest._id,
        country: item.country,
        type: 'international',
        price: 25000,
        thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        durationDays: 5,
        durationNights: 4,
        popular: true,
        bestSelling: true,
        rating: 4.8,
        displayOrder: displayOrder
      });
    }

    for (const item of domesticList) {
      console.log(`Creating Domestic: ${item.name}`);
      const dest = await Destination.create({
        name: item.name,
        slug: generateSlug(item.name),
        country: 'India',
        state: item.state,
        type: 'domestic',
        displayOrder: displayOrder++,
        popular: true,
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=2000&q=80',
        shortDescription: `Discover the incredible culture and landscapes of ${item.name}.`,
        tourCount: 1,
        startingPrice: 15000,
        rating: 4.7,
        reviewCount: 85
      });

      await Package.create({
        title: `Discover ${item.name} Package`,
        slug: generateSlug(`Discover ${item.name} Package`),
        destination: dest._id,
        country: 'India',
        type: 'domestic',
        price: 15000,
        thumbnail: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
        durationDays: 4,
        durationNights: 3,
        popular: true,
        bestSelling: true,
        rating: 4.7,
        displayOrder: displayOrder
      });
    }

    console.log('Sync Complete! Successfully replaced all destinations and packages.');
  } catch (err) {
    console.error('Error during sync:', err);
  } finally {
    await mongoose.disconnect();
  }
};

runSync();
