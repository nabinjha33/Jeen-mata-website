import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { useI18n } from "../providers/i18n-provider"

export function NotFoundPage() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <span className="text-h2 font-bold text-muted-foreground">404</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-h3 font-semibold">{t('pageNotFound')}</h1>
            <p className="text-muted-foreground">{t('pageNotFoundDescription')}</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
            <Button onClick={handleGoHome} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              {t('goHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}