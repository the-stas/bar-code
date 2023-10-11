init();

function init() {
    const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
        formats: ["upc_a", "upc_e"],
    } );
    window?.BarcodeDetection?.getSupportedFormats?.().then((supportedFormats) => {
        console.log('supportedFormats ->');
        const supportedFormats2 = document.getElementById( 'supportedFormats' );
        supportedFormats.forEach((format) => supportedFormats2.textContent += JSON.stringify( format ));
    });
    document.getElementById( 'uploadInput' ).addEventListener( 'change', ( e ) => uploadInputChange( barcodeDetector, e ) );
}

  function uploadInputChange( barcodeDetector, { target } ) {
    const file = target.files[0];

    barcodeDetector.detect(file).then((barcodes) => {
        if ( barcodes.length <= 0 ) {
            const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

            barcodeDetectorError.textContent = 'No bar codes were detected';
            document.getElementById( 'rootError' ).hidden = false;
        }
        barcodes.forEach((barcode, index) => {
            barcodeDetectorLog.textContent += `${ index } ) ${ barcode.rawValue }\n`;
            console.log(barcode.rawValue);
        });
      })
      .catch((err) => {
          const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

          barcodeDetectorError.textContent = JSON.stringify( err );

          document.getElementById( 'rootError' ).hidden = false;
        console.log(err);
      });
}