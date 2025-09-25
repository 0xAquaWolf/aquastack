import { Stack } from 'expo-router'
import { Text, View } from 'react-native'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-500">Settings</Text>
      </View>
    </>
  )
}
