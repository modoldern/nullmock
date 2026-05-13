# 🚀 nullmock

[![English](https://img.shields.io/badge/Language-English-blue.svg)](#)
[![Türkçe](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red.svg)](README-tr.md)
[![Azərbaycanca](https://img.shields.io/badge/Dil-Az%C3%A8rbaycanca-green.svg)](README-az.md)
[![Русский](https://img.shields.io/badge/Язык-Русский-yellow.svg)](README-ru.md)
[![ქართული](https://img.shields.io/badge/ენა-ქართული-orange.svg)](README-ka.md)

A lightning-fast, zero-dependency, file-system-based mock API server with a smart data generation engine.

Nullmock reads your `.json` files, catches dynamic URL routes like `/api/users/[id]`, understands query parameters, and magically generates massive amounts of fake data using built-in dictionaries or intelligent property guessing.

## ✨ Features

- **Zero Dependencies:** Pure Node.js. No `express`, no `faker`, no bloated `node_modules`.
- **File-System Routing:** Folders dictate your API routes (e.g., `mocks/api/users/[id]/GET.json`).
- **Smart Data Engine:** Automatically guesses data types from JSON keys (e.g., generates real dates for `created_at`, emails for `user_email`).
- **Built-in Locales:** Use tags like `{{firstName:en}}` or `{{city:tr}}` to generate realistic localized data.
- **Repeat Directive:** Generate 100 users in a millisecond just by adding `"_repeat": 100` to your template.
- **Library Mode:** Import the engine directly into your Node.js scripts without starting the server.

## 📦 Installation & Quick Start

Run the following command in your project's root directory to generate the scaffolding:

```bash
npx nullmock init
```

This command will construct the following structure:
- `mocks/`: The main folder for your API endpoints.
- `mocks/locales/`: Drop your custom dictionary `.json` files here.
- `mocks/_examples/`: Contains **6 Golden API Templates** to get you started instantly.

*(To skip generating examples, run: `npx nullmock init --no-examples`)*

## 🚦 Starting the Server

**Option 1: Quick Start**
```bash
npx nullmock
```

**Option 2: NPM Scripts (Recommended)**
Add this to your `package.json`:
```json
"scripts": {
  "mock": "nullmock"
}
```
Then run: `npm run mock`

---

## 📂 The 6 Golden Templates (`_examples`)

When you run the `init` command, Nullmock provides 6 industry-standard templates. You can copy/paste these into your API folders:

1. **`1_basic_list.json`**: A simple, flat array of items (useful for categories, countries).
2. **`2_paginated_list.json`**: Standard offset pagination structure (current_page, data, total).
3. **`3_infinite_scroll.json`**: Cursor-based pagination structure (has_more, next_cursor).
4. **`4_single_resource.json`**: A detailed object for a single item (e.g., `/users/60`).
5. **`5_dashboard_overview.json`**: A hybrid structure containing both summary metrics and recent activity arrays.
6. **`6_lazy_auto_mock.json`**: A zero-configuration template. Just write the keys (e.g., `"user_email": ""`), leave values empty, and Nullmock's smart engine will guess and fill them!

---

## 🌍 Built-in Locales & Dictionaries

Nullmock comes with built-in localized data for rapid prototyping. Use the `{{category:lang}}` syntax in your JSON files.

**Supported Built-in Languages:**
- `en` (English)
- `tr` (Turkish)
- `az` (Azerbaijani)
- `ru` (Russian)
- `ka` (Georgian)

**Usage Example:**
```json
{
  "name": "{{firstName:az}} {{lastName:az}}",
  "location": "{{city:tr}}"
}
```

**Custom Dictionaries:**
Want to use your own data? Simply create a `tr.json` or `my_data.json` inside the `mocks/locales/` folder. Nullmock will automatically prioritize your project's dictionaries over the built-in ones.

---

## 🌐 Network Simulation (Delay & Errors)

Test your frontend's loading states and error handling easily. You can simulate network latency and HTTP status codes in two ways:

**1. Via URL Parameters (Dynamic Test)**
No need to change your mock files! Just append parameters to your fetch URL:
- Test loading states: `/api/users?_delay=2000` (Waits 2 seconds)
- Test unauthorized access: `/api/users?_status=401`
- Combine them: `/api/users?_delay=1000&_status=500`

**2. Via JSON Configuration (Permanent)**
Add `_delay` and `_status` directly inside your JSON file. Nullmock will apply them and clean them up before sending the response to the client:
```json
{
  "_status": 404,
  "_delay": 1500,
  "error": "User not found"
}
```

---

## 🔢 Smart Number Ranges

Need random numbers within a specific range for prices, ages, or wallet balances? Use the `{{number:min-max}}` tag anywhere in your strings!

```json
{
  "price": "{{number:10-500}}",
  "age": "{{number:18-65}}"
}
```

---

## 🧠 Using Nullmock as a Library (Import)

You don't have to use Nullmock as a server. You can import its powerful generation engine directly into your backend scripts, tests, or seeders!

```javascript
const { deepScanAndRepeat } = require('nullmock');

const myTemplate = {
  "_repeat": 3,
  "id": "{{id}}",
  "email": "", // Smart guess
  "name": "{{firstName:en}}"
};

// Generate data on the fly! (Passing { id: 10 } as dynamic param)
const fakeData = deepScanAndRepeat(myTemplate, { id: 10 });

console.log(fakeData);
```

## 🤝 Contributing
Contributions are always welcome! Please create your pull requests pointing to the `develop` branch.

## 📄 License
MIT © modoldern