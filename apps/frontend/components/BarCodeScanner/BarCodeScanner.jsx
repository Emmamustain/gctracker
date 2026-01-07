import React, { useState } from "react";
import { useZxing } from "react-zxing";

function BarCodeScanner({ setBarCode }) {
  const [paused, setPaused] = useState(false);

  const { ref } = useZxing({
    paused,
    onDecodeResult(result) {
      const text = result.getText();
      setPaused(true);
      setBarCode(text);
    },
    readers: ["code_128_reader", "ean_reader"],
    constraints: {
      video: {
        facingMode: "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
    },
    // Scan every 10ms
    timeBetweenDecodingPeriods: 10,
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        style={{ transform: "scale(1.2)" }}
      />
      {/* Visual scanning guide overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* The ROI (Region of Interest) box - optimized for long barcodes */}
        <div className="border-primary/50 h-[35%] w-[90%] rounded-lg border-2 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
          <div className="border-primary absolute -top-1 -left-1 h-6 w-6 rounded-tl-sm border-t-4 border-l-4" />
          <div className="border-primary absolute -top-1 -right-1 h-6 w-6 rounded-tr-sm border-t-4 border-r-4" />
          <div className="border-primary absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-sm border-b-4 border-l-4" />
          <div className="border-primary absolute -right-1 -bottom-1 h-6 w-6 rounded-br-sm border-r-4 border-b-4" />

          {/* Animated scanning line */}
          <div className="bg-primary/80 animate-scan h-[2px] w-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        </div>
      </div>

      <div className="absolute right-0 bottom-4 left-0 flex flex-col items-center gap-1">
        <p className="text-center text-[12px] font-bold text-white drop-shadow-md">
          CENTER BARCODE
        </p>
        <p className="text-center text-[10px] font-medium text-white/60">
          Avoid shadows & glare
        </p>
      </div>
    </div>
  );
}

export default BarCodeScanner;
