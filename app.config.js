export default {
  expo: {
    name: "HAAL",
    slug: "haal",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],

    ios: {
      bundleIdentifier: "com.mayasha.haal"
    },

    android: {
      package: "com.mayasha.haal"
    },

    web: {
      bundler: "metro"
    },

    extra: {
      apiKey:
        process.env.NODE_ENV === "development"
          ? process.env.EXPO_PUBLIC_LLM_API_KEY
          : undefined
    }
  }
};
