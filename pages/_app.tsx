import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { LanguageProvider } from '../hooks/useLanguage'
import SecurityGuard from '../components/features/SecurityGuard'
import BackToTop from '../components/ui/BackToTop'
import AuthGuard from '../components/features/AuthGuard'
import Footer from '../components/layout/Footer'

export default function App({ Component, pageProps }: AppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page)

  return (
    <LanguageProvider>
      <SecurityGuard />
      <AuthGuard>
        {getLayout(<Component {...pageProps} />)}
        <Footer />
      </AuthGuard>
      <BackToTop />
    </LanguageProvider>
  )
}
