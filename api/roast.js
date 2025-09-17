import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // CORS (optional)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Accept ?name= or ?n= ; if missing use "$" so root shows "$, ..." like your screenshot
  const q = req.query || {};
  const name = (q.name || q.n || "$").toString().trim(); // default "$"

  try {
    const filePath = path.join(process.cwd(), "roasts.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    const roasts = Array.isArray(data.roasts) ? data.roasts : [];

    if (roasts.length === 0) {
      return res.status(500).json({ error: "No roasts found in roasts.json" });
    }

    // pick random roast
    const random = roasts[Math.floor(Math.random() * roasts.length)];

    // Replace placeholder {name} (case-insensitive) and also replace a literal "$" placeholder if present
    let roast = random.replace(/\{name\}/gi, name);
    // If the roast contains literal "$" meaning "show name right at start", replace it as well:
    roast = roast.replace(/\$/g, name);

    return res.status(200).json({ roast });
  } catch (err) {
    console.error("Error reading roasts.json:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
