import React, { useCallback, useState, useRef } from "react";
import Papa from "papaparse";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { CSVLink } from "react-csv";
import { Container, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { IconCopy, IconUpload, IconSitemap, IconPlant2, IconList, IconArrowLeft } from "@tabler/icons-react";
import { Input, Button, Flex, Text, Box } from "@chakra-ui/react";
import { useWindowSize } from "usehooks-ts";
import { mobileBreakpoint, invalidAddressesOutputFilename } from "config";

export default function Generate() {
  const [generatedMerkleRoot, setGeneratedMerkleRoot] = useState("");
  const [generatedMerkleProof, setGeneratedMerkleProof] = useState("");
  const [proofAddress, setProofAddress] = useState("");
  const [invalidAddresses, setInvalidAddresses] = useState([] as string[]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([] as string[]);
  const [merkleTree, setMerkleTree] = useState<MerkleTree | null>(null);
  const [selectedAction, setSelectedAction] = useState<'root' | 'proof' | null>(null);
  const [isProofCopied, setIsProofCopied] = useState(false);
  const [isRootCopied, setIsRootCopied] = useState(false);
  const [isAddressesCopied, setIsAddressesCopied] = useState(false);

  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const { width } = useWindowSize();

  const data = invalidAddresses.map((address) => ({ address }));
  const isMobile = width < mobileBreakpoint;

  const csvReport = {
    data,
    filename: invalidAddressesOutputFilename,
  };

  const generateMerkleTree = useCallback((addresses: string[]) => {
    const leaves = addresses.map((v) => ethers.utils.keccak256(v));
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, {
      sort: true,
    });
    return tree;
  }, []);

  const generateMerkleRoot = useCallback((tree: MerkleTree) => {
    return tree.getHexRoot();
  }, []);

  const generateProof = useCallback((address: string) => {
    if (!merkleTree || !ethers.utils.isAddress(address)) return null;
    const leaf = ethers.utils.keccak256(address.toLowerCase());
    return merkleTree.getHexProof(leaf);
  }, [merkleTree]);

  const parsedFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          const cleanedAddresses = Array.from(new Set(
            results.data
              .flat(Infinity)
              .map((item: unknown) => (item || "").toString().trim().toLowerCase())
              .filter(item => item.length > 0)
          ));
          
          resolve(cleanedAddresses);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const createRootHashFromAddressList = async (addresses: string[]) => {
    try {
      const tree = generateMerkleTree(addresses);
      const root = generateMerkleRoot(tree);
      setMerkleTree(tree);
      setGeneratedMerkleRoot(root);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddresses = async (e: any) => {
    const file = e.target.files && e.target.files[0];
    const addresses = (await parsedFile(file)) as string[];

    const invalidAddresses = addresses.filter(
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
    
    setWhitelistedAddresses(addresses);
    createRootHashFromAddressList(addresses);
  };

  const handleProofGeneration = () => {
    if (!proofAddress || !merkleTree) {
      toast({
        title: "Please provide an address and upload a valid CSV first",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const proof = generateProof(proofAddress);
    if (!proof) {
      toast({
        title: "Address not found in merkle tree",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    navigator.clipboard.writeText(JSON.stringify(proof));
    setGeneratedMerkleProof(JSON.stringify(proof));
    setIsProofCopied(true);
    toast({
      title: "Proof copied!",
      description: "Check your clipboard for the Merkle proof",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    setTimeout(() => {
      setIsProofCopied(false);
    }, 2000);
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

  const copyProofToClipboard = () => {
    navigator.clipboard.writeText(generatedMerkleProof);
    toast({
      title: "Proof copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const resetAll = () => {
    setInvalidAddresses([]);
    setGeneratedMerkleRoot("");
    setGeneratedMerkleProof("");
    setWhitelistedAddresses([]);
    setProofAddress("");
    setMerkleTree(null);
    setSelectedAction(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const renderContent = () => {
    if (invalidAddresses.length > 0) {
      return (
        <Box w="full" mt={8}>
          <Flex justify="center">
            <Button mt={4} px={4} py={2}>
              <CSVLink {...csvReport}>Download Invalid Addresses</CSVLink>
            </Button>
          </Flex>
          <Text mt={4} fontSize="xl" color="white" textAlign="center">
            Please fix the invalid addresses and try again.
          </Text>
          <Text
            mt={4}
            fontSize="sm"
            color="red.400"
            textAlign="center"
            cursor="pointer"
            onClick={resetAll}
          >
            RESET
          </Text>
        </Box>
      );
    }

    if (!merkleTree) {
      return (
        <Box
          position="relative"
          border="1px dashed"
          borderColor="gray.600"
          borderRadius="md"
          p={8}
          cursor="pointer"
          _hover={{ bg: "gray.800" }}
        >
          <Input
            ref={inputRef}
            type="file"
            accept=".csv"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            cursor="pointer"
            aria-hidden="true"
            onChange={(e) => {
              handleAddresses(e);
              e.target.value = '';
            }}
          />
          <Flex align="center" justify="center" direction="column">
            <IconUpload size={32} stroke={1.5} />
            <Text mt={4} fontSize="lg">Upload CSV</Text>
            <Text mt={2} fontSize="sm" color="gray.400">Upload your allowlist addresses</Text>
          </Flex>
        </Box>
      );
    }

    if (!selectedAction) {
      return (
        <Box mt={8}>
          <Flex gap={6} justify="center" wrap="wrap">
            <Button
              size="lg"
              variant="outline"
              colorScheme={isRootCopied ? "green" : "blue"}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(generatedMerkleRoot));
                setIsRootCopied(true);
                toast({
                  title: "Root copied!",
                  description: "Check your clipboard for the Merkle root",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                  position: "top",
                });
                setTimeout(() => {
                  setIsRootCopied(false);
                }, 2000);
              }}
              height="80px"
              width="200px"
              display="flex"
              flexDirection="column"
              gap={2}
              _hover={{ bg: "blue.900" }}
            >
              <IconPlant2 size={32} stroke={1.5} />
              <Text>{isRootCopied ? "Root Copied!" : "Generate Root"}</Text>
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="blue"
              onClick={() => setSelectedAction('proof')}
              height="80px"
              width="200px"
              display="flex"
              flexDirection="column"
              gap={2}
              _hover={{ bg: "blue.900" }}
            >
              <IconSitemap size={32} stroke={1.5} />
              <Text>Generate Proof</Text>
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme={isAddressesCopied ? "green" : "blue"}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(whitelistedAddresses));
                setIsAddressesCopied(true);
                toast({
                  title: "Addresses copied!",
                  description: "Check your clipboard for the address list",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                  position: "top",
                });
                setTimeout(() => {
                  setIsAddressesCopied(false);
                }, 2000);
              }}
              height="80px"
              width="200px"
              display="flex"
              flexDirection="column"
              gap={2}
              _hover={{ bg: "blue.900" }}
            >
              <IconList size={32} stroke={1.5} />
              <Text>{isAddressesCopied ? "Addresses Copied!" : "Copy Addresses"}</Text>
            </Button>
          </Flex>
          <Flex justify="center" mt={6}>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={resetAll}
              leftIcon={<IconUpload size={16} />}
            >
              Upload Different CSV
            </Button>
          </Flex>
          <Text align="center" mt={4} color="gray.400">
            {`${whitelistedAddresses.length} addresses loaded`}
          </Text>
        </Box>
      );
    }

    return (
      <Box mt={20}>
        <Box>
          <Flex justify="end" mb={6}>
            <Button
              onClick={() => setSelectedAction(null)}
              size="md"
              variant="outline"
              leftIcon={<IconArrowLeft size={16} />}
              color="gray.400"
              borderColor="gray.700"
              _hover={{ bg: "gray.800" }}
            >
              Back to Options
            </Button>
          </Flex>
          <Input
            placeholder="Enter Ethereum address (0x...)"
            value={proofAddress}
            onChange={(e) => setProofAddress(e.target.value)}
            size="lg"
          />
          <Flex gap={2} mt={4}>
           
            <Button 
              onClick={handleProofGeneration}
              isDisabled={!proofAddress}
              w="full"
              colorScheme={isProofCopied ? "green" : "blue"}
              size="lg"
            >
              {isProofCopied ? "Proof Copied To Clipboard!" : "Generate Proof"}
            </Button>
          </Flex>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box mx="auto" mb={10}>
        <Container maxW="7xl" p={0}>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}
