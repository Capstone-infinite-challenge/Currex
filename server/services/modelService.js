import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const PREDICTION_API_URL = "http://localhost:8000/predict";

export const predictCurrency = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(PREDICTION_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Prediction Error:", error);
    return { error: "Failed to predict currency" };
  }
};
