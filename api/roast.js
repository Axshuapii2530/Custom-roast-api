import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const name = (req.query.name || "").toString().trim();
  if (!name) {
    return res.status(400).json({ error: "Please provide a name query param, e.g. ?name=Amn" });
  }

  try {
    const filePath = path.join(process.cwd(), "roasts.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    const roasts = Array.isArray(data.roasts) ? data.roasts : [];

    if (roasts.length === 0) {
      return res.status(500).json({ error: "No roasts found in roasts.json" });
    }

    // Random roast pick karo
    const random = roasts[Math.floor(Math.random() * roasts.length)];
    const roast = random.replace(/\{name\}/gi, name);

    return res.status(200).json({ roast });
  } catch (err) {
    console.error("Error loading roasts.json:", err);
    return res.status(500).json({ error: "Server error loading roasts" });
  }
}
