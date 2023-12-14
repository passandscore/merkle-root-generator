import React, { useCallback, useState, useRef } from "react";
import Papa from "papaparse";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { CSVLink } from "react-csv";
import { Container, useToast } from "@chakra-ui/react";
import { IconCopy } from "@tabler/icons-react";
import { Input, Button, Flex, Text, Box } from "@chakra-ui/react";
import { useWindowSize } from "usehooks-ts";
import { mobileBreakpoint, invalidAddressesOutputFilename } from "config";

export default function Generate() {
  const [generatedMerkleRoot, setGeneratedMerkleRoot] = useState("");
  const [invalidAddresses, setInvalidAddresses] = useState([] as string[]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState(
    [] as string[]
  );

  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const { width } = useWindowSize();

  const data = invalidAddresses.map((address) => ({ address }));
  const isMobile = width < mobileBreakpoint;

  const csvReport = {
    data,
    filename: invalidAddressesOutputFilename,
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
        position: "top",
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
      position: "top",
    });
  };

  const copyAddressesToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(whitelistedAddresses));
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <>
      <Box>
        <Box mx="auto" mb={10}>
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

                  <Button onClick={copyRootToClipboard} mr={2} size="sm">
                    {!isMobile && <IconCopy size={16} />}
                    <Text pl={!isMobile ? 2 : 0}>Merkle Root</Text>
                  </Button>

                  <Button onClick={copyAddressesToClipboard} size="sm">
                    {!isMobile && <IconCopy size={16} />}
                    <Text pl={!isMobile ? 2 : 0}>Address Array</Text>
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
    </>
  );
}
