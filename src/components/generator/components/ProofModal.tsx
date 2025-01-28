import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
} from "@chakra-ui/react";

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofAddress: string;
  onAddressChange: (value: string) => void;
  onGenerate: () => void;
}

export const ProofModal = ({
  isOpen,
  onClose,
  proofAddress,
  onAddressChange,
  onGenerate,
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
          <Input
            placeholder="Enter Ethereum address (0x...)"
            value={proofAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            size="md"
            mb={4}
          />
          <Button 
            onClick={onGenerate}
            isDisabled={!proofAddress}
            w="full"
            colorScheme="blue"
            size="md"
          >
            Generate Proof
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 