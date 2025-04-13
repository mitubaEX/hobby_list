export type HobbyStatus = '未着手' | '進行中' | '完了'

export type HobbyItem = {
  name: string
  status: HobbyStatus
}

export type Hobby = {
  category: string
  items: string[]
}

export type HobbiesData = {
  hobbies: Hobby[]
}

declare module '*.json' {
  const value: HobbiesData
  export default value
} 