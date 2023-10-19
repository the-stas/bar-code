let stateArea;

init();

function init() {
    // const barcodeDetector = new window.BarcodeDetectionAPI.BarcodeDetector( {
    //     formats: [ "upc_a", "upc_e" ]
    // } );

    document.getElementById( 'uploadInput' ).addEventListener( 'change', uploadInputChange );
    // document.getElementById( 'clear' ).addEventListener( 'click', ( e ) => {
    //     e.preventDefault();
    //     const barcodeDetectorLog = document.getElementById( 'barcodeDetectorLog' );
    //
    //     barcodeDetectorLog.innerHTML = '';
    //     rawFiles = [];
    //     adaptedFiles = [];
    //     uniqueNameForFileCounter = 0;
    // } );
}

function uploadInputChange( e ) {
    if (e.target.files && e.target.files.length) {
        decode(URL.createObjectURL(e.target.files[0]));
    }
}

function decode(src) {
    var config = {
        inputStream: {
            size: 800,
                singleChannel: false
        },
        locator: {
            patchSize: "medium",
                halfSample: true
        },
        decoder: {
            readers: [ "upc_reader", "upc_e_reader" ],
        },
        locate: true,
            src: src,
        };

    Quagga.decodeSingle(config, function(result) {});
}

Quagga.onProcessed(function(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay,
        area;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
        }

        if (stateArea) {
            area = calculateRectFromArea(drawingCanvas, stateArea);
            drawingCtx.strokeStyle = "#0F0";
            drawingCtx.strokeRect(area.x, area.y, area.width, area.height);
        }
    }
});

function calculateRectFromArea(canvas, area) {
    var canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        top = parseInt(area.top)/100,
        right = parseInt(area.right)/100,
        bottom = parseInt(area.bottom)/100,
        left = parseInt(area.left)/100;

    top *= canvasHeight;
    right = canvasWidth - canvasWidth*right;
    bottom = canvasHeight - canvasHeight*bottom;
    left *= canvasWidth;

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    };
}

Quagga.onDetected(function(result) {
    var code = result.codeResult.code,
        canvas = Quagga.canvas.dom.image;

    document.querySelector("#result_strip ul.thumbnails").innerHTML = '' +
        '<li>' +
            '<div class="thumbnail">' +
                '<div class="imgWrapper">' +
                    '<img alt="" src="' + canvas.toDataURL() + '">' +
                '</div>' +
                '<div class="caption">' +
                    '<h4 class="code">' + code + '</h4>' +
                '</div>' +
            '</div>' +
        '</li>';
});