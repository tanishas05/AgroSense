import Navbar from '@/components/Navbar'
import ProfileCard from '@/components/profile/ProfileCard'
import FarmSettings from '@/components/profile/FarmSettings'
import NotificationSettings from '@/components/profile/NotificationSettings'
import LanguageSettings from '@/components/profile/LanguageSettings'

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-xs text-green-400 mb-1">Account settings ⚙️</p>
          <h1 className="font-serif text-3xl text-green-50">Profile & Settings</h1>
          <p className="text-sm text-green-100/40 mt-1">Manage your farm profile and preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <FarmSettings />
            <NotificationSettings />
            <LanguageSettings />
          </div>
        </div>
      </div>
    </main>
  )
}