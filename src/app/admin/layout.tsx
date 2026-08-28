import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { requireAdmin } from "@/lib/admin"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  return <div className="min-h-screen bg-slate-50 text-slate-900"><AdminSidebar name={admin.name} email={admin.email} /><main className="min-h-screen px-4 pb-10 pt-20 lg:ml-72 lg:px-10 lg:pt-10">{children}</main></div>
}
