import csv from "csv/sync";
import fs from "node:fs/promises";
import path from "node:path";
import { csvSchema, type CsvData, gameSchema } from "./schema";
import { parseCompactNumber, includes, parseArray } from "./utils";
import * as process from "process";

// Main function
async function main() {
  // Read CSV file
  const csvString = await fs.readFile(
    path.join(__dirname, "..", "backloggd_games.csv"),
    "utf-8",
  );

  // Parse CSV file
  const rawData = csv.parse(csvString, {
    columns: true,
    cast: true,
    castDate: true,
    toLine: 5000,
  }) as unknown[];

  // Clean data
  const cleanedData: CsvData[] = rawData.flatMap((item) => {
    const parsed = csvSchema.safeParse(item);
    // If data is valid, return it
    if (parsed.success) {
      return parsed.data;
    } else {
      // If data is invalid, skip it
      return [];
    }
  });

  // Transform data
  const data = cleanedData.flatMap((item) => {
    // Parse arrays
    const genres = parseArray(item.Genres);
    const developers = parseArray(item.Developers);

    // Get first genre
    let genre = genres[0];
    // If first genre is "Adventure", get second genre because "Adventure" has a lot
    if (genre === "Adventure" && genres.length > 1) {
      genre = genres[1];
    }

    // Transform date
    const day = item.Release_Date.getDate();
    const month = item.Release_Date.toLocaleString("default", {
      month: "long",
    });
    const year = item.Release_Date.getFullYear();

    // Check if game is available on PC, mobile or console
    const pc = includes(item.Platforms, ["Windows", "Mac", "Linux"])
      ? "Yes"
      : "No";
    const mobile = includes(item.Platforms, ["iOS", "Android"]) ? "Yes" : "No";
    const console = includes(item.Platforms, [
      "Xbox",
      "PlayStation",
      "Nintendo",
      "Wii",
    ])
      ? "Yes"
      : "No";

    // If game is not available on PC, mobile or console, skip it
    if (pc === "No" && mobile === "No" && console === "No") {
      return [];
    }

    // Create game object and validate it
    const game = gameSchema.safeParse({
      Title: item.Title,
      Release_Day: day,
      Release_Month: month,
      Release_Year: year,
      Developer: developers[0],
      PC: pc,
      Mobile: mobile,
      Console: console,
      Genre: genre,
      Rating: parseCompactNumber(item.Rating),
      Plays: parseCompactNumber(item.Plays),
      Wishlist: parseCompactNumber(item.Wishlist),
      Reviews: parseCompactNumber(item.Reviews),
    });
    // If game is valid, return it
    if (game.success) {
      return game.data;
    } else {
      // If game is invalid, skip it
      return [];
    }
  });

  // Convert data to CSV
  const csvOutString = csv.stringify(data, {
    header: true,
  });

  // Write CSV file
  await fs.writeFile(
    path.join(__dirname, "..", "out.csv"),
    csvOutString,
    "utf-8",
  );
}

// Run main function
main()
  .then(() => {
    // Success
    console.log("Done 🎉");
    process.exit(0);
  })
  .catch((err) => {
    // Handle errors
    console.log("Something went wrong 😢");
    console.error(err);
    process.exit(1);
  });
