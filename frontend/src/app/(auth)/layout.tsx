import * as React from "react";

import { AuroraBackground } from "@/components/aceternity/aurora-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuroraBackground>
      <div className="w-full max-w-sm md:max-w-md p-6 relative z-10">
        {children}
      </div>
    </AuroraBackground>
  );
}
