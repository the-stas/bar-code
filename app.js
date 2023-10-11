const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
    formats: ["upc_a", "upc_e"],
  } );

 window?.BarcodeDetection?.getSupportedFormats().then((supportedFormats) => {
    console.log('supportedFormats ->');
    supportedFormats.forEach((format) => console.log(format));
  });

barcodeDetector.addEventListener("load", ({ detail }) => {
  console.log(detail); // zxing wasm module
});

barcodeDetector.addEventListener("error", ({ detail }) => {
    console.log(detail); // an error
  });


  document.getElementById( 'sbInStoreUploadStepUploadInput' ).addEventListener( 'change', uploadInputChange );

  function readFile(event) {
    const content = event.target.result;
    console.log('readFile');
    console.log(content);
    barcodeDetector.detect(content).then((barcodes) => {
        barcodes.forEach((barcode) => console.log(barcode.rawValue));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function uploadInputChange( { target } ) {
    const file = target.files[0];
    console.log(file);
    barcodeDetector.detect(file).then((barcodes) => {
        barcodes.forEach((barcode) => console.log(barcode.rawValue));
      })
      .catch((err) => {
        console.log(err);
      });
    // var reader = new FileReader();
    // reader.addEventListener('load', readFile);
    // reader.readAsDataURL(file);
}