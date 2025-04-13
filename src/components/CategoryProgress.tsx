import { Box, Progress as ChakraProgress, Text, VStack, HStack } from '@chakra-ui/react'
import { HobbyItem, Hobby } from '../types/hobbies'

type CategoryProgressProps = {
  hobby: Hobby
  hobbyItems: HobbyItem[]
}

export const CategoryProgress = ({ hobby, hobbyItems }: CategoryProgressProps) => {
  const categoryItems = hobbyItems.filter(item => hobby.items.includes(item.name))
  const totalItems = categoryItems.length
  const completedItems = categoryItems.filter(item => item.status === '完了').length
  const inProgressItems = categoryItems.filter(item => item.status === '進行中').length
  const progress = (completedItems / totalItems) * 100

  return (
    <Box width="100%">
      <VStack align="stretch" gap={2}>
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="medium">{hobby.category}</Text>
          <Text fontSize="sm" color="gray.600">
            {completedItems} / {totalItems} 完了
          </Text>
        </HStack>
        <ChakraProgress
          value={progress}
          colorScheme="green"
          size="sm"
        />
        <Text fontSize="xs" color="gray.500">
          {inProgressItems} 進行中
        </Text>
      </VStack>
    </Box>
  )
} 