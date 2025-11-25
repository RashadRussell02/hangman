const express = require("express");
const cors = require("cors");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DynamoDB Local
const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000" // VERY IMPORTANT
});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE = "Players";

// POST → Create a new player
app.post("/players", async (req, res) => {
  try {
    const { playerName } = req.body;
    if (!playerName) return res.status(400).json({ error: "playerName is required" });

    await ddb.send(new PutCommand({
      TableName: TABLE,
      Item: { playerName, wins: 0, losses: 0 },
      ConditionExpression: "attribute_not_exists(playerName)"
    }));
    res.status(201).json({ playerName, wins: 0, losses: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET → Retrieve a player
app.get("/players", async (req, res) => {
  try {
    const { playerName } = req.query;
    if (!playerName) return res.status(400).json({ error: "playerName is required" });

    const result = await ddb.send(new GetCommand({
      TableName: TABLE,
      Key: { playerName }
    }));
    if (!result.Item) return res.status(404).json({ error: "Player not found" });

    res.json(result.Item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT → Update wins and losses
app.put("/players", async (req, res) => {
  try {
    const { playerName, wins, losses } = req.body;
    if (!playerName) return res.status(400).json({ error: "playerName is required" });

    const updatedPlayer = await ddb.send(new UpdateCommand({
      TableName: TABLE,
      Key: { playerName },
      UpdateExpression: "SET wins = :w, losses = :l",
      ExpressionAttributeValues: { ":w": wins, ":l": losses },
      ReturnValues: "ALL_NEW"
    }));

    res.json(updatedPlayer.Attributes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the API Server
const PORT = 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
