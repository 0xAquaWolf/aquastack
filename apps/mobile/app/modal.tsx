import { StatusBar } from 'expo-status-bar'
import { Platform, Text, View } from 'react-native'

export default function Modal() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-lg text-gray-500">Modal Screen</Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
