import { StaticPageLayout } from '../../components/landing/StaticPageLayout'

export function Updates() {
  return (
    <StaticPageLayout title="Product Updates">
      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Latest Release: v1.2.0</h2>
      <p>
        We are constantly improving PlazaOS to give you the best tools to manage your properties. 
        In our latest release, we've focused heavily on performance improvements across the tenant dashboard and streamlined the maintenance request workflow.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li><strong>Faster load times</strong> across the entire admin dashboard.</li>
        <li><strong>Improved filtering</strong> for maintenance requests (you can now filter by urgency).</li>
        <li><strong>Payment settlement UI</strong> has been updated to provide clearer status indicators.</li>
      </ul>

      <h2 className="text-xl font-semibold text-slate-900 mt-12 mb-4">Coming Soon</h2>
      <p>
        Our team is actively working on new features based on your feedback. In the next quarter, we will be rolling out automated rent reminders, detailed financial exports, and a brand new communication module to broadcast messages to all your tenants at once.
      </p>
    </StaticPageLayout>
  )
}
