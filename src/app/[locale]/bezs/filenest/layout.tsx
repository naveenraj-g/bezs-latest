import { FilenestUserModalProvider } from "@/modules/client/filenest/providers/FilenestUserModalProvider";

function FilenestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FilenestUserModalProvider />
      {children}
    </>
  );
}

export default FilenestLayout;
