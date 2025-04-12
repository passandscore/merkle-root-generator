import { Flex, Text, Button, ButtonProps } from "@chakra-ui/react";
import { IconPlant2, IconSitemap, IconList } from "@tabler/icons-react";

interface ActionButtonsProps {
  isRootCopied: boolean;
  isProofCopied: boolean;
  isAddressesCopied: boolean;
  onRootClick: () => void;
  onProofClick: () => void;
  onAddressesClick: () => void;
}

export const ActionButtons = ({
  isRootCopied,
  isProofCopied,
  isAddressesCopied,
  onRootClick,
  onProofClick,
  onAddressesClick,
}: ActionButtonsProps) => {
  const buttonStyles: ButtonProps = {
    size: "lg",
    variant: "outline",
    height: "80px",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    letterSpacing: "wider",
    textTransform: "uppercase" as const,
    fontSize: "sm",
    _hover: { 
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(123, 104, 238, 0.3)",
    },
    transition: "all 0.2s",
  };

  return (
    <Flex gap={6} justify="center" wrap="wrap">
      <Button
        {...buttonStyles}
        colorScheme={isRootCopied ? "green" : "blue"}
        onClick={onRootClick}
        borderColor={isRootCopied ? "green.500" : "tech.primary"}
        color={isRootCopied ? "green.500" : "tech.primary"}
        _hover={{
          bg: isRootCopied ? "green.500" : "tech.primary",
          color: "tech.background",
        }}
      >
        <IconPlant2 size={32} stroke={1.5} />
        <Text>{isRootCopied ? "Root Copied!" : "Generate Root"}</Text>
      </Button>
      <Button
        {...buttonStyles}
        colorScheme={isProofCopied ? "green" : "blue"}
        onClick={onProofClick}
        borderColor={isProofCopied ? "green.500" : "tech.primary"}
        color={isProofCopied ? "green.500" : "tech.primary"}
        _hover={{
          bg: isProofCopied ? "green.500" : "tech.primary",
          color: "tech.background",
        }}
      >
        <IconSitemap size={32} stroke={1.5} />
        <Text>{isProofCopied ? "Proof Copied!" : "Generate Proof"}</Text>
      </Button>
      <Button
        {...buttonStyles}
        colorScheme={isAddressesCopied ? "green" : "blue"}
        onClick={onAddressesClick}
        borderColor={isAddressesCopied ? "green.500" : "tech.primary"}
        color={isAddressesCopied ? "green.500" : "tech.primary"}
        _hover={{
          bg: isAddressesCopied ? "green.500" : "tech.primary",
          color: "tech.background",
        }}
      >
        <IconList size={32} stroke={1.5} />
        <Text>{isAddressesCopied ? "Addresses Copied!" : "Copy Addresses"}</Text>
      </Button>
    </Flex>
  );
}; 