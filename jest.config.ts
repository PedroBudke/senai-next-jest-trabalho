import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/app/**/page.tsx",
    "!src/app/**/layout.tsx",
    "!src/app/api/logout/**",
    "!src/app/api/tasks/**",
    "!src/app/dashboard/**",
    "!src/app/login/**",
    "!src/components/providers/**",
    "!src/services/firebase.ts",
    "!src/services/tasks/task.repository.ts",
    "!src/services/tasks/task.types.ts",
    "!src/services/auth/auth.types.ts",
    "!src/services/auth/session.edge.ts",
    "!src/services/auth/session.service.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  transformIgnorePatterns: [
  "/node_modules/(?!(msw|@mswjs|until-async)/)",
],
};

export default createJestConfig(config);