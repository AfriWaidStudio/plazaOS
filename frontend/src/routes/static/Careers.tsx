import { StaticPageLayout } from '../../components/landing/StaticPageLayout'

export function Careers() {
  return (
    <StaticPageLayout title="Careers">
      <p>
        Join us in building the operating system for modern property management. We're a fast-growing team passionate about software, real estate, and solving complex problems with simple, elegant solutions.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Open Positions</h2>
      
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center mt-6">
        <p className="text-slate-600">
          We don't have any open roles right now, but we are always looking for talented engineers and product designers. 
        </p>
        <p className="mt-2 text-slate-600">
          Feel free to send your resume to <a href="mailto:careers@plazaos.com" className="text-primary hover:underline">careers@plazaos.com</a> and we'll keep you in mind for future opportunities.
        </p>
      </div>
    </StaticPageLayout>
  )
}
