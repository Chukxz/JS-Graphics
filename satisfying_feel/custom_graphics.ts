//

(function () {
    "use strict"

    const pListCache: {} = {};
    const pArgCache: {} = {};

    // const scrW = screen.width;
    // const scrH = screen.height;

    // var prevW = 0;
    // var prevH = 0;
    // var speed = 0;
    // var prev = Date.now()

    const main_nav = document.getElementById("main_nav") as HTMLUListElement;
    main_nav.style.width = `${window.innerWidth - 80}px`;


    const drop = document.getElementById("main_drop") as HTMLDivElement;
    var drop_v = false;
    const drop_content = document.getElementById("main_drop_c") as HTMLDivElement;

    const canvas = document.getElementsByTagName('canvas')[0];


    const ctx = canvas.getContext('2d',{ willReadFrequently: true }) as CanvasRenderingContext2D;
    const status = document.getElementById("status") as HTMLElement;

    const anim_number = document.getElementById("anim1_value") as HTMLElement;
    const anim_number_input = document.getElementById("animation_number") as HTMLInputElement;

    const anim_speed = document.getElementById("anim2_value") as HTMLElement;
    const anim_speed_input = document.getElementById("animation_speed") as HTMLInputElement;

    const anim_info_btn = document.getElementById("anim_info") as HTMLButtonElement;

    const after_anim1 = document.getElementById("after_anim1") as HTMLElement;

    const c_1 = document.getElementById("c_1") as HTMLButtonElement;
    const c_2 = document.getElementById("c_2") as HTMLButtonElement;
    const c_3 = document.getElementById("c_3") as HTMLButtonElement;
    const c_elems = document.getElementsByClassName("cdv_elem") as HTMLCollectionOf<HTMLButtonElement>;

    interface PICK {
        color: HTMLElement | null;
        pixel: HTMLElement | null;
    }

    const hovered: PICK = { color: document.getElementById('hoveredColor'),pixel: document.getElementById('hoveredPixel') };

    const selected: PICK = { color: document.getElementById('selectedColor'),pixel: document.getElementById('selectedPixel') };

    type _ANGLE_UNIT_ = "deg" | "rad" | "grad";

    type _2D_VEC_ = [number,number];

    type _3D_VEC_ = [number,number,number];

    type _4D_VEC_ = [number,number,number,number];

    type _7D_VEC_ = [..._3D_VEC_,..._4D_VEC_];

    type _9D_VEC_ = [..._3D_VEC_,..._3D_VEC_,..._3D_VEC_];

    type _16D_VEC_ = [..._4D_VEC_,..._4D_VEC_,..._4D_VEC_,..._4D_VEC_];

    type _3_3_MAT_ = [_3D_VEC_,_3D_VEC_,_3D_VEC_];

    type _3_2_MAT_ = [_2D_VEC_,_2D_VEC_,_2D_VEC_];

    type _3_4_MAT_ = [_4D_VEC_,_4D_VEC_,_4D_VEC_];

    type _3_7_MAT_ = [_7D_VEC_,_7D_VEC_,_7D_VEC_];

    type _PLANE_ = "U-V" | "U-N" | "V-N";

    type _OBJ_STATE_ = "local" | "object" | "world";

    type _HANDEDNESS_ = "left" | "right";

    type _OPTICAL_ = "light" | "camera" | "none";

    type _HALFEDGE_ = {
        vertices: _2D_VEC_;
        face_vertices: number[];
        twin: string;
        prev: string;
        next: string;
        face_index: number;
    }

    type _CDV_ = "convex-hull" | "delaunay" | "voronoi";

    // 0 - 
    // 1 - Convex Hull
    // 2 - Delaunay
    // 3 - Voronoi
    // 4 - Convex Hull and Delaunay
    // 5 - Convex Hull and Voronoi
    // 6 - Delaunay and Voronoi
    // 7 - Convex Hull, Delaunay and Voronoi

    type _CDV_SWITCH_ = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;


    // A - Basic Point ( Points of Graph)
    // B - Super Triangle Point
    // C - Voronoi Point ( Triangle Circumcenters)
    // D - Basic Edge ( Basic point - Basic Point)
    // E - Super Edge ( Basic Point or Super Point - Basic Point or Super Point)
    // F - Voronoi Edge ( Voronoi Point - Voronoi Point)
    // G - Mid_Edge ( Mid_Point { of selected Voronoi Edge} - Voronoi Point)
    // H - Polygon { Triangle ( Basic Point - Basic Point - Basic Point ) }

    type _RET_TYPE_ = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"

    type _CONVEX_HULL = { hull: Point2D[],points: number[],history: Ret[][] };

    type _DELAUNAY = { list: string[],full_point_list: Point2D[],history: Ret[][];};

    type _VORONOI = { edges: string[],full_point_list: Point2D[],history: Ret[][];};

    type _FULL_CDV = [_CONVEX_HULL,_DELAUNAY,_VORONOI,MeshDataStructure,string[],Point2D[],Ret[],Point2D[],string[]];

    type _RET = { ret_list: Ret[],list: string[] };

    type _MINMAX = { minX: number,maxX: number,minY: number,maxY: number };

    type _CROSS = { ph: Point2D,qh: Point2D,pv: Point2D,qv: Point2D };

    type _MID_EDGES_LIST = {
        mid_pt_index: number;
        circum_pt_index: number;
    }

    type _CONNECTIVITY_ = {
        faces: string[];
        edges: string[];
    }

    enum _ERROR_ {
        _NO_ERROR_ = 1e12,
        _SETTINGS_ERROR_,
        _MISCELLANOUS_ERROR_,
        _QUARTERNION_ERROR_,
        _MATRIX_ERROR_,
        _VECTOR_ERROR_,
        _PERSPECTIVE_PROJ_ERROR_,
        _CLIP_ERROR_,
        _LOCAL_SPACE_ERROR_,
        _WORLD_SPACE_ERROR_,
        _CLIP_SPACE_ERROR_,
        _SCREEN_SPACE_ERROR_,
        _OPTICAL_ELEMENT_OBJECT_ERROR_,
        _RENDER_ERROR_,
        _DRAW_CANVAS_ERROR_,
    }

    interface DRAG {
        change: (value: number) => void,
        start: (element: any) => void,
        sensitivity: number
    }

    interface _BASIC_PARAMS_ {
        _GLOBAL_ALPHA: number,
        _CANVAS_OPACITY: string,
        _CANVAS_WIDTH: number,
        _CANVAS_HEIGHT: number,
        _BORDER_COLOR: string,
        _BORDER_WIDTH: string,
        _BORDER_RADIUS: string,
        _BORDER_STYLE: string,
        _THETA: number,
        _ANGLE_UNIT: _ANGLE_UNIT_
        _ANGLE_CONSTANT: number,
        _REVERSE_ANGLE_CONSTANT: number,
        _HANDEDNESS: _HANDEDNESS_;
        _HANDEDNESS_CONSTANT: number,
        _X: _3D_VEC_,
        _Y: _3D_VEC_,
        _Z: _3D_VEC_,
        _Q_VEC: _3D_VEC_,
        _Q_QUART: _4D_VEC_,
        _Q_INV_QUART: _4D_VEC_,
        _NZ: number,
        _FZ: number,
        _PROJ_ANGLE: number,
        _ASPECT_RATIO: number,
        _DIST: number,
        _HALF_X: number,
        _HALF_Y: number,
        _PROJECTION_MAT: _16D_VEC_,
        _INV_PROJECTION_MAT: _16D_VEC_,
        _ACTIVE: string,
    }

    const DEFAULT_PARAMS: _BASIC_PARAMS_ =
    {
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
        _X: [1,0,0],
        _Y: [0,1,0],
        _Z: [0,0,1],
        _Q_VEC: [0,0,0],
        _Q_QUART: [0,0,0,0],
        _Q_INV_QUART: [0,0,0,0],
        _NZ: -0.1,
        _FZ: -100,
        _PROJ_ANGLE: 60,
        _ASPECT_RATIO: 1,
        _DIST: 1,
        _HALF_X: 1,
        _HALF_Y: 1,
        _PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _INV_PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _ACTIVE: "",
    }

    const MODIFIED_PARAMS: _BASIC_PARAMS_ = JSON.parse(JSON.stringify(DEFAULT_PARAMS))

    class BackwardsCompatibilitySettings {
        test_array: any;
        compatibility_error: boolean;
        error_pos: number[];
        // Composition is used as we don't want to compute the basic error-checking everytime.
        constructor () {
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
            for(let i = 0; i < test_array_len; i++) {
                if(this.test_array[i] === false) {
                    this.error_pos[inc] = i;
                    inc++;
                }
                this.compatibility_error = this.error_pos.length > 0;
            }
        }

        flat_exists() {
            if(typeof this.test_array.flat !== "undefined" && typeof this.test_array.flat === "function") this.test_array[0] = true;
            else this.test_array[0] = false;
        }

        map_exists() {
            if(typeof this.test_array.map !== "undefined" && typeof this.test_array.map === "function") this.test_array[1] = true;
            else this.test_array[1] = false;
        };

        reduce_exists() {
            if(typeof this.test_array.reduce !== "undefined" && typeof this.test_array.reduce === "function") this.test_array[2] = true;
            else this.test_array[2] = false;
        };

        reverse_exists() {
            if(typeof this.test_array.reverse !== "undefined" && typeof this.test_array.reverse === "function") this.test_array[3] = true;
            else this.test_array[3] = false;
        };

        push_exists() {
            if(typeof this.test_array.push !== "undefined" && typeof this.test_array.push === "function") this.test_array[4] = true;
            else this.test_array[4] = false;
        }

        forEach_exists() {
            if(typeof this.test_array.forEach !== "undefined" && typeof this.test_array.forEach === "function") this.test_array[5] = true;
            else this.test_array[5] = false;
        }
    }

    class BasicSettings {

        // Miscellanous

        private object_vertices: []
        private prev_hovered_vertices_array: [];
        private hovered_vertices_array: [];
        private pre_selected_vertices_array: [];
        private selected_vertices_array: [];
        private _last_active: HTMLLIElement;

        constructor () {
            (drop as HTMLElement).style.top = `${-(drop as HTMLElement).offsetTop + canvas.offsetTop}px`;
            this.setCanvas();
            this.resetCanvasToDefault();

            drop.onclick = function () {
                if(drop_v === true) {
                    drop_content.style.display = "none";
                    drop_v = false;
                }

                else if(drop_v === false) {
                    drop_content.style.display = "inline-block";
                    drop_v = true;
                }
            }

            drop.addEventListener("mouseover",() => { if(drop_v === false) drop_content.style.display = "inline-block" });
            drop.addEventListener("mouseout",() => { if(drop_v === false) drop_content.style.display = "none" });
            drop_content.addEventListener("click",(ev) => {
                ev.stopPropagation();
            });

            canvas.addEventListener("click",() => {
                if(drop_v === true) {
                    drop_content.style.display = "none";
                    drop_v = false;
                }
            });

            window.addEventListener("resize",() => {
                this.refreshCanvas();
                main_nav.style.width = `${window.innerWidth - 80}px`;
            });

            var numero = 0;
            for(let child of main_nav.children) {
                const _child = document.getElementById(child.id) as HTMLLIElement;
                if(numero === 0) this.modifyState(child.id,_child,true);
                numero++;
                _child.addEventListener("mouseenter",() => { this.hoverState(child.id,_child) });
                _child.addEventListener("mouseout",() => { this.unhoverState(child.id,_child) });
                _child.addEventListener("click",() => { this.modifyState(child.id,_child) });
            }
        }

        setGlobalAlpha(alpha: number) {
            MODIFIED_PARAMS._GLOBAL_ALPHA = alpha;
        }

        setCanvasOpacity(opacity: string) {
            MODIFIED_PARAMS._CANVAS_OPACITY = opacity;
        }

        setCanvas(): void {
            // Canvas
            var width = window.innerWidth - 50;

            const height = window.innerHeight - 100;

            MODIFIED_PARAMS._CANVAS_WIDTH = width;

            MODIFIED_PARAMS._CANVAS_HEIGHT = height;

            // Coordinate Space
            MODIFIED_PARAMS._HALF_X = width / 2;
            MODIFIED_PARAMS._HALF_Y = height / 2;

            // Perspective Projection
            MODIFIED_PARAMS._ASPECT_RATIO = width / height;
        }

        resetCanvasToDefault() {
            canvas.style.borderColor = DEFAULT_PARAMS._BORDER_COLOR
            canvas.style.borderWidth = DEFAULT_PARAMS._BORDER_WIDTH
            canvas.style.borderRadius = DEFAULT_PARAMS._BORDER_RADIUS
            canvas.style.borderStyle = DEFAULT_PARAMS._BORDER_STYLE;
            ctx.globalAlpha = DEFAULT_PARAMS._GLOBAL_ALPHA;
        }

        refreshCanvas() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            this.setCanvas();
        }

        changeAngleUnit(angleUnit: _ANGLE_UNIT_) {
            MODIFIED_PARAMS._ANGLE_UNIT = angleUnit;
            MODIFIED_PARAMS._ANGLE_CONSTANT = this.angleUnit(angleUnit);
            MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT = this.revAngleUnit(angleUnit);
        }

        setHandedness(value: _HANDEDNESS_) {
            if(value === 'left') MODIFIED_PARAMS._HANDEDNESS_CONSTANT = -1;
            else if(value === 'right') MODIFIED_PARAMS._HANDEDNESS_CONSTANT = 1;
        }

        private angleUnit(angle_unit: _ANGLE_UNIT_): number { // for sin, sinh, cos, cosh, tan and tanh  
            if(angle_unit === "deg") return Math.PI / 180; // deg to rad
            else if(angle_unit === "rad") return 1; // rad to rad
            else if(angle_unit === 'grad') return Math.PI / 200; // grad to rad
            else return _ERROR_._SETTINGS_ERROR_;
        }

        private revAngleUnit(angle_unit: _ANGLE_UNIT_): number { // for asin, asinh, acos, acosh, atan and atanh  
            if(angle_unit === "deg") return 180 / Math.PI; // rad to deg
            else if(angle_unit === "rad") return 1; // rad to rad
            else if(angle_unit === 'grad') return 200 / Math.PI; // rad to grad
            else return _ERROR_._SETTINGS_ERROR_;
        }

        unhoverState(value: string,elem: HTMLLIElement) {
            if(value !== MODIFIED_PARAMS._ACTIVE) {
                elem.style.backgroundColor = "#333";
            }
        }

        hoverState(value: string,elem: HTMLLIElement) {
            if(value !== MODIFIED_PARAMS._ACTIVE) {
                elem.style.backgroundColor = "#111";
            }
        }

        modifyState(value: string,elem: HTMLLIElement,first = false) {
            if(value !== MODIFIED_PARAMS._ACTIVE) {
                MODIFIED_PARAMS._ACTIVE = value;
                this.refreshState();
                elem.style.backgroundColor = "#4CAF50";
                if(first === false) this._last_active.style.backgroundColor = "#333";
                this._last_active = elem;
            }
        }

        refreshState() {}
    }

    const _BasicSettings = new BasicSettings();

    _BasicSettings.setGlobalAlpha(0.6);

    class DrawCanvas {
        protected static drawCount = 0;
        constructor () {
            window.addEventListener("resize",() => this.drawCanvas());
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

    class Miscellanous {
        constructor () {}
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
        resetDepthBuffer(depthBuffer: Float64Array) {
            return depthBuffer.fill(Infinity);
        }
        initFrameBuffer() {
            const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
            return new Uint8Array(elementNum * 4);
        }
        resetFrameBuffer(frameBuffer: Uint8Array) {
            return frameBuffer.map((value,index) => {
                const mod4 = index % 4;
                if(mod4 < 3) {
                    return value = 0;
                } else
                    return value = 255;
            });
        }
        getPermutationsArr(arr: number[],permutationSize: number) {
            const permutations: number[][] = [];

            function backtrack(currentPerm: any) {
                if(currentPerm.length === permutationSize) {
                    permutations.push(currentPerm.slice());
                    return;
                }
                arr.forEach((item) => {
                    if(currentPerm.includes(item))
                        return;
                    currentPerm.push(item);
                    backtrack(currentPerm);
                    currentPerm.pop();
                });
            }
            backtrack([]);
            return permutations;
        }
        getCombinationsArr(arr: number[],combinationSize: number) {
            const combinations: number[][] = [];

            function backtrack(startIndex: number,currentCombination: any) {
                if(currentCombination.length === combinationSize) {
                    combinations.push(currentCombination.slice());
                    return;
                }
                for(let i = startIndex; i < arr.length; i++) {
                    currentCombination.push(arr[i]);
                    backtrack(i + 1,currentCombination);
                    currentCombination.pop();
                }
            }
            backtrack(0,[]);
            return combinations;
        }
        getFibonacciNum(num: number) {
            if(num < 0)
                return 0;
            else if(num === 0 || num === 1)
                return 1;
            else
                return this.getFibonacciNum(num - 1) + this.getFibonacciNum(num - 2);
        }
        getFibonacciSeq(start: number,stop: number) {
            var s = Math.max(start,0);
            const hold: number[] = [];
            var n = 0;
            while(s <= stop) {
                hold[n] = this.getFibonacciNum(s);
                n++;
                s++;
            }
            return hold;
        }
        getFactorialNum(num: number) {
            if(num <= 1)
                return 1;
            else
                return num * this.getFactorialNum(num - 1);
        }
        getFactorialSeq(start: number,stop: number) {
            var s = Math.max(start,0);
            const hold: number[] = [];
            var n = 0;
            while(s <= stop) {
                hold[n] = this.getFactorialNum(s);
                n++;
                s++;
            }
            return hold;
        }

        getCombinationsNum(n: number,r: number) {
            return (this.getFactorialNum(n) / ((this.getFactorialNum(n - r)) * (this.getFactorialNum(r))));
        }

        getPermutationsNum(n: number,r: number) {
            return (this.getFactorialNum(n) / (this.getFactorialNum(n - r)));
        }
        getParamAsList(maxPLen: number,paramList: number[]): number[] {
            if(arguments.length === 2) {
                const key = `${paramList}-${maxPLen}`;
                if(pListCache[key] !== undefined) {
                    return pListCache[key];
                }
                var count = 0;
                var compParamList: number[] = [];
                for(let i of paramList) {
                    if(i < maxPLen) {
                        compParamList[count] = i;
                        count++;
                    }
                }
                pListCache[key] = compParamList;
                return compParamList;
            }
            return [0];
        }
        getParamAsArg(maxPLen = Infinity,...args: number[]): number[] {
            const key = `${args}-${maxPLen}`;
            if(pArgCache[key] !== undefined) {
                return pArgCache[key];
            }
            if(arguments.length > 1 && arguments.length <= 4) {
                var start = 0;
                var end = maxPLen;
                var interval = 1;
                if(arguments.length === 2) {
                    if(arguments[1] !== undefined) {
                        end = Math.min(arguments[1],maxPLen);
                    } else {
                        end = maxPLen;
                    }
                } else {
                    start = arguments[1] || 0;
                    if(arguments[1] !== undefined) {
                        end = Math.min(arguments[2],maxPLen);
                    } else {
                        end = maxPLen;
                    }
                    interval = arguments[3] || 1;
                }
                var count = 0;
                var index = 0;
                var compParamList: number[] = [];
                for(let i = start; i < end; i++) {
                    index = start + (count * interval);
                    if(index < end) {
                        compParamList[count] = index;
                        count++;
                    }
                }
                pArgCache[key] = compParamList;
                return compParamList;
            }
            return [0];
        }
        createArrayFromArgs(length): any[] {
            var arr = new Array(length || 0),
                i = length;
            if(arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments,1);
                while(i--) {
                    arr[length - 1 - i] = this.createArrayFromArgs.apply(this,args);
                }
            }
            return arr;
        }
        createArrayFromList(param: number[]): any[] {
            var arr = new Array(param[0] || 0),
                i = param[0];
            if(param.length > 1) {
                var args = Array.prototype.slice.call(param,1);
                while(i--) {
                    arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this,args);
                }
            }
            return arr;
        }

        getArrayIndex(array: number[],value: number) {
            for(let i = 0; i < array.length; i++) {
                if(array[i] === value) return i;
                else return -1;
            }
            return -1;
        }
        deepCopy(val: any) {
            var res = JSON.parse(JSON.stringify(val));
            if(typeof structuredClone === "function") {
                res = structuredClone(val);
            }
            return res;
        }

        toPoints2D(pointList: any[]): Point2D[] {
            const retList: Point2D[] = [];
            for(let point in pointList) {
                retList[point] = new Point2D(pointList[point][0],pointList[point][1]);
            }
            return retList;
        }

        toPoints3D(pointList: any[]): Point3D[] {
            const retList: Point3D[] = [];
            for(let point in pointList) {
                retList[point] = new Point3D(pointList[point][0],pointList[point][1],pointList[point][2]);
            }
            return retList;
        }

        points2DTo3D(pointList: Point2D[],z_coords: number[],use_z_coords = false): Point3D[] {
            const retList: Point3D[] = [];
            var index = 0;
            for(let point of pointList) {
                if(use_z_coords === true) {
                    retList.push(new Point3D(point.x,point.y,z_coords[index]));
                    index++;
                }
                else retList.push(new Point3D(point.x,point.y,0));
            }
            return retList;
        }

        points3DTo2D(pointList: Point3D[]): Point2D[] {
            const retList: Point2D[] = [];
            for(let point of pointList) {
                retList.push(new Point2D(point.x,point.y));
            }
            return retList;
        }

        genEdgefromArray(array: number[],sort = true) {
            var prev = array[array.length - 1]; // set previous to last element in the array
            var a = 0;
            var b = 0;
            const result: string[] = [];

            for(let index in array) {
                if(sort === true) { [a,b] = [Math.min(prev,array[index]),Math.max(prev,array[index])]; }
                else[a,b] = [prev,array[index]];
                result[index] = `${a}-${b}`;
                prev = array[index];
            }

            return result;
        }

        genArray(min: number,n: number,diff: number,decimal: boolean) {
            const list: number[] = [];
            for(let i = 0; i < n; i++) {
                if(decimal === true) list[i] = min + Math.random() * diff;
                else if(decimal === false) list[i] = Math.round(min + Math.random() * diff);
            }
            return list;
        }

        generatePointsArray(minX = 0,maxX = 100,minY = 0,maxY = 100,n = 10,decimal = false) {
            const _minX = Math.min(minX,maxX);
            const _maxX = Math.max(minX,maxX);
            const _minY = Math.min(minY,maxY);
            const _maxY = Math.max(minY,maxY);
            const diffX = _maxX - _minX;
            const diffY = _maxY - _minY;

            const xlist = this.genArray(_minX,n,diffX,decimal);
            const ylist = this.genArray(_minY,n,diffY,decimal);

            const xylist: number[][] = [];

            for(let i = 0; i < n; i++) {
                xylist[i] = [xlist[i],ylist[i]];
            }

            return xylist;
        }

        getRanHex = (size = 1) => [...Array(size)].map((elem) => elem = Math.floor(Math.random() * 16).toString(16)).join("");

        ranHexCol = (num = 100,size = 6,exclude_col = "black") => [...Array(num)].map((elem,index) => elem = index === 0 ? exclude_col : "#" + this.getRanHex(size));
    }

    const _Miscellanous = new Miscellanous();
    class Linear {
        constructor () {}
        getSlope(A_: _2D_VEC_,B_: _2D_VEC_) {
            var numer = B_[1] - A_[1];
            var denum = B_[0] - A_[0];
            return numer / denum;
        }
        getMid(a: number[],b: number[],paramList: number[]) {
            var ret: any[] = [];
            var count = 0;
            for(let val of paramList) {
                ret.push([(a[val] + b[val]) / 2]);
                count++;
            }
            return ret;
        }
        getDist(a: number[],b: number[],paramList: number[]) {
            var ret = 0;
            const pLen = paramList.length;
            for(let val = 0; val < pLen; val++) {
                ret += (a[val] - b[val]) ** 2;
            }
            return Math.sqrt(ret);
        }
        getTriArea(a: number,b: number,c: number) {
            var S = (a + b + c) / 2;
            return Math.sqrt(S * (S - a) * (S - b) * (S - c));
        }
        isInsideCirc(point: Point2D,circle: _3D_VEC_) {
            const x = Math.abs(point.x - circle[0]);
            const y = Math.abs(point.y - circle[1]);
            const r = circle[2];
            if((x ** 2 + y ** 2) <= r ** 2) {
                return true;
            } else
                return false;
        }
        isInsideTri(pvec: _3D_VEC_,avec: _3D_VEC_,bvec: _3D_VEC_,cvec: _3D_VEC_) {
            const [TotalArea,triA,triB,triC] = this.interpolateTriCore2(pvec,avec,bvec,cvec);
            const sum = triA + triB + triC;
            if(Math.round(sum) === Math.round(TotalArea)) {
                return true;
            }
            return false;
        }
        getCircumCircle(a: Point2D,b: Point2D,c: Point2D): Point2D {
            const mid_AB = [(a.x + b.x) / 2,(a.y + b.y) / 2];
            const mid_AC = [(a.x + c.x) / 2,(a.y + c.y) / 2];
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
            if(Math.abs(grad_AB) === 0) {
                X = mid_AB[0];
                compute_X = false;
            } else if(Math.abs(grad_AB) === Infinity) {
                Y = mid_AB[1];
                compute_Y = false;
            }

            if(Math.abs(grad_AC) === 0) {
                X = mid_AC[0];
                compute_X = false;
            } else if(Math.abs(grad_AC) === Infinity) {
                Y = mid_AC[1];
                compute_Y = false;
            }

            if(compute_X === true) X = (intercept_norm_AB - intercept_norm_AC) / (norm_AC - norm_AB);
            if(compute_Y === true) Y = (norm_AB * X) + intercept_norm_AB;
            const r_squared = (a.x - X) ** 2 + (a.y - Y) ** 2;

            return new Point2D(X,Y,(Math.sqrt(r_squared)));
        }

        getInCircle(a: Point2D,b: Point2D,c: Point2D): Point2D {
            const BC = Math.sqrt((c.x - b.x) ** 2 + (c.y - b.y) ** 2);
            const AC = Math.sqrt((c.x - a.x) ** 2 + (c.y - a.y) ** 2);
            const AB = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
            const X = (BC * a.x + AC * b.x + AB * c.x) / (AB + AC + BC);
            const Y = (BC * a.y + AC * b.y + AB * c.y) / (AB + AC + BC)
            const s = (AB + AC + BC) / 2
            const r_squared = ((s - AB) * (s - AC) * (s - BC)) / s;

            return new Point2D(X,Y,(Math.sqrt(r_squared)));
        }

        findCircTriFSq(rect: _4D_VEC_,angle = 45): Point2D[] {
            var mid = (rect[2] / 2) + rect[0];
            var lSmall = rect[2] / 2;
            var hSmall = Math.tan((angle * Math.PI) / 180) * lSmall;
            var hBig = hSmall + rect[3];
            var lBig = hBig / (Math.tan((angle * Math.PI) / 180));
            var A = new Point2D(mid - lBig,rect[1] + rect[3]);
            var B = new Point2D(mid,rect[1] - hSmall);
            var C = new Point2D(mid + lBig,rect[1] + rect[3]);

            return [A,B,C];
        }

        getTriBoundingRect(vertices: Point2D[]): _4D_VEC_ {
            var n = vertices.length;
            var xArr = [0,0,0];
            var yArr = [0,0,0];
            var xmin = Infinity;
            var ymin = Infinity;
            var xmax = 0;
            var ymax = 0;
            for(let i = 0; i < n; i++) {
                xArr[i] = vertices[i].x;
                yArr[i] = vertices[i].y;
                if(xArr[i] < xmin) {
                    xmin = xArr[i];
                }
                if(yArr[i] < ymin) {
                    ymin = yArr[i];
                }
                if(xArr[i] > xmax) {
                    xmax = xArr[i];
                }
                if(yArr[i] > ymax) {
                    ymax = yArr[i];
                }
            }

            return [xmin,ymin,xmax - xmin,ymax - ymin];
        }

        superTriangle(pointList: Point2D[]): Point2D[] {
            const rect = this.getTriBoundingRect(pointList);
            const tri = this.findCircTriFSq(rect);

            return tri;
        }

        interpolateTriCore1(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            const indexList = [0,1];
            const Adist = _Linear.getDist(bvec,cvec,indexList);
            const Bdist = _Linear.getDist(avec,cvec,indexList);
            const Cdist = _Linear.getDist(avec,bvec,indexList);
            const apdist = _Linear.getDist(pvec,avec,indexList);
            const bpdist = _Linear.getDist(pvec,bvec,indexList);
            const cpdist = _Linear.getDist(pvec,cvec,indexList);

            return [Adist,Bdist,Cdist,apdist,bpdist,cpdist];
        }
        interpolateTriCore2(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            const [Adist,Bdist,Cdist,apdist,bpdist,cpdist] = this.interpolateTriCore1(pvec,avec,bvec,cvec);
            const TotalArea = _Linear.getTriArea(Adist,Bdist,Cdist);
            const triA = _Linear.getTriArea(Adist,bpdist,cpdist);
            const triB = _Linear.getTriArea(Bdist,apdist,cpdist);
            const triC = _Linear.getTriArea(Cdist,apdist,bpdist);

            return [TotalArea,triA,triB,triC];
        }
        interpolateTriCore3(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            const [TotalArea,triA,triB,triC] = this.interpolateTriCore2(pvec,avec,bvec,cvec);
            const aRatio = triA / TotalArea;
            const bRatio = triB / TotalArea;
            const cRatio = triC / TotalArea;
            const aPa = _Matrix.scaMult(aRatio,avec);
            const bPb = _Matrix.scaMult(bRatio,bvec);
            const cPc = _Matrix.scaMult(cRatio,cvec);

            return _Matrix.matAdd(_Matrix.matAdd(aPa,bPb),cPc);
        }

        interpolateTri(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            return this.interpolateTriCore3(pvec,avec,bvec,cvec);
        }

        // Given three collinear points p,q,r, the function checks if
        // point q lies on line segment "pr"
        onSegment(p: Point2D,q: Point2D,r: Point2D) {
            if(q.x <= Math.max(p.x,r.x) && q.x >= Math.min(p.x,r.x) &&
                q.y <= Math.max(p.y,r.y) && q.y >= Math.min(p.y,r.y))
                return true;

            return false;
        }

        //To find orientation of ordered triplet (p,q,r),
        //The function returns the following values
        // 0 --> p,q and r are collinear
        // 1 --> Clockwise
        // 2 --> Counterclockwise
        findOrientation(p: Point2D,q: Point2D,r: Point2D) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

            if(val === 0) return 0; // collinear

            return (val > 0) ? 1 : 2 // clock or counterclock wise
        }


        // if val returned is 0, points are collinear
        // if val returned is greater than 0, points are clockwise
        // if val returned is lesser than 0, points are counterclockwise
        findOrientationDegree(p: Point2D,q: Point2D,r: Point2D) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

            return val;
        }

        // The main function that returns true if line segment 'p1q1'
        // and 'p2q2' intersect
        doIntersect(p1: Point2D,q1: Point2D,p2: Point2D,q2: Point2D) {
            // Find the four orientations needed for general and 
            //special cases
            const o1 = this.findOrientation(p1,q1,p2);
            const o2 = this.findOrientation(p1,q1,q2);
            const o3 = this.findOrientation(p2,q2,p1);
            const o4 = this.findOrientation(p2,q2,q1);

            // General Case

            if(o1 !== o2 && o3 !== o4) return true;

            // Special Cases
            // p1,q1 and p2 are collinear and p2 lies on segment p1q1
            if(o1 === 0 && this.onSegment(p1,p2,q1)) return true;

            // p1,q1 and q2 are collinear and q2 lies on segment p1q1
            if(o2 === 0 && this.onSegment(p1,q2,q1)) return true;

            // p2,q2 and p1 are collinear and p1 lies on segment p2q2
            if(o3 === 0 && this.onSegment(p2,p1,q2)) return true;

            // p2,q2 and q1 are collinear and q1 lies on segment p2q2
            if(o4 === 0 && this.onSegment(p2,q1,q2)) return true;

            return false; // Doesnt't fall in any of the above cases
        }

        mostCWPoint(p: Point2D,q: Point2D,points: Point2D[]) {
            var orientation = 0;
            var index = -1;
            for(let point in points) {
                const res = this.findOrientationDegree(p,q,points[point]);
                if(res > orientation) {
                    orientation = res;
                    index = Number(point);
                }
            }
            return index;
        }

        mostCCWPoint(p: Point2D,q: Point2D,points: Point2D[]) {
            var orientation = 0;
            var index = -1;
            for(let point in points) {
                const res = this.findOrientationDegree(p,q,points[point]);
                if(res < orientation) {
                    orientation = res;
                    index = Number(point);
                }
            }
            return index;
        }

        getSmallestTriArea(p: Point2D,p_index: number,q: Point2D,q_index: number,points: Point2D[]) {
            var area = Infinity;
            var index = -1;
            for(let point_ in points) {
                const point = Number(point_)
                if(point === p_index || point === q_index) continue;
                const r = points[point];
                const pq = Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
                const pr = Math.sqrt((p.x - r.x) ** 2 + (p.y - r.y) ** 2);
                const qr = Math.sqrt((q.x - r.x) ** 2 + (q.y - r.y) ** 2);

                const tri_area = this.getTriArea(pq,pr,qr);

                if(tri_area < area) {
                    area = tri_area;
                    index = point;
                }
            }

            return index;
        }

        get_gradient(p: Point2D,q: Point2D) {
            return ((q.y - p.y) / (q.x - p.x));
        }

        get_distance(p: Point2D,q: Point2D) {
            return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
        }

        get_midpoint(p: Point2D,q: Point2D) {
            return new Point2D((p.x + q.x) * 0.5,(p.y + q.y) * 0.5);
        }

        getLineFromPointGradient(p: Point2D,gradient: number,x_scale: number,invert = false) {
            const intercept = p.y - gradient * p.x;
            const new_x = invert ? p.x - x_scale : p.x + x_scale;
            const new_y = gradient * new_x + intercept;
            return new Point2D(new_x,new_y,0);
        }

        specialGetLineFromPointGradient(p1: Point2D,q1: Point2D,p2: Point2D,gradient: number,x_scale: number) {
            const intercept = p2.y - gradient * p2.x;
            const new_a_x = p2.x + x_scale;
            const new_a_y = gradient * new_a_x + intercept;
            const new_b_x = p2.x - x_scale;
            const new_b_y = gradient * new_b_x + intercept;
            const q2_a = new Point2D(new_a_x,new_a_y);
            const q2_b = new Point2D(new_b_x,new_b_y);
            const q2 = this.doIntersect(p1,q1,p2,q2_a) ? q2_a : q2_b;
            return q2;
        }
    }

    const _Linear = new Linear();

    class Quarternion {
        private normalize: boolean;
        private theta: number;
        private q_vector: _3D_VEC_;
        private q_quarternion: _4D_VEC_;
        private q_inv_quarternion: _4D_VEC_;

        constructor () {
            this.q_vector = DEFAULT_PARAMS._Q_VEC
            this.q_quarternion = DEFAULT_PARAMS._Q_QUART;
            this.q_inv_quarternion = DEFAULT_PARAMS._Q_INV_QUART;
            this.theta = DEFAULT_PARAMS._THETA;
        }

        vector(input_vec: _3D_VEC_,normalized = true) { // recommended if vector is not a unit vector i.e non-normalized
            // normalize flag to normalize vector (create a unit vector)
            if(normalized === true) this.q_vector = input_vec;
            else {
                const [v1,v2,v3] = input_vec
                const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3,-0.5);
                this.q_vector = [v1 * inv_mag,v2 * inv_mag,v3 * inv_mag];
            }
        }

        q_mag(quart: _4D_VEC_) {
            const [w,x,y,z] = quart;
            return Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,0.5);
        }

        quarternion(normalized = true) {
            // quarternion

            const [v1,v2,v3] = this.q_vector;
            const [a,b] = [Math.cos(this.theta * 0.5),Math.sin(this.theta * 0.5)];
            this.q_quarternion = [a,v1 * b,v2 * b,v3 * b];

            if(normalized === false) // normalize the quartenion
            {
                const [w,x,y,z] = this.q_quarternion;
                const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,-0.5);
                this.q_quarternion = [w * inv_mag,x * inv_mag,y * inv_mag,z * inv_mag];
            }
        };

        inv_quartenion(normalized = true) {
            // inverse quarternion           
            const [v1,v2,v3] = this.q_vector;
            const [a,b] = [Math.cos(this.theta * 0.5),Math.sin(this.theta * 0.5)];
            this.q_inv_quarternion = [a,-v1 * b,-v2 * b,-v3 * b];

            if(normalized === false) // normalize the quartenion
            {
                const [w,x,y,z] = this.q_inv_quarternion;
                const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,-0.5);
                this.q_inv_quarternion = [w * inv_mag,x * inv_mag,y * inv_mag,z * inv_mag];
            }
        };

        q_mult(quart_A: _4D_VEC_,quart_B: _4D_VEC_): _4D_VEC_ {
            // quarternion _ quarternion multiplication
            const [w1,x1,y1,z1] = quart_A
            const [w2,x2,y2,z2] = quart_B

            return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2),(w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2),(w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2),(w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
        }

        q_v_invq_mult(input_vec: _3D_VEC_): _3D_VEC_ {
            // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
            // with additional translating (for points) and scaling (for point and vectors) capabilities
            const output_vec: _4D_VEC_ = [0,...input_vec]

            return this.q_mult(this.q_quarternion,this.q_mult(output_vec,this.q_inv_quarternion)).splice(1) as _3D_VEC_;
        }

        q_v_q_mult(input_vec: _3D_VEC_): _3D_VEC_ {
            // quarternion _ vector _ inverse quarternion multiplication for point and vector reflection
            // with additional translating (for points) and scaling (for point and vectors) capabilities
            const output_vec: _4D_VEC_ = [0,...input_vec]

            return this.q_mult(this.q_quarternion,this.q_mult(output_vec,this.q_quarternion)).splice(1) as _3D_VEC_;
        }

        q_rot(_angle: number = 0,_vector: _3D_VEC_ = [0,0,1],_point: _3D_VEC_ = [0,0,0]): _3D_VEC_ {
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
            this.vector(_vector);
            this.quarternion();
            this.inv_quartenion()
            return this.q_v_invq_mult(_point);
        }

        q_ref(_angle: number = 0,_vector: _3D_VEC_ = [0,0,1],_point: _3D_VEC_ = [0,0,0]): _3D_VEC_ {
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
            this.vector(_vector);
            this.quarternion();
            return this.q_v_q_mult(_point);
        }
    }

    const _Quartenion = new Quarternion();

    class Matrix {
        constructor () {}

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

        matMult(matA: number[],matB: number[],shapeA: _2D_VEC_,shapeB: _2D_VEC_): number[] | _ERROR_ {

            if(shapeA[1] !== shapeB[0]) return _ERROR_._MATRIX_ERROR_;
            else {
                const matC: number[] = []

                for(let i = 0; i < shapeA[0]; i++) {
                    for(let j = 0; j < shapeB[1]; j++) {
                        var sum: number = 0;
                        for(let k = 0; k < shapeB[0]; k++) {
                            sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                        }
                        matC.push(sum);
                    }
                }
                return matC;
            }
        }

        scaMult(scalarVal: number,matIn: number[],leaveLast: boolean = false): number[] {
            const matInlen: number = matIn.length;
            const matOut: number[] = [];
            for(let i = 0; i < matInlen; i++) {
                if(i === matInlen - 1 && leaveLast === true) {
                    // Do nothing...don't multiply the last matrix value by the scalar value
                    // useful when perspective division is going on.
                    matOut.push(matIn[i]);
                } else {
                    matOut.push(matIn[i] * scalarVal);
                }
            }
            return matOut;
        }

        matAdd(matA: number[],matB: number[],neg: boolean = false): number[] {
            const matC: number[] = [];
            const matAlen: number = matA.length;
            const matBlen: number = matB.length;
            var sgn: number = 1;

            if(neg === true) {
                sgn = -1;
            }

            if(matAlen === matBlen) {
                for(let i = 0; i < matAlen; i++) {
                    matC.push(matA[i] + sgn * matB[i]);
                }
            }

            return matC;
        }

        getTranspMat(matIn: number[],shapeMat: _2D_VEC_): number[] {
            const shpA = shapeMat[0];
            const shpB = shapeMat[1];
            const matOut: number[] = [];

            for(let i = 0; i < shpB; i++) {
                for(let j = 0; j < shpA; j++) {
                    matOut.push(matIn[(j * shpB) + i]);
                }
            }

            return matOut;
        }

        getIdentMat(val: number): number[] {
            const num: number = val ** 2;
            const matOut: number[] = [];

            for(let i = 0; i < num; i++) {
                if(i % val === 0) {
                    matOut.push(1);
                } else matOut.push(0);
            }

            return matOut;
        }

        getRestMat(matIn: number[],shapeNum: number,row: number,column: number): number[] {
            const matOut: number[] = [];

            for(let i = 0; i < shapeNum; i++) {
                for(let j = 0; j < shapeNum; j++) {
                    if(i !== row && j !== column) {
                        matOut.push(matIn[(i * shapeNum) + j]);
                    }
                }
            }

            return matOut;
        }

        getDet(matIn: number | number[],shapeNum: number): number {
            if(shapeNum > 0) {
                // If it is a 1x1 matrix, return the matrix
                if(shapeNum === 1) {
                    return matIn as number;
                }
                // If it is a 2x2 matrix, return the determinant
                if(shapeNum === 2) {
                    return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
                }
                // If it an nxn matrix, where n > 2, recursively compute the determinant,
                //using the first row of the matrix
                else {
                    var res: number = 0;
                    const tmp: number[] = [];

                    for(let i = 0; i < shapeNum; i++) {
                        tmp.push(matIn[i]);
                    }

                    const cofMatSgn = this.getCofSgnMat([1,shapeNum]);

                    var a = 0;
                    const cofLen: number = cofMatSgn.length;

                    for(let i = 0; i < cofLen; i++) {
                        var ret: number[] = this.getRestMat(matIn as number[],shapeNum,a,i);

                        var verify = this.getDet(ret,shapeNum - 1);

                        verify = verify > _ERROR_._NO_ERROR_ ? verify : 1;

                        res += (cofMatSgn[i] * tmp[i] * verify);
                    }

                    return res;
                }
            }

            else return 0;
        }

        getMinorMat(matIn: number[],shapeNum: number): number[] {
            const matOut: number[] = [];

            for(let i = 0; i < shapeNum; i++) {
                for(let j = 0; j < shapeNum; j++) {
                    const result: number = this.getDet(this.getRestMat(matIn,shapeNum,i,j),shapeNum - 1)
                }
            }

            return matOut;
        }

        getCofSgnMat(shapeMat: _2D_VEC_): number[] {
            const shpA: number = shapeMat[0];
            const shpB: number = shapeMat[1];
            const matOut: number[] = [];

            for(let i = 0; i < shpA; i++) {
                for(let j = 0; j < shpB; j++) {
                    if((i + j) % 2 === 0) {
                        matOut.push(1);
                    } else matOut.push(-1);
                }
            }

            return matOut;
        }

        getCofMat(matIn: number[],shapeNum: number): number[] {
            const cofMatSgn: number[] = this.getCofSgnMat([shapeNum,shapeNum]);
            const minorMat: number[] = this.getMinorMat(matIn,shapeNum);

            const matOut: number[] = [];
            const len: number = shapeNum ** 2;

            for(let i = 0; i < len; i++) {
                matOut.push(cofMatSgn[i] * minorMat[i]);
            }

            return matOut;
        }

        getAdjMat(matIn: number[],shapeNum: number): number[] {
            const result: number[] | _ERROR_ = this.getCofMat(matIn,shapeNum);

            return this.getTranspMat((result as number[]),[shapeNum,shapeNum]);
        }

        getInvMat(matIn: number[],shapeNum: number): number[] | undefined {
            const det_result: number = this.getDet(matIn,shapeNum);

            if(det_result === 0) return undefined;

            const adj_result: number[] = this.getAdjMat(matIn,shapeNum);

            return _Matrix.scaMult(1 / det_result,(adj_result as number[]));
        }
    }

    const _Matrix = new Matrix()

    class Vector {
        constructor () {}

        mag(vec: number[]): number {
            const v_len: number = vec.length;
            var magnitude: number = 0;

            for(let i = 0; i < v_len; i++) {
                magnitude += vec[i] ** 2
            }

            return Math.sqrt(magnitude);
        }

        normalizeVec(vec: number[]): number[] {
            const len: number = Math.round(vec.length);
            const magnitude: number = this.mag(vec);
            const ret_vec: number[] = [];

            for(let i = 0; i < len; i++) {
                ret_vec[i] = vec[i] / magnitude;
            }

            return ret_vec;
        }

        dotProduct(vecA_or_magA: number | number[],vecB_or_magB: number | number[],angle = undefined): number {
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 2d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).

            // Use vectors if you know the components e.g [x,y] values for 2d vectors, [x,y,z] values for 3d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.

            if(typeof angle === "number") { // Magnitude use.
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
                return (vecA_or_magA as number) * (vecB_or_magB as number) * Math.cos(toRad);
            }

            const vec_a_len = (vecA_or_magA as number[]).length;
            const vec_b_len = (vecB_or_magB as number[]).length;

            //verify first that both vectors are of the same size and both are 2d or higher.
            if(vec_a_len === vec_b_len && vec_b_len >= 2) {
                var dot_product = 0;

                for(let i = 0; i < vec_a_len; i++) {
                    dot_product += vecA_or_magA[i] * vecB_or_magB[i];
                }
                return dot_product;
            }

            return 0;
        }

        getDotProductAngle(vecA: number[],vecB: number[]): number { // get the angle between two vectors.
            const dot_product = this.dotProduct(vecA,vecB);
            const cosAng = Math.acos(dot_product as number / (this.mag(vecA) * this.mag(vecB)));

            return MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * cosAng;
        }

        getCrossProductByMatrix(vecs: number[][],vecs_len: number) {
            var cross_product: number[] = [];
            const proper_vec_len: number = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var matrix_array_top_row: number[] = [];

            for(let i = 0; i < proper_vec_len; i++) {
                matrix_array_top_row[i] = 0 // Actually the number 0 is just a placeholder as we don't need any numbers here but we put 0 to make it a number array.
            }

            var same_shape: number = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            var other_rows_array: number[] = [];

            for(let i = 0; i < vecs_len; i++) {
                const vec_len = vecs[i].length;
                if(vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else other_rows_array.push(...vecs[i]); // Else if the vector is the same dimension with n + 1, push the vector to a matrix array.
            }

            if(same_shape === 0) { // All the vectors are the same dimension of n + 1.
                const matrix_array = [...matrix_array_top_row,...other_rows_array];
                const storeCofSgn = _Matrix.getCofSgnMat([proper_vec_len,1]);

                for(let i = 0; i < proper_vec_len; i++) {
                    const rest_matrix_array = _Matrix.getRestMat(matrix_array,proper_vec_len,0,i);
                    cross_product[i] = storeCofSgn[i] * _Matrix.getDet(rest_matrix_array,vecs_len);
                }
            }

            return cross_product;
        }

        crossProduct(vecs_or_mags: number[] | number[][],angle = undefined,unitVec = undefined): number | number[] {
            var cross_product: number | number[] = [];
            const vecs_or_mags_len = (vecs_or_mags as number[]).length;
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 3d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).

            // Use vectors if you know the components e.g [x,y,z] values for 3d vectors, [w,x,y,z] values for 4d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
            if(typeof angle === "undefined") { // Vector use.
                cross_product = [...this.getCrossProductByMatrix((vecs_or_mags as number[][]),vecs_or_mags_len)];
            }

            if(typeof angle === "number") { // Magnitude use.
                var magnitude = 1 // initial magnitude place holder
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;

                for(let i = 0; i < vecs_or_mags_len; i++) {
                    magnitude *= (vecs_or_mags as number[])[i];
                }

                if(typeof unitVec === "undefined") cross_product = magnitude * Math.sin(toRad);
                else if(typeof unitVec === "object") cross_product = _Matrix.scaMult(magnitude * Math.sin(toRad),unitVec);
            }

            return cross_product;
        }

        getCrossProductAngle(vecs: number[] | number[][]): number | undefined { // get the angle between the vectors (makes sense in 3d, but feels kinda weird for higher dimensions but sorta feels like it works...???)
            var cross_product_angle: number | undefined = undefined;
            const vecs_len = vecs.length;
            const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            const cross_product_mag = this.mag(this.crossProduct(vecs) as number[]);
            var vecs_m = 1;

            for(let i = 0; i < vecs_len; i++) {
                const vec_len = (vecs[i] as number[]).length;
                if(vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else vecs_m *= this.mag((vecs as number[][])[i]);
            }

            if(same_shape === 0) {
                const sinAng = Math.asin(cross_product_mag / vecs_m);
                const fromRad = MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * sinAng;
                cross_product_angle = fromRad;
            }

            return cross_product_angle;
        }

        getCrossPUnitVec(vecs: number[]) {
            var cross_product_unit_vec: number[] = [];

            const cross_product = this.crossProduct(vecs);
            const cross_product_mag = this.mag((cross_product as number[]));
            cross_product_unit_vec = _Matrix.scaMult(1 / cross_product_mag,(cross_product as number[]));

            return cross_product_unit_vec;
        }
    }

    const _Vector = new Vector()

    class PerspectiveProjection {

        constructor () {}

        changeNearZ(val: number) {
            MODIFIED_PARAMS._NZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        }

        changeFarZ(val: number) {
            MODIFIED_PARAMS._FZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        }

        changeProjAngle(val: number) {
            MODIFIED_PARAMS._PROJ_ANGLE = val
            this.setPersProjectParam();
        }

        setPersProjectParam() {
            MODIFIED_PARAMS._DIST = 1 / (Math.tan(MODIFIED_PARAMS._PROJ_ANGLE / 2 * MODIFIED_PARAMS._ANGLE_CONSTANT));
            MODIFIED_PARAMS._PROJECTION_MAT = [MODIFIED_PARAMS._DIST / MODIFIED_PARAMS._ASPECT_RATIO,0,0,0,0,MODIFIED_PARAMS._DIST,0,0,0,0,(-MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ),(2 * MODIFIED_PARAMS._FZ * MODIFIED_PARAMS._NZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ),0,0,1,0];

            const inverse_res: number[] | undefined = _Matrix.getInvMat(MODIFIED_PARAMS._PROJECTION_MAT,4);
            if(typeof inverse_res === "undefined") return;
            if(inverse_res.length !== 16) return;
            MODIFIED_PARAMS._INV_PROJECTION_MAT = inverse_res as _16D_VEC_;
        }

        persProject(input_array: _4D_VEC_): _4D_VEC_ {
            return _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT,input_array,[4,4],[4,1]) as _4D_VEC_;
        }

        invPersProject(input_array: _4D_VEC_): _4D_VEC_ {
            return _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT,input_array,[4,4],[4,1]) as _4D_VEC_;
        }
    }

    const _PerspectiveProjection = new PerspectiveProjection()

    class Clip {
        constructor () {}

        canvasTo(arr: _4D_VEC_): _4D_VEC_ {
            const array: _4D_VEC_ = [...arr];
            array[0] -= MODIFIED_PARAMS._HALF_X;
            array[1] -= MODIFIED_PARAMS._HALF_Y;
            return array;
        }

        clipCoords(arr: _4D_VEC_): _4D_VEC_ {
            const array: _4D_VEC_ = [...arr];
            array[0] /= MODIFIED_PARAMS._HALF_X;
            array[1] /= MODIFIED_PARAMS._HALF_Y;
            return array;
        }

        toCanvas(arr: _4D_VEC_): _4D_VEC_ {
            const array: _4D_VEC_ = [...arr];
            array[0] += MODIFIED_PARAMS._HALF_X;
            array[1] += MODIFIED_PARAMS._HALF_Y;
            return array;
        }

        unclipCoords(arr: _4D_VEC_): _4D_VEC_ {
            const array: _4D_VEC_ = [...arr];
            array[0] *= MODIFIED_PARAMS._HALF_X;
            array[1] *= MODIFIED_PARAMS._HALF_Y;
            return array;
        }
    }

    const _Clip = new Clip()

    class LocalSpace {
        constructor () {};

        objectRotate(point: _3D_VEC_,axis: _3D_VEC_,angle: number,state: _OBJ_STATE_) {
            if(state === "local" || state === "object") return _Quartenion.q_rot(angle,axis,point);
        };

        ObjectScale(point: _3D_VEC_,scaling_array: _3D_VEC_,state: _OBJ_STATE_) {
            if(state === "local" || state === "object") return [point[0] * scaling_array[0],point[1] * scaling_array[1],point[2] * scaling_array[2]];
        }
    }

    const _LocalSpace = new LocalSpace();

    class WorldSpace {
        constructor () {}
        ObjectTransform(point: _3D_VEC_,translation_array: _3D_VEC_,state: _OBJ_STATE_) {
            if(state === "world") return _Matrix.matAdd(point,translation_array);
        };

        objectRevolve(point: _3D_VEC_,axis: _3D_VEC_,angle: number,state: _OBJ_STATE_) {
            if(state === "world") return _Quartenion.q_rot(angle,axis,point);
        }
    }

    const _WorldSpace = new WorldSpace();

    interface OPTICALELEMENT {
        instance_number: number;
        optical_type: _OPTICAL_;
        _ACTUAL_POS: _3D_VEC_;
        _USED_POS: _3D_VEC_;
        _LOOK_AT_POINT: _3D_VEC_;
        _U: _3D_VEC_;
        _V: _3D_VEC_;
        _N: _3D_VEC_;
        _C: _3D_VEC_;
        _MATRIX: _16D_VEC_;
        _INV_MATRIX: _16D_VEC_,
        depthBuffer: Float64Array,
        frameBuffer: Uint8Array,
    }

    class OpticalElement {
        // Default

        // _CAM_MATRIX : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        // _INV_CAM_MATRIX : [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1],
        // actpos = [0,0,1],
        // usedpos = [0,0,-1]

        instance: OPTICALELEMENT = {
            instance_number: 0,
            optical_type: "none",
            _ACTUAL_POS: [0,0,0],
            _USED_POS: [0,0,0],
            _LOOK_AT_POINT: [0,0,0],
            _U: [0,0,0],
            _V: [0,0,0],
            _N: [0,0,0],
            _C: [0,0,0],
            _MATRIX: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1] as _16D_VEC_,
            _INV_MATRIX: _Matrix.getInvMat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],4) as _16D_VEC_,
            depthBuffer: _Miscellanous.initDepthBuffer(),
            frameBuffer: _Miscellanous.initFrameBuffer(),
        }

        constructor (optical_type_input: _OPTICAL_) {
            this.instance.optical_type = optical_type_input;
            return this;
        }

        resetBuffers() {
            _Miscellanous.resetDepthBuffer(this.instance.depthBuffer);
            _Miscellanous.resetFrameBuffer(this.instance.frameBuffer);
        }

        setPos(input_array: _3D_VEC_) {
            this.instance._ACTUAL_POS = input_array;
            this.instance._USED_POS = input_array;
            this.instance._USED_POS[2] = -this.instance._USED_POS[2] // reverse point for right to left hand coordinate system
        }

        setCoordSystem() {
            const DIFF: _3D_VEC_ = _Matrix.matAdd(this.instance._LOOK_AT_POINT,this.instance._USED_POS,true) as _3D_VEC_;
            const UP: _3D_VEC_ = [0,1,0];

            this.instance._N = _Vector.normalizeVec(DIFF) as _3D_VEC_;
            this.instance._U = _Vector.normalizeVec(_Vector.crossProduct([UP,this.instance._N]) as number[]) as _3D_VEC_;
            this.instance._V = _Vector.normalizeVec(_Vector.crossProduct([this.instance._N,this.instance._U]) as number[]) as _3D_VEC_;
        }

        setConversionMatrices() {
            this.instance._MATRIX = [...this.instance._U,this.instance._C[0],...this.instance._V,this.instance._C[1],...this.instance._N,this.instance._C[2],...[0,0,0,1]] as _16D_VEC_;
            this.instance._INV_MATRIX = _Matrix.getInvMat(this.instance._MATRIX,4) as _16D_VEC_;
        }

        setLookAtPos(look_at_point: _3D_VEC_) {
            look_at_point[2] = -look_at_point[2];// reverse point for right to left hand coordinate system
            this.instance._LOOK_AT_POINT = look_at_point;

            this.setCoordSystem()
            this.setConversionMatrices()
        }

        rotate(plane: _PLANE_,angle: number): void | _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_ {
            if(plane === "U-V") {
                const _U_N = _Quartenion.q_rot(angle,this.instance._U,this.instance._N);
                const _V_N = _Quartenion.q_rot(angle,this.instance._V,this.instance._N);

                if(typeof _U_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                if(typeof _V_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                this.instance._U = _U_N as _3D_VEC_;
                this.instance._V = _V_N as _3D_VEC_;

            } else if(plane === "U-N") {
                const _U_V = _Quartenion.q_rot(angle,this.instance._U,this.instance._V);
                const _V_N = _Quartenion.q_rot(angle,this.instance._V,this.instance._N);

                if(typeof _U_V === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                if(typeof _V_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                this.instance._U = _U_V as _3D_VEC_;
                this.instance._V = _V_N as _3D_VEC_;

            } else if(plane === "V-N") {
                const _U_V = _Quartenion.q_rot(angle,this.instance._U,this.instance._V);
                const _U_N = _Quartenion.q_rot(angle,this.instance._U,this.instance._N);

                if(typeof _U_V === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                if(typeof _U_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                this.instance._U = _U_V as _3D_VEC_;
                this.instance._V = _U_N as _3D_VEC_;
            }

            this.setConversionMatrices()
        }

        translate(translation_array: _3D_VEC_) {
            this.instance._C = translation_array;
            this.instance._ACTUAL_POS = _Matrix.matAdd(this.instance._ACTUAL_POS,translation_array) as _3D_VEC_;
            this.instance._USED_POS = [...this.instance._ACTUAL_POS];
            this.instance._USED_POS[2] = -this.instance._ACTUAL_POS[2]; // reverse point for right to left hand coordinate system

            this.setCoordSystem()
            this.setConversionMatrices()
        }

        worldToOpticalObject(ar: _3D_VEC_): _4D_VEC_ {
            const arr: _4D_VEC_ = [...ar,1]
            arr[2] = -arr[2] // reverse point for right to left hand coordinate system
            const result: _4D_VEC_ = _Matrix.matMult(this.instance._MATRIX,arr,[4,4],[4,1]) as _4D_VEC_;
            return result;
        }

        opticalObjectToWorld(arr: _4D_VEC_): _3D_VEC_ {
            const result: _4D_VEC_ = _Matrix.matMult(this.instance._INV_MATRIX,arr,[4,4],[4,1]) as _4D_VEC_;
            result[2] = -result[2] // reverse point for left to right hand coordinate system
            const new_result: _3D_VEC_ = result.slice(0,3) as _3D_VEC_;
            return new_result;
        }
    }

    class ClipSpace {
        constructor () {};

        opticalObjectToClip(arr: _4D_VEC_): _4D_VEC_ {
            const orig_proj: _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT,arr,[4,4],[4,1]) as _4D_VEC_;
            const pers_div: _4D_VEC_ = _Matrix.scaMult(1 / orig_proj[3],orig_proj,true) as _4D_VEC_;
            return pers_div;
        };

        clipToOpticalObject(arr: _4D_VEC_): _4D_VEC_ {
            const rev_pers_div: _4D_VEC_ = _Matrix.scaMult(arr[3],arr,true) as _4D_VEC_;
            const rev_orig_proj: _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT,rev_pers_div,[4,4],[4,1]) as _4D_VEC_;
            return rev_orig_proj;
        };
    }

    const _ClipSpace = new ClipSpace();

    class ScreenSpace {
        constructor () {};

        clipToScreen(arr: _4D_VEC_): _4D_VEC_ | _ERROR_ {
            if(arr[2] >= -1.1 && arr[2] <= 1.1 && arr[2] != Infinity) {
                arr[2] = -arr[2];
                // -array[2] (-z) reverse point for left to right hand coordinate system
                const [i,j,k,l] = _Clip.unclipCoords(arr);
                const [x,y,z,w] = _Clip.toCanvas([i,j,k,l]);
                return [x,y,z,w];
            }
            else return _ERROR_._SCREEN_SPACE_ERROR_;
        };

        screenToClip(arr: _4D_VEC_): _4D_VEC_ {
            const [i,j,k,l] = _Clip.canvasTo(arr);
            const [x,y,z,w] = _Clip.clipCoords([i,j,k,l]);
            // -array[2] (-z) reverse point for right to left hand coordinate system
            return [x,y,-z,w];
        };
    }

    const _ScreenSpace = new ScreenSpace();

    class OpticalElement_Objects {
        optical_element_array: OpticalElement[]
        instance_number: number;
        arrlen: number;

        selected_light_instances: object;
        selected_camera_instances: object;

        max_camera_instance_number: number;
        max_light_instance_number: number;

        instance_number_to_list_map: object;

        constructor () {
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

        createNewMultipleCameraObjects = (num: number) => { if(num > 0) while(num > 0) { this.createNewCameraObject(); num--; } }

        createNewMultipleLightObjects = (num: number) => { if(num > 0) while(num > 0) { this.createNewLightObject(); num--; } }

        private deleteOpticalObject(instance_number_input: number,index: number) {
            this.optical_element_array.splice(index,1);
            delete this.instance_number_to_list_map[instance_number_input];

            for(const key in this.instance_number_to_list_map) {
                if(Number(key) > instance_number_input) {
                    this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
                }
            }

            if(instance_number_input in this.selected_camera_instances) delete this.selected_camera_instances[instance_number_input];
            if(instance_number_input in this.selected_light_instances) delete this.selected_light_instances[instance_number_input];

            if(Object.keys(this.selected_camera_instances).length === 0) this.selected_camera_instances[0] = 0;
            if(Object.keys(this.selected_light_instances).length === 0) this.selected_light_instances[1] = 1;
        }

        deleteCameraObject(instance_number_input: number) {
            if(instance_number_input > 1 && instance_number_input <= this.max_camera_instance_number) {
                const index = this.instance_number_to_list_map[instance_number_input];
                if(this.optical_element_array[index].instance.optical_type === "camera")// additional safety checks
                {
                    this.deleteOpticalObject(instance_number_input,index);
                    this.arrlen = this.optical_element_array.length;
                }
            }
        }

        deleteLightObject(instance_number_input: number) {
            if(instance_number_input > 1 && instance_number_input <= this.max_light_instance_number) {
                const index = this.instance_number_to_list_map[instance_number_input];
                if(this.optical_element_array[index].instance.optical_type === "light") // additional safety checks
                {
                    this.deleteOpticalObject(instance_number_input,index);
                    this.arrlen = this.optical_element_array.length;
                }
            }
        }

        // doesn't delete the first one
        deleteAllCameraObjects() {
            for(const key in this.instance_number_to_list_map) {
                const index = this.instance_number_to_list_map[key];
                if(index > 1 && this.optical_element_array[index].instance.optical_type === "camera") {
                    this.deleteOpticalObject(Number(key),index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }

        // doesn't delete the first one
        deleteAllLightObjects() {
            for(const key in this.instance_number_to_list_map) {
                const index = this.instance_number_to_list_map[key];
                if(index > 1 && this.optical_element_array[index].instance.optical_type === "light") {
                    this.deleteOpticalObject(Number(key),index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }

        // doesn't delete the first two
        deleteAllOpticalObjects() {
            for(const key in this.instance_number_to_list_map) {
                const index = this.instance_number_to_list_map[key];
                if(index > 1) {
                    this.deleteOpticalObject(Number(key),index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }

        select_camera_instance(instance_number_input: number) {
            if(instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
                const selection = this.instance_number_to_list_map[instance_number_input];
                if(this.optical_element_array[selection].instance.optical_type === "camera") this.selected_camera_instances[instance_number_input] = selection;
            }
        }

        deselect_camera_instance(instance_number_input: number) {
            if(instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
                if(instance_number_input in this.selected_camera_instances) {
                    const selection = this.instance_number_to_list_map[instance_number_input];
                    if(this.optical_element_array[selection].instance.optical_type === "camera") delete this.selected_camera_instances[instance_number_input];

                    if(Object.keys(this.selected_camera_instances).length === 0) {
                        this.selected_camera_instances[0] = 0;
                        if(instance_number_input === 0) return;
                    }
                }
            }
        }

        select_light_instance(instance_number_input: number) {
            if(instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
                const selection = this.instance_number_to_list_map[instance_number_input]
                if(this.optical_element_array[selection].instance.optical_type === "light") this.selected_light_instances[instance_number_input] = selection;
            }
        }

        deselect_light_instance(instance_number_input: number) {
            if(instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
                if(instance_number_input in this.selected_light_instances) {
                    const selection = this.instance_number_to_list_map[instance_number_input];
                    if(this.optical_element_array[selection].instance.optical_type === "light") delete this.selected_light_instances[instance_number_input];

                    if(Object.keys(this.selected_light_instances).length === 0) {
                        this.selected_light_instances[1] = 1;
                        if(instance_number_input === 1) return;
                    }
                }
            }
        }

        render(vertex: _3D_VEC_,optical_type: _OPTICAL_): _4D_VEC_ | _ERROR_ {
            var world_to_optical_object_space: _4D_VEC_ = [0,0,0,0];

            switch(optical_type) {
                case "none": return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                case "camera": world_to_optical_object_space = this.optical_element_array[this.selected_camera_instances[0]].worldToOpticalObject(vertex); break;
                case "light": world_to_optical_object_space = this.optical_element_array[this.selected_light_instances[0]].worldToOpticalObject(vertex); break;
            }

            const optical_object_to_clip_space: _4D_VEC_ = _ClipSpace.opticalObjectToClip(world_to_optical_object_space);
            return _ScreenSpace.clipToScreen(optical_object_to_clip_space);
        }
    }

    const _Optical_Objects = new OpticalElement_Objects()

    class MeshDataStructure {
        HalfEdgeDict: { [halfedge: string]: _HALFEDGE_ };
        face_tmp: number[];
        faces: Set<string>;
        sorted_faces: string[];
        prev: string | null;
        next: string | null;
        temp: string | null;
        face_vertices_tmp: number[];
        face_indexes_tmp: number[];
        edge_no: number;
        vertex_no: number;
        vertex_indexes: Set<number>;
        multiplier = 10;
        deleted_halfedges_dict: { [halfedge: string]: _HALFEDGE_ };
        face_indexes_set: Set<number>;
        max_face_index: number;
        face_index_map: Map<number,string>;
        max_vertex_index: number;

        constructor () {
            this.reset();
        }

        reset() {
            this.HalfEdgeDict = {};
            this.face_tmp = [];
            this.faces = new Set();
            this.sorted_faces = [];
            this.prev = null;
            this.next = null;
            this.temp = null;
            this.face_vertices_tmp = [];
            this.face_indexes_tmp = [];
            this.edge_no = 0;
            this.vertex_no = 0;
            this.vertex_indexes = new Set();
            this.deleted_halfedges_dict = {};
            this.face_indexes_set = new Set();
            this.max_face_index = 0;
            this.face_index_map = new Map();
            this.max_vertex_index = 0;
        }

        maxFaceIndex() {
            const test = Math.max(...[...this.face_indexes_set])
            if(test !== Infinity && test !== -Infinity && test > this.max_face_index) this.max_face_index = test;
        }

        maxVertexIndex() {
            const test = Math.max(...[...this.vertex_indexes])
            if(test !== Infinity && test !== -Infinity && test > this.max_vertex_index) this.max_vertex_index = test;
        }

        halfEdge(start: number,end: number,face_index: number): _HALFEDGE_ {
            this.vertex_indexes.add(start);
            this.vertex_indexes.add(end);
            this.maxVertexIndex();
            this.vertex_no = [...this.vertex_indexes].length;
            const comp = Math.max(start,end);
            if(this.multiplier % comp === this.multiplier) this.multiplier *= 10;
            this.face_indexes_set.add(face_index);
            this.maxFaceIndex();
            return {
                vertices: [start,end],
                face_vertices: [],
                twin: "-",
                prev: "-",
                next: "-",
                face_index: face_index,
            };
        }

        setHalfEdge(a: number,b: number,face_index = -1,set_halfEdge = true) {
            let halfEdgeKey = `${a}-${b}`;
            let twinHalfEdgeKey = `${b}-${a}`;

            // If halfedge does exist in halfedge dict switch halfedge key to twin halfedge key and vice-versa
            if(this.HalfEdgeDict[halfEdgeKey]) {
                const halfEdgeKeyTemp = twinHalfEdgeKey;
                twinHalfEdgeKey = halfEdgeKey;
                halfEdgeKey = halfEdgeKeyTemp;
            }

            // If halfedge does not exist in halfedge dict, create halfedge and increment the edge number
            if(!this.HalfEdgeDict[halfEdgeKey] && set_halfEdge === true) {
                this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(a,b,face_index);
                this.edge_no++;
                this.HalfEdgeDict[halfEdgeKey].face_vertices = this.face_vertices_tmp;
                this.face_index_map.set(face_index,this.face_vertices_tmp.join("-"));
            }
            else twinHalfEdgeKey;

            // if twin halfedge exists in halfedge dict, decrement the edge number
            if(this.HalfEdgeDict[twinHalfEdgeKey]) {
                this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
                this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
                this.edge_no--;
            }

            return halfEdgeKey;
        }

        addHalfEdge(edge: string | _2D_VEC_,face_vertices = this.face_indexes_tmp,face_index = -1,prev = "-",next = "-") {
            if(typeof edge === "string") edge = edge.split("-").map(value => Number(value)) as _2D_VEC_;
            const halfEdgeKey = this.setHalfEdge(...edge);
            this.HalfEdgeDict[halfEdgeKey].face_vertices = face_vertices;
            this.HalfEdgeDict[halfEdgeKey].prev = prev;
            this.HalfEdgeDict[halfEdgeKey].next = next;
            this.HalfEdgeDict[halfEdgeKey].face_index = face_index
            return halfEdgeKey;
        }

        removeHalfEdge(edge: string) {
            if(!this.HalfEdgeDict[edge]) return false; // halfedge was not deleted because it does not exist

            const [a,b] = edge.split("-");
            const twinHalfEdgeKey = b + "-" + a;

            const edge_num_list = this.edgeToNumber();
            this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];

            // twin half edge exists
            if(this.HalfEdgeDict[twinHalfEdgeKey]) {
                this.HalfEdgeDict[twinHalfEdgeKey].twin = "-";

                let prev_halfEdgeKey = this.HalfEdgeDict[edge].prev;
                let next_halfEdgeKey = this.HalfEdgeDict[edge].next;

                if(prev_halfEdgeKey !== "-" && prev_halfEdgeKey !== twinHalfEdgeKey) this.HalfEdgeDict[prev_halfEdgeKey].next = "-";
                if(next_halfEdgeKey !== "-" && next_halfEdgeKey !== twinHalfEdgeKey) this.HalfEdgeDict[next_halfEdgeKey].prev = "-";
            }

            // twin half edge does not exist
            if(!this.HalfEdgeDict[twinHalfEdgeKey]) {
                var alpha_prev = "-";
                var alpha_next = "-";
                var beta_prev = "-";
                var beta_next = "-";

                var alpha_prev_exists = false;
                var alpha_next_exists = false;
                var beta_prev_exists = false;
                var beta_next_exists = false;

                alpha_prev = this.deleted_halfedges_dict[edge].prev;
                alpha_next = this.deleted_halfedges_dict[edge].next;
                alpha_prev_exists = !!this.HalfEdgeDict[alpha_prev];
                alpha_next_exists = !!this.HalfEdgeDict[alpha_next];

                if(this.deleted_halfedges_dict[twinHalfEdgeKey]) {
                    beta_prev = this.deleted_halfedges_dict[twinHalfEdgeKey].prev;
                    beta_next = this.deleted_halfedges_dict[twinHalfEdgeKey].next;

                    beta_prev_exists = !!this.HalfEdgeDict[beta_prev];
                    beta_next_exists = !!this.HalfEdgeDict[beta_next];
                }

                if(alpha_prev_exists && beta_next_exists) {
                    this.HalfEdgeDict[alpha_prev].next = beta_next;
                    this.HalfEdgeDict[beta_next].prev = alpha_prev;
                }
                else if(alpha_prev_exists) this.HalfEdgeDict[alpha_prev].next = "-";
                else if(beta_next_exists) this.HalfEdgeDict[beta_next].prev = "-";

                if(beta_prev_exists && alpha_next_exists) {
                    this.HalfEdgeDict[beta_prev].next = alpha_next;
                    this.HalfEdgeDict[alpha_next].prev = beta_prev;
                }

                else if(beta_prev_exists) this.HalfEdgeDict[beta_prev].next = "-";
                else if(alpha_next_exists) this.HalfEdgeDict[alpha_next].prev = "-";

                const faces_of_edge = this.getFacesOfDeletedEdge(edge);
                const alpha_edges = this.getEdgesOfFace(faces_of_edge[0]);
                const beta_edges = this.getEdgesOfFace(faces_of_edge[1]);

                if(alpha_edges.length >= 2 && beta_edges.length >= 2) {
                    this.faces.delete(faces_of_edge[0].join("-"));
                    this.faces.delete(faces_of_edge[1].join("-"));

                    const new_face_vertices = this.mergeDeletedFaces(faces_of_edge,edge);
                    const new_face_index = this.max_face_index + 1;

                    const first_face_index = this.deleted_halfedges_dict[edge].face_index;
                    const second_face_index = this.deleted_halfedges_dict[twinHalfEdgeKey].face_index;

                    this.face_indexes_set.add(new_face_index);
                    this.maxFaceIndex();
                    this.face_index_map.set(new_face_index,new_face_vertices.join("-"));
                    this.face_indexes_set.delete(first_face_index);
                    this.face_indexes_set.delete(second_face_index);

                    for(const edge of alpha_edges) {
                        if(this.HalfEdgeDict[edge]) {
                            this.HalfEdgeDict[edge].face_vertices = new_face_vertices;
                            this.HalfEdgeDict[edge].face_index = new_face_index;
                        }
                    }

                    for(const edge of beta_edges) {
                        if(this.HalfEdgeDict[edge]) {
                            this.HalfEdgeDict[edge].face_vertices = new_face_vertices;
                            this.HalfEdgeDict[edge].face_index = new_face_index;
                        }
                    }

                    this.faces.add(new_face_vertices.join('-'))
                }

                if(alpha_edges.length < 2) {
                    for(const edge of alpha_edges) if(this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                        this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                    }
                    this.faces.delete(faces_of_edge[0].join("-"));
                }

                if(beta_edges.length < 2) {
                    for(const edge of beta_edges) if(this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                        this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                    }
                    this.faces.delete(faces_of_edge[1].join("-"));
                }

                const biFacial_handling_result = this.biFacialHandling();
                if(biFacial_handling_result.length > 0) this.removeFace(biFacial_handling_result.join("-"));

                // if vertex a belongs to at most one edge remove it from the vertex indexes set
                if(this.getEdgesOfVertexFast(Number(a),edge_num_list).length <= 1) {
                    this.vertex_indexes.delete(Number(a));
                }

                // if vertex b belongs to at most one edge remove it from the vertex indexes set
                if(this.getEdgesOfVertexFast(Number(b),edge_num_list).length <= 1) {
                    this.vertex_indexes.delete(Number(b));
                }

                this.vertex_no = [...this.vertex_indexes].length; // update vertex number
                this.edge_no-- // decrease edge number as the twin does not exist
            }

            delete this.HalfEdgeDict[edge]; // delete the halfedge

            return true; // halfedge was successfully deleted
        }

        mergeDeletedFaces(faces: number[][],edge: string) {
            const alpha_face = this.prepareDeletedFaces(faces[0],edge);
            const beta_face = this.prepareDeletedFaces(faces[1],edge);
            const [a,b] = edge.split("-").map(value => Number(value));

            if(alpha_face.join("-") === beta_face.join("-")) {
                const a_index = alpha_face.indexOf(a);
                const b_index = beta_face.indexOf(b);
                const min_index = Math.min(a_index,b_index);
                alpha_face.splice(min_index,2);
                this.modifyMergedFace(alpha_face);
            }

            const alpha_dict = {};
            const beta_dict = {};

            for(const index in alpha_face) alpha_dict[alpha_face[index]] = index;
            for(const index in beta_face) beta_dict[beta_face[index]] = index;

            var face_bool = true;
            var index = 0;
            var monitor = 0;
            const stop = faces[0].length + faces[1].length - 2;
            var collide = 0;
            var monitor_bool = true;
            const merged_face: number[] = [];

            while(true) {
                const cur_index = face_bool ? index % alpha_face.length : index % beta_face.length;
                const cur_value = face_bool ? alpha_face[cur_index] : beta_face[cur_index];

                if(cur_value === a || cur_value === b) {
                    if(collide < 2) {
                        merged_face[merged_face.length] = cur_value;
                        face_bool = !face_bool;
                        const dict = face_bool ? alpha_dict : beta_dict;
                        index = dict[cur_value];
                        collide++;
                    }

                    else monitor_bool = false;
                }

                else merged_face[merged_face.length] = cur_value;

                if(monitor_bool === true) monitor++;
                monitor_bool = true;
                index++;

                if(monitor === stop) break;
            }

            return this.modifyMergedFace(merged_face);
        }

        prepareDeletedFaces(face: number[],edge: string) {
            var prepped = false;
            var remainder: number[] = [];
            const [a,b] = edge.split("-").map(value => Number(value));
            var edge_num_list: number[] = [];

            for(const index in face) {
                const cur_val = face[index];
                const next_val = face[(Number(index) + 1) % face.length];
                const last_val = Number(index) === (face.length - 1) ? true : false;

                if((cur_val === a || cur_val === b) && (next_val === a || next_val === b)) {
                    if(!last_val) {
                        remainder = face;
                        prepped = true;
                        break;
                    }

                    if(last_val) {
                        edge_num_list = [cur_val,next_val];
                    }
                }

                if(!(cur_val === a || cur_val === b)) remainder.push(cur_val);
            }

            if(!prepped) remainder = [...edge_num_list,...remainder];

            return remainder;
        }

        modifyMergedFace(face: number[]) {
            var min = Infinity;
            var min_index = 0;

            for(const index in face) {
                const vertex = face[index];
                if(min > vertex) {
                    min = vertex;
                    min_index = Number(index);
                }
            }

            var rem = face.splice(min_index);
            return [...rem,...face];
        }

        biFacialHandling() {
            if(this.faces.size === 2) { // Check if there are only two faces left in the mesh
                const faces = [...this.faces];
                const face_one = [...faces[0].split("-").map(value => Number(value))];
                const face_two = [...faces[1].split("-").map(value => Number(value))];

                if(face_one.length !== face_two.length) return []; // if both faces don't have the same number of vertices then abort and return false
                if(face_one.length <= 3) return face_two; // automatically consider them as complements in this case
                // else then try to compute if the two faces are complements
                if(this.modifyMergedFace(face_one).join("-") === this.modifyMergedFace(face_two).join("-")) return face_two; // if the two faces are complements return true;

                return []; // default return value;
            }

            return []; // default return value;
        }

        addVertex(vertex: string | number,vertex_or_face_or_edge: string | number[]) {
            if(typeof vertex_or_face_or_edge === "string") vertex_or_face_or_edge = vertex_or_face_or_edge.split("-").map(value => Number(value));
            vertex = Number(vertex);

            if(vertex_or_face_or_edge.length === 1) {
                this.vertex_indexes.add(vertex);
                this.maxVertexIndex();
                this.vertex_no = [...this.vertex_indexes].length;
                const comp = Math.max(this.max_vertex_index,vertex);
                if(this.multiplier % comp === this.multiplier) this.multiplier *= 10;
            }

            else if(vertex_or_face_or_edge.length >= 2) {
                var face_index = -1;
                if(vertex_or_face_or_edge.length > 2) {
                    if(this.faces.has(vertex_or_face_or_edge.join("-"))) {
                        face_index = this.getFaceIndexOfFace(vertex_or_face_or_edge.join("-"));
                    }
                }

                for(const val of vertex_or_face_or_edge) {
                    this.addHalfEdge(`${vertex}-${val}`,vertex_or_face_or_edge,face_index);
                }
            }
        }

        removeVertex(vertex: string | number) {
            let count = 0;
            for(const edge in this.HalfEdgeDict) {
                if(edge.split("-").includes(`${vertex}`)) {
                    this.removeEdge(edge);
                }
            }
            return count;
        }

        getEdgesOfVertexFast(vertex: number,edge_num_list: number[]) {
            const edge_list: string[] = [];
            edge_num_list.map(value => {
                const min = value % this.multiplier;
                const max = (value - min) / this.multiplier;
                if(vertex === min || vertex === max) edge_list.push(`${min}-${max}`);
            });
            return edge_list;
        }

        getEdgesOfVertex(vertex: string | number,no_half_edge = false) {
            const edge_list: string[] = [];
            const edge_set: Set<string> = new Set();

            if(no_half_edge === false) {
                for(const edge in this.HalfEdgeDict) {
                    // edge touches vertex and is not in the edge_list
                    if(edge.split("-").includes(`${vertex}`)) edge_list.push(edge);
                }
            }

            if(no_half_edge === true) {
                for(const edge in this.HalfEdgeDict) {
                    // edge touches vertex and is not in the edge_list also ensure no edge complements (halfedges that are twin halfedges of previously existing halfedges)
                    if(edge.split("-").includes(`${vertex}`)) {
                        const [a,b] = edge.split("-").map(value => Number(value));
                        edge_set.add(`${Math.min(a,b)}-${Math.max(a,b)}`);
                    }
                }
                edge_list.push(...[...edge_set]);
            }

            return edge_list;
        }

        getFacesOfVertexSpecific(edge_list: string[]) {
            const face_set: Set<string> = new Set();
            const faces: number[][] = [];

            for(const edge of edge_list) {
                const face = this.HalfEdgeDict[edge].face_vertices;
                if(!face_set.delete(face.join("-"))) {
                    face_set.add(face.join("-"));
                    faces.push(face);
                }
            }

            return faces;
        }

        getFaceIndexesOfVertexSpecific(edge_list: string[]) {
            const face_indexes: Set<number> = new Set();

            for(const edge of edge_list) {
                const face_index = this.HalfEdgeDict[edge].face_index;
                face_indexes.add(face_index);
            }

            return [...face_indexes];
        }

        getFacesOfVertexGeneric(vertex: string | number,no_half_edge = false) {
            const edge_list = this.getEdgesOfVertex(vertex,no_half_edge);
            this.getFacesOfVertexSpecific(edge_list);
        }

        addEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "string") edge = edge.split("-").map(value => Number(value)) as _2D_VEC_;
            this.setHalfEdge(...edge);
            this.setHalfEdge(edge[1],edge[0]);
            return edge;
        }

        removeEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            const remove_thf = this.removeHalfEdge(edge.split("-").reverse().join("-"));
            const remove_hf = this.removeHalfEdge(edge);

            return remove_hf || remove_thf;
        }


        splitEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            const [a,b] = edge.split("-").map(value => Number(value));

            const faces_of_edge = this.getFacesOfEdge(edge);
            const new_vertex = this.max_vertex_index + 1;

            if(faces_of_edge[0].length > 0) {
                const new_face = faces_of_edge[0].join("-").replace(edge,`${a}-${new_vertex}-${b}`);
                this.vertex_indexes.add(new_vertex);

                if(faces_of_edge[0].length > 2) {
                    this.removeFace(faces_of_edge[0].join("-"));
                    this.addFace(new_face);
                }

                else {
                    var prev = "-";
                    var next = "-";
                    if(this.HalfEdgeDict[edge]) {
                        prev = this.HalfEdgeDict[edge].prev;
                        next = this.HalfEdgeDict[edge].next;
                        this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
                        delete this.HalfEdgeDict[edge];
                        const face_index = this.HalfEdgeDict[edge].face_index;


                        this.addHalfEdge(`${a}-${new_vertex}`,new_face.split("-").map(value => Number(value)),face_index,prev,`${new_vertex}-${b}`);
                        this.addHalfEdge(`${new_vertex}-${b}`,new_face.split("-").map(value => Number(value)),face_index,`${a}-${new_vertex}`,next);
                    }
                }
            }

            if(faces_of_edge[1].length > 0) {
                const new_face = faces_of_edge[1].join("-").replace(b + "-" + a,`${b}-${new_vertex}-${a}`);
                this.vertex_indexes.add(new_vertex);

                if(faces_of_edge[1].length > 2) {
                    this.removeFace(faces_of_edge[1].join("-"));
                    this.addFace(new_face);
                }

                else {
                    var prev = "-";
                    var next = "-";
                    if(this.HalfEdgeDict[b + "-" + a]) {
                        prev = this.HalfEdgeDict[b + "-" + a].prev;
                        next = this.HalfEdgeDict[b + "-" + a].next;
                        this.deleted_halfedges_dict[b + "-" + a] = this.HalfEdgeDict[b + "-" + a];
                        delete this.HalfEdgeDict[b + "-" + a];
                        const face_index = this.HalfEdgeDict[b + "-" + a].face_index;

                        this.addHalfEdge(`${b}-${new_vertex}`,new_face.split("-").map(value => Number(value)),face_index,prev,`${new_vertex}-${a}`);
                        this.addHalfEdge(`${new_vertex}-${a}`,new_face.split("-").map(value => Number(value)),face_index,`${b}-${new_vertex}`,next);
                    }
                }
            }

            this.maxVertexIndex();
        }

        mergeEdges(edge_1: string | _2D_VEC_,edge_2: string | _2D_VEC_) {
            if(typeof edge_1 === "object") edge_1 = edge_1.join("-");
            const [a_1,b_1] = edge_1.split("-").map(value => Number(value));

            if(typeof edge_2 === "object") edge_2 = edge_2.join("-");
            const [a_2,b_2] = edge_2.split("-").map(value => Number(value));


            const common_vertex_face_num = this.getCommonVertAndFacesofEdges(a_1,b_1,a_2,b_2);
            const common_vertex = common_vertex_face_num.common_vertex;
            const common_faces = common_vertex_face_num.faces;

            if(common_vertex < 0) return false;

            const edge_list = this.getEdgesOfVertex(common_vertex,true);
            const rev_edge_1 = `${b_1}-${a_1}`;
            const rev_edge_2 = `${b_2}-${a_2}`;
            let initial_max_face_index = this.max_face_index;

            for(const edge of edge_list) {
                if(!(edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2)) {
                    const edge_faces = this.getFacesOfEdge(edge);
                    const rem_edge = this.removeEdge(edge);
                    if(rem_edge) {
                        const has_face_0 = this.faces.has(edge_faces[0].join("-"));
                        const has_face_1 = this.faces.has(edge_faces[1].join("-"));

                        if(!has_face_0) {
                            const index = common_faces.indexOf(edge_faces[0].join("-"));
                            if(index >= 0) common_faces.splice(index,1);
                        }

                        if(!has_face_1) {
                            const index = common_faces.indexOf(edge_faces[1].join("-"));
                            if(index >= 0) common_faces.splice(index,1);
                        }

                        if(this.max_face_index > initial_max_face_index) {
                            const face_to_push = this.face_index_map.get(this.max_face_index);
                            if(typeof face_to_push !== "undefined") common_faces.push(face_to_push);
                            initial_max_face_index = this.max_face_index;
                            this.face_indexes_set.add(initial_max_face_index);
                        }
                    }
                }
            }

            for(const face of common_faces) {
                const working_face = [...face.split("-").map(value => Number(value))];
                const index = working_face.indexOf(common_vertex);
                if(index >= 0) {
                    working_face.splice(index,1);
                }

                if(working_face.length <= 2) this.removeFace(face);

                else {
                    const required_edges = this.getEdgesOrientation(face,edge_1,edge_2);

                    if(required_edges.prev === "-" || required_edges.next === "-") continue;

                    const a = required_edges.prev.split("-")[0];
                    const b = required_edges.next.split("-")[1];
                    const prev = this.HalfEdgeDict[required_edges.prev].prev;
                    const next = this.HalfEdgeDict[required_edges.next].next;
                    const old_face_index = required_edges.face_index;
                    this.face_indexes_set.delete(old_face_index);
                    const new_face_index = this.getFaceIndexOfFace(working_face.join("-"));
                    this.face_indexes_set.add(new_face_index);
                    this.face_index_map.set(new_face_index,working_face.join("-"));
                    this.addHalfEdge(a + "-" + b,working_face,new_face_index,prev,next);

                    if(prev !== "-") if(this.HalfEdgeDict[prev]) {
                        this.HalfEdgeDict[prev].next = a + "-" + b;
                    }

                    if(next !== "-") if(this.HalfEdgeDict[next]) {
                        this.HalfEdgeDict[next].prev = a + "-" + b;
                    }

                    for(const edge of required_edges.edges_of_face) {
                        if(this.HalfEdgeDict[edge]) {
                            const face = this.HalfEdgeDict[edge].face_vertices.join("-");
                            this.faces.delete(face);
                            this.HalfEdgeDict[edge].face_vertices = working_face;
                            this.faces.add(working_face.join("-"));
                        }
                    }
                }
            }

            if(this.HalfEdgeDict[edge_1]) {
                this.deleted_halfedges_dict[edge_1] = this.HalfEdgeDict[edge_1];
                delete this.HalfEdgeDict[edge_1];
            }

            if(this.HalfEdgeDict[rev_edge_1]) {
                this.deleted_halfedges_dict[rev_edge_1] = this.HalfEdgeDict[rev_edge_1];
                delete this.HalfEdgeDict[rev_edge_1];
            }

            if(this.HalfEdgeDict[edge_2]) {
                this.deleted_halfedges_dict[edge_2] = this.HalfEdgeDict[edge_2];
                delete this.HalfEdgeDict[edge_2];
            }

            if(this.HalfEdgeDict[rev_edge_2]) {
                this.deleted_halfedges_dict[rev_edge_2] = this.HalfEdgeDict[rev_edge_2];
                delete this.HalfEdgeDict[rev_edge_2];
            }

            this.edge_no = this.edge_no - 2; // update edge number

            this.vertex_indexes.delete(common_vertex);
            this.vertex_no = [...this.vertex_indexes].length; // update vertex number

            const biFacial_handling_result = this.biFacialHandling();
            if(biFacial_handling_result.length > 0) this.removeFace(biFacial_handling_result.join("-"));

            this.face_indexes_set.delete(-1);
        }

        getCommonVertAndFacesofEdges(a_1: number,b_1: number,a_2: number,b_2: number) {
            const test: { common_vertex: number; faces: string[] } = { common_vertex: -1,faces: [] };

            // Check if both halfEdges or their twin halfedges exist
            if(
                ((this.HalfEdgeDict[a_1 + "-" + b_1]) || (this.HalfEdgeDict[b_1 + "-" + a_1])) &&
                ((this.HalfEdgeDict[a_2 + "-" + b_2]) || (this.HalfEdgeDict[b_2 + "-" + a_2]))) {

                const halfEdgeKey_union_list = [a_1,b_1,a_2,b_2];
                const halfEdgeKey_union_set = new Set(halfEdgeKey_union_list);

                if(halfEdgeKey_union_set.size <= 2) return test;

                // get the common vertex of the adjacent edges
                for(const val of halfEdgeKey_union_list) {
                    const check_vertex = halfEdgeKey_union_set.delete(val);
                    if(check_vertex === false) {
                        test.common_vertex = val;
                        break;
                    }
                }

                // get the faces
                const faces_list: string[] = [];
                if(this.HalfEdgeDict[`${a_1}-${b_1}`]) faces_list.push(this.HalfEdgeDict[`${a_1}-${b_1}`].face_vertices.join("-"));
                if(this.HalfEdgeDict[`${b_1}-${a_1}`]) faces_list.push(this.HalfEdgeDict[`${b_1}-${a_1}`].face_vertices.join("-"));
                if(this.HalfEdgeDict[`${a_2}-${b_2}`]) faces_list.push(this.HalfEdgeDict[`${a_2}-${b_2}`].face_vertices.join("-"));
                if(this.HalfEdgeDict[`${b_2}-${a_2}`]) faces_list.push(this.HalfEdgeDict[`${b_2}-${a_2}`].face_vertices.join("-"));
                const face_set: Set<string> = new Set(faces_list);
                test.faces.push(...[...face_set])

                // get the faces' index
                const face_indexes_list: number[] = [];
                if(this.HalfEdgeDict[`${a_1}-${b_1}`]) face_indexes_list.push(this.HalfEdgeDict[`${a_1}-${b_1}`].face_index);
                if(this.HalfEdgeDict[`${b_1}-${a_1}`]) face_indexes_list.push(this.HalfEdgeDict[`${b_1}-${a_1}`].face_index);
                if(this.HalfEdgeDict[`${a_2}-${b_2}`]) face_indexes_list.push(this.HalfEdgeDict[`${a_2}-${b_2}`].face_index);
                if(this.HalfEdgeDict[`${b_2}-${a_2}`]) face_indexes_list.push(this.HalfEdgeDict[`${b_2}-${a_2}`].face_index);

                return test;
            }

            return test;
        }

        getEdgesOrientation(face: string,edge_1: string,edge_2: string) {
            const edges_orientation: { prev: string,next: string,edges_of_face: string[],face_index: number } = { prev: "-",next: "-",edges_of_face: [],face_index: -1 };
            const rev_edge_1 = edge_1.split("-").reverse().join("-");
            const rev_edge_2 = edge_2.split("-").reverse().join("-");
            const face_edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));
            edges_orientation.edges_of_face.push(...face_edges);
            edges_orientation.face_index = face_edges.length >= 1 ? this.HalfEdgeDict[face_edges[0]].face_index : -1;
            var found_edge = "-";

            for(const edge of face_edges) {
                if(edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2) {
                    if(this.HalfEdgeDict[edge]) {
                        found_edge = edge;
                        break;
                    }
                }
            }

            if(found_edge === "-") return edges_orientation;

            else {
                const prev = this.HalfEdgeDict[found_edge].prev;
                const next = this.HalfEdgeDict[found_edge].next;

                if(prev !== "-") if(prev === edge_1 || prev === rev_edge_1 || prev === edge_2 || prev === rev_edge_2) if(this.HalfEdgeDict[prev]) edges_orientation.prev = prev;
                if(next !== "-") if(next === edge_1 || next === rev_edge_1 || next === edge_2 || next === rev_edge_2) if(this.HalfEdgeDict[next]) edges_orientation.next = next;

                if(edges_orientation.prev === "-") edges_orientation.prev = found_edge;
                else if(edges_orientation.next === "-") edges_orientation.next = found_edge;
            }

            return edges_orientation;
        }

        edgeReverse(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            const [a,b] = edge.split("-");
            return `${b}-${a}`;
        }

        getVerticesOfEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "string") return edge.split("-").map(value => Number(value)) as _2D_VEC_;
            else return edge;
        }

        getFacesOfHalfEdge(halfEdge: string) {
            if(this.HalfEdgeDict[halfEdge]) {
                return this.HalfEdgeDict[halfEdge].face_vertices;
            }
            else return [];
        }

        getFacesOfEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            return [this.getFacesOfHalfEdge(edge),this.getFacesOfHalfEdge(edge.split("-").reverse().join("-"))];
        }

        getFacesOfDeletedHalfEdge(halfEdge: string) {
            if(this.deleted_halfedges_dict[halfEdge]) {
                return this.deleted_halfedges_dict[halfEdge].face_vertices;
            }
            else return [];
        }

        getFacesOfDeletedEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            return [this.getFacesOfDeletedHalfEdge(edge),this.getFacesOfDeletedHalfEdge(edge.split("-").reverse().join("-"))];
        }

        edgeToNumber() {
            const edge_num_set: Set<number> = new Set();

            for(const edge in this.HalfEdgeDict) {
                const [a,b] = edge.split("-").map(value => Number(value));
                const [min,max] = [Math.min(a,b),Math.max(a,b)];
                edge_num_set.add(max * this.multiplier + min);
            }

            return [...edge_num_set];
        }

        addFace(face: string) {
            this.face_vertices_tmp = face.split("-").map(value => Number(value));
            const sorted_face = [...this.face_vertices_tmp].sort((a,b) => a - b).join("-");
            const face_set: Set<string> = new Set(this.faces);
            const sorted_face_set: Set<string> = new Set(this.sorted_faces);

            // If face is not found in faces add face to faces and set its halfedges
            if(!face_set.delete(face) && this.face_vertices_tmp.length > 2 && !sorted_face_set.delete(sorted_face)) {
                this.faces.add(face);
                this.sorted_faces.push(sorted_face);

                const first_index = this.face_vertices_tmp[0];
                const second_index = this.face_vertices_tmp[1];
                const last_index = this.face_vertices_tmp[this.face_vertices_tmp.length - 1];
                const face_index = this.max_face_index + 1;

                for(let p in this.face_vertices_tmp) {
                    const index = Number(p);
                    const i = this.face_vertices_tmp[p];
                    const j = this.face_vertices_tmp[(index + 1) % this.face_vertices_tmp.length];
                    const halfEdgeKey = this.setHalfEdge(i,j,face_index);
                    const [a,b] = halfEdgeKey.split("-");

                    if(this.temp === null) {
                        this.prev = "-";
                    }
                    else {
                        this.prev = this.temp + "-" + a;
                    }

                    if(this.HalfEdgeDict[this.prev]) {
                        this.HalfEdgeDict[this.prev].next = halfEdgeKey;
                    }

                    this.next = "-";
                    this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
                    this.HalfEdgeDict[halfEdgeKey].next = this.next;

                    this.temp = a;

                    if(index === 0) this.HalfEdgeDict[halfEdgeKey].prev = `${last_index}-${first_index}`;
                    if(index === this.face_vertices_tmp.length - 1) this.HalfEdgeDict[halfEdgeKey].next = `${first_index}-${second_index}`;
                }

                // reset temp, prev and next
                this.temp = null;
                this.prev = null;
                this.next = null;
                this.face_vertices_tmp = [];

                return true; // face added successfully
            }

            return false; // face not added
        }

        removeFace(face: string) {
            // Check if face is found in faces
            if(this.faces.has(face)) {
                const existing_face_edges = this.getEdgesOfFacethatExists(face.split("-").map(value => Number(value)));
                const edge_num_list = this.edgeToNumber();

                // remove the face and its halfedges
                for(const half_edge of existing_face_edges) {
                    const [a,b] = half_edge.split("-");
                    this.deleted_halfedges_dict[half_edge] = this.HalfEdgeDict[half_edge];
                    this.face_indexes_set.delete(this.HalfEdgeDict[half_edge].face_index);
                    delete this.HalfEdgeDict[half_edge];

                    // if vertex a belongs to at most one edge remove it from the vertex indexes set
                    if(this.getEdgesOfVertexFast(Number(a),edge_num_list).length <= 1) {
                        this.vertex_indexes.delete(Number(a));
                    }

                    // if vertex b belongs to at most one edge remove it from the vertex indexes set
                    if(this.getEdgesOfVertexFast(Number(b),edge_num_list).length <= 1) {
                        this.vertex_indexes.delete(Number(b));
                    }

                    this.vertex_no = [...this.vertex_indexes].length; // update vertex number
                    if(!this.HalfEdgeDict[b + "-" + a]) this.edge_no-- // decrease edge number if the twin does not exist
                }
                this.faces.delete(face);

                return true; // face was removed
            }

            return false; // face not removed because it was not found
        }

        getEdgesOfFace(face: number[]) {
            return face.map((value,index) => `${value}-${face[(index + 1) % face.length]}`);
        }

        getEdgesOfFacethatExists(face: number[]) {
            const potential_edges = this.getEdgesOfFace(face);
            const existing_edges: string[] = [];

            for(const half_edge of potential_edges) {
                if(half_edge in this.HalfEdgeDict) existing_edges.push(half_edge);
            }

            return existing_edges;
        }

        getFaceIndexOfFace(face: string) {
            const edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));

            for(const halfedge of edges) {
                if(halfedge in this.HalfEdgeDict) this.HalfEdgeDict[halfedge].face_index;
            }

            return -1;
        }

        splitFace(face: string,vert_1: string | number,vert_2: string | number) {
            vert_1 = Number(vert_1);
            vert_2 = Number(vert_2);

            if(this.faces.has(face)) {
                if(!face.includes(`${vert_1}`) || !face.includes(`${vert_2}`)) return false; // face not split as one or both vertices not found in face
                const face_vertices = face.split("-").map(value => Number(value));
                const edges = this.getEdgesOfFace(face_vertices);
                const bi_edges: string[] = [];
                for(const edge of edges) if(edge.includes(`${vert_1}`)) bi_edges.push(edge);
                for(const bi_edge of bi_edges) if(bi_edge.includes(`${vert_2}`)) return false; // face not split due to both vertices belonging to the same edge

                const vert_1_index = face_vertices.indexOf(vert_1) as number;
                const vert_2_index = face_vertices.indexOf(vert_2) as number;
                const first_vertex = vert_2_index > vert_1_index ? vert_1_index : vert_2_index;
                const second_vertex = vert_2_index > vert_1_index ? vert_2_index : vert_1_index;

                var pre = face_vertices.splice(0,first_vertex + 1);
                var post = face_vertices.splice(second_vertex - pre.length);
                var other_face = [post[0],...face_vertices.reverse(),pre[pre.length - 1]];
                pre.push(...post);

                this.removeFace(face);
                this.addFace(pre.join("-"));
                this.addFace(other_face.join("-"));

                return true; // face was split
            }

            return false; // face not split as it doesn't exist
        }

        mergeFace(face_1: string,face_2: string) {
            if(!this.faces.has(face_1) || !this.faces.has(face_2)) return false; // faces not merged because one or both do not exist

            const face_1_edges = this.getEdgesOfFace(face_1.split("-").map(value => Number(value)));
            const face_2_edges = this.getEdgesOfFace(face_2.split("-").map(value => Number(value)));

            for(const edge of face_1_edges) {
                const twin_edge = edge.split("-").reverse().join("-");
                if(face_2_edges.includes(twin_edge)) {
                    this.removeEdge(edge);
                    return true; // faces were merged
                }
            }

            return false; // faces not merged because they do not have a common edge;
        }

        sumPoints(points: Point3D[]): Point3D {
            var res: Point3D = new Point3D(0,0,0);
            for(const point of points) {
                res.x += point.x;
                res.y += point.y;
                res.z += point.z;
            }
            return res;
        }

        getMinMax(points: Point3D[]) {
            var minX = Infinity;
            var maxX = -Infinity;
            var minY = Infinity;
            var maxY = -Infinity;
            var minZ = Infinity;
            var maxZ = -Infinity;

            for(const point of points) {
                if(minX > point.x) minX = point.x;
                if(maxX < point.x) maxX = point.x;
                if(minY > point.y) minY = point.y;
                if(maxY < point.y) maxY = point.y;
                if(minZ > point.z) minZ = point.z;
                if(maxZ < point.z) maxZ = point.z;
            }

            return [minX,maxX,minY,maxY,minZ,maxZ];
        }

        triangulate(points_list: Point3D[] | undefined = undefined) {
            const triangulated_points_list: Point3D[] = [];
            if(typeof points_list !== "undefined") {
                triangulated_points_list.push(...points_list);
            }

            const start = new Date().getTime();
            const new_mesh = new MeshDataStructure();
            var new_vertex = this.max_vertex_index;

            for(const face of this.faces) {
                const vertex_indexes = face.split("-").map(value => Number(value));
                const face_edges = this.getEdgesOfFace(vertex_indexes);
                new_vertex++;

                if(typeof points_list !== "undefined") {
                    const face_vertices = this.HalfEdgeDict[face_edges[0]].face_vertices;
                    const face_points = face_vertices.map(value => points_list[value]);
                    const [xmin,xmax,ymin,ymax,zmin,zmax] = this.getMinMax(face_points);
                    const average_point = new Point3D((xmin + xmax) * 0.5,(ymin + ymax) * 0.5,(zmin + zmax) * 0.5);
                    triangulated_points_list.push(average_point);
                }

                for(const edge of face_edges) {
                    const [a,b] = edge.split("-");
                    new_mesh.addFace(`${new_vertex}-${a}-${b}`);
                }
            }
            const end = new Date().getTime();
            console.log(`Time taken to triangulate : ${end - start} ms`);

            return { mesh: new_mesh,points: triangulated_points_list };
        }

        quad_to_tri(points_list: Point3D[] | undefined = undefined) {
            const triangulated_points_list: Point3D[] = [];
            if(typeof points_list !== "undefined") {
                triangulated_points_list.push(...points_list);
            }

            const new_mesh = new MeshDataStructure();

            for(const face of this.faces) {
                const vertex_indexes = face.split("-").map(value => Number(value));
                const face_edges = this.getEdgesOfFace(vertex_indexes);

                if(face_edges.length === 4) {
                    const [a,b] = face_edges[0].split("-");
                    const [c,d] = face_edges[1].split("-");
                    const [e,f] = face_edges[2].split("-");
                    const [g,h] = face_edges[3].split("-");

                    new_mesh.addFace(`${a}-${b}-${d}`);
                    new_mesh.addFace(`${e}-${f}-${h}`);
                }
                else new_mesh.addFace(face);
            }

            return { mesh: new_mesh,points: triangulated_points_list };
        }
    }


    class Point2D {
        x: number;
        y: number;
        r: number;
        constructor (x: number,y: number,r = 0) {
            this.x = x;
            this.y = y;
            this.r = r;
        }
    }

    class Point3D {
        x: number;
        y: number;
        z: number;
        constructor (x: number,y: number,z: number) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    class Ret {
        public _ret: string;
        public _color_code: string;
        public _line: boolean;
        public _s_width: number;
        public _type: _RET_TYPE_;

        constructor (ret: string,color_code = "black",line = true,_s_width = 1,type: _RET_TYPE_ = "A") {
            this._line = line;
            this._ret = ret;
            this._color_code = color_code;
            this._s_width = _s_width;
            this._type = type;
        }

        equals(input: string) {
            if(this._line === true) {
                const [i_a,i_b] = input.split("-");
                const [r_a,r_b] = this._ret.split("-");

                if((i_a === r_a) && (i_b === r_b)) return true;
                else return false;
            }
            else return false;
        }
    }

    abstract class BinarySearch<T>{

        abstract satisfies(): -1 | 0 | 1;

        recursive(elem: T,arr: T[],min: number,max: number) // min = 0, max = inputArray.length - 1
        {
            if(min > max) return -1;

            else {
                let mid = Math.floor((min + max) / 2);

                if(this.satisfies() === 0) return mid;
                else if(this.satisfies() === -1) return this.recursive(elem,arr,min,mid - 1);
                else return this.recursive(elem,arr,mid + 1,max);
            }
        }

        iterative(arr: T[]) {
            let min = 0;
            let max = arr.length - 1;

            while(min <= max) {
                let mid = Math.floor((min + max) / 2);

                if(this.satisfies() === 0) return mid;
                else if(this.satisfies() === -1) max = mid - 1;
                else min = mid + 1;
            }

            return -1;
        }
    }

    class ConvexHull2D {
        jarvisConvexHull(points: Point2D[]): _FULL_CDV {
            const n = points.length;
            const triangulation = new MeshDataStructure() // not needed but added for forwards compatibility
            const convex_hull_history: Ret[][] = []; // Initialize the history
            const points_on_hull: number[] = [];

            const point_ret_list: Ret[] = [];
            for(let point in points) point_ret_list.push(new Ret(point,color_list[(Number(point) % (color_list.length - 1)) + 1],false,1,"A"));

            convex_hull_history.push(point_ret_list);

            const ret_list: Ret[] = [];
            var first: number;
            var now: number;
            var next: number;
            var prev: number;
            if(n < 3) {
                first = 0;
                for(let i = 0; i < n; i++) {
                    now = i;
                    if(i === n - 1) next = first;
                    else next = i + 1;
                    points_on_hull[i] = i;
                    ret_list.push(new Ret(`${now}-${next}`,"cyan",true,10,"D"));
                    convex_hull_history.push([...point_ret_list,...ret_list]); // push it to the history so we can see the change                      
                }

                return [{ "hull": points,"points": points_on_hull,history: convex_hull_history },{ list: [],full_point_list: [],history: [] },{ edges: [],full_point_list: [],history: [] },triangulation,[],points,point_ret_list,[],[]];
            } // there must be at least three points

            const hull: Point2D[] = [];

            // Find the leftmost point and bottom-most point
            let l = 0;
            for(let i = 1; i < n; i++) {
                if(points[i].x < points[l].x)
                    l = i;

                // For handling leftmost colinear points
                else if(points[i].x === points[l].x && points[i].y < points[l].y) {
                    l = i;
                }
            }

            // Start form leftmost point and keep moving counterclockwise untill we reach the start point
            // again. This loop runs O(h) tiems where h is the number of points in the result or output.

            let p = l,
                q = 0;
            do {
                // Add current point to result
                hull.push(points[p]);
                points_on_hull.push(p);

                prev = p;

                // Search for a point 'q' such that orientation (p,q,x) is counterclockwise
                // for all points 'x'. The idea is to keep track of last visited most counterclock-wise point in q
                // If any point 'i' is more counterclock-wise than q, then update q

                q = (p + 1) % n;

                for(let i = 0; i < n; i++) {
                    // If i is more counterclockwise than current q, then update p

                    if(_Linear.findOrientation(points[p],points[i],points[q]) === 2) q = i;

                    // HANDLING  COLLINEAR POINTS
                    // If point q lies in the middle, then also update q

                    if(p !== i && _Linear.findOrientation(points[p],points[i],points[q]) === 0 &&
                        _Linear.onSegment(points[p],points[q],points[i])) q = i;
                }

                // Now q is the most counterclockwise with respect to p. Set p as q for next iteration.
                // so that q is added tor result 'hull'
                p = q;

                now = p;
                ret_list.push(new Ret(`${prev}-${now}`,"cyan",true,10,"D"));
                convex_hull_history.push([...point_ret_list,...ret_list]); // push it to the history so we can see the change  
            } while(p != l); // While we don't come to first point

            return [{ "hull": hull,"points": points_on_hull,history: convex_hull_history },{ list: [],full_point_list: [],history: [] },{ edges: [],full_point_list: [],history: [] },triangulation,[],points,point_ret_list,[],[]];
        }
    }

    const _ConvexHull = new ConvexHull2D();

    class Delaunay2D {
        constructor () {}
        superTriangle(pointList: Point2D[]): Point2D[] {
            const rect = _Linear.getTriBoundingRect(pointList);
            const tri = _Linear.findCircTriFSq(rect);

            return tri;
        }

        get_edges(triangulation: MeshDataStructure): _RET {
            const ret_list: Ret[] = [];
            const _list: string[] = [];
            const results = Object.keys(triangulation.HalfEdgeDict);

            // reduce duplicate edges in the halfedge dictionary of the triangle data structure to one edge
            // when converting to an edge array

            for(let result of results) {
                const [a,b] = result.split("-").map((value) => { return Number(value) });
                const rev_result = `${b}-${a}`;

                if(!(_list.includes(result) || _list.includes(rev_result))) {
                    const [i,j] = [Math.min(a,b),Math.max(a,b)];

                    _list.push(`${i}-${j}`);
                }
            }

            for(let val of _list) {
                ret_list.push(new Ret(val,"black",true,5,"E"));
            }

            return { "ret_list": ret_list,"list": _list };
        }

        get_ret(input: string,ret_list: Ret[]) // find the ret given the input
        {
            const null_ret = new Ret("-");

            for(let ret of ret_list) {
                if(ret.equals(input)) return ret;
                else return null_ret;
            }
            return null_ret;
        }

        bowyer_watson(_full_cdv: _FULL_CDV): _FULL_CDV {
            const pointList = _full_cdv[5];
            const pointList_len = pointList.length;
            const convex_hull = _full_cdv[0];
            const points_ret_list = _full_cdv[6];
            const delaunay_history: Ret[][] = []; // Initialize the history
            const triangulation = new MeshDataStructure() // triangle data structure

            const [a,b,c] = this.superTriangle(pointList); // must be large enough to completely contain all the points in pointList
            // mark the super triangle points with values starting from length of pointlist to length of pointlist + 3 and add it to the triangle data structure
            triangulation.addFace(`${pointList_len}-${pointList_len + 1}-${pointList_len + 2}`);
            // joint the points list and super triangle points together into one common list
            const fullPointList = [...pointList,a,b,c];

            const super_points_ret: Ret[] = [];
            super_points_ret.push(new Ret(`${pointList_len}`,"black",false,1,"B"));
            super_points_ret.push(new Ret(`${pointList_len + 1}`,"black",false,1,"B"));
            super_points_ret.push(new Ret(`${pointList_len + 2}`,"black",false,1,"B"));

            delaunay_history.push(points_ret_list); // push it to the history so we can see the change

            delaunay_history.push([...points_ret_list,...super_points_ret]); // push it to the history so we can see the change

            delaunay_history.push([...points_ret_list,...super_points_ret,...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change

            // add all the points one at a time to the triangulation
            for(let p in pointList) {
                const point = pointList[p];
                const point_num = Number(p);

                const badTriangles: string[] = [];
                const gray_edges: Ret[] = [];

                // first find all the triangles that are no longer valid due to the insertion
                for(let triangle of triangulation.faces) {
                    const [a,b,c] = [...triangle.split("-").map((value) => { return value })];
                    const [p,q,r] = [a,b,c].map((value) => { return fullPointList[value] });

                    const coords = _Linear.getCircumCircle(p,q,r);

                    const _a = new Ret(`${a}-${point_num}`,"yellow",true,5,"E");
                    const _b = new Ret(`${b}-${point_num}`,"yellow",true,5,"E");
                    const _c = new Ret(`${c}-${point_num}`,"yellow",true,5,"E");
                    delaunay_history.push([...points_ret_list,...super_points_ret,...this.get_edges(triangulation).ret_list,...gray_edges,_a,_b,_c]); // push it to the history so we can see the change

                    const invalid_tri_list: Ret[] = [];

                    // if point is inside circumcircle of triangle add triangle to bad triangles
                    if(_Linear.isInsideCirc(point,[coords.x,coords.y,coords.r])) {
                        badTriangles.push(triangle);

                        const ret_a = new Ret(`${a}-${point_num}`,"red",true,5,"E");
                        const ret_b = new Ret(`${b}-${point_num}`,"red",true,5,"E");
                        const ret_c = new Ret(`${c}-${point_num}`,"red",true,5,"E");

                        invalid_tri_list.push(...[new Ret(`${a}-${b}`,"red",true,5,"E"),new Ret(`${b}-${c}`,"red",true,5,"E"),new Ret(`${a}-${c}`,"red",true,5,"E")]);
                        gray_edges.push(...[new Ret(`${a}-${b}`,"gray",true,5,"E"),new Ret(`${b}-${c}`,"gray",true,5,"E"),new Ret(`${a}-${c}`,"gray",true,5,"E")]);
                        delaunay_history.push([...points_ret_list,...super_points_ret,...this.get_edges(triangulation).ret_list,ret_a,ret_b,ret_c,...invalid_tri_list]); // push it to the history so we can see the change
                        delaunay_history.push([...points_ret_list,...super_points_ret,...this.get_edges(triangulation).ret_list,...gray_edges]); // push it to the history so we can see the change
                    }
                }

                const polygon: string[] = [];

                const bad_edges_dict = {};

                // find the boundary of the polygonal hole
                for(let bad_triangle of badTriangles) {
                    const bad_edges = triangulation.getEdgesOfFace(bad_triangle.split("-").map(value=>Number(value)));

                    for(let bad_edge of bad_edges) {
                        const [i,j] = bad_edge.split("-").map((value) => { return Number(value) });
                        const [a,b] = [Math.min(i,j),Math.max(i,j)];

                        // Find how many times the bad edge occurs and increment the value denoting its frequency accordingly
                        if(!bad_edges_dict[`${a}-${b}`]) {
                            bad_edges_dict[`${a}-${b}`] = 1;
                        }
                        else {
                            bad_edges_dict[`${a}-${b}`]++;
                        }
                    }

                    // remove each bad triangle from the triangle data structure
                    triangulation.removeFace(bad_triangle);
                }

                // if edge is not shared by any other triangles (occurence or frequency is one) in bad triangles add edge to polygon
                const poly_edge_ret: Ret[] = [];
                for(let bad_edge in bad_edges_dict) {
                    if(bad_edges_dict[bad_edge] === 1) {
                        polygon.push(bad_edge);
                        poly_edge_ret.push(new Ret(bad_edge,"green",true,5,"E"));
                        delaunay_history.push([...points_ret_list,...super_points_ret,...this.get_edges(triangulation).ret_list,...gray_edges,...poly_edge_ret]); // push it to the history so we can see the change
                    }
                }

                // re-triangulate the polygonal hole using the point and add the triangles to the triangle data structure
                for(let polygonal_edge of polygon) {
                    const [a,b] = polygonal_edge.split("-");

                    // add a new triangle with the vertices of polygonal_edge and the point number
                    triangulation.addFace(a+"-"+b+"-"+point_num);

                    delaunay_history.push([...points_ret_list,...super_points_ret,...poly_edge_ret,...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change
                }
            }

            // get the edges

            delaunay_history.push([...points_ret_list,...super_points_ret,...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change

            // If triangle contains a vertex from original super-triangle remove triangle from triangulation


            const prune_list: string[] = [];

            for(let triangle of triangulation.faces) {
                const num_triangle = triangle.split("-").map((value) => { return Number(value) });
                for(let num of num_triangle) {
                    if(num === pointList_len || num === pointList_len + 1 || num === pointList_len + 2) {
                        prune_list.push(triangle);
                        break;
                    }
                }
            }

            for(let triangle of prune_list) {
                triangulation.removeFace(triangle); // remove triangle containing vertices of super triangle

                delaunay_history.push([...points_ret_list,...super_points_ret,...this.get_edges(triangulation).ret_list]); // push it to the history so we can see the change
            }


            // get the vertices of the convex hull of the points list
            const convex_hull_vertices = convex_hull.points;

            // get the edges of the convex hull from the previously gotten convex hull vertices
            const convex_hull_edges = _Miscellanous.genEdgefromArray(convex_hull_vertices,true);
            const convex_hull_edges_unsorted = _Miscellanous.genEdgefromArray(convex_hull_vertices,false);

            const convex_hull_edges_ret_list: Ret[] = [];
            // show the convex_hull edges
            for(let edge of convex_hull_edges) {
                convex_hull_edges_ret_list.push(new Ret(edge,"cyan",true,10,"D"));
            }

            delaunay_history.push([...this.get_edges(triangulation).ret_list,...convex_hull_edges_ret_list]); // push it to the history so we can see the change

            const ret_list: Ret[] = [];
            const _list = this.get_edges(triangulation).list;

            // for each edge of the convex hull, check if it exists in the delaunay edge array and add it if it doesn't
            for(let edge in convex_hull_edges) {
                if(!_list.includes(convex_hull_edges[edge])) {
                    _list.push(convex_hull_edges[edge]);

                    const edge_unsorted = convex_hull_edges_unsorted[edge];

                    // get and sort the two edge numbers in ascending order
                    const [a,b] = edge_unsorted.split("-").map((value) => { return Number(value); })
                    const i = Math.min(a,b);
                    const j = Math.max(a,b);

                    // // create a list of points identical in all respects to the pointlist except that the indexes corresponding to the two edge numbers are removed
                    // const test_points = pointList.slice()
                    // test_points.splice(i,1);
                    // test_points.splice(j-1,1);
                    // console.log(test_points)

                    const k = _Linear.getSmallestTriArea(pointList[i],i,pointList[j],j,pointList);

                    triangulation.addFace(`${i}-${j}-${k}`);

                    ret_list.push(new Ret(convex_hull_edges[edge],"orange",true,5,"D"));

                    delaunay_history.push([...this.get_edges(triangulation).ret_list,...convex_hull_edges_ret_list,...ret_list]); // push it to the history so we can see the change
                }
            }

            delaunay_history.push([...this.get_edges(triangulation).ret_list,...convex_hull_edges_ret_list,...ret_list]); // push it to the history so we can see the change
            delaunay_history.push([...this.get_edges(triangulation).ret_list,...ret_list]); // push it to the history so we can see the change

            return [convex_hull,{ list: _list,full_point_list: fullPointList,history: delaunay_history },{ edges: [],full_point_list: [],history: [] },triangulation,convex_hull_edges,pointList,points_ret_list,[],[]];
        }
    }

    const _Delaunay = new Delaunay2D();

    // this.degree_list = _Miscellanous.createArrayFromArgs(n).fill(0);


    class Voronoi2D {
        adjacency_list: any[];
        triangle_list : string[];
        getTriCircumCircles(pointList: Point2D[],triangle_list: string[]): Point2D[] {
            const voronoi_points_list: Point2D[] = [];
            for(let triangle of triangle_list) {
                const [pA,pB,pC] = triangle.split("-").map((value) => { return pointList[value] });

                const tri_circum: Point2D = _Linear.getCircumCircle(pA,pB,pC);
                voronoi_points_list.push(tri_circum);
            }

            return voronoi_points_list;
        }

        getTriAsc(triangle: string): number[] {
            var tri_num_list = triangle.split("-").map((value) => { return Number(value) });
            const min = Math.min(...tri_num_list);
            const max = Math.max(...tri_num_list);
            var mid = 0;

            for(let num of tri_num_list) {
                if(num !== min && num !== max) {
                    mid = num;
                    break;
                }
            }

            return tri_num_list = [min,mid,max]; // ensure triangle numbers are ordered in ascending order
        }

        checkTriEquality(tri_input: number[],tri_comp: number[]) {
            var found = 0;
            for(let num of tri_input) {
                for(let num_c of tri_comp) {
                    if(num === num_c) found++;
                }
            }
            if(found >= 2) return true;
            else return false;
        }

        getAdjTriangles(triangle_list: string[]) {
            const adj_triangle_dict: {} = {}
            const adj_triangle_list: any[] = _Miscellanous.createArrayFromList([triangle_list.length,1]).map((value) => { return value = [] });

            for(let tri in triangle_list) {
                if(!adj_triangle_dict[tri]) adj_triangle_dict[tri] = [];

                const tri_input = this.getTriAsc(triangle_list[tri]);

                for(let tri_c in triangle_list) {
                    if(triangle_list[tri] == triangle_list[tri_c]) continue;

                    if(!adj_triangle_dict[tri_c]) adj_triangle_dict[tri_c] = [];

                    if(!adj_triangle_dict[tri].includes(triangle_list[tri_c])) {
                        const tri_comp = this.getTriAsc(triangle_list[tri_c]);

                        if(this.checkTriEquality(tri_input,tri_comp) === true) {
                            adj_triangle_dict[tri].push(triangle_list[tri_c]);
                            adj_triangle_dict[tri_c].push(triangle_list[tri]);
                            adj_triangle_list[tri].push(Number(tri_c));
                            adj_triangle_list[tri_c].push(Number(tri));
                        }
                    }
                }
            }

            return { dict: adj_triangle_dict,list: adj_triangle_list };
        }

        getConvexHullExtremes(convex_hull_points: Point2D[]): _MINMAX {
            var [minX,maxX,minY,maxY] = [Infinity,-Infinity,Infinity,-Infinity];

            // get minimum  and maximum values of x and y
            for(let point of convex_hull_points) {
                if(point.x < minX) minX = point.x;
                if(point.x > maxX) maxX = point.x;
                if(point.y < minY) minY = point.y;
                if(point.y > maxY) maxY = point.y;
            }

            return { minX: minX,maxX: maxX,minY: minY,maxY: maxY };
        }

        getCrossPoints(p: Point2D,c_extremes: _MINMAX,margin = 10): _CROSS {

            const left_diff = Math.abs(p.x - c_extremes.minX);
            const right_diff = Math.abs(p.x - c_extremes.maxX);
            const up_diff = Math.abs(p.y - c_extremes.minY);
            const down_diff = Math.abs(p.y - c_extremes.maxY);

            const left_point = new Point2D(p.x - left_diff - margin,p.y);
            const right_point = new Point2D(p.x + right_diff + margin,p.y);
            const up_point = new Point2D(p.x,p.y - up_diff - margin);
            const down_point = new Point2D(p.x,p.y + down_diff + margin);

            return { ph: left_point,qh: right_point,pv: up_point,qv: down_point };
        }

        convexHullIntersect(p1: Point2D,q1: Point2D,point_list: Point2D[],convex_hull_edges: string[]) {
            for(let edge of convex_hull_edges) {
                const [p2,q2] = edge.split("-").map((value) => { return point_list[value] });
                if(_Linear.doIntersect(p1,q1,p2,q2) === true) return true;
            }
            return false;
        }

        compute_voronoi(_full_cdv: _FULL_CDV): _FULL_CDV {
            const triangulation = _full_cdv[3];
            this.triangle_list = [...triangulation.faces];
            const n = triangulation.vertex_no;
            const pt_list = _full_cdv[5];
            this.adjacency_list = _Miscellanous.createArrayFromList([n,1]).map(() => { return [] });
            const halfedge_dict_list = Object.keys(triangulation.HalfEdgeDict);
            const convex_hull_edges = _full_cdv[4];
            const convex_hull_points = _full_cdv[0].hull;
            const points_ret_list = _full_cdv[6];
            const voronoi_history: Ret[][] = [];
            var voronoi_edges_list: string[] = [];
            const convex_hull_voronoi_no_intersect: string[] = [];
            var voronoi_convex_hull_intersect: string[] = [];
            const mid_pt_list: Point2D[] = [];
            const mid_pt_edges_list: _MID_EDGES_LIST[] = [];
            const convex_hull = _full_cdv[0];
            const delaunay = _full_cdv[1];
            const new_v: Ret[] = [];
            const new_m: Ret[] = [];
            const new_l: Ret[] = [];

            voronoi_history.push(points_ret_list); // push it to the history so we can see the change

            // get the circumcenters of all the triangles in the previously computed delaunay (or delone) triangulation
            // and store them in a list indexing them according to the index of their respective containing triangles
            const voronoi_points_list = this.getTriCircumCircles(pt_list,this.triangle_list);


            // record changes
            const voronoi_points_ret_list: Ret[][] = [];
            for(let p_index in voronoi_points_list) {
                if(voronoi_points_ret_list.length > 0) voronoi_points_ret_list.push([...voronoi_points_ret_list[voronoi_points_ret_list.length - 1],new Ret(p_index,"darkred",false,1,"C"),new Ret(p_index,"red",false,1,"H")]);
                else voronoi_points_ret_list.push([new Ret(p_index,"darkred",false,1,"C"),new Ret(p_index,"red",false,1,"H")]);
                voronoi_history.push([...points_ret_list,...voronoi_points_ret_list[p_index]]); // push it to the history so we can see the change
            }

            const voronoi_points_ret_list_last = voronoi_points_ret_list[voronoi_points_ret_list.length - 1];

            const voronoi_points_list_divide = voronoi_points_list.length;
            var end_pt_index = voronoi_points_list_divide;

            // compute the adjacent triangles
            const adj_triangles = this.getAdjTriangles(this.triangle_list);

            // compute the adjacency matrix for the vertices
            for(let edge of halfedge_dict_list) {
                const [a,b] = edge.split("-").map((value) => { return Number(value) });
                const [start,end] = [Math.min(a,b),Math.max(a,b)];
                this.adjacency_list[start].push(end);
                this.adjacency_list[end].push(start);
            }

            for(let list in this.adjacency_list) {
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
            for(let index in voronoi_points_list) {
                for(let val of adj_triangles.list[index]) {
                    const a = Math.min(Number(index),Number(val));
                    const b = Math.max(Number(index),Number(val));
                    voronoi_edges_list.push(`${a}-${b}`);
                }
            }

            // ensure uniqueness
            voronoi_edges_list = [...new Set(voronoi_edges_list)];

            // record changes
            const voronoi_edges_ret_list: Ret[][] = [];
            for(let edge of voronoi_edges_list) {
                const [a,b] = edge.split("-");
                if(voronoi_edges_ret_list.length > 0) voronoi_edges_ret_list.push([...voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1],new Ret(edge,"coral",true,5,"F"),new Ret(a,"magenta",false,1,"C"),new Ret(b,"magenta",false,1,"C")]);
                else voronoi_edges_ret_list.push([new Ret(edge,"coral",true,5,"F"),new Ret(a,"magenta",false,1,"C"),new Ret(b,"magenta",false,1,"C")]);
                voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1]]); // push it to the history so we can see the change
            }

            const voronoi_edges_ret_list_last = voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1];

            // prepare animation data for convex hull edges
            const convex_hull_edges_ret_list: Ret[] = [];
            for(let edge of convex_hull_edges) {
                convex_hull_edges_ret_list.push(new Ret(edge,"cyan",true,10,"D"));
            }

            voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...voronoi_edges_ret_list_last,...convex_hull_edges_ret_list]); // push it to the history so we can see the change

            // get all the convex hull edges that do not intersect with the voronoi edges
            // we loop through each edge of the convex hull
            // in each convex hull edge, we check if there exists a voronoi edge that intersects with it by attempting to loop through all the voronoi edges
            // if any intersecting voronoi edge is found we abort the current loop of the voronoi edges as the condition of no-intersection has been violated and return true for the convex hull edge
            // else we continue to loop through the voronoi to make sure that no voronoi edge intersects  and if none intersects at the end of the loop we return false for the convex hull edge
            // if the result is false (no-intersection) we record it.
            const no_intersect_ret_list: Ret[][] = [];
            for(let edge of convex_hull_edges) {
                var [p1,q1] = [...edge.split("-").map((value) => { return pt_list[value] })];
                var last_intersect = true;
                for(let v_edge of voronoi_edges_list) {
                    var [p2,q2] = [...v_edge.split("-").map((value) => { return voronoi_points_list[value] })];

                    if(no_intersect_ret_list.length <= 0) voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,new Ret(edge,"yellow",true,10,"D"),new Ret(v_edge,"yellow",true,5,"F")]); // push it to the history so we can see the change
                    else voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list[no_intersect_ret_list.length - 1],new Ret(edge,"yellow",true,10,"D"),new Ret(v_edge,"yellow",true,5,"F")]); // push it to the history so we can see the change

                    const intersect = _Linear.doIntersect(p1,q1,p2,q2);
                    if(intersect === true) {
                        last_intersect = intersect;

                        if(no_intersect_ret_list.length <= 0) voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,new Ret(edge,"red",true,10,"D"),new Ret(v_edge,"red",true,5,"F")]); // push it to the history so we can see the change
                        else voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list[no_intersect_ret_list.length - 1],new Ret(edge,"red",true,10,"D"),new Ret(v_edge,"red",true,5,"F")]); // push it to the history so we can see the change

                        break;
                    }
                    last_intersect = intersect;
                }

                if(last_intersect === false) {
                    convex_hull_voronoi_no_intersect.push(edge);
                    if(no_intersect_ret_list.length > 0) no_intersect_ret_list.push([...no_intersect_ret_list[no_intersect_ret_list.length - 1],new Ret(edge,"darkcyan",true,10,"D")]);
                    else no_intersect_ret_list.push([new Ret(edge,"darkcyan",true,10,"D")]);
                    voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list[no_intersect_ret_list.length - 1]]); // push it to the history so we can see the change
                }
            }

            const no_intersect_ret_list_last = no_intersect_ret_list[no_intersect_ret_list.length - 1];

            // for each non-intersecting convex hull edge get the midpoint of the convex hull edge,
            // get the circumcenter of the triangle that has and edge corresponding to the convex hull edge
            // and get the gradient of the line that connects the circumcenter of that triangle to the midpoint
            const mid_no_intersect_ret_list: Ret[][] = [];
            for(let index in convex_hull_voronoi_no_intersect) {
                const edge = convex_hull_voronoi_no_intersect[index];
                const [a,b] = [...edge.split("-").map((value) => { return pt_list[Number(value)] })];

                const midPoint = new Point2D((a.x + b.x) * 0.5,(a.y + b.y) * 0.5);
                const _mid_pt_index = mid_pt_list.push(midPoint) - 1;
                const triangle = triangulation.HalfEdgeDict[edge].face_vertices.join("-");
                const _circum_pt_index = this.triangle_list.indexOf(triangle);
                mid_pt_edges_list[index] = { mid_pt_index: _mid_pt_index,circum_pt_index: _circum_pt_index };

                if(mid_no_intersect_ret_list.length > 0) mid_no_intersect_ret_list.push([...mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1],...[new Ret(`${_mid_pt_index}-${_circum_pt_index}`,"purple",true,5,"G")]]);
                else mid_no_intersect_ret_list.push([new Ret(`${_mid_pt_index}-${_circum_pt_index}`,"purple",true,5,"G")]);
                voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1]]); // push it to the history so we can see the change
            }

            const mid_no_intersect_ret_list_last = mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1];

            // for each line gotten from above, use the gradient of the line to make the line longer while keeping the start coordinate
            // of the line as the circumcenter and ensuring that the line's end coordinate is located outwards
            for(let index in mid_pt_edges_list) {
                const val = mid_pt_edges_list[index];
                const start = voronoi_points_list[val.circum_pt_index];
                const inter = mid_pt_list[val.mid_pt_index];
                const gradient = _Linear.get_gradient(start,inter);
                const [p1,q1] = convex_hull_voronoi_no_intersect[index].split("-").map((value) => { return pt_list[value] });
                const end = _Linear.specialGetLineFromPointGradient(p1,q1,start,gradient,50);
                voronoi_points_list.push(end);
                voronoi_edges_list.push(`${val.circum_pt_index}-${end_pt_index}`);
                voronoi_points_ret_list_last.push(new Ret(`${end_pt_index}`,"darkred",true,1,"C"));
                new_m.push(new Ret(`${val.circum_pt_index}-${end_pt_index}`,"darkblue",true,5,"F"));
                voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...mid_no_intersect_ret_list_last,...new_m]); // push it to the history so we can see the change
                end_pt_index++;
            }

            // get all the voronoi edges that intersect with the convex hull edges
            for(let v_index in voronoi_edges_list) {
                const v_edge = voronoi_edges_list[v_index];
                var [p1,q1] = [...v_edge.split("-").map((value) => { return voronoi_points_list[value] })];
                for(let edge of convex_hull_edges) {
                    var [p2,q2] = [...edge.split("-").map((value) => { return pt_list[value] })];
                    voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,new Ret(v_edge,"yellow",true,5,"F"),new Ret(edge,"yellow",true,10,"D")]); // push it to the history so we can see the change
                    const intersect = _Linear.doIntersect(p1,q1,p2,q2);
                    if(intersect === true) {
                        voronoi_convex_hull_intersect.push(v_edge);
                        new_v.push(new Ret(v_edge,"maroon",true,5,"F"));
                        voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,new Ret(edge,"lightsalmon",true,10,"D")]); // push it to the history so we can see the change
                        break;
                    }
                }
            }

            // ensure uniqueness
            voronoi_convex_hull_intersect = [...new Set(voronoi_convex_hull_intersect)];

            const c_extremes = this.getConvexHullExtremes(convex_hull_points);

            const no_duplicate: string[] = [];

            // from the afore gotten voronoi edges get those that intersect with others
            for(let v1_edge of voronoi_convex_hull_intersect) {
                var [p1,q1] = [...v1_edge.split("-").map((value) => { return voronoi_points_list[value] })];
                for(let v2_edge of voronoi_convex_hull_intersect) {
                    if(v1_edge === v2_edge) continue;
                    no_duplicate.push(v1_edge + v2_edge);
                    var counter_duplicate = v2_edge + v1_edge;
                    if(no_duplicate.includes(counter_duplicate)) continue;
                    var [p2,q2] = [...v2_edge.split("-").map((value) => { return voronoi_points_list[value] })];

                    voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,...new_l,new Ret(v1_edge,"yellow",true,5,"F"),new Ret(v2_edge,"yellow",true,5,"F")]); // push it to the history so we can see the change

                    const intersect = _Linear.doIntersect(p1,q1,p2,q2);

                    if(intersect === true) {
                        // get the point that is the same for both edges
                        const v_a = v1_edge.split("-");
                        const v_b = v2_edge.split("-");
                        const v_test_1 = v_a.includes(v_b[0]);
                        const v_test_2 = v_a.includes(v_b[1]);

                        if((v_test_1 || v_test_2) === false) continue;
                        const v = v_test_1 ? [v_b[0],1] : [v_b[1],0];

                        // get the points that exist outside the convex hull
                        const point = voronoi_points_list[v[0]];
                        const boundary_points = this.getCrossPoints(point,c_extremes,10);

                        voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,...new_l,new Ret(v1_edge,"darkgoldenrod",true,5,"F"),new Ret(v2_edge,"darkgoldenrod",true,5,"F"),new Ret(`${v[0]}`,"yellow",false,1,"C")]); // push it to the history so we can see the change

                        const point_ph_intersect = this.convexHullIntersect(point,boundary_points.ph,pt_list,convex_hull_edges);
                        const point_qh_intersect = this.convexHullIntersect(point,boundary_points.qh,pt_list,convex_hull_edges);
                        const point_pv_intersect = this.convexHullIntersect(point,boundary_points.pv,pt_list,convex_hull_edges);
                        const point_qv_intersect = this.convexHullIntersect(point,boundary_points.qv,pt_list,convex_hull_edges);

                        // If true then it is inside the convex hull so we skip it
                        if(point_ph_intersect === true &&
                            point_qh_intersect === true &&
                            point_pv_intersect === true &&
                            point_qv_intersect === true) {
                            voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,...new_l,new Ret(v1_edge,"red",true,5,"F"),new Ret(v2_edge,"red",true,5,"F"),new Ret(`${v[0]}`,"red",false,1,"C")]); // push it to the history so we can see the change
                            continue;
                        }


                        // If not then it is not inside the convex hull and we can safely do some work
                        // get the midpoint of the edges connecting the lines shared by this point
                        const a = v_a[v[1]];
                        const b = v_b.slice().splice(Number(v[1]),1)[0];

                        voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,...new_l,new Ret(v1_edge,"burlywood",true,5,"F"),new Ret(v2_edge,"burlywood",true,5,"F"),new Ret(`${v[0]}`,"green",false,1,"C")]); // push it to the history so we can see the change

                        var p1 = voronoi_points_list[a];
                        var q1 = voronoi_points_list[b];
                        const midpoint = _Linear.get_midpoint(p1,q1);
                        const inter = voronoi_points_list[v[0]];
                        const gradient = _Linear.get_gradient(midpoint,inter);
                        const end = _Linear.getLineFromPointGradient(inter,gradient,50,p1.y < q1.y);

                        voronoi_points_list.push(end);
                        voronoi_edges_list.push(`${v[0]}-${end_pt_index}`);
                        new_l.push(new Ret(`${v[0]}-${end_pt_index}`,"coral",true,5,"F"),new Ret(v1_edge,"burlywood",true,5,"F"),new Ret(v2_edge,"burlywood",true,5,"F"),new Ret(`${v[0]}`,"green",false,1,"C"));

                        voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,...new_l]); // push it to the history so we can see the change
                        end_pt_index++;
                    }
                }

                voronoi_history.push([...points_ret_list,...voronoi_points_ret_list_last,...convex_hull_edges_ret_list,...voronoi_edges_ret_list_last,...no_intersect_ret_list_last,...new_m,...new_v,...new_l]); // push it to the history so we can see the change
            }

            return [convex_hull,delaunay,{ edges: voronoi_edges_list,full_point_list: voronoi_points_list,history: voronoi_history },triangulation,convex_hull_edges,pt_list,points_ret_list,mid_pt_list,this.triangle_list];
        }
    }

    const _Voronoi2D = new Voronoi2D();

    class Linear_Algebra_Animate {
        cur_index: number;
        running: boolean;
        cdv_switch: _CDV_SWITCH_;
        time: number;

        section: number;
        ret_group_num: number;
        ret_num: number;

        convex_hull: _CONVEX_HULL;
        delaunay: _DELAUNAY;
        voronoi: _VORONOI;
        convex_hull_edges: string[];
        points: Point2D[];
        points_ret_list: Ret[];
        midpoints: Point2D[];
        triangle_list : string[];
        super_points: Point2D[];
        voronoi_points: Point2D[];

        constructor (input: _FULL_CDV,cdv_switch: _CDV_SWITCH_ = 0,cur_index = 0) {
            this.cur_index = cur_index;
            this.cdv_switch = cdv_switch;
            this.running = false;
            this.time = 1000;

            this.section = 0;
            this.ret_group_num = 0;

            this.convex_hull = input[0];
            this.delaunay = input[1];
            this.voronoi = input[2];
            this.convex_hull_edges = input[4];
            this.points = input[5];
            this.points_ret_list = input[6];
            this.midpoints = input[7];
            this.triangle_list = input[8];
            this.super_points = this.delaunay.full_point_list;
            this.voronoi_points = this.voronoi.full_point_list;

            // console.log(this.convex_hull.history);
            // console.log(this.delaunay.history);
            // console.log(this.voronoi.history);

            switch(this.cdv_switch) {
                case 0: length = 0; break;
                case 1: length = this.convex_hull.history.length; break;
                case 2: length = this.delaunay.history.length; break;
                case 3: length = this.voronoi.history.length; break;
                case 4: length = this.convex_hull.history.length + this.delaunay.history.length; break;
                case 6: length = this.delaunay.history.length + this.voronoi.history.length; break;
                case 7: length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length; break;
            }

            anim_number_input.max = `${length - 1}`;
            after_anim1.innerHTML = `${length - 1}`;
        }

        changeCDVSwitch(input: _CDV_SWITCH_) {
            this.running = false;
            this.cdv_switch = input;
            this.section = 0;
            this.ret_group_num = 0;
            var length = 0;

            switch(this.cdv_switch) {
                case 0: length = 0; break;
                case 1: length = this.convex_hull.history.length; break;
                case 2: length = this.delaunay.history.length; break;
                case 3: length = this.voronoi.history.length; break;
                case 4: length = this.convex_hull.history.length + this.delaunay.history.length; break;
                case 6: length = this.delaunay.history.length + this.voronoi.history.length; break;
                case 7: length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length; break;
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

        render_ret(ret: Ret,super_points: Point2D[],voronoi_points: Point2D[],midpoints: Point2D[],triangle_list: string[]) {
            const type: _RET_TYPE_ = ret._type;
            var point1: Point2D;
            var point2: Point2D;
            switch(type) {
                case "A":
                case "B":
                    point1 = super_points[Number(ret._ret)];
                    _Experimental.drawPoint(point1,ret._color_code,ret._color_code,ret._s_width);
                    break;
                case "C":
                    point1 = voronoi_points[Number(ret._ret)];
                    _Experimental.drawPoint(point1,ret._color_code,ret._color_code,ret._s_width);
                    break;
                case "D":
                case "E":
                    [point1,point2] = ret._ret.split("-").map((value) => { return super_points[Number(value)] });
                    _Experimental.drawLine(point1,point2,ret._color_code,ret._s_width);
                    break;
                case "F":
                    [point1,point2] = ret._ret.split("-").map((value) => { return voronoi_points[Number(value)] });
                    _Experimental.drawLine(point1,point2,ret._color_code,ret._s_width);
                    break;
                case "G":
                    var [a,b] = ret._ret.split("-").map((value) => { return Number(value) });
                    point1 = midpoints[a];
                    point2 = voronoi_points[b];
                    _Experimental.drawLine(point1,point2,ret._color_code,ret._s_width);
                    break;
                case "H":
                    var [p,q,r] = triangle_list[Number(ret._ret)].split("-").map((value) => { return super_points[Number(value)] });
                    _Experimental.drawPolygon([p,q,r],ret._color_code,ret._color_code,ret._s_width,false);
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

        select_selection_system(): number[] {
            var num = this.cur_index;

            switch(this.cdv_switch) {
                case 0: return [0,0];
                case 1:
                    return [0,num % this.convex_hull.history.length];
                case 2:
                    return [1,num % this.delaunay.history.length];
                case 3:
                    return [2,num % this.voronoi.history.length];
                case 4:
                    if(num < this.convex_hull.history.length) return [0,num];
                    else return [1,num - this.convex_hull.history.length];
                case 5:
                    if(num < this.convex_hull.history.length) return [0,num];
                    else return [2,num - this.convex_hull.history.length];
                case 6:
                    if(num < this.delaunay.history.length) return [1,num];
                    else return [2,num - this.delaunay.history.length];
                case 7:
                    if(num < this.convex_hull.history.length) return [0,num];
                    else num = num - this.convex_hull.history.length;

                    if(num < this.delaunay.history.length) return [1,num];
                    else return [2,num - this.delaunay.history.length];

                default: return [0,0];
            }
        }

        selection_system(section: number,ret_group_num: number,stops: number[]): number[] {
            if(ret_group_num < (stops[section] - 1)) {
                ret_group_num++;
                this.cur_index++;
                return [section,ret_group_num];
            }

            if(section < 2) {
                section++;
                ret_group_num = 0;
                this.cur_index++;
                return [section,ret_group_num];
            }

            else {
                section = 0;
                ret_group_num = 0;
                this.cur_index = 0;
                this.running = false;
                return [section,ret_group_num];
            }
        }

        history_snapshot() {
            this.running = false;
            [this.section,this.ret_group_num] = this.select_selection_system();

            ctx.clearRect(0,0,canvas.width,canvas.height);

            status.innerHTML = `Current count: ${this.cur_index}`;
            anim_number_input.value = `${this.cur_index}`;
            anim_number.innerHTML = anim_number_input.value;

            if(this.section === 0) {
                if(this.cdv_switch === 1 || this.cdv_switch === 4 || this.cdv_switch === 5 || this.cdv_switch === 7) {
                    const group = this.convex_hull.history[this.ret_group_num];
                    for(let ret of group) {
                        this.render_ret(ret,this.super_points,this.voronoi_points,this.midpoints,this.triangle_list);
                    }
                }
            }

            if(this.section === 1) {
                if(this.cdv_switch === 2 || this.cdv_switch === 4 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                    const group = this.delaunay.history[this.ret_group_num];
                    for(let ret of group) {
                        this.render_ret(ret,this.super_points,this.voronoi_points,this.midpoints,this.triangle_list);
                    }
                }
            }

            if(this.section === 2) {
                if(this.cdv_switch === 3 || this.cdv_switch === 5 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                    const group = this.voronoi.history[this.ret_group_num];
                    for(let ret of group) {
                        this.render_ret(ret,this.super_points,this.voronoi_points,this.midpoints,this.triangle_list);
                    }
                }
            }
        }

        animate_history() {
            var length: number = 0;
            var stops = [this.convex_hull.history.length,this.delaunay.history.length,this.voronoi.history.length];
            [this.section,this.ret_group_num] = this.select_selection_system();

            switch(this.cdv_switch) {
                case 0: length = 0; break;
                case 1: length = this.convex_hull.history.length; break;
                case 2: length = this.delaunay.history.length; break;
                case 3: length = this.voronoi.history.length; break;
                case 4: length = this.convex_hull.history.length + this.delaunay.history.length; break;
                case 6: length = this.delaunay.history.length + this.voronoi.history.length; break;
                case 7: length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length; break;
            }

            if(length <= 0) return;

            this.running = true;

            var id = setInterval
                (
                    () => {

                        ctx.clearRect(0,0,canvas.width,canvas.height);

                        status.innerHTML = `Running, count: ${this.cur_index}`;
                        anim_number_input.value = `${this.cur_index}`;
                        anim_number.innerHTML = anim_number_input.value;

                        if(this.section === 0) {
                            if(this.cdv_switch === 1 || this.cdv_switch === 4 || this.cdv_switch === 5 || this.cdv_switch === 7) {
                                const group = this.convex_hull.history[this.ret_group_num];
                                for(let ret of group) {
                                    this.render_ret(ret,this.super_points,this.voronoi_points,this.midpoints,this.triangle_list);
                                }
                                [this.section,this.ret_group_num] = this.selection_system(this.section,this.ret_group_num,stops);
                            }
                        }

                        if(this.section === 1) {
                            if(this.cdv_switch === 2 || this.cdv_switch === 4 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                                const group = this.delaunay.history[this.ret_group_num];
                                for(let ret of group) {
                                    this.render_ret(ret,this.super_points,this.voronoi_points,this.midpoints,this.triangle_list);
                                }
                                [this.section,this.ret_group_num] = this.selection_system(this.section,this.ret_group_num,stops);
                            }
                        }

                        if(this.section === 2) {
                            if(this.cdv_switch === 3 || this.cdv_switch === 5 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                                const group = this.voronoi.history[this.ret_group_num];
                                for(let ret of group) {
                                    this.render_ret(ret,this.super_points,this.voronoi_points,this.midpoints,this.triangle_list);
                                }
                                [this.section,this.ret_group_num] = this.selection_system(this.section,this.ret_group_num,stops);
                            }
                        }

                        if(this.cur_index >= length || this.running === false) {
                            clearInterval(id);
                            this.running = false;
                            if(this.cur_index >= length) {
                                status.innerHTML = "Done";
                                this.cur_index = 0;
                            }
                            else {
                                anim_number_input.value = `${this.cur_index}`;
                                anim_number.innerHTML = anim_number_input.value;
                                status.innerHTML = `Paused, count: ${this.cur_index}`;
                            }
                        }
                    },this.time
                );
        }
    }

    class LinearAlgebraSupport {
        cur_index: number;
        cdv_switch: _CDV_SWITCH_;
        time: number;

        c_result: _FULL_CDV;
        d_result: _FULL_CDV;
        v_result: _FULL_CDV;

        points: Point2D[];
        animate: Linear_Algebra_Animate;

        c_1: boolean;
        c_2: boolean;
        c_3: boolean;

        constructor (points: Point2D[],cdv_switch: _CDV_SWITCH_ = 0,cur_index = 0) {
            this.points = points;
            this.c_result = _ConvexHull.jarvisConvexHull(this.points);
            this.d_result = _Delaunay.bowyer_watson(this.c_result);
            this.v_result = _Voronoi2D.compute_voronoi(this.d_result);
            this.animate = new Linear_Algebra_Animate(this.v_result,cdv_switch,cur_index);
            this.time = 1000 // fallback time;
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
            if(this.c_1 === false && this.c_2 === false && this.c_3 === false) this.cdv_switch = 0;
            if(this.c_1 === true && this.c_2 === false && this.c_3 === false) this.cdv_switch = 1;
            if(this.c_1 === false && this.c_2 === true && this.c_3 === false) this.cdv_switch = 2;
            if(this.c_1 === false && this.c_2 === false && this.c_3 === true) this.cdv_switch = 3;
            if(this.c_1 === true && this.c_2 === true && this.c_3 === false) this.cdv_switch = 4;
            if(this.c_1 === true && this.c_2 === false && this.c_3 === true) this.cdv_switch = 5;
            if(this.c_1 === false && this.c_2 === true && this.c_3 === true) this.cdv_switch = 6;
            if(this.c_1 === true && this.c_2 === true && this.c_3 === true) this.cdv_switch = 7;

            this.changeCDVSwitch(this.cdv_switch);
        }

        setC_S() {
            if(this.cdv_switch = 0) { this.c_1 === false,this.c_2 === false,this.c_3 === false; }
            if(this.cdv_switch = 1) { this.c_1 === true,this.c_2 === false,this.c_3 === false; }
            if(this.cdv_switch = 2) { this.c_1 === false,this.c_2 === true,this.c_3 === false; }
            if(this.cdv_switch = 3) { this.c_1 === false,this.c_2 === false,this.c_3 === true; }
            if(this.cdv_switch = 4) { this.c_1 === true,this.c_2 === true,this.c_3 === false; }
            if(this.cdv_switch = 5) { this.c_1 === true,this.c_2 === false,this.c_3 === true; }
            if(this.cdv_switch = 6) { this.c_1 === false,this.c_2 === true,this.c_3 === true; }
            if(this.cdv_switch = 7) { this.c_1 === true,this.c_2 === true,this.c_3 === true; }
        }

        changeCDVSwitch(input: _CDV_SWITCH_) {
            this.cdv_switch = input;
            this.animate.changeCDVSwitch(this.cdv_switch);
        }

        changeCurIndex(cur_index = 0) {
            this.cur_index = cur_index;
            this.animate.cur_index = this.cur_index;
        }

        changeTime(time: number) {
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

    class ObjectManager {}

    class PointLight {}

    class DirectionalLight {}

    class SpotLight {}

    class AreaLight {}

    class AmbientLight {}

    class AmbientLighting {}

    class DiffuseLighting {}

    class SpecularLighting {}

    class FlatShading {}

    class GouraudShading {}

    class PhongShading {}

    class BlinnPhongShading {}


    // We implement a function closure here by binding the variable 'implementDrag'
    // to a local function and invoking the local function, this ensures that we have
    // some sort of private variables
    var implementDrag: DRAG =
        (function () {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0,
                prev = 0,
                now = Date.now(),
                dt = now - prev + 1,
                dX = 0,
                dY = 0,
                sens = 10,

                // We invoke the local functions (changeSens and startDrag) as methods
                // of the object 'retObject' and set the return value of the local function
                // to 'retObject'

                retObject: DRAG = {
                    change: changeSens,
                    start: drag,
                    sensitivity: getSens()
                };

            function changeSens(value: number) {
                sens = value;
            }

            function getSens(): number {
                return sens;
            }

            function drag(element: any) {
                startDragMobile(element);
                startDrag(element);
            }

            function startDrag(element: any) {
                element.onmousedown = dragMouseDown;
            }

            function startDragMobile(element: any) {
                element.addEventListener('touchstart',dragTouchstart,{ 'passive': true });
            }

            function dragMouseDown(e: any) {
                e = e || window.event;
                e.preventDefault();

                pos3 = e.clientX;
                pos4 = e.clientY;

                document.onmouseup = dragMouseup;
                document.onmousemove = dragMousemove;
            }

            function dragTouchstart(e: any) {
                e = e || window.event;

                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;

                document.addEventListener('touchend',dragTouchend,{ 'passive': true });
                document.addEventListener('touchmove',dragTouchmove,{ 'passive': true });
            }

            function dragMousemove(e: any) {
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

            function dragTouchmove(e: any) {
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
                document.addEventListener('touchend',() => null,{ 'passive': true });
                document.addEventListener('touchmove',() => null,{ 'passive': true });
            }

            return retObject;
        })()

    implementDrag.start(canvas);

    function pick(event: MouseEvent,destination: PICK) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        const pixel = ctx.getImageData(x,y,1,1);
        const data = pixel.data;

        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        (destination.color as HTMLElement).innerHTML = rgba;
        (destination.pixel as HTMLElement).innerHTML = `(${x},${y})`;

        return rgba;
    }

    canvas.addEventListener("mousemove",(event) => pick(event,hovered));
    canvas.addEventListener("click",(event) => pick(event,selected));

    const _Classes = (bases: any): object => {
        class Bases {
            constructor () {
                bases.foreach((base: new () => any) => Object.assign(this,new base()));
            }
        }

        bases.forEach((base: new () => any) => {
            Object.getOwnPropertyNames(base.prototype)
                .filter(prop => prop != 'constructor')
                .forEach(prop => Bases.prototype[prop] = base.prototype[prop]);
        }
        )
        return Bases
    }




    class Experimental {
        constructor () {}
        draw(coords: Point2D[],fill_style = "red",stroke_style = "black",stroke_width = 1,fill_bool = false) {
            ctx.globalAlpha = MODIFIED_PARAMS._GLOBAL_ALPHA;
            if(coords.length === 1) {
                const a = coords[0];
                if(a.r === 0) this.drawPoint(a,fill_style,stroke_style);
                else this.drawCircle(a.x,a.y,a.r,fill_style,stroke_style);

            }
            if(coords.length === 2) {
                const [a,b] = [...coords];
                this.drawLine(a,b,stroke_style,stroke_width);
            }

            if(coords.length === 3) {
                const [p,q,r] = [...coords];
                this.drawTriangle(p,q,r,fill_style,stroke_style);
            } else if(coords.length > 3) {
                this.drawPolygon(coords,fill_style,stroke_style,stroke_width,fill_bool);
            }
        }

        getCircumCircle_(coords: Point2D[]) {
            const [a,b,c] = [...coords];
            return _Linear.getCircumCircle(a,b,c);
        }

        getInCircle_(coords: Point2D[]) {
            const [a,b,c] = [...coords];
            return _Linear.getInCircle(a,b,c);

        }

        drawTriangle(a: Point2D,b: Point2D,c: Point2D,fill_style = "red",stroke_style = "black") {
            if(typeof a !== "undefined" && typeof b !== "undefined" && typeof c !== "undefined") {
                ctx.beginPath();
                ctx.moveTo(a.x,a.y);
                ctx.lineTo(b.x,b.y);
                ctx.lineTo(c.x,c.y);
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

        drawPolygon(coords: Point2D[],fill_style = "red",stroke_style = "black",stroke_width = 1,fill_bool = false) {
            ctx.beginPath();
            ctx.moveTo(coords[0].x,coords[0].y);

            for(let coord of coords) {
                ctx.lineTo(coord.x,coord.y);
            }

            ctx.closePath();

            if(fill_bool === true) {
                ctx.fillStyle = fill_style;
                ctx.fill();
            }

            ctx.strokeStyle = stroke_style;
            ctx.lineWidth = stroke_width;
            ctx.stroke();
        }

        drawCircle(x: number,y: number,r: number,fill_style = "red",stroke_style = "black") {
            ctx.beginPath();
            ctx.arc(x,y,r,0,2 * Math.PI);
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


        drawPoint(o: Point2D,fill_style = "black",stroke_style = "black",stroke_width = 1) {
            if(typeof o !== "undefined") {
                ctx.beginPath();
                ctx.arc(o.x,o.y,5,0,2 * Math.PI);
                ctx.closePath();

                ctx.fillStyle = fill_style;
                ctx.fill();

                ctx.strokeStyle = stroke_style;
                ctx.lineWidth = stroke_width;

                ctx.stroke();
            }
        }

        drawText(x: number,y: number,text: string,fill_style = "black") {
            ctx.fillStyle = fill_style;
            ctx.lineWidth = 5;
            ctx.fillText(text,x,y);
        }

        drawLineFromPointGradient(p: Point2D,gradient: number,x_scale: number,stroke_style = "black",width = 1) {
            const intercept = p.y - gradient * p.x;
            const new_x = p.x + x_scale;
            const new_y = gradient * new_x + intercept;

            this.drawLine(new Point2D(p.x,p.y),new Point2D(new_x,new_y),stroke_style,width);
        }

        drawLine(a: Point2D,b: Point2D,stroke_style = "black",stroke_width = 1) {
            if(typeof a !== "undefined" && typeof b !== "undefined") {
                ctx.beginPath();
                ctx.moveTo(a.x,a.y);
                ctx.lineTo(b.x,b.y);

                ctx.strokeStyle = stroke_style;
                ctx.lineWidth = stroke_width;
                ctx.stroke();
            }
        }

        drawDelaunay(delaunay: _DELAUNAY,stroke_style = "black",stroke_width = 1) {
            const edges = delaunay.list;
            const point_list = delaunay.full_point_list;
            for(let edge of edges) {
                const [start,end] = edge.split("-").map((value) => { return point_list[Number(value)] });
                this.drawLine(start,end,stroke_style,stroke_width);
            }
        }

        drawPoints(points: Point2D[],fill_style = "red",stroke_style = "red",stroke_width = 1,divide = points.length) {
            for(let pt_index in points) {
                if(Number(pt_index) >= divide) continue;
                const point = points[pt_index];
                this.drawPoint(point,fill_style,stroke_style,stroke_width);
            }
        }

        labelPoints(points: Point2D[],fill_style = "orange",x_offset = 5,y_offset = -5,divide = points.length) {
            for(let pt_index in points) {
                if(Number(pt_index) >= divide) continue;
                const point = points[pt_index];
                this.drawText(point.x + x_offset,point.y + y_offset,pt_index,fill_style);
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

        [294,289],
        [423,200],
        [234,234],
        [300,213],
        [278,258],
        [352,331]
    ]

    const pts = [
        [302,447],
        [519,406],
        [354,321],
        [555,427],
        [357,502],
        [365,511],
        [401,488],
        [335,320],
        [531,449],
        [418,336]
    ]

    pts.forEach((value,index) => { pts[index] = [value[0] / 3 + 200,value[1] / 3 + 200] })

    // console.log(pts)

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

    const pts_mod = _Miscellanous.toPoints2D(pts);

    const color_list = _Miscellanous.ranHexCol(20);

    const _LinearAlgebraSupport = new LinearAlgebraSupport(pts_mod,0);
    _LinearAlgebraSupport.animate.time = Number(anim_speed_input.value); // actual time

    anim_number_input.oninput = function () {
        _LinearAlgebraSupport.animate.running = false;
        anim_number.innerHTML = anim_number_input.value;
        _LinearAlgebraSupport.changeCurIndex(Number(anim_number_input.value));
        _LinearAlgebraSupport.takeSnapshot();
    }

    anim_speed_input.oninput = function () {
        _LinearAlgebraSupport.animate.running = false;
        anim_speed.innerHTML = anim_speed_input.value;
        _LinearAlgebraSupport.animate.time = Number(anim_speed_input.value);
    }

    anim_info_btn.onclick = function () {
        if(_LinearAlgebraSupport.animate.running === false) {
            _LinearAlgebraSupport.runAnimation();
        }
        else {
            _LinearAlgebraSupport.animate.running = false;
        }

    }

    c_1.onclick = function () {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        _LinearAlgebraSupport.animate.running = false;
        if(_LinearAlgebraSupport.c_1 === true) {
            _LinearAlgebraSupport.c_1 = false;
            c_1.style.backgroundColor = "#4CAF50";
            _LinearAlgebraSupport.checkC_S();
        }

        else if(_LinearAlgebraSupport.c_1 === false) {
            _LinearAlgebraSupport.c_1 = true;
            c_1.style.backgroundColor = "rgb(106, 231, 11)";
            _LinearAlgebraSupport.checkC_S();
        }
        _LinearAlgebraSupport.takeSnapshot();
    }

    c_2.onclick = function () {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        _LinearAlgebraSupport.animate.running = false;
        if(_LinearAlgebraSupport.c_2 === true) {
            _LinearAlgebraSupport.c_2 = false;
            c_2.style.backgroundColor = "#4CAF50";
            _LinearAlgebraSupport.checkC_S();
        }

        else if(_LinearAlgebraSupport.c_2 === false) {
            _LinearAlgebraSupport.c_2 = true;
            c_2.style.backgroundColor = "rgb(106, 231, 11)";
            _LinearAlgebraSupport.checkC_S();
        }
        _LinearAlgebraSupport.takeSnapshot();
    }

    c_3.onclick = function () {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        _LinearAlgebraSupport.animate.running = false;
        if(_LinearAlgebraSupport.c_3 === true) {
            _LinearAlgebraSupport.c_3 = false;
            c_3.style.backgroundColor = "#4CAF50";
            _LinearAlgebraSupport.checkC_S();
        }

        else if(_LinearAlgebraSupport.c_3 === false) {
            _LinearAlgebraSupport.c_3 = true;
            c_3.style.backgroundColor = "rgb(106, 231, 11)";
            _LinearAlgebraSupport.checkC_S();
        }
        _LinearAlgebraSupport.takeSnapshot();
    }

    for(let elem of c_elems) {
        elem.addEventListener("mouseover",(ev) => { elem.style.border = "3px solid burlywood" });
        elem.addEventListener("mouseout",() => { elem.style.border = "none" });
    }


    // EDITING

    // ANIMATION

    // SCULPTING

    class CatmullClark {
        points_list: Point3D[];
        connectivity_matrix: _CONNECTIVITY_;
        edges: string[];
        faces: string[];
        face_vertex_num: number;
        face_points: Point3D[];
        edge_points: Point3D[];
        new_edges: string[];
        new_faces: string[];

        getEdgeVertices(edge: string): Point3D[] {
            return edge.split("-").map((value) => { return this.points_list[Number(value)] });
        }

        getFaceVertices(face: string): Point3D[] {
            return face.split("-").map((value) => { return this.points_list[Number(value)] });
        }

        sumPoints(points: Point3D[],dim: number) {
            var res = 0;
            for(const point of points) {
                switch(dim) {
                    case 0: res += point.x; break;
                    case 1: res += point.y; break;
                    case 2: res += point.z; break;
                }
            }
            return res;
        }

        isTouchingVertex(elem: string,vertex: number): boolean {
            const arr = elem.split("-").map((value) => { return Number(value) });
            for(const val of arr) {
                if(val === vertex) return true;
            }
            return false;
        }

        constructor (points_list: Point3D[],connectivity_matrix: _CONNECTIVITY_,face_vertex_num: number) {
            this.points_list = points_list;
            this.connectivity_matrix = connectivity_matrix;
            this.face_vertex_num = face_vertex_num;
            this.face_points = [];
            this.edge_points = [];
            this.new_faces = [];
            this.new_edges = [];
        }

        getEdgesFromFace(face: string) {
            const arr = face.split("-");
            const arr_len = arr.length;
            const ret_list: string[] = [];

            for(let i = 0; i < arr_len; i++) {
                if(i === arr_len - 1) {
                    ret_list.push(arr[i] + "-" + arr[0]);
                    return ret_list;
                }

                ret_list.push(arr[i] + "-" + arr[i + 1]);
            }

            return ret_list;
        }

        getEdgeNeighbouringFacePoints(edge: string) {
            const ret_list: Point3D[] = [];
            const [a,b] = edge.split("-");
            var index = 0;
            for(const face of this.connectivity_matrix.faces) {
                let num = 0;
                const face_vertices = face.split("-");
                for(const vertex of face_vertices) {
                    if(vertex === a || vertex === b) num++;
                }
                if(num === 2) ret_list.push(this.face_points[index]);
                index++;
            }

            return ret_list;
        }

        iterate(iteration_num = 1) {

            if(iteration_num <= 0) return;
            iteration_num--;

            for(const face of this.connectivity_matrix.faces) {
                const face_vertices = this.getFaceVertices(face);
                const sum_x = this.sumPoints(face_vertices,0);
                const sum_y = this.sumPoints(face_vertices,1);
                const sum_z = this.sumPoints(face_vertices,2);

                const face_point = new Point3D(sum_x / this.face_vertex_num,sum_y / this.face_vertex_num,sum_z / this.face_vertex_num);
                this.face_points.push(face_point);
            }

            for(const edge of this.connectivity_matrix.edges) {
                const edge_vertices_full: Point3D[] = [];
                const [f_p_a,f_p_b] = this.getEdgeNeighbouringFacePoints(edge);
                const edge_vertices = this.getEdgeVertices(edge);
                edge_vertices_full.push(...edge_vertices,f_p_a,f_p_b);
                const sum_x = this.sumPoints(edge_vertices_full,0);
                const sum_y = this.sumPoints(edge_vertices_full,1);
                const sum_z = this.sumPoints(edge_vertices_full,2);

                const edge_point = new Point3D(sum_x / 4,sum_y / 4,sum_z / 4);
                this.edge_points.push(edge_point);
            }

            for(const point_index in this.points_list) {
                const P = this.points_list[point_index];
                const F_list: Point3D[] = [];
                const R_list: Point3D[] = [];
                var n = 0;

                for(const face_point_index in this.face_points) {
                    const face = this.connectivity_matrix.faces[face_point_index];
                    if(this.isTouchingVertex(face,Number(point_index))) {
                        F_list.push(this.face_points[face_point_index]);
                        n++;
                    }
                }

                for(const edge of this.connectivity_matrix.edges) {
                    if(this.isTouchingVertex(edge,Number(point_index))) {
                        const edge_vertices = this.getEdgeVertices(edge);
                        const sum_x = this.sumPoints(edge_vertices,0);
                        const sum_y = this.sumPoints(edge_vertices,1);
                        const sum_z = this.sumPoints(edge_vertices,2);

                        const edge_midpoint = new Point3D(sum_x / 2,sum_y / 2,sum_z / 2);

                        R_list.push(edge_midpoint);
                        n++;
                    }
                }

                n /= 2;

                const f_sum_x = this.sumPoints(F_list,0);
                const f_sum_y = this.sumPoints(F_list,1);
                const f_sum_z = this.sumPoints(F_list,2);

                const r_sum_x = this.sumPoints(R_list,0);
                const r_sum_y = this.sumPoints(R_list,1);
                const r_sum_z = this.sumPoints(R_list,2);

                const F = new Point3D(f_sum_x / n,f_sum_y / n,f_sum_z / n);
                const R = new Point3D(r_sum_x / n,r_sum_y / n,r_sum_z / n);

                const X = (F.x + 2 * R.x + (n - 3) * P.x) / n;
                const Y = (F.y + 2 * R.y + (n - 3) * P.y) / n;
                const Z = (F.z + 2 * R.z + (n - 3) * P.z) / n;

                this.points_list[point_index] = new Point3D(X,Y,Z);
            }

            const p_len = this.points_list.length;
            const f_len = this.face_points.length;

            this.points_list.push(...this.face_points,...this.edge_points);

            for(const face_point_index in this.face_points) {
                const face_vertex = Number(face_point_index) + p_len;
                const boundary: string[] = [];
                const edges = this.getEdgesFromFace(this.connectivity_matrix.faces[face_point_index]);
                for(let edge of edges) {
                    var c_edge_index = 0;

                    for(const c_edge of this.connectivity_matrix.edges) {
                        const [a,b] = c_edge.split("-");
                        const counter_c_edge = `${b}-${a}`;

                        if(edge === c_edge || edge === counter_c_edge) {
                            const b = c_edge_index + p_len + f_len;
                            const [a,c] = edge.split("-");
                            boundary.push(a + `-${b}`,`${b}-` + c);
                        }
                        else c_edge_index++;
                    }
                }

                const iter_num = boundary.length / 2;
                for(let i = 0; i < iter_num; i++) {
                    const sub_boundary: string[] = [];

                    let num = 0;
                    while(num < 2) {
                        sub_boundary.push(boundary[(i * 2 + num + 1) % boundary.length]);
                        num++;
                    }

                    const [a,c] = sub_boundary[0].split("-")
                    const b = sub_boundary[sub_boundary.length - 1].split("-")[1];

                    const a_list = `${face_vertex}-${a}`;
                    const b_list = `${b}-${face_vertex}`;

                    this.new_edges.push(a_list,...sub_boundary,b_list);

                    for(let j = 0; j < iter_num; j++) this.new_faces.push(`${face_vertex}-${a}-${c}-${b}`);
                }
            }

            this.new_faces = [...new Set(this.new_faces)];
            this.new_edges = [...new Set(this.new_edges)];

            this.connectivity_matrix.edges = this.new_edges;
            this.connectivity_matrix.faces = this.new_faces;

            this.face_points = [];
            this.edge_points = [];
            this.new_edges = [];
            this.new_faces = [];

            this.iterate(iteration_num);
        }

        getMinMax(list: number[]) {
            return [Math.min(...list),Math.max(...list)];
        }

        triangulate() {
            const triangulated_points_list: Point3D[] = [];
            const triangulated_connectivity_matrix: _CONNECTIVITY_ = { faces: [],edges: [] };
            triangulated_points_list.push(...this.points_list);

            for(const face of this.connectivity_matrix.faces) {
                const face_edges = this.getEdgesFromFace(face);

                const vertex_indexes = face.split("-").map((value) => { return Number(value) });
                const vertices = vertex_indexes.map((value) => { return this.points_list[value] });

                const x_list = vertices.map((value) => { return value.x });
                const y_list = vertices.map((value) => { return value.y });
                const z_list = vertices.map((value) => { return value.z });

                const [x_min,x_max] = this.getMinMax(x_list);
                const [y_min,y_max] = this.getMinMax(y_list);
                const [z_min,z_max] = this.getMinMax(z_list);

                const avg_point = new Point3D((x_min + x_max) / 2,(y_min + y_max) / 2,(z_min + z_max) / 2);
                const avg_point_index = triangulated_points_list.push(avg_point);

                for(const edge of face_edges) {
                    const [a,b] = edge.split("-");
                    triangulated_connectivity_matrix.edges.push(`${avg_point_index}-${a}`,`${edge}`,`${b}-${avg_point_index}`);
                    triangulated_connectivity_matrix.faces.push(`${a}-${avg_point_index}-${b}`);
                }
            }

            return { "points": triangulated_points_list,connectivity: triangulated_connectivity_matrix };
        }

        display() {
            return { "points": this.points_list,connectivity: this.connectivity_matrix };
        }
    }

    // RENDERING

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
})()