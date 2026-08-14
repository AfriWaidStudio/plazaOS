import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import type { Role } from '../context/AuthContext'
import { Button } from './Button'
import { Text } from './Text'

interface NavItem {
  label: string
  to: string
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Profile', to: '/admin/profile' },
    { label: 'Units', to: '/admin/units' },
    { label: 'Tenants', to: '/admin/tenants' },
    { label: 'Maintenance', to: '/admin/maintenance' },
    { label: 'Announcements', to: '/admin/announcements' },
    { label: 'Reminders', to: '/admin/reminders' },
    { label: 'Calendar', to: '/admin/calendar' },
    { label: 'Notifications', to: '/admin/notifications' },
    { label: 'Help & Q&A', to: '/admin/help' },
  ],
  tenant: [
    { label: 'Home', to: '/tenant' },
    { label: 'Profile', to: '/tenant/profile' },
    { label: 'Payments', to: '/tenant/payments' },
    { label: 'Maintenance', to: '/tenant/maintenance' },
    { label: 'Announcements', to: '/tenant/announcements' },
    { label: 'Notifications', to: '/tenant/notifications' },
    { label: 'Calendar', to: '/tenant/calendar' },
  ],
}

/** One shell for both roles — sidebar links and topbar identity swap based on AuthContext's role. */
export function Layout() {
  const { role, user, logout } = useAuth()
  const navItems = role ? NAV_ITEMS[role] : []
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-200/20">
      {/* Mobile Top Header - visible only on mobile */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4">
        <Text variant="h2" className="text-primary">
          Plaza OS
        </Text>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 focus:outline-none">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-60 flex-col border-b md:border-b-0 md:border-r border-slate-200 bg-white p-4`}>
        <Text variant="h2" className="mb-6 text-primary hidden md:block">
          Plaza OS
        </Text>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center rounded-button px-3 text-[15px] font-medium ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 pb-2">
          <Text variant="bodySmall" className="text-slate-400 text-xs text-center font-medium">
            Powered by <br /><span className="text-slate-500 font-semibold">Code Campus Int.</span>
          </Text>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex min-h-[44px] items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <Text variant="body" className="text-slate-500 truncate mr-4">
            {user?.name} · <span className="capitalize">{role}</span>
          </Text>
          <Button variant="secondary" onClick={logout} className="shrink-0">
            Log out
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
