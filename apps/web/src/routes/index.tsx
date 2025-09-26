import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { treaty } from '@elysiajs/eden'
import type { App } from '@svq/api'

const apiClient = treaty<App>('http://localhost:3333')

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [quests, setQuests] = useState<Array<any>>([])

  useEffect(() => {
    async function getData() {
      const { data } = await apiClient.quests.get()
      console.log({ data })
      setQuests(data || [])
      return data
    }
    getData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gradient-to-br from-blue-50 to-indigo-100 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Level up your life with</span>
                  <span className="block text-blue-600 mt-2">SelfVision Quest</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Transform your personal growth journey into an epic adventure. Create quests, track progress, and achieve your goals with gamified self-improvement.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/quests"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      View Quests
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Stats */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-blue-400 to-indigo-500 sm:h-72 lg:h-full lg:w-full"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for your growth journey
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quest Management</h3>
                <p className="text-base text-gray-500">Create, organize, and track your personal development quests with ease.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-base text-gray-500">Monitor your progress with visual dashboards and analytics.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Type-Safe API</h3>
                <p className="text-base text-gray-500">Built with modern stack for reliable and fast performance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live API Preview */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Live API Data</h2>
            <p className="mt-2 text-lg text-gray-600">Real-time quest data from our Elysia backend</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Current Quests ({quests.length})</h3>
            {quests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No quests available. Start by creating one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quests.map((quest) => (
                  <div key={quest.id} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{quest.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      quest.status === 'completed' ? 'bg-green-100 text-green-800' :
                      quest.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quest.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg">SelfVision Quest</p>
            <p className="text-gray-400 mt-2">Built with Elysia, Eden Treaty, React, and TanStack Router</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
