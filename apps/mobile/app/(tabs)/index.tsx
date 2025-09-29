import { Text, View } from 'react-native'
import AuthGuard from '@/components/AuthGuard'

export default function Index() {
  return (
    <AuthGuard>
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-4 text-2xl font-semibold text-gray-900">SelfVision Quest</Text>

      </View>
    </AuthGuard>
  )
}
