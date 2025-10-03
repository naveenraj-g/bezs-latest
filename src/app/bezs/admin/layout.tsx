import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminModalProvider } from "@/modules/admin/frontend/providers/admin-modal-provider";
import BreadCrumb from "@/modules/shared/components/breadcrumb";
import { CommonSideBar } from "@/modules/shared/components/menubar/common-sidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-53px)] relative overflow-hidden">
      <SidebarProvider
        className="min-h-full"
        style={{
          "--sidebar-width": "12.5rem",
          "--sidebar-width-mobile": "12.5rem",
        }}
      >
        <CommonSideBar label="Admin Management" />
        <main className="h-[calc(100vh-53px)] overflow-y-auto w-full p-6 space-y-6">
          <div className="flex items-center">
            <SidebarTrigger className="cursor-pointer" />
            <BreadCrumb />
          </div>
          <AdminModalProvider />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
