"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useEffect, useState } from "react";

export function ToastProvider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <SonnerToaster
      position={isMobile ? "bottom-center" : "top-right"}
      offset={24}
      style={{
        top: isMobile ? undefined : "80px",
      }}
      gap={12}
      expand={true}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:bg-white/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:border-[#c49a22]/30 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:border-l-4",
          title: "group-[.toast]:text-[#1f2a44] group-[.toast]:font-bold group-[.toast]:text-sm",
          description: "group-[.toast]:text-gray-500 group-[.toast]:text-xs group-[.toast]:mt-1",
          closeButton: 
            "group-[.toast]:bg-white group-[.toast]:border-gray-100 group-[.toast]:shadow-md " +
            "group-[.toast]:text-gray-400 group-[.toast]:hover:text-[#c49a22] " +
            // Use specific positioning to override Sonner defaults
            "!group-[.toast]:left-auto !group-[.toast]:right-2 !group-[.toast]:top-2 !group-[.toast]:opacity-100",
        },
      }}
    />
  );
}
