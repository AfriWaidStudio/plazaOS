import { StaticPageLayout } from '../../components/landing/StaticPageLayout'
import { Link } from 'react-router-dom'

export function Documentation() {
  return (
    <StaticPageLayout title="API & Developer Documentation">
      <p>
        PlazaOS provides a robust set of REST APIs for developers who want to integrate property management data into their own custom tools, CRM systems, or accounting software.
      </p>

      <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-2">Developer Docs Coming Soon</h3>
        <p className="text-sm">
          We are currently polishing our public API documentation. If you are an enterprise customer looking for early access to our API endpoints, please contact our support team.
        </p>
        <div className="mt-4">
          <Link to="/contact" className="text-primary hover:underline font-medium">Contact Us &rarr;</Link>
        </div>
      </div>
    </StaticPageLayout>
  )
}
