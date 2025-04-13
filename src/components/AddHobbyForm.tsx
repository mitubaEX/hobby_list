import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, VStack } from '@chakra-ui/react'
import { useState, ChangeEvent } from 'react'
import { HobbyStatus } from '../types/hobbies'

type AddHobbyFormProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, category: string, status: HobbyStatus) => void
  categories: string[]
}

export const AddHobbyForm = ({ isOpen, onClose, onAdd, categories }: AddHobbyFormProps) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<HobbyStatus>('未着手')

  const handleSubmit = () => {
    if (name && category) {
      onAdd(name, category, status)
      setName('')
      setCategory('')
      setStatus('未着手')
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>新しい趣味を追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>趣味名</FormLabel>
              <Input
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="趣味の名前を入力"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>カテゴリ</FormLabel>
              <Select
                value={category}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                placeholder="カテゴリを選択"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>ステータス</FormLabel>
              <Select
                value={status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as HobbyStatus)}
              >
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            追加
          </Button>
          <Button variant="ghost" onClick={onClose}>キャンセル</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 