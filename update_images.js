import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './src/models/Destination.js';
import Package from './src/models/Package.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/b2bholidays';

const imageMap = {
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
  'Vietnam': 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
  'Bhutan': 'https://images.unsplash.com/photo-1582650549429-231a39626e2a?q=80&w=800&auto=format&fit=crop',
  'Nepal': 'https://images.unsplash.com/photo-1581793746485-04698e79a4e8?q=80&w=800&auto=format&fit=crop',
  'Golden Triangle': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop',
  'Rajasthan': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
  'Gujarat': 'https://images.unsplash.com/photo-1601053153671-893d56711822?q=80&w=800&auto=format&fit=crop',
  'Himachal Pradesh': 'https://images.unsplash.com/photo-1596706917637-2fb0fae53466?q=80&w=800&auto=format&fit=crop',
  'Pilgrim Package': 'https://images.unsplash.com/photo-1565552643985-78e72750e334?q=80&w=800&auto=format&fit=crop',
  'Madhya Pradesh': 'https://images.unsplash.com/photo-1576487248805-fd03f677baee?q=80&w=800&auto=format&fit=crop',
  'Meghalaya Assam': 'https://images.unsplash.com/photo-1579761922573-04bcf7f1e72f?q=80&w=800&auto=format&fit=crop',
  'Sikkim': 'https://images.unsplash.com/photo-1621213032549-3351d4576395?q=80&w=800&auto=format&fit=crop',
  'Arunachal Pradesh': 'https://images.unsplash.com/photo-1622037198442-1264c1c9c054?q=80&w=800&auto=format&fit=crop',
  'Kashmir': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
  'Ladakh': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
  'Coorg Mysore': 'https://images.unsplash.com/photo-1589136125028-c11649931b6e?q=80&w=800&auto=format&fit=crop',
  'Odisha': 'https://images.unsplash.com/photo-1634568856111-9f94eb9725f7?q=80&w=800&auto=format&fit=crop',
  'Uttarakhand': 'https://images.unsplash.com/photo-1610416955097-bf0e54d5d3ff?q=80&w=800&auto=format&fit=crop',
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
  'Hyderabad': 'https://images.unsplash.com/photo-1513227443834-8c8cebf8bdc1?q=80&w=800&auto=format&fit=crop',
  'Maharashtra': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop',
  'West Bengal': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop'
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
        
        // Update destination
        await Destination.findByIdAndUpdate(dest._id, {
          image: imgUrl,
          heroImage: imgUrl.replace('w=800', 'w=2000') // higher res for hero
        });

        // Update all packages belonging to this destination
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
