import { CountryModel } from '../model/country';
import cloudinary from '../config/cloudinary';
import { Request, Response } from 'express';
import { createCountrySchema, getCountryByIdSchema, updateCountrySchema } from '@src/schemas/country.schema';

//create country
export const createCountry = async (req: Request, res: Response) => {
    try {
        const validationResult = createCountrySchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation error.',
                errors: validationResult.error.issues,
            });
        }

        const { name, availableLanguages } = validationResult.data;

        // accept either file upload or image URL
        let imagePath: string | undefined;
        if (req.file) {
            imagePath = req.file.path;
            console.log("twinkle",imagePath)
        } else if (req.body.image && typeof req.body.image === 'string') {
            imagePath = req.body.image;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Country image is required.'
            });
        }

        //check if country already exists
        const existingCountry = await CountryModel.findOne({ name });
        if (existingCountry) {
            return res.status(400).json({
                success: false,
                message: 'Country already exists.',
            });
        }

        const country = new CountryModel({
            name,
            image: imagePath,
            availableLanguages,
        });

        await country.save();

        res.status(201).json({
            success: true,
            message: 'Country created successfully.',
            data: country,
        });
    } catch (error) {
        console.error('Error creating country:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
    return
}

// get all countries
export const getAllCountries = async (_req: Request, res: Response) => {
    try {
        const countries = await CountryModel.find()
        res.status(200).json({
            success: true,
            message: 'Countries retrieved successfully.',
            data: countries,
        })
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

//get country by id
export const getCountryById = async (req: Request, res: Response) => {
    try {
        const validationResult = getCountryByIdSchema.safeParse(req.params);
        if(!validationResult.success){
            return res.status(400).json({
                success: false,
                message: 'Validation error.',
                errors: validationResult.error.issues,
            });
        }

        const { id } = validationResult.data;
        const country = await CountryModel.findById(id);
        if(!country){
            return res.status(404).json({
                success: false,
                message: 'Country not found.',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Country retrieved successfully.',
            data: country,
        });
    } catch (error){
        console.error('Error fetching country by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
    return
}

//update country
export const updateCountry = async (req: Request, res: Response) => {
    try {
        const validationResult = updateCountrySchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation error.',
                errors: validationResult.error.issues,
            });
        }

        const { id } = req.params;
        const updateData: {
            name?: string;
            availableLanguages?: string[];
            image?: string;
        } = { ...validationResult.data };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const country = await CountryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!country) {
            return res.status(404).json({
                success: false,
                message: 'Country not found.',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Country updated successfully.',
            data: country,
        });
    } catch (error) {
        console.error('Error updating country:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
    return
};

// delete country
// export const deleteCountry = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     const country = await CountryModel.findById(id);
    
//     if (!country) {
//       return res.status(404).json({
//         success: false,
//         message: 'Country not found',
//       });
//     }

//     // Delete image from Cloudinary if it exists
//     if (country.image) {
//       const publicId = country.image.split('/').pop()?.split('.')[0];
//       if (publicId) {
//         await cloudinary.uploader.destroy(publicId);
//       }
//     }

//     await CountryModel.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: 'Country deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting country:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
//   return
// };


//delete country
export const deleteCountry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const country = await CountryModel.findById(id);
        if (!country) {
            return res.status(400).json({ success: false, message: 'Country not found' });
        }
        //delete image from cloudinary if it exists
        if (country.image && typeof country.image === 'string') {
            try {
                //extract public id : remove extension and url params
                const urlParts = country.image.split('/');
                const lastSegement = urlParts.pop() || '';
                const [filenameWithExt] = lastSegement.split('?');
                const publicIdWithVersion = filenameWithExt.replace(/\.[^/.]+$/, '');

                //if store folder structure like "countries/xyz", need to preserve that
                //for eg if cloudinary URL is /v1234/countries/germany-flag.jpg and want the public_id "countries/germany-flag" then we might instead parse after the upload folder
                let publicId = publicIdWithVersion;
                const folderMatch = country.image.match(/\/([^/]+\/[^/.]+)(?:\.[^/.]+)(?:$|\?)/);
                if (folderMatch) {
                    publicId = folderMatch[1];
                }
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudErr) {
                console.warn('Cloudinary deletion failed:', cloudErr);
            }
        }
        await CountryModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Country deleted successfully' });
    } catch (error) {
        console.error('Error deleting country:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get languages by country
// export const getLanguagesByCountry = async (req: Request, res: Response) => {
//   try {
//     const validationResult = getLanguagesByCountrySchema.safeParse(req.params);
    
//     if (!validationResult.success) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: validationResult.error.issues,
//       });
//     }

//     const { countryId } = validationResult.data;
    
//     const country = await CountryModel.findById(countryId);
    
//     if (!country) {
//       return res.status(404).json({
//         success: false,
//         message: 'Country not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Languages retrieved successfully',
//       data: {
//         countryName: country.name,
//         availableLanguages: country.availableLanguages,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching languages:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
//   return
// };

// get languages by country name
// export const getLanguagesByCountryName = async (req: Request, res: Response) => {
//   try {
//     const { countryName } = req.params;
    
//     if (!countryName) {
//       return res.status(400).json({
//         success: false,
//         message: 'Country name is required',
//       });
//     }
    
//     const country = await CountryModel.findOne({ 
//       name: { $regex: new RegExp(countryName, 'i') } 
//     });
    
//     if (!country) {
//       return res.status(404).json({
//         success: false,
//         message: 'Country not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Languages retrieved successfully',
//       data: {
//         countryName: country.name,
//         availableLanguages: country.availableLanguages,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching languages:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
//   return
// }; 