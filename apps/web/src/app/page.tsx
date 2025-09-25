'use client'

import type { Quest } from '@svq/shared'
import { useCreateQuest, useDeleteQuest, useQuests } from '@svq/shared'
import { useState } from 'react'

export default function Home() {
  const { data: quests, isLoading, error } = useQuests()
  const createQuest = useCreateQuest()
  const deleteQuest = useDeleteQuest()
  const [newQuest, setNewQuest] = useState({ title: '', description: '' })

  const handleCreateQuest = () => {
    if (newQuest.title && newQuest.description) {
      createQuest.mutate(newQuest)
      setNewQuest({ title: '', description: '' })
    }
  }

  if (isLoading)
    return <div>Loading...</div>
  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    )
  }

  return (
    <div className="font-sans min-h-screen p-8 bg-background text-foreground">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SelfVision Quest</h1>

        <div className="mb-8 p-6 bg-card rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Create New Quest</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Quest Title"
              className="w-full p-2 border rounded bg-background text-foreground border-input"
              value={newQuest.title}
              onChange={e =>
                setNewQuest({ ...newQuest, title: e.target.value })}
            />
            <textarea
              placeholder="Quest Description"
              className="w-full p-2 border rounded bg-background text-foreground border-input"
              value={newQuest.description}
              onChange={e =>
                setNewQuest({ ...newQuest, description: e.target.value })}
            />
            <button
              onClick={handleCreateQuest}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Create Quest
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quests</h2>
          {quests?.map((quest: Quest) => (
            <div
              key={quest.id}
              className="p-4 bg-card rounded-lg shadow-md border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{quest.title}</h3>
                  <p className="text-muted-foreground">{quest.description}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      quest.status === 'completed'
                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        : quest.status === 'in_progress'
                          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                          : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {quest.status.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => deleteQuest.mutate(quest.id)}
                  className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
