import { Button, Text, Flex } from "@chakra-ui/react";
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
  const buttonStyles = {
    size: "lg" as const,
    variant: "outline" as const,
    height: "80px",
    width: "200px",
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 2,
    _hover: { bg: "blue.900" },
  };

  return (
    <Flex gap={6} justify="center" wrap="wrap">
      <Button
        {...buttonStyles}
        colorScheme={isRootCopied ? "green" : "blue"}
        onClick={onRootClick}
      >
        <IconPlant2 size={32} stroke={1.5} />
        <Text>{isRootCopied ? "Root Copied!" : "Generate Root"}</Text>
      </Button>
      <Button
        {...buttonStyles}
        colorScheme={isProofCopied ? "green" : "blue"}
        onClick={onProofClick}
      >
        <IconSitemap size={32} stroke={1.5} />
        <Text>{isProofCopied ? "Proof Copied!" : "Generate Proof"}</Text>
      </Button>
      <Button
        {...buttonStyles}
        colorScheme={isAddressesCopied ? "green" : "blue"}
        onClick={onAddressesClick}
      >
        <IconList size={32} stroke={1.5} />
        <Text>{isAddressesCopied ? "Addresses Copied!" : "Copy Addresses"}</Text>
      </Button>
    </Flex>
  );
}; 