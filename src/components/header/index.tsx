import { Flex, Text, Button, Box } from "@chakra-ui/react";
import { IconBrandGithub, IconHelp } from "@tabler/icons-react";
import { useState } from "react";
import InstructionsModal from "../instructions/InstructionsModal";

const Header = () => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  return (
    <>
      <Flex
        mt={10}
        mx="auto"
        maxW="7xl"
        fontSize="3xl"
        fontWeight="bold"
        color="tech.highlight"
        justify="space-between"
        align="center"
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, tech.highlight, transparent)',
        }}
      >
        <Text
          letterSpacing="wider"
          textTransform="uppercase"
          fontSize="2xl"
          bgGradient="linear(to-r, tech.highlight, tech.primary)"
          bgClip="text"
        >
          Merkle Root Generator
        </Text>
        <Flex align="center" gap={2}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsInstructionsOpen(true)}
            fontSize="xs"
            leftIcon={<IconHelp size={16} />}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
            }}
            transition="all 0.2s"
          >
            Help
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              window.open(
                "https://github.com/passandscore/merkle-root-generator",
                "_blank"
              );
            }}
            fontSize="xs"
            leftIcon={<IconBrandGithub size={16} />}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
            }}
            transition="all 0.2s"
          >
            Star Repository
          </Button>
        </Flex>
      </Flex>

      <Flex
        mx="auto"
        maxW="7xl"
        pb={4}
        fontSize="lg"
        justify="space-between"
        mt={4}
      >
        <Text 
          color="tech.secondary"
          letterSpacing="wider"
          textTransform="uppercase"
          fontSize="sm"
        >
          NFT Whitelists & Airdrops
        </Text>
      </Flex>

      <InstructionsModal 
        isOpen={isInstructionsOpen} 
        onClose={() => setIsInstructionsOpen(false)} 
      />
    </>
  );
};

export default Header;
