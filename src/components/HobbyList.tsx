import { VStack, Box, Text, Badge, HStack, Select as ChakraSelect, Divider, Button,
  Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure, AlertDialog,
  AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent,
  AlertDialogOverlay } from '@chakra-ui/react'
import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { hobbiesData } from '../data/hobbies'
import { ProgressBar } from './ProgressBar'
import { SearchBar } from './SearchBar'
import { CategoryProgress } from './CategoryProgress'
import { AddHobbyForm } from './AddHobbyForm'
import { DataManager } from './DataManager'
import { HobbyItem, HobbyStatus } from '../types/hobbies'
import { HamburgerIcon } from '@chakra-ui/icons'

type Hobby = {
  category: string
  items: string[]
}

const COMPLETED_HOBBIES_KEY = 'completedHobbies'
const CUSTOM_HOBBIES_KEY = 'customHobbies'

export const HobbyList = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [hobbyItems, setHobbyItems] = useState<HobbyItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('全て')
  const [selectedStatus, setSelectedStatus] = useState<HobbyStatus | '全て'>('全て')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  // データの読み込み
  useEffect(() => {
    const loadData = () => {
      // 初期データの設定
      const initialHobbies = [...hobbiesData.hobbies]
      let allItems = new Map<string, HobbyItem>()

      // 初期アイテムを追加
      hobbiesData.hobbies.forEach(hobby => {
        hobby.items.forEach(item => {
          allItems.set(item, {
            name: item,
            status: '未着手' as HobbyStatus
          })
        })
      })

      // localStorageからカスタム趣味を読み込む
      const savedCustomHobbies = localStorage.getItem(CUSTOM_HOBBIES_KEY)
      if (savedCustomHobbies) {
        const customHobbies: Hobby[] = JSON.parse(savedCustomHobbies)
        // カスタム趣味をカテゴリごとにマージ
        customHobbies.forEach(customHobby => {
          const existingCategory = initialHobbies.find(h => h.category === customHobby.category)
          if (existingCategory) {
            // 既存のカテゴリにアイテムを追加
            existingCategory.items = [...new Set([...existingCategory.items, ...customHobby.items])]
              .sort((a, b) => a.localeCompare(b, 'ja'))
          } else {
            // 新しいカテゴリとして追加
            initialHobbies.push({
              ...customHobby,
              items: [...customHobby.items].sort((a, b) => a.localeCompare(b, 'ja'))
            })
          }

          // カスタムアイテムを追加
          customHobby.items.forEach(item => {
            if (!allItems.has(item)) {
              allItems.set(item, {
                name: item,
                status: '未着手' as HobbyStatus
              })
            }
          })
        })
      }

      // カテゴリをソート
      const sortedHobbies = initialHobbies.sort((a, b) => a.category.localeCompare(b.category, 'ja'))
      setHobbies(sortedHobbies)

      // localStorageから完了した趣味を読み込む
      const savedCompletedHobbies = localStorage.getItem(COMPLETED_HOBBIES_KEY)
      if (savedCompletedHobbies) {
        const completedItems: HobbyItem[] = JSON.parse(savedCompletedHobbies)
        // 完了した趣味のステータスを更新
        completedItems.forEach(item => {
          if (allItems.has(item.name)) {
            allItems.set(item.name, item)
          }
        })
      }

      // MapからArrayに変換
      setHobbyItems(Array.from(allItems.values()))
    }
    loadData()
  }, [])

  const handleStatusChange = (itemName: string, newStatus: HobbyStatus) => {
    setHobbyItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.name === itemName ? { ...item, status: newStatus } : item
      )
      
      // 完了した趣味のみを保存
      const completedItems = updatedItems.filter(item => item.status === '完了')
      localStorage.setItem(COMPLETED_HOBBIES_KEY, JSON.stringify(completedItems))
      
      return updatedItems
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as HobbyStatus | '全て')
  }

  const handleAddHobby = (name: string, category: string, status: HobbyStatus) => {
    // 新しい趣味アイテムを追加
    setHobbyItems(prevItems => [...prevItems, { name, status }])
    
    // 既存のカテゴリーを検索（初期データとカスタムデータの両方から）
    const existingCategory = hobbies.find(h => h.category === category)
    
    if (!existingCategory) {
      // 新しいカテゴリとして追加
      const newHobby = { category, items: [name] }
      setHobbies(prevHobbies => [...prevHobbies, newHobby])
      
      // カスタム趣味を保存
      const savedCustomHobbies = localStorage.getItem(CUSTOM_HOBBIES_KEY)
      const customHobbies: Hobby[] = savedCustomHobbies ? JSON.parse(savedCustomHobbies) : []
      customHobbies.push(newHobby)
      localStorage.setItem(CUSTOM_HOBBIES_KEY, JSON.stringify(customHobbies))
    } else {
      // 既存のカテゴリに追加
      setHobbies(prevHobbies =>
        prevHobbies.map(h =>
          h.category === category
            ? { ...h, items: [...new Set([...h.items, name])].sort((a, b) => a.localeCompare(b, 'ja')) }
            : h
        )
      )
      
      // カスタム趣味を更新
      const savedCustomHobbies = localStorage.getItem(CUSTOM_HOBBIES_KEY)
      const customHobbies: Hobby[] = savedCustomHobbies ? JSON.parse(savedCustomHobbies) : []
      const existingCustomCategory = customHobbies.find(h => h.category === category)
      
      if (existingCustomCategory) {
        // 既存のカスタムカテゴリを更新
        const updatedCustomHobbies = customHobbies.map(h =>
          h.category === category
            ? { ...h, items: [...new Set([...h.items, name])].sort((a, b) => a.localeCompare(b, 'ja')) }
            : h
        )
        localStorage.setItem(CUSTOM_HOBBIES_KEY, JSON.stringify(updatedCustomHobbies))
      } else {
        // 新しいカスタム趣味として追加
        customHobbies.push({ category, items: [name] })
        localStorage.setItem(CUSTOM_HOBBIES_KEY, JSON.stringify(customHobbies))
      }
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

  const filteredHobbies = hobbies
    .map(hobby => ({
      ...hobby,
      items: hobby.items.filter(item => {
        const matchesSearch = item.toLowerCase().includes(searchQuery.toLowerCase())
        const hobbyItem = hobbyItems.find(hi => hi.name === item)
        const matchesStatus = selectedStatus === '全て' || hobbyItem?.status === selectedStatus
        return matchesSearch && matchesStatus
      })
    }))
    .filter(hobby => 
      (selectedCategory === '全て' || hobby.category === selectedCategory) &&
      hobby.items.length > 0
    )
    .sort((a, b) => a.category.localeCompare(b.category, 'ja'))

  const categories = ['全て', ...hobbies.map(hobby => hobby.category)]

  const handleReset = () => {
    // localStorageをクリア
    localStorage.removeItem(COMPLETED_HOBBIES_KEY)
    localStorage.removeItem(CUSTOM_HOBBIES_KEY)

    // 状態をリセット
    const initialHobbies = [...hobbiesData.hobbies].sort((a, b) => a.category.localeCompare(b.category, 'ja'))
    const initialItems = hobbiesData.hobbies.flatMap(hobby =>
      hobby.items.map(item => ({
        name: item,
        status: '未着手' as HobbyStatus
      }))
    )

    setHobbies(initialHobbies)
    setHobbyItems(initialItems)
    setSelectedCategory('全て')
    setSelectedStatus('全て')
    setSearchQuery('')
    onClose()
  }

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <HStack spacing={4} flex={1}>
          <SearchBar onSearch={handleSearch} />
          <Button colorScheme="blue" onClick={() => setIsAddModalOpen(true)}>
            趣味を追加
          </Button>
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <MenuItem onClick={onOpen} color="red.500">
              全てリセット
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              全てリセット
            </AlertDialogHeader>

            <AlertDialogBody>
              全ての趣味の状態と追加したアイテムがリセットされます。この操作は取り消せません。
              本当にリセットしますか？
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button colorScheme="red" onClick={handleReset} ml={3}>
                リセット
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <HStack spacing={4}>
        <ChakraSelect
          value={selectedCategory}
          onChange={handleCategoryChange}
          width="200px"
          placeholder="カテゴリー選択"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </ChakraSelect>
        <ChakraSelect
          value={selectedStatus}
          onChange={handleStatusFilterChange}
          width="200px"
          placeholder="ステータス選択"
        >
          <option value="全て">全て</option>
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="完了">完了</option>
        </ChakraSelect>
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
        categories={categories.filter(category => category !== '全て')}
      />
    </VStack>
  )
} 