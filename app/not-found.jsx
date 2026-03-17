import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: "hsl(199, 89%, 60%)" }}>
        404 Error
      </p>
      <h1 className="text-8xl font-bold gradient-title mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button
          className="gap-2"
          style={{ background: "hsl(199, 89%, 48%)", color: "#fff", border: "none" }}
        >
          <ArrowLeft className="h-4 w-4" /> Return Home
        </Button>
      </Link>
    </div>
  );
}
