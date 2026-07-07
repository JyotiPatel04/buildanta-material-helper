import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Buildanta Material Helper",
  },
});

export async function POST(request) {
  try {
    const { material } = await request.json();

    if (!material || material.trim() === "") {
      return Response.json(
        { error: "Please enter a construction material name." },
        { status: 400 }
      );
    }

    const input = material.trim().toLowerCase();

    const constructionKeywords = [
      "cement", "tmt", "bar", "steel", "sand", "brick", "bricks",
      "tile", "tiles", "marble", "granite", "aggregate", "stone",
      "concrete", "block", "blocks", "putty", "pop", "paint",
      "primer", "waterproofing", "plywood", "door", "window",
      "glass", "wire", "cable", "switch", "socket", "mcb",
      "pipe", "tank", "tap", "basin", "fitting", "roofing",
      "sheet", "beam", "angle", "channel"
    ];

    const isConstructionMaterial = constructionKeywords.some((keyword) =>
      input.includes(keyword)
    );

    if (!isConstructionMaterial) {
      return Response.json(
        {
          error:
            "Please enter a valid construction material, such as cement, TMT bar, tiles, bricks, sand, paint, wire, or pipe.",
        },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "You are a construction material advisor. Answer only with exactly 3 short numbered points. Do not explain your thinking. Do not write extra paragraphs.",
        },
        {
          role: "user",
          content: `Give exactly 3 practical things a first-time homeowner in Kanpur should check before buying ${material}.`,
        },
      ],
      max_tokens: 220,
      temperature: 0,
    });

    return Response.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenRouter API Error:", error);

    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}