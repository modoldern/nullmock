const fs = require("fs");
const path = require("path");
const url = require("url");

const MOCK_DIR = path.join(process.cwd(), "mocks");

// Resolves dynamic folder paths like [id] by reading the URL step by step
function resolveMockPath(urlPath, method) {
  const segments = urlPath.split("/").filter(Boolean);
  let currentPath = MOCK_DIR;
  let params = {}; // e.g. { id: "145" }

  for (const segment of segments) {
    const exactPath = path.join(currentPath, segment);

    // 1. Check for exact folder match (e.g. /api/users)
    if (fs.existsSync(exactPath) && fs.statSync(exactPath).isDirectory()) {
      currentPath = exactPath;
    } else {
      // 2. If no exact match, look for a dynamic folder like "[param]"
      const dirs = fs.existsSync(currentPath)
        ? fs.readdirSync(currentPath, { withFileTypes: true })
        : [];
      const dynamicDir = dirs.find(
        (d) =>
          d.isDirectory() && d.name.startsWith("[") && d.name.endsWith("]"),
      );

      if (dynamicDir) {
        currentPath = path.join(currentPath, dynamicDir.name);
        const paramName = dynamicDir.name.slice(1, -1); // "[id]" -> "id"
        params[paramName] = segment; // { id: "145" }
      } else {
        return null; // Route mismatch
      }
    }
  }

  // Look strictly for the .json file
  const jsonFile = path.join(currentPath, `${method}.json`);
  if (fs.existsSync(jsonFile)) return { file: jsonFile, params };

  return null;
}

module.exports = (req, res) => {
  // Extract query parameters (?page=2) from the URL
  const parsedUrl = url.parse(req.url, true);
  const cleanUrl = parsedUrl.pathname === "/" ? "" : parsedUrl.pathname;

  const matchedRoute = resolveMockPath(cleanUrl, req.method);

  if (matchedRoute) {
    try {
      const { deepScanAndRepeat } = require("./utils");
      const fileContent = fs.readFileSync(matchedRoute.file, "utf-8");
      const parsedJson = JSON.parse(fileContent);

      // Merge dynamic route params ([id]) with query params (?page=2)
      const allParams = { ...parsedUrl.query, ...matchedRoute.params };

      // Pass the parsed JSON and parameters to our generation engine
      const finalData = deepScanAndRepeat(parsedJson, allParams);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(finalData));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Server/File Error", detail: error.message }),
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Mock not found",
        message: `Please create a mocks${cleanUrl}/${req.method}.json file.`,
      }),
    );
  }
};