import { StaticPageLayout } from '../../components/landing/StaticPageLayout'

export function Contact() {
  return (
    <StaticPageLayout title="Contact Us">
      <p>
        We'd love to hear from you. Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="font-semibold text-slate-900">General Inquiries</h3>
          <p className="mt-1">
            <a href="mailto:hello@plazaos.com" className="text-primary hover:underline">hello@plazaos.com</a>
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-900">Support</h3>
          <p className="mt-1">
            Need help with your account? Visit our <a href="/support" className="text-primary hover:underline">Support Center</a> or email us at <a href="mailto:support@plazaos.com" className="text-primary hover:underline">support@plazaos.com</a>.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Sales</h3>
          <p className="mt-1">
            Interested in deploying PlazaOS for your properties? Reach out to our sales team at <a href="mailto:sales@plazaos.com" className="text-primary hover:underline">sales@plazaos.com</a>.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  )
}
