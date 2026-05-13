const fs = require("fs");
const path = require("path");

// DICTIONARY CACHE (Keeps locales in RAM to avoid redundant file reads)
const localesCache = {};

// LOCALE READER (Checks user project first, then built-in package)
function getLocaleData(lang) {
  if (localesCache[lang]) return localesCache[lang];

  // 1. USER'S PROJECT: (e.g. current_project/mocks/locales/es.json)
  const userLocalesPath = path.join(
    process.cwd(),
    "mocks",
    "locales",
    `${lang}.json`,
  );

  // 2. BUILT-IN PACKAGE: (node_modules/nullmock/src/locales/tr.json)
  const internalLocalesPath = path.join(__dirname, "locales", `${lang}.json`);

  try {
    // Prioritize user's custom dictionary if it exists
    if (fs.existsSync(userLocalesPath)) {
      localesCache[lang] = JSON.parse(
        fs.readFileSync(userLocalesPath, "utf-8"),
      );
      return localesCache[lang];
    }
    // Fallback to built-in dictionaries
    else if (fs.existsSync(internalLocalesPath)) {
      localesCache[lang] = JSON.parse(
        fs.readFileSync(internalLocalesPath, "utf-8"),
      );
      return localesCache[lang];
    }
  } catch (e) {
    // Silently skip if file is missing or corrupted
  }

  return null;
}

// RANDOM WORD PICKER (e.g. firstName, tr)
function getRandomFromLocale(category, lang = "en") {
  const localeData = getLocaleData(lang) || getLocaleData("en"); // Fallback to English
  if (
    localeData &&
    localeData[category] &&
    Array.isArray(localeData[category])
  ) {
    const list = localeData[category];
    return list[Math.floor(Math.random() * list.length)];
  }
  return null;
}

// === MAGIC STRING PROCESSOR ===
function processString(str, params) {
  if (typeof str !== "string") return str;

  // 1. Smart Number Range Engine (e.g. "{{number:10-500}}" -> returns real Number)
  const numMatch = str.match(/^\{\{number:(\d+)-(\d+)\}\}$/);
  if (numMatch) {
    const min = parseInt(numMatch[1], 10);
    const max = parseInt(numMatch[2], 10);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let replacedStr = str;

  // 2. Direct Parameter Injection (e.g. "{{id}}" -> 60)
  for (const [pKey, pVal] of Object.entries(params)) {
    if (replacedStr === `{{${pKey}}}`) {
      return isNaN(pVal) ? pVal : Number(pVal);
    }
  }

  // 3. Inline Parameter Replacement (e.g. "Url: /user/{{id}}")
  for (const [pKey, pVal] of Object.entries(params)) {
    replacedStr = replacedStr.split(`{{${pKey}}}`).join(pVal);
  }

  // 4. Dictionary Tag Replacement (e.g. "{{firstName:tr}}" or "{{city:az}}")
  const dictRegex = /\{\{([a-zA-Z]+)(?::([a-zA-Z]{2}))?\}\}/g;

  replacedStr = replacedStr.replace(dictRegex, (match, category, lang) => {
    const resolvedLang = lang || "en";
    const randomWord = getRandomFromLocale(category, resolvedLang);
    return randomWord !== null ? randomWord : match; // Keep tag if not found
  });

  return replacedStr;
}

// === TEMPLATE GENERATOR ENGINE ===
function generateFromTemplate(template, index, params = {}) {
  const item = {};
  for (const [key, rawValue] of Object.entries(template)) {
    if (key === "_repeat") continue;

    let value = rawValue;

    // Process all magic strings (Params & Locales)
    if (typeof value === "string") {
      const processed = processString(value, params);

      // Skip smart guessing if string was modified by magic tags
      if (processed !== value) {
        item[key] = processed;
        continue;
      }
    }

    // === SMART GUESSING (Fallback logic for empty templates) ===
    const lowerKey = key.toLowerCase();

    if (lowerKey === "id" || lowerKey.includes("_id")) {
      item[key] = index;
    } else if (lowerKey.includes("email")) {
      item[key] =
        `user${index}_${Math.floor(Math.random() * 1000)}@example.com`;
    } else if (lowerKey.includes("name") || lowerKey.includes("surname")) {
      const names = [
        "Ahmet",
        "Mehmet",
        "Ayşe",
        "Fatma",
        "John",
        "Jane",
        "Ali",
        "Elena",
      ];
      item[key] = `${names[Math.floor(Math.random() * names.length)]} ${index}`;
    } else if (
      lowerKey.includes("avatar") ||
      lowerKey.includes("image") ||
      lowerKey.includes("url")
    ) {
      item[key] = `https://i.pravatar.cc/150?u=${index}`;
    } else if (
      lowerKey.includes("date") ||
      lowerKey.includes("created_at") ||
      lowerKey.includes("updated_at")
    ) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      item[key] = date.toISOString();
    } else if (typeof value === "object" && value !== null) {
      item[key] = deepScanAndRepeat(value, params);
    } else if (typeof value === "number") {
      const variance = value > 0 ? value * 0.5 : 100;
      item[key] = Number(
        (value + (Math.random() * variance - variance / 2)).toFixed(2),
      );
    } else if (typeof value === "boolean") {
      item[key] = Math.random() > 0.5;
    } else if (typeof value === "string") {
      if (
        lowerKey.includes("status") ||
        lowerKey.includes("code") ||
        lowerKey.includes("currency") ||
        lowerKey.includes("bank") ||
        lowerKey.includes("reference")
      ) {
        item[key] = value;
      } else {
        item[key] = `${value} ${index}`;
      }
    } else {
      item[key] = value;
    }
  }
  return item;
}

// === RECURSIVE ENGINE ===
function deepScanAndRepeat(data, params = {}) {
  if (Array.isArray(data)) {
    // TEMPLATE POOL LOGIC: If the first item has _repeat, mix and generate!
    if (
      data.length > 0 &&
      typeof data[0] === "object" &&
      data[0] !== null &&
      "_repeat" in data[0]
    ) {
      const count = data[0]._repeat;
      const generatedArray = [];

      // Prepare clean templates by removing _repeat
      const templates = data.map((item) => {
        if (typeof item === "object" && item !== null) {
          const cleanItem = { ...item };
          delete cleanItem._repeat;
          return cleanItem;
        }
        return item;
      });

      // Randomly select a template and generate
      for (let i = 1; i <= count; i++) {
        const randomTemplate =
          templates[Math.floor(Math.random() * templates.length)];
        generatedArray.push(generateFromTemplate(randomTemplate, i, params));
      }
      return generatedArray;
    }

    // Standard array mapping
    return data.map((item) => deepScanAndRepeat(item, params));
  } else if (typeof data === "object" && data !== null) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = deepScanAndRepeat(value, params);
    }
    return result;
  } else if (typeof data === "string") {
    return processString(data, params);
  }

  return data;
}

module.exports = {
  deepScanAndRepeat,
};
