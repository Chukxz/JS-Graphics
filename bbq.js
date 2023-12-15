(function() {
    "use strict"

    var brotX = document.getElementById("rotx")
    var brotY = document.getElementById("roty")
    var brotZ = document.getElementById("rotz")
    var btransX = document.getElementById("transx")
    var btransY = document.getElementById("transy")
    var btransZ = document.getElementById("transz")
    var bscaleX = document.getElementById("scalex")
    var bscaleY = document.getElementById("scaley")
    var bscaleZ = document.getElementById("scalez")
    var bangle = document.getElementById("angle")
    var bnearZ = document.getElementById("nearz")
    var bfarZ = document.getElementById("farz")

    //Default values

    var brX = 0,
        brY = 0,
        brZ = 0,
        btX = 0,
        btY = 0,
        btZ = 0,
        bSx = 1,
        bSy = 1,
        bSz = 1,
        bAng = 45,
        bNz = 1,
        bFz = 10;

    var canvas = document.getElementById("maincanvas"),
        ctx = canvas.getContext("2d"),
        width = (window.innerWidth - 100),
        height = (window.innerHeight - 100),
        ar = width / height,
        dropdown = document.getElementById("drop"),

        canvas_object = {
            "Canvas": [],
            "Canvas_Num": 0
        };

    dropdown.style.top = `${Math.round(-height+25)}px`


    var deepCopy = JSON.parse.toString
    if (typeof(structuredClone) == "function") {
        var deepCopy = structuredClone
    }

    var DrawnObjectsList = [
            [
                [100, 400],
                [100, 400],
                [5, 10], 1, 1, 1
            ],
            [
                [450, 300],
                [450, 325],
                [5, 10], 1, 1, 1
            ]
        ],


        DrawnObjectsDict = {}

    /* Instance Counter */

    class Counter {
        constructor() {
            this.counter = -1;
        }

        change(value) {
            this.counter = value;
            return this
        }

        add() {
            this.counter++;
            return this
        }

        subtract() {
            this.counter--;
            return this
        }

        value() {
            return this.counter;
        }
    }

    class ArrOp {
        constructor() {}
        createArray(length) {
            var arr = new Array(length || 0),
                i = length;

            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1)
                while (i--) arr[length - 1 - i] = this.createArray.apply(this, args)
            }
            return arr
        }

        modArr(ret, arr, shape) {
            if (shape[0] == 1) {
                for (let index in arr) {
                    ret[0][index] = arr[index]
                }
                return ret
            } else if (shape[1] == 1) {
                for (let index in arr) {
                    ret[index][0] = arr[index]
                }
                return ret
            } else return arr
        }

        unModArr(ret, arr, shape) {
            if (shape[0] == 1) {
                for (let index in arr[0]) {
                    ret[index] = arr[0][index]
                }
                return ret
            } else if (shape[1] == 1) {
                for (let index in arr) {
                    ret[index] = arr[index][0]
                }
                return ret
            } else return arr
        }
    }

    /*
    2 x 2 Array 
    Array.from(Array(2), () => new Array(4))
    */


    class TransfMat {
        constructor() {
            this.mode = "deg"
        }
        changeMode(mode) {
            this.mode = mode
            return this
        }

        runMode(angle) {
            if (this.mode === "deg") {
                return (Math.PI / 180) * angle;
            } else if (this.mode === "rad") {
                return angle
            }
        }
        getIndex(a, b, val) {
            return (a * val) + b
        }
        rotMat2d(angle) {
            angle = this.runMode(angle)
            return [
                [Math.cos(angle), -1 * Math.sin(angle), 0],
                [Math.sin(angle), Math.cos(angle, 0), 0]
            ]
        }

        // Pitch
        rotX(angle) {
            angle = this.runMode(angle)
            return [
                [1, 0, 0],
                [0, Math.cos(angle), -Math.sin(angle)],
                [0, Math.sin(angle), Math.cos(angle)]
            ]
        }

        // Yaw
        rotY(angle) {
            angle = this.runMode(angle)
            return [
                [Math.cos(angle), 0, Math.sin(angle)],
                [0, 1, 0],
                [-Math.sin(angle), 0, Math.cos(angle)]
            ]
        }

        //Roll
        rotZ(angle) {
            angle = this.runMode(angle)
            return [
                [Math.cos(angle), -Math.sin(angle), 0],
                [Math.sin(angle), Math.cos(angle), 0],
                [0, 0, 1]
            ]
        }

        translMat2d(x, y) {
            return [
                [1, 0, x],
                [0, 1, y],
                [0, 0, 1]
            ]
        }
        transl3d(x, y, z) {
            return [
                [1, 0, 0, x],
                [0, 1, 0, y],
                [0, 0, 1, z],
                [0, 0, 0, 1]
            ]
        }
        scale3dim(x, y, z) {
            return [
                [x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]
            ]
        }
        refMat2d(param) {
            if (param == "x") {
                return [
                    [1, 0, 0],
                    [0, -1, 0],
                    [0, 0, 1]
                ]
            }
            if (param == "y") {
                return [
                    [-1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ]
            }
            if (param == "y=x") {
                return [
                    [0, 1, 0],
                    [1, 0, 0],
                    [0, 0, 1]
                ]
            }
            if (param == "y=-x") {
                return [
                    [0, -1, 0],
                    [-1, 0, 0],
                    [0, 0, 1]
                ]
            }
            if (param == "o") {
                return [
                    [-1, 0, 0],
                    [0, -1, 0],
                    [0, 0, 1]
                ]
            } else return [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]
        }
        scaleMat2d(x, y) {
            return [
                [x, 0, 0],
                [0, y, 0],
                [0, 0, 1]
            ]
        }
        shearMat(angle, x, y) {
            angle = this.runMode(angle)
            return [
                [1, Math.tan(angle), 0],
                [Math.tan(angle), 1, 0],
                [0, 0, 1]
            ]
        }
        matMult(matA, matB, matC, shapeA, shapeB) {
            if ((shapeA[1] == shapeB[0]) && shapeA[1] > 0) {
                for (let i = 0; i < shapeA[0]; i++) {
                    for (let j = 0; j < shapeB[1]; j++) {
                        let sum = 0
                        for (let k = 0; k < shapeB[0]; k++) {
                            sum += matA[i][k] * matB[k][j]
                        }
                        matC[i][j] = sum
                    }
                }
            }
            return matC
        }
    }

    class CoordinateSpace {
        constructor() {}

        LtoR(arr, helper, param, val, arrop, transfMat) {
            let res = helper.reflect(arr, param, arrop, transfMat),
                ret = helper.translate(res, val, arrop, transfMat)
            return ret
        }

        RtoL(arr, helper, param, val, arrop, transfMat) {
            let res = helper.translate(arr, val, arrop, transfMat)
            let ret = helper.reflect(res, param, arrop, transfMat)
            return ret
        }
    }

    class CoordinateSpaceHelper {
        constructor() {
            this.tfS = [3, 3]
            this.hS = [3, 1]
        }

        reflect(arr, param, arrop, transfMat) {
            let index = 0,
                matC = arrop.createArray(3, 1),
                refArr = arrop.createArray(3, 1),
                modarrSpace = arrop.createArray(3, 1),
                unmodarrSpace = arrop.createArray(3, 1)

            for (let n in arr) {
                let modarr = arrop.modArr(deepCopy(modarrSpace), arr[n], this.hS)
                let unmodarr = transfMat.matMult(transfMat.refMat2d(90, param), modarr, matC, this.tfS, this.hS)
                refArr[index] = arrop.unModArr(deepCopy(unmodarrSpace), unmodarr, this.hS)
                index++
            }
            return refArr
        }

        translate(arr, val, arrop, transfMat) {
            let index = 0,
                matC = arrop.createArray(3, 1),
                translArr = arrop.createArray(3, 1),
                modarrSpace = arrop.createArray(3, 1),
                unmodarrSpace = arrop.createArray(3, 1)

            for (let n in arr) {
                let modarr = arrop.modArr(deepCopy(modarrSpace), arr[n], this.hS)
                let unmodarr = transfMat.matMult(transfMat.translMat2d(0, val), modarr, matC, this.tfS, this.hS)
                translArr[index] = arrop.unModArr(deepCopy(unmodarrSpace), unmodarr, this.hS)
                index++
            }
            return translArr
        }
    }


    class DrawCanvas {
        constructor(instance_func, instance_object) {
            let instance = instance_func.value()
            instance_object.Canvas[instance] = { "objects": 0 }
            instance_object.Canvas_Num = instance + 1
        }
        drawCanvas(canvas, canvWidth, color, width, height, opacity) {
            canvas.style.borderStyle = 'solid';
            canvas.style.borderWidth = canvWidth;
            canvas.style.borderColor = color;
            canvas.style.opacity = opacity;
            canvas.width = width;
            canvas.height = height;
        }
    }

    class DrawBoxes {
        constructor() {}
        calc3dArray(arrX, arrY, arrZ, subDx, subDy, subDz) {
            let pointArr = [
                []
            ]
            let i = 0
            for (let x = 0; x <= subDx; x++) {
                let compX = (((arrX[1] - arrX[0]) / subDx) * x) + arrX[0]
                for (let y = 0; y <= subDy; y++) {
                    let compY = (((arrY[1] - arrY[0]) / subDy) * y) + arrY[0]
                    for (let z = 0; z <= subDz; z++) {
                        let compZ = (((arrZ[1] - arrZ[0]) / subDz) * z) + arrZ[0]
                        pointArr[i] = [compX, compY, compZ]
                        i++
                    }
                }
            }
            return [pointArr, subDx * subDy * subDz, pointArr.length]
        }
        drawBoxes(arr, subVal, fill) {
            for (let i = 0; i < subVal; i++) {
                let offset = 8 * i,
                    A = [0 + offset, 4 + offset],
                    B = [0 + offset, 1 + offset],
                    C = [0 + offset, 2 + offset]

                ctx.fillStyle = fill

                for (i of A) {
                    ctx.fillRect(arr[i][0], arr[i][1], arr[i + 1][0] - arr[i][0], arr[i + 2][1] - arr[i][1])
                }

                for (i of B) {
                    ctx.fillRect(arr[i][0], arr[i][1], arr[i + 4][0] - arr[i][0], arr[i + 2][1] - arr[i][1])
                }

                for (i of C) {
                    ctx.fillRect(arr[i][0], arr[i][1], arr[i + 4][0] - arr[i][0], arr[i + 1][1] - arr[i][1])
                }

            }
        }

        drawPoints(arr) {
            let colors = ["red", "brown", "blue", "yellow", "green", "purple", "black", "gray"],
                index = 0
            for (let i of arr) {
                ctx.beginPath()
                ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI);
                ctx.fillStyle = colors[index]
                ctx.fill();
                console.log(index, colors[index])
                index++
            }
        }

        drawFaces(arr) {
            ctx.fillStyle = "black"
            ctx.lineWidth = 1
            let guide = [
                [0, 1, 3, 2],
                [4, 5, 7, 6],
                [0, 4, 6, 2],
                [1, 5, 7, 3],
                [0, 4, 5, 1],
                [3, 7, 6, 2]
            ]
            ctx.lineWidth = 1
            ctx.strokeStyle = "black"
            for (let i in guide) {
                ctx.beginPath()
                for (let j in guide[i]) {
                    let len = guide[i].length
                    if (j == len - 1) {
                        let a = Number(i),
                            b = Number(j)
                        ctx.moveTo(arr[guide[a][b]][0], arr[guide[a][b]][1])
                        ctx.lineTo(arr[guide[a][0]][0], arr[guide[a][0]][1])
                        ctx.stroke()
                    } else {
                        let a = Number(i),
                            b = Number(j)
                        ctx.moveTo(arr[guide[a][b]][0], arr[guide[a][b]][1])
                        ctx.lineTo(arr[guide[a][b + 1]][0], arr[guide[a][b + 1]][1])
                        ctx.stroke()
                    }
                }
                //ctx.fillRect(arr[guide[i][0]][0], arr[guide[i][0]][1], arr[guide[i][3]][0], arr[guide[i][3]][1])
            }
        }
    }


    class DrawCircle {
        constructor(radius) {
            this.r = radius
        }
        drawCircle(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, this.r, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    class Clip {
        constructor() {}
        clip(arr, w, h, ar) {
            let x = arr[0],
                y = arr[1],

                halfx = w / 2,
                halfy = h / 2,

                retx = ((x - halfx) / halfx) * ar,
                rety = (y - halfy) / halfy

            return [retx, rety, arr[2]]
        }

        unClip(arr, w, h, ar) {
            let x = arr[0],
                y = arr[1],

                halfx = w / 2,
                halfy = h / 2,

                retx = ((x / ar) * halfx) + halfx,
                rety = (y * halfy) + halfy

            return [retx, rety, arr[2]]
        }

        runClip(mode, arr, width, height, ar) {
            let d = 0
            let clipArr = []
            if (mode == "clip") {
                for (let i of arr) {
                    clipArr[d] = this.clip(i, width, height, ar)
                    d++
                }
                return clipArr
            } else if (mode = "unclip") {
                for (let i of arr) {
                    clipArr[d] = this.unClip(i, width, height, ar)
                    d++
                }
                return clipArr
            } else return arr
        }
    }

    class Project {
        constructor(n, f, fov, ar) {
            this.f = f
            this.n = n
            this.w = 1
            this.fov = fov
            this.ar = 1 / ar
            this.d = 1 / (Math.tan((this.fov / 2) * (Math.PI / 180)))
            this.projectionMatrix = [
                [this.d * this.ar, 0, 0, 0],
                [0, this.d, 0, 0],
                [0, 0, (-this.n - this.f) / (this.n - this.f), (2 * this.f * this.n) / (this.n - this.f)],
                [0, 0, 1, 0]
            ]
            this.projMatShp = [4, 4]
            this.HomoVecShp = [4, 1]
        }

        changeW(val) {
            this.w = val
            return this
        }

        project(arr, arrop) {
            let res = [arr[0], arr[1], arr[2], this.w]
            let modArr = arrop.createArray(this.HomoVecShp[0], this.HomoVecShp[1])
            return arrop.modArr(modArr, res, this.HomoVecShp)
        }

        runProject(arr, arrsize, arrop, transfMat) {
            let resultArr = arrop.createArray(arrsize, 4),
                modArr = arrop.createArray(this.HomoVecShp[0], this.HomoVecShp[1]),
                index = 0,
                storeArr = arrop.createArray(arrsize, 4)

            for (let i of arr) {
                let matC = arrop.createArray(this.HomoVecShp[0], this.HomoVecShp[1])
                let val = this.project(deepCopy(i), arrop)
                storeArr[index] = deepCopy(val[2])
                let ret = transfMat.matMult(this.projectionMatrix, val, matC, this.projMatShp, this.HomoVecShp)

                resultArr[index] = arrop.unModArr(deepCopy(modArr), [
                    [ret[0] / ret[3]],
                    [ret[1] / ret[3]],
                    [ret[2] / ret[3]],
                    [ret[3] / ret[3]]
                ], this.HomoVecShp)

                index++
            }
            return resultArr
        }

        finalizeArr(arr, arrop, arrsize) {
            let retArr = arrop.createArray(arrsize, 2)
            for (let i in arr) {
                retArr[i][0] = deepCopy(arr[i][0])
                retArr[i][1] = deepCopy(arr[i][1])
            }
            return retArr
        }
    }

    class Object {
        constructor(width, height, box, cl, pr, cH, cS, arrX, arrY, arrZ, subDx, subDy, subDz, ar) {
            this.tfS = [3, 3]
            this.hS = [3, 1]
            this.width = width
            this.height = height
            this.ar = ar
            this.cl = cl
            this.pr = pr
            this.cH = cH
            this.cS = cS
            this.box = box
            this.arr = box.calc3dArray(arrX, arrY, arrZ, subDx, subDy, subDz)
            this.ret = this.runObject(deepCopy(this.arr))
            console.log(this.arr)
            return this
        }
        rotate(arrop, tf, angleX, angleY, angleZ) {
            let matC = arrop.createArray(3, 1),
                matSpace = arrop.createArray(3, 1),
                arr = deepCopy(this.arr)
            for (let i in arr[0]) {
                console.log(arr[0][i])
                let modarr = arrop.modArr(deepCopy(matSpace), arr[0][i], [3, 1])
                let x = tf.matMult(tf.rotX(angleX), modarr, deepCopy(matC), this.tfS, this.hS)
                let y = tf.matMult(tf.rotY(angleY), x, deepCopy(matC), this.tfS, this.hS)
                let z = tf.matMult(tf.rotZ(angleZ), y, deepCopy(matC), this.tfS, this.hS)
                arr[0][i] = arrop.unModArr(deepCopy(matSpace), z, [3, 1])
            }
            console.log(arr)
            return arr
        }
        translate(arrop, tf, offsetX, offsetY, offsetZ) {
            let matC = arrop.createArray(4, 1),
                matSpace = arrop.createArray(4, 1),
                arr = deepCopy(this.arr)

            for (let i in arr[0]) {
                let modArr = arrop.modArr(deepCopy(matSpace), arr[0][i], [4, 1])
                modArr[3] = [1]
                let res = tf.matMult(tf.transl3d(offsetX, offsetY, offsetZ), modArr, deepCopy(matC), [4, 4], [4, 1]),
                    ret = arrop.unModArr(deepCopy(matSpace), res, [4, 1])
                ret.pop()
                arr[0][i] = ret
            }
            return arr
        }

        scale(arrop, tf, sX, sY, sZ) {
            let matC = arrop.createArray(4, 1),
                matSpace = arrop.createArray(4, 1),
                arr = deepCopy(this.arr)

            for (let i in arr[0]) {
                let modArr = arrop.modArr(deepCopy(matSpace), arr[0][i], [4, 1])
                modArr[3] = [1]
                let res = tf.matMult(tf.scale3dim(sX, sY, sZ), modArr, deepCopy(matC), [4, 4], [4, 1]),
                    ret = arrop.unModArr(deepCopy(matSpace), res, [4, 1])
                ret.pop()
                arr[0][i] = ret
            }
            console.log(arr[0])
            return arr
        }

        runObject(arr) {
            let arrVal = arr[0],
                arrSubd = arr[1],
                arrSize = arr[2],


                cliparr = this.cl.runClip("clip", arrVal, this.width, this.height, this.ar),

                projArr = this.pr.runProject(cliparr, arrSize, arrOp, tf),

                uncliparr = this.cl.runClip("unclip", projArr, this.width, this.height, this.ar),

                fn = this.pr.finalizeArr(uncliparr, arrOp, arrSize)

            this.box.drawPoints(fn)

            this.box.drawFaces(fn)

            return fn
        }
    }

    let canvasC = new Counter(),
        drawcanvas = new DrawCanvas(canvasC.add(), canvas_object),
        tf = new TransfMat(),
        arrOp = new ArrOp()

    drawcanvas.drawCanvas(canvas, 1, "black", width, height, 0.8)

    function initiate(near, far, angle_of_view, aspect_ratio) {
        ctx.clearRect(0, 0, width, height)
        let cl = new Clip(),
            pr = new Project(near, far, angle_of_view, aspect_ratio),
            cH = new CoordinateSpaceHelper(),
            cS = new CoordinateSpace(),
            box = new DrawBoxes()

        for (let i in DrawnObjectsList) {
            let arr = DrawnObjectsList[i],
                arrX = arr[0],
                arrY = arr[1],
                arrZ = arr[2],
                subDx = arr[3],
                subDy = arr[4],
                subDz = arr[5]
            DrawnObjectsDict[`Object_${i}`] = new Object(width, height, box, cl, pr, cH, cS, arrX, arrY, arrZ, subDx, subDy, subDz, ar)
        }
    }

    function rot(x, y, z) {
        ctx.clearRect(0, 0, width, height)
        for (let i in DrawnObjectsList) {
            let inst = DrawnObjectsDict[`Object_${i}`]
            let arr = inst.arr[0],
                ret = inst.ret,
                rot = inst.rotate(arrOp, tf, x, y, z)
            console.log(arr)
            console.log(inst.runObject(rot))
            console.log(ret)
        }
    }

    function trans(x, y, z) {
        ctx.clearRect(0, 0, width, height)
        for (let i in DrawnObjectsList) {
            let inst = DrawnObjectsDict[`Object_${i}`]
            let arr = inst.arr[0],
                ret = inst.ret,
                trans = inst.translate(arrOp, tf, x, y, z)
            console.log(arr)
            console.log(inst.runObject(trans))
            console.log(ret)
        }
    }

    function scale(x, y, z) {
        ctx.clearRect(0, 0, width, height)
        for (let i in DrawnObjectsList) {
            let inst = DrawnObjectsDict[`Object_${i}`]
            let arr = inst.arr[0],
                ret = inst.ret,
                scal = inst.scale(arrOp, tf, x, y, z)
            console.log(arr)
            console.log(inst.runObject(scal))
            console.log(ret)
        }
    }

    initiate(bNz, bFz, bAng, ar)

    brotX.oninput = function() {
        brX = Number(brotX.value)
        rot(brX, brY, brZ)
    }


    brotY.oninput = function() {
        brY = Number(brotY.value)
        rot(brX, brY, brZ)
    }


    brotZ.oninput = function() {
        brZ = Number(brotZ.value)
        rot(brX, brY, brZ)
    }

    btransX.oninput = function() {
        btX = Number(btransX.value)
        trans(btX, btY, btZ)
    }


    btransY.oninput = function() {
        btY = Number(btransY.value)
        trans(btX, btY, btZ)
    }


    btransZ.oninput = function() {
        btZ = Number(btransZ.value)
        trans(btX, btY, btZ)
    }


    bscaleX.oninput = function() {
        bSx = Number(bscaleX.value)
        scale(bSx, bSy, bSz)
    }

    bscaleY.oninput = function() {
        bSy = Number(bscaleY.value)
        scale(bSx, bSy, bSz)
    }

    bscaleZ.oninput = function() {
        bSz = Number(bscaleZ.value)
        scale(bSx, bSy, bSz)
    }

    bangle.oninput = function() {
        bAng = Number(bangle.value)
        initiate(bNz, bFz, bAng, ar)
    }

    bnearZ.oninput = function() {
        bNz = Number(bnearZ.value)
        initiate(bNz, bFz, bAng, ar)
    }

    bfarZ.oninput = function() {
        bFz = Number(bfarZ.value)
        initiate(bNz, bFz, bAng, ar)
    }
    window.onresize = function() {
        width = (window.innerWidth - 100),
            height = (window.innerHeight - 100),
            ar = width / height

        dropdown.style.top = `${Math.round(-height+25)}px`
        drawcanvas.drawCanvas(canvas, 1, "black", width, height, 0.8)
        initiate(bNz, bFz, bAng, ar)
    }

}())