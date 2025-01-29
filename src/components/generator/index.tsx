import React, { useCallback, useState, useRef } from "react";
import Papa from "papaparse";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { CSVLink } from "react-csv";
import { Container, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { IconCopy, IconUpload, IconSitemap, IconPlant2, IconList, IconArrowLeft } from "@tabler/icons-react";
import { Input, Button, Flex, Text, Box } from "@chakra-ui/react";
import { useWindowSize } from "usehooks-ts";
import { mobileBreakpoint, invalidAddressesOutputFilename } from "config";
import { ProofModal } from "./components/ProofModal";
import { UploadCSV } from "./components/UploadCSV";
import { ExportInvalidButton } from "./components/ExportInvalidButton";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withQuotes, setWithQuotes] = useState(false);

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
    try {
      const file = e.target.files && e.target.files[0];
      const addresses = (await parsedFile(file)) as string[];

      // Check for invalid addresses
      const invalidAddressesList = addresses.filter(
        (address) => !ethers.utils.isAddress(address)
      );

      // Set invalid addresses if any found
      if (invalidAddressesList.length > 0) {
        setInvalidAddresses(invalidAddressesList);
        toast({
          title: `${invalidAddressesList.length} invalid addresses found`,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }

      // Filter out invalid addresses
      const validAddresses = addresses.filter(address => ethers.utils.isAddress(address));
      setWhitelistedAddresses(validAddresses);
      createRootHashFromAddressList(validAddresses);
      
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Error processing file",
        description: "Please check your CSV file format and try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleProofGeneration = () => {
    if (!proofAddress || !merkleTree) {
      toast({
        title: "Please provide an address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Check if address exists in whitelist
    const normalizedAddress = proofAddress.toLowerCase();
    if (!whitelistedAddresses.includes(normalizedAddress)) {
      toast({
        title: "Address not found",
        description: "The provided address is not in the allowlist",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const proof = generateProof(proofAddress);
    if (!proof) {
      toast({
        title: "Error generating proof",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const formattedProof = withQuotes ? 
      JSON.stringify(proof) : 
      JSON.stringify(proof).replace(/"/g, '');

    navigator.clipboard.writeText(formattedProof);
    setGeneratedMerkleProof(formattedProof);
    setIsProofCopied(true);
    setProofAddress("");
    setIsModalOpen(false);
    
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
        <UploadCSV 
          onUpload={handleAddresses}
        />
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
              colorScheme={isProofCopied ? "green" : "blue"}
              onClick={() => setIsModalOpen(true)}
              height="80px"
              width="200px"
              display="flex"
              flexDirection="column"
              gap={2}
              _hover={{ bg: "blue.900" }}
            >
              <IconSitemap size={32} stroke={1.5} />
              <Text>{isProofCopied ? "Proof Copied!" : "Generate Proof"}</Text>
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
            {invalidAddresses.length > 0 && (
              <ExportInvalidButton 
                onClick={() => {
                  const csvContent = invalidAddresses.join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'invalid-addresses.csv';
                  a.click();
                }}
                invalidCount={invalidAddresses.length}
              />
            )}
          </Flex>
          <Flex 
            justify="space-between" 
            align="center" 
            mt={8} 
            borderTop="1px" 
            borderColor="gray.700" 
            pt={4}
          >
            <Text color="gray.400">
              {`${whitelistedAddresses.length} addresses loaded`}
            </Text>
            <Button
              size="sm"
              variant="ghost"
              color="gray.400"
              leftIcon={<IconUpload size={16} />}
              onClick={resetAll}
              _hover={{ color: "red.400" }}
            >
              Upload Different CSV
            </Button>
          </Flex>

          <ProofModal 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setProofAddress("");
            }}
            proofAddress={proofAddress}
            onAddressChange={(value) => setProofAddress(value)}
            onGenerate={handleProofGeneration}
            withQuotes={withQuotes}
            onQuotesChange={setWithQuotes}
          />
        </Box>
      );
    }

    return (
      <Box>
        <Box mx="auto" mb={10}>
          <Container maxW="7xl" p={0}>
            {renderContent()}
          </Container>
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
