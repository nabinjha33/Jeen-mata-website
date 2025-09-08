import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "./layout/main-layout"
import { HomePage } from "../pages/home-page"
import { BrandsPage } from "../pages/brands-page"
import { BrandDetailPage } from "../pages/brand-detail-page"
import { ProductDetailPage } from "../pages/product-detail-page"
import { SearchPage } from "../pages/search-page"
import { ShipmentsPage } from "../pages/shipments-page"
import { ShipmentDetailPage } from "../pages/shipment-detail-page"
import { InquiryCartPage } from "../pages/inquiry-cart-page"
import { InquirySuccessPage } from "../pages/inquiry-success-page"
import { NotFoundPage } from "../pages/not-found-page"

export function AppRouter() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:brandSlug" element={<BrandDetailPage />} />
          <Route path="products/:productSlug" element={<ProductDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="shipments" element={<ShipmentsPage />} />
          <Route path="shipments/:shipmentId" element={<ShipmentDetailPage />} />
          <Route path="inquiry" element={<InquiryCartPage />} />
          <Route path="inquiry/success" element={<InquirySuccessPage />} />
          <Route path="preview_page.html" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}