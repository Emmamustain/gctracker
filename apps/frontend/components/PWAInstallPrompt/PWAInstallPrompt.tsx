"use client";

import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    outcome_detail: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already in standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;

    if (isStandalone) {
      return;
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Only show after a short delay to not be too intrusive
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS, we can't detect 'beforeinstallprompt', so we just show the instructions
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const dismiss = () => {
    setIsVisible(false);
    // Optionally save to localStorage that user dismissed it
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Don't show if user dismissed it recently
  useEffect(() => {
    if (localStorage.getItem("pwa-prompt-dismissed")) {
      setIsVisible(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/80 p-5 backdrop-blur-xl shadow-2xl">
            <button 
              onClick={dismiss}
              className="absolute right-3 top-3 text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                <Smartphone size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Install GC Tracker</h3>
                <p className="mt-1 text-sm text-white/60">
                  {isIOS 
                    ? "Tap the share button and 'Add to Home Screen' for the best experience." 
                    : "Add GC Tracker to your home screen for quick access and offline use."}
                </p>
                
                {!isIOS && (
                  <Button 
                    onClick={handleInstallClick}
                    className="mt-4 w-full gap-2 bg-white text-black hover:bg-white/90"
                  >
                    <Download size={16} />
                    Install App
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
