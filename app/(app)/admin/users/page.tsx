'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  History, 
  UserCheck, 
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Calendar,
  User as UserIcon,
  ArrowRightLeft,
  Search,
  Filter,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  createdAt: string;
}

interface AuditLogItem {
  id: string;
  userId: string;
  changedById: string;
  oldRole: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  newRole: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  reason: string | null;
  createdAt: string;
  user: { name: string; email: string };
  changedBy: { name: string; email: string };
}

interface SysAuditLogItem {
  id: string;
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { name: string; email: string } | null;
}

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function AdminPortalPage() {
  const { user: currentUser } = useAuthStore();
  const { data: usersData, error: usersError, mutate: mutateUsers, isLoading: isUsersLoading } = useSWR('/api/admin/users', fetcher);
  
  const [activeTab, setActiveTab] = useState<'users' | 'role-audit' | 'system-audit'>('users');
  
  // State for Role Assignment Modal
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newRole, setNewRole] = useState<'STUDENT' | 'RECRUITER' | 'ADMIN'>('STUDENT');
  const [changeReason, setChangeReason] = useState('');
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // State for System Audit Log Filtering and Pagination
  const [sysPage, setSysPage] = useState(0);
  const [filterUserId, setFilterUserId] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // State for Metadata View Modal
  const [selectedMeta, setSelectedMeta] = useState<any>(null);
  
  // State for Purge Modal
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [retentionDays, setRetentionDays] = useState(90);
  const [purging, setPurging] = useState(false);

  // SWR for System Audit Logs
  const queryParams = new URLSearchParams({
    page: sysPage.toString(),
    userId: filterUserId,
    action: filterAction,
    startDate: filterStartDate,
    endDate: filterEndDate,
  }).toString();
  
  const { data: sysAuditData, mutate: mutateSysAudit, isLoading: isSysAuditLoading } = useSWR(
    activeTab === 'system-audit' ? `/api/admin/audit-logs?${queryParams}` : null,
    fetcher
  );

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenRoleModal = (user: UserItem) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setChangeReason('');
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (selectedUser.id === currentUser?.id) {
      showNotification('error', 'You cannot change your own role to prevent lockout.');
      setSelectedUser(null);
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, reason: changeReason }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to update role');
      }

      showNotification('success', `Successfully updated ${selectedUser.name}'s role to ${newRole}`);
      mutateUsers(); // Refresh the users list and role audit logs
      setSelectedUser(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  const handlePurgeLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurging(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retentionDays }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Purge failed');
      
      showNotification('success', `Purged ${result.data.deletedCount} logs successfully.`);
      mutateSysAudit();
      setShowPurgeModal(false);
    } catch (err: any) {
      showNotification('error', err.message || 'Purge failed');
    } finally {
      setPurging(false);
    }
  };

  const handleResetFilters = () => {
    setFilterUserId('');
    setFilterAction('');
    setFilterStartDate('');
    setFilterEndDate('');
    setSysPage(0);
  };

  const usersList: UserItem[] = usersData?.users || [];
  const roleAuditLogs: AuditLogItem[] = usersData?.auditLogs || [];
  
  const sysLogs: SysAuditLogItem[] = sysAuditData?.logs || [];
  const sysPagination = sysAuditData?.pagination || { total: 0, pages: 0, page: 0 };
  const filterOptions = sysAuditData?.filters || { actions: [], users: [] };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'RECRUITER':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getActionBadgeClass = (action: string) => {
    if (action.includes('DELETE') || action.includes('PURGE')) {
      return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400';
    }
    if (action.includes('CREATE') || action.includes('UPLOAD') || action.includes('VERIFICATION') || action.includes('REGISTRATION')) {
      return 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400';
    }
    if (action.includes('GENERATE') || action.includes('SCORING') || action.includes('ANALYZE')) {
      return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
    }
    if (action.includes('LOGIN') || action.includes('LOGOUT')) {
      return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
    }
    return 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400';
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Portal</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage system users, assign roles, inspect system audit logs, and monitor security constraints.
          </p>
        </div>
        {activeTab === 'system-audit' && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowPurgeModal(true)}
            className="mt-4 md:mt-0 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Purge Logs
          </Button>
        )}
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl flex items-start gap-3 border shadow-sm ${
              notification.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Layout */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('role-audit')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'role-audit'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="w-4 h-4" />
          Role Audit Trail
        </button>
        <button
          onClick={() => setActiveTab('system-audit')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'system-audit'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="w-4 h-4" />
          System Audit Logs
        </button>
      </div>

      {/* Filtering Section for System Audit Logs */}
      {activeTab === 'system-audit' && (
        <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-5 gap-4 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">User</label>
            <select
              value={filterUserId}
              onChange={(e) => { setFilterUserId(e.target.value); setSysPage(0); }}
              className="p-2 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Users</option>
              {filterOptions.users.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Action</label>
            <select
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setSysPage(0); }}
              className="p-2 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Actions</option>
              {filterOptions.actions.map((act: string) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Start Date</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => { setFilterStartDate(e.target.value); setSysPage(0); }}
              className="p-1.5 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">End Date</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => { setFilterEndDate(e.target.value); setSysPage(0); }}
              className="p-1.5 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {((activeTab === 'users' || activeTab === 'role-audit') && isUsersLoading) || (activeTab === 'system-audit' && isSysAuditLoading) ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading portal resources...</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No users registered in the system.
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{u.name}</td>
                        <td className="p-4 text-muted-foreground">{u.email}</td>
                        <td className="p-4">
                          <Badge variant={getRoleBadgeVariant(u.role)}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={u.id === currentUser?.id}
                            onClick={() => handleOpenRoleModal(u)}
                            className="text-xs"
                          >
                            <ArrowRightLeft className="w-3 h-3 mr-1" />
                            Change Role
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'role-audit' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <th className="p-4">Target User</th>
                    <th className="p-4">Changed By</th>
                    <th className="p-4">Change Log</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {roleAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No role change logs found.
                      </td>
                    </tr>
                  ) : (
                    roleAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-semibold">
                          <div>
                            <p className="text-foreground">{log.user?.name || 'Unknown User'}</p>
                            <p className="text-xs text-muted-foreground">{log.user?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-foreground">{log.changedBy?.name || 'Admin'}</p>
                            <p className="text-xs text-muted-foreground">{log.changedBy?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant={getRoleBadgeVariant(log.oldRole)}>{log.oldRole}</Badge>
                            <span className="text-muted-foreground">→</span>
                            <Badge variant={getRoleBadgeVariant(log.newRole)}>{log.newRole}</Badge>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground italic max-w-xs truncate" title={log.reason || ''}>
                          {log.reason || 'No reason provided'}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'system-audit' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Entity Type / ID</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {sysLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No system audit logs match the current filters.
                        </td>
                      </tr>
                    ) : (
                      sysLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 text-muted-foreground whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </td>
                          <td className="p-4">
                            {log.user ? (
                              <div>
                                <p className="font-semibold text-foreground">{log.user.name}</p>
                                <p className="text-xs text-muted-foreground">{log.user.email}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic text-xs">Anonymous / Guest</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getActionBadgeClass(log.action)}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 text-xs font-mono">
                            {log.entityType ? (
                              <div>
                                <p className="text-foreground font-semibold">{log.entityType}</p>
                                <p className="text-muted-foreground text-[10px] truncate max-w-[120px]">{log.entityId}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">-</span>
                            )}
                          </td>
                          <td className="p-4 text-xs text-muted-foreground whitespace-nowrap" title={log.userAgent || ''}>
                            {log.ipAddress || 'Unknown'}
                          </td>
                          <td className="p-4 text-right">
                            {log.metadata ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedMeta(log.metadata)}
                                className="text-xs py-1 px-2.5 h-auto flex items-center gap-1.5"
                              >
                                <Info className="w-3.5 h-3.5" />
                                Metadata
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {sysPagination.pages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Showing page {sysPagination.page + 1} of {sysPagination.pages} ({sysPagination.total} logs total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={sysPage === 0}
                      onClick={() => setSysPage(p => Math.max(0, p - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={sysPage >= sysPagination.pages - 1}
                      onClick={() => setSysPage(p => p + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Role Assignment Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                <UserCheck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Change User Role</h3>
              </div>

              <form onSubmit={handleUpdateRole} className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">User</p>
                  <p className="text-sm font-semibold text-foreground">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Select New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="STUDENT">Student (STUDENT)</option>
                    <option value="RECRUITER">Recruiter (RECRUITER)</option>
                    <option value="ADMIN">Admin (ADMIN)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Reason for Change
                  </label>
                  <textarea
                    required
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    placeholder="Provide a clear reason for the audit log trail..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedUser(null)}
                    disabled={updating}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updating}
                    className="flex-1"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Metadata Viewer Modal */}
      <AnimatePresence>
        {selectedMeta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMeta(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Audit Log Metadata</h3>
              </div>

              <div className="flex-1 overflow-y-auto bg-muted/30 border border-border p-4 rounded-xl">
                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                  {JSON.stringify(selectedMeta, null, 2)}
                </pre>
              </div>

              <div className="pt-4 mt-2 border-t border-border flex justify-end">
                <Button onClick={() => setSelectedMeta(null)} size="sm">
                  Close Window
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Purge Confirmation Modal */}
      <AnimatePresence>
        {showPurgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPurgeModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-bold text-lg text-foreground">Purge System Audit Logs</h3>
              </div>

              <form onSubmit={handlePurgeLogs} className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You are about to delete audit logs from the database. This action is permanent. Select how many days of logs to keep.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Retention Cutoff
                  </label>
                  <select
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="30">Delete logs older than 30 days</option>
                    <option value="60">Delete logs older than 60 days</option>
                    <option value="90">Delete logs older than 90 days</option>
                    <option value="180">Delete logs older than 180 days</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPurgeModal(false)}
                    disabled={purging}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={purging}
                    className="flex-1"
                  >
                    {purging ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Purging...
                      </>
                    ) : (
                      'Purge Now'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
