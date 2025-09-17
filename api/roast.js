import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Please provide a name" });
  }

  // Roast messages load karna
  const filePath = path.join(process.cwd(), "roasts.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const roasts = data.roasts;

  // Random roast select karna
  const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

  // Name replace karna
  const message = randomRoast.replace("{name}", name);

  res.status(200).json({ roast: message });
}
