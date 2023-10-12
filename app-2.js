let rawFiles = [];
let adaptedFiles = [];
let uniqueNameForFileCounter = 0;

init();

function init() {
    const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
        formats: [ "upc_a", "upc_e" ]
    } );

    // document.getElementById( 'uploadInput' ).addEventListener( 'change', ( e ) => uploadInputChange( barcodeDetector, e ) );
    document.getElementById( 'clear' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        window.location.reload();
    } );

    const video = document.querySelector("#video");
    const videoCont = document.querySelector("#videoCont");
    const finalImg = document.querySelector("#finalImg");
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');


// Basic settings for the video to get from Webcam
    const constraints = {
        audio: false,
        video: isMobile2() ? {
            facingMode: {
                exact: 'environment',
            },
        } : true,
    };

// This condition will ask permission to user for Webcam access
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                video.srcObject = stream;
                //
                // const tracks = stream.getTracks();
                //
                // for (let i = 0; i < tracks.length; i++) {
                //     const track = tracks[i];
                //     console.log('track ->');
                //     console.log(track);
                // }

            })
            .catch(function( e ) {
                document.body.innerHTML = '😔😔😔';
                document.body.style.fontSize = '200px';
                console.log("Something went wrong!");
                console.log(e);
            });
    }

    // Request the user's camera.
    // video.requestUserMedia({ video: true }, () => {
    //     // The user has granted access to their camera.
    //
    //     // Start the video stream.
    //     video.play();
    //

    function stop(e) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            track.stop();
        }
        video.srcObject = null;
    }

    const barcodeDetectorLog = document.getElementById( 'barcodeDetectorLog' );
    const preview = document.getElementById( 'preview' );




    //     // Analyze the video stream.
        setInterval(async () =>  {
            if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {

                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;

// Draw the current frame of the video onto the canvas element.
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// Get a blob URL for the canvas element.
                const blobURL = canvas.toDataURL();

// Create an image element and set its source to the blob URL.
                const image = new Image();
                image.src = blobURL;

// Display the image element.
//                 document.body.appendChild(image);
                const scan = await processFile( image, barcodeDetector );


                if ( ! scan?.startsWith( 'No bar' ) ) {
                    stop();
                    barcodeDetectorLog.innerHTML = `<p>Bar code: <b>${ scan }</b></p>`;
                    preview.textContent = 'Result:';
                    videoCont.hidden = true;
                    canvas.hidden = true;
                    finalImg.hidden = false;
                    finalImg.src = blobURL;
                }
                else {
                    barcodeDetectorLog.textContent = scan;
                }
            }
        }, 100);
    // });
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

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}

function isMobile2() {
    return isMobile() || /Windows Mobile|iemobile|Puffin|Silk|Opera Mini/i.test( navigator.userAgent );
}