import style, { GLOB_JS, GLOB_TSX, GLOB_YAML } from "@isentinel/eslint-config";

import prettierrc from "./.prettierrc.config.ts";

export default style(
  {
    formatters: {
      markdown: true,
      prettierOptions: prettierrc,
      toml: true,
    },
    gitignore: true,
    markdown: true,
    react: true,
    rules: {
      "perfectionist/sort-objects": [
        "warn",
        {
          "custom-groups": {
            id: "id",
            name: "name",
            ga: "progressionStatus",
            "react-props": ["children", "ref"],
            reflex: ["loadPlayerData", "closePlayerData"],
          },
          groups: ["id", "name", "reflex", "ga", "unknown", "react-props"],
          order: "asc",
          "partition-by-comment": "Part:**",
          type: "natural",
        },
      ],
      "ts/no-magic-numbers": "off",
      "ts/no-unsafe-assignment": "off",
      "ts/no-unsafe-call": "off",
      "ts/no-unsafe-member-access": "off",
      curly: ["error", "multi"],
      "max-lines-per-function": ["warn", 200],
	  "ts/no-unused-vars": ["error", { argsIgnorePattern: "world|state|contextEntity", varsIgnorePattern: "_s" }],
    },
    toml: true,
    typescript: {
      parserOptions: {
        ecmaVersion: 2018,
        jsx: true,
        project: "tsconfig.build.json",
        sourceType: "module",
        useJSXTextNode: true,
      },
      tsconfigPath: "tsconfig.build.json",
    },
  },
  {
    ignores: [GLOB_JS, "sourcemap.json"],
  },
  {
    files: [GLOB_TSX],
    rules: {
      "ts/no-magic-numbers": "off",
      "ts/no-unsafe-call": "off",
      "ts/no-unsafe-assignment": "off",
    },
  },
  {
    files: [GLOB_YAML],
    rules: {
      "comment-length/limit-multi-line-comments": "off",
    },
  }
);