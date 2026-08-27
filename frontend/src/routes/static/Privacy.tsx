import { StaticPageLayout } from '../../components/landing/StaticPageLayout'

export function Privacy() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
      
      <p>
        At PlazaOS, we take your privacy seriously. This Privacy Policy describes how we collect, use, and handle your personal information when you use our websites, software, and services.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us when you create an account, update your profile, submit a maintenance request, or communicate with us. This may include your name, email address, phone number, and payment information.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. How We Use Information</h2>
      <p>
        We use the information we collect to provide, maintain, and improve our services, process transactions, send administrative messages, and communicate with you about products, services, offers, and events.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.
      </p>
    </StaticPageLayout>
  )
}
