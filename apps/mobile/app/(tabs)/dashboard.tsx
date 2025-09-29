import { Stack, useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { authClient } from '@/lib/auth-client'
import AuthGuard from '@/components/AuthGuard'

export default function DashboardTabScreen() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const userName = session?.user?.name ?? 'User'
  const userEmail = session?.user?.email ?? 'Not available'
  const userId = session?.user?.id ?? 'Not available'

  const handleLogout = async () => {
    await authClient.signOut()
    router.replace('/auth/login')
  }

  return (
    <AuthGuard>
      <Stack.Screen options={{ title: 'Dashboard' }} />
      <ScrollView className="flex-1 bg-gray-50 px-6 py-10">
        <View className="mb-6 rounded-2xl bg-blue-500 px-6 py-8 shadow-md shadow-blue-500/30">
          <Text className="text-3xl font-semibold text-white">Dashboard</Text>
          <View className="mt-2 flex-row">
            <Text className="text-lg text-blue-100">Welcome, </Text>
            <Text className="text-lg font-semibold text-white">{userName}</Text>
            <Text className="text-lg text-blue-100">!</Text>
          </View>
        </View>

        <View className="space-y-5">
          <View className="rounded-2xl bg-white p-5 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">Account Information</Text>
            <View className="mt-3 space-y-2">
              <View className="flex-row">
                <Text className="text-base text-gray-600">Email: </Text>
                <Text className="text-base font-medium text-gray-700">{userEmail}</Text>
              </View>
              <View className="flex-row">
                <Text className="text-base text-gray-600">User ID: </Text>
                <Text className="text-base font-medium text-gray-700">{userId}</Text>
              </View>
            </View>
          </View>

          <View className="rounded-2xl bg-white p-5 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">Features</Text>
            <View className="mt-3 space-y-1">
              <Text className="text-base text-gray-600">• View your profile</Text>
              <Text className="text-base text-gray-600">• Manage settings</Text>
              <Text className="text-base text-gray-600">• Access protected content</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="mt-10 w-full items-center rounded-lg bg-red-500 px-6 py-3"
          onPress={handleLogout}
        >
          <Text className="text-base font-semibold text-white">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </AuthGuard>
  )
}
