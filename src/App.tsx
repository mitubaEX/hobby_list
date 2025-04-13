import { ChakraProvider, Box, Container, Heading, VStack } from '@chakra-ui/react'
import { HobbyList } from './components/HobbyList'

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack gap={8} align="stretch">
            <Heading as="h1" size="xl" textAlign="center">
              趣味管理アプリ
            </Heading>
            <HobbyList />
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
