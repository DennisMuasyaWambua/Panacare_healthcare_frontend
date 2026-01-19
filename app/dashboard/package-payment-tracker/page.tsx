import Paymenttracker from "../../ui/package-payment-tracker/paymenttracker";
import ProtectedRoute from "../../components/ProtectedRoute";

const PackagePaymentTracker = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('current_page', 'payment-tracker');
        localStorage.setItem('package-payment-tracker_page_loaded', 'true');
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <Paymenttracker />
        </ProtectedRoute>
    )
}
export default PackagePaymentTracker;