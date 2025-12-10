import RequireSeller from "@/components/RequireSeller";
import SellerProductList from "./SellerProductList";

export default function SellerDashboardPage() {
  return (
    <RequireSeller>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Seller Dashboard</h1>
        <SellerProductList />
        
      </div>
    </RequireSeller>
  );
}
