import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">SelfVision Quest</h1>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium"
                activeProps={{ className: '!border-blue-500 !text-gray-900' }}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                activeProps={{ className: '!border-blue-500 !text-gray-900' }}
              >
                Dashboard
              </Link>
              <Link
                to="/quests"
                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                activeProps={{ className: '!border-blue-500 !text-gray-900' }}
              >
                Quests
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
