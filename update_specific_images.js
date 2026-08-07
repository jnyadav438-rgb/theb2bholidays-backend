import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './src/models/Destination.js';
import Package from './src/models/Package.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/b2bholidays';

const imageMap = {
  'Bhutan': 'https://images.unsplash.com/photo-1627896157734-4d7d4388f28b?q=80&w=800&auto=format&fit=crop',
  'Gujarat': 'https://images.unsplash.com/photo-1600100397608-f010f419c9ba?q=80&w=800&auto=format&fit=crop',
  'Himachal Pradesh': 'https://images.unsplash.com/photo-1605649487212-4d5dc29590e8?q=80&w=800&auto=format&fit=crop',
};

const runSync = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const destinations = await Destination.find({});
    for (const dest of destinations) {
      if (imageMap[dest.name]) {
        console.log(`Updating image for destination: ${dest.name}`);
        const imgUrl = imageMap[dest.name];
        
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

    console.log('Image Update Complete!');
  } catch (err) {
    console.error('Error during update:', err);
  } finally {
    await mongoose.disconnect();
  }
};

runSync();
