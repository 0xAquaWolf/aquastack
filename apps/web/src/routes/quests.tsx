import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateQuestForm, QuestList } from '../components/QuestCRUD'

export const Route = createFileRoute('/quests')({
  component: QuestsPage,
})

function QuestsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleQuestCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quest Management</h1>
          <p className="text-gray-600">Create and manage your self-improvement quests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Quest</h2>
            <CreateQuestForm onSuccess={handleQuestCreated} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Quests</h2>
            <QuestList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  )
}
