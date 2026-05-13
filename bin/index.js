#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const path = require("path");
const router = require("../src/router"); // Import the brain (router)

// CRITICAL FOR DOCKER: Bind to 0.0.0.0 instead of just localhost
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

// Catch terminal commands and flags
const args = process.argv.slice(2);
const command = args[0];

// === INIT COMMAND ===
if (command === "init") {
  const skipExamples = args.includes("--no-examples");
  const mocksDir = path.join(process.cwd(), "mocks");

  console.log("🏗️  Building nullmock project skeleton...\n");

  // 1. Create main mocks directory
  if (!fs.existsSync(mocksDir)) {
    fs.mkdirSync(mocksDir);
    console.log('✅ "mocks/" directory created.');
  } else {
    console.log('ℹ️  "mocks/" directory already exists.');
  }

  // 2. Create locales directory for user's custom dictionaries
  const localesDir = path.join(mocksDir, "locales");
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir);
    console.log(
      '✅ "mocks/locales/" directory created. (For your custom dictionaries)',
    );
  }

  // 3. Create examples directory (unless --no-examples is provided)
  if (!skipExamples) {
    const examplesDir = path.join(mocksDir, "_examples");
    if (!fs.existsSync(examplesDir)) {
      fs.mkdirSync(examplesDir);

      // Write 6 Golden Templates
      const templates = {
        "1_basic_list.json":
          '[\n  {\n    "_repeat": 10,\n    "id": "{{id}}",\n    "code": "USD",\n    "name": "{{word:en}}",\n    "is_active": true\n  }\n]',
        "2_paginated_list.json":
          '{\n  "current_page": 1,\n  "data": [\n    {\n      "_repeat": 15,\n      "id": "{{id}}",\n      "full_name": "{{firstName:en}} {{lastName:en}}",\n      "email": "{{firstName:en}}@example.com",\n      "status": "ACTIVE"\n    }\n  ],\n  "last_page": 5,\n  "total": 75\n}',
        "3_infinite_scroll.json":
          '{\n  "data": [\n    {\n      "_repeat": 20,\n      "id": "{{id}}",\n      "title": "{{word:en}} {{word:en}}",\n      "created_at": "2026-05-13T10:00:00Z"\n    }\n  ],\n  "meta": { "has_more": true }\n}',
        "4_single_resource.json":
          '{\n  "id": "{{id}}",\n  "profile": {\n    "first_name": "{{firstName:en}}",\n    "last_name": "{{lastName:en}}"\n  },\n  "contact": {\n    "email": "{{firstName:en}}@company.com"\n  }\n}',
        "5_dashboard_overview.json":
          '{\n  "summary": {\n    "total_balance": 45000.50,\n    "active_orders": 12\n  },\n  "recent_activity": [\n    {\n      "_repeat": 5,\n      "log_id": "{{id}}",\n      "action": "LOGIN",\n      "timestamp": "2026-05-13T10:49:12Z"\n    }\n  ]\n}',
        "6_lazy_auto_mock.json":
          '[\n  {\n    "_repeat": 5,\n    "id": 0,\n    "full_name": "",\n    "user_email": "",\n    "avatar_url": "",\n    "created_at": "",\n    "is_active": false,\n    "balance": 100\n  }\n]',
      };

      for (const [fileName, content] of Object.entries(templates)) {
        fs.writeFileSync(path.join(examplesDir, fileName), content);
      }
      console.log(
        '✅ "mocks/_examples/" directory and 6 standard templates added.',
      );
    } else {
      console.log('ℹ️  "mocks/_examples/" directory already exists.');
    }
  } else {
    console.log(
      "⏭️  --no-examples flag detected, skipping examples directory.",
    );
  }

  console.log(
    "\n🎉 Setup Successful! You have two ways to start your mock server:\n",
  );

  console.log("👉 Option 1 (Quick Start via NPX):");
  console.log("   npx nullmock\n");

  console.log("👉 Option 2 (For NPM Script Users):");
  console.log('   Add this to your package.json "scripts":');
  console.log('   "mock": "nullmock"');
  console.log("   Then simply run:");
  console.log("   npm run mock\n");

  process.exit(0); // Exit after setup
}

// === START SERVER (DEFAULT COMMAND) ===
const server = http.createServer((req, res) => {
  // Standard CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests quickly
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Pass the request to the router
  router(req, res);
});

// Listen on 0.0.0.0 for Docker compatibility
server.listen(PORT, HOST, () => {
  console.log(`\n🚀 nullmock server is active at http://localhost:${PORT}`);
  console.log(`👀 Watching for changes in ./mocks directory...\n`);
});
