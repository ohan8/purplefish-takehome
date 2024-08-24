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
          const apiUrl = `http://api.weatherapi.com/v1/current.json?key=f6ec78455c844bbd85423853242308&q=${city}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          try {
            const result = `The weather in ${city} is ${data.current.condition.text} with a temperature of ${data.current.temp_c} degrees Celsius.`;
            return result;
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
          const apiUrl = `https://v6.exchangerate-api.com/v6/d149992d92240b8ee69b8ce9/latest/${fromCurrency}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          try {
            const result = data.conversion_rates[toCurrency];
            return result;
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
      // // client-side tool that starts user interaction:
      // askForConfirmation: {
      //   description: "Ask the user for confirmation.",
      //   parameters: z.object({
      //     message: z.string().describe("The message to ask for confirmation."),
      //   }),
      // },
      // // client-side tool that is automatically executed on the client:
      // getLocation: {
      //   description:
      //     "Get the user location. Always ask for confirmation before using this tool.",
      //   parameters: z.object({}),
      // },
    },
  });

  return result.toDataStreamResponse();
}
