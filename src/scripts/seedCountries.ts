import { config } from 'dotenv';
import connectToDatabase from '../config/databaseConnection';
import { CountryModel } from '../model/country';

config();
connectToDatabase();

const countries = [
    {
        name: 'India',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/india-flag.jpg',
        availableLanguages: [
            'हिन्दी (Hindi)',
            'English',
            'தமிழ் (Tamil)',
            'తెలుగు (Telugu)',
            'ગુજરાતી (Gujarati)',
        ],
    },
    {
        name: 'USA',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/usa-flag.jpg',
        availableLanguages: ['English', 'Español (Spanish)'],
    },
    {
        name: 'UK',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/uk-flag.jpg',
        availableLanguages: ['English'],
    },
    {
        name: 'Canada',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/canada-flag.jpg',
        availableLanguages: ['English', 'Français (French)'],
    },
    {
        name: 'France',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/france-flag.jpg',
        availableLanguages: ['Français (French)'],
    },
    {
        name: 'Japan',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/japan-flag.jpg',
        availableLanguages: ['日本語 (Japanese)', 'English'],
    },
    {
        name: 'China',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/china-flag.jpg',
        availableLanguages: ['中文 (Chinese)'],
    },
    {
        name: 'Brazil',
        image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/countries/brazil-flag.jpg',
        availableLanguages: ['Português (Portuguese)', 'English'],
    },
];

const seedCountries = async () => {
    try {
        await CountryModel.deleteMany({});
        console.log('Cleared existing countries');

        const result = await CountryModel.insertMany(countries);
        console.log(`Successfully seeded ${result.length} countries`);

        console.log('\n Seeded countries:');
        result.forEach(country => {
            console.log(`- ${country.name}: ${country.availableLanguages.join(', ')}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error seeding countries:', error);
        process.exit(1);
    }
};

seedCountries();