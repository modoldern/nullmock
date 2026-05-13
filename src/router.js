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
      let parsedJson = JSON.parse(fileContent);

      // === NETWORK SIMULATION (Status & Delay) ===
      // 1. Extract from URL (e.g. ?_status=404&_delay=2000)
      const queryStatus = parseInt(parsedUrl.query._status, 10);
      const queryDelay = parseInt(parsedUrl.query._delay, 10);

      let statusCode = queryStatus || 200;
      let delayMs = queryDelay || 0;

      // 2. Extract from JSON config (if present)
      if (parsedJson && typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
        if (parsedJson._status) {
          statusCode = queryStatus || parsedJson._status; // URL always overrides file config
          delete parsedJson._status; // Clean up before sending to client
        }
        if (parsedJson._delay) {
          delayMs = queryDelay || parsedJson._delay; // URL always overrides file config
          delete parsedJson._delay; // Clean up before sending to client
        }
      }

      // Merge dynamic route params ([id]) with query params (?page=2)
      // Exclude _status and _delay from the engine parameters
      const { _status, _delay, ...cleanQueryParams } = parsedUrl.query;
      const allParams = { ...cleanQueryParams, ...matchedRoute.params };

      // Pass the parsed JSON and parameters to our generation engine
      const finalData = deepScanAndRepeat(parsedJson, allParams);

      const sendResponse = () => {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(finalData));
      };

      // Apply simulated network delay
      if (delayMs > 0) {
        setTimeout(sendResponse, delayMs);
      } else {
        sendResponse();
      }

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