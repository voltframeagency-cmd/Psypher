import { NextResponse } from "next/server";
import { generateDeepReport } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();
    
    if (!answers) {
      return NextResponse.json({ error: "No answers provided" }, { status: 400 });
    }

    const report = await generateDeepReport(answers);
    
    return NextResponse.json({ report });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
