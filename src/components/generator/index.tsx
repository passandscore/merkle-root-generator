import React, { useCallback, useState, useRef } from "react";
import Papa from "papaparse";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { CSVLink } from "react-csv";
import { Container, useToast } from "@chakra-ui/react";
import { IconCopy } from "@tabler/icons-react";
import { Input, Button, Flex, Text, Box } from "@chakra-ui/react";

export default function Generate() {
  const [generatedMerkleRoot, setGeneratedMerkleRoot] = useState("");
  const [invalidAddresses, setInvalidAddresses] = useState([] as string[]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState(
    [] as string[]
  );

  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const data = invalidAddresses.map((address) => ({ address }));

  const csvReport = {
    data,
    filename: "invalid-addresses.csv",
  };

  const generateMerkleProof = useCallback(async (addresses: string[]) => {
    const leaves = addresses.map((v) => ethers.utils.keccak256(v));
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, {
      sort: true,
    });
    const merkleRoot = tree.getHexRoot();
    return merkleRoot;
  }, []);

  const parsedFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          resolve(results.data.flat(Infinity));
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const createRootHashFromAddressList = async (
    lowercaseFileContent: string[]
  ) => {
    try {
      const root = await generateMerkleProof(lowercaseFileContent);
      setGeneratedMerkleRoot(root);
    } catch (e) {
      console.error(e);
    }
  };

  const removeEmptyCells = (addresses: string[]) => {
    const validAddresses = addresses.filter((address) => address.length > 1);
    return validAddresses;
  };

  const handleAddresses = async (e: any) => {
    const file = e.target.files && e.target.files[0];
    const addresses = (await parsedFile(file)) as string[];

    const nonEmptyAddresses = removeEmptyCells(addresses);

    const lowercaseFileContent = nonEmptyAddresses.map((address) =>
      address.toLowerCase()
    );

    const lastIndexValue =
      lowercaseFileContent[lowercaseFileContent.length - 1];
    if (lastIndexValue.length <= 1) lowercaseFileContent.pop();

    const invalidAddresses = lowercaseFileContent.filter(
      (address) => !ethers.utils.isAddress(address)
    ) as string[];

    if (invalidAddresses.length > 0) {
      setInvalidAddresses(invalidAddresses);
      toast({
        title: "Invalid addresses found in CSV file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setWhitelistedAddresses(lowercaseFileContent);
    createRootHashFromAddressList(lowercaseFileContent);
  };

  const copyRootToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedMerkleRoot));
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const copyAddressesToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(whitelistedAddresses));
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box mx={10}>
      <Flex
        mt={10}
        mx="auto"
        maxW="7xl"
        fontSize="3xl"
        fontWeight="bold"
        color="white"
        justify="space-between"
        align="center"
      >
        <Text>Merkle Root Generator</Text>
        <Flex align="center">
          {/* Star Repo Button */}
          <Button
            size="sm"
            variant={"outline"}
            onClick={() => {
              window.open(
                "https://github.com/passandscore/merkle-root-generator",
                "_blank"
              );
            }}
            fontSize="xs"
            ml={2}
          >
            Star Repository
          </Button>
        </Flex>
      </Flex>

      <Flex
        mx="auto"
        maxW="7xl"
        borderBottom="1px"
        pb={4}
        fontSize="lg"
        justify="space-between"
      >
        <Text color="#4299E1">NFT Whitelists</Text>
      </Flex>

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
      </Text>

      <Box>
        <Box mx="auto">
          {/* inputs */}
          {invalidAddresses.length > 0 ? (
            <Box w="full" mt={20}>
              <Flex justify="center">
                <Button mt={4} px={4} py={2}>
                  <CSVLink {...csvReport}> Download Invalid Addresses</CSVLink>
                </Button>
              </Flex>
              <Text mt={4} fontSize="xl" color="white" textAlign="center">
                Please fix the invalid addresses and try again.
              </Text>

              <Text
                mt={4}
                fontSize="sm"
                color="red"
                textAlign="center"
                cursor="pointer"
                onClick={() => {
                  setInvalidAddresses([]);
                  setGeneratedMerkleRoot("");
                  setWhitelistedAddresses([]);
                  if (inputRef.current) inputRef.current.click();
                }}
              >
                RESET
              </Text>
            </Box>
          ) : (
            <Container maxW="7xl" p={0}>
              <Input
                ref={inputRef}
                type="file"
                variant="outline"
                border="none"
                p={0}
                onChange={(e) => handleAddresses(e)}
              />
            </Container>
          )}

          {/* outputs */}
          {generatedMerkleRoot && invalidAddresses.length === 0 && (
            <Box>
              <Box mx="auto" maxW="7xl">
                <Box mt={10} bg="gray.800" p={3} w="auto" textAlign="center">
                  {generatedMerkleRoot}
                </Box>

                <Flex justify="flex-end" alignItems="center" mt={6} gap={2}>
                  <Text
                    fontSize="sm"
                    color="red"
                    cursor="pointer"
                    mr={2}
                    onClick={() => {
                      setInvalidAddresses([]);
                      setGeneratedMerkleRoot("");
                      setWhitelistedAddresses([]);
                    }}
                  >
                    RESET
                  </Text>
                  <Button onClick={copyRootToClipboard} mr={2}>
                    <IconCopy size={16} />
                    <Text pl={2}>Merkle Root</Text>
                  </Button>
                  <Button onClick={copyAddressesToClipboard}>
                    <IconCopy size={16} />
                    <Text pl={2}>Address Array</Text>
                  </Button>
                </Flex>

                <Text
                  align="right"
                  mt={4}
                >{`${whitelistedAddresses.length} total addresses`}</Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
