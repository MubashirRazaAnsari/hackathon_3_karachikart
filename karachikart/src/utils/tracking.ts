import { client } from '@/sanity/lib/client';

export async function generateTrackingNumber(): Promise<string> {
  const generateNumber = () => {
    const prefix = '00'; // DHL prefix
    const randomDigits = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, '0');
    
    // Calculate check digit using DHL algorithm
    const digits = (prefix + randomDigits).split('').map(Number);
    const sum = digits.reduce(
      (acc, digit, i) => acc + digit * (i % 2 ? 3 : 1),
      0
    );
    const checkDigit = ((10 - (sum % 10)) % 10).toString();

    return prefix + randomDigits + checkDigit;
  };

  // Keep generating until we find a unique number
  let trackingNumber: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5; // Prevent infinite loops

  while (!isUnique && attempts < maxAttempts) {
    trackingNumber = generateNumber();
    
    // Check if this number exists in Sanity
    const existingOrder = await client.fetch(
      `*[_type == "order" && trackingNumber == $trackingNumber][0]`,
      { trackingNumber }
    );

    if (!existingOrder) {
      isUnique = true;
      return trackingNumber;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique tracking number');
} 