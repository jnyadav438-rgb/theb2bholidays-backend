import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './src/models/Destination.js';
import Package from './src/models/Package.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/b2bholidays';

const validImageMap = {
  'Hyderabad': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', // Dubai fallback
  'Madhya Pradesh': 'https://images.unsplash.com/photo-1589394815804-964ce0fa58c4?q=80&w=800&auto=format&fit=crop', // Andaman nature fallback
  'Meghalaya Assam': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop', // Kerala nature fallback
  'Odisha': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop', // Thailand fallback
  'Uttarakhand': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop', // Manali fallback
  'Arunachal Pradesh': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop', // Kashmir fallback
  'Pilgrim Package': 'https://images.unsplash.com/photo-1564507592208-0287afa58b5e?q=80&w=800&auto=format&fit=crop', // Agra fallback
  'Coorg Mysore': 'https://images.unsplash.com/photo-1593693397690-362cb9666c6b?q=80&w=800&auto=format&fit=crop', // Munnar fallback
};

const runSync = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const destinations = await Destination.find({});
    for (const dest of destinations) {
      if (validImageMap[dest.name]) {
        console.log(`Fixing image for destination: ${dest.name}`);
        const imgUrl = validImageMap[dest.name];
        
        await Destination.findByIdAndUpdate(dest._id, {
          image: imgUrl,
          heroImage: imgUrl.replace('w=800', 'w=2000') // higher res for hero
        });

        await Package.updateMany(
          { destination: dest._id },
          { 
            thumbnail: imgUrl,
            coverImage: imgUrl.replace('w=800', 'w=2000')
          }
        );
      }
    }

    console.log('Fix Complete!');
  } catch (err) {
    console.error('Error during update:', err);
  } finally {
    await mongoose.disconnect();
  }
};

runSync();
