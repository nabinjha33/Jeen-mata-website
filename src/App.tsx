import { ThemeProvider } from "./providers/theme-provider"
import { I18nProvider } from "./providers/i18n-provider"
import { AppRouter } from "./components/router"
import { Toaster } from "./components/ui/sonner"

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <I18nProvider>
        <AppRouter />
        <Toaster 
          position="top-right"
          richColors
          closeButton
          theme="system"
        />
      </I18nProvider>
    </ThemeProvider>
  )
}