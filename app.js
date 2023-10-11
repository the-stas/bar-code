const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
    formats: ["upc_a", "upc_e"],
  } );

 window?.BarcodeDetection?.getSupportedFormats().then((supportedFormats) => {
    console.log('supportedFormats ->');
    const supportedFormats2 = document.getElementById( 'supportedFormats' );
    supportedFormats.forEach((format) => supportedFormats2.textContent += format);
  });

barcodeDetector.addEventListener("load", ({ detail }) => {
    const details = document.getElementById( 'details' );

    details.textContent = JSON.stringify( detail );

  console.log(detail); // zxing wasm module
});

barcodeDetector.addEventListener("error", ({ detail }) => {
    const details = document.getElementById( 'error' );

    details.textContent = JSON.stringify( detail );
    console.log(detail); // an error
  });


  document.getElementById( 'sbInStoreUploadStepUploadInput' ).addEventListener( 'change', uploadInputChange );

  function readFile(event) {
    const content = event.target.result;
    console.log('readFile');
    console.log(content);
      const details = document.getElementById( 'readFile' );

      details.textContent = JSON.stringify( content );

      const barcodeDetectorLog = document.getElementById( 'barcodeDetectorLog' );


    barcodeDetector.detect(content).then((barcodes) => {
        barcodes.forEach((barcode) => {
            barcodeDetectorLog.textContent += JSON.stringify( barcode.rawValue );
            console.log(barcode.rawValue);
        });
      })
      .catch((err) => {
          const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

          barcodeDetectorError.textContent = err;
        console.log(err);
      });
  }

  function uploadInputChange( { target } ) {
    const file = target.files[0];
      console.log('readFile');
      console.log(file);
      const details = document.getElementById( 'readFile' );

      details.textContent = JSON.stringify( file );

    barcodeDetector.detect(file).then((barcodes) => {
        barcodes.forEach((barcode) => {
            barcodeDetectorLog.textContent += JSON.stringify( barcode.rawValue );
            console.log(barcode.rawValue);
        });
      })
      .catch((err) => {
          const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

          barcodeDetectorError.textContent = err;
        console.log(err);
      });
    // var reader = new FileReader();
    // reader.addEventListener('load', readFile);
    // reader.readAsDataURL(file);
}