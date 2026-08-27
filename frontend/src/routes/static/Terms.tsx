import { StaticPageLayout } from '../../components/landing/StaticPageLayout'

export function Terms() {
  return (
    <StaticPageLayout title="Terms of Service">
      <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
      
      <p>
        Please read these Terms of Service carefully before using the PlazaOS platform. By accessing or using our services, you agree to be bound by these terms.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
      <p>
        By registering for and/or using the Services in any manner, you agree to these Terms of Service and all other operating rules, policies, and procedures that may be published from time to time on the Platform.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
      <p>
        PlazaOS provides a property management software platform that allows landlords, property managers, and tenants to coordinate leases, payments, and maintenance requests.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
      </p>
    </StaticPageLayout>
  )
}
