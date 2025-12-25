import { GoogleGenAI } from "@google/genai";

// Vite використовує import.meta.env замість process.env
// Змінні повинні починатися з VITE_
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export type GreetingTheme = 'magic' | 'cozy' | 'hope' | 'spiritual';

const THEME_PROMPTS: Record<GreetingTheme, string> = {
  magic: 'акцент на дивах, магії, зірках, казковості, срібному сяйві',
  cozy: 'акцент на родинному затишку, теплі каміна, запаху хвої, спокої, чашці чаю',
  hope: 'акцент на надії, нових починаннях, світанку, силі духу, перемозі світла',
  spiritual: 'акцент на сакральному змісті, янгольських голосах, вічності, благодаті'
};

export const generateChristmasGreeting = async (theme: GreetingTheme = 'magic'): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API key is not configured");
    }

    const model = 'gemini-3-flash-preview';
    const prompt = `
      Напиши красиве, глибоке та завершене привітання з Різдвом Христовим 2026 року українською мовою.
      
      Тема: ${THEME_PROMPTS[theme]}.
      
      Вимоги:
      1. Стиль: високохудожня проза, емоційно, поетично.
      2. Обсяг: 4-6 речень. Текст повинен бути розгорнутим.
      3. Без звертання до конкретної особи (універсальне).
      4. Уникай банальностей та канцеляризмів. Використовуй яскраві, свіжі метафори.
      5. ВАЖЛИВО: Переконайся, що думка завершена і текст не обривається на півслові.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 1.1,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    });

    return response.text?.trim() || "Нехай різдвяна зірка осяє ваш шлях світлом надії та любові, даруючи віру у дива, що неодмінно здійсняться...";
  } catch (error) {
    console.error("Error generating greeting:", error);
    return "У тихій зимовій ночі, коли сніг вкриває землю срібним килимом, нехай у вашому серці народиться світло. Бажаю миру, що глибший за океан, і радості, що яскравіша за першу зірку. Нехай це Різдво 2026 року стане початком найщасливішої сторінки вашого життя!";
  }
};
