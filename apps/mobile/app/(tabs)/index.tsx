import type { Quest } from '@svq/shared'
import { useCreateQuest, useDeleteQuest, useQuests } from '@svq/shared'
import { Stack } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function Home() {
  const { data: quests, isLoading } = useQuests()
  const createQuestMutation = useCreateQuest()
  const deleteQuestMutation = useDeleteQuest()

  const [newQuest, setNewQuest] = useState({ title: '', description: '' })

  const handleCreateQuest = () => {
    if (newQuest.title && newQuest.description) {
      createQuestMutation.mutate(newQuest)
      setNewQuest({ title: '', description: '' })
    }
  }

  const handleDeleteQuest = (id: string) => {
    Alert.alert('Delete Quest', 'Are you sure you want to delete this quest?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => deleteQuestMutation.mutate(id),
        style: 'destructive',
      },
    ])
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Quests' }} />
      <View className="flex-1 bg-gray-50 p-4">
        <ScrollView className="flex-1">
          {/* Create Quest Form */}
          <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold">Create New Quest</Text>
            <TextInput
              placeholder="Quest Title"
              className="mb-2 rounded-lg border border-gray-300 p-2"
              value={newQuest.title}
              onChangeText={text => setNewQuest({ ...newQuest, title: text })}
            />
            <TextInput
              placeholder="Quest Description"
              className="mb-3 h-20 rounded-lg border border-gray-300 p-2"
              multiline
              value={newQuest.description}
              onChangeText={text => setNewQuest({ ...newQuest, description: text })}
            />
            <TouchableOpacity
              onPress={handleCreateQuest}
              className="rounded-lg bg-blue-500 p-3"
              disabled={createQuestMutation.isPending}
            >
              <Text className="text-center font-semibold text-white">
                {createQuestMutation.isPending ? 'Creating...' : 'Create Quest'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quests List */}
          <View className="mb-4">
            <Text className="mb-3 text-lg font-semibold">Your Quests</Text>
            {(quests || []).map((quest: Quest) => (
              <View key={quest.id} className="mb-3 rounded-lg bg-white p-4 shadow-sm">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold">{quest.title}</Text>
                    <Text className="mb-2 text-sm text-gray-600">{quest.description}</Text>
                    <View
                      className={`self-start rounded px-2 py-1 ${
                        quest.status === 'completed'
                          ? 'bg-green-200'
                          : quest.status === 'in_progress'
                            ? 'bg-yellow-200'
                            : 'bg-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          quest.status === 'completed'
                            ? 'text-green-800'
                            : quest.status === 'in_progress'
                              ? 'text-yellow-800'
                              : 'text-gray-800'
                        }`}
                      >
                        {quest.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteQuest(quest.id)}
                    className="rounded-lg bg-red-500 px-3 py-2"
                    disabled={deleteQuestMutation.isPending}
                  >
                    <Text className="text-sm text-white">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {(!quests || quests.length === 0) && !isLoading && (
              <View className="rounded-lg bg-white p-4 shadow-sm">
                <Text className="text-center text-gray-500">
                  No quests yet. Create your first quest!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  )
}
