import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the comprehensive Philippine address data
const philippinesDataPath = join(__dirname, '../data/philippines-complete.json');
const philippinesData = JSON.parse(readFileSync(philippinesDataPath, 'utf8'));

export async function getProvinces(req, res) {
  try {
    // Extract all provinces from all regions
    const provinces = [];
    
    Object.keys(philippinesData).forEach(regionKey => {
      const region = philippinesData[regionKey];
      if (region.province_list) {
        Object.keys(region.province_list).forEach(provinceName => {
          provinces.push({
            code: provinceName.replace(/\s+/g, '_').toUpperCase(), // Generate code from name
            name: provinceName
          });
        });
      }
    });
    
    // Sort provinces alphabetically
    provinces.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(provinces);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({ error: 'Failed to fetch provinces' });
  }
}

export async function getCities(req, res) {
  try {
    const { provinceCode } = req.params;
    
    // Convert province code back to province name
    const provinceName = provinceCode.replace(/_/g, ' ');
    
    // Find the province and get its municipalities
    const cities = [];
    
    Object.keys(philippinesData).forEach(regionKey => {
      const region = philippinesData[regionKey];
      if (region.province_list && region.province_list[provinceName]) {
        const municipalities = region.province_list[provinceName].municipality_list;
        Object.keys(municipalities).forEach(municipalityName => {
          cities.push({
            code: municipalityName.replace(/\s+/g, '_').toLowerCase(),
            name: municipalityName
          });
        });
      }
    });
    
    // Sort cities alphabetically
    cities.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
}

export async function getBarangays(req, res) {
  try {
    const { cityCode } = req.params;
    
    // Convert city code back to city name
    const cityName = cityCode.replace(/_/g, ' ').toUpperCase();
    
    // Find the city/municipality and get its barangays
    let barangays = [];
    
    Object.keys(philippinesData).forEach(regionKey => {
      const region = philippinesData[regionKey];
      if (region.province_list) {
        Object.keys(region.province_list).forEach(provinceName => {
          const municipalities = region.province_list[provinceName].municipality_list;
          if (municipalities && municipalities[cityName]) {
            const barangayList = municipalities[cityName].barangay_list;
            barangays = barangayList.map((barangayName, index) => ({
              code: `B${(index + 1).toString().padStart(3, '0')}`,
              name: barangayName
            }));
          }
        });
      }
    });
    
    // Sort barangays alphabetically
    barangays.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(barangays);
  } catch (error) {
    console.error('Error fetching barangays:', error);
    res.status(500).json({ error: 'Failed to fetch barangays' });
  }
}
