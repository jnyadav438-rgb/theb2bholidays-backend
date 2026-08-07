import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './src/models/Destination.js';
import Package from './src/models/Package.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/b2bholidays';

const validImageMap = {
  'Himachal Pradesh': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop',
  'Bhutan': 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=800&auto=format&fit=crop',
  'Gujarat': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop',
  'Coorg Mysore': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop',
  'Pilgrim Package': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
  'Madhya Pradesh': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
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

    console.log('Final Fix Complete!');
  } catch (err) {
    console.error('Error during update:', err);
  } finally {
    await mongoose.disconnect();
  }
};

runSync();
