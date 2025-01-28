import { Box, Input, Flex, Text } from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";
import { useRef } from "react";

interface UploadCSVProps {
  onUpload: (e: any) => void;
}

export const UploadCSV = ({ onUpload }: UploadCSVProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
          onUpload(e);
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
}; 