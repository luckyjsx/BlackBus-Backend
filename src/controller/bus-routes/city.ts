import { City } from "@src/model/bus-routes/city";
import { Request, Response } from "express";


export const createCity = async (req:Request, res:Response) => {
  try {
    const { name, state, country, aliases, popularity } = req.body;

    // Basic validation
    if (!name || !state || !country) {
      return res.status(400).json({
        success: false,
        message: "Name, state and country are required fields."
      });
    }

    const city = await City.create({
      name,
      state,
      country,
      aliases: aliases || [],
      popularity: popularity || 0,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: "City created successfully.",
      data: city
    });
  } catch (error) {
    console.error("Error creating city:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const searchCities = async (req:Request,res:Response) => {
    try {
        const query = req.query.query as string;
        const limit = req.query.limit as string;

        if(!query || query.length < 2){
            return res.json(400).json({
                success:false,
                message:"Query must be at least 2 character"
            })
        }

        const cities = await City.find({
            $or: [
                {name: {$regex:query, $options: 'i'}},
                {aliases: {$regex:query, $options: 'i'}},
            ],
            isActive:true
        })
        .select('name state country')
        .sort({popularity:-1, name:1})
        .limit(parseInt(limit))

        return res.status(200).json({
            success:true,
            data:cities
        })
    } catch (error) {
        console.log('city search error',error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


export async function getPopularCities( _req:Request,res:Response) {
  try {
    const cities = await City.find({ isActive: true })
      .select('name state country')
      .sort({ popularity: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: cities
    });

  } catch (error) {
    console.error('Popular cities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}