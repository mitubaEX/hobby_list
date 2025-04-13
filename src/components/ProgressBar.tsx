import { Box, Progress, Text, VStack } from '@chakra-ui/react'
import { HobbyItem } from '../types/hobbies'

type ProgressBarProps = {
  hobbyItems: HobbyItem[]
}

export const ProgressBar = ({ hobbyItems }: ProgressBarProps) => {
  const totalItems = hobbyItems.length
  const completedItems = hobbyItems.filter(item => item.status === '完了').length
  const inProgressItems = hobbyItems.filter(item => item.status === '進行中').length
  const progress = (completedItems / totalItems) * 100

  return (
    <VStack width="100%" spacing={2}>
      <Box width="100%">
        <Progress value={progress} colorScheme="green" size="lg" />
      </Box>
      <Text>
        進捗状況: {completedItems} / {totalItems} 完了
        ({inProgressItems} 進行中)
      </Text>
    </VStack>
  )
} 