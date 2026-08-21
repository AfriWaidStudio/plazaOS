import { Text } from '../../../components'

export function AdminHelp() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div>
        <Text variant="h1">Help & Q&A</Text>
        <Text variant="body" className="mt-2 text-slate-500">
          Everything you need to know about managing your plaza with Plaza OS.
        </Text>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Text variant="h2" className="mb-4 text-primary">
          What is Plaza OS?
        </Text>
        <Text variant="body" className="mb-4 text-slate-600">
          Plaza OS is your centralized property management operating system. It connects you (the administrator) directly with your tenants, handling rent collections, maintenance requests, plaza-wide announcements, and reminders in one sleek, unified interface.
        </Text>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Text variant="h3" className="mb-3 text-slate-900">
            Units & Tenants
          </Text>
          <Text variant="body" className="text-sm text-slate-600">
            <strong>Units:</strong> Create and manage physical units (e.g., "Shop 101"). Monitor vacancy.<br /><br />
            <strong>Tenants:</strong> Onboard new tenants and assign them to units. This automatically creates their account so they can log into the Tenant Portal.
          </Text>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Text variant="h3" className="mb-3 text-slate-900">
            Payments & Rent
          </Text>
          <Text variant="body" className="text-sm text-slate-600">
            The system integrates with Paystack to handle automated online payments. You can view a complete ledger of all payments. If a tenant pays via cash or direct transfer outside the app, you can manually record it here to keep their balance accurate.
          </Text>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Text variant="h3" className="mb-3 text-slate-900">
            Maintenance
          </Text>
          <Text variant="body" className="text-sm text-slate-600">
            Tenants will submit maintenance tickets (with photos) from their portal. You can view these tickets, update their status to "In Progress" or "Resolved", and coordinate repairs efficiently.
          </Text>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Text variant="h3" className="mb-3 text-slate-900">
            Announcements & Reminders
          </Text>
          <Text variant="body" className="text-sm text-slate-600">
            <strong>Announcements:</strong> Broadcast important messages to all tenants at once (e.g., sanitation days).<br /><br />
            <strong>Reminders:</strong> Set up specific reminders for individual tenants regarding rent or rule violations.
          </Text>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mt-8">
        <Text variant="h2" className="mb-6 text-primary">
          Frequently Asked Questions (Q&A)
        </Text>
        
        <div className="space-y-6">
          <div>
            <Text variant="h3" className="font-semibold text-slate-900">
              Q: What happens when I add a new tenant?
            </Text>
            <Text variant="body" className="mt-1 text-sm text-slate-600">
              A: When you create a tenant, the system automatically provisions an account for them using their email. They can log in using their email and the default password, and they will be prompted to set a new password.
            </Text>
          </div>

          <div>
            <Text variant="h3" className="font-semibold text-slate-900">
              Q: How do tenants install the app on their phone?
            </Text>
            <Text variant="body" className="mt-1 text-sm text-slate-600">
              A: Plaza OS is a Progressive Web App (PWA). When tenants open the link in Chrome or Safari on their phones, they will see a prompt to "Install Plaza OS" or "Add to Home Screen". It will behave exactly like a native mobile app.
            </Text>
          </div>

          <div>
            <Text variant="h3" className="font-semibold text-slate-900">
              Q: A tenant forgot their password. What do I do?
            </Text>
            <Text variant="body" className="mt-1 text-sm text-slate-600">
              A: Currently, tenants can use the "Forgot Password" flow on the login screen to receive a reset email, provided the email system (Resend) is configured.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
