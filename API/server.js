import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server working");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "http://localhost:5678/webhook/product-agent",
      { message }
    );

    console.log("N8N RESPONSE:", response.data);

    res.json({
      reply: response.data.reply || response.data.output || "No response",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});