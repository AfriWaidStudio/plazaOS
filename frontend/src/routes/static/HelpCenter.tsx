import { StaticPageLayout } from '../../components/landing/StaticPageLayout'
import { Link } from 'react-router-dom'

export function HelpCenter() {
  return (
    <StaticPageLayout title="Help Center">
      <p>
        Welcome to the PlazaOS Help Center. Browse our resources below to learn how to get the most out of your PlazaOS dashboard.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        <div className="rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">Getting Started</h3>
          <p className="mt-2 text-sm">Learn how to set up your account, invite your first tenants, and configure your property settings.</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">Tenant Management</h3>
          <p className="mt-2 text-sm">Everything you need to know about leases, occupancy, and managing tenant profiles.</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">Payments & Billing</h3>
          <p className="mt-2 text-sm">Guides on how rent collection, payment tracking, and financial reporting work.</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">Maintenance Requests</h3>
          <p className="mt-2 text-sm">How to handle, assign, and resolve maintenance tickets effectively.</p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-slate-50 rounded-lg text-center border border-slate-100">
        <h3 className="font-semibold text-slate-900">Still need help?</h3>
        <p className="mt-2 text-sm text-slate-600 mb-4">Our support team is available Monday through Friday to assist you.</p>
        <Link to="/contact" className="text-primary font-medium hover:underline">Contact Support &rarr;</Link>
      </div>
    </StaticPageLayout>
  )
}
