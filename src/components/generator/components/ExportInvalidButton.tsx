import { Button, Text } from "@chakra-ui/react";
import { IconFileExport } from "@tabler/icons-react";

interface ExportInvalidButtonProps {
  onClick: () => void;
  invalidCount: number;
}

export const ExportInvalidButton = ({ onClick, invalidCount }: ExportInvalidButtonProps) => {
  return (
    <Button
      size="lg"
      variant="outline"
      colorScheme="red"
      onClick={onClick}
      height="80px"
      width="200px"
      display="flex"
      flexDirection="column"
      gap={2}
      _hover={{ bg: "red.900" }}
    >
      <IconFileExport size={32} stroke={1.5} />
      <Text>{`Export Invalid (${invalidCount})`}</Text>
    </Button>
  );
}; 