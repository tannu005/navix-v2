import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl min-h-screen">
      <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
        Terms of Service
      </h1>
      
      <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Terms</h2>
          <p>By accessing the website at Navix, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Use License</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Permission is granted to temporarily download one copy of the materials (information or software) on Navix's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on Navix's website;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </li>
            <li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Navix at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</li>
          </ol>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. Disclaimer</h2>
          <p>The materials on Navix's website are provided on an 'as is' basis. Navix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at ytannu1410@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}
