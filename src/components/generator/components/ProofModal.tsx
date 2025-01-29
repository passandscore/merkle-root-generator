import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Checkbox,
  VStack,
} from "@chakra-ui/react";

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofAddress: string;
  onAddressChange: (value: string) => void;
  onGenerate: () => void;
  withQuotes?: boolean;
  onQuotesChange?: (value: boolean) => void;
}

export const ProofModal = ({
  isOpen,
  onClose,
  proofAddress,
  onAddressChange,
  onGenerate,
  withQuotes = false,
  onQuotesChange,
}: ProofModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>Generate Merkle Proof</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Enter Ethereum address (0x...)"
              value={proofAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              size="md"
            />
            <Checkbox
              isChecked={withQuotes}
              onChange={(e) => onQuotesChange?.(e.target.checked)}
              colorScheme="blue"
            >
              Add quotes to array elements
            </Checkbox>
            <Button 
              onClick={onGenerate}
              isDisabled={!proofAddress}
              w="full"
              colorScheme="blue"
              size="md"
            >
              Generate Proof
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 