import { Text } from "@chakra-ui/react";

const Instructions = () => {
  return (
    <>
      <Text mx="auto" maxW="7xl" pt={4}>
        - The addresses need to be uploaded as a CSV file.
      </Text>
      <Text mx="auto" maxW="7xl">
        - The CSV file should only contain the addresses. No empty rows or
        columns❗️
      </Text>
      <Text mx="auto" maxW="7xl" pb={4}>
        - The Merkle root will be generated automatically.
      </Text>
      <Text mx="auto" mb={5} maxW="7xl" borderBottom="1px" pt={2} pb={3}>
        With the provided merkle root, you can submit it to your smart contract.
        Only valid whitelisted addresses will be able to mint the NFT.
      </Text>{" "}
    </>
  );
};

export default Instructions;
