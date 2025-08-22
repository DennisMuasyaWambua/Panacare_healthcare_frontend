import AuditLogsPage from "../../ui/Auditlogs/auditlogs";

const AuditLogs = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('current_page', 'payment-tracker');
        localStorage.setItem('package-payment-tracker_page_loaded', 'true');
    } 
    
    return (
        <AuditLogsPage />
    )
}
export default AuditLogs;