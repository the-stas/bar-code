init();

function init() {
    const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
        formats: ["upc_a", "upc_e"],
    } );

    window?.BarcodeDetection?.getSupportedFormats().then((supportedFormats) => {
        console.log('supportedFormats ->');
        const supportedFormats2 = document.getElementById( 'supportedFormats' );
        supportedFormats.forEach((format) => supportedFormats2.textContent += JSON.stringify( format ));
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

    document.getElementById( 'uploadInput' ).addEventListener( 'change', ( e ) => uploadInputChange( barcodeDetector, e ) );
}

  function uploadInputChange( barcodeDetector, { target } ) {
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
}