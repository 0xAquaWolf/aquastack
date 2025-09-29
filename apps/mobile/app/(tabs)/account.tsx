import { Stack, useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { authClient } from '@/lib/auth-client'
import AuthGuard from '@/components/AuthGuard'

export default function AccountScreen() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.replace('/auth/login')
  }

  return (
    <AuthGuard>
      <Stack.Screen options={{ title: 'Account' }} />
      <View className="flex-1 bg-white px-6 py-10">
        <View className="gap-2">
          <Text className="text-2xl font-semibold text-gray-900">Account</Text>
          <Text className="text-base text-gray-600">
            {session?.user?.name || 'User'}
          </Text>
          <Text className="text-sm text-gray-500">
            {session?.user?.email || 'No email available'}
          </Text>
        </View>

        <TouchableOpacity
          className="mt-8 w-full items-center rounded-lg bg-red-500 px-6 py-3"
          onPress={handleSignOut}
        >
          <Text className="text-base font-semibold text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </AuthGuard>
  )
}
