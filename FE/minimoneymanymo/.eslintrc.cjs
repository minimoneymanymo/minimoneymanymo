module.exports = {
  parser: "@typescript-eslint/parser", // TypeScript 파서 사용
  extends: [
    "eslint:recommended", // 기본 ESLint 규칙
    "plugin:@typescript-eslint/recommended", // TypeScript 추천 규칙
    "plugin:react/recommended", // React 추천 규칙
    "plugin:react-hooks/recommended", // React Hooks 규칙
    "plugin:prettier/recommended", // Prettier 통합
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  settings: {
    react: {
      version: "detect", // React 버전 자동 감지
    },
  },
  rules: {
    "no-console": "off", // console 사용 가능하도록 설정 (선택 사항)
    "@typescript-eslint/no-unused-vars": "off", // 사용하지 않는 변수 경고
    "react/prop-types": "off", // PropTypes 검사 비활성화
    "react/react-in-jsx-scope": "off", // React 17 이상에서는 import React 필요 없음
    "react/jsx-uses-react": "off", // JSX에서 React 사용 여부 검사 해제
    "prettier/prettier": [
      "error",
      {
        bracketSpacing: true,
        endOfLine: "auto",
      },
    ],
    "prefer-const": "off",
  },
  parserOptions: {
    ecmaVersion: 2020, // 최신 ECMAScript 기능 사용
    sourceType: "module", // 모듈 사용
    ecmaFeatures: {
      jsx: true, // JSX 지원
    },
  },
  env: {
    browser: true, // 브라우저 환경
    node: true, // Node.js 환경 추가
  },
}
