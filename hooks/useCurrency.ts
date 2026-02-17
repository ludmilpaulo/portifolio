"use client";

import { useState, useEffect } from 'react';
import { Currency, Country, detectCountry, getCurrencyForCountry, formatCurrency, convertCurrency, getCurrencySymbol } from '@/lib/currency';

export function useCurrency() {
  const [currencyCode, setCurrencyCode] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect location on mount
    detectCountry().then((country: Country) => {
      const currency = getCurrencyForCountry(country);
      setCurrencyCode(currency);
      setIsLoading(false);
    }).catch(() => {
      setCurrencyCode('USD');
      setIsLoading(false);
    });
  }, []);

  return {
    currencyCode,
    format: (amountUSD: number) => formatCurrency(convertCurrency(amountUSD, currencyCode), currencyCode),
    convert: (amountUSD: number) => convertCurrency(amountUSD, currencyCode),
    symbol: getCurrencySymbol(currencyCode),
    setCurrency: setCurrencyCode,
    isLoading,
  };
}
