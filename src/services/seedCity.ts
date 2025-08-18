
import mongoose from "mongoose";
import {config} from "dotenv"
import { City } from "../model/bus-routes/city";
import connectToDatabase from "../config/databaseConnection";

config()



const CITIES = [
  { name: "Mumbai", state: "Maharashtra", country: "India", aliases: ["Bombay"], popularity: 100 },
  { name: "Delhi", state: "Delhi", country: "India", aliases: ["New Delhi"], popularity: 95 },
  { name: "Bangalore", state: "Karnataka", country: "India", aliases: ["Bengaluru"], popularity: 90 },
  { name: "Hyderabad", state: "Telangana", country: "India", aliases: [], popularity: 85 },
  { name: "Chennai", state: "Tamil Nadu", country: "India", aliases: ["Madras"], popularity: 80 },
  { name: "Pune", state: "Maharashtra", country: "India", aliases: [], popularity: 75 },
  { name: "Ahmedabad", state: "Gujarat", country: "India", aliases: [], popularity: 70 },
  { name: "Kolkata", state: "West Bengal", country: "India", aliases: [], popularity: 65 },
  { name: "Surat", state: "Gujarat", country: "India", aliases: [], popularity: 60 },
  { name: "Jaipur", state: "Rajasthan", country: "India", aliases: [], popularity: 55 }
];

async function main() {
    await connectToDatabase()
  for (const c of CITIES) {
    const exists = await City.findOne({ name: c.name, state: c.state, country: c.country });
    if (!exists) {
      await City.create({ ...c, isActive: true });
      console.log(`Seeded: ${c.name}, ${c.state}`);
    } else {
      console.log(`Exists: ${c.name}, ${c.state}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done seeding cities.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
