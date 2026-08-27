import { StaticPageLayout } from '../../components/landing/StaticPageLayout'

export function About() {
  return (
    <StaticPageLayout title="About Us">
      <p className="text-lg">
        PlazaOS was built out of a simple frustration: managing commercial and residential plazas shouldn't require five different software tools, endless spreadsheets, and constant phone calls.
      </p>
      
      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Our Mission</h2>
      <p>
        Our mission is to bring modern, seamless, and efficient operations to property managers and landlords everywhere. We believe that when you remove the friction from day-to-day operations, property managers can focus on what really matters: providing great spaces and growing their business.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">The Platform</h2>
      <p>
        PlazaOS centralizes tenant onboarding, lease management, maintenance requests, and payment processing into a single, intuitive interface. Designed with simplicity in mind, it's powerful enough for large commercial complexes but accessible enough for independent property owners.
      </p>
    </StaticPageLayout>
  )
}
