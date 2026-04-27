import { AuthGuard } from "@/components/auth"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DemoModeProvider } from "@/components/demo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DemoModeProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 pl-64">
            {children}
          </main>
        </div>
      </DemoModeProvider>
    </AuthGuard>
  )
}
