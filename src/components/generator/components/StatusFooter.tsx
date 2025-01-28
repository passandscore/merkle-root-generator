import { Flex, Text, Button } from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";

interface StatusFooterProps {
  addressCount: number;
  onReset: () => void;
}

export const StatusFooter = ({ addressCount, onReset }: StatusFooterProps) => {
  return (
    <Flex 
      justify="space-between" 
      align="center" 
      mt={8} 
      borderTop="1px" 
      borderColor="gray.700" 
      pt={4}
    >
      <Text color="gray.400">
        {`${addressCount} addresses loaded`}
      </Text>
      <Button
        size="sm"
        variant="ghost"
        color="gray.400"
        leftIcon={<IconUpload size={16} />}
        onClick={onReset}
        _hover={{ color: "red.400" }}
      >
        Upload Different CSV
      </Button>
    </Flex>
  );
}; 