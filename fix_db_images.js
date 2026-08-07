import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';
import Destination from './src/models/Destination.js';
import Package from './src/models/Package.js';

dotenv.config();

const badIds = [
  '1574349977051-5fbb79ab2b59',
  '1600100397608-f010f419c9ba',
  '1593693397690-362cb9666c6b',
  '1564507592208-0287afa58b5e',
  '1579603058866-26759c87d46c',
  '1587595431973-160d0d94add1',
  '1610416955097-bf0e54d5d3ff',
  '1624806037748-03875317f0dd'
];

const goodId = '1512343879784-a960bf40e7f2'; // Goa image

// Bhutan image fix
const oldBhutanId = '1603262110263-fb0112e7cc33';
const newBhutanId = '1578556881786-851d4b79cb73';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Fix Categories
    const categories = await Category.find();
    for(let c of categories) {
      if(c.image && badIds.some(id => c.image.includes(id))) {
        badIds.forEach(id => { c.image = c.image.replace(id, goodId); });
        await c.save();
        console.log('Fixed category:', c.name);
      }
    }

    // Fix Destinations
    const destinations = await Destination.find();
    for(let d of destinations) {
      let changed = false;
      if(d.image && badIds.some(id => d.image.includes(id))) {
        badIds.forEach(id => { d.image = d.image.replace(id, goodId); });
        changed = true;
      }
      if(d.image && d.image.includes(oldBhutanId)) {
        d.image = d.image.replace(oldBhutanId, newBhutanId);
        changed = true;
      }
      if(d.banner && badIds.some(id => d.banner.includes(id))) {
        badIds.forEach(id => { d.banner = d.banner.replace(id, goodId); });
        changed = true;
      }
      if(d.banner && d.banner.includes(oldBhutanId)) {
        d.banner = d.banner.replace(oldBhutanId, newBhutanId);
        changed = true;
      }
      if(d.gallery && d.gallery.length) {
        d.gallery = d.gallery.map(g => {
          let updated = g;
          badIds.forEach(id => { updated = updated.replace(id, goodId); });
          updated = updated.replace(oldBhutanId, newBhutanId);
          if(updated !== g) changed = true;
          return updated;
        });
      }
      if(changed) {
        await d.save();
        console.log('Fixed destination:', d.name);
      }
    }

    // Fix Packages
    const packages = await Package.find();
    for(let p of packages) {
      let changed = false;
      if(p.thumbnail && badIds.some(id => p.thumbnail.includes(id))) {
        badIds.forEach(id => { p.thumbnail = p.thumbnail.replace(id, goodId); });
        changed = true;
      }
      if(p.thumbnail && p.thumbnail.includes(oldBhutanId)) {
        p.thumbnail = p.thumbnail.replace(oldBhutanId, newBhutanId);
        changed = true;
      }
      if(p.coverImage && badIds.some(id => p.coverImage.includes(id))) {
        badIds.forEach(id => { p.coverImage = p.coverImage.replace(id, goodId); });
        changed = true;
      }
      if(p.coverImage && p.coverImage.includes(oldBhutanId)) {
        p.coverImage = p.coverImage.replace(oldBhutanId, newBhutanId);
        changed = true;
      }
      if(p.images && p.images.length) {
        p.images = p.images.map(img => {
          let updated = img;
          badIds.forEach(id => { updated = updated.replace(id, goodId); });
          updated = updated.replace(oldBhutanId, newBhutanId);
          if(updated !== img) changed = true;
          return updated;
        });
      }
      if(p.itinerary && p.itinerary.length) {
        p.itinerary = p.itinerary.map(day => {
          if(day.image && badIds.some(id => day.image.includes(id))) {
            badIds.forEach(id => { day.image = day.image.replace(id, goodId); });
            changed = true;
          }
          if(day.image && day.image.includes(oldBhutanId)) {
            day.image = day.image.replace(oldBhutanId, newBhutanId);
            changed = true;
          }
          return day;
        });
      }
      if(changed) {
        await p.save();
        console.log('Fixed package:', p.title);
      }
    }

    console.log('Database fix complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
