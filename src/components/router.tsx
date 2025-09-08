import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "./layout/main-layout"
import { AdminLayout } from "./layout/admin-layout"
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
// Admin Pages
import { AdminDashboardPage } from "../pages/admin/admin-dashboard-page"
import { AdminProductsPage } from "../pages/admin/admin-products-page"
import { AdminBrandsPage } from "../pages/admin/admin-brands-page"
import { AdminShipmentsPage } from "../pages/admin/admin-shipments-page"
import { AdminInquiriesPage } from "../pages/admin/admin-inquiries-page"
import { AdminSettingsPage } from "../pages/admin/admin-settings-page"

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
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="shipments" element={<AdminShipmentsPage />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}