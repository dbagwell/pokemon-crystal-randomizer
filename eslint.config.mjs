import js from "@eslint/js"
import htmlEslint from "@html-eslint/eslint-plugin"
import htmlParser from "@html-eslint/parser"
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import { defineConfig, globalIgnores } from "eslint/config"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import svelte from "eslint-plugin-svelte"
import globals from "globals"
import svelteParser from "svelte-eslint-parser"
import typescriptEslint from "typescript-eslint"

export default defineConfig([
  js.configs.recommended,
  typescriptEslint.configs.recommended,
  svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        project: true,
        extraFileExtensions: [".svelte", ".json"],
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "simple-import-sort": simpleImportSort,
      "@html-eslint": htmlEslint,
    },
    rules: {
      "@html-eslint/indent": ["error", 2],
      "@html-eslint/lowercase": "error",
      "@html-eslint/no-extra-spacing-attrs": ["error", {
        disallowMissing: true,
      }],
      "@html-eslint/no-multiple-empty-lines": "error",
      "@html-eslint/no-trailing-spaces": "error",
      "@html-eslint/sort-attrs": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "array-bracket-newline": ["error", "consistent"],
      "array-bracket-spacing": "error",
      "array-element-newline": ["error", "consistent"],
      "arrow-body-style": ["error", "always"],
      "arrow-parens": "error",
      "arrow-spacing": "error",
      "block-spacing": "error",
      "brace-style": ["error", "1tbs", {
        allowSingleLine: true,
      }],
      "comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
      }],
      "comma-spacing": "error",
      "comma-style": "error",
      "computed-property-spacing": "error",
      "curly": "error",
      "dot-location": ["error", "property"],
      "eol-last": ["error", "never"],
      "eqeqeq": "error",
      "func-call-spacing": "error",
      "function-call-argument-newline": ["error", "consistent"],
      "function-paren-newline": "error",
      "implicit-arrow-linebreak": "error",
      "indent": ["error", 2],
      "key-spacing": "error",
      "keyword-spacing": "error",
      "linebreak-style": "error",
      "new-parens": "error",
      "no-extra-parens": "error",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["error", {
        max: 1,
      }],
      "no-param-reassign": "error",

      "no-trailing-spaces": ["error", {
        skipBlankLines: true,
      }],
      "no-var": "error",
      "no-whitespace-before-property": "error",
      "object-curly-newline": "error",
      "object-curly-spacing": ["error", "always"],
      "object-property-newline": ["error", {
        allowAllPropertiesOnSameLine: true,
      }],
      "padded-blocks": ["error", {
        blocks: "never",
        classes: "always",
        switches: "never",
      }, {
        allowSingleLineBlocks: true,
      }],
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "quote-props": ["error", "consistent-as-needed"],
      "quotes": "error",
      "semi": ["error", "never"],
      "simple-import-sort/imports": "error",
      "space-before-blocks": "error",
      "space-before-function-paren": ["error", {
        anonymous: "never",
        named: "never",
        asyncArrow: "always",
      }],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "svelte/first-attribute-linebreak": "error",
      "svelte/html-closing-bracket-spacing": ["error", {
        selfClosingTag: "never",
      }],
      "svelte/html-quotes": ["error", {
        prefer: "double",
      }],
      "svelte/indent": ["error", {
        indent: 2,
        switchCase: 0,
      }],
      "svelte/max-attributes-per-line": "error",
      "svelte/mustache-spacing": "error",
      "svelte/no-extra-reactive-curlies": "error",
      "svelte/no-spaces-around-equal-signs-in-attribute": "error",
      "svelte/no-unused-svelte-ignore": "off",
      "svelte/prefer-style-directive": "error",
      "svelte/shorthand-attribute": ["error", {
        prefer: "never",
      }],
      "svelte/shorthand-directive": ["error", {
        prefer: "never",
      }],
      "svelte/sort-attributes": "error",
      "svelte/spaced-html-comment": ["error", "always"],
      "switch-colon-spacing": "error",
      "template-curly-spacing": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.svelte"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["**/*.json"],
    rules: {
      "quote-props": ["error", "consistent"],
      "comma-dangle": ["error", "never"],
    },
  },
  {
    ...htmlEslint.configs["flat/recommended"],
    files: ["**/*.html"],
    languageOptions: {
      parser: htmlParser,
    },
  },
  {
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
    files: ["**/*.svelte"],
    rules: {
      "no-useless-assignment": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  globalIgnores([
    // ignore everthing
    "**/*",
    // except these file types at the root level
    "!.eslint.config.mjs",
    "!*.json",
    "!*.js",
    "!*.cjs",
    "!*.mjs",
    "!*.ts",
    "!*.svelte",
    "!*.html",
    "!*.css",
    "!*.scss",
    // and anywhere inside these directories
    "!docs",
    "!docs/*",
    "!docs/**/*",
    "!src",
    "!src/*/",
    "!src/**/*",
    "!tools",
    "!tools/*/",
    "!tools/**/*",
    // unless they are generated files
    "**/*-lock.json",
    "src/renderer/css/*",
    "src/main/lib/grammars/*",
    "src/shared/typeValidators/*",
    "tools/build/*",
    "tools/output/*",
    // or tsconfig files
    "**/*tsconfig.json",
  ]),
])