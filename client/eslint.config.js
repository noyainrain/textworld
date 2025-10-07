import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  // TODO recommended eslint config
  js.configs.recommended,
  // https://prettier.io/docs/rationale
  stylistic.configs.customize({ braceStyle: "1tbs", semi: true, quotes: "double" }),
  // rules: {
  //     "@stylistic/max-len": ["error", { code: 100 }],
  // },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
      // OQ globals?
    },
    rules: {
      // Handled by TypeScript
      "no-undef": "off",
    },
  },
]);
