import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, temperature } = await req.json();
    const tempNum = Number(temperature) || 0.7;

    let dynamicSystemPrompt = "You are a cool and fun personal stylist.";
    if (tempNum <= 0.4) {
      dynamicSystemPrompt = "You are a ruthless, sarcastic, and extremely strict fashion critic without filters. Destroy bad outfits with fierce irony.";
    } else if (tempNum <= 0.9) {
      dynamicSystemPrompt = "You are a friendly, cool, enthusiastic yet honest personal stylist who gives great style advice.";
    } else {
      dynamicSystemPrompt = "You are a crazy, eccentric, and avant-garde haute couture creative director. Speak in abstract, bold, and futuristic concepts.";
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
