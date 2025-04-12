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
      borderColor="tech.surface" 
      pt={4}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: '-1px',
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, tech.highlight, transparent)',
      }}
    >
      <Text 
        color="tech.secondary"
        letterSpacing="wider"
        fontSize="sm"
      >
        {`${addressCount} addresses loaded`}
      </Text>
      <Button
        size="sm"
        variant="ghost"
        color="tech.secondary"
        leftIcon={<IconUpload size={16} />}
        onClick={onReset}
        _hover={{ 
          color: "tech.accent",
          transform: "translateY(-2px)",
        }}
        transition="all 0.2s"
        letterSpacing="wider"
        textTransform="uppercase"
        fontSize="xs"
      >
        Upload Different CSV
      </Button>
    </Flex>
  );
}; 