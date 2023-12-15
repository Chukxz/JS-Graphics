{
    "use strict";
    const pListCache = {};
    const pArgCache = {};
    const DEFAULT_PARAMS = {
        _GLOBAL_ALPHA: '1',
        _CANVAS_WIDTH: 1,
        _CANVAS_HEIGHT: 1,
        _BORDER_COLOR: 'red',
        _BORDER_WIDTH: '4',
        _BORDER_RADIUS: '2',
        _BORDER_STYLE: "solid",
        _THETA: 0,
        _ANGLE_UNIT: "deg",
        _ANGLE_CONSTANT: Math.PI / 180,
        _REVERSE_ANGLE_CONSTANT: 180 / Math.PI,
        _HANDEDNESS: "right",
        _HANDEDNESS_CONSTANT: 1,
        _X: [1, 0, 0],
        _Y: [0, 1, 0],
        _Z: [0, 0, 1],
        _Q_VEC: [0, 0, 0],
        _Q_QUART: [0, 0, 0, 0],
        _Q_INV_QUART: [0, 0, 0, 0],
        _NZ: -0.1,
        _FZ: -100,
        _PROJ_ANGLE: 60,
        _ASPECT_RATIO: 1,
        _DIST: 1,
        _HALF_X: 1,
        _HALF_Y: 1,
        _PROJECTION_MAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _INV_PROJECTION_MAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _OPEN_SIDEBAR: true,
    };
    const MODIFIED_PARAMS = JSON.parse(JSON.stringify(DEFAULT_PARAMS));
    let _ERROR_;
    (function(_ERROR_) {
        _ERROR_[_ERROR_["_NO_ERROR_"] = 1000] = "_NO_ERROR_";
        _ERROR_[_ERROR_["_SETTINGS_ERROR_"] = 2000] = "_SETTINGS_ERROR_";
        _ERROR_[_ERROR_["_MISCELLANOUS_ERROR_"] = 3000] = "_MISCELLANOUS_ERROR_";
        _ERROR_[_ERROR_["_QUARTERNION_ERROR_"] = 4000] = "_QUARTERNION_ERROR_";
        _ERROR_[_ERROR_["_MATRIX_ERROR_"] = 5000] = "_MATRIX_ERROR_";
        _ERROR_[_ERROR_["_VECTOR_ERROR_"] = 6000] = "_VECTOR_ERROR_";
        _ERROR_[_ERROR_["_PERSPECTIVE_PROJ_ERROR_"] = 7000] = "_PERSPECTIVE_PROJ_ERROR_";
        _ERROR_[_ERROR_["_CLIP_ERROR_"] = 8000] = "_CLIP_ERROR_";
        _ERROR_[_ERROR_["_LOCAL_SPACE_ERROR_"] = 9000] = "_LOCAL_SPACE_ERROR_";
        _ERROR_[_ERROR_["_WORLD_SPACE_ERROR_"] = 10000] = "_WORLD_SPACE_ERROR_";
        _ERROR_[_ERROR_["_CLIP_SPACE_ERROR_"] = 11000] = "_CLIP_SPACE_ERROR_";
        _ERROR_[_ERROR_["_SCREEN_SPACE_ERROR_"] = 12000] = "_SCREEN_SPACE_ERROR_";
        _ERROR_[_ERROR_["_OPTICAL_ELEMENT_OBJECT_ERROR_"] = 13000] = "_OPTICAL_ELEMENT_OBJECT_ERROR_";
        _ERROR_[_ERROR_["_RENDER_ERROR_"] = 14000] = "_RENDER_ERROR_";
        _ERROR_[_ERROR_["_DRAW_CANVAS_ERROR_"] = 15000] = "_DRAW_CANVAS_ERROR_";
    })(_ERROR_ || (_ERROR_ = {}));
    class Miscellanous {
        constructor() {}
            // rad_to_deg();
            // rad_to_grad();
            // deg_to_rad();
            // deg_to_grad();
            // grad_to_rad();
            // grad_to_deg();
        initDepthBuffer() {
            const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
            return new Float64Array(elementNum);
        }
        resetDepthBuffer(depthBuffer) {
            return depthBuffer.fill(Infinity);
        }
        initFrameBuffer() {
            const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
            return new Uint8Array(elementNum * 4);
        }
        resetFrameBuffer(frameBuffer) {
            return frameBuffer.map((value, index) => {
                const mod4 = index % 4;
                if (mod4 < 3) {
                    return value = 0;
                } else
                    return value = 255;
            });
        }
        getPermutationsArr(arr, permutationSize) {
            const permutations = [];

            function backtrack(currentPerm) {
                if (currentPerm.length === permutationSize) {
                    permutations.push(currentPerm.slice());
                    return;
                }
                arr.forEach((item) => {
                    if (currentPerm.includes(item))
                        return;
                    currentPerm.push(item);
                    backtrack(currentPerm);
                    currentPerm.pop();
                });
            }
            backtrack([]);
            return permutations;
        }
        getCombinationsArr(arr, combinationSize) {
            const combinations = [];

            function backtrack(startIndex, currentCombination) {
                if (currentCombination.length === combinationSize) {
                    combinations.push(currentCombination.slice());
                    return;
                }
                for (let i = startIndex; i < arr.length; i++) {
                    currentCombination.push(arr[i]);
                    backtrack(i + 1, currentCombination);
                    currentCombination.pop();
                }
            }
            backtrack(0, []);
            return combinations;
        }
        getFibonacciNum(num) {
            if (num < 0)
                return 0;
            else if (num === 0 || num === 1)
                return 1;
            else
                return this.getFibonacciNum(num - 1) + this.getFibonacciNum(num - 2);
        }
        getFibonacciSeq(start, stop) {
            var s = Math.max(start, 0);
            const hold = [];
            var n = 0;
            while (s <= stop) {
                hold[n] = this.getFibonacciNum(s);
                n++;
                s++;
            }
            return hold;
        }
        getFactorialNum(num) {
            if (num <= 1)
                return 1;
            else
                return num * this.getFactorialNum(num - 1);
        }
        getFactorialSeq(start, stop) {
            var s = Math.max(start, 0);
            const hold = [];
            var n = 0;
            while (s <= stop) {
                hold[n] = this.getFactorialNum(s);
                n++;
                s++;
            }
            return hold;
        }
        getCombinationsNum(arrlen, num) {
            return (this.getFactorialNum(arrlen) / ((this.getFactorialNum(arrlen - num)) * (this.getFactorialNum(num))));
        }
        getPermutationsNum(arrlen, num) {
            return (this.getFactorialNum(arrlen) / (this.getFactorialNum(arrlen - num)));
        }
        interpolateTriCore1(pvec, avec, bvec, cvec) {
            const indexList = [0, 1];
            const Adist = _Linear.getDist(bvec, cvec, indexList);
            const Bdist = _Linear.getDist(avec, cvec, indexList);
            const Cdist = _Linear.getDist(avec, bvec, indexList);
            const apdist = _Linear.getDist(pvec, avec, indexList);
            const bpdist = _Linear.getDist(pvec, bvec, indexList);
            const cpdist = _Linear.getDist(pvec, cvec, indexList);
            return [Adist, Bdist, Cdist, apdist, bpdist, cpdist];
        }
        interpolateTriCore2(pvec, avec, bvec, cvec) {
            const [Adist, Bdist, Cdist, apdist, bpdist, cpdist] = this.interpolateTriCore1(pvec, avec, bvec, cvec);
            const TotalArea = _Linear.getTriArea(Adist, Bdist, Cdist);
            const triA = _Linear.getTriArea(Adist, bpdist, cpdist);
            const triB = _Linear.getTriArea(Bdist, apdist, cpdist);
            const triC = _Linear.getTriArea(Cdist, apdist, bpdist);
            return [TotalArea, triA, triB, triC];
        }
        interpolateTriCore3(pvec, avec, bvec, cvec) {
            const [TotalArea, triA, triB, triC] = this.interpolateTriCore2(pvec, avec, bvec, cvec);
            const aRatio = triA / TotalArea;
            const bRatio = triB / TotalArea;
            const cRatio = triC / TotalArea;
            const aPa = _Matrix.scaMult(aRatio, avec);
            const bPb = _Matrix.scaMult(bRatio, bvec);
            const cPc = _Matrix.scaMult(cRatio, cvec);
            return _Matrix.matAdd(_Matrix.matAdd(aPa, bPb), cPc);
        }
        interpolateTri(pvec, avec, bvec, cvec) {
            return this.interpolateTriCore3(pvec, avec, bvec, cvec);
        }
        getBoundingRect(...vertices) {
            return this.getBoundingRectImpl(vertices);
        }
        getBoundingRectImpl(vertices) {
            var n = vertices.length;
            var xArr = [0, 0, 0];
            var yArr = [0, 0, 0];
            var xmin = Infinity;
            var ymin = Infinity;
            var xmax = 0;
            var ymax = 0;
            for (let i = 0; i < n; i++) {
                xArr[i] = vertices[i][0];
                yArr[i] = vertices[i][1];
                if (xArr[i] < xmin) {
                    xmin = xArr[i];
                }
                if (yArr[i] < ymin) {
                    ymin = yArr[i];
                }
                if (xArr[i] > xmax) {
                    xmax = xArr[i];
                }
                if (yArr[i] > ymax) {
                    ymax = yArr[i];
                }
            }
            return [xmin, ymin, xmax - xmin, ymax - ymin];
        }
        getParamAsList(maxPLen, paramList) {
            if (arguments.length === 2) {
                const key = `${paramList}-${maxPLen}`;
                if (pListCache[key] !== undefined) {
                    return pListCache[key];
                }
                var count = 0;
                var compParamList = [];
                for (let i of paramList) {
                    if (i < maxPLen) {
                        compParamList[count] = i;
                        count++;
                    }
                }
                pListCache[key] = compParamList;
                return compParamList;
            }
            return _ERROR_._MISCELLANOUS_ERROR_;
        }
        getParamAsArg(maxPLen = Infinity, ...args) {
            const key = `${args}-${maxPLen}`;
            if (pArgCache[key] !== undefined) {
                return pArgCache[key];
            }
            if (arguments.length > 1 && arguments.length <= 4) {
                var start = 0;
                var end = maxPLen;
                var interval = 1;
                if (arguments.length === 2) {
                    if (arguments[1] !== undefined) {
                        end = Math.min(arguments[1], maxPLen);
                    } else {
                        end = maxPLen;
                    }
                } else {
                    start = arguments[1] || 0;
                    if (arguments[1] !== undefined) {
                        end = Math.min(arguments[2], maxPLen);
                    } else {
                        end = maxPLen;
                    }
                    interval = arguments[3] || 1;
                }
                var count = 0;
                var index = 0;
                var compParamList = [];
                for (let i = start; i < end; i++) {
                    index = start + (count * interval);
                    if (index < end) {
                        compParamList[count] = index;
                        count++;
                    }
                }
                pArgCache[key] = compParamList;
                return compParamList;
            }
            return _ERROR_._MISCELLANOUS_ERROR_;
        }
        createArrayFromArgs(length) {
            var arr = new Array(length || 0),
                i = length;
            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1);
                while (i--) {
                    arr[length - 1 - i] = this.createArrayFromArgs.apply(this, args);
                }
            }
            return arr;
        }
        createArrayFromList(param) {
            var arr = new Array(param[0] || 0),
                i = param[0];
            if (param.length > 1) {
                var args = Array.prototype.slice.call(param, 1);
                while (i--) {
                    arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this, args);
                }
            }
            return arr;
        }
        deepCopy(val) {
            var res = JSON.parse(JSON.stringify(val));
            if (typeof structuredClone === "function") {
                res = structuredClone(val);
            }
            return res;
        }
    }
    class Linear {
        constructor() {}
        getSlope(A_, B_) {
            var numer = B_[0] - A_[0];
            var denum = B_[1] - A_[1];
            return numer / denum;
        }
        getMid(a, b, paramList) {
            var ret = [];
            var count = 0;
            for (let val of paramList) {
                ret.push([(a[val] + b[val]) / 2]);
                count++;
            }
            return ret;
        }
        getDist(a, b, paramList) {
            var ret = 0;
            const pLen = paramList.length;
            for (let val = 0; val < pLen; val++) {
                ret += (a[val] - b[val]) ** 2;
            }
            return Math.sqrt(ret);
        }
        getTriArea(a, b, c) {
            var S = (a + b + c) / 2;
            return Math.sqrt(S * (S - a) * (S - b) * (S - c));
        }
        isInsideCirc(point, circle) {
            const x = Math.abs(point[0] - circle[0]);
            const y = Math.abs(point[1] - circle[1]);
            const r = circle[2];
            if ((x ** 2 + y ** 2) <= r ** 2) {
                return true;
            } else
                return false;
        }
        isInsideTri(pvec, avec, bvec, cvec) {
            const [TotalArea, triA, triB, triC] = _Miscellenous.interpolateTriCore2(pvec, avec, bvec, cvec);
            const sum = triA + triB + triC;
            if (Math.round(sum) === Math.round(TotalArea)) {
                return true;
            }
            return false;
        }
        getCircumCircle_1(x1, y1, x2, y2, x3, y3) {
            const coeff_Mat = [2 * x1, 2 * y1, 1, 2 * x2, 2 * y2, 1, 2 * x3, 2 * y3, 1];
            const inv_coeff_Mat = _Matrix.getInvMat(coeff_Mat, 3);
            if (typeof inv_coeff_Mat !== "string") {
                const y_Mat = [-(x1 ** 2 + y1 ** 2), -(x2 ** 2 + y2 ** 2), -(x3 ** 2 + y3 ** 2)];
                const x_Mat = _Matrix.matMult(inv_coeff_Mat, y_Mat, [3, 3], [3, 1]);
                const [G, F, C] = x_Mat;
                return [-G, -F, Math.sqrt(((-G) ** 2) + (-F) ** 2 - C)];
            }
            return [1, 1, 1];
        }
        getCircumCircle_2(x1, y1, x2, y2, x3, y3) {
            const param_list = [0, 1];
            const mid_AB = _Linear.getMid([x1, y1], [x2, y2], param_list);
            const mid_AC = _Linear.getMid([x1, y1], [x3, y3], param_list);
            const grad_AB = _Linear.getSlope([x1, y1], [x2, y2]);
            const grad_AC = _Linear.getSlope([x1, y1], [x3, y3]);
            const norm_AB = -1 / grad_AB;
            const norm_AC = -1 / grad_AC;
            const intercept_norm_AB = mid_AB[1] - (norm_AB * mid_AB[0]);
            const intercept_norm_AC = mid_AC[1] - (norm_AC * mid_AC[0]);
            const X = (intercept_norm_AB - intercept_norm_AC) / (norm_AC - norm_AB);
            const Y = (norm_AC * X) + intercept_norm_AC;
            const r_squared = (x1 - X) ** 2 + (y1 - Y) ** 2;
            return [X, Y, Math.sqrt(r_squared)];
        }
        getInscribedCircle_1(x1, y1, x2, y2, x3, y3) {
            const param_list = [0, 1];
            const a = _Linear.getDist([x2, y2], [x3, y3], param_list);
            const b = _Linear.getDist([x1, y1], [x3, y3], param_list);
            const c = _Linear.getDist([x1, y1], [x2, y2], param_list);
            const A = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c));
            const C = Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
            const half_A = A * 0.5;
            const half_C = C * 0.5;
            const grad_AC = _Linear.getSlope([x1, y1], [x3, y3]);
            const grad_AB = _Linear.getSlope([x1, y1], [x2, y2]);
            const grad_BC = _Linear.getSlope([x2, y2], [x3, y3]);
            const test_AO_1 = (grad_AC + Math.tan(half_A)) / (1 + Math.tan(half_A) * grad_AC);
            const test_AO_2 = (grad_AC + Math.tan(half_A)) / (1 - Math.tan(half_A) * grad_AC);
            const grad_AO = test_AO_1 * grad_AB >= 0 ? test_AO_1 : test_AO_2;
            const test_OC_1 = (grad_AC + Math.tan(half_C)) / (1 + Math.tan(half_C) * grad_AC);
            const test_OC_2 = (grad_AC + Math.tan(half_C)) / (1 - Math.tan(half_C) * grad_AC);
            const grad_OC = test_OC_1 * grad_BC >= 0 ? test_OC_1 : test_OC_2;
            const intercept_grad_AO = y1 - (grad_AO * x1);
            const intercept_grad_OC = y3 - (grad_OC * x3);
            const X = (intercept_grad_OC - intercept_grad_AO) / (grad_AO - grad_OC);
            const Y = (grad_AO * X) + intercept_grad_AO;
            const norm_AC = -1 / grad_AC;
            const intercept_grad_AC = y1 - (grad_AC * x1);
            const intercept_norm_AC = Y - (norm_AC * X);
            const perp_AC_X = (intercept_norm_AC - intercept_grad_AC) / (grad_AC - norm_AC);
            const perp_AC_Y = (norm_AC * X) + intercept_norm_AC;
            const r_squared = (X - perp_AC_X) ** 2 + (Y - perp_AC_Y) ** 2;
            return [X, Y, Math.sqrt(r_squared)];
        }
        getInscribedCircle_2(x1, y1, x2, y2, x3, y3) {
            const grad_AC = _Linear.getSlope([x1, y1], [x3, y3]);
            const grad_AB = _Linear.getSlope([x1, y1], [x2, y2]);
            const grad_BC = _Linear.getSlope([x2, y2], [x3, y3]);
            const A = Math.atan(Math.abs((grad_AB - grad_AC) / (1 + grad_AB * grad_AC)));
            const C = Math.atan(Math.abs((grad_BC - grad_AC) / (1 + grad_BC * grad_AC)));
            const half_A = A * 0.5;
            const half_C = C * 0.5;
            const test_AO_1 = (grad_AC + Math.tan(half_A)) / (1 + Math.tan(half_A) * grad_AC);
            const test_AO_2 = (grad_AC + Math.tan(half_A)) / (1 - Math.tan(half_A) * grad_AC);
            const grad_AO = test_AO_1 * grad_AB >= 0 ? test_AO_1 : test_AO_2;
            const test_OC_1 = (grad_AC + Math.tan(half_C)) / (1 + Math.tan(half_C) * grad_AC);
            const test_OC_2 = (grad_AC + Math.tan(half_C)) / (1 - Math.tan(half_C) * grad_AC);
            const grad_OC = test_OC_1 * grad_BC >= 0 ? test_OC_1 : test_OC_2;
            const intercept_grad_AO = y1 - (grad_AO * x1);
            const intercept_grad_OC = y3 - (grad_OC * x3);
            const X = (intercept_grad_OC - intercept_grad_AO) / (grad_AO - grad_OC);
            const Y = (grad_AO * X) + intercept_grad_AO;
            const norm_AC = -1 / grad_AC;
            const intercept_grad_AC = y1 - (grad_AC * x1);
            const intercept_norm_AC = Y - (norm_AC * X);
            const perp_AC_X = (intercept_norm_AC - intercept_grad_AC) / (grad_AC - norm_AC);
            const perp_AC_Y = (norm_AC * X) + intercept_norm_AC;
            const r_squared = (X - perp_AC_X) ** 2 + (Y - perp_AC_Y) ** 2;
            return [X, Y, Math.sqrt(r_squared)];
        }
    }
    class Matrix {
        constructor() {}
        matMult(matA, matB, shapeA, shapeB) {
            const matC = [];
            if (shapeA[1] === shapeB[0]) {
                for (let i = 0; i < shapeA[0]; i++) {
                    for (let j = 0; j < shapeB[1]; j++) {
                        var sum = 0;
                        for (let k = 0; k < shapeB[0]; k++) {
                            sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                        }
                        matC.push(sum);
                    }
                }
            }
            return matC;
        }
        scaMult(scalarVal, matIn, leaveLast = false) {
            const matInlen = matIn.length;
            const matOut = [];
            for (let i = 0; i < matInlen; i++) {
                if (i === matInlen - 1 && leaveLast === true) {
                    // Do nothing...don't multiply the last matrix value by the scalar value
                    // useful when perspective division is going on.
                    matOut.push(matIn[i]);
                } else {
                    matOut.push(matIn[i] * scalarVal);
                }
            }
            return matOut;
        }
        matAdd(matA, matB, neg = false) {
            const matAlen = matA.length;
            const matBlen = matB.length;
            const matC = [];
            if (matAlen === matBlen) {
                const sgn = neg === true ? -1 : 1;
                for (let i = 0; i < matAlen; i++) {
                    matC.push(matA[i] + sgn * matB[i]);
                }
            }
            return matC;
        }
        getTranspMat(matIn, shapeMat) {
            const shpA = shapeMat[0];
            const shpB = shapeMat[1];
            const matOut = [];
            for (let i = 0; i < shpB; i++) {
                for (let j = 0; j < shpA; j++) {
                    matOut.push(matIn[(j * shpB) + i]);
                }
            }
            return matOut;
        }
        getIdentMat(val) {
            const num = val ** 2;
            const matOut = [];
            var c = 0;
            for (let i = 0; i < num; i++) {
                if (i === c) {
                    matOut.push(1);
                    c += val + 1;
                } else {
                    matOut.push(0);
                }
            }
            return matOut;
        }
        getRestMat(matIn, shapeNum, row, column) {
            const matOut = [];
            for (let i = 0; i < shapeNum; i++) {
                for (let j = 0; j < shapeNum; j++) {
                    if (i !== row && j !== column) {
                        matOut.push(matIn[(i * shapeNum) + j]);
                    }
                }
            }
            return matOut;
        }
        getDet(matIn, shapeNum) {
            if (shapeNum < 0) {
                return 0;
            }
            // If it is a 1x1 matrix, return the matrix
            if (shapeNum === 1) {
                return matIn[0];
            }
            // If it is a 2x2 matrix, return the determinant
            if (shapeNum === 2) {
                return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
            }
            // If it an nxn matrix, where n > 2, recursively compute the determinant,
            //using the first row of the matrix
            else {
                var res = 0;
                const tmp = [];
                for (let i = 0; i < shapeNum; i++) {
                    tmp.push(matIn[i]);
                }
                const cofMatSgn = this.getCofSgnMat([1, shapeNum]);
                var a = 0;
                const cofLen = cofMatSgn.length;
                for (let i = 0; i < cofLen; i++) {
                    var ret = this.getRestMat(matIn, shapeNum, a, i);
                    var verify = this.getDet(ret, shapeNum - 1);
                    res += (cofMatSgn[i] * tmp[i] * verify);
                }
                return res;
            }
        }
        getMinorMat(matIn, shapeNum) {
            const matOut = [];
            for (let i = 0; i < shapeNum; i++) {
                for (let j = 0; j < shapeNum; j++) {
                    const result = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1);
                    matOut.push(result);
                }
            }
            return matOut;
        }
        getCofSgnMat(shapeMat) {
            const shpA = shapeMat[0];
            const shpB = shapeMat[1];
            const matOut = [];
            for (let i = 0; i < shpA; i++) {
                for (let j = 0; j < shpB; j++) {
                    if ((i + j) % 2 === 0) {
                        matOut.push(1);
                    } else
                        matOut.push(-1);
                }
            }
            return matOut;
        }
        getCofMat(matIn, shapeNum) {
            const cofMatSgn = this.getCofSgnMat([shapeNum, shapeNum]);
            var minorMat = this.getMinorMat(matIn, shapeNum);
            const matOut = [];
            const len = Math.sign(shapeNum) * shapeNum ** 2;
            for (let i = 0; i < len; i++) {
                matOut.push(cofMatSgn[i] * minorMat[i]);
            }
            return matOut;
        }
        getAdjMat(matIn, shapeNum) {
            const result = this.getCofMat(matIn, shapeNum);
            return this.getTranspMat((result), [shapeNum, shapeNum]);
        }
        getInvMat(matIn, shapeNum) {
            const det_result = this.getDet(matIn, shapeNum);
            if (det_result === 0)
                return _ERROR_._MATRIX_ERROR_.toString();
            const adj_result = this.getAdjMat(matIn, shapeNum);
            return _Matrix.scaMult(1 / det_result, (adj_result));
        }
    }
    class Vector {
        constructor() {}
        mag(vec) {
            const v_len = vec.length;
            var magnitude = 0;
            for (let i = 0; i < v_len; i++) {
                magnitude += vec[i] ** 2;
            }
            return Math.sqrt(magnitude);
        }
        normalizeVec(vec) {
            const len = Math.round(vec.length);
            const magnitude = this.mag(vec);
            const ret_vec = [];
            for (let i = 0; i < len; i++) {
                ret_vec[i] = vec[i] / magnitude;
            }
            return ret_vec;
        }
        dotProduct(vecA_or_magA, vecB_or_magB, angle = undefined) {
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 2d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
            // Use vectors if you know the components e.g [x,y] values for 2d vectors, [x,y,z] values for 3d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
            if (typeof angle === "number") { // Magnitude use.
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
                return vecA_or_magA * vecB_or_magB * Math.cos(toRad);
            }
            const vec_a_len = vecA_or_magA.length;
            const vec_b_len = vecB_or_magB.length;
            //verify first that both vectors are of the same size and both are 2d or higher.
            if (vec_a_len === vec_b_len && vec_b_len >= 2) {
                var dot_product = 0;
                for (let i = 0; i < vec_a_len; i++) {
                    dot_product += vecA_or_magA[i] * vecB_or_magB[i];
                }
                return dot_product;
            }
            return 0;
        }
        getDotProductAngle(vecA, vecB) {
            const dot_product = this.dotProduct(vecA, vecB);
            const cosAng = Math.acos(dot_product / (this.mag(vecA) * this.mag(vecB)));
            return MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * cosAng;
        }
        getCrossProductByMatrix(vecs, vecs_len) {
            var cross_product = [];
            const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var matrix_array_top_row = [];
            for (let i = 0; i < proper_vec_len; i++) {
                matrix_array_top_row[i] = 0; // Actually the number 0 is just a placeholder as we don't need any numbers here but we put 0 to make it a number array.
            }
            var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            var other_rows_array = [];
            for (let i = 0; i < vecs_len; i++) {
                const vec_len = vecs[i].length;
                if (vec_len !== proper_vec_len)
                    same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else
                    other_rows_array.push(...vecs[i]); // Else if the vector is the same dimension with n + 1, push the vector to a matrix array.
            }
            if (same_shape === 0) { // All the vectors are the same dimension of n + 1.
                const matrix_array = [...matrix_array_top_row, ...other_rows_array];
                const storeCofSgn = _Matrix.getCofSgnMat([proper_vec_len, 1]);
                for (let i = 0; i < proper_vec_len; i++) {
                    const rest_matrix_array = _Matrix.getRestMat(matrix_array, proper_vec_len, 0, i);
                    cross_product[i] = storeCofSgn[i] * _Matrix.getDet(rest_matrix_array, vecs_len);
                }
            }
            return cross_product;
        }
        crossProduct(vecs_or_mags, angle = undefined, unitVec = undefined) {
            var cross_product = [];
            const vecs_or_mags_len = vecs_or_mags.length;
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 3d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
            // Use vectors if you know the components e.g [x,y,z] values for 3d vectors, [w,x,y,z] values for 4d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
            if (typeof angle === "undefined") { // Vector use.
                cross_product = [...this.getCrossProductByMatrix(vecs_or_mags, vecs_or_mags_len)];
            }
            if (typeof angle === "number") { // Magnitude use.
                var magnitude = 1; // initial magnitude place holder
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
                for (let i = 0; i < vecs_or_mags_len; i++) {
                    magnitude *= vecs_or_mags[i];
                }
                if (typeof unitVec === "undefined")
                    cross_product = magnitude * Math.sin(toRad);
                else if (typeof unitVec === "object")
                    cross_product = _Matrix.scaMult(magnitude * Math.sin(toRad), unitVec);
            }
            return cross_product;
        }
        getCrossProductAngle(vecs) {
            var cross_product_angle = undefined;
            const vecs_len = vecs.length;
            const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            const cross_product_mag = this.mag(this.crossProduct(vecs));
            var vecs_m = 1;
            for (let i = 0; i < vecs_len; i++) {
                const vec_len = vecs[i].length;
                if (vec_len !== proper_vec_len)
                    same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else
                    vecs_m *= this.mag(vecs[i]);
            }
            if (same_shape === 0) {
                const sinAng = Math.asin(cross_product_mag / vecs_m);
                const fromRad = MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * sinAng;
                cross_product_angle = fromRad;
            }
            return typeof cross_product_angle === "undefined" ? cross_product_angle = _ERROR_._VECTOR_ERROR_ : cross_product_angle;
        }
        getCrossPUnitVec(vecs) {
            var cross_product_unit_vec = [];
            const cross_product = this.crossProduct(vecs);
            const cross_product_mag = this.mag(cross_product);
            cross_product_unit_vec = _Matrix.scaMult(1 / cross_product_mag, cross_product);
            return cross_product_unit_vec;
        }
    }
    class PerspectiveProjection {
        constructor() {}
        changeNearZ(val) {
            MODIFIED_PARAMS._NZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        }
        changeFarZ(val) {
            MODIFIED_PARAMS._FZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        }
        changeProjAngle(val) {
            MODIFIED_PARAMS._PROJ_ANGLE = val;
            this.setPersProjectParam();
        }
        setPersProjectParam() {
            MODIFIED_PARAMS._DIST = 1 / (Math.tan(MODIFIED_PARAMS._PROJ_ANGLE / 2 * MODIFIED_PARAMS._ANGLE_CONSTANT));
            MODIFIED_PARAMS._PROJECTION_MAT = [MODIFIED_PARAMS._DIST / MODIFIED_PARAMS._ASPECT_RATIO, 0, 0, 0, 0, MODIFIED_PARAMS._DIST, 0, 0, 0, 0, (-MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ), (2 * MODIFIED_PARAMS._FZ * MODIFIED_PARAMS._NZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ), 0, 0, 1, 0];
            const inverse_res = _Matrix.getInvMat(MODIFIED_PARAMS._PROJECTION_MAT, 4);
            if (typeof inverse_res === "string")
                return;
            MODIFIED_PARAMS._INV_PROJECTION_MAT = inverse_res;
        }
        persProject(input_array) {
            return _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT, input_array, [4, 4], [4, 1]);
        }
        invPersProject(input_array) {
            return _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT, input_array, [4, 4], [4, 1]);
        }
    }
    const _Miscellenous = new Miscellanous();
    const _Linear = new Linear();
    const _Matrix = new Matrix();
    const _Vector = new Vector();
    const _PerspectiveProjection = new PerspectiveProjection();


    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");

    canvas.width = 1300;
    canvas.height = 600;
    canvas.style.borderWidth = 1;
    canvas.style.borderStyle = "solid";
    canvas.style.borderColor = "blue";
    ctx.globalAlpha = 0.4


    function drawCircle(a, b, r, fill_style = "red", stroke_style = "black") {

        ctx.beginPath();
        ctx.arc(a, b, r, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fillStyle = fill_style;
        ctx.fill();

        const area = Math.PI * r * r;
        const circumference = 2 * Math.PI * r;
        ctx.lineWidth = Math.round(Math.sqrt(area / circumference));

        ctx.strokeStyle = stroke_style;
        ctx.stroke();
    }

    // drawCircle(300, 400, 50);

    function drawTriangle(x1, y1, x2, y2, x3, y3, fill_style = "green", stroke_style = "black") {

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        ctx.fillStyle = fill_style;
        ctx.fill();

        const a = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2);
        const b = Math.sqrt((x3 - x1) ** 2 + (y3 - y1) ** 2);
        const c = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const perimeter = a + b + c;
        const semiperimeter = perimeter / 2;
        const area = Math.sqrt(semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c));
        ctx.lineWidth = Math.round(Math.sqrt(area / perimeter));

        ctx.strokeStyle = stroke_style;
        ctx.stroke();
    }


    const tri_coords = [200, 400, 300, 100, 500, 450];

    drawTriangle(...tri_coords);


    const test1 = _Linear.getCircumCircle_1(...tri_coords);

    const test2 = _Linear.getCircumCircle_2(...tri_coords);

    console.log(test1);

    console.log(test2)

    // drawCircle(...test1);

    // drawCircle(...test2);

    const test3 = _Linear.getInscribedCircle_1(...tri_coords);

    const test4 = _Linear.getInscribedCircle_2(...tri_coords);

    console.log(test3);

    console.log(test4)

    drawCircle(...test3);

    drawCircle(...test4);
    // const d = Math.PI * r * r;
    // const e = 2 * Math.PI * r;
    // ctx.fillText(d, a * 3, b * 3, a + b)
    // ctx.fillText(e, a * 5, b * 3, a + b)
    // ctx.fillText(Math.round(Math.sqrt(d / e)), a * 7, b * 3, a + b)
}