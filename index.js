var rect = {
    width: 20,
    height: 20
}

var isSkip = false;
var radius = 3;
var cols = 40;
var rows = 40;

var canvas = document.getElementById('rect');
canvas.width = rect.width * cols + (radius*rect.width*2);
canvas.height = rect.height * rows + (radius*rect.height*2);
var ctx = canvas.getContext('2d');
var alpha = 125/255;

function draw() {
    var extend = {
        width: (radius*2),
        height: (radius*2)
    }

    for(var i=0; i<rows + extend.height; i++) {
        for(var j=0; j<cols + extend.width; j++) {
            var exWidth = extend.width/2;
            var exHeight = extend.height/2;

            if( exWidth > j ||
                exHeight > i ||
                colorData[i-exHeight] === undefined ||
                colorData[i-exHeight][j-exWidth] === undefined) {
                ctx.strokeRect(j * rect.width, i * rect.height, rect.width, rect.height);
                continue
            }

            let color = colorData[i-exHeight][j-exWidth];

            if(color.a === 0) {
                ctx.strokeRect(j * rect.width, i * rect.height, rect.width, rect.height);
            }

            else {
                ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
                ctx.fillRect(j * rect.width, i * rect.height, rect.width, rect.height);
            }
        }
    }
}

var dotCanvas = document.getElementById('dot');
var dotCtx = dotCanvas.getContext('2d');
dotCtx.drawImage(document.getElementById('pika'), 0, 0);

var dotData = dotCtx.getImageData(0, 0, dotCanvas.width, dotCanvas.height);
var data = dotData.data;

var colorData = [];

const r = 0, g = 1, b = 2, a = 3;
for(var i=0; i<data.length; i+=4) {
    let idx = Math.floor(i/4);
    let row = Math.floor(idx / dotCanvas.width);
    let col = idx % dotCanvas.width;

    if(colorData[row] === undefined) {
        colorData[row] = [];
    }

    colorData[row][col] = {
        r: data[i+r],
        g: data[i+g],
        b: data[i+b],
        a: data[i+a]/255
    };
}

draw();

var alphaBinarization = function () {
    this.viewCanvas = document.getElementById('view');
    this.viewCanvas.width = canvas.width;
    this.viewCanvas.height = canvas.height;
    this.bainaryCount = 0;
    this.extend = {
        width: (radius*2),
        height: (radius*2)
    }

    this.viewCtx = this.viewCanvas.getContext('2d');
    this.idx = 0;
    this.flick = 0;
    this.isSkip = false;
    this.isStop = false;
}

alphaBinarization.prototype.stop = function () {
    this.isStop = true;
}

alphaBinarization.prototype.skip = function () {
    this.isSkip = true;


    if(this.viewCtx) {
        var length = ((cols + this.extend.width) * (rows + this.extend.height));
        for(var i=this.idx; i<length; i++) {
            let {col, row, isBinary} = this.test()

            if(isBinary) {
                ctx.fillStyle = `rgba(124, 252, 0, 1)`;
                ctx.fillRect(col * rect.width, row * rect.height, rect.width, rect.height);
            }

            this.idx++;
        }

        let {col, row, isBinary} = this.test()
        this.viewCtx.clearRect(0, 0, this.viewCanvas.width, this.viewCanvas.height);
        this.viewCtx.fillStyle = `rgba(237, 172, 177, 0)`;
        this.viewCtx.fillRect(col * rect.width, row * rect.height, rect.width, rect.height);
    }
}

alphaBinarization.prototype.execute = function () {
    if(this.isStop)
        return;

    this.idx++;

    if(this.idx > ((cols + this.extend.width) * (rows + this.extend.height))) {
        clearInterval(intervalHandler);
        intervalHandler = null;
        scenario.next();
        
        return;
    }

    let {isBinary, color, col, row} = this.test();
    document.getElementById('rgba').textContent = `(${color.r}, ${color.g}, ${color.b}, ${parseInt(color.a * 255)})`;

    if(isBinary) {
        if(this.bainaryCount === 0) {
            if(scenario) {
                arrow.style.left = (35 + col * rect.width) + 'px';
                arrow.style.top = (55 + row * rect.height) + 'px';
                scenario.next();
            }
        }

        this.bainaryCount++;
        if(!isSkip) {
            clearInterval(intervalHandler);
            intervalHandler = null;
        }

        else if(intervalHandler === null) {
            intervalHandler = setInterval(() => {
                binary.execute()
            }, 50)
        }
    }

    else if(intervalHandler === null) {
        intervalHandler = setInterval(() => {
            binary.execute()
        }, 50)
    }

}

alphaBinarization.prototype.test = function () {
    var row = Math.floor(this.idx / (cols + this.extend.width));
    var col = this.idx % (cols + this.extend.width);

    var colorIdx = {
        col: col - (this.extend.width/2),
        row: row - (this.extend.height/2),
    };

    var isBinary = false;
    var color = null;
    if((colorIdx.col >= 0 && colorIdx.col < cols) && (colorIdx.row >= 0 && colorIdx.row < rows)) {
        color = colorData[colorIdx.row][colorIdx.col];
        if(color.a !== 0 && color.a > alpha) {
            isBinary = true;
        }
    }

    if(color === null) {
        color = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        }
    }

    return {
        col: col,
        row: row,
        isBinary: isBinary,
        color: color
    }
}

alphaBinarization.prototype.draw = function () {
    if(this.isSkip)
        return;

    if(this.viewCtx) {
        let {col, row, isBinary} = this.test()
        let flick = 1;

        if(isBinary) {
            ctx.fillStyle = `rgba(124, 252, 0, 1)`;
            ctx.fillRect(col * rect.width, row * rect.height, rect.width, rect.height);
            flick = Math.sin(this.flick/15);
        }

        this.viewCtx.clearRect(0, 0, this.viewCanvas.width, this.viewCanvas.height);
        this.viewCtx.fillStyle = `rgba(237, 172, 177, ${flick})`;
        this.viewCtx.fillRect(col * rect.width, row * rect.height, rect.width, rect.height);
        this.flick++;
    }
}

var binary = new alphaBinarization();

function binaryDraw() {
    if(binary)
        binary.draw()

    if(binary && !binary.isSkip)
        requestAnimationFrame(binaryDraw)
}

requestAnimationFrame(binaryDraw)

function execute() {
    binary.execute()
}

var intervalHandler = null;
document.getElementById('parameter').style.left = canvas.width + 'px'

function toggle() {
    isSkip = !isSkip;
    if(document.getElementById('skip'))
        document.getElementById('skip').textContent = isSkip ? 'normal' : 'skip';
}

function skip() {
    clearInterval(intervalHandler);
    intervalHandler = null;

    binary.skip();
}

var dilation = function () {
    this.isSkip = false;
    this.isStop = false;
    this.binarizationArray = this.alphaBinarization(dotCanvas)
    this.mask = this.getMask(radius, true);
    this.canvas = document.getElementById('view');
    this.ctx = this.canvas.getContext('2d');
    this.idx = 0;
    this.dilCount = 0;
    this.binaryCount = 0;
    this.flick = 0;
    this.dilationCanvas = document.getElementById('dilation');
    this.dilationCanvas.width = this.canvas.width;
    this.dilationCanvas.height = this.canvas.height;
    this.dilationCtx = this.dilationCanvas.getContext('2d');
    this.extend = {
        width: (radius*2),
        height: (radius*2)
    };
}

dilation.prototype.stop = function () {
    this.isStop = true;
}

dilation.prototype.skip = function () {
    this.isSkip = true;

    var length = (cols + this.extend.width) * (rows + this.extend.height);
    for(var i=0; i<length; i++) {
        var col = i % (cols + (radius*2));
        var row = Math.floor(i / (rows + (radius*2)));

        if(col >= radius && col <= dotCanvas.width && row >= radius) {
            var idx = ((row - radius) * dotCanvas.width) + (col-radius)

            if(this.binarizationArray[idx] === 1){
                const check = this.checkFourCardinalPoint(dotCanvas.width, idx, this.binarizationArray)
                if(check){
                    this.dilationCtx.fillStyle = `rgba(0, 0, 0, 1)`;
                    this.dilationCtx.fillRect( col * rect.width, row * rect.height, rect.width, rect.height);

                    for(var j=0; j<this.mask.length; j++) {
                        this.dilationCtx.fillRect( (col + this.mask[j][0]) * rect.width, (row + this.mask[j][1]) * rect.height, rect.width, rect.height);
                    }
                }
            }
        }
    }
}

dilation.prototype.getMask = function (radius, isDilate) {
    const arr = []

    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            if(isDilate){
                if (Math.round(Math.sqrt(x*x + y*y)) === radius){
                    arr.push([x,y])
                }
            } else{
                if (Math.round(Math.sqrt(x*x + y*y)) <= radius){
                    arr.push([x,y])
                }
            }
        }
    }
    return arr
}

dilation.prototype.checkFourCardinalPoint =  function (width, idx, binarizationArray) {
    const checkArray = [idx - width, idx - 1, idx + 1, idx + width]
    let num = 0
    const total = checkArray.length
    for( ;num < total; num++){
        if(binarizationArray[checkArray[num]] === 0 || binarizationArray[checkArray[num]] === undefined){
            return true
        }
    }
    return false
};

dilation.prototype.test = function (x, y) {
    x += radius;
    y += radius;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = `rgba(237, 172, 177, 1)`;
    this.ctx.fillRect( x * rect.width, y * rect.height, rect.width, rect.height);
    for(var j=0; j<this.mask.length; j++) {
        this.ctx.fillRect( (x + this.mask[j][0]) * rect.width, (y + this.mask[j][1]) * rect.height, rect.width, rect.height);
    }
}

dilation.prototype.draw = function () {
    if(this.isSkip) {
        return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.flick++;
    var i = this.idx;
    var col = i % (cols + (radius*2));
    var row = Math.floor(i / (rows + (radius*2)));

    if(col >= radius && col <= dotCanvas.width && row >= radius) {
        var idx = ((row - radius) * dotCanvas.width) + (col-radius)
        if(colorData[row-radius]) {
            var color = colorData[row-radius][col-radius];
            if(color && color.a !== 0)
                document.getElementById('rgba').textContent = `(${color.r}, ${color.g}, ${color.b}, ${Math.floor(color.a*255)})`;
        }

        if(this.binarizationArray[idx] === 1){
            this.ctx.fillStyle = `rgba(0, 0, 0, ${Math.sin(this.flick/15)})`;
            var cardinalPoint = [[-1, 0], [0, -1], [1, 0], [0, 1]];

            for(var i=0; i<cardinalPoint.length; i++) {
                this.ctx.fillRect( (col + cardinalPoint[i][0]) * rect.width, (row + cardinalPoint[i][1]) * rect.height, rect.width, rect.height);
            }

            const check = this.checkFourCardinalPoint(dotCanvas.width, idx, this.binarizationArray)
            if(check){
                this.dilationCtx.fillStyle = `rgba(0, 0, 0, 1)`;
                this.dilationCtx.fillRect( col * rect.width, row * rect.height, rect.width, rect.height);

                for(var j=0; j<this.mask.length; j++) {
                    this.dilationCtx.fillRect( (col + this.mask[j][0]) * rect.width, (row + this.mask[j][1]) * rect.height, rect.width, rect.height);
                }
            }
        }
    }

    this.ctx.fillStyle = `rgba(237, 172, 177, 1)`;
    this.ctx.fillRect( col * rect.width, row * rect.height, rect.width, rect.height);
    for(var j=0; j<this.mask.length; j++) {
        this.ctx.fillRect( (col + this.mask[j][0]) * rect.width, (row + this.mask[j][1]) * rect.height, rect.width, rect.height);
    }
}

dilation.prototype.alphaBinarization = function (canvas) {
    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let data = imgData.data
    const dataLength = data.length
    const binarizationArray = []
    let i = 0
    let p = 0

    for (; p < dataLength; p += 4, i++) {
        if (data[p + 3] > 125) {
            binarizationArray[i] = 1;

        } else {
            binarizationArray[i] = 0;
        }
    }

    return binarizationArray;
}

dilation.prototype.excute = function () {
    if(this.isStop)
        return;

    this.idx++;

    var i = this.idx;
    var col = i % (cols + (radius*2));
    var row = Math.floor(i / (rows + (radius*2)));

    if(col >= radius && col <= dotCanvas.width && row >= radius) {
        var idx = ((row - radius) * dotCanvas.width) + (col - radius)
        if (this.binarizationArray[idx] === 1) {
            this.binaryCount++;
            const check = this.checkFourCardinalPoint(dotCanvas.width, idx, this.binarizationArray);
            if(check) {
                this.dilCount++;
            }
        }
    }

    if(intervalHandler === null)
        intervalHandler = setInterval(() => {
            dilationExecute()
        }, 50)

    if(this.binaryCount === 1 && intervalHandler !== null) {
        clearInterval(intervalHandler);
        intervalHandler = null;

        if(this.dilCount === 1)
            scenario.keys.splice(scenario.keys.indexOf('dilationDescript_5_check'), 1);
        else
            scenario.keys.splice(scenario.keys.indexOf('dilationDescript_5_cardinal'), 1);

        scenario.next();
    }

    if(this.dilCount === 1 && intervalHandler !== null) {
        clearInterval(intervalHandler);
        intervalHandler = null;

        if(this.binaryCount !== 1)
            scenario.next();
    }
}

dilation.prototype.isAnimation = function () {
    return this.idx<(cols + this.extend.width) * (rows + this.extend.height);
}

var dil = new dilation();

function dilationExecute() {
    dil.excute();
}

function dilDraw() {
    dil.draw();

    if(dil.isAnimation())
        requestAnimationFrame(dilDraw)
}

//requestAnimationFrame(dilDraw)