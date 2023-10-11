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
      console.log('readFile');
      console.log(file);
      const details = document.getElementById( 'readFile' );
      const barcodeDetectorLog = document.getElementById( 'barcodeDetectorLog' );

      details.textContent = JSON.stringify( file );

    barcodeDetector.detect(file).then((barcodes) => {
        barcodes.forEach((barcode, index) => {
            if ( barcode.length <= 0 ) {
                const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

                barcodeDetectorError.textContent = 'No bar codes were detected';
                document.getElementById( 'rootError' ).hidden = false;
            }
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