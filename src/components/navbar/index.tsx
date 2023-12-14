"use client";

import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";

interface NavLink {
  url: string;
  title: string;
}

const baseUrl = "https://www.jasonschwarz.xyz";
const LINKS = [
  {
    url: `${baseUrl}/tools`,
    title: "Tools",
  },
  {
    url: `${baseUrl}/projects`,
    title: "Projects",
  },
  {
    url: `${baseUrl}//articles`,
    title: "Articles",
  },
  {
    url: `${baseUrl}/about`,
    title: "About",
  },
];

const Navbar: FC = () => {
  const menuNode = () => {
    const socialLinksNode = () => {
      return (
        <Box display="flex" alignItems="center" fontSize="sm">
          <HStack spacing={4}>
            <Link
              px={4}
              py={2}
              href="https://github.com/passandscore"
              rounded="sm"
              fontSize="sm"
              borderWidth={1}
              borderColor="transparent"
              _hover={{
                textDecoration: "none",
                bgColor: "gray.900",
              }}
              _focus={{ outline: "none" }}
            >
              Github
            </Link>
            <Link
              px={4}
              py={2}
              href="https://www.linkedin.com/in/jason-schwarz-75b91482/"
              rounded="sm"
              fontSize="sm"
              borderWidth={1}
              borderColor="transparent"
              _hover={{
                textDecoration: "none",
                bgColor: "gray.900",
              }}
              _focus={{ outline: "none" }}
            >
              LinkedIn
            </Link>
          </HStack>
        </Box>
      );
    };

    return (
      <HStack
        isInline
        spacing={[0, 4]}
        alignItems="center"
        flexWrap="wrap"
        justifyContent="center"
      >
        {[
          LINKS.map((link: NavLink) => {
            return (
              <Box key={link.url}>
                <Link
                  as={NextLink}
                  px={4}
                  py={2}
                  href={link.url}
                  rounded="sm"
                  fontSize="sm"
                  borderWidth={1}
                  borderColor="transparent"
                  _hover={{
                    textDecoration: "none",
                    bgColor: "gray.900",
                  }}
                  _focus={{ outline: "none" }}
                >
                  {link.title}
                </Link>
              </Box>
            );
          }),
        ]}
        {socialLinksNode()}
      </HStack>
    );
  };

  return (
    <Box as="header" zIndex={1} borderTopWidth={5} borderColor="blue.400">
      <Box mx="auto" px={4}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          py={4}
          flexDir={["column", "column", "row"]}
          gridGap={[4, 4, 0]}
        >
          <Box display="flex" alignItems="center">
            <Link
              href="https://www.jasonschwarz.xyz/"
              display="flex"
              _focus={{ outline: "none" }}
              aria-label="Logo"
              as={NextLink}
              _hover={{
                textDecoration: "none",
              }}
            >
              <Flex
                width={8}
                height={8}
                borderRadius="50%"
                mr={4}
                bg="white"
                color="black"
                // p={3}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text fontSize="xl" fontWeight="900">
                  J
                </Text>
              </Flex>
            </Link>
          </Box>
          {menuNode()}
        </HStack>
      </Box>
    </Box>
  );
};

export default Navbar;
