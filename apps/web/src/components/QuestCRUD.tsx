import { useEffect, useState } from 'react'
import { treaty } from '@elysiajs/eden'
import type { App } from '@svq/api'
import type { Quest } from '@svq/shared'

const apiClient = treaty<App>('http://localhost:3333')

// Types from the API

type CreateQuestData = {
  title: string
  description: string
}


export function QuestList() {
  const [quests, setQuests] = useState<Array<Quest> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuests = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: apiError } = await apiClient.quests.get()

      if (apiError) {
        throw new Error(`API Error: ${apiError.status}`)
      }

      setQuests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quests')
    } finally {
      setLoading(false)
    }
  }

  const deleteQuest = async (id: string) => {
    try {
      const { error: deleteError } = await apiClient.quests({ id }).delete()

      if (deleteError) {
        throw new Error(`Delete failed: ${deleteError.status}`)
      }

      await fetchQuests() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quest')
    }
  }

  const updateQuestStatus = async (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const { error: updateError } = await apiClient.quests({ id }).put({ status })

      if (updateError) {
        throw new Error(`Update failed: ${updateError.status}`)
      }

      await fetchQuests() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quest')
    }
  }

  useEffect(() => {
    fetchQuests()
  }, [])

  if (loading) return <div className="text-center py-8">Loading quests...</div>
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>

  return (
    <div className="space-y-4">
      {!quests || quests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No quests found. Create your first quest!</div>
      ) : (
        quests.map((quest) => (
          <div key={quest.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{quest.title}</h3>
                <p className="text-gray-600 mt-1">{quest.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-2 py-1 rounded text-sm ${quest.status === 'completed' ? 'bg-green-100 text-green-800' :
                    quest.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {quest.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(quest.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <select
                  value={quest.status}
                  onChange={(e) => updateQuestStatus(quest.id, e.target.value as any)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => deleteQuest(quest.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}

export function CreateQuestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState<CreateQuestData>({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { error: apiError } = await apiClient.quests.post(formData)

      if (apiError) {
        throw new Error(`API Error: ${apiError.status}`)
      }

      // Reset form
      setFormData({ title: '', description: '' })

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quest title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter quest description"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Quest'}
      </button>
    </form>
  )
}
