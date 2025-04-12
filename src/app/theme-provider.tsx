"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"JetBrains Mono", monospace',
    body: '"JetBrains Mono", monospace',
    mono: '"JetBrains Mono", monospace',
  },
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80c9ff',
      300: '#4db2ff',
      400: '#1a9bff',
      500: '#0084e6',
      600: '#0066b3',
      700: '#004d80',
      800: '#00334d',
      900: '#001a26',
    },
    tech: {
      primary: '#7B68EE', // Medium slate blue
      secondary: '#00CED1', // Dark turquoise
      accent: '#FF6B6B', // Coral red
      background: '#1A1B26', // Dark navy
      surface: '#24283B', // Slightly lighter navy
      text: '#A9B1D6', // Light blue-gray
      highlight: '#BB9AF7', // Light purple
    }
  },
  styles: {
    global: {
      body: {
        bg: 'tech.background',
        color: 'tech.text',
        fontFamily: '"JetBrains Mono", monospace',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: '"JetBrains Mono", monospace',
      },
      variants: {
        outline: {
          border: '1px solid',
          borderColor: 'tech.primary',
          color: 'tech.primary',
          _hover: {
            bg: 'tech.primary',
            color: 'tech.background',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Text: {
      baseStyle: {
        fontFamily: '"JetBrains Mono", monospace',
      },
    },
  },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={customTheme}>
        <Box
          bg="tech.background"
          bgGradient="linear(to-br, tech.background, tech.surface)"
          color="tech.text"
          minH="100vh"
          display="flex"
          flexDir="column"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(187, 154, 247, 0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        >
          {children}
        </Box>
      </ChakraProvider>
    </CacheProvider>
  );
};

export default ThemeProvider;
