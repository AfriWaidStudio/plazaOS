import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface StaticPageLayoutProps {
  title: string
  children: ReactNode
}

export function StaticPageLayout({ title, children }: StaticPageLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${title} | PlazaOS`
  }, [title])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-8 pb-8 border-b border-slate-200">
            {title}
          </h1>
          <div className="text-slate-600 leading-relaxed space-y-6">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
