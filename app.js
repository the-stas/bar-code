init();

function init() {
    const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
        formats: ["upc_a", "upc_e"],
    } );

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
        barcodes.forEach((barcode) => {
            barcodeDetectorLog.textContent += JSON.stringify( barcode.rawValue );
            console.log(barcode.rawValue);
        });
      })
      .catch((err) => {
          const barcodeDetectorError = document.getElementById( 'barcodeDetectorError' );

          barcodeDetectorError.textContent = JSON.stringify( err );
        console.log(err);
      });
}