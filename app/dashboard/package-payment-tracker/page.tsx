import Paymenttracker from "../../ui/package-payment-tracker/paymenttracker";

const PackagePaymentTracker = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('current_page', 'payment-tracker');
        localStorage.setItem('package-payment-tracker_page_loaded', 'true');
    } 
    
    return (
        <Paymenttracker />
    )
}
export default PackagePaymentTracker;