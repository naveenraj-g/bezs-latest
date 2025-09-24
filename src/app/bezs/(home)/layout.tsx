import { SidebarProvider } from "@/components/ui/sidebar";
import AppMenubar from "@/modules/shared/components/menubar/app-menubar";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-91px)]">
      {/* <BreadCrumb /> */}
      <SidebarProvider
        // style={{
        //   "--sidebar-width": "0rem",
        //   "--sidebar-width-mobile": "0rem",
        // }}
        className="h-full min-h-full flex"
      >
        <AppMenubar />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default HomeLayout;
