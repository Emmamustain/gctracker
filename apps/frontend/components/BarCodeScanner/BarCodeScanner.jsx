import React from "react";

import { useZxing } from "react-zxing";
function BarCodeScanner({ setBarCode }) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      setBarCode(result.getText());
    },
  });

  return (
    <>
      <video ref={ref} width={700} height={200} />
    </>
  );
}
export default BarCodeScanner;
