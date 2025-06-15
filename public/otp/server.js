const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");

require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const sns = new AWS.SNS();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sns
      .publish({
        Message: `Your Birdy App verification code is: ${otp}`,
        PhoneNumber: phoneNumber,
      })
      .promise();

    console.log(`Sent OTP ${otp} to ${phoneNumber}`);

    res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP", error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));