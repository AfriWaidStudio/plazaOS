import { StaticPageLayout } from '../../components/landing/StaticPageLayout'
import { Link } from 'react-router-dom'

export function Support() {
  return (
    <StaticPageLayout title="Support">
      <p>
        We're here to help! Whether you're experiencing a technical issue, have a billing question, or just need guidance on how to use a specific feature, our dedicated support team has your back.
      </p>

      <div className="mt-8 space-y-6">
        <div className="p-5 border border-slate-200 rounded-lg">
          <h3 className="font-semibold text-slate-900">Email Support</h3>
          <p className="mt-1 text-sm">Average response time: 2-4 hours during business days.</p>
          <a href="mailto:support@plazaos.com" className="text-primary font-medium hover:underline block mt-3">support@plazaos.com</a>
        </div>
        
        <div className="p-5 border border-slate-200 rounded-lg">
          <h3 className="font-semibold text-slate-900">Self-Service Help Center</h3>
          <p className="mt-1 text-sm">Find answers to commonly asked questions and step-by-step guides.</p>
          <Link to="/help" className="text-primary font-medium hover:underline block mt-3">Visit the Help Center &rarr;</Link>
        </div>
      </div>
    </StaticPageLayout>
  )
}
