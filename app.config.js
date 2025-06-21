// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "SkateRadar",
    slug: "skateradar",
    plugins: ["expo-router"],
    extra: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
  },
};
