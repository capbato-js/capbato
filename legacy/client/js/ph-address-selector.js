/**
 * Philippine Address Autocomplete Utility
 * Provides cascading dropdowns for Province > City/Municipality > Barangay selection
 */

class PHAddressSelector {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'https://capstone-legacy.up.railway.app';
    this.provinceSelect = null;
    this.citySelect = null;
    this.barangaySelect = null;
    this.onSelectionChange = options.onSelectionChange || (() => {});
  }

  /**
   * Initialize the address selector with the provided select elements
   * @param {Object} selectors - Object containing province, city, and barangay select elements
   */
  init(selectors) {
    this.provinceSelect = selectors.province;
    this.citySelect = selectors.city;
    this.barangaySelect = selectors.barangay;

    // Load initial provinces
    this.loadProvinces();

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners for cascading selection
   */
  setupEventListeners() {
    if (this.provinceSelect) {
      this.provinceSelect.addEventListener('change', () => {
        const provinceCode = this.provinceSelect.value;
        this.clearSelect(this.citySelect);
        this.clearSelect(this.barangaySelect);
        
        if (provinceCode) {
          this.loadCities(provinceCode);
        }
        
        this.onSelectionChange('province', provinceCode);
      });
    }

    if (this.citySelect) {
      this.citySelect.addEventListener('change', () => {
        const cityCode = this.citySelect.value;
        this.clearSelect(this.barangaySelect);
        
        if (cityCode) {
          this.loadBarangays(cityCode);
        }
        
        this.onSelectionChange('city', cityCode);
      });
    }

    if (this.barangaySelect) {
      this.barangaySelect.addEventListener('change', () => {
        const barangayCode = this.barangaySelect.value;
        this.onSelectionChange('barangay', barangayCode);
      });
    }
  }

  /**
   * Load provinces from the API
   */
  async loadProvinces() {
    try {
      console.log('Loading provinces from:', `${this.baseURL}/address/provinces`);
      const response = await fetch(`${this.baseURL}/address/provinces`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const provinces = await response.json();
      console.log('Provinces loaded:', provinces.length);
      
      this.populateSelect(this.provinceSelect, provinces, 'Select Province');
    } catch (error) {
      console.error('Error loading provinces:', error);
      this.showError(this.provinceSelect, 'Failed to load provinces');
    }
  }

  /**
   * Load cities for the selected province
   * @param {string} provinceCode - The selected province code
   */
  async loadCities(provinceCode) {
    try {
      this.showLoading(this.citySelect, 'Loading cities...');
      console.log('Loading cities for province:', provinceCode);
      
      const response = await fetch(`${this.baseURL}/address/cities/${provinceCode}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const cities = await response.json();
      console.log('Cities loaded:', cities.length);
      
      this.populateSelect(this.citySelect, cities, 'Select City/Municipality');
    } catch (error) {
      console.error('Error loading cities:', error);
      this.showError(this.citySelect, 'Failed to load cities');
    }
  }

  /**
   * Load barangays for the selected city
   * @param {string} cityCode - The selected city code
   */
  async loadBarangays(cityCode) {
    try {
      this.showLoading(this.barangaySelect, 'Loading barangays...');
      
      const response = await fetch(`${this.baseURL}/address/barangays/${cityCode}`);
      const barangays = await response.json();
      
      this.populateSelect(this.barangaySelect, barangays, 'Select Barangay');
    } catch (error) {
      console.error('Error loading barangays:', error);
      this.showError(this.barangaySelect, 'Failed to load barangays');
    }
  }

  /**
   * Populate a select element with options
   * @param {HTMLSelectElement} selectElement - The select element to populate
   * @param {Array} options - Array of option objects with code and name
   * @param {string} placeholder - Placeholder text for the first option
   */
  populateSelect(selectElement, options, placeholder) {
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '';

    // Add placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectElement.appendChild(placeholderOption);

    // Add options
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.code;
      optionElement.textContent = option.name;
      selectElement.appendChild(optionElement);
    });

    // Enable the select
    selectElement.disabled = false;
  }

  /**
   * Clear a select element
   * @param {HTMLSelectElement} selectElement - The select element to clear
   */
  clearSelect(selectElement) {
    if (!selectElement) return;

    selectElement.innerHTML = '';
    selectElement.disabled = true;

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select...';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
  }

  /**
   * Show loading state in a select element
   * @param {HTMLSelectElement} selectElement - The select element
   * @param {string} message - Loading message
   */
  showLoading(selectElement, message) {
    if (!selectElement) return;

    selectElement.innerHTML = '';
    selectElement.disabled = true;

    const loadingOption = document.createElement('option');
    loadingOption.value = '';
    loadingOption.textContent = message;
    loadingOption.disabled = true;
    loadingOption.selected = true;
    selectElement.appendChild(loadingOption);
  }

  /**
   * Show error state in a select element
   * @param {HTMLSelectElement} selectElement - The select element
   * @param {string} message - Error message
   */
  showError(selectElement, message) {
    if (!selectElement) return;

    selectElement.innerHTML = '';
    selectElement.disabled = true;

    const errorOption = document.createElement('option');
    errorOption.value = '';
    errorOption.textContent = message;
    errorOption.disabled = true;
    errorOption.selected = true;
    errorOption.style.color = '#dc3545';
    selectElement.appendChild(errorOption);
  }

  /**
   * Get the selected values
   * @returns {Object} Object containing selected codes and names
   */
  getSelectedValues() {
    const result = {
      province: { code: '', name: '' },
      city: { code: '', name: '' },
      barangay: { code: '', name: '' }
    };

    if (this.provinceSelect && this.provinceSelect.value) {
      result.province.code = this.provinceSelect.value;
      result.province.name = this.provinceSelect.options[this.provinceSelect.selectedIndex].text;
    }

    if (this.citySelect && this.citySelect.value) {
      result.city.code = this.citySelect.value;
      result.city.name = this.citySelect.options[this.citySelect.selectedIndex].text;
    }

    if (this.barangaySelect && this.barangaySelect.value) {
      result.barangay.code = this.barangaySelect.value;
      result.barangay.name = this.barangaySelect.options[this.barangaySelect.selectedIndex].text;
    }

    return result;
  }

  /**
   * Set selected values programmatically
   * @param {Object} values - Object containing province, city, and barangay codes
   */
  async setSelectedValues(values) {
    if (values.province) {
      this.provinceSelect.value = values.province;
      if (values.city) {
        await this.loadCities(values.province);
        this.citySelect.value = values.city;
        if (values.barangay) {
          await this.loadBarangays(values.city);
          this.barangaySelect.value = values.barangay;
        }
      }
    }
  }

  /**
   * Generate a formatted address string
   * @returns {string} Formatted address
   */
  getFormattedAddress() {
    const values = this.getSelectedValues();
    const parts = [];

    if (values.barangay.name) parts.push(values.barangay.name);
    if (values.city.name) parts.push(values.city.name);
    if (values.province.name) parts.push(values.province.name);

    return parts.join(', ');
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PHAddressSelector;
}

// Global for script tag usage
if (typeof window !== 'undefined') {
  window.PHAddressSelector = PHAddressSelector;
}
