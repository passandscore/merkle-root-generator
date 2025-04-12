import { css } from "@emotion/react";
import { PrismTheme } from "prism-react-renderer";

const prismStyles = css`
  .prism-code {
    font-family: "JetBrains Mono", monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
`;

const prismTheme: PrismTheme = {
  plain: {
    color: "#F8F8F2",
    backgroundColor: "#282A36",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#6272A4",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "#F8F8F2",
      },
    },
    {
      types: ["property", "tag", "constant", "symbol", "deleted"],
      style: {
        color: "#FF79C6",
      },
    },
    {
      types: ["boolean", "number"],
      style: {
        color: "#BD93F9",
      },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
      style: {
        color: "#50FA7B",
      },
    },
    {
      types: ["operator", "entity", "url", "variable"],
      style: {
        color: "#F8F8F2",
      },
    },
    {
      types: ["atrule", "attr-value", "function", "class-name"],
      style: {
        color: "#F1FA8C",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "#8BE9FD",
      },
    },
    {
      types: ["regex", "important"],
      style: {
        color: "#FFB86C",
      },
    },
  ],
};

export { prismStyles, prismTheme };
