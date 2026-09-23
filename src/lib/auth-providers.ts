export const authProviders = [
  {
    id: "google",
    label: "Google",
    envPrefix: "GOOGLE",
    console: "https://console.cloud.google.com/apis/credentials",
    emulator: { callback: "/api/emulate/google/o/oauth2/v2/auth/callback", field: "email" },
  },
  {
    id: "github",
    label: "GitHub",
    envPrefix: "GITHUB",
    console: "https://github.com/settings/developers",
    emulator: { callback: "/api/emulate/github/login/oauth/callback", field: "login" },
  },
] as const;

export const authConfigPath = "lib/auth/server.ts";

export const authEnvKeys = authProviders.flatMap((provider) => [
  `${provider.envPrefix}_CLIENT_ID`,
  `${provider.envPrefix}_CLIENT_SECRET`,
]);
