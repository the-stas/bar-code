let rawFiles = [];
let adaptedFiles = [];
let uniqueNameForFileCounter = 0;

init();

function init() {
    const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
        formats: [ "upc_a", "upc_e" ]
    } );

    document.getElementById( 'uploadInput' ).addEventListener( 'change', ( e ) => uploadInputChange( barcodeDetector, e ) );
    document.getElementById( 'clear' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        const barcodeDetectorLog = document.getElementById( 'barcodeDetectorLog' );

        barcodeDetectorLog.innerHTML = '';
        rawFiles = [];
        adaptedFiles = [];
        uniqueNameForFileCounter = 0;
    } );
}

async function uploadInputChange( barcodeDetector, { target } ) {
    const barcodeDetectorLog = document.getElementById( 'barcodeDetectorLog' );
    const files = [ ... target.files ];

    rawFiles = files;
    
    await Promise.all( rawFiles.map( ( file ) => adaptRawFile( file ) ) );

    const detectionResults = await Promise.all( adaptedFiles.map( ( { file } ) => processFile( file, barcodeDetector ) ) );

    barcodeDetectorLog.innerHTML = getMarkup( adaptedFiles, detectionResults );
}

function adaptRawFile( file ) {
    return new Promise( ( resolve ) => { // eslint-disable-line no-loop-func
        const reader = new FileReader();

        reader?.addEventListener( 'load', ( event ) => {
            if ( currentFileUnique( event.target.result ) ) {
                adaptedFiles.push( {
                    srcBase64: event.target.result,
                    id: generateFileNameId( file.name ),
                    file,
                } );
            }

            resolve();
        } );

        reader.readAsDataURL( file );
    } );
}

function processFile( file, barcodeDetector ) {
    return new Promise( ( resolve ) => {
        barcodeDetector.detect( file )
                       .then( ( barcodes ) => {
                           if ( barcodes.length <= 0 ) {
                               resolve( 'No bar codes were detected! Provided image is not either UPC A or UPC E bar code type' );
                           }
                           else if ( barcodes.length === 1 ) {
                               barcodes.forEach( ( barcode ) => {
                                   resolve( barcode.rawValue );
                               } );
                           }
                           else {
                               let codes = '';
                               
                               barcodes.forEach( ( barcode, index ) => {
                                   codes += `${ index +1 }) ${ barcode.rawValue };\n`;
                               } );
                               resolve( codes );
                           }
                       } )
                       .catch( ( err ) => {
                           resolve( `No bar codes were detected. Error: ${ err }` );
                       } );
    } );
}

function getMarkup( files, detectionResults ) {
    let mergedArray = [];

    for ( let i = 0; i < files.length; i += 1 ) {
        mergedArray.push( {
            ...files[ i ],
            detectionResult: detectionResults[ i ],
        } );
    }
    console.log( detectionResults );
    let markup = '';

    mergedArray.forEach( ( file, index ) => {
        markup += `<li style="border: 2px solid darkslateblue; margin-bottom: 20px; padding: 20px;">
            <p>File: ${ index + 1 }</p>
            <img src="${ file.srcBase64 }" style="max-width: 200px;" loading="lazy">
            <p>File name: ${ file.id }</p>
            <p>Bar code: <b>${ file.detectionResult }</b></p>
</li>`;
    } );
    
    return markup;
}

function generateFileNameId( name ) {
    uniqueNameForFileCounter += 1;

    return `${ uniqueNameForFileCounter }_${ name }`;
}

function currentFileUnique( newFileContent ) {
    return adaptedFiles.filter( ( currentFile ) => currentFile.srcBase64 === newFileContent ).length === 0;
}
