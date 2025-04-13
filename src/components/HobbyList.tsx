import { VStack, Box, Text, Badge, HStack, Select as ChakraSelect, Divider, Button } from '@chakra-ui/react'
import { useState, useEffect, ChangeEvent } from 'react'
import hobbiesData from '../assets/hobbies.json'
import { ProgressBar } from './ProgressBar'
import { SearchBar } from './SearchBar'
import { CategoryProgress } from './CategoryProgress'
import { AddHobbyForm } from './AddHobbyForm'
import { DataManager } from './DataManager'
import { HobbyItem, HobbyStatus } from '../types/hobbies'

type Hobby = {
  category: string
  items: string[]
}

export const HobbyList = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [hobbyItems, setHobbyItems] = useState<HobbyItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    setHobbies(hobbiesData.hobbies)
    // 初期状態の設定
    const initialItems: HobbyItem[] = hobbiesData.hobbies.flatMap(hobby =>
      hobby.items.map(item => ({
        name: item,
        status: '未着手' as HobbyStatus
      }))
    )
    setHobbyItems(initialItems)
  }, [])

  const handleStatusChange = (itemName: string, newStatus: HobbyStatus) => {
    setHobbyItems(prevItems =>
      prevItems.map(item =>
        item.name === itemName ? { ...item, status: newStatus } : item
      )
    )
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleAddHobby = (name: string, category: string, status: HobbyStatus) => {
    // 新しい趣味を追加
    setHobbyItems(prevItems => [...prevItems, { name, status }])
    
    // カテゴリが存在しない場合は追加
    if (!hobbies.some(h => h.category === category)) {
      setHobbies(prevHobbies => [...prevHobbies, { category, items: [name] }])
    } else {
      // 既存のカテゴリに追加
      setHobbies(prevHobbies =>
        prevHobbies.map(h =>
          h.category === category
            ? { ...h, items: [...h.items, name] }
            : h
        )
      )
    }
  }

  const handleImport = (data: HobbyItem[]) => {
    setHobbyItems(data)
    // カテゴリの再構築
    const newHobbies: Hobby[] = []
    data.forEach(item => {
      const category = hobbies.find(h => h.items.includes(item.name))?.category || '未分類'
      const existingCategory = newHobbies.find(h => h.category === category)
      if (existingCategory) {
        existingCategory.items.push(item.name)
      } else {
        newHobbies.push({ category, items: [item.name] })
      }
    })
    setHobbies(newHobbies)
  }

  const getStatusColor = (status: HobbyStatus) => {
    switch (status) {
      case '未着手':
        return 'gray'
      case '進行中':
        return 'blue'
      case '完了':
        return 'green'
      default:
        return 'gray'
    }
  }

  const filteredHobbies = hobbies.map(hobby => ({
    ...hobby,
    items: hobby.items.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(hobby => hobby.items.length > 0)

  const categories = hobbies.map(hobby => hobby.category)

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <SearchBar onSearch={handleSearch} />
        <Button colorScheme="blue" onClick={() => setIsAddModalOpen(true)}>
          趣味を追加
        </Button>
      </HStack>
      <DataManager hobbyItems={hobbyItems} onImport={handleImport} />
      <ProgressBar hobbyItems={hobbyItems} />
      <Divider />
      <VStack gap={4} align="stretch">
        {filteredHobbies.map((hobby) => (
          <Box key={hobby.category} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <CategoryProgress hobby={hobby} hobbyItems={hobbyItems} />
            <VStack gap={2} align="stretch" mt={4}>
              {hobby.items.map((item) => {
                const hobbyItem = hobbyItems.find(hi => hi.name === item)
                return (
                  <HStack key={item} justify="space-between">
                    <Text>{item}</Text>
                    <HStack>
                      <ChakraSelect
                        size="sm"
                        value={hobbyItem?.status || '未着手'}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          handleStatusChange(item, e.target.value as HobbyStatus)
                        }
                        width="120px"
                      >
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="完了">完了</option>
                      </ChakraSelect>
                      <Badge colorScheme={getStatusColor(hobbyItem?.status || '未着手')}>
                        {hobbyItem?.status || '未着手'}
                      </Badge>
                    </HStack>
                  </HStack>
                )
              })}
            </VStack>
          </Box>
        ))}
      </VStack>
      <AddHobbyForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddHobby}
        categories={categories}
      />
    </VStack>
  )
} 