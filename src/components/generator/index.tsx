import React, { useCallback, useState, useRef } from "react";
import Papa from "papaparse";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { CSVLink } from "react-csv";
import { Container, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, RadioGroup, Radio, Stack, Text as ChakraText } from "@chakra-ui/react";
import { IconCopy, IconUpload, IconSitemap, IconPlant2, IconList, IconArrowLeft, IconCoins } from "@tabler/icons-react";
import { Input, Button, Flex, Text, Box } from "@chakra-ui/react";
import { useWindowSize } from "usehooks-ts";
import { mobileBreakpoint, invalidAddressesOutputFilename } from "config";
import { ProofModal } from "./components/ProofModal";
import { UploadCSV } from "./components/UploadCSV";
import { ExportInvalidButton } from "./components/ExportInvalidButton";

type AllowlistMode = 'nft' | 'airdrop';

interface AllowlistEntry {
  address: string;
  value?: string; // in wei for airdrops
}

export default function Generate() {
  const [generatedMerkleRoot, setGeneratedMerkleRoot] = useState("");
  const [generatedMerkleProof, setGeneratedMerkleProof] = useState("");
  const [proofAddress, setProofAddress] = useState("");
  const [invalidAddresses, setInvalidAddresses] = useState([] as string[]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([] as string[]);
  const [allowlistEntries, setAllowlistEntries] = useState<AllowlistEntry[]>([]);
  const [merkleTree, setMerkleTree] = useState<MerkleTree | null>(null);
  const [selectedAction, setSelectedAction] = useState<'root' | 'proof' | null>(null);
  const [isProofCopied, setIsProofCopied] = useState(false);
  const [isRootCopied, setIsRootCopied] = useState(false);
  const [isAddressesCopied, setIsAddressesCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withQuotes, setWithQuotes] = useState(false);
  const [numberOfDuplicates, setNumberOfDuplicates] = useState(0);
  const [initialAddresses, setInitialAddresses] = useState(0);
  const [allowlistMode, setAllowlistMode] = useState<AllowlistMode>('nft');

  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const { width } = useWindowSize();

  const data = invalidAddresses.map((address) => ({ address }));
  const isMobile = width < mobileBreakpoint;

  const csvReport = {
    data,
    filename: invalidAddressesOutputFilename,
  };

  const generateMerkleTree = useCallback((entries: AllowlistEntry[]) => {
    if (allowlistMode === 'airdrop') {
      // Sort entries by address (like the reference code)
      const sortedEntries = [...entries].sort((a, b) => 
        a.address.toLowerCase().localeCompare(b.address.toLowerCase())
      );
      
      const leaves = sortedEntries.map((entry) => {
        if (entry.value) {
          const checksummedAddress = ethers.utils.getAddress(entry.address);
          const packed = ethers.utils.solidityPack(['address', 'uint256'], [checksummedAddress, entry.value]);
          return ethers.utils.keccak256(packed);
        } else {
          return ethers.utils.keccak256(entry.address);
        }
      });
      
      const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sortPairs: true });
      return tree;
    } else {
      // For NFT whitelist, keep existing behavior
      const leaves = entries.map((entry) => ethers.utils.keccak256(entry.address));
      const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sort: true });
      return tree;
    }
  }, [allowlistMode]);

  const generateMerkleRoot = useCallback((tree: MerkleTree) => {
    return tree.getHexRoot();
  }, []);

  const generateProof = useCallback((address: string, value?: string) => {
    if (!merkleTree || !ethers.utils.isAddress(address)) return null;
    
    let leaf: string;
    if (allowlistMode === 'airdrop' && value) {
      const checksummedAddress = ethers.utils.getAddress(address.toLowerCase());
      const packed = ethers.utils.solidityPack(['address', 'uint256'], [checksummedAddress, value]);
      leaf = ethers.utils.keccak256(packed);
    } else {
      leaf = ethers.utils.keccak256(address.toLowerCase());
    }
    
    return merkleTree.getHexProof(leaf);
  }, [merkleTree, allowlistMode]);

  const parsedFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          setInitialAddresses(results.data.length);
          
          if (allowlistMode === 'airdrop') {
            // For airdrops, expect two columns: address, amount
            const entries: AllowlistEntry[] = [];
            const seenAddresses = new Set<string>();
            let duplicates = 0;
            
            results.data.forEach((row: any[]) => {
              const address = (row[0] || "").toString().trim();
              const amount = (row[1] || "").toString().trim();
              
              if (address.length > 0) {
                // Clean address format like reference code
                const cleanAddress = address.split(/[;,]/)[0].toLowerCase().trim();
                
                if (seenAddresses.has(cleanAddress)) {
                  duplicates++;
                } else {
                  seenAddresses.add(cleanAddress);
                  
                  // Convert ETH amount to wei like reference code
                  let amountInWei: string;
                  try {
                    amountInWei = ethers.utils.parseEther(amount).toString();
                    entries.push({ address: cleanAddress, value: amountInWei });
                  } catch (error) {
                    console.warn(`Invalid amount format for address ${cleanAddress}: ${amount}`);
                    // Skip invalid amounts
                  }
                }
              }
            });
            
            setNumberOfDuplicates(duplicates);
            resolve(entries);
          } else {
            // For NFT whitelist, expect single column: address
            const addressesWithoutDuplicates = Array.from(new Set(
              results.data
                .flat(Infinity)
                .map((item: unknown) => (item || "").toString().trim().toLowerCase())
                .filter(item => item.length > 0)
            ));

            const numberOfDuplicates = results.data.length - addressesWithoutDuplicates.length;
            setNumberOfDuplicates(numberOfDuplicates);
            
            const entries: AllowlistEntry[] = addressesWithoutDuplicates.map(addr => ({ address: addr as string }));
            resolve(entries);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const createRootHashFromAddressList = async (entries: AllowlistEntry[]) => {
    try {
      const tree = generateMerkleTree(entries);
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
      const entries = (await parsedFile(file)) as AllowlistEntry[];

      // Check for invalid addresses
      const invalidAddressesList = entries.filter(
        (entry) => !ethers.utils.isAddress(entry.address)
      ).map(entry => entry.address);

      // For airdrops, validation is already done in parsedFile
      // No need for additional value validation since we convert ETH to wei

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
      const validEntries = entries.filter(entry => ethers.utils.isAddress(entry.address));
      setAllowlistEntries(validEntries);
      setWhitelistedAddresses(validEntries.map(entry => entry.address));
      createRootHashFromAddressList(validEntries);
      
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

    // Check if address exists in allowlist
    const normalizedAddress = proofAddress.toLowerCase();
    const entry = allowlistEntries.find(entry => entry.address === normalizedAddress);
    
    if (!entry) {
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

    const proof = generateProof(proofAddress, entry.value);
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
    setAllowlistEntries([]);
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
        <Box>
          <Box mb={10}>
            <ChakraText fontSize="lg" color="gray.200" mb={3}>
              Select Allowlist Type:
            </ChakraText>
            <RadioGroup value={allowlistMode} onChange={(value: AllowlistMode) => setAllowlistMode(value)}>
              <Stack direction="row" spacing={6}>
                <Radio value="nft" colorScheme="blue">
                  <ChakraText color="gray.300">NFT Whitelist</ChakraText>
                </Radio>
                <Radio value="airdrop" colorScheme="blue">
                  <ChakraText color="gray.300">Airdrop Allowlist</ChakraText>
                </Radio>
              </Stack>
            </RadioGroup>
            <ChakraText fontSize="sm" color="gray.400" mt={2}>
              {allowlistMode === 'nft' 
                ? "Upload a CSV with Ethereum addresses (one per line)"
                : "Upload a CSV with Ethereum addresses and values in wei (two columns: address, value)"
              }
            </ChakraText>
          </Box>
          <UploadCSV 
            onUpload={handleAddresses}
            mode={allowlistMode}
          />
        </Box>
      );
    }

    if (!selectedAction) {
      return (
        <Box mt={20}>
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
                const dataToCopy = allowlistMode === 'airdrop' 
                  ? allowlistEntries.map(entry => ({ address: entry.address, value: entry.value }))
                  : whitelistedAddresses;
                navigator.clipboard.writeText(JSON.stringify(dataToCopy));
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
              {allowlistMode === 'airdrop' ? <IconCoins size={32} stroke={1.5} /> : <IconList size={32} stroke={1.5} />}
              <Text>{isAddressesCopied ? "Data Copied!" : allowlistMode === 'airdrop' ? "Copy Data" : "Copy Addresses"}</Text>
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
            <Flex direction="column">
              <Text color="gray.400">
                {`${initialAddresses} entries loaded`}
              </Text>
              <Text color="gray.400">
                {`${numberOfDuplicates} duplicates found`}
              </Text>
              <Text color="gray.400">
                {`${initialAddresses - numberOfDuplicates} unique entries`}
              </Text>
              <Text color="gray.400">
                {`Mode: ${allowlistMode === 'nft' ? 'NFT Whitelist' : 'Airdrop Allowlist'}`}
              </Text>
            </Flex>
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
            mode={allowlistMode}
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
