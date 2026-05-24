import Navbar from '@/components/Navbar'
import FeaturesHero from '@/components/features/FeaturesHero'
import HowItWorks from '@/components/features/HowItWorks'
import FeaturesList from '@/components/features/FeaturesList'
import TechStack from '@/components/features/TechStack'
import CTASection from '@/components/features/CTASection'

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          top: -100, right: -100,
        }}
      />
      <Navbar />
      <FeaturesHero />
      <HowItWorks />
      <FeaturesList />
      <TechStack />
      <CTASection />
    </main>
  )
}