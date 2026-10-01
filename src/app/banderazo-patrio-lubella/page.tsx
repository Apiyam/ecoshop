import { permanentRedirect } from 'next/navigation'

/** Campaña pausada. El landing sigue en BanderazoLanding.tsx */
export default function BanderazoLubellaPage() {
  permanentRedirect('https://lubella.com.mx')
}
