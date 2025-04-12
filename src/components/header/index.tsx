import { Flex, Text, Button, Box } from "@chakra-ui/react";
import { IconBrandGithub } from "@tabler/icons-react";

const Header = () => {
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
        <Flex align="center">
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
            ml={2}
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
          NFT Whitelists
        </Text>
      </Flex>
    </>
  );
};

export default Header;
