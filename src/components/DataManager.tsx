import { Button, HStack, useToast } from '@chakra-ui/react'
import { HobbyItem } from '../types/hobbies'

type DataManagerProps = {
  hobbyItems: HobbyItem[]
  onImport: (data: HobbyItem[]) => void
}

export const DataManager = ({ hobbyItems, onImport }: DataManagerProps) => {
  const toast = useToast()

  const handleExport = () => {
    const data = JSON.stringify(hobbyItems, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hobbies.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        onImport(data)
        toast({
          title: 'データをインポートしました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: 'エラーが発生しました',
          description: '正しいJSONファイルを選択してください',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <HStack spacing={4}>
      <Button colorScheme="blue" onClick={handleExport}>
        データをエクスポート
      </Button>
      <Button as="label" htmlFor="import-file" colorScheme="green">
        データをインポート
        <input
          id="import-file"
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </Button>
    </HStack>
  )
} 