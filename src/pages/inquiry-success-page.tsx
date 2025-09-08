import { Link, useLocation } from "react-router-dom"
import { CheckCircle, MessageCircle, ArrowRight, Copy } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useI18n } from "../providers/i18n-provider"
import { toast } from "sonner@2.0.3"

export function InquirySuccessPage() {
  const { t } = useI18n()
  const location = useLocation()
  
  // Get data passed from inquiry submission
  const stateData = location.state as { inquiryId?: string; customerName?: string } | null
  const { inquiryId = 'INQ-SAMPLE', customerName = 'Valued Customer' } = stateData || {}

  const copyInquiryId = () => {
    navigator.clipboard.writeText(inquiryId)
    toast.success('Reference ID copied to clipboard')
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-h1 font-semibold text-success">{t('inquirySuccess')}</h1>
          <p className="text-lead text-muted-foreground">
            Thank you, {customerName}! {t('inquirySuccessMessage')}
          </p>
        </div>

        {/* Reference ID */}
        <Card>
          <CardContent className="p-8 space-y-4">
            <div className="space-y-2">
              <label className="text-small font-medium text-muted-foreground">
                {t('inquiryReference')}
              </label>
              <div className="flex items-center justify-center gap-3">
                <Badge variant="outline" className="text-h4 font-mono px-4 py-2">
                  {inquiryId}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyInquiryId}
                  className="p-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-small text-muted-foreground">
              Please save this reference ID for your records. We will use it in all communications about your inquiry.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-8 space-y-6">
            <h2 className="text-h3 font-semibold">What happens next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-small font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Review</h3>
                  <p className="text-small text-muted-foreground">
                    Our team will review your inquiry within 24 hours
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-small font-bold text-accent">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Quote</h3>
                  <p className="text-small text-muted-foreground">
                    We'll prepare a detailed quote with pricing and availability
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <span className="text-small font-bold text-success">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Contact</h3>
                  <p className="text-small text-muted-foreground">
                    Our representative will contact you with the quote
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-xl">
            <Link to="/search">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          
          <Button variant="outline" asChild size="lg" className="rounded-xl">
            <Link to="/">
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="pt-8 border-t">
          <div className="space-y-2">
            <p className="text-small font-medium">Questions about your inquiry?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-small text-muted-foreground">
              <span>📧 info@jeenmataimPex.com</span>
              <span>📞 +977-1-4567890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}