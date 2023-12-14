"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"DM Sans", sans-serif',
    body: '"Inter", sans-serif',
    mono: '"Fira Code", monospace',
  },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={customTheme}>
        <Box
          bg="black"
          bgGradient="linear(to-br, gray.900, gray.800)"
          color="gray.200"
          minH="100vh"
          display="flex"
          flexDir="column"
        >
          {children}
        </Box>
      </ChakraProvider>
    </CacheProvider>
  );
};

export default ThemeProvider;
