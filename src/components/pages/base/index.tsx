"use client";

import { Box, Center } from "@chakra-ui/react";

import Header from "src/components/header";
import Instructions from "src/components/instructions";
import MerkleGenerator from "src/components/generator";

const Page = () => {
  return (
    <Center>
      <Box
        mt={10}
        px={5}
        maxW="1300px"
        w="100%"
      >
        <Header />
        <Instructions />
        <MerkleGenerator />
      </Box>
    </Center>
  );
};

export default Page;
