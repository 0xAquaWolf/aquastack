import { apiClient } from '@svq/shared'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { Text, View } from 'react-native'

export default function Home() {
  useEffect(() => {
    async function getData() {
      const { data } = await apiClient.quests.get()
      console.log({ data })
      return data
    }
    getData()
  }, [])
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-500">Welcome to your app</Text>
      </View>
    </>
  )
}
