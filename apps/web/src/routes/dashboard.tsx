import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { treaty } from '@elysiajs/eden'
import type { App } from '@svq/api'

const apiClient = treaty<App>('http://localhost:3333')

type Quest = {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  userId: string
  createdAt: Date
  updatedAt: Date
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const [quests, setQuests] = useState<Array<Quest>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchQuests()
  }, [])

  const stats = {
    total: quests.length,
    pending: quests.filter(q => q.status === 'pending').length,
    inProgress: quests.filter(q => q.status === 'in_progress').length,
    completed: quests.filter(q => q.status === 'completed').length,
  }

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your SelfVision Quest dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Quests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Quests</h2>
            <Link
              to="/quests"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Quests →
            </Link>
          </div>
          
          {quests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No quests yet. <Link to="/quests" className="text-blue-600 hover:underline">Create your first quest!</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quests.slice(0, 5).map((quest) => (
                <div key={quest.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{quest.title}</h3>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    quest.status === 'completed' ? 'bg-green-100 text-green-800' :
                    quest.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quest.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
              {quests.length > 5 && (
                <div className="text-center pt-2">
                  <Link
                    to="/quests"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View {quests.length - 5} more quests →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}