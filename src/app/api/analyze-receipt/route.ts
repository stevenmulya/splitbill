import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format for Gemini API
    const imageParts = [
      {
        inlineData: {
          data: imageBase64.split(',')[1] || imageBase64, // Remove data:image/jpeg;base64, prefix if present
          mimeType: "image/jpeg"
        }
      }
    ];

    const prompt = `You are an expert receipt parser. Extract all the food/drink items and their prices from this receipt image. 
    CRITICAL RULE FOR QUANTITIES: If an item has a quantity greater than 1 (e.g., "4 Lemongrass Tea 116.000"), you MUST split it into separate individual objects in the JSON array, each representing ONE unit, and calculate the unit price (Total Price / Quantity). For example, return 4 separate objects of {"name": "Lemongrass Tea", "price": 29000}. Do NOT include the quantity number in the name string.
    Also calculate the total of all taxes (like PB1, VAT) and service charges into a single integer.
    Ignore subtotals, totals, headers, footers, and addresses.
    Return ONLY a valid JSON object. Do not use markdown blocks like \`\`\`json.
    The object must have exactly this structure:
    {
      "items": [
        {
          "name": string (the name of the item, without quantity numbers),
          "price": number (the integer price for ONE unit, remove all currency symbols and separators)
        }
      ],
      "taxAndService": number (the integer sum of all taxes and service charges, 0 if none found)
    }`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Clean JSON response if it contains markdown formatting
    let cleanJsonStr = text.trim();
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanJsonStr);

    if (parsedData.items && Array.isArray(parsedData.items)) {
      parsedData.items = parsedData.items.filter((item: any) => item.price > 0);
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 });
  }
}
