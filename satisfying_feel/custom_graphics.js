//
(function () {
    "use strict";
    const pListCache = {};
    const pArgCache = {};
    // const scrW = screen.width;
    // const scrH = screen.height;
    // var prevW = 0;
    // var prevH = 0;
    // var speed = 0;
    // var prev = Date.now()
    const canvas = document.getElementsByTagName('canvas')[0];
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const status = document.getElementById("status");
    const anim_number = document.getElementById("anim1_value");
    const anim_number_input = document.getElementById("animation_number");
    const anim_speed = document.getElementById("anim2_value");
    const anim_speed_input = document.getElementById("animation_speed");
    const anim_info_btn = document.getElementById("anim_info");
    const after_anim1 = document.getElementById("after_anim1");
    const c_1 = document.getElementById("c_1");
    const c_2 = document.getElementById("c_2");
    const c_3 = document.getElementById("c_3");
    const c_elems = document.getElementsByClassName("cdv_elem");
    const hovered = { color: document.getElementById('hoveredColor'), pixel: document.getElementById('hoveredPixel') };
    const selected = { color: document.getElementById('selectedColor'), pixel: document.getElementById('selectedPixel') };
    var drop = document.getElementById('drop');
    let _ERROR_;
    (function (_ERROR_) {
        _ERROR_[_ERROR_["_NO_ERROR_"] = 1000000000000] = "_NO_ERROR_";
        _ERROR_[_ERROR_["_SETTINGS_ERROR_"] = 1000000000001] = "_SETTINGS_ERROR_";
        _ERROR_[_ERROR_["_MISCELLANOUS_ERROR_"] = 1000000000002] = "_MISCELLANOUS_ERROR_";
        _ERROR_[_ERROR_["_QUARTERNION_ERROR_"] = 1000000000003] = "_QUARTERNION_ERROR_";
        _ERROR_[_ERROR_["_MATRIX_ERROR_"] = 1000000000004] = "_MATRIX_ERROR_";
        _ERROR_[_ERROR_["_VECTOR_ERROR_"] = 1000000000005] = "_VECTOR_ERROR_";
        _ERROR_[_ERROR_["_PERSPECTIVE_PROJ_ERROR_"] = 1000000000006] = "_PERSPECTIVE_PROJ_ERROR_";
        _ERROR_[_ERROR_["_CLIP_ERROR_"] = 1000000000007] = "_CLIP_ERROR_";
        _ERROR_[_ERROR_["_LOCAL_SPACE_ERROR_"] = 1000000000008] = "_LOCAL_SPACE_ERROR_";
        _ERROR_[_ERROR_["_WORLD_SPACE_ERROR_"] = 1000000000009] = "_WORLD_SPACE_ERROR_";
        _ERROR_[_ERROR_["_CLIP_SPACE_ERROR_"] = 1000000000010] = "_CLIP_SPACE_ERROR_";
        _ERROR_[_ERROR_["_SCREEN_SPACE_ERROR_"] = 1000000000011] = "_SCREEN_SPACE_ERROR_";
        _ERROR_[_ERROR_["_OPTICAL_ELEMENT_OBJECT_ERROR_"] = 1000000000012] = "_OPTICAL_ELEMENT_OBJECT_ERROR_";
        _ERROR_[_ERROR_["_RENDER_ERROR_"] = 1000000000013] = "_RENDER_ERROR_";
        _ERROR_[_ERROR_["_DRAW_CANVAS_ERROR_"] = 1000000000014] = "_DRAW_CANVAS_ERROR_";
    })(_ERROR_ || (_ERROR_ = {}));
    const DEFAULT_PARAMS = {
        _GLOBAL_ALPHA: 1,
        _CANVAS_OPACITY: '1',
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
        _OPEN_SIDEBAR: false,
    };
    const MODIFIED_PARAMS = JSON.parse(JSON.stringify(DEFAULT_PARAMS));
    class BackwardsCompatibilitySettings {
        test_array;
        compatibility_error;
        error_pos;
        // Composition is used as we don't want to compute the basic error-checking everytime.
        constructor() {
            this.test_array = new Array();
            this.compatibility_error = false;
            this.error_pos = [];
            this.flat_exists();
            this.map_exists();
            this.reduce_exists();
            this.reverse_exists();
            this.push_exists();
            this.forEach_exists();
            this.detect_compatibility_issues();
        }
        detect_compatibility_issues() {
            const test_array_len = this.test_array.length;
            var inc = 0;
            for (let i = 0; i < test_array_len; i++) {
                if (this.test_array[i] === false) {
                    this.error_pos[inc] = i;
                    inc++;
                }
                this.compatibility_error = this.error_pos.length > 0;
            }
        }
        flat_exists() {
            if (typeof this.test_array.flat !== "undefined" && typeof this.test_array.flat === "function")
                this.test_array[0] = true;
            else
                this.test_array[0] = false;
        }
        map_exists() {
            if (typeof this.test_array.map !== "undefined" && typeof this.test_array.map === "function")
                this.test_array[1] = true;
            else
                this.test_array[1] = false;
        }
        ;
        reduce_exists() {
            if (typeof this.test_array.reduce !== "undefined" && typeof this.test_array.reduce === "function")
                this.test_array[2] = true;
            else
                this.test_array[2] = false;
        }
        ;
        reverse_exists() {
            if (typeof this.test_array.reverse !== "undefined" && typeof this.test_array.reverse === "function")
                this.test_array[3] = true;
            else
                this.test_array[3] = false;
        }
        ;
        push_exists() {
            if (typeof this.test_array.push !== "undefined" && typeof this.test_array.push === "function")
                this.test_array[4] = true;
            else
                this.test_array[4] = false;
        }
        forEach_exists() {
            if (typeof this.test_array.forEach !== "undefined" && typeof this.test_array.forEach === "function")
                this.test_array[5] = true;
            else
                this.test_array[5] = false;
        }
    }
    class BasicSettings {
        // Miscellanous
        object_vertices;
        prev_hovered_vertices_array;
        hovered_vertices_array;
        pre_selected_vertices_array;
        selected_vertices_array;
        constructor() {
            drop.style.top = `${-drop.offsetTop + canvas.offsetTop}px`;
            this.setCanvas();
            this.resetCanvasToDefault();
            window.addEventListener("resize", () => this.refreshCanvas());
        }
        setGlobalAlpha(alpha) {
            MODIFIED_PARAMS._GLOBAL_ALPHA = alpha;
        }
        setCanvasOpacity(opacity) {
            MODIFIED_PARAMS._CANVAS_OPACITY = opacity;
        }
        setCanvas() {
            // Canvas
            var width = window.innerWidth - 80;
            if (MODIFIED_PARAMS._OPEN_SIDEBAR === true)
                width = window.innerWidth - 300;
            const height = window.innerHeight - 100;
            MODIFIED_PARAMS._CANVAS_WIDTH = width;
            MODIFIED_PARAMS._CANVAS_HEIGHT = height;
            // Coordinate Space
            MODIFIED_PARAMS._HALF_X = width / 2;
            MODIFIED_PARAMS._HALF_Y = height / 2;
            // Perspective Projection
            MODIFIED_PARAMS._ASPECT_RATIO = width / height;
        }
        // initCanvas() {
        //     this.ocanvas.width = this.canvW;
        //     this.ocanvas.height = this.canvH;
        //     this.canvas.style.borderStyle = this.bordStyle;
        //     this.canvas.style.borderWidth = `${this.bordW}px`;
        //     this.canvas.style.borderColor = this.color;
        //     this.canvas.style.opacity = this.opacity;
        //     this.canvas.width = this.canvW;
        //     this.canvas.height = this.canvH;
        // }
        resetCanvasToDefault() {
            canvas.style.borderColor = DEFAULT_PARAMS._BORDER_COLOR;
            canvas.style.borderWidth = DEFAULT_PARAMS._BORDER_WIDTH;
            canvas.style.borderRadius = DEFAULT_PARAMS._BORDER_RADIUS;
            canvas.style.borderStyle = DEFAULT_PARAMS._BORDER_STYLE;
            ctx.globalAlpha = DEFAULT_PARAMS._GLOBAL_ALPHA;
        }
        refreshCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.setCanvas();
        }
        changeAngleUnit(angleUnit) {
            MODIFIED_PARAMS._ANGLE_UNIT = angleUnit;
            MODIFIED_PARAMS._ANGLE_CONSTANT = this.angleUnit(angleUnit);
            MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT = this.revAngleUnit(angleUnit);
        }
        setHandedness(value) {
            if (value === 'left')
                MODIFIED_PARAMS._HANDEDNESS_CONSTANT = -1;
            else if (value === 'right')
                MODIFIED_PARAMS._HANDEDNESS_CONSTANT = 1;
        }
        angleUnit(angle_unit) {
            if (angle_unit === "deg")
                return Math.PI / 180; // deg to rad
            else if (angle_unit === "rad")
                return 1; // rad to rad
            else if (angle_unit === 'grad')
                return Math.PI / 200; // grad to rad
            else
                return _ERROR_._SETTINGS_ERROR_;
        }
        revAngleUnit(angle_unit) {
            if (angle_unit === "deg")
                return 180 / Math.PI; // rad to deg
            else if (angle_unit === "rad")
                return 1; // rad to rad
            else if (angle_unit === 'grad')
                return 200 / Math.PI; // rad to grad
            else
                return _ERROR_._SETTINGS_ERROR_;
        }
    }
    const _BasicSettings = new BasicSettings();
    class Miscellanous {
        constructor() { }
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
                }
                else
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
        getCombinationsNum(n, r) {
            return (this.getFactorialNum(n) / ((this.getFactorialNum(n - r)) * (this.getFactorialNum(r))));
        }
        getPermutationsNum(n, r) {
            return (this.getFactorialNum(n) / (this.getFactorialNum(n - r)));
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
            return [0];
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
                    }
                    else {
                        end = maxPLen;
                    }
                }
                else {
                    start = arguments[1] || 0;
                    if (arguments[1] !== undefined) {
                        end = Math.min(arguments[2], maxPLen);
                    }
                    else {
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
            return [0];
        }
        createArrayFromArgs(length) {
            var arr = new Array(length || 0), i = length;
            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1);
                while (i--) {
                    arr[length - 1 - i] = this.createArrayFromArgs.apply(this, args);
                }
            }
            return arr;
        }
        createArrayFromList(param) {
            var arr = new Array(param[0] || 0), i = param[0];
            if (param.length > 1) {
                var args = Array.prototype.slice.call(param, 1);
                while (i--) {
                    arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this, args);
                }
            }
            return arr;
        }
        getArrayIndex(array, value) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] === value)
                    return i;
                else
                    return -1;
            }
            return -1;
        }
        deepCopy(val) {
            var res = JSON.parse(JSON.stringify(val));
            if (typeof structuredClone === "function") {
                res = structuredClone(val);
            }
            return res;
        }
        toPoints(pointList) {
            const retList = [];
            for (let point in pointList) {
                retList[point] = new Point2D(pointList[point][0], pointList[point][1]);
            }
            return retList;
        }
        genEdgefromArray(array, sort = true) {
            var prev = array[array.length - 1]; // set previous to last element in the array
            var a = 0;
            var b = 0;
            const result = [];
            for (let index in array) {
                if (sort === true) {
                    [a, b] = [Math.min(prev, array[index]), Math.max(prev, array[index])];
                }
                else
                    [a, b] = [prev, array[index]];
                result[index] = `${a}-${b}`;
                prev = array[index];
            }
            return result;
        }
        genArray(min, n, diff, decimal) {
            const list = [];
            for (let i = 0; i < n; i++) {
                if (decimal === true)
                    list[i] = min + Math.random() * diff;
                else if (decimal === false)
                    list[i] = Math.round(min + Math.random() * diff);
            }
            return list;
        }
        generatePointsArray(minX = 0, maxX = 100, minY = 0, maxY = 100, n = 10, decimal = false) {
            const _minX = Math.min(minX, maxX);
            const _maxX = Math.max(minX, maxX);
            const _minY = Math.min(minY, maxY);
            const _maxY = Math.max(minY, maxY);
            const diffX = _maxX - _minX;
            const diffY = _maxY - _minY;
            const xlist = this.genArray(_minX, n, diffX, decimal);
            const ylist = this.genArray(_minY, n, diffY, decimal);
            const xylist = [];
            for (let i = 0; i < n; i++) {
                xylist[i] = [xlist[i], ylist[i]];
            }
            return xylist;
        }
        getRanHex = (size = 1) => [...Array(size)].map((elem) => elem = Math.floor(Math.random() * 16).toString(16)).join("");
        ranHexCol = (num = 100, size = 6, exclude_col = "black") => [...Array(num)].map((elem, index) => elem = index === 0 ? exclude_col : "#" + this.getRanHex(size));
    }
    const _Miscellanous = new Miscellanous();
    class Linear {
        constructor() { }
        getSlope(A_, B_) {
            var numer = B_[1] - A_[1];
            var denum = B_[0] - A_[0];
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
            const x = Math.abs(point.x - circle[0]);
            const y = Math.abs(point.y - circle[1]);
            const r = circle[2];
            if ((x ** 2 + y ** 2) <= r ** 2) {
                return true;
            }
            else
                return false;
        }
        isInsideTri(pvec, avec, bvec, cvec) {
            const [TotalArea, triA, triB, triC] = this.interpolateTriCore2(pvec, avec, bvec, cvec);
            const sum = triA + triB + triC;
            if (Math.round(sum) === Math.round(TotalArea)) {
                return true;
            }
            return false;
        }
        getCircumCircle(a, b, c) {
            const mid_AB = [(a.x + b.x) / 2, (a.y + b.y) / 2];
            const mid_AC = [(a.x + c.x) / 2, (a.y + c.y) / 2];
            const grad_AB = (b.y - a.y) / (b.x - a.x);
            const grad_AC = (c.y - a.y) / (c.x - a.x);
            const norm_AB = -1 / grad_AB;
            const norm_AC = -1 / grad_AC;
            const intercept_norm_AB = mid_AB[1] - (norm_AB * mid_AB[0]);
            const intercept_norm_AC = mid_AC[1] - (norm_AC * mid_AC[0]);
            var X = 0;
            var Y = 0;
            var compute_X = true;
            var compute_Y = true;
            if (Math.abs(grad_AB) === 0) {
                X = mid_AB[0];
                compute_X = false;
            }
            else if (Math.abs(grad_AB) === Infinity) {
                Y = mid_AB[1];
                compute_Y = false;
            }
            if (Math.abs(grad_AC) === 0) {
                X = mid_AC[0];
                compute_X = false;
            }
            else if (Math.abs(grad_AC) === Infinity) {
                Y = mid_AC[1];
                compute_Y = false;
            }
            if (compute_X === true)
                X = (intercept_norm_AB - intercept_norm_AC) / (norm_AC - norm_AB);
            if (compute_Y === true)
                Y = (norm_AB * X) + intercept_norm_AB;
            const r_squared = (a.x - X) ** 2 + (a.y - Y) ** 2;
            return new Point2D(X, Y, (Math.sqrt(r_squared)));
        }
        getInCircle(a, b, c) {
            const BC = Math.sqrt((c.x - b.x) ** 2 + (c.y - b.y) ** 2);
            const AC = Math.sqrt((c.x - a.x) ** 2 + (c.y - a.y) ** 2);
            const AB = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
            const X = (BC * a.x + AC * b.x + AB * c.x) / (AB + AC + BC);
            const Y = (BC * a.y + AC * b.y + AB * c.y) / (AB + AC + BC);
            const s = (AB + AC + BC) / 2;
            const r_squared = ((s - AB) * (s - AC) * (s - BC)) / s;
            return new Point2D(X, Y, (Math.sqrt(r_squared)));
        }
        findCircTriFSq(rect, angle = 45) {
            var mid = (rect[2] / 2) + rect[0];
            var lSmall = rect[2] / 2;
            var hSmall = Math.tan((angle * Math.PI) / 180) * lSmall;
            var hBig = hSmall + rect[3];
            var lBig = hBig / (Math.tan((angle * Math.PI) / 180));
            var A = new Point2D(mid - lBig, rect[1] + rect[3]);
            var B = new Point2D(mid, rect[1] - hSmall);
            var C = new Point2D(mid + lBig, rect[1] + rect[3]);
            return [A, B, C];
        }
        getTriBoundingRect(vertices) {
            var n = vertices.length;
            var xArr = [0, 0, 0];
            var yArr = [0, 0, 0];
            var xmin = Infinity;
            var ymin = Infinity;
            var xmax = 0;
            var ymax = 0;
            for (let i = 0; i < n; i++) {
                xArr[i] = vertices[i].x;
                yArr[i] = vertices[i].y;
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
        superTriangle(pointList) {
            const rect = this.getTriBoundingRect(pointList);
            const tri = this.findCircTriFSq(rect);
            return tri;
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
        // Given three collinear points p,q,r, the function checks if
        // point q lies on line segment "pr"
        onSegment(p, q, r) {
            if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
                q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
                return true;
            return false;
        }
        //To find orientation of ordered triplet (p,q,r),
        //The function returns the following values
        // 0 --> p,q and r are collinear
        // 1 --> Clockwise
        // 2 --> Counterclockwise
        findOrientation(p, q, r) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
            if (val === 0)
                return 0; // collinear
            return (val > 0) ? 1 : 2; // clock or counterclock wise
        }
        // if val returned is 0, points are collinear
        // if val returned is greater than 0, points are clockwise
        // if val returned is lesser than 0, points are counterclockwise
        findOrientationDegree(p, q, r) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
            return val;
        }
        // The main function that returns true if line segment 'p1q1'
        // and 'p2q2' intersect
        doIntersect(p1, q1, p2, q2) {
            // Find the four orientations needed for general and 
            //special cases
            const o1 = this.findOrientation(p1, q1, p2);
            const o2 = this.findOrientation(p1, q1, q2);
            const o3 = this.findOrientation(p2, q2, p1);
            const o4 = this.findOrientation(p2, q2, q1);
            // General Case
            if (o1 !== o2 && o3 !== o4)
                return true;
            // Special Cases
            // p1,q1 and p2 are collinear and p2 lies on segment p1q1
            if (o1 === 0 && this.onSegment(p1, p2, q1))
                return true;
            // p1,q1 and q2 are collinear and q2 lies on segment p1q1
            if (o2 === 0 && this.onSegment(p1, q2, q1))
                return true;
            // p2,q2 and p1 are collinear and p1 lies on segment p2q2
            if (o3 === 0 && this.onSegment(p2, p1, q2))
                return true;
            // p2,q2 and q1 are collinear and q1 lies on segment p2q2
            if (o4 === 0 && this.onSegment(p2, q1, q2))
                return true;
            return false; // Doesnt't fall in any of the above cases
        }
        mostCWPoint(p, q, points) {
            var orientation = 0;
            var index = -1;
            for (let point in points) {
                const res = this.findOrientationDegree(p, q, points[point]);
                if (res > orientation) {
                    orientation = res;
                    index = Number(point);
                }
            }
            return index;
        }
        mostCCWPoint(p, q, points) {
            var orientation = 0;
            var index = -1;
            for (let point in points) {
                const res = this.findOrientationDegree(p, q, points[point]);
                if (res < orientation) {
                    orientation = res;
                    index = Number(point);
                }
            }
            return index;
        }
        getSmallestTriArea(p, p_index, q, q_index, points) {
            var area = Infinity;
            var index = -1;
            for (let point_ in points) {
                const point = Number(point_);
                if (point === p_index || point === q_index)
                    continue;
                const r = points[point];
                const pq = Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
                const pr = Math.sqrt((p.x - r.x) ** 2 + (p.y - r.y) ** 2);
                const qr = Math.sqrt((q.x - r.x) ** 2 + (q.y - r.y) ** 2);
                const tri_area = this.getTriArea(pq, pr, qr);
                if (tri_area < area) {
                    area = tri_area;
                    index = point;
                }
            }
            return index;
        }
        get_gradient(p, q) {
            return ((q.y - p.y) / (q.x - p.x));
        }
        get_distance(p, q) {
            return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
        }
        get_midpoint(p, q) {
            return new Point2D((p.x + q.x) * 0.5, (p.y + q.y) * 0.5);
        }
        getLineFromPointGradient(p, gradient, x_scale, invert = false) {
            const intercept = p.y - gradient * p.x;
            const new_x = invert ? p.x - x_scale : p.x + x_scale;
            const new_y = gradient * new_x + intercept;
            return new Point2D(new_x, new_y, 0);
        }
        specialGetLineFromPointGradient(p1, q1, p2, gradient, x_scale) {
            const intercept = p2.y - gradient * p2.x;
            const new_a_x = p2.x + x_scale;
            const new_a_y = gradient * new_a_x + intercept;
            const new_b_x = p2.x - x_scale;
            const new_b_y = gradient * new_b_x + intercept;
            const q2_a = new Point2D(new_a_x, new_a_y);
            const q2_b = new Point2D(new_b_x, new_b_y);
            const q2 = this.doIntersect(p1, q1, p2, q2_a) ? q2_a : q2_b;
            return q2;
        }
    }
    const _Linear = new Linear();
    class Quarternion {
        normalize;
        theta;
        q_vector;
        q_quarternion;
        q_inv_quarternion;
        constructor() {
            this.q_vector = DEFAULT_PARAMS._Q_VEC;
            this.q_quarternion = DEFAULT_PARAMS._Q_QUART;
            this.q_inv_quarternion = DEFAULT_PARAMS._Q_INV_QUART;
            this.theta = DEFAULT_PARAMS._THETA;
        }
        vector(input_vec) {
            // normalize flag to normalize vector (create a unit vector)
            if (this.normalize === false)
                this.q_vector = input_vec;
            else {
                const [v1, v2, v3] = input_vec;
                const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3, -0.5);
                this.q_vector = [v1 * inv_mag, v2 * inv_mag, v3 * inv_mag];
            }
        }
        quarternion() {
            // quarternion
            const [v1, v2, v3] = this.q_vector;
            const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
            this.q_quarternion = [a, v1 * b, v2 * b, v3 * b];
        }
        ;
        inv_quartenion() {
            // inverse quarternion           
            const [v1, v2, v3] = this.q_vector;
            const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
            this.q_inv_quarternion = [a, -v1 * b, -v2 * b, -v3 * b];
        }
        ;
        q_mult(quart_A, quart_B) {
            // quarternion _ quarternion multiplication
            const [w1, x1, y1, z1] = quart_A;
            const [w2, x2, y2, z2] = quart_B;
            return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2), (w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2), (w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2), (w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
        }
        q_v_invq_mult(input_vec) {
            // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
            // with additional translating (for points) and scaling (for point and vectors) capabilities
            const output_vec = [0, ...input_vec];
            return this.q_mult(this.q_quarternion, this.q_mult(output_vec, this.q_inv_quarternion)).splice(1);
        }
        q_rot(_angle = 0, _vector = [0, 0, 1], _point = [0, 0, 0]) {
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
            this.vector(_vector);
            this.quarternion();
            this.inv_quartenion();
            return this.q_v_invq_mult(_point);
        }
    }
    const _Quartenion = new Quarternion();
    class Matrix {
        constructor() { }
        // // Pitch
        // rotX(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1];
        // }
        // // Yaw
        // rotY(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, 1, 0, 0, -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, Math.cos(angle), 0, 0, 0, 0, 1];
        // }
        // //Roll
        // rotZ(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        // }
        // rot3d(x : number, y : number, z : number) : _16D_VEC_ {
        //     return this.matMult(this.rotZ(z), this.matMult(this.rotY(y), this.rotX(x), [4, 4], [4, 4]), [4, 4], [4, 4]) as _16D_VEC_;
        // };
        // transl3d(x : number, y : number, z : number) : _16D_VEC_ {
        //     return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
        // }
        // scale3dim(x : number, y : number, z : number) : _16D_VEC_ {
        //     return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
        // }
        // setObjTransfMat(Sx, Sy, Sz, Rx, Ry, Rz, Tx, Ty, Tz) {
        //     // None of the scale parameters should equal zero as that would make the determinant of the matrix
        //     // equal to zero, thereby making it impossible to get the inverse of the matrix (Zero Division Error)
        //     if (Sx === 0) {
        //         Sx += 0.01;
        //     }
        //     if (Sy === 0) {
        //         Sy += 0.01;
        //     }
        //     if (Sz === 0) {
        //         Sz += 0.01;
        //     }
        //     this.objTransfMat = this.matMult(this.transl3d(Tx, Ty, Tz), this.matMult(this.rot3d(Rx, Ry, Rz), this.scale3dim(Sx, Sy, Sz), [4, 4], [4, 4]), [4, 4], [4, 4]);
        // }
        matMult(matA, matB, shapeA, shapeB) {
            if (shapeA[1] !== shapeB[0])
                return _ERROR_._MATRIX_ERROR_;
            else {
                const matC = [];
                for (let i = 0; i < shapeA[0]; i++) {
                    for (let j = 0; j < shapeB[1]; j++) {
                        var sum = 0;
                        for (let k = 0; k < shapeB[0]; k++) {
                            sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                        }
                        matC.push(sum);
                    }
                }
                return matC;
            }
        }
        scaMult(scalarVal, matIn, leaveLast = false) {
            const matInlen = matIn.length;
            const matOut = [];
            for (let i = 0; i < matInlen; i++) {
                if (i === matInlen - 1 && leaveLast === true) {
                    // Do nothing...don't multiply the last matrix value by the scalar value
                    // useful when perspective division is going on.
                    matOut.push(matIn[i]);
                }
                else {
                    matOut.push(matIn[i] * scalarVal);
                }
            }
            return matOut;
        }
        matAdd(matA, matB, neg = false) {
            const matC = [];
            const matAlen = matA.length;
            const matBlen = matB.length;
            var sgn = 1;
            if (neg === true) {
                sgn = -1;
            }
            if (matAlen === matBlen) {
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
            for (let i = 0; i < num; i++) {
                if (i % val === 0) {
                    matOut.push(1);
                }
                else
                    matOut.push(0);
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
            if (shapeNum > 0) {
                // If it is a 1x1 matrix, return the matrix
                if (shapeNum === 1) {
                    return matIn;
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
                        verify = verify > _ERROR_._NO_ERROR_ ? verify : 1;
                        res += (cofMatSgn[i] * tmp[i] * verify);
                    }
                    return res;
                }
            }
            else
                return 0;
        }
        getMinorMat(matIn, shapeNum) {
            const matOut = [];
            for (let i = 0; i < shapeNum; i++) {
                for (let j = 0; j < shapeNum; j++) {
                    const result = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1);
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
                    }
                    else
                        matOut.push(-1);
                }
            }
            return matOut;
        }
        getCofMat(matIn, shapeNum) {
            const cofMatSgn = this.getCofSgnMat([shapeNum, shapeNum]);
            const minorMat = this.getMinorMat(matIn, shapeNum);
            const matOut = [];
            const len = shapeNum ** 2;
            for (let i = 0; i < len; i++) {
                matOut.push(cofMatSgn[i] * minorMat[i]);
            }
            return matOut;
        }
        getAdjMat(matIn, shapeNum) {
            const result = this.getCofMat(matIn, shapeNum);
            return this.getTranspMat(result, [shapeNum, shapeNum]);
        }
        getInvMat(matIn, shapeNum) {
            const det_result = this.getDet(matIn, shapeNum);
            if (det_result === 0)
                return undefined;
            const adj_result = this.getAdjMat(matIn, shapeNum);
            return _Matrix.scaMult(1 / det_result, adj_result);
        }
    }
    const _Matrix = new Matrix();
    class Vector {
        constructor() { }
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
            return cross_product_angle;
        }
        getCrossPUnitVec(vecs) {
            var cross_product_unit_vec = [];
            const cross_product = this.crossProduct(vecs);
            const cross_product_mag = this.mag(cross_product);
            cross_product_unit_vec = _Matrix.scaMult(1 / cross_product_mag, cross_product);
            return cross_product_unit_vec;
        }
    }
    const _Vector = new Vector();
    class PerspectiveProjection {
        constructor() { }
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
            if (typeof inverse_res === "undefined")
                return;
            if (inverse_res.length !== 16)
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
    const _PerspectiveProjection = new PerspectiveProjection();
    class Clip {
        constructor() { }
        canvasTo(arr) {
            const array = [...arr];
            array[0] -= MODIFIED_PARAMS._HALF_X;
            array[1] -= MODIFIED_PARAMS._HALF_Y;
            return array;
        }
        clipCoords(arr) {
            const array = [...arr];
            array[0] /= MODIFIED_PARAMS._HALF_X;
            array[1] /= MODIFIED_PARAMS._HALF_Y;
            return array;
        }
        toCanvas(arr) {
            const array = [...arr];
            array[0] += MODIFIED_PARAMS._HALF_X;
            array[1] += MODIFIED_PARAMS._HALF_Y;
            return array;
        }
        unclipCoords(arr) {
            const array = [...arr];
            array[0] *= MODIFIED_PARAMS._HALF_X;
            array[1] *= MODIFIED_PARAMS._HALF_Y;
            return array;
        }
    }
    const _Clip = new Clip();
    class LocalSpace {
        constructor() { }
        ;
        objectRotate(point, axis, angle, state) {
            if (state === "local" || state === "object")
                return _Quartenion.q_rot(angle, axis, point);
        }
        ;
        ObjectScale(point, scaling_array, state) {
            if (state === "local" || state === "object")
                return [point[0] * scaling_array[0], point[1] * scaling_array[1], point[2] * scaling_array[2]];
        }
    }
    const _LocalSpace = new LocalSpace();
    class WorldSpace {
        constructor() { }
        ObjectTransform(point, translation_array, state) {
            if (state === "world")
                return _Matrix.matAdd(point, translation_array);
        }
        ;
        objectRevolve(point, axis, angle, state) {
            if (state === "world")
                return _Quartenion.q_rot(angle, axis, point);
        }
    }
    const _WorldSpace = new WorldSpace();
    class OpticalElement {
        // Default
        // _CAM_MATRIX : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        // _INV_CAM_MATRIX : [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1],
        // actpos = [0,0,1],
        // usedpos = [0,0,-1]
        instance = {
            instance_number: 0,
            optical_type: "none",
            _ACTUAL_POS: [0, 0, 0],
            _USED_POS: [0, 0, 0],
            _LOOK_AT_POINT: [0, 0, 0],
            _U: [0, 0, 0],
            _V: [0, 0, 0],
            _N: [0, 0, 0],
            _C: [0, 0, 0],
            _MATRIX: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            _INV_MATRIX: _Matrix.getInvMat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 4),
            depthBuffer: _Miscellanous.initDepthBuffer(),
            frameBuffer: _Miscellanous.initFrameBuffer(),
        };
        constructor(optical_type_input) {
            this.instance.optical_type = optical_type_input;
            return this;
        }
        resetBuffers() {
            _Miscellanous.resetDepthBuffer(this.instance.depthBuffer);
            _Miscellanous.resetFrameBuffer(this.instance.frameBuffer);
        }
        setPos(input_array) {
            this.instance._ACTUAL_POS = input_array;
            this.instance._USED_POS = input_array;
            this.instance._USED_POS[2] = -this.instance._USED_POS[2]; // reverse point for right to left hand coordinate system
        }
        setCoordSystem() {
            const DIFF = _Matrix.matAdd(this.instance._LOOK_AT_POINT, this.instance._USED_POS, true);
            const UP = [0, 1, 0];
            this.instance._N = _Vector.normalizeVec(DIFF);
            this.instance._U = _Vector.normalizeVec(_Vector.crossProduct([UP, this.instance._N]));
            this.instance._V = _Vector.normalizeVec(_Vector.crossProduct([this.instance._N, this.instance._U]));
        }
        setConversionMatrices() {
            this.instance._MATRIX = [...this.instance._U, this.instance._C[0], ...this.instance._V, this.instance._C[1], ...this.instance._N, this.instance._C[2], ...[0, 0, 0, 1]];
            this.instance._INV_MATRIX = _Matrix.getInvMat(this.instance._MATRIX, 4);
        }
        setLookAtPos(look_at_point) {
            look_at_point[2] = -look_at_point[2]; // reverse point for right to left hand coordinate system
            this.instance._LOOK_AT_POINT = look_at_point;
            this.setCoordSystem();
            this.setConversionMatrices();
        }
        rotate(plane, angle) {
            if (plane === "U-V") {
                const _U_N = _Quartenion.q_rot(angle, this.instance._U, this.instance._N);
                const _V_N = _Quartenion.q_rot(angle, this.instance._V, this.instance._N);
                if (typeof _U_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                if (typeof _V_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                this.instance._U = _U_N;
                this.instance._V = _V_N;
            }
            else if (plane === "U-N") {
                const _U_V = _Quartenion.q_rot(angle, this.instance._U, this.instance._V);
                const _V_N = _Quartenion.q_rot(angle, this.instance._V, this.instance._N);
                if (typeof _U_V === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                if (typeof _V_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                this.instance._U = _U_V;
                this.instance._V = _V_N;
            }
            else if (plane === "V-N") {
                const _U_V = _Quartenion.q_rot(angle, this.instance._U, this.instance._V);
                const _U_N = _Quartenion.q_rot(angle, this.instance._U, this.instance._N);
                if (typeof _U_V === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                if (typeof _U_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                this.instance._U = _U_V;
                this.instance._V = _U_N;
            }
            this.setConversionMatrices();
        }
        translate(translation_array) {
            this.instance._C = translation_array;
            this.instance._ACTUAL_POS = _Matrix.matAdd(this.instance._ACTUAL_POS, translation_array);
            this.instance._USED_POS = [...this.instance._ACTUAL_POS];
            this.instance._USED_POS[2] = -this.instance._ACTUAL_POS[2]; // reverse point for right to left hand coordinate system
            this.setCoordSystem();
            this.setConversionMatrices();
        }
        worldToOpticalObject(ar) {
            const arr = [...ar, 1];
            arr[2] = -arr[2]; // reverse point for right to left hand coordinate system
            const result = _Matrix.matMult(this.instance._MATRIX, arr, [4, 4], [4, 1]);
            return result;
        }
        opticalObjectToWorld(arr) {
            const result = _Matrix.matMult(this.instance._INV_MATRIX, arr, [4, 4], [4, 1]);
            result[2] = -result[2]; // reverse point for left to right hand coordinate system
            const new_result = result.slice(0, 3);
            return new_result;
        }
    }
    class ClipSpace {
        constructor() { }
        ;
        opticalObjectToClip(arr) {
            const orig_proj = _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT, arr, [4, 4], [4, 1]);
            const pers_div = _Matrix.scaMult(1 / orig_proj[3], orig_proj, true);
            return pers_div;
        }
        ;
        clipToOpticalObject(arr) {
            const rev_pers_div = _Matrix.scaMult(arr[3], arr, true);
            const rev_orig_proj = _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT, rev_pers_div, [4, 4], [4, 1]);
            return rev_orig_proj;
        }
        ;
    }
    const _ClipSpace = new ClipSpace();
    class ScreenSpace {
        constructor() { }
        ;
        clipToScreen(arr) {
            if (arr[2] >= -1.1 && arr[2] <= 1.1 && arr[2] != Infinity) {
                arr[2] = -arr[2];
                // -array[2] (-z) reverse point for left to right hand coordinate system
                const [i, j, k, l] = _Clip.unclipCoords(arr);
                const [x, y, z, w] = _Clip.toCanvas([i, j, k, l]);
                return [x, y, z, w];
            }
            else
                return _ERROR_._SCREEN_SPACE_ERROR_;
        }
        ;
        screenToClip(arr) {
            const [i, j, k, l] = _Clip.canvasTo(arr);
            const [x, y, z, w] = _Clip.clipCoords([i, j, k, l]);
            // -array[2] (-z) reverse point for right to left hand coordinate system
            return [x, y, -z, w];
        }
        ;
    }
    const _ScreenSpace = new ScreenSpace();
    class OpticalElement_Objects {
        optical_element_array;
        instance_number;
        arrlen;
        selected_light_instances;
        selected_camera_instances;
        max_camera_instance_number;
        max_light_instance_number;
        instance_number_to_list_map;
        constructor() {
            this.arrlen = 0;
            this.instance_number = 0;
            this.max_camera_instance_number = 0;
            this.max_light_instance_number = 0;
            this.optical_element_array = [];
            this.selected_light_instances = {};
            this.selected_camera_instances = {};
            this.instance_number_to_list_map = {};
            this.createNewCameraObject();
            this.createNewLightObject();
        }
        createNewCameraObject() {
            this.max_camera_instance_number = this.instance_number;
            this.optical_element_array[this.arrlen] = new OpticalElement("camera");
            this.instance_number_to_list_map[this.instance_number] = this.arrlen;
            this.instance_number++;
            this.arrlen++;
        }
        createNewLightObject() {
            this.max_light_instance_number = this.instance_number;
            this.optical_element_array[this.arrlen] = new OpticalElement("light");
            this.instance_number_to_list_map[this.instance_number] = this.arrlen;
            this.instance_number++;
            this.arrlen++;
        }
        createNewMultipleCameraObjects = (num) => { if (num > 0)
            while (num > 0) {
                this.createNewCameraObject();
                num--;
            } };
        createNewMultipleLightObjects = (num) => { if (num > 0)
            while (num > 0) {
                this.createNewLightObject();
                num--;
            } };
        deleteOpticalObject(instance_number_input, index) {
            this.optical_element_array.splice(index, 1);
            delete this.instance_number_to_list_map[instance_number_input];
            for (const key in this.instance_number_to_list_map) {
                if (Number(key) > instance_number_input) {
                    this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
                }
            }
            if (instance_number_input in this.selected_camera_instances)
                delete this.selected_camera_instances[instance_number_input];
            if (instance_number_input in this.selected_light_instances)
                delete this.selected_light_instances[instance_number_input];
            if (Object.keys(this.selected_camera_instances).length === 0)
                this.selected_camera_instances[0] = 0;
            if (Object.keys(this.selected_light_instances).length === 0)
                this.selected_light_instances[1] = 1;
        }
        deleteCameraObject(instance_number_input) {
            if (instance_number_input > 1 && instance_number_input <= this.max_camera_instance_number) {
                const index = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[index].instance.optical_type === "camera") // additional safety checks
                 {
                    this.deleteOpticalObject(instance_number_input, index);
                    this.arrlen = this.optical_element_array.length;
                }
            }
        }
        deleteLightObject(instance_number_input) {
            if (instance_number_input > 1 && instance_number_input <= this.max_light_instance_number) {
                const index = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[index].instance.optical_type === "light") // additional safety checks
                 {
                    this.deleteOpticalObject(instance_number_input, index);
                    this.arrlen = this.optical_element_array.length;
                }
            }
        }
        // doesn't delete the first one
        deleteAllCameraObjects() {
            for (const key in this.instance_number_to_list_map) {
                const index = this.instance_number_to_list_map[key];
                if (index > 1 && this.optical_element_array[index].instance.optical_type === "camera") {
                    this.deleteOpticalObject(Number(key), index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }
        // doesn't delete the first one
        deleteAllLightObjects() {
            for (const key in this.instance_number_to_list_map) {
                const index = this.instance_number_to_list_map[key];
                if (index > 1 && this.optical_element_array[index].instance.optical_type === "light") {
                    this.deleteOpticalObject(Number(key), index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }
        // doesn't delete the first two
        deleteAllOpticalObjects() {
            for (const key in this.instance_number_to_list_map) {
                const index = this.instance_number_to_list_map[key];
                if (index > 1) {
                    this.deleteOpticalObject(Number(key), index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }
        select_camera_instance(instance_number_input) {
            if (instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
                const selection = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[selection].instance.optical_type === "camera")
                    this.selected_camera_instances[instance_number_input] = selection;
            }
        }
        deselect_camera_instance(instance_number_input) {
            if (instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
                if (instance_number_input in this.selected_camera_instances) {
                    const selection = this.instance_number_to_list_map[instance_number_input];
                    if (this.optical_element_array[selection].instance.optical_type === "camera")
                        delete this.selected_camera_instances[instance_number_input];
                    if (Object.keys(this.selected_camera_instances).length === 0) {
                        this.selected_camera_instances[0] = 0;
                        if (instance_number_input === 0)
                            return;
                    }
                }
            }
        }
        select_light_instance(instance_number_input) {
            if (instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
                const selection = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[selection].instance.optical_type === "light")
                    this.selected_light_instances[instance_number_input] = selection;
            }
        }
        deselect_light_instance(instance_number_input) {
            if (instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
                if (instance_number_input in this.selected_light_instances) {
                    const selection = this.instance_number_to_list_map[instance_number_input];
                    if (this.optical_element_array[selection].instance.optical_type === "light")
                        delete this.selected_light_instances[instance_number_input];
                    if (Object.keys(this.selected_light_instances).length === 0) {
                        this.selected_light_instances[1] = 1;
                        if (instance_number_input === 1)
                            return;
                    }
                }
            }
        }
        render(vertex, optical_type) {
            var world_to_optical_object_space = [0, 0, 0, 0];
            switch (optical_type) {
                case "none": return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                case "camera":
                    world_to_optical_object_space = this.optical_element_array[this.selected_camera_instances[0]].worldToOpticalObject(vertex);
                    break;
                case "light":
                    world_to_optical_object_space = this.optical_element_array[this.selected_light_instances[0]].worldToOpticalObject(vertex);
                    break;
            }
            const optical_object_to_clip_space = _ClipSpace.opticalObjectToClip(world_to_optical_object_space);
            return _ScreenSpace.clipToScreen(optical_object_to_clip_space);
        }
    }
    const _Optical_Objects = new OpticalElement_Objects();
    class TriangularMeshDataStructure2D {
        HalfEdgeDict;
        triangle;
        triangleList;
        edge_no;
        prev;
        next;
        temp;
        face_vertices;
        vertex_no;
        constructor(vertex_num) {
            this.HalfEdgeDict = {};
            // this.vert_len = vertex_indexes.length;
            // this.vert_array = vertex_indexes;
            this.triangle = [];
            this.triangleList = [];
            this.edge_no = 0;
            this.prev = null;
            this.next = null;
            this.temp = null;
            this.face_vertices = [];
            this.vertex_no = vertex_num;
        }
        halfEdge(start, end) {
            return {
                vertices: [start, end],
                face_vertices: [],
                twin: null,
                prev: null,
                next: null
            };
        }
        setHalfEdge(a, b) {
            let halfEdgeKey = `${a}-${b}`;
            let twinHalfEdgeKey = `${b}-${a}`;
            // If halfedge does exist in halfedge dict switch halfedge key to twin halfedge key and vice-versa
            if (this.HalfEdgeDict[halfEdgeKey]) {
                const halfEdgeKeyTemp = twinHalfEdgeKey;
                twinHalfEdgeKey = halfEdgeKey;
                halfEdgeKey = halfEdgeKeyTemp;
            }
            // If halfedge does not exist in halfedge dict, create halfedge and increment the edge number
            if (!this.HalfEdgeDict[halfEdgeKey]) {
                this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(a, b);
                this.edge_no++;
                this.HalfEdgeDict[halfEdgeKey].face_vertices = this.face_vertices;
            }
            // if twin halfedge also does exist in halfedge dict, decrement the edge number
            if (this.HalfEdgeDict[twinHalfEdgeKey]) {
                this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
                this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
                this.edge_no--;
            }
            return halfEdgeKey;
        }
        addtriangle(v1, v2, v3) {
            this.face_vertices = [v1, v2, v3];
            const min = Math.min(v1, v2, v3);
            const max = Math.max(v1, v2, v3);
            var mid = 0;
            for (let i of this.face_vertices) {
                if (i !== min && i !== max) {
                    mid = i;
                    break;
                }
            }
            this.face_vertices = [min, mid, max]; // ensure triangle numbers are ordered in ascending order
            // If triangle is not found in triangle list add triangle to triangle list and set its halfedges
            if (!this.triangleList.includes(`${min}-${mid}-${max}`)) {
                this.triangleList.push(`${min}-${mid}-${max}`);
                for (let i in arguments) {
                    const halfEdgeKey = this.setHalfEdge(arguments[i], arguments[(i + 1) % 3]);
                    const [a, b] = halfEdgeKey.split("-");
                    if (this.temp === null) {
                        this.prev = "null-" + a;
                    }
                    else {
                        this.prev = this.temp;
                        if (this.HalfEdgeDict[this.prev] !== undefined) {
                            this.HalfEdgeDict[this.prev].next = halfEdgeKey;
                        }
                    }
                    this.next = b + "-null";
                    this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
                    this.HalfEdgeDict[halfEdgeKey].next = this.next;
                    this.temp = a + "-" + b;
                }
            }
        }
        removeTriangle(v1, v2, v3) {
            var face_vertices = [v1, v2, v3];
            const min = Math.min(v1, v2, v3);
            const max = Math.max(v1, v2, v3);
            var mid = 0;
            for (let i of face_vertices) {
                if (i !== min && i !== max) {
                    mid = i;
                    break;
                }
            }
            face_vertices = [min, mid, max]; // ensure triangle numbers are ordered in ascending order
            const triangle = `${min}-${mid}-${max}`;
            const triangle_index = this.triangleList.indexOf(triangle);
            if (triangle_index >= 0) {
                for (let edge in this.HalfEdgeDict) {
                    var tallies = 0;
                    const half_edge_face_vertices = this.HalfEdgeDict[edge].face_vertices;
                    for (let i = 0; i < 3; i++) {
                        if (half_edge_face_vertices[i] === face_vertices[i])
                            tallies++;
                    }
                    if (tallies === 3) {
                        const twinHalfEdgeKey = this.HalfEdgeDict[edge].twin;
                        if (!this.HalfEdgeDict[twinHalfEdgeKey]) { // If the twin does not exist decrease edge number
                            this.edge_no--;
                        }
                        delete this.HalfEdgeDict[edge];
                    }
                }
                this.triangleList.splice(triangle_index, 1);
            }
        }
        getTriangleEdges(v1, v2, v3) {
            var face_vertices = [v1, v2, v3];
            const min = Math.min(v1, v2, v3);
            const max = Math.max(v1, v2, v3);
            var mid = 0;
            const edge_list = [];
            for (let i of face_vertices) {
                if (i !== min && i !== max) {
                    mid = i;
                    break;
                }
            }
            face_vertices = [min, mid, max]; // ensure triangle numbers are ordered in ascending order
            for (let edge in this.HalfEdgeDict) {
                var tallies = 0;
                const half_edge_face_vertices = this.HalfEdgeDict[edge].face_vertices;
                for (let i = 0; i < 3; i++) {
                    if (half_edge_face_vertices[i] === face_vertices[i])
                        tallies++;
                }
                if (tallies === 3)
                    edge_list.push(edge); // if all the three consecutive edges share the same vertices then they make up the desired triangle
            }
            return edge_list;
        }
        getPointEdges(point) {
            const edge_list = [];
            for (let edge in this.HalfEdgeDict) {
                const [a, b] = edge.split("-").map((value) => { return Number(value); });
                var i = Math.min(a, b);
                var j = Math.max(a, b);
                if ((i === point || j === point) && !edge_list.includes(`${i}-${j}`))
                    edge_list.push(`${i}-${j}`);
            }
            return edge_list;
        }
    }
    class Point2D {
        x;
        y;
        r;
        constructor(x, y, r = 0) {
            this.x = x;
            this.y = y;
            this.r = r;
        }
    }
    class Ret {
        _ret;
        _color_code;
        _line;
        _s_width;
        _type;
        constructor(ret, color_code = "black", line = true, _s_width = 1, type = "A") {
            this._line = line;
            this._ret = ret;
            this._color_code = color_code;
            this._s_width = _s_width;
            this._type = type;
        }
        equals(input) {
            if (this._line === true) {
                const [i_a, i_b] = input.split("-");
                const [r_a, r_b] = this._ret.split("-");
                if ((i_a === r_a) && (i_b === r_b))
                    return true;
                else
                    return false;
            }
            else
                return false;
        }
    }
    class BinarySearch {
        recursive(elem, arr, min, max) {
            if (min > max)
                return -1;
            else {
                let mid = Math.floor((min + max) / 2);
                if (this.satisfies() === 0)
                    return mid;
                else if (this.satisfies() === -1)
                    return this.recursive(elem, arr, min, mid - 1);
                else
                    return this.recursive(elem, arr, mid + 1, max);
            }
        }
        iterative(arr) {
            let min = 0;
            let max = arr.length - 1;
            while (min <= max) {
                let mid = Math.floor((min + max) / 2);
                if (this.satisfies() === 0)
                    return mid;
                else if (this.satisfies() === -1)
                    max = mid - 1;
                else
                    min = mid + 1;
            }
            return -1;
        }
    }
    class ConvexHull2D {
        jarvisConvexHull(points) {
            const n = points.length;
            const triangulation = new TriangularMeshDataStructure2D(0); // not needed but added for forwards compatibility
            const convex_hull_history = []; // Initialize the history
            const points_on_hull = [];
            const point_ret_list = [];
            for (let point in points)
                point_ret_list.push(new Ret(point, color_list[(Number(point) % (color_list.length - 1)) + 1], false, 1, "A"));
            convex_hull_history.push(point_ret_list);
            const ret_list = [];
            var first;
            var now;
            var next;
            var prev;
            if (n < 3) {
                first = 0;
                for (let i = 0; i < n; i++) {
                    now = i;
                    if (i === n - 1)
                        next = first;
                    else
                        next = i + 1;
                    points_on_hull[i] = i;
                    ret_list.push(new Ret(`${now}-${next}`, "cyan", true, 10, "D"));
                    convex_hull_history.push([...point_ret_list, ...ret_list]); // push it to the history so we can see the change                      
                }
                return [{ "hull": points, "points": points_on_hull, history: convex_hull_history }, { list: [], full_point_list: [], history: [] }, { edges: [], full_point_list: [], history: [] }, triangulation, [], points, point_ret_list, []];
            } // there must be at least three points
            const hull = [];
            // Find the leftmost point and bottom-most point
            let l = 0;
            for (let i = 1; i < n; i++) {
                if (points[i].x < points[l].x)
                    l = i;
                // For handling leftmost colinear points
                else if (points[i].x === points[l].x && points[i].y < points[l].y) {
                    l = i;
                }
            }
            // Start form leftmost point and keep moving counterclockwise untill we reach the start point
            // again. This loop runs O(h) tiems where h is the number of points in the result or output.
            let p = l, q = 0;
            do {
                // Add current point to result
                hull.push(points[p]);
                points_on_hull.push(p);
                prev = p;
                // Search for a point 'q' such that orientation (p,q,x) is counterclockwise
                // for all points 'x'. The idea is to keep track of last visited most counterclock-wise point in q
                // If any point 'i' is more counterclock-wise than q, then update q
                q = (p + 1) % n;
                for (let i = 0; i < n; i++) {
                    // If i is more counterclockwise than current q, then update p
                    if (_Linear.findOrientation(points[p], points[i], points[q]) === 2)
                        q = i;
                    // HANDLING  COLLINEAR POINTS
                    // If point q lies in the middle, then also update q
                    if (p !== i && _Linear.findOrientation(points[p], points[i], points[q]) === 0 &&
                        _Linear.onSegment(points[p], points[q], points[i]))
                        q = i;
                }
                // Now q is the most counterclockwise with respect to p. Set p as q for next iteration.
                // so that q is added tor result 'hull'
                p = q;
                now = p;
                ret_list.push(new Ret(`${prev}-${now}`, "cyan", true, 10, "D"));
                convex_hull_history.push([...point_ret_list, ...ret_list]); // push it to the history so we can see the change  
            } while (p != l); // While we don't come to first point
            return [{ "hull": hull, "points": points_on_hull, history: convex_hull_history }, { list: [], full_point_list: [], history: [] }, { edges: [], full_point_list: [], history: [] }, triangulation, [], points, point_ret_list, []];
        }
    }
    const _ConvexHull = new ConvexHull2D();
    class Delaunay2D {
        constructor() { }
        superTriangle(pointList) {
            const rect = _Linear.getTriBoundingRect(pointList);
            const tri = _Linear.findCircTriFSq(rect);
            return tri;
        }
        get_edges(triangulation) {
            const ret_list = [];
            const _list = [];
            const results = Object.keys(triangulation.HalfEdgeDict);
            // reduce duplicate edges in the halfedge dictionary of the triangle data structure to one edge
            // when converting to an edge array
            for (let result of results) {
                const [a, b] = result.split("-").map((value) => { return Number(value); });
                const rev_result = `${b}-${a}`;
                if (!(_list.includes(result) || _list.includes(rev_result))) {
                    const [i, j] = [Math.min(a, b), Math.max(a, b)];
                    _list.push(`${i}-${j}`);
                }
            }
            for (let val of _list) {
                ret_list.push(new Ret(val, "black", true, 5, "E"));
            }
            return { "ret_list": ret_list, "list": _list };
        }
        get_ret(input, ret_list) {
            const null_ret = new Ret("-");
            for (let ret of ret_list) {
                if (ret.equals(input))
                    return ret;
                else
                    return null_ret;
            }
            return null_ret;
        }
        bowyer_watson(_full_cdv) {
            const pointList = _full_cdv[5];
            const pointList_len = pointList.length;
            const convex_hull = _full_cdv[0];
            const points_ret_list = _full_cdv[6];
            const delaunay_history = []; // Initialize the history
            const triangulation = new TriangularMeshDataStructure2D(pointList_len); // triangle data structure
            const [a, b, c] = this.superTriangle(pointList); // must be large enough to completely contain all the points in pointList
            // mark the super triangle points with values starting from length of pointlist to length of pointlist + 3 and add it to the triangle data structure
            triangulation.addtriangle(pointList_len, pointList_len + 1, pointList_len + 2);
            // joint the points list and super triangle points together into one common list
            const fullPointList = [...pointList, a, b, c];
            const super_points_ret = [];
            super_points_ret.push(new Ret(`${pointList_len}`, "black", false, 1, "B"));
            super_points_ret.push(new Ret(`${pointList_len + 1}`, "black", false, 1, "B"));
            super_points_ret.push(new Ret(`${pointList_len + 2}`, "black", false, 1, "B"));
            delaunay_history.push(points_ret_list); // push it to the history so we can see the change
            delaunay_history.push([...points_ret_list, ...super_points_ret]); // push it to the history so we can see the change
            delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change
            // add all the points one at a time to the triangulation
            for (let p in pointList) {
                const point = pointList[p];
                const point_num = Number(p);
                const badTriangles = [];
                const gray_edges = [];
                // first find all the triangles that are no longer valid due to the insertion
                for (let triangle of triangulation.triangleList) {
                    const [a, b, c] = [...triangle.split("-").map((value) => { return value; })];
                    const [p, q, r] = [a, b, c].map((value) => { return fullPointList[value]; });
                    const coords = _Linear.getCircumCircle(p, q, r);
                    const _a = new Ret(`${a}-${point_num}`, "yellow", true, 5, "E");
                    const _b = new Ret(`${b}-${point_num}`, "yellow", true, 5, "E");
                    const _c = new Ret(`${c}-${point_num}`, "yellow", true, 5, "E");
                    delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation).ret_list, ...gray_edges, _a, _b, _c]); // push it to the history so we can see the change
                    const invalid_tri_list = [];
                    // if point is inside circumcircle of triangle add triangle to bad triangles
                    if (_Linear.isInsideCirc(point, [coords.x, coords.y, coords.r])) {
                        badTriangles.push(triangle);
                        const ret_a = new Ret(`${a}-${point_num}`, "red", true, 5, "E");
                        const ret_b = new Ret(`${b}-${point_num}`, "red", true, 5, "E");
                        const ret_c = new Ret(`${c}-${point_num}`, "red", true, 5, "E");
                        invalid_tri_list.push(...[new Ret(`${a}-${b}`, "red", true, 5, "E"), new Ret(`${b}-${c}`, "red", true, 5, "E"), new Ret(`${a}-${c}`, "red", true, 5, "E")]);
                        gray_edges.push(...[new Ret(`${a}-${b}`, "gray", true, 5, "E"), new Ret(`${b}-${c}`, "gray", true, 5, "E"), new Ret(`${a}-${c}`, "gray", true, 5, "E")]);
                        delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation).ret_list, ret_a, ret_b, ret_c, ...invalid_tri_list]); // push it to the history so we can see the change
                        delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation).ret_list, ...gray_edges]); // push it to the history so we can see the change
                    }
                }
                const polygon = [];
                const bad_edges_dict = {};
                // find the boundary of the polygonal hole
                for (let bad_triangle of badTriangles) {
                    const [v1, v2, v3] = bad_triangle.split("-").map((value) => { return Number(value); });
                    const bad_edges = triangulation.getTriangleEdges(v1, v2, v3);
                    for (let bad_edge of bad_edges) {
                        const [i, j] = bad_edge.split("-").map((value) => { return Number(value); });
                        const [a, b] = [Math.min(i, j), Math.max(i, j)];
                        // Find how many times the bad edge occurs and increment the value denoting its frequency accordingly
                        if (!bad_edges_dict[`${a}-${b}`]) {
                            bad_edges_dict[`${a}-${b}`] = 1;
                        }
                        else {
                            bad_edges_dict[`${a}-${b}`]++;
                        }
                    }
                    // remove each bad triangle from the triangle data structure
                    triangulation.removeTriangle(Number(v1), Number(v2), Number(v3));
                }
                // if edge is not shared by any other triangles (occurence or frequency is one) in bad triangles add edge to polygon
                const poly_edge_ret = [];
                for (let bad_edge in bad_edges_dict) {
                    if (bad_edges_dict[bad_edge] === 1) {
                        polygon.push(bad_edge);
                        poly_edge_ret.push(new Ret(bad_edge, "green", true, 5, "E"));
                        delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation).ret_list, ...gray_edges, ...poly_edge_ret]); // push it to the history so we can see the change
                    }
                }
                // re-triangulate the polygonal hole using the point and add the triangles to the triangle data structure
                for (let polygonal_edge of polygon) {
                    const [a, b] = polygonal_edge.split("-").map((value) => { return Number(value); });
                    // add a new triangle with the vertices of polygonal_edge and the point number
                    triangulation.addtriangle(a, b, point_num);
                    delaunay_history.push([...points_ret_list, ...super_points_ret, ...poly_edge_ret, ...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change
                }
            }
            // get the edges
            delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change
            // If triangle contains a vertex from original super-triangle remove triangle from triangulation
            const prune_list = [];
            for (let triangle of triangulation.triangleList) {
                const num_triangle = triangle.split("-").map((value) => { return Number(value); });
                for (let num of num_triangle) {
                    if (num === pointList_len || num === pointList_len + 1 || num === pointList_len + 2) {
                        prune_list.push(num_triangle);
                        break;
                    }
                }
            }
            console.log(prune_list);
            for (let triangle of prune_list) {
                triangulation.removeTriangle(triangle[0], triangle[1], triangle[2]); // remove triangle containing vertices of super triangle
                delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change
            }
            // get the vertices of the convex hull of the points list
            const convex_hull_vertices = convex_hull.points;
            // get the edges of the convex hull from the previously gotten convex hull vertices
            const convex_hull_edges = _Miscellanous.genEdgefromArray(convex_hull_vertices, true);
            const convex_hull_edges_unsorted = _Miscellanous.genEdgefromArray(convex_hull_vertices, false);
            const convex_hull_edges_ret_list = [];
            // show the convex_hull edges
            for (let edge of convex_hull_edges) {
                convex_hull_edges_ret_list.push(new Ret(edge, "cyan", true, 10, "D"));
            }
            delaunay_history.push([...this.get_edges(triangulation).ret_list, ...convex_hull_edges_ret_list]); // push it to the history so we can see the change
            const ret_list = [];
            const _list = this.get_edges(triangulation).list;
            // for each edge of the convex hull, check if it exists in the delaunay edge array and add it if it doesn't
            for (let edge in convex_hull_edges) {
                if (!_list.includes(convex_hull_edges[edge])) {
                    _list.push(convex_hull_edges[edge]);
                    const edge_unsorted = convex_hull_edges_unsorted[edge];
                    // get and sort the two edge numbers in ascending order
                    const [a, b] = edge_unsorted.split("-").map((value) => { return Number(value); });
                    const i = Math.min(a, b);
                    const j = Math.max(a, b);
                    // // create a list of points identical in all respects to the pointlist except that the indexes corresponding to the two edge numbers are removed
                    // const test_points = pointList.slice()
                    // test_points.splice(i,1);
                    // test_points.splice(j-1,1);
                    // console.log(test_points)
                    const k = _Linear.getSmallestTriArea(pointList[i], i, pointList[j], j, pointList);
                    triangulation.addtriangle(i, j, k);
                    ret_list.push(new Ret(convex_hull_edges[edge], "orange", true, 5, "D"));
                    delaunay_history.push([...this.get_edges(triangulation).ret_list, ...convex_hull_edges_ret_list, ...ret_list]); // push it to the history so we can see the change
                }
            }
            delaunay_history.push([...this.get_edges(triangulation).ret_list, ...convex_hull_edges_ret_list, ...ret_list]); // push it to the history so we can see the change
            delaunay_history.push([...this.get_edges(triangulation).ret_list, ...ret_list]); // push it to the history so we can see the change
            return [convex_hull, { list: _list, full_point_list: fullPointList, history: delaunay_history }, { edges: [], full_point_list: [], history: [] }, triangulation, convex_hull_edges, pointList, points_ret_list, []];
        }
    }
    const _Delaunay = new Delaunay2D();
    // this.degree_list = _Miscellanous.createArrayFromArgs(n).fill(0);
    class Voronoi2D {
        adjacency_list;
        getTriCircumCircles(pointList, triangle_list) {
            const voronoi_points_list = [];
            for (let triangle of triangle_list) {
                const [pA, pB, pC] = triangle.split("-").map((value) => { return pointList[value]; });
                const tri_circum = _Linear.getCircumCircle(pA, pB, pC);
                voronoi_points_list.push(tri_circum);
            }
            return voronoi_points_list;
        }
        getTriAsc(triangle) {
            var tri_num_list = triangle.split("-").map((value) => { return Number(value); });
            const min = Math.min(...tri_num_list);
            const max = Math.max(...tri_num_list);
            var mid = 0;
            for (let num of tri_num_list) {
                if (num !== min && num !== max) {
                    mid = num;
                    break;
                }
            }
            return tri_num_list = [min, mid, max]; // ensure triangle numbers are ordered in ascending order
        }
        checkTriEquality(tri_input, tri_comp) {
            var found = 0;
            for (let num of tri_input) {
                for (let num_c of tri_comp) {
                    if (num === num_c)
                        found++;
                }
            }
            if (found >= 2)
                return true;
            else
                return false;
        }
        getAdjTriangles(triangle_list) {
            const adj_triangle_dict = {};
            const adj_triangle_list = _Miscellanous.createArrayFromList([triangle_list.length, 1]).map((value) => { return value = []; });
            for (let tri in triangle_list) {
                if (!adj_triangle_dict[tri])
                    adj_triangle_dict[tri] = [];
                const tri_input = this.getTriAsc(triangle_list[tri]);
                for (let tri_c in triangle_list) {
                    if (triangle_list[tri] == triangle_list[tri_c])
                        continue;
                    if (!adj_triangle_dict[tri_c])
                        adj_triangle_dict[tri_c] = [];
                    if (!adj_triangle_dict[tri].includes(triangle_list[tri_c])) {
                        const tri_comp = this.getTriAsc(triangle_list[tri_c]);
                        if (this.checkTriEquality(tri_input, tri_comp) === true) {
                            adj_triangle_dict[tri].push(triangle_list[tri_c]);
                            adj_triangle_dict[tri_c].push(triangle_list[tri]);
                            adj_triangle_list[tri].push(Number(tri_c));
                            adj_triangle_list[tri_c].push(Number(tri));
                        }
                    }
                }
            }
            return { dict: adj_triangle_dict, list: adj_triangle_list };
        }
        getConvexHullExtremes(convex_hull_points) {
            var [minX, maxX, minY, maxY] = [Infinity, -Infinity, Infinity, -Infinity];
            // get minimum  and maximum values of x and y
            for (let point of convex_hull_points) {
                if (point.x < minX)
                    minX = point.x;
                if (point.x > maxX)
                    maxX = point.x;
                if (point.y < minY)
                    minY = point.y;
                if (point.y > maxY)
                    maxY = point.y;
            }
            return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
        }
        getCrossPoints(p, c_extremes, margin = 10) {
            const left_diff = Math.abs(p.x - c_extremes.minX);
            const right_diff = Math.abs(p.x - c_extremes.maxX);
            const up_diff = Math.abs(p.y - c_extremes.minY);
            const down_diff = Math.abs(p.y - c_extremes.maxY);
            const left_point = new Point2D(p.x - left_diff - margin, p.y);
            const right_point = new Point2D(p.x + right_diff + margin, p.y);
            const up_point = new Point2D(p.x, p.y - up_diff - margin);
            const down_point = new Point2D(p.x, p.y + down_diff + margin);
            return { ph: left_point, qh: right_point, pv: up_point, qv: down_point };
        }
        convexHullIntersect(p1, q1, point_list, convex_hull_edges) {
            for (let edge of convex_hull_edges) {
                const [p2, q2] = edge.split("-").map((value) => { return point_list[value]; });
                if (_Linear.doIntersect(p1, q1, p2, q2) === true)
                    return true;
            }
            return false;
        }
        compute_voronoi(_full_cdv) {
            const triangulation = _full_cdv[3];
            const n = triangulation.vertex_no;
            const pt_list = _full_cdv[5];
            this.adjacency_list = _Miscellanous.createArrayFromList([n, 1]).map(() => { return []; });
            const halfedge_dict_list = Object.keys(triangulation.HalfEdgeDict);
            const convex_hull_edges = _full_cdv[4];
            const convex_hull_points = _full_cdv[0].hull;
            const points_ret_list = _full_cdv[6];
            const voronoi_history = [];
            var voronoi_edges_list = [];
            const convex_hull_voronoi_no_intersect = [];
            var voronoi_convex_hull_intersect = [];
            const mid_pt_list = [];
            const mid_pt_edges_list = [];
            const convex_hull = _full_cdv[0];
            const delaunay = _full_cdv[1];
            const new_v = [];
            const new_m = [];
            const new_l = [];
            voronoi_history.push(points_ret_list); // push it to the history so we can see the change
            // get the circumcenters of all the triangles in the previously computed delaunay (or delone) triangulation
            // and store them in a list indexing them according to the index of their respective containing triangles
            const voronoi_points_list = this.getTriCircumCircles(pt_list, triangulation.triangleList);
            // record changes
            const voronoi_points_ret_list = [];
            for (let p_index in voronoi_points_list) {
                if (voronoi_points_ret_list.length > 0)
                    voronoi_points_ret_list.push([...voronoi_points_ret_list[voronoi_points_ret_list.length - 1], new Ret(p_index, "darkred", false, 1, "C"), new Ret(p_index, "red", false, 1, "H")]);
                else
                    voronoi_points_ret_list.push([new Ret(p_index, "darkred", false, 1, "C"), new Ret(p_index, "red", false, 1, "H")]);
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list[p_index]]); // push it to the history so we can see the change
            }
            const voronoi_points_ret_list_last = voronoi_points_ret_list[voronoi_points_ret_list.length - 1];
            const voronoi_points_list_divide = voronoi_points_list.length;
            var end_pt_index = voronoi_points_list_divide;
            // compute the adjacent triangles
            const adj_triangles = this.getAdjTriangles(triangulation.triangleList);
            // compute the adjacency matrix for the vertices
            for (let edge of halfedge_dict_list) {
                const [a, b] = edge.split("-").map((value) => { return Number(value); });
                const [start, end] = [Math.min(a, b), Math.max(a, b)];
                this.adjacency_list[start].push(end);
                this.adjacency_list[end].push(start);
            }
            for (let list in this.adjacency_list) {
                this.adjacency_list[list] = [...new Set(this.adjacency_list[list])]; // ensure uniqueness
            }
            // console.log(triangulation.triangleList)
            // console.log(halfedge_dict_list)
            // console.log(voronoi_points_list)
            // console.log(this.adjacency_list)
            // console.log(adj_triangles.dict);
            // console.log(adj_triangles.list);
            // console.log(pt_list);
            // for each triangle circumcenter vertex, get the adjacent triangles to the triangle containing it
            for (let index in voronoi_points_list) {
                for (let val of adj_triangles.list[index]) {
                    const a = Math.min(Number(index), Number(val));
                    const b = Math.max(Number(index), Number(val));
                    voronoi_edges_list.push(`${a}-${b}`);
                }
            }
            // ensure uniqueness
            voronoi_edges_list = [...new Set(voronoi_edges_list)];
            // record changes
            const voronoi_edges_ret_list = [];
            for (let edge of voronoi_edges_list) {
                const [a, b] = edge.split("-");
                if (voronoi_edges_ret_list.length > 0)
                    voronoi_edges_ret_list.push([...voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1], new Ret(edge, "coral", true, 5, "F"), new Ret(a, "magenta", false, 1, "C"), new Ret(b, "magenta", false, 1, "C")]);
                else
                    voronoi_edges_ret_list.push([new Ret(edge, "coral", true, 5, "F"), new Ret(a, "magenta", false, 1, "C"), new Ret(b, "magenta", false, 1, "C")]);
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1]]); // push it to the history so we can see the change
            }
            const voronoi_edges_ret_list_last = voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1];
            // prepare animation data for convex hull edges
            const convex_hull_edges_ret_list = [];
            for (let edge of convex_hull_edges) {
                convex_hull_edges_ret_list.push(new Ret(edge, "cyan", true, 10, "D"));
            }
            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...voronoi_edges_ret_list_last, ...convex_hull_edges_ret_list]); // push it to the history so we can see the change
            // get all the convex hull edges that do not intersect with the voronoi edges
            // we loop through each edge of the convex hull
            // in each convex hull edge, we check if there exists a voronoi edge that intersects with it by attempting to loop through all the voronoi edges
            // if any intersecting voronoi edge is found we abort the current loop of the voronoi edges as the condition of no-intersection has been violated and return true for the convex hull edge
            // else we continue to loop through the voronoi to make sure that no voronoi edge intersects  and if none intersects at the end of the loop we return false for the convex hull edge
            // if the result is false (no-intersection) we record it.
            const no_intersect_ret_list = [];
            for (let edge of convex_hull_edges) {
                var [p1, q1] = [...edge.split("-").map((value) => { return pt_list[value]; })];
                var last_intersect = true;
                for (let v_edge of voronoi_edges_list) {
                    var [p2, q2] = [...v_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
                    if (no_intersect_ret_list.length <= 0)
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, new Ret(edge, "yellow", true, 10, "D"), new Ret(v_edge, "yellow", true, 5, "F")]); // push it to the history so we can see the change
                    else
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list[no_intersect_ret_list.length - 1], new Ret(edge, "yellow", true, 10, "D"), new Ret(v_edge, "yellow", true, 5, "F")]); // push it to the history so we can see the change
                    const intersect = _Linear.doIntersect(p1, q1, p2, q2);
                    if (intersect === true) {
                        last_intersect = intersect;
                        if (no_intersect_ret_list.length <= 0)
                            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, new Ret(edge, "red", true, 10, "D"), new Ret(v_edge, "red", true, 5, "F")]); // push it to the history so we can see the change
                        else
                            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list[no_intersect_ret_list.length - 1], new Ret(edge, "red", true, 10, "D"), new Ret(v_edge, "red", true, 5, "F")]); // push it to the history so we can see the change
                        break;
                    }
                    last_intersect = intersect;
                }
                if (last_intersect === false) {
                    convex_hull_voronoi_no_intersect.push(edge);
                    if (no_intersect_ret_list.length > 0)
                        no_intersect_ret_list.push([...no_intersect_ret_list[no_intersect_ret_list.length - 1], new Ret(edge, "darkcyan", true, 10, "D")]);
                    else
                        no_intersect_ret_list.push([new Ret(edge, "darkcyan", true, 10, "D")]);
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list[no_intersect_ret_list.length - 1]]); // push it to the history so we can see the change
                }
            }
            const no_intersect_ret_list_last = no_intersect_ret_list[no_intersect_ret_list.length - 1];
            // for each non-intersecting convex hull edge get the midpoint of the convex hull edge,
            // get the circumcenter of the triangle that has and edge corresponding to the convex hull edge
            // and get the gradient of the line that connects the circumcenter of that triangle to the midpoint
            const mid_no_intersect_ret_list = [];
            for (let index in convex_hull_voronoi_no_intersect) {
                const edge = convex_hull_voronoi_no_intersect[index];
                const [a, b] = [...edge.split("-").map((value) => { return pt_list[Number(value)]; })];
                const midPoint = new Point2D((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
                const _mid_pt_index = mid_pt_list.push(midPoint) - 1;
                const triangle = triangulation.HalfEdgeDict[edge].face_vertices.join("-");
                const _circum_pt_index = triangulation.triangleList.indexOf(triangle);
                mid_pt_edges_list[index] = { mid_pt_index: _mid_pt_index, circum_pt_index: _circum_pt_index };
                if (mid_no_intersect_ret_list.length > 0)
                    mid_no_intersect_ret_list.push([...mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1], ...[new Ret(`${_mid_pt_index}-${_circum_pt_index}`, "purple", true, 5, "G")]]);
                else
                    mid_no_intersect_ret_list.push([new Ret(`${_mid_pt_index}-${_circum_pt_index}`, "purple", true, 5, "G")]);
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1]]); // push it to the history so we can see the change
            }
            const mid_no_intersect_ret_list_last = mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1];
            // for each line gotten from above, use the gradient of the line to make the line longer while keeping the start coordinate
            // of the line as the circumcenter and ensuring that the line's end coordinate is located outwards
            for (let index in mid_pt_edges_list) {
                const val = mid_pt_edges_list[index];
                const start = voronoi_points_list[val.circum_pt_index];
                const inter = mid_pt_list[val.mid_pt_index];
                const gradient = _Linear.get_gradient(start, inter);
                const [p1, q1] = convex_hull_voronoi_no_intersect[index].split("-").map((value) => { return pt_list[value]; });
                const end = _Linear.specialGetLineFromPointGradient(p1, q1, start, gradient, 50);
                voronoi_points_list.push(end);
                voronoi_edges_list.push(`${val.circum_pt_index}-${end_pt_index}`);
                voronoi_points_ret_list_last.push(new Ret(`${end_pt_index}`, "darkred", true, 1, "C"));
                new_m.push(new Ret(`${val.circum_pt_index}-${end_pt_index}`, "darkblue", true, 5, "F"));
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...mid_no_intersect_ret_list_last, ...new_m]); // push it to the history so we can see the change
                end_pt_index++;
            }
            // get all the voronoi edges that intersect with the convex hull edges
            for (let v_index in voronoi_edges_list) {
                const v_edge = voronoi_edges_list[v_index];
                var [p1, q1] = [...v_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
                for (let edge of convex_hull_edges) {
                    var [p2, q2] = [...edge.split("-").map((value) => { return pt_list[value]; })];
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, new Ret(v_edge, "yellow", true, 5, "F"), new Ret(edge, "yellow", true, 10, "D")]); // push it to the history so we can see the change
                    const intersect = _Linear.doIntersect(p1, q1, p2, q2);
                    if (intersect === true) {
                        voronoi_convex_hull_intersect.push(v_edge);
                        new_v.push(new Ret(v_edge, "maroon", true, 5, "F"));
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, new Ret(edge, "lightsalmon", true, 10, "D")]); // push it to the history so we can see the change
                        break;
                    }
                }
            }
            // ensure uniqueness
            voronoi_convex_hull_intersect = [...new Set(voronoi_convex_hull_intersect)];
            const c_extremes = this.getConvexHullExtremes(convex_hull_points);
            const no_duplicate = [];
            // from the afore gotten voronoi edges get those that intersect with others
            for (let v1_edge of voronoi_convex_hull_intersect) {
                var [p1, q1] = [...v1_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
                for (let v2_edge of voronoi_convex_hull_intersect) {
                    if (v1_edge === v2_edge)
                        continue;
                    no_duplicate.push(v1_edge + v2_edge);
                    var counter_duplicate = v2_edge + v1_edge;
                    if (no_duplicate.includes(counter_duplicate))
                        continue;
                    var [p2, q2] = [...v2_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "yellow", true, 5, "F"), new Ret(v2_edge, "yellow", true, 5, "F")]); // push it to the history so we can see the change
                    const intersect = _Linear.doIntersect(p1, q1, p2, q2);
                    if (intersect === true) {
                        // get the point that is the same for both edges
                        const v_a = v1_edge.split("-");
                        const v_b = v2_edge.split("-");
                        const v_test_1 = v_a.includes(v_b[0]);
                        const v_test_2 = v_a.includes(v_b[1]);
                        if ((v_test_1 || v_test_2) === false)
                            continue;
                        const v = v_test_1 ? [v_b[0], 1] : [v_b[1], 0];
                        // get the points that exist outside the convex hull
                        const point = voronoi_points_list[v[0]];
                        const boundary_points = this.getCrossPoints(point, c_extremes, 10);
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "darkgoldenrod", true, 5, "F"), new Ret(v2_edge, "darkgoldenrod", true, 5, "F"), new Ret(`${v[0]}`, "yellow", false, 1, "C")]); // push it to the history so we can see the change
                        const point_ph_intersect = this.convexHullIntersect(point, boundary_points.ph, pt_list, convex_hull_edges);
                        const point_qh_intersect = this.convexHullIntersect(point, boundary_points.qh, pt_list, convex_hull_edges);
                        const point_pv_intersect = this.convexHullIntersect(point, boundary_points.pv, pt_list, convex_hull_edges);
                        const point_qv_intersect = this.convexHullIntersect(point, boundary_points.qv, pt_list, convex_hull_edges);
                        // If true then it is inside the convex hull so we skip it
                        if (point_ph_intersect === true &&
                            point_qh_intersect === true &&
                            point_pv_intersect === true &&
                            point_qv_intersect === true) {
                            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "red", true, 5, "F"), new Ret(v2_edge, "red", true, 5, "F"), new Ret(`${v[0]}`, "red", false, 1, "C")]); // push it to the history so we can see the change
                            continue;
                        }
                        // If not then it is not inside the convex hull and we can safely do some work
                        // get the midpoint of the edges connecting the lines shared by this point
                        const a = v_a[v[1]];
                        const b = v_b.slice().splice(Number(v[1]), 1)[0];
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "burlywood", true, 5, "F"), new Ret(v2_edge, "burlywood", true, 5, "F"), new Ret(`${v[0]}`, "green", false, 1, "C")]); // push it to the history so we can see the change
                        var p1 = voronoi_points_list[a];
                        var q1 = voronoi_points_list[b];
                        const midpoint = _Linear.get_midpoint(p1, q1);
                        const inter = voronoi_points_list[v[0]];
                        const gradient = _Linear.get_gradient(midpoint, inter);
                        const end = _Linear.getLineFromPointGradient(inter, gradient, 50, p1.y < q1.y);
                        voronoi_points_list.push(end);
                        voronoi_edges_list.push(`${v[0]}-${end_pt_index}`);
                        new_l.push(new Ret(`${v[0]}-${end_pt_index}`, "coral", true, 5, "F"), new Ret(v1_edge, "burlywood", true, 5, "F"), new Ret(v2_edge, "burlywood", true, 5, "F"), new Ret(`${v[0]}`, "green", false, 1, "C"));
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l]); // push it to the history so we can see the change
                        end_pt_index++;
                    }
                }
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l]); // push it to the history so we can see the change
            }
            console.log(voronoi_history.length);
            return [convex_hull, delaunay, { edges: voronoi_edges_list, full_point_list: voronoi_points_list, history: voronoi_history }, triangulation, convex_hull_edges, pt_list, points_ret_list, mid_pt_list];
        }
    }
    const _Voronoi2D = new Voronoi2D();
    class Linear_Algebra_Animate {
        cur_index;
        running;
        cdv_switch;
        time;
        section;
        ret_group_num;
        ret_num;
        convex_hull;
        delaunay;
        voronoi;
        triangle_list;
        convex_hull_edges;
        points;
        points_ret_list;
        midpoints;
        super_points;
        voronoi_points;
        constructor(input, cdv_switch = 0, cur_index = 0) {
            this.cur_index = cur_index;
            this.cdv_switch = cdv_switch;
            this.running = false;
            this.time = 1000;
            this.section = 0;
            this.ret_group_num = 0;
            this.convex_hull = input[0];
            this.delaunay = input[1];
            this.voronoi = input[2];
            this.triangle_list = input[3].triangleList;
            this.convex_hull_edges = input[4];
            this.points = input[5];
            this.points_ret_list = input[6];
            this.midpoints = input[7];
            this.super_points = this.delaunay.full_point_list;
            this.voronoi_points = this.voronoi.full_point_list;
            console.log(this.convex_hull.history);
            console.log(this.delaunay.history);
            console.log(this.voronoi.history);
            switch (this.cdv_switch) {
                case 0:
                    length = 0;
                    break;
                case 1:
                    length = this.convex_hull.history.length;
                    break;
                case 2:
                    length = this.delaunay.history.length;
                    break;
                case 3:
                    length = this.voronoi.history.length;
                    break;
                case 4:
                    length = this.convex_hull.history.length + this.delaunay.history.length;
                    break;
                case 6:
                    length = this.delaunay.history.length + this.voronoi.history.length;
                    break;
                case 7:
                    length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length;
                    break;
            }
            anim_number_input.max = `${length - 1}`;
            after_anim1.innerHTML = `${length - 1}`;
        }
        changeCDVSwitch(input) {
            this.running = false;
            this.cdv_switch = input;
            this.section = 0;
            this.ret_group_num = 0;
            var length = 0;
            switch (this.cdv_switch) {
                case 0:
                    length = 0;
                    break;
                case 1:
                    length = this.convex_hull.history.length;
                    break;
                case 2:
                    length = this.delaunay.history.length;
                    break;
                case 3:
                    length = this.voronoi.history.length;
                    break;
                case 4:
                    length = this.convex_hull.history.length + this.delaunay.history.length;
                    break;
                case 6:
                    length = this.delaunay.history.length + this.voronoi.history.length;
                    break;
                case 7:
                    length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length;
                    break;
            }
            anim_number_input.max = `${length - 1}`;
            after_anim1.innerHTML = `${length - 1}`;
        }
        // A - Basic Point ( Points of Graph)
        // B - Super Triangle Point
        // C - Voronoi Point ( Triangle Circumcenters)
        // D - Basic Edge ( Basic point - Basic Point)
        // E - Super Edge ( Basic Point or Super Point - Basic Point or Super Point)
        // F - Voronoi Edge ( Voronoi Point - Voronoi Point)
        // G - Mid_Edge ( Mid_Point { of selected Voronoi Edge} - Voronoi Point)
        // H - Polygon { Triangle ( Basic Point - Basic Point - Basic Point ) }
        render_ret(ret, super_points, voronoi_points, midpoints, triangle_list) {
            const type = ret._type;
            var point1;
            var point2;
            switch (type) {
                case "A":
                case "B":
                    point1 = super_points[Number(ret._ret)];
                    _Experimental.drawPoint(point1, ret._color_code, ret._color_code, ret._s_width);
                    break;
                case "C":
                    point1 = voronoi_points[Number(ret._ret)];
                    _Experimental.drawPoint(point1, ret._color_code, ret._color_code, ret._s_width);
                    break;
                case "D":
                case "E":
                    [point1, point2] = ret._ret.split("-").map((value) => { return super_points[Number(value)]; });
                    _Experimental.drawLine(point1, point2, ret._color_code, ret._s_width);
                    break;
                case "F":
                    [point1, point2] = ret._ret.split("-").map((value) => { return voronoi_points[Number(value)]; });
                    _Experimental.drawLine(point1, point2, ret._color_code, ret._s_width);
                    break;
                case "G":
                    var [a, b] = ret._ret.split("-").map((value) => { return Number(value); });
                    point1 = midpoints[a];
                    point2 = voronoi_points[b];
                    _Experimental.drawLine(point1, point2, ret._color_code, ret._s_width);
                    break;
                case "H":
                    var [p, q, r] = triangle_list[Number(ret._ret)].split("-").map((value) => { return super_points[Number(value)]; });
                    _Experimental.drawPolygon([p, q, r], ret._color_code, ret._color_code, ret._s_width, false);
                    break;
            }
        }
        // 0 - 
        // 1 - Convex Hull
        // 2 - Delaunay
        // 3 - Voronoi
        // 4 - Convex Hull and Delaunay
        // 5 - Convex Hull and Voronoi
        // 6 - Delaunay and Voronoi
        // 7 - Convex Hull, Delaunay and Voronoi
        select_selection_system() {
            var num = this.cur_index;
            switch (this.cdv_switch) {
                case 0: return [0, 0];
                case 1:
                    return [0, num % this.convex_hull.history.length];
                case 2:
                    return [1, num % this.delaunay.history.length];
                case 3:
                    return [2, num % this.voronoi.history.length];
                case 4:
                    if (num < this.convex_hull.history.length)
                        return [0, num];
                    else
                        return [1, num - this.convex_hull.history.length];
                case 5:
                    if (num < this.convex_hull.history.length)
                        return [0, num];
                    else
                        return [2, num - this.convex_hull.history.length];
                case 6:
                    if (num < this.delaunay.history.length)
                        return [1, num];
                    else
                        return [2, num - this.delaunay.history.length];
                case 7:
                    if (num < this.convex_hull.history.length)
                        return [0, num];
                    else
                        num = num - this.convex_hull.history.length;
                    if (num < this.delaunay.history.length)
                        return [1, num];
                    else
                        return [2, num - this.delaunay.history.length];
                default: return [0, 0];
            }
        }
        selection_system(section, ret_group_num, stops) {
            if (ret_group_num < (stops[section] - 1)) {
                ret_group_num++;
                this.cur_index++;
                return [section, ret_group_num];
            }
            if (section < 2) {
                section++;
                ret_group_num = 0;
                this.cur_index++;
                return [section, ret_group_num];
            }
            else {
                section = 0;
                ret_group_num = 0;
                this.cur_index = 0;
                this.running = false;
                return [section, ret_group_num];
            }
        }
        history_snapshot() {
            this.running = false;
            [this.section, this.ret_group_num] = this.select_selection_system();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log(this.section, this.ret_group_num);
            status.innerHTML = `Current count: ${this.cur_index}`;
            anim_number_input.value = `${this.cur_index}`;
            anim_number.innerHTML = anim_number_input.value;
            if (this.section === 0) {
                if (this.cdv_switch === 1 || this.cdv_switch === 4 || this.cdv_switch === 5 || this.cdv_switch === 7) {
                    const group = this.convex_hull.history[this.ret_group_num];
                    for (let ret of group) {
                        this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                    }
                }
            }
            if (this.section === 1) {
                if (this.cdv_switch === 2 || this.cdv_switch === 4 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                    const group = this.delaunay.history[this.ret_group_num];
                    for (let ret of group) {
                        this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                    }
                }
            }
            if (this.section === 2) {
                if (this.cdv_switch === 3 || this.cdv_switch === 5 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                    const group = this.voronoi.history[this.ret_group_num];
                    for (let ret of group) {
                        this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                    }
                }
            }
        }
        animate_history() {
            var length = 0;
            var stops = [this.convex_hull.history.length, this.delaunay.history.length, this.voronoi.history.length];
            [this.section, this.ret_group_num] = this.select_selection_system();
            switch (this.cdv_switch) {
                case 0:
                    length = 0;
                    break;
                case 1:
                    length = this.convex_hull.history.length;
                    break;
                case 2:
                    length = this.delaunay.history.length;
                    break;
                case 3:
                    length = this.voronoi.history.length;
                    break;
                case 4:
                    length = this.convex_hull.history.length + this.delaunay.history.length;
                    break;
                case 6:
                    length = this.delaunay.history.length + this.voronoi.history.length;
                    break;
                case 7:
                    length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length;
                    break;
            }
            console.log(length, this.cdv_switch, this.section, this.ret_group_num);
            if (length <= 0)
                return;
            this.running = true;
            var id = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                status.innerHTML = `Running, count: ${this.cur_index}`;
                anim_number_input.value = `${this.cur_index}`;
                anim_number.innerHTML = anim_number_input.value;
                if (this.section === 0) {
                    if (this.cdv_switch === 1 || this.cdv_switch === 4 || this.cdv_switch === 5 || this.cdv_switch === 7) {
                        const group = this.convex_hull.history[this.ret_group_num];
                        for (let ret of group) {
                            this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                        }
                        [this.section, this.ret_group_num] = this.selection_system(this.section, this.ret_group_num, stops);
                    }
                }
                if (this.section === 1) {
                    if (this.cdv_switch === 2 || this.cdv_switch === 4 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                        const group = this.delaunay.history[this.ret_group_num];
                        for (let ret of group) {
                            this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                        }
                        [this.section, this.ret_group_num] = this.selection_system(this.section, this.ret_group_num, stops);
                    }
                }
                if (this.section === 2) {
                    if (this.cdv_switch === 3 || this.cdv_switch === 5 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                        const group = this.voronoi.history[this.ret_group_num];
                        for (let ret of group) {
                            this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                        }
                        [this.section, this.ret_group_num] = this.selection_system(this.section, this.ret_group_num, stops);
                    }
                }
                if (this.cur_index >= length || this.running === false) {
                    clearInterval(id);
                    this.running = false;
                    if (this.cur_index >= length) {
                        status.innerHTML = "Done";
                        this.cur_index = 0;
                    }
                    else {
                        anim_number_input.value = `${this.cur_index}`;
                        anim_number.innerHTML = anim_number_input.value;
                        status.innerHTML = `Paused, count: ${this.cur_index}`;
                    }
                }
            }, this.time);
        }
    }
    class LinearAlgebraSupport {
        cur_index;
        cdv_switch;
        time;
        c_result;
        d_result;
        v_result;
        points;
        animate;
        c_1;
        c_2;
        c_3;
        constructor(points, cdv_switch = 0, cur_index = 0) {
            this.points = points;
            this.c_result = _ConvexHull.jarvisConvexHull(this.points);
            this.d_result = _Delaunay.bowyer_watson(this.c_result);
            this.v_result = _Voronoi2D.compute_voronoi(this.d_result);
            this.animate = new Linear_Algebra_Animate(this.v_result, cdv_switch, cur_index);
            this.time = 1000; // fallback time;
            this.cur_index = cur_index;
            this.cdv_switch = cdv_switch;
            this.animate.cur_index = this.cur_index;
            this.animate.cdv_switch = this.cdv_switch;
            this.c_1 = false;
            this.c_2 = false;
            this.c_3 = false;
            this.setC_S();
        }
        checkC_S() {
            if (this.c_1 === false && this.c_2 === false && this.c_3 === false)
                this.cdv_switch = 0;
            if (this.c_1 === true && this.c_2 === false && this.c_3 === false)
                this.cdv_switch = 1;
            if (this.c_1 === false && this.c_2 === true && this.c_3 === false)
                this.cdv_switch = 2;
            if (this.c_1 === false && this.c_2 === false && this.c_3 === true)
                this.cdv_switch = 3;
            if (this.c_1 === true && this.c_2 === true && this.c_3 === false)
                this.cdv_switch = 4;
            if (this.c_1 === true && this.c_2 === false && this.c_3 === true)
                this.cdv_switch = 5;
            if (this.c_1 === false && this.c_2 === true && this.c_3 === true)
                this.cdv_switch = 6;
            if (this.c_1 === true && this.c_2 === true && this.c_3 === true)
                this.cdv_switch = 7;
            this.changeCDVSwitch(this.cdv_switch);
        }
        setC_S() {
            if (this.cdv_switch = 0) {
                this.c_1 === false, this.c_2 === false, this.c_3 === false;
            }
            if (this.cdv_switch = 1) {
                this.c_1 === true, this.c_2 === false, this.c_3 === false;
            }
            if (this.cdv_switch = 2) {
                this.c_1 === false, this.c_2 === true, this.c_3 === false;
            }
            if (this.cdv_switch = 3) {
                this.c_1 === false, this.c_2 === false, this.c_3 === true;
            }
            if (this.cdv_switch = 4) {
                this.c_1 === true, this.c_2 === true, this.c_3 === false;
            }
            if (this.cdv_switch = 5) {
                this.c_1 === true, this.c_2 === false, this.c_3 === true;
            }
            if (this.cdv_switch = 6) {
                this.c_1 === false, this.c_2 === true, this.c_3 === true;
            }
            if (this.cdv_switch = 7) {
                this.c_1 === true, this.c_2 === true, this.c_3 === true;
            }
        }
        changeCDVSwitch(input) {
            this.cdv_switch = input;
            this.animate.changeCDVSwitch(this.cdv_switch);
        }
        changeCurIndex(cur_index = 0) {
            this.cur_index = cur_index;
            this.animate.cur_index = this.cur_index;
        }
        changeTime(time) {
            this.time = time;
            this.animate.time = this.time;
        }
        runAnimation() {
            this.animate.animate_history();
        }
        takeSnapshot() {
            this.animate.history_snapshot();
        }
    }
    class ObjectManager {
    }
    class PointLight {
    }
    class DirectionalLight {
    }
    class SpotLight {
    }
    class AreaLight {
    }
    class AmbientLight {
    }
    class AmbientLighting {
    }
    class DiffuseLighting {
    }
    class SpecularLighting {
    }
    class FlatShading {
    }
    class GouraudShading {
    }
    class PhongShading {
    }
    class BlinnPhongShading {
    }
    //   class RENDER {
    //     kernel_Size : number;
    //     sigma_xy : number;
    //     sampleArr : any [];
    //     TotalArea : number;
    //     triA : number;
    //     triB : number;
    //     triC : number;
    //     aRatio: number;
    //     bRatio : number;
    //     cRatio : number;
    //     opacityCoeff : number;
    //     avec : _3D_VEC_;
    //     bvec : _3D_VEC_;
    //     cvec : _3D_VEC_;
    //     colA : _4D_VEC_;
    //     colB : _4D_VEC_;
    //     colC : _4D_VEC_;
    //     constructor() {
    //         this.kernel_Size = 3;
    //         this.sigma_xy = 1;
    //         this.sampleArr = [];
    //         this.TotalArea = 0;
    //         this.triA = 0;
    //         this.triB = 0;
    //         this.triC = 0;
    //         this.aRatio = 0;
    //         this.bRatio = 0;
    //         this.cRatio = 0;
    //         this.opacityCoeff = 0;
    //         this.avec = [0, 0, 0];
    //         this.bvec = [0, 0, 0];
    //         this.cvec = [0, 0, 0];
    //         this.colA = [0, 0, 0, 0];
    //         this.colB = [0, 0, 0, 0];
    //         this.colC = [0, 0, 0, 0];
    //         this.sample();
    //     }
    //     initParams(...vertArray : _3_7_MAT_) {
    //         this.avec = vertArray[0].slice(0, 3) as _3D_VEC_;
    //         this.bvec = vertArray[1].slice(0, 3) as _3D_VEC_;
    //         this.cvec = vertArray[2].slice(0, 3) as _3D_VEC_;
    //         this.colA = vertArray[0].slice(3) as _4D_VEC_;
    //         this.colB = vertArray[1].slice(3) as _4D_VEC_;
    //         this.colC = vertArray[2].slice(3) as _4D_VEC_;
    //     }
    //     private interpolate(pvec : _3D_VEC_, avec : _3D_VEC_, bvec : _3D_VEC_, cvec : _3D_VEC_) : _3D_VEC_ {
    //         const indexList = [0, 1];
    //         const Adist = _Miscellanous.getDist(bvec, cvec, indexList),
    //             Bdist = _Miscellanous.getDist(avec, cvec, indexList),
    //             Cdist = _Miscellanous.getDist(avec, bvec, indexList),
    //             apdist = _Miscellanous.getDist(pvec, avec, indexList),
    //             bpdist = _Miscellanous.getDist(pvec, bvec, indexList),
    //             cpdist = _Miscellanous.getDist(pvec, cvec, indexList);
    //         this.TotalArea = _Miscellanous.getTriArea(Adist, Bdist, Cdist);
    //         this.triA = _Miscellanous.getTriArea(Adist, bpdist, cpdist);
    //         this.triB = _Miscellanous.getTriArea(Bdist, apdist, cpdist);
    //         this.triC = _Miscellanous.getTriArea(Cdist, apdist, bpdist);
    //         this.aRatio = this.triA / this.TotalArea;
    //         this.bRatio = this.triB / this.TotalArea;
    //         this.cRatio = this.triC / this.TotalArea;
    //         const
    //             aPa : _3D_VEC_ = _Matrix.scaMult(this.aRatio, avec) as _3D_VEC_,
    //             bPb : _3D_VEC_ = _Matrix.scaMult(this.bRatio, bvec) as _3D_VEC_,
    //             cPc : _3D_VEC_ = _Matrix.scaMult(this.cRatio, cvec) as _3D_VEC_;
    //         return _Matrix.matAdd(_Matrix.matAdd(aPa, bPb), cPc) as _3D_VEC_;
    //     }
    //     private getTriBoundingRect(...vertices : _3_4_MAT_) : _4D_VEC_ {
    //         return this.getTriBoundingRectImpl(vertices);
    //     }
    //     private getTriBoundingRectImpl(vertices : _3_4_MAT_) : _4D_VEC_ {
    //         var n = vertices.length;
    //         var xArr : _3D_VEC_ = [0,0,0];
    //         var yArr : _3D_VEC_ = [0,0,0];
    //         var xmin = Infinity;
    //         var ymin = Infinity;
    //         var xmax = 0;
    //         var ymax = 0;
    //         for (let i = 0; i < n; i++) {
    //             xArr[i] = vertices[i][0];
    //             yArr[i] = vertices[i][1];
    //             if (xArr[i] < xmin) {
    //                 xmin = xArr[i];
    //             }
    //             if (yArr[i] < ymin) {
    //                 ymin = yArr[i];
    //             }
    //             if (xArr[i] > xmax) {
    //                 xmax = xArr[i];
    //             }
    //             if (yArr[i] > ymax) {
    //                 ymax = yArr[i];
    //             }
    //         }
    //         return [xmin, ymin, xmax - xmin, ymax - ymin];
    //     }
    //     isInsideTri() : boolean {
    //         var sum = this.triA + this.triB + this.triC
    //         if (Math.round(sum) === Math.round(this.TotalArea)) {
    //             return true;
    //         }
    //         return false;
    //     }
    //     sample()
    // {
    //Generates an array of normalized Gaussian distribution function values with x and y coefficients 
    //         // Mean is taken as zero
    //         this.kernel_Size = this.kernel_Size
    //         const denom_ = ((2 * Math.PI) * (this.sigma_xy ** 2));
    //         if (this.kernel_Size > 1 && this.kernel_Size % 2 === 1) {
    //             const modifier = (this.kernel_Size - 1) / 2;
    //             for (let i = 0; i < this.kernel_Size; i++) {
    //                 const val_y = i - modifier;
    //                 for (let j = 0; j < this.kernel_Size; j++) {
    //                     const val_x = j - modifier;
    //                     const numer_ = Math.exp(-((val_x ** 2) + (val_y ** 2)) / (4 * (this.sigma_xy ** 2)));
    //                     this.sampleArr.push([val_x, val_y, numer_ / denom_]);
    //                 }
    //             }
    //         }
    //     }
    //     partSample(x : number, y : number) : any[] {
    //         const part_sample_arr : any [] = []
    //         for (let sample of this.sampleArr) {
    //             var val_x = sample[0] + x;
    //             var val_y = sample[1] + y;
    //             if (val_x < 0) {
    //                 val_x = 0;
    //             } else if (val_x >= MODIFIED_PARAMS._CANVAS_WIDTH) {
    //                 val_x = MODIFIED_PARAMS._CANVAS_WIDTH - 1;
    //             }
    //             if (val_y < 0) {
    //                 val_y = 0;
    //             } else if (val_y >= MODIFIED_PARAMS._CANVAS_HEIGHT) {
    //                 val_y = MODIFIED_PARAMS._CANVAS_HEIGHT - 1;
    //             }
    //             part_sample_arr.push([val_x, val_y, sample[2]]);
    //         }
    //         return part_sample_arr;
    //     }
    //     private vertexTransform() : _3_4_MAT_ | _ERROR_  { 
    //         const a_light : _4D_VEC_ | _ERROR_ = _Optical_Objects.render(this.avec,"light");
    //         if (typeof a_light === "number") return _ERROR_._NO_ERROR_;
    //         const b_light : _4D_VEC_ | _ERROR_ = _Optical_Objects.render(this.avec,"light");
    //         if (typeof b_light === "number") return _ERROR_._NO_ERROR_;
    //         const c_light : _4D_VEC_ | _ERROR_ = _Optical_Objects.render(this.avec,"light");
    //         if (typeof c_light === "number") return _ERROR_._NO_ERROR_;
    //         return [a_light,b_light,c_light];
    //     }
    //     private vertexShader(){}
    //     private fragmentTransform() {
    //             // Get 2d bounding rectangle
    //             const ret = this.getTriBoundingRect(this.A, this.B, this.C),
    //                 // Simple rasterizing function
    //                 minX = Math.round(Math.max(ret[0], 0)),
    //                 minY = Math.round(Math.max(ret[1], 0)),
    //                 maxX = Math.round(Math.min(ret[0] + ret[2], MODIFIED_PARAMS._CANVAS_WIDTH)),
    //                 maxY = Math.round(Math.min(ret[1] + ret[3], MODIFIED_PARAMS._CANVAS_HEIGHT));
    //             // Get Gaussian distribution array for particular pixel
    //             for (let x = minX; x <= maxX; x++) {
    //                 for (let y = minY; y <= maxY; y++) {
    //                     const point = [
    //                         [x],
    //                         [y]
    //                     ];
    //                     var interArray = this.interpolate(point, this.A, this.B, this.C);
    //                     if (this.isInsideTri() === true) {
    //                         const aCola = _Matrix.scaMult(this.aRatio, this.colA);
    //                         const bColb = _Matrix.scaMult(this.bRatio, this.colB);
    //                         const cColc = _Matrix.scaMult(this.cRatio, this.colC);
    //                         var pColp = _Matrix.matAdd(_Matrix.matAdd(aCola, bColb), cColc);
    //                         if (this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] > interArray[2]) {
    //                             this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] = interArray[2];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 0] = pColp[0];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 1] = pColp[1];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 2] = pColp[2];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 3] = pColp[3];
    //                         }
    //                     }
    //                 }
    //             }
    //     }
    //     private fragmentShader(shade : boolean){}
    //     shader(){
    //         this.vertexShader();
    //         this.fragmentShader();
    //     }
    // show() {
    //     // Normalize coordinate system to use CSS pixels
    //     octx.scale(this.scale, this.scale);
    //     ctx.scale(this.scale, this.scale);
    //     for (let y = 0; y < MODIFIED_PARAMS._CANVAS_HEIGHT; y++) {
    //         for (let x = 0; x < MODIFIED_PARAMS._CANVAS_WIDTH; x++) {
    //             const r = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 0];
    //             const g = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 1];
    //             const b = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 2];
    //             const alpha = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 3];
    //             if (typeof r !== "undefined" && typeof g != "undefined" && typeof b !== "undeefined") {
    //                 octx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + alpha / 255 + ")";
    //                 octx.fillRect(x, y, 1, 1);
    //             }
    //         }
    //     }
    //     octx.drawImage(ocanvas, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH * 0.5, MODIFIED_PARAMS._CANVAS_HEIGHT * 0.5);
    //     ctx.drawImage(ocanvas, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH * 0.5, MODIFIED_PARAMS._CANVAS_HEIGHT * 0.5, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH, MODIFIED_PARAMS._CANVAS_HEIGHT);
    // We implement a function closure here by binding the variable 'implementDrag'
    // to a local function and invoking the local function, this ensures that we have
    // some sort of private variables
    var implementDrag = (function () {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, prev = 0, now = Date.now(), dt = now - prev + 1, dX = 0, dY = 0, sens = 10, 
        // We invoke the local functions (changeSens and startDrag) as methods
        // of the object 'retObject' and set the return value of the local function
        // to 'retObject'
        retObject = {
            change: changeSens,
            start: drag,
            sensitivity: getSens()
        };
        function changeSens(value) {
            sens = value;
        }
        function getSens() {
            return sens;
        }
        function drag(element) {
            startDragMobile(element);
            startDrag(element);
        }
        function startDrag(element) {
            element.onmousedown = dragMouseDown;
        }
        function startDragMobile(element) {
            element.addEventListener('touchstart', dragTouchstart, { 'passive': true });
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = dragMouseup;
            document.onmousemove = dragMousemove;
        }
        function dragTouchstart(e) {
            e = e || window.event;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.addEventListener('touchend', dragTouchend, { 'passive': true });
            document.addEventListener('touchmove', dragTouchmove, { 'passive': true });
        }
        function dragMousemove(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = e.clientX - pos3;
            pos2 = e.clientY - pos4;
            pos3 = e.clientX;
            pos4 = e.clientY;
            dX = pos1 / dt;
            dY = pos2 / dt;
            prev = now;
            now = Date.now();
            dt = now - prev + 1;
            console.log(`X: ${dX * sens}`);
            console.log(`Y: ${dY * sens}`);
        }
        function dragTouchmove(e) {
            e = e || window.event;
            pos1 = e.touches[0].clientX - pos3;
            pos2 = e.touches[0].clientY - pos4;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            dX = pos1 / dt;
            dY = pos2 / dt;
            prev = now;
            now = Date.now();
            dt = now - prev + 1;
            console.log(`X: ${dX * sens}`);
            console.log(`Y: ${dY * sens}`);
        }
        function dragMouseup() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        function dragTouchend() {
            document.addEventListener('touchend', () => null, { 'passive': true });
            document.addEventListener('touchmove', () => null, { 'passive': true });
        }
        return retObject;
    })();
    implementDrag.start(canvas);
    function pick(event, destination) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;
        const pixel = ctx.getImageData(x, y, 1, 1);
        const data = pixel.data;
        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        destination.color.innerHTML = rgba;
        destination.pixel.innerHTML = `(${x},${y})`;
        return rgba;
    }
    canvas.addEventListener("mousemove", (event) => pick(event, hovered));
    canvas.addEventListener("click", (event) => pick(event, selected));
    const _Classes = (bases) => {
        class Bases {
            constructor() {
                bases.foreach((base) => Object.assign(this, new base()));
            }
        }
        bases.forEach((base) => {
            Object.getOwnPropertyNames(base.prototype)
                .filter(prop => prop != 'constructor')
                .forEach(prop => Bases.prototype[prop] = base.prototype[prop]);
        });
        return Bases;
    };
    _BasicSettings.setGlobalAlpha(0.6);
    class DrawCanvas {
        static drawCount = 0;
        constructor() {
            window.addEventListener("resize", () => this.drawCanvas());
        }
        drawCanvas() {
            ctx.globalAlpha = MODIFIED_PARAMS._GLOBAL_ALPHA;
            canvas.style.borderStyle = MODIFIED_PARAMS._BORDER_STYLE;
            canvas.style.borderWidth = MODIFIED_PARAMS._BORDER_WIDTH;
            canvas.style.borderColor = MODIFIED_PARAMS._BORDER_COLOR;
            canvas.style.opacity = MODIFIED_PARAMS._CANVAS_OPACITY;
            canvas.width = MODIFIED_PARAMS._CANVAS_WIDTH;
            canvas.height = MODIFIED_PARAMS._CANVAS_HEIGHT;
            DrawCanvas.drawCount++;
        }
    }
    const _DrawCanvas = new DrawCanvas();
    class Experimental {
        constructor() { }
        draw(coords, fill_style = "red", stroke_style = "black", stroke_width = 1, fill_bool = false) {
            ctx.globalAlpha = MODIFIED_PARAMS._GLOBAL_ALPHA;
            if (coords.length === 1) {
                const a = coords[0];
                if (a.r === 0)
                    this.drawPoint(a, fill_style, stroke_style);
                else
                    this.drawCircle(a.x, a.y, a.r, fill_style, stroke_style);
            }
            if (coords.length === 2) {
                const [a, b] = [...coords];
                this.drawLine(a, b, stroke_style, stroke_width);
            }
            if (coords.length === 3) {
                const [p, q, r] = [...coords];
                this.drawTriangle(p, q, r, fill_style, stroke_style);
            }
            else if (coords.length > 3) {
                this.drawPolygon(coords, fill_style, stroke_style, stroke_width, fill_bool);
            }
        }
        getCircumCircle_(coords) {
            const [a, b, c] = [...coords];
            return _Linear.getCircumCircle(a, b, c);
        }
        getInCircle_(coords) {
            const [a, b, c] = [...coords];
            return _Linear.getInCircle(a, b, c);
        }
        drawTriangle(a, b, c, fill_style = "red", stroke_style = "black") {
            if (typeof a !== "undefined" && typeof b !== "undefined" && typeof c !== "undefined") {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.lineTo(c.x, c.y);
                ctx.closePath();
                const _a = (Math.sqrt((c.x - b.x) ** 2 + (c.y - b.y) ** 2));
                const _b = (Math.sqrt((c.x - a.x) ** 2 + (c.y - a.y) ** 2));
                const _c = (Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2));
                const perimeter = _a + _b + _c;
                const semiperimeter = perimeter * 0.5;
                const area = Math.sqrt(semiperimeter * (semiperimeter - _a) * (semiperimeter - _b) * (semiperimeter - _c));
                const stroke_width = Math.round(Math.sqrt(area / perimeter));
                ctx.fillStyle = fill_style;
                ctx.fill();
                ctx.strokeStyle = stroke_style;
                ctx.lineWidth = stroke_width;
                ctx.stroke();
            }
        }
        drawPolygon(coords, fill_style = "red", stroke_style = "black", stroke_width = 1, fill_bool = false) {
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            for (let coord of coords) {
                ctx.lineTo(coord.x, coord.y);
            }
            ctx.closePath();
            if (fill_bool === true) {
                ctx.fillStyle = fill_style;
                ctx.fill();
            }
            ctx.strokeStyle = stroke_style;
            ctx.lineWidth = stroke_width;
            ctx.stroke();
        }
        drawCircle(x, y, r, fill_style = "red", stroke_style = "black") {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.closePath();
            const circumference = 2 * Math.PI * r;
            const area = Math.PI * r ** 2;
            const stroke_width = Math.round(Math.sqrt(area / circumference));
            ctx.fillStyle = fill_style;
            ctx.fill();
            ctx.strokeStyle = stroke_style;
            ctx.lineWidth = stroke_width;
            ctx.stroke();
        }
        drawPoint(o, fill_style = "black", stroke_style = "black", stroke_width = 1) {
            if (typeof o !== "undefined") {
                ctx.beginPath();
                ctx.arc(o.x, o.y, 5, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fillStyle = fill_style;
                ctx.fill();
                ctx.strokeStyle = stroke_style;
                ctx.lineWidth = stroke_width;
                ctx.stroke();
            }
        }
        drawText(x, y, text, fill_style = "black") {
            ctx.fillStyle = fill_style;
            ctx.lineWidth = 5;
            ctx.fillText(text, x, y);
        }
        drawLineFromPointGradient(p, gradient, x_scale, stroke_style = "black", width = 1) {
            const intercept = p.y - gradient * p.x;
            const new_x = p.x + x_scale;
            const new_y = gradient * new_x + intercept;
            this.drawLine(new Point2D(p.x, p.y), new Point2D(new_x, new_y), stroke_style, width);
        }
        drawLine(a, b, stroke_style = "black", stroke_width = 1) {
            if (typeof a !== "undefined" && typeof b !== "undefined") {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = stroke_style;
                ctx.lineWidth = stroke_width;
                ctx.stroke();
            }
        }
        drawDelaunay(delaunay, stroke_style = "black", stroke_width = 1) {
            const edges = delaunay.list;
            const point_list = delaunay.full_point_list;
            for (let edge of edges) {
                const [start, end] = edge.split("-").map((value) => { return point_list[Number(value)]; });
                this.drawLine(start, end, stroke_style, stroke_width);
            }
        }
        drawPoints(points, fill_style = "red", stroke_style = "red", stroke_width = 1, divide = points.length) {
            for (let pt_index in points) {
                if (Number(pt_index) >= divide)
                    continue;
                const point = points[pt_index];
                this.drawPoint(point, fill_style, stroke_style, stroke_width);
            }
        }
        labelPoints(points, fill_style = "orange", x_offset = 5, y_offset = -5, divide = points.length) {
            for (let pt_index in points) {
                if (Number(pt_index) >= divide)
                    continue;
                const point = points[pt_index];
                this.drawText(point.x + x_offset, point.y + y_offset, pt_index, fill_style);
            }
        }
    }
    const _Experimental = new Experimental();
    // const tricoords = [200, 400, 300, 100, 500, 450];
    const points_Set = [
        // [23, 29],
        // [328, 87],
        // [98, 234],
        // [892, 382],
        // [745, 342],
        // [442, 298],
        // [232, 450],
        // [900, 23],
        // [500, 500],
        // [573, 18],
        [294, 289],
        [423, 200],
        [234, 234],
        [300, 213],
        [278, 258],
        [352, 331]
    ];
    const pts = [
        [302, 447],
        [519, 406],
        [354, 321],
        [555, 427],
        [357, 502],
        [365, 511],
        [401, 488],
        [335, 320],
        [531, 449],
        [418, 336]
    ];
    pts.forEach((value, index) => { pts[index] = [value[0] / 3 + 200, value[1] / 3 + 200]; });
    console.log(pts);
    _DrawCanvas.drawCanvas();
    // const gen_points = _Miscellanous.generatePointsArray(300,600,300,550,10,false);
    // const gen_points = _Miscellanous.generatePointsArray(300,900,150,380,50,true);
    // const gen_points = _Miscellanous.generatePointsArray(50,1200,50,500,20,false);
    // const mod_points_Set = _Miscellanous.toPoints(gen_points);
    // const start = new Date().getTime();
    // const end = new Date().getTime();
    // if (d_result[5] === true) console.log(`Time taken for bowyer-watson with animation logging: ${end - start}`);
    // if (d_result[5] === false) 
    // console.log(`Time taken for voronoi diagram without animation logging: ${end - start}`);
    const pts_mod = _Miscellanous.toPoints(pts);
    const color_list = _Miscellanous.ranHexCol(20);
    const _LinearAlgebraSupport = new LinearAlgebraSupport(pts_mod, 0);
    _LinearAlgebraSupport.animate.time = Number(anim_speed_input.value); // actual time
    anim_number_input.oninput = function () {
        _LinearAlgebraSupport.animate.running = false;
        anim_number.innerHTML = anim_number_input.value;
        _LinearAlgebraSupport.changeCurIndex(Number(anim_number_input.value));
        _LinearAlgebraSupport.takeSnapshot();
    };
    anim_speed_input.oninput = function () {
        _LinearAlgebraSupport.animate.running = false;
        anim_speed.innerHTML = anim_speed_input.value;
        _LinearAlgebraSupport.animate.time = Number(anim_speed_input.value);
    };
    anim_info_btn.onclick = function () {
        if (_LinearAlgebraSupport.animate.running === false) {
            _LinearAlgebraSupport.runAnimation();
        }
        else {
            _LinearAlgebraSupport.animate.running = false;
        }
    };
    c_1.onclick = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        _LinearAlgebraSupport.animate.running = false;
        if (_LinearAlgebraSupport.c_1 === true) {
            _LinearAlgebraSupport.c_1 = false;
            c_1.style.backgroundColor = "#4CAF50";
            _LinearAlgebraSupport.checkC_S();
        }
        else if (_LinearAlgebraSupport.c_1 === false) {
            _LinearAlgebraSupport.c_1 = true;
            c_1.style.backgroundColor = "rgb(106, 231, 11)";
            _LinearAlgebraSupport.checkC_S();
        }
        _LinearAlgebraSupport.takeSnapshot();
    };
    c_2.onclick = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        _LinearAlgebraSupport.animate.running = false;
        if (_LinearAlgebraSupport.c_2 === true) {
            _LinearAlgebraSupport.c_2 = false;
            c_2.style.backgroundColor = "#4CAF50";
            _LinearAlgebraSupport.checkC_S();
        }
        else if (_LinearAlgebraSupport.c_2 === false) {
            _LinearAlgebraSupport.c_2 = true;
            c_2.style.backgroundColor = "rgb(106, 231, 11)";
            _LinearAlgebraSupport.checkC_S();
        }
        _LinearAlgebraSupport.takeSnapshot();
    };
    c_3.onclick = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        _LinearAlgebraSupport.animate.running = false;
        if (_LinearAlgebraSupport.c_3 === true) {
            _LinearAlgebraSupport.c_3 = false;
            c_3.style.backgroundColor = "#4CAF50";
            _LinearAlgebraSupport.checkC_S();
        }
        else if (_LinearAlgebraSupport.c_3 === false) {
            _LinearAlgebraSupport.c_3 = true;
            c_3.style.backgroundColor = "rgb(106, 231, 11)";
            _LinearAlgebraSupport.checkC_S();
        }
        _LinearAlgebraSupport.takeSnapshot();
    };
    for (let elem of c_elems) {
        elem.addEventListener("mouseover", (ev) => { elem.style.border = "3px solid burlywood"; });
        elem.addEventListener("mouseout", () => { elem.style.border = "none"; });
    }
    // var Slider = {
    //     slider : null,
    //     Start : function(i){
    //         this.slider = setInterval(function(){
    //             // Slider code
    //             console.log("running: " + i);
    //             i++;
    //         },1000);
    //     },
    //     Stop: function(){window.clearInterval(this.slider)}
    // }
    // var Slider = {
    //     slider : null,
    //     Start : function(i){
    //         this.slider = setTimeout(function(){
    //             // Slider code
    //             console.log("running: " + i);
    //             i++;
    //         },1000);
    //     },
    //     Stop: function(){window.clearTimeout(this.slider)}
    // }
    // const convexhull = _ConvexHull.jarvisConvexHull(mod_points_Set)
    // _Experimental.draw(convexhull.hull,"white","cyan",15,false);
    // for (let point in mod_points_Set){
    //     _Experimental.draw([mod_points_Set[point]], color_list[color_list.length % Number(point)]);
    // }
    // console.log(d_result)
    // _Experimental.drawDelaunay(d_result[0],"black",5);
    // const point_num = 1e3;
    // const n = 1;
    // const minX = -100;
    // const minY = -100;
    // const maxX = 100;
    // const maxY = 100;
    // const arr = _Miscellanous.generatePointsArray(minX, maxX, minY, maxX, point_num, false);
    // const mod_arr = _Miscellanous.toPoints(arr);
    // const start = new Date().getTime();
    // for (let i = 0; i < n; i++)
    //     _Delaunay.divide_n_conquer(mod_arr);
    // const end = new Date().getTime();
    // console.log(`Minimum value of X: ${minX}\nMaximum value of X: ${maxX}\nMinimum value of Y: ${minY}\nMaximum value of Y: ${maxY}`);
    // console.log(`Time taken To run Delaunay Triangulation Divide and Conquer Algorithm with ${point_num} points at ${n} iterations: ${end - start} ms`);
    // const point_num = 1e3;
    // const n = 1e4;
    // const minX = 0;
    // const minY = 0;
    // const maxX = 100;
    // const maxY = 100;
    //const points_ = _Miscellanous.generatePointsArray(minX, maxX, minY, maxY, point_num, false);
    // console.log(points_)
    // const first = new Date().getTime();
    // for (let i = 0; i < n; i++) {
    //     _ConvexHull.jarvisConvexHull(points_);
    // }
    // const second = new Date().getTime();
    // console.log(`Minimum value of X: ${minX}\nMaximum value of X: ${maxX}\nMinimum value of Y: ${minY}\nMaximum value of Y: ${maxY}`);
    // console.log(`Time taken To run Jarvis Algorithm with ${point_num} points at ${n} iterations: ${second - first} ms`);
    // const tr = [100, 400, 150, 313.4, 200, 400]
    // _Experimental.draw(tr);
    // const cr = _Experimental.getCircumCircle_(tr);
    // const cf = _Experimental.getInCircle_(tr);
    // console.log(tr)
    // console.log(cr)
    // console.log(cf)
    // _Experimental.draw(cr);
    // _Experimental.draw(cf)
    // _Experimental.draw(tricoords)
    // _Experimental.drawPoint(tricoords[0], tricoords[1], 'green');
    // _Experimental.drawText(tricoords[0] - 10, tricoords[1] + 10, "A", "green");
    // _Experimental.drawPoint(tricoords[2], tricoords[3], 'blue');
    // _Experimental.drawText(tricoords[2] - 5, tricoords[3] - 10, "B", "blue");
    // _Experimental.drawPoint(tricoords[4], tricoords[5], 'red');
    // _Experimental.drawText(tricoords[4] + 10, tricoords[5] + 10, "C", "red");
    // const test_1 = _Experimental.getCircumCircle_(tricoords);
    // const test_2 = _Experimental.getInCircle_(tricoords);
    // console.log(test_1)
    // console.log(test_2)
    // _Experimental.draw(test_1);
    // _Experimental.draw(test_2);
    // _Experimental.drawPoint(test_1[0],test_2[1], "blue", "white");
    // _Experimental.drawPoint(test_2[0],test_2[1], "pink", "cyan");
})();
