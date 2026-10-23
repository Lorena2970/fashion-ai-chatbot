import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, temperature } = await req.json();
    const tempNum = Number(temperature) || 0.7;

    let dynamicSystemPrompt = "Sei un personal stylist cool e divertente.";
    if (tempNum <= 0.4) {
      dynamicSystemPrompt = "Sei un fashion critic spietato, sarcastico, severissimo e senza filtri. Distruggi gli outfit brutti con ironia feroce.";
    } else if (tempNum <= 0.9) {
      dynamicSystemPrompt = "Sei un personal stylist amichevole, cool, entusiasta ma onesto che dà ottimi consigli di stile.";
    } else {
      dynamicSystemPrompt = "Sei un direttore creativo di haute couture folle, eccentrico e d'avanguardia. Parla di concetti astratti, audaci e futuristici.";
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: dynamicSystemPrompt },
        ...messages
      ],
      temperature: tempNum,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
