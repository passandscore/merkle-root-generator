import { Text, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";

const Instructions = () => {
  return (
    <Box maxW="7xl" mx="auto" my={5}>
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton px={0} borderBottom="1px" borderColor="gray.700">
            <Box flex="1" textAlign="left">
              <Text fontSize="lg" color="gray.200">
                What is this tool for?
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} color="gray.400">
            This tool helps create and verify allowlists for NFT smart contracts using Merkle trees.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <AccordionButton px={0} borderBottom="1px" borderColor="gray.700">
            <Box flex="1" textAlign="left">
              <Text fontSize="lg" color="gray.200">
                Why use Merkle trees?
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} color="gray.400">
            A Merkle tree allows you to efficiently prove that an address is part of an allowlist without storing the entire list on-chain, saving gas costs.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <AccordionButton px={0} borderBottom="1px" borderColor="gray.700">
            <Box flex="1" textAlign="left">
              <Text fontSize="lg" color="gray.200">
                What can I do with this tool?
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} color="gray.400">
            <Text mb={4}>You can perform two operations:</Text>
            <Text pl={4} mb={2}>
              1. Generate a Merkle Root to deploy with your smart contract
            </Text>
            <Text pl={4}>
              2. Generate a Merkle Proof for an address to verify they're on the allowlist
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <AccordionButton px={0} borderBottom="1px" borderColor="gray.700">
            <Box flex="1" textAlign="left">
              <Text fontSize="lg" color="gray.200">
                How do I use it?
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} color="gray.400">
            Simply upload your CSV file containing Ethereum addresses, and choose which operation you need.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default Instructions;
