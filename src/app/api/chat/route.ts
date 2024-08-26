import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: convertToCoreMessages(messages),
    tools: {
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        parameters: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          try {
            return {
              city,
              condition: data.current.condition.text,
              temperature: data.current.temp_c,
            };
          } catch (e) {
            return "Unable to get weather information";
          }
        },
      },
      getExchangeRate: {
        description: "Get the exchange rate between two currencies.",
        parameters: z.object({
          fromCurrency: z.string(),
          toCurrency: z.string(),
        }),
        execute: async ({
          fromCurrency,
          toCurrency,
        }: {
          fromCurrency: string;
          toCurrency: string;
        }) => {
          const apiUrl = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${fromCurrency}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          try {
            const result = data.conversion_rates[toCurrency];
            return {
              fromCurrency,
              toCurrency,
              rate: result,
            };
          } catch (e) {
            return "Unable to get exchange rate";
          }
        },
      },
      calculator: {
        description: "A simple calculator tool.",
        parameters: z.object({
          expression: z.string(),
        }),
        execute: async ({ expression }: { expression: string }) => {
          try {
            const result = eval(expression);
            return result;
          } catch (e) {
            return "Invalid expression";
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
