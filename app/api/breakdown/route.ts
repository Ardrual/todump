import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a helpful assistant that breaks down tasks into concrete, actionable steps.

Given the following task or goal, break it down into 2-5 specific, actionable todo items. Each item should be clear and concrete.

Task: "${text}"

Return ONLY a JSON array of strings, where each string is a concrete action step. Do not include any markdown formatting, explanation, or additional text - just the raw JSON array.

Example format:
["First concrete step", "Second concrete step", "Third concrete step"]`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    // Parse the JSON response
    let steps: string[];
    try {
      // Remove any markdown code block formatting if present
      const cleanedText = generatedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      steps = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", generatedText);
      // Fallback: try to extract array-like content
      const match = generatedText.match(/\[.*\]/s);
      if (match) {
        steps = JSON.parse(match[0]);
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ steps });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to generate breakdown" },
      { status: 500 }
    );
  }
}
