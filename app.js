init();

function init() {
    const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
        formats: ["upc_a", "upc_e"],
    } );
    window?.BarcodeDetection?.getSupportedFormats?.().then((supportedFormats) => {
        console.log('supportedFormats ->');
        const supportedFormatsRoot = document.getElementById( 'supportedFormatsRoot' );
        const supportedFormats2 = document.getElementById( 'supportedFormats' );

        supportedFormatsRoot.hidden = false;
        supportedFormats.forEach((format) => supportedFormats2.textContent += JSON.stringify( format ));
    });
    document.getElementById( 'uploadInput' ).addEventListener( 'change', ( e ) => uploadInputChange( barcodeDetector, e ) );
}

  function uploadInputChange( barcodeDetector, { target } ) {
      const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

      barcodeDetectorError.textContent = '';
      document.getElementById( 'rootError' ).hidden = true;
    const file = target.files[0];
      const barcodeDetectorLog = document.getElementById( 'barcodeDetectorLog' );

    barcodeDetector.detect(file).then((barcodes) => {
        if ( barcodes.length <= 0 ) {
            const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

            barcodeDetectorError.textContent = 'No bar codes were detected';
            document.getElementById( 'rootError' ).hidden = false;
        }
        barcodes.forEach((barcode, index) => {
            barcodeDetectorLog.textContent += `${ index + 1 } ) ${ barcode.rawValue }\n`;
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