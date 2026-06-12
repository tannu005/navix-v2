import InnerBackground from "@/components/inner-background";

export default function MainLayout({ children }) {
  return (
    <>
      <InnerBackground />
      {/* Container to handle header offset and ensure content scrolls over the fixed background */}
      <div className="relative z-10 pt-24 min-h-screen">
        {children}
      </div>
    </>
  );
}
