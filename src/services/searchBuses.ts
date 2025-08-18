import { BusModel } from "@src/model/bus";


interface SearchParams {
  from: string;
  to: string;
  date: Date;
}

export async function searchBuses({ from, to, date }: SearchParams) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await BusModel.find({
    from: { $regex: new RegExp(`^${from}$`, "i") },
    to: { $regex: new RegExp(`^${to}$`, "i") },
    date: { $gte: startOfDay, $lte: endOfDay },
    seatsAvailable: { $gt: 0 },
  }).populate({
    path: 'routeId',
    populate: { path: 'stops' }
  }).sort({ departureTime: 1 });
}
