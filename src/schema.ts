import * as z from "zod";

// CSV schema
export const csvSchema = z.object({
  Title: z.string(),
  Release_Date: z.date(),
  Developers: z.string(),
  Summary: z.string(),
  Platforms: z.string(),
  Genres: z.string(),
  Rating: z.union([z.string(), z.number()]),
  Plays: z.union([z.string(), z.number()]),
  Playing: z.union([z.string(), z.number()]),
  Backlogs: z.union([z.string(), z.number()]),
  Wishlist: z.union([z.string(), z.number()]),
  Lists: z.union([z.string(), z.number()]),
  Reviews: z.union([z.string(), z.number()]),
});
export type CsvData = z.infer<typeof csvSchema>;

// Game object schema
export const gameSchema = z.object({
  Title: z.string(),
  Release_Day: z.number(),
  Release_Month: z.string(),
  Release_Year: z.number(),
  Developer: z.string(),
  PC: z.enum(["Yes", "No"]),
  Mobile: z.enum(["Yes", "No"]),
  Console: z.enum(["Yes", "No"]),
  Genre: z.string(),
  Rating: z.number(),
  Plays: z.number(),
  Wishlist: z.number(),
  Reviews: z.number(),
});
export type GameSchema = z.infer<typeof gameSchema>;
