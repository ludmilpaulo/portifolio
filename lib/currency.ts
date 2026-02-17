/**
 * Currency conversion utility
 * Converts USD amounts to AOA (Angolan Kwanza) or ZAR (South African Rand)
 */

export type Currency = 'USD' | 'AOA' | 'ZAR';
export type Country = 'Angola' | 'South Africa' | 'Other';

// Exchange rates (approximate - should be updated periodically)
// As of 2024, approximate rates:
const EXCHANGE_RATES = {
  AOA: 830, // 1 USD ≈ 830 AOA
  ZAR: 18.5, // 1 USD ≈ 18.5 ZAR
  USD: 1,
} as const;

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'AOA':
      return 'Kz';
    case 'ZAR':
      return 'R';
    case 'USD':
    default:
      return '$';
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  
  // Format number with thousand separators
  // Use 2 decimal places for USD and ZAR, 0 for AOA
  const decimals = currency === 'AOA' ? 0 : 2;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  
  if (currency === 'USD') {
    return `${symbol}${formatted}`;
  } else if (currency === 'ZAR') {
    return `${symbol} ${formatted}`;
  } else {
    // AOA
    return `${formatted} ${symbol}`;
  }
}

/**
 * Convert USD amount to target currency
 */
export function convertCurrency(usdAmount: number, targetCurrency: Currency): number {
  if (targetCurrency === 'USD') {
    return usdAmount;
  }
  
  const rate = EXCHANGE_RATES[targetCurrency];
  const converted = usdAmount * rate;
  // Round to 2 decimals for ZAR, whole number for AOA
  return targetCurrency === 'AOA' ? Math.round(converted) : Math.round(converted * 100) / 100;
}

/**
 * Convert budget range from USD to target currency
 */
export function convertBudgetRange(
  usdRange: string,
  targetCurrency: Currency
): string {
  // Handle special cases
  if (usdRange === "Let's discuss") {
    return "Let's discuss";
  }
  
  // Extract numbers from range like "$1,000 - $3,000" or "$50,000+"
  const match = usdRange.match(/\$?([\d,]+)(?:\s*-\s*\$?([\d,]+))?(\+)?/);
  
  if (!match) {
    return usdRange; // Return as-is if we can't parse
  }
  
  const minStr = match[1].replace(/,/g, '');
  const minUSD = parseInt(minStr, 10);
  const minConverted = convertCurrency(minUSD, targetCurrency);
  const minFormatted = formatCurrency(minConverted, targetCurrency);
  
  if (match[3]) {
    // Handle "+" case like "$50,000+"
    return `${minFormatted}+`;
  }
  
  if (match[2]) {
    // Handle range case like "$1,000 - $3,000"
    const maxStr = match[2].replace(/,/g, '');
    const maxUSD = parseInt(maxStr, 10);
    const maxConverted = convertCurrency(maxUSD, targetCurrency);
    const maxFormatted = formatCurrency(maxConverted, targetCurrency);
    return `${minFormatted} - ${maxFormatted}`;
  }
  
  return minFormatted;
}

/**
 * Detect country from IP or user input
 * Returns 'Angola', 'South Africa', or 'Other'
 */
export async function detectCountry(): Promise<Country> {
  try {
    // Try to detect country from IP using a free geolocation API
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const countryName = data.country_name || '';
      
      if (countryName.toLowerCase().includes('angola')) {
        return 'Angola';
      } else if (countryName.toLowerCase().includes('south africa')) {
        return 'South Africa';
      }
    }
  } catch (error) {
    console.warn('Failed to detect country from IP:', error);
  }
  
  // Fallback: try browser locale
  try {
    const locale = navigator.language || (navigator as any).userLanguage;
    if (locale.includes('pt-AO') || locale.includes('AO')) {
      return 'Angola';
    } else if (locale.includes('en-ZA') || locale.includes('ZA')) {
      return 'South Africa';
    }
  } catch (error) {
    console.warn('Failed to detect country from locale:', error);
  }
  
  return 'Other';
}

/**
 * Get currency for a country
 */
export function getCurrencyForCountry(country: Country): Currency {
  switch (country) {
    case 'Angola':
      return 'AOA';
    case 'South Africa':
      return 'ZAR';
    case 'Other':
    default:
      return 'USD';
  }
}
