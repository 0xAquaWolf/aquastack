import { api } from '@svq/convex'
import { useQuery } from 'convex/react'
import { Link } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import AuthGuard from '@/components/AuthGuard'

export default function Index() {
  const tasks = useQuery(api.tasks.get)
  const hasTasks = !!tasks && tasks.length > 0
  return (
    <AuthGuard>
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-4 text-2xl font-semibold text-gray-900">Welcome back!</Text>
        {hasTasks && (
          <View className="w-full max-w-xs items-center gap-2">
            {tasks!.map(({ _id, text }) => (
              <Text key={_id} className="text-base text-gray-700">
                {text}
              </Text>
            ))}
          </View>
        )}
        {!hasTasks && <Text className="text-base text-gray-500">No tasks yet.</Text>}

        <Link href="/dashboard" asChild>
          <TouchableOpacity className="mt-8 w-full max-w-xs items-center rounded-lg bg-blue-500 px-6 py-3">
            <Text className="text-base font-semibold text-white">Go to Dashboard</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </AuthGuard>
  )
}
