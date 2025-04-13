declare module '*.json' {
  const value: {
    hobbies: Array<{
      category: string
      items: string[]
    }>
  }
  export default value
} 