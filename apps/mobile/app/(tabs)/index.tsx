import { Stack } from 'expo-router'
import { Text, View } from 'react-native'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-500">Welcome to your app</Text>
      </View>
    </>
  )
}
