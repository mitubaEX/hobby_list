import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { ChangeEvent } from 'react'

type SearchBarProps = {
  onSearch: (query: string) => void
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <InputGroup>
      <InputLeftElement>
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="趣味を検索..."
        onChange={handleChange}
        bg="white"
      />
    </InputGroup>
  )
} 