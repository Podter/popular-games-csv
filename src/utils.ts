// Turn a string like "1.2M" into a number
export function parseCompactNumber(input: string | number) {
  if (typeof input === "number") {
    return input;
  }

  const regex = /^(\d*\.?\d+)([KMB]*)$/;
  const matches = input.match(regex);

  if (!matches) {
    return NaN;
  }

  const [, numericPart, unit] = matches;
  let multiplier = 1;

  if (unit === "K") {
    multiplier = 1000;
  } else if (unit === "M") {
    multiplier = 1000000;
  } else if (unit === "B") {
    multiplier = 1000000000;
  }

  return parseFloat(numericPart ?? "") * multiplier;
}

// Turn a string like "['Adventure', 'Indie']" into an array of strings
export function parseArray(string: string) {
  return Array.from(string.matchAll(/'([^']+)'/g)).map(([, match]) => match);
}

// Check if a string includes any of the search strings
export function includes(string: string, search: string[]) {
  return search.some((s) => string.includes(s));
}
