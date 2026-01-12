import AuditLogsPage from "../../ui/Auditlogs/auditlogs";
import ProtectedRoute from "../../components/ProtectedRoute";

const AuditLogs = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('current_page', 'audit-logs');
        localStorage.setItem('audit-logs_page_loaded', 'true');
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <AuditLogsPage />
        </ProtectedRoute>
    )
}
export default AuditLogs;