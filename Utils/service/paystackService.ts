import axios from "axios";
import { config } from "dotenv";
config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Ensure you have this in your environment variables
const PAYSTACK_BASE_URL = "https://api.paystack.co";

const paystackService = {
  initializePayment: async (amount: number, email: string) => {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        amount,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response)
    return response.data;

  },

  verifyPayment: async (reference: string) => {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  },
};

export default paystackService;
