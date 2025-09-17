import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const name = (req.query.name || "Friend").toString().trim();

  try {
    const filePath = path.join(process.cwd(), "roasts.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const roasts = Array.isArray(data.roasts) ? data.roasts : [];

    if (roasts.length === 0) {
      return res.status(500).json({ error: "No roasts found in roasts.json" });
    }

    const roast = roasts[Math.floor(Math.random() * roasts.length)].replace(/\{name\}/gi, name);

    return res.status(200).json({ roast });
  } catch (err) {
    console.error("Error reading roasts.json:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
