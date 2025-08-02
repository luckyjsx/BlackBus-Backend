import express from 'express';
import { upload } from '../config/cloudinary';
import { createCountry, deleteCountry, getAllCountries, getCountryById, updateCountry } from '@src/controller/country';

const router = express.Router();

//create new country
router.post('/', upload.single('image'), createCountry);

//get all countries
router.get('/', getAllCountries);

//get country by ID
router.get('/:id', getCountryById);

//update country
router.put('/:id', upload.single('image'), updateCountry);

//delete country
router.delete('/:id', deleteCountry);

// Get languages by country ID
// router.get('/:countryId/languages', getLanguagesByCountry);

// Get languages by country name
// router.get('/name/:countryName/languages', getLanguagesByCountryName);

export default router;