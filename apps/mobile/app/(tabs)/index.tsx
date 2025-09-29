import { api } from '@svq/convex'
import { useQuery } from 'convex/react'
import { Text, View } from 'react-native'
import AuthGuard from '@/components/AuthGuard'

export default function Index() {
  const tasks = useQuery(api.tasks.get)
  return (
    <AuthGuard>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {tasks?.map(({ _id, text }) => <Text key={_id}>{text}</Text>)}
      </View>
    </AuthGuard>
  )
}
