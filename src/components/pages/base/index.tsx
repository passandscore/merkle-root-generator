"use client";

import { Box } from "@chakra-ui/react";

import Header from "src/components/header";
import Instructions from "src/components/instructions";
import MerkleGenerator from "src/components/generator/index";

const Page = () => {
  return (
    <Box mt={10} px={5}>
      <Header />
      <Instructions />
      <MerkleGenerator />
    </Box>
  );
};

export default Page;
