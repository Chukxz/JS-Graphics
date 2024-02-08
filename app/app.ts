"use strict"

const pListCache: {} = {};
const pArgCache: {} = {};
const genBackgroundColor = "#888";

const root = document.querySelector(":root") as HTMLElement;

const nav = document.getElementsByTagName("nav")[0];
const main_nav = document.getElementById("main_nav") as HTMLUListElement;
main_nav.style.width = `${window.innerWidth - 15}px`;

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d',{ willReadFrequently: true }) as CanvasRenderingContext2D;
const svg_container = document.getElementById("container") as HTMLDivElement;
const main_menu = document.getElementById("main") as HTMLDivElement;
var main_menu_animate = true;
const stats = document.getElementById("status") as HTMLElement;

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

const elem_col = "#333";
const elem_hover_col = "#111";
const elem_active_col = "#4CAF50";

const svg_vert_bar_color = "#aaa";
const svg_objects_color = elem_col;
const svg_hover_color = "#ccc";
const svg_objects_strokeWidth = "2";
const svg_del_color = "#eee";

var nav_height = 0;
var main_menu_width = 0;
var main_menu_height = 0;

var isTouchDevice = "ontouchstart" in window;
var isTouchDeviceToggleable = true;
const TouchMouseEventId = "Clicking";

var sub_menu : HTMLDivElement | undefined = undefined;

var create_main_menu_divider = false;
let svg_main_menu_divider: CreateSVG | undefined = undefined;
let svg_main_menu_divider_line_drag: CreateSVGLineDrag | undefined = undefined;
let svg_main_menu_divider_top = -100;

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

type _DELAUNAY = { list: string[],full_point_list: Point2D[],history: Ret[][]; };

type _VORONOI = { edges: string[],full_point_list: Point2D[],history: Ret[][]; };

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

type _HALFEDGEDICT_ = { [halfedge: string]: _HALFEDGE_ };

type _OBJ_VERT_ = { [index: string]: _4D_VEC_ | undefined };

type _CAM_RENDERED_OBJ_ = { object: CreateMeshObject,vertices: _OBJ_VERT_ };

type _TOOLTIP_POSITION_ = "top" | "bottom" | "left" | "right";

type _PROJ_TYPE_ = "orthographic" | "perspective";

enum Nav_list{
    Editing,
    Animation,
    Sculpting,
    Lighting,
    Rendering
}

const start_nav = Nav_list.Rendering;

enum Handedness{
    left = 1,
    right = -1
}


interface IMPL_DRAG_ {
    changeAcc: (acc: number) => void,
    start: (element: GlobalEventHandlers,call_func: (deltaX: number,deltaY: number) => void) => void,
    acceleration: number,
    deltaX: number,
    deltaY: number,
}

interface _BASIC_PARAMS_ {
    _GLOBAL_ALPHA: number,
    _CANVAS_OPACITY: string,
    _CANVAS_WIDTH: number,
    _CANVAS_BACKGROUND_COLOR: string,
    _LAST_CANVAS_WIDTH: number,
    _CANVAS_HEIGHT: number,
    _BORDER_COLOR: string,
    _THETA: number,
    _ANGLE_UNIT: _ANGLE_UNIT_
    _ANGLE_CONSTANT: number,
    _REVERSE_ANGLE_CONSTANT: number,
    _HANDEDNESS: number;
    _X: _3D_VEC_,
    _Y: _3D_VEC_,
    _Z: _3D_VEC_,
    _Q_VEC: _3D_VEC_,
    _Q_QUART: _4D_VEC_,
    _Q_INV_QUART: _4D_VEC_,
    _NZ: number,
    _FZ: number,
    _PROJ_TYPE : _PROJ_TYPE_,
    _VERT_PROJ_ANGLE: number,
    _HORI_PROJ_ANGLE: number,
    _ASPECT_RATIO: number,
    _HALF_X: number,
    _HALF_Y: number,
    _PROJECTION_MAT: _16D_VEC_,
    _INV_PROJECTION_MAT: _16D_VEC_,
    _GRID_VERT_THETA: number,
    _ACTIVE: string,
    _SIDE_BAR_WIDTH: number,
}

const DEFAULT_PARAMS: _BASIC_PARAMS_ =
{
    _GLOBAL_ALPHA: 1,
    _CANVAS_OPACITY: '1',
    _CANVAS_WIDTH: 100,
    _CANVAS_HEIGHT: 100,
    _CANVAS_BACKGROUND_COLOR: "#888",
    _LAST_CANVAS_WIDTH: 100,
    _BORDER_COLOR: '#aaa',
    _THETA: 0,
    _ANGLE_UNIT: "deg",
    _ANGLE_CONSTANT: Math.PI / 180,
    _REVERSE_ANGLE_CONSTANT: 180 / Math.PI,
    _HANDEDNESS : Handedness.left,
    _X: [1,0,0],
    _Y: [0,1,0],
    _Z: [0,0,1],
    _Q_VEC: [0,1,0],
    _Q_QUART: [1,0,0,0],
    _Q_INV_QUART: [1,0,0,0],
    _NZ: 0.1,
    _FZ: 500,
    _PROJ_TYPE : "orthographic",
    _VERT_PROJ_ANGLE: 60,
    _HORI_PROJ_ANGLE : 60,
    _ASPECT_RATIO: 1,
    _HALF_X: 50,
    _HALF_Y: 50,
    _PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    _INV_PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    _GRID_VERT_THETA: 15,
    _ACTIVE: "",
    _SIDE_BAR_WIDTH: 100,
}

const MODIFIED_PARAMS: _BASIC_PARAMS_ = JSON.parse(JSON.stringify(DEFAULT_PARAMS));

const sendMessage = (function_name: string) => window.parent.postMessage(function_name);

//const catmull_clark_subdivision_worker = new Worker("catmull_clark_worker.js");

// const worker_script =
//     `
//     onmessage = (e) => {
//         console.log(e.data)

//         postMessage("goodluck");
//       };
//     `

// const blob = new Blob([worker_script],{ type: 'application/javascript' });

// const blobURL = URL.createObjectURL(blob);

// const chunkify = new Worker(blobURL);

// chunkify.postMessage("hello");

// chunkify.onmessage = (e) => {
//     console.log(e.data);
// }

// URL.revokeObjectURL(blobURL);

class SpawnWorker {
    is_active: boolean;
    blob_url: string;
    constructor (function_script: string,args: any[]) {
        const worker_script =
            `onmessage = (e) => {
                const result = ${function_script};

                postMessage(result);
            }`;

        const blob = new Blob([worker_script],{ type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        const worker = new Worker(blobURL);

        worker.postMessage(args);
    }
}

const implementDrag = function () {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0,
        prev = 0,
        now = Date.now(),
        dt = now - prev + 1,
        dX = 0,
        dY = 0,
        acc = 1,
        call_function = (deltaX: number,deltaY: number) => {},

        // We invoke the local functions (changeSens and startDrag) as methods
        // of the object 'retObject' and set the return value of the local function
        // to 'retObject'

        retObject: IMPL_DRAG_ = {
            changeAcc: changeAcceleration,
            start: drag,
            acceleration: getAcceleration(),
            deltaX: dX,
            deltaY: dY,
        };

    function changeAcceleration(acceleration: number) {
        acc = acceleration;
    }

    function getAcceleration(): number {
        return acc;
    }

    function drag(element: GlobalEventHandlers,call_func: (deltaX: number,deltaY: number) => void) {
        startDrag(element);
        startDragMobile(element);
        call_function = call_func;
    }

    function startDrag(element: GlobalEventHandlers) {
        element.onmousedown = dragMouseDown;
    }

    function startDragMobile(element: GlobalEventHandlers) {
        element.addEventListener('touchstart',dragTouchstart,{ 'passive': true });
    }

    function dragMouseDown(e: MouseEvent) {
        e = e || undefined;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = dragMouseup;
        document.onmousemove = dragMousemove;
    }

    function dragTouchstart(e: TouchEvent) {
        e = e || undefined;

        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;

        document.addEventListener('touchend',dragTouchend,{ 'passive': true });
        document.addEventListener('touchmove',dragTouchmove,{ 'passive': true });
    }

    function dragMousemove(e: MouseEvent) {
        e = e || undefined;
        e.preventDefault();

        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        pos3 = e.clientX;
        pos4 = e.clientY;

        dX = pos1 / dt * acc;
        dY = pos2 / dt * acc;

        prev = now;
        now = Date.now();
        dt = now - prev + 1;

        call_function(dX,dY);
    }

    function dragTouchmove(e: TouchEvent) {
        e = e || undefined;

        pos1 = e.touches[0].clientX - pos3;
        pos2 = e.touches[0].clientY - pos4;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;

        dX = pos1 / dt * acc;
        dY = pos2 / dt * acc;

        prev = now;
        now = Date.now();
        dt = now - prev + 1;

        call_function(dX,dY);
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
};

const main_menu_divider_drag_function = (deltaX: number,deltaY: number) => {
    if(typeof svg_main_menu_divider === "undefined") return;
    if(typeof svg_main_menu_divider_line_drag === "undefined") return;
    svg_main_menu_divider.svg.style.position = "absolute";

    const main_menu_height = Number(window.getComputedStyle(main_menu).height.split("px")[0]);
    const _top = Number(window.getComputedStyle(svg_main_menu_divider.svg).top.split("px")[0]);
    const max_val = Math.max(100,_top + deltaY);
    const min_val = Math.min(main_menu_height - 100, max_val);

    svg_main_menu_divider.svg.style.top = `${min_val}px`;
    svg_main_menu_divider_top = min_val;

    if(typeof sub_menu === "undefined") return;
    sub_menu.style.top = `${svg_main_menu_divider_top+8}px`;
    sub_menu.style.height = `${main_menu_height - svg_main_menu_divider_top - 20}px`;

    root.style.setProperty("--container-div-height",`${svg_main_menu_divider_top - 80}px`);
}

const basicDrawFunction = (set_last_canvas_width = true) => {
    canvas.width = MODIFIED_PARAMS._CANVAS_WIDTH;
    canvas.height = MODIFIED_PARAMS._CANVAS_HEIGHT;
    svg_container.style.left = `${MODIFIED_PARAMS._CANVAS_WIDTH + 20}px`;
    main_menu.style.left = `${MODIFIED_PARAMS._CANVAS_WIDTH + 30}px`;
    main_menu.style.width = `${MODIFIED_PARAMS._SIDE_BAR_WIDTH - 20}px`;

    if(set_last_canvas_width) MODIFIED_PARAMS._LAST_CANVAS_WIDTH = MODIFIED_PARAMS._CANVAS_WIDTH;

    // Coordinate Space
    MODIFIED_PARAMS._HALF_X = MODIFIED_PARAMS._CANVAS_WIDTH / 2;
    MODIFIED_PARAMS._HALF_Y = MODIFIED_PARAMS._CANVAS_HEIGHT / 2;

    // Perspective Projection
    MODIFIED_PARAMS._ASPECT_RATIO = MODIFIED_PARAMS._CANVAS_WIDTH / MODIFIED_PARAMS._CANVAS_HEIGHT;
    _PROJ.setProjectionParam();

    const main_menu_computed_style : CSSStyleDeclaration = window.getComputedStyle(main_menu);
    main_menu_width = Number(main_menu_computed_style.width.split("px")[0]);
    main_menu_height = Number(main_menu_computed_style.height.split("px")[0]);
    const main_menu_border_width = Number(main_menu_computed_style.borderWidth.split("px")[0]);
    if(main_menu_width > 200) main_menu_animate = true;
    else main_menu_animate = false;


    root.style.setProperty("--camera-paragraph-width",`${main_menu_width - 80}px`);
    root.style.setProperty("--custom-menu-header-width",`${main_menu_width - 100}px`);
    root.style.setProperty("--custom-sub-menu-width",`${main_menu_width - 2*main_menu_border_width}px`);

    const c_m_h_with_cross_hairs = document.getElementsByClassName("with_cross_hairs") as HTMLCollectionOf<HTMLElement>;
    for(const elem of c_m_h_with_cross_hairs) {
        if(main_menu_width < 120) elem.style.visibility = "hidden";
        else elem.style.visibility = "visible";
    }

    if(create_main_menu_divider === true) {
        svg_main_menu_divider = new CreateSVG(main_menu,`${main_menu_width - 2*main_menu_border_width}`,"10");
        create_main_menu_divider = false;
    }

    if(typeof svg_main_menu_divider === "undefined") return;
    svg_main_menu_divider.remove();
    svg_main_menu_divider.init(main_menu,`${main_menu_width - 2*main_menu_border_width}`,"10");
    svg_main_menu_divider.svg.style.position = "absolute";
    svg_main_menu_divider_line_drag = new CreateSVGLineDrag(svg_main_menu_divider,"0","0",`${main_menu_width - 2*main_menu_border_width}`,`0`,svg_vert_bar_color,"14",svg_hover_color);
    svg_main_menu_divider_line_drag.dragFunction(main_menu_divider_drag_function);
    svg_main_menu_divider_line_drag.changeAcceleration(15);
    if(svg_main_menu_divider_top < 0) svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    svg_main_menu_divider.svg.style.top = `${svg_main_menu_divider_top}px`;

    if(typeof sub_menu === "undefined") return;
    sub_menu.style.top = `${svg_main_menu_divider_top+8}px`;
    sub_menu.style.height = `${main_menu_height - svg_main_menu_divider_top - 20}px`;

    const elems = document.getElementsByClassName("object_div") as HTMLCollectionOf<HTMLDivElement>;

    for(const elem of elems){
        if(typeof elem === "undefined") continue;
        const elem_height = Number(window.getComputedStyle(elem).height.split("px")[0]);
        elem.style.height = `${elem_height}px`;
    }
}

class MeshDataStructure {
    HalfEdgeDict: _HALFEDGEDICT_;
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
    deleted_halfedges_dict: _HALFEDGEDICT_;
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

class BasicSettings {

    // Miscellanous

    private object_vertices: []
    private prev_hovered_vertices_array: [];
    private hovered_vertices_array: [];
    private pre_selected_vertices_array: [];
    private selected_vertices_array: [];
    private _last_active: HTMLLIElement;

    constructor () {
        // (drop as HTMLElement).style.top = `${-(drop as HTMLElement).offsetTop + canvas.offsetTop}px`;
        this.setCanvas();
        this.displayMouseTouchEvent();

        // drop.onclick = function () {
        //     if(drop_v === true) {
        //         drop_content.style.display = "none";
        //         drop_v = false;
        //     }

        //     else if(drop_v === false) {
        //         drop_content.style.display = "inline-block";
        //         drop_v = true;
        //     }
        // }

        // drop.addEventListener("mouseover",() => { if(drop_v === false) drop_content.style.display = "inline-block" });
        // drop.addEventListener("mouseout",() => { if(drop_v === false) drop_content.style.display = "none" });
        // drop_content.addEventListener("click",(ev) => {
        //     ev.stopPropagation();
        // });

        // canvas.addEventListener("click",() => {
        //     if(drop_v === true) {
        //         drop_content.style.display = "none";
        //         drop_v = false;
        //     }
        // });
        var numero = 0;
        for(let child of main_nav.children) {
            const _child = document.getElementById(child.id) as HTMLLIElement;
            if(_child.id !== TouchMouseEventId) {
                if(numero === start_nav) this.modifyState(child.id,_child,true);
                _child.addEventListener("mouseenter",() => { this.hoverState(child.id,_child) });
                _child.addEventListener("mouseout",() => { this.unhoverState(child.id,_child) });
                _child.addEventListener("click",() => { this.modifyState(child.id,_child) });
            }
            else _child.addEventListener("click",() => this.toggleMouseTouchEvent());
            numero++;
        }
    }

    toggleMouseTouchEvent() {
        if(isTouchDeviceToggleable) {
            const elem = document.getElementById(TouchMouseEventId) as HTMLLIElement;
            elem.style.backgroundColor = elem_active_col;
            if(isTouchDevice === true) {
                isTouchDevice = false;
                setTimeout((() => {
                    elem.style.backgroundColor = elem_col;
                }),500);
            }
            else {
                isTouchDevice = true;
                setTimeout((() => {
                    elem.style.backgroundColor = elem_col;
                }),500);
            }
            this.displayMouseTouchEvent();
        }
    }

    displayMouseTouchEvent() {
        const elem = document.getElementById(TouchMouseEventId) as HTMLLIElement;
        if(isTouchDevice === true) elem.innerHTML = "Touch";
        else elem.innerHTML = "Mouse";
    }

    setGlobalAlpha(alpha: number) {
        MODIFIED_PARAMS._GLOBAL_ALPHA = alpha;
    }

    setCanvasOpacity(opacity: string) {
        MODIFIED_PARAMS._CANVAS_OPACITY = opacity;
    }

    setCanvas(): void {
        // Canvas and sidebar

        nav_height = Number(window.getComputedStyle(main_nav).height.split("px")[0]);
        MODIFIED_PARAMS._CANVAS_HEIGHT = Math.abs(window.innerHeight - 50 - nav_height);

        MODIFIED_PARAMS._SIDE_BAR_WIDTH = Math.max(window.innerWidth / 3.5,DEFAULT_PARAMS._SIDE_BAR_WIDTH);
        var width = window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15;

        MODIFIED_PARAMS._CANVAS_WIDTH = width;
    }

    resetCanvasToDefault() {
        canvas.style.borderColor = DEFAULT_PARAMS._BORDER_COLOR;
        ctx.globalAlpha = DEFAULT_PARAMS._GLOBAL_ALPHA;
    }

    changeAngleUnit(angleUnit: _ANGLE_UNIT_) {
        MODIFIED_PARAMS._ANGLE_UNIT = angleUnit;
        MODIFIED_PARAMS._ANGLE_CONSTANT = this.angleUnit(angleUnit);
        MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT = this.revAngleUnit(angleUnit);
    }

    setHandedness(value: _HANDEDNESS_) {
        if(value === 'left') MODIFIED_PARAMS._HANDEDNESS = Handedness.left;
        else if(value === 'right') MODIFIED_PARAMS._HANDEDNESS = Handedness.right;
    }

    private angleUnit(angle_unit: _ANGLE_UNIT_): number { // for sin, sinh, cos, cosh, tan and tanh  
        if(angle_unit === "deg") return Math.PI / 180; // deg to rad
        else if(angle_unit === 'grad') return Math.PI / 200; // grad to rad
        else return 1; // rad to rad
    }

    private revAngleUnit(angle_unit: _ANGLE_UNIT_): number { // for asin, asinh, acos, acosh, atan and atanh  
        if(angle_unit === "deg") return 180 / Math.PI; // rad to deg
        else if(angle_unit === 'grad') return 200 / Math.PI; // rad to grad
        else return 1; // rad to rad
    }

    unhoverState(value: string,elem: HTMLLIElement) {
        if(value !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = elem_col;
        }
    }

    hoverState(value: string,elem: HTMLLIElement) {
        if(value !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = elem_hover_col;
        }
    }

    modifyState(value: string,elem: HTMLLIElement,first = false) {
        if(value !== MODIFIED_PARAMS._ACTIVE) {
            MODIFIED_PARAMS._ACTIVE = value;
            elem.style.backgroundColor = elem_active_col;
            if(first === false) this._last_active.style.backgroundColor = elem_col;
            this._last_active = elem;
            sendMessage(value);
        }
    }
}

class CreateSVG {
    svg: SVGSVGElement;
    svg_ns: string;
    max_child_elem_count: number;
    container_: HTMLElement;

    constructor (container: HTMLElement,width: string,height: string,max_child_element_count = 1) {
        this.init(container,width,height,max_child_element_count);
    }

    init(container: HTMLElement,width: string,height: string,max_child_element_count = 1) {
        const svgNS = "http://www.w3.org/2000/svg";
        const _svg = document.createElementNS(svgNS,"svg");
        this.svg = _svg;
        this.svg_ns = svgNS;
        this.max_child_elem_count = max_child_element_count;
        this.container_ = container;

        _svg.setAttribute("width",width);
        _svg.setAttribute("height",height);

        container.appendChild(_svg);
    }

    remove() {
        this.container_.removeChild(this.svg);
    }
}

class CreateSVGHelper{
    constructor(){}

    generateSVGArc (cx = 0, cy = 0, w = 10, h = 10,v = 10, start = 0, interval = 360, moveTo = "M", lineTo = "L", closePath = ""){
        const angle_inc = 360 / v;
        let path = "";
        const stop = start + interval;

        if (moveTo !== "M") moveTo = "m";
        if(lineTo !== "L") lineTo = "l";
    
        for(let i = 0; i < v; i++) {
            const cur_ang = (i * angle_inc) + start;
            if(cur_ang>stop) break;
            const conv = Math.PI / 180;
            const x = Math.cos((cur_ang - 90) * conv) * (w / 2)+cx;
            const y = Math.sin((cur_ang - 90) * conv) * (h / 2)+cy
            if(i === 0) path += `${moveTo} ${x} ${y}`;
            else path += `, ${lineTo} ${x} ${y}`;
        }

        path+= ` ${closePath}`;
    
        return path;
    }
}

class CreateSVGPath {
    path: Element;
    path_ns: string;
    svg_class_: CreateSVG;
    stroke_: string
    hover_color_: string;
    fill_: string;
    hover_fill_: boolean;

    constructor (svg_class: CreateSVG,d: string,stroke: string,strokeWidth: string,hover_color: string,fill = "none",hover_fill = false) {
        const _path = document.createElementNS(svg_class.svg_ns,"path");
        this.path = _path;
        this.path_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;
        this.fill_ = fill;
        this.hover_fill_ = hover_fill;

        _path.setAttribute("d",d);
        _path.setAttribute("stroke",stroke);
        _path.setAttribute("stroke-width",strokeWidth);
        _path.setAttribute("fill",fill);

        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_path);

            svg_class.svg.addEventListener("mousemove",() => { if(!isTouchDevice) _path.setAttribute("stroke",hover_color) });
            svg_class.svg.addEventListener("mouseout",() => { if(!isTouchDevice) _path.setAttribute("stroke",stroke) });
            svg_class.svg.addEventListener("touchstart",() => { if(isTouchDevice) _path.setAttribute("stroke",hover_color) },{ "passive": true });
            svg_class.svg.addEventListener("touchend",() => { if(isTouchDevice) _path.setAttribute("stroke",stroke) },{ "passive": true });

            if(hover_fill) svg_class.svg.addEventListener("mousemove",() => { if(!isTouchDevice) _path.setAttribute("fill",hover_color) });
            svg_class.svg.addEventListener("mouseout",() => { if(!isTouchDevice) _path.setAttribute("fill",fill) });
            if(hover_fill) svg_class.svg.addEventListener("touchstart",() => { if(isTouchDevice) _path.setAttribute("fill",hover_color) },{ "passive": true });
            svg_class.svg.addEventListener("touchend",() => { if(isTouchDevice) _path.setAttribute("fill",fill) },{ "passive": true });
        }
    }
}

class CreateSVGLine {
    line: Element;
    line_ns: string;
    svg_class_: CreateSVG;
    stroke_: string
    hover_color_: string;

    constructor (svg_class: CreateSVG,x1: string,y1: string,x2: string,y2: string,stroke: string,strokeWidth: string,hover_color: string) {
        const _line = document.createElementNS(svg_class.svg_ns,"line");
        this.line = _line;
        this.line_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.hover_color_ = hover_color;

        _line.setAttribute("x1",x1);
        _line.setAttribute("y1",y1);
        _line.setAttribute("x2",x2);
        _line.setAttribute("y2",y2);
        _line.setAttribute("stroke",stroke);
        _line.setAttribute("stroke-width",strokeWidth);

        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_line);

            svg_class.svg.addEventListener("mousemove",() => { if(!isTouchDevice) _line.setAttribute("stroke",hover_color) });
            svg_class.svg.addEventListener("mouseout",() => { if(!isTouchDevice) _line.setAttribute("stroke",stroke) });
            svg_class.svg.addEventListener("touchstart",() => { if(isTouchDevice) _line.setAttribute("stroke",hover_color) },{ "passive": true });
            svg_class.svg.addEventListener("touchend",() => { if(isTouchDevice) _line.setAttribute("stroke",stroke) },{ "passive": true });
        }
    }
}

class CreateSVGCircle {
    circle: Element;
    circle_ns: string;
    svg_class_: CreateSVG;
    stroke_: string
    hover_color_: string;
    fill_: string;
    hover_fill_: boolean;

    constructor (svg_class: CreateSVG,cx: string,cy: string,r: string,stroke: string,strokeWidth: string,hover_color: string,fill: string,hover_fill = true) {
        const _circle = document.createElementNS(svg_class.svg_ns,"circle");
        this.circle = _circle;
        this.circle_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;
        this.fill_ = fill;
        this.hover_fill_ = hover_fill;

        _circle.setAttribute("cx",cx);
        _circle.setAttribute("cy",cy);
        _circle.setAttribute("r",r);
        _circle.setAttribute("stroke",stroke);
        _circle.setAttribute("stroke-width",strokeWidth);
        _circle.setAttribute("fill",fill);

        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_circle);

            svg_class.svg.addEventListener("mousemove",() => { if(!isTouchDevice) _circle.setAttribute("stroke",hover_color) });
            svg_class.svg.addEventListener("mouseout",() => { if(!isTouchDevice) _circle.setAttribute("stroke",stroke) });
            svg_class.svg.addEventListener("touchstart",() => { if(isTouchDevice) _circle.setAttribute("stroke",hover_color) },{ "passive": true });
            svg_class.svg.addEventListener("touchend",() => { if(isTouchDevice) _circle.setAttribute("stroke",stroke) },{ "passive": true });

            if(hover_fill) svg_class.svg.addEventListener("mousemove",() => { if(!isTouchDevice) _circle.setAttribute("fill",hover_color) });
            svg_class.svg.addEventListener("mouseout",() => { if(!isTouchDevice) _circle.setAttribute("fill",fill) });
            if(hover_fill) svg_class.svg.addEventListener("touchstart",() => { if(isTouchDevice) _circle.setAttribute("fill",hover_color) },{ "passive": true });
            svg_class.svg.addEventListener("touchend",() => { if(isTouchDevice) _circle.setAttribute("fill",fill) },{ "passive": true });
        }
    }
}

class CreateSVGEllipse {
    ellipse: Element;
    ellipse_ns: string;
    svg_class_: CreateSVG;
    stroke_: string
    hover_color_: string;
    fill_: string;
    hover_fill_: boolean;

    constructor (svg_class: CreateSVG,cx: string,cy: string,rx: string,ry: string,stroke: string,strokeWidth: string,hover_color: string,fill: string,hover_fill = true) {
        const _ellipse = document.createElementNS(svg_class.svg_ns,"ellipse");
        this.ellipse = _ellipse;
        this.ellipse_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;
        this.fill_ = fill;
        this.hover_fill_ = hover_fill;

        _ellipse.setAttribute("cx",cx);
        _ellipse.setAttribute("cy",cy);
        _ellipse.setAttribute("rx",rx);
        _ellipse.setAttribute("ry",ry);
        _ellipse.setAttribute("stroke",stroke);
        _ellipse.setAttribute("stroke-width",strokeWidth);
        _ellipse.setAttribute("fill",fill);

        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_ellipse);

            svg_class.svg.addEventListener("mousemove",() => { if(!isTouchDevice) _ellipse.setAttribute("stroke",hover_color) });
            svg_class.svg.addEventListener("mouseout",() => { if(!isTouchDevice) _ellipse.setAttribute("stroke",stroke) });
            svg_class.svg.addEventListener("touchstart",() => { if(isTouchDevice) _ellipse.setAttribute("stroke",hover_color) },{ "passive": true });
            svg_class.svg.addEventListener("touchend",() => { if(isTouchDevice) _ellipse.setAttribute("stroke",stroke) },{ "passive": true });

            if(hover_fill) svg_class.svg.addEventListener("mousemove",() => { if(!isTouchDevice) _ellipse.setAttribute("fill",hover_color) });
            svg_class.svg.addEventListener("mouseout",() => { if(!isTouchDevice) _ellipse.setAttribute("fill",fill) });
            if(hover_fill) svg_class.svg.addEventListener("touchstart",() => { if(isTouchDevice) _ellipse.setAttribute("fill",hover_color) },{ "passive": true });
            svg_class.svg.addEventListener("touchend",() => { if(isTouchDevice) _ellipse.setAttribute("fill",fill) },{ "passive": true });
        }
    }
}

class CreateSVGLineDrag extends CreateSVGLine {
    implement_drag: IMPL_DRAG_;

    constructor (svg_class: CreateSVG,x1: string,y1: string,x2: string,y2: string,stroke: string,strokeWidth: string,hover_color: string) {
        super(svg_class,x1,y1,x2,y2,stroke,strokeWidth,hover_color);
    }

    dragFunction(func: (deltaX: number,deltaY: number) => void) {
        this.implement_drag = implementDrag();

        if(this.svg_class_.max_child_elem_count === 1) {
            this.implement_drag.start(this.svg_class_.svg,func);
        }
    }

    changeAcceleration(acceleration: number) {
        this.implement_drag.changeAcc(acceleration);
    }
}

class CreateSVGDelete {
    svg_class_: CreateSVG;
    path_1: CreateSVGPath;
    path_2: CreateSVGPath;

    constructor (svg_class: CreateSVG,d_1: string,d_2: string,stroke: string,strokeWidth: string,hover_color: string,fill = "none",hover_fill = false) {
        this.svg_class_ = svg_class;
        this.path_1 = new CreateSVGPath(svg_class, d_1, stroke, strokeWidth, hover_color, fill, hover_fill);
        this.path_2 = new CreateSVGPath(svg_class, d_2, stroke, strokeWidth, hover_color, fill, hover_fill)
    }

    clickFunction(instance : number,func: (instance_number_input : number) => void) {
        this.svg_class_.svg.addEventListener("click",()=>{func(instance)});
    }
}

class SVG_Indicator {
    svg_class: CreateSVG;
    tooltip_class: CreateToolTip;
    svg_container: HTMLDivElement;
    tooltip_container: HTMLDivElement;

    constructor (container: HTMLDivElement,max_child_elem_count: number,tooltip_text = "Generic",respect_animate = true) {
        const sub_container = document.createElement("div");
        sub_container.style.margin = "10px";
        container.appendChild(sub_container);
        this.svg_class = new CreateSVG(sub_container,"20","20",max_child_elem_count);
        this.tooltip_class = new CreateToolTip(container,sub_container,tooltip_text,5,100,respect_animate);
        this.svg_container = sub_container;
        this.tooltip_container = container;
    }
}

class Other_SVG_Indicator extends SVG_Indicator {
    constructor (container: HTMLDivElement,max_child_elem_count: number,tooltip_text = "Generic",hori_pos_ = "right_10px", vert_pos_ = "top_0px",tooltip_position: _TOOLTIP_POSITION_ = "left") {
        super(container,max_child_elem_count,tooltip_text,true);
        this.svg_container.style.display = "inline";
        this.svg_container.style.position = "absolute";

        const vert_pos = vert_pos_.split("_");
        const hori_pos = hori_pos_.split("_");
        
        if(vert_pos[0] === "top") this.svg_container.style.top = vert_pos[1];
        else if(vert_pos[0] === "bottom") this.svg_container.style.bottom = vert_pos[1];

        if(hori_pos[0] === "left") this.svg_container.style.left = hori_pos[1];
        else if(hori_pos[0] === "right") this.svg_container.style.right = hori_pos[1];

        switch(tooltip_position) {
            case "top":
                this.tooltip_class.top_tooltip();
                break;
            case "bottom":
                this.tooltip_class.bottom_tooltip();
                break;
            case "left":
                this.tooltip_class.left_tooltip();
                break;
            case "right":
                this.tooltip_class.right_tooltip();
                break;
        }
    }
}

class CreateCross_SVG_Indicator extends Other_SVG_Indicator {
    constructor (container: HTMLDivElement,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,2,text,hori_pos,vert_pos,tooltip_postition);
        new CreateSVGLine(this.svg_class,"1","10","19","10",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
        new CreateSVGLine(this.svg_class,"10","1","10","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
    }

    clickFunction(func: () => void) {
        this.svg_container.addEventListener("click",func);
    }
}

class CreateUndo_SVG_Indicator extends Other_SVG_Indicator{
    constructor (container: HTMLDivElement,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,3,text,hori_pos,vert_pos,tooltip_postition);
        const svg_helper = new CreateSVGHelper();

        const outer_curved_path = svg_helper.generateSVGArc(10,10,14,12,20,0,180,"Z");
        new CreateSVGPath(this.svg_class,outer_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true);

        const inner_curved_path = svg_helper.generateSVGArc(7,10,14,12,20,0,180,"Z");
        new CreateSVGPath(this.svg_class,inner_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false);

        new CreateSVGPath(this.svg_class,"M 2 4, L 8 6, L 8 2, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true);

    }

    clickFunction(func: () => void) {
        this.svg_container.addEventListener("click",func);
    }
}

class CreateRedo_SVG_Indicator extends Other_SVG_Indicator{
    constructor (container: HTMLDivElement,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,3,text,hori_pos,vert_pos,tooltip_postition);
        const svg_helper = new CreateSVGHelper();

        const outer_curved_path = svg_helper.generateSVGArc(10,10,14,12,20,180,180,"Z");
        new CreateSVGPath(this.svg_class,outer_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true);

        const inner_curved_path = svg_helper.generateSVGArc(13,10,14,12,20,180,180,"Z");
        new CreateSVGPath(this.svg_class,inner_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false);

        new CreateSVGPath(this.svg_class,"M 18 4, L 12 6, L 12 2, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true);
    }

    clickFunction(func: () => void) {
        this.svg_container.addEventListener("click",func);
    }
}

class CreateDelete_SVG_Indicator extends Other_SVG_Indicator{
        constructor (container: HTMLDivElement,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,8,text,hori_pos,vert_pos,tooltip_postition);
        new CreateSVGPath(this.svg_class,"M 3 5, L 4 3, L 7 3, L 9 1, L 11 1, L 13 3, L 16 3, L 17 5",svg_objects_color,svg_objects_strokeWidth,svg_hover_color, svg_objects_color, true);
        new CreateSVGPath(this.svg_class,"M 3 7, L 5 19, L 15 19, L 17 7",svg_objects_color,svg_objects_strokeWidth,svg_hover_color, svg_objects_color, true);

        new CreateSVGLine(this.svg_class,"7.5","9","7.5","16",svg_vert_bar_color,svg_objects_strokeWidth,elem_col);
        new CreateSVGLine(this.svg_class,"12.5","9","12.5","16",svg_vert_bar_color,svg_objects_strokeWidth,elem_col);
    }
    
    clickFunction(func: () => void) {
        this.svg_container.addEventListener("click",func);
    }
}

class CreateSubMenu{
    submenu : HTMLDivElement;
    constructor(){
        this.submenu = document.createElement("div");
        this.submenu.id = "custom_sub_menu";
        this.submenu.style.position = "absolute";
        this.submenu.style.backgroundColor = genBackgroundColor;
        this.submenu.style.zIndex = `${Number(window.getComputedStyle(main_menu).zIndex)+100}`;
        main_menu.appendChild(this.submenu);
    }
}

class CreateToolTip {
    tooltip_container_elem: HTMLElement;
    tooltip_elem: HTMLElement;
    tooltip_text_elem: HTMLSpanElement;
    vert_padding: number;
    width: number;
    tooltip_text_elem_orientation = "default";
    default_positioning: { top: string,bottom: string,left: string,right: string,marginLeft: string };
    constructor (tooltip_container: HTMLDivElement,tooltip: HTMLElement,tooltip_text: string,vert_padding = 5,width: number,respect_animate = true) {
        this.tooltip_container_elem = tooltip_container;

        tooltip.style.position = "relative";
        tooltip.style.display = "inline-block";
        this.tooltip_elem = tooltip;

        const tooltip_text_element = document.createElement("span");
        this.tooltip_text_elem = tooltip_text_element;
        tooltip_text_element.style.position = "absolute";
        tooltip_text_element.style.visibility = "hidden";
        tooltip_text_element.innerHTML = tooltip_text;
        tooltip_text_element.style.backgroundColor = svg_objects_color;
        tooltip_text_element.style.textAlign = "center";
        tooltip_text_element.style.width = `${width}px`;
        this.width = width;
        tooltip_text_element.style.zIndex = `${Number(window.getComputedStyle(tooltip).zIndex) + 10}`;
        tooltip_text_element.style.borderRadius = "5px";
        tooltip_text_element.style.padding = `${vert_padding}px 0`;
        this.vert_padding = vert_padding;

        this.default_positioning = {
            top: window.getComputedStyle(tooltip_text_element).top,
            bottom: window.getComputedStyle(tooltip_text_element).bottom,
            left: window.getComputedStyle(tooltip_text_element).left,
            right: window.getComputedStyle(tooltip_text_element).right,
            marginLeft: window.getComputedStyle(tooltip_text_element).marginLeft,
        }

        tooltip.appendChild(tooltip_text_element);


        tooltip.addEventListener("mouseover",() => { if(!isTouchDevice && (main_menu_animate || !respect_animate)) tooltip_text_element.style.visibility = "visible" });
        tooltip.addEventListener("mouseout",() => { if(!isTouchDevice && (main_menu_animate || !respect_animate)) tooltip_text_element.style.visibility = "hidden" });
        tooltip.addEventListener("touchstart",() => { if(isTouchDevice && (main_menu_animate || !respect_animate)) tooltip_text_element.style.visibility = "visible" },{ 'passive': true });
        tooltip.addEventListener("touchend",() => { if(isTouchDevice && (main_menu_animate || !respect_animate)) tooltip_text_element.style.visibility = "hidden" },{ 'passive': true });
    }

    change_vert_padding(vert_padding: number) {
        this.tooltip_text_elem.style.padding = `${vert_padding}px 0`;
        this.vert_padding = vert_padding;

        if(this.tooltip_text_elem_orientation === "left" || this.tooltip_text_elem_orientation === "right") this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
    }

    change_width(width: number) {
        this.tooltip_text_elem.style.width = `${width}px`;
        this.width = width;
    }

    toDefault() {
        this.tooltip_text_elem.style.top = this.default_positioning.top;
        this.tooltip_text_elem.style.bottom = this.default_positioning.bottom;
        this.tooltip_text_elem.style.left = this.default_positioning.left;
        this.tooltip_text_elem.style.right = this.default_positioning.right;
        this.tooltip_text_elem.style.marginLeft = this.default_positioning.marginLeft;
        this.tooltip_text_elem.style.padding = `${this.vert_padding}px 0`;
        this.tooltip_text_elem_orientation = "";
    }

    left_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
        this.tooltip_text_elem.style.right = "105%";
        this.tooltip_text_elem_orientation = "right";
        this.tooltip_text_elem.className = "tooltiptext_right";
    }

    right_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
        this.tooltip_text_elem.style.left = "105%";
        this.tooltip_text_elem_orientation = "left";
        this.tooltip_text_elem.className = "tooltiptext_left";
    }

    top_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.bottom = "100%";
        this.tooltip_text_elem.style.left = "50%";
        this.tooltip_text_elem.className = "tooltiptext_top";
        this.tooltip_text_elem.style.margin = "5px 0";

        this.tooltip_elem.addEventListener("mousemove",() => {
            if(!isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        });
        this.tooltip_elem.addEventListener("touchstart",() => {
            if(isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        },{ 'passive': true });
    }

    bottom_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.top = "100%";
        this.tooltip_text_elem.style.left = "50%";
        this.tooltip_text_elem.className = "tooltiptext_bottom";
        this.tooltip_text_elem.style.margin = "5px 0";

        this.tooltip_elem.addEventListener("mousemove",() => {
            if(!isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        });
        this.tooltip_elem.addEventListener("touchstart",() => {
            if(isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        },{ 'passive': true });
    }

    vertical_tooltip_helper(half_width: number,container_width: number): _VERT_TOOLTIP_HELPER_ {
        const tooltip_margin_right = Number(window.getComputedStyle(this.tooltip_elem).marginRight.split("px")[0]);
        const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
        const after = half_width > (container_width - this.tooltip_elem.offsetLeft - tooltip_margin_right) ? half_width - tooltip_margin_right : 0;
        return { before: before,after: after };
    }
}

class DrawCanvas {
    protected static drawCount = 0;
    constructor () {
        this.drawCanvas();

        const is_orientation_change_event = "onorientationchange" in  window;

        if(is_orientation_change_event){
            window.addEventListener("orientationchange",() => {
                nav_height = Number(window.getComputedStyle(main_nav).height.split("px")[0]);
                MODIFIED_PARAMS._CANVAS_HEIGHT = Math.abs(window.innerHeight - 50 - nav_height);

                MODIFIED_PARAMS._SIDE_BAR_WIDTH = window.innerWidth / 3.5;
                var width = window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15;
        
                MODIFIED_PARAMS._CANVAS_WIDTH = width;

                this.drawCanvas();
            });
        }
        else{
            window.addEventListener("resize",() => {
                const _last = window.innerWidth > MODIFIED_PARAMS._LAST_CANVAS_WIDTH;
                const _last_helper = window.innerWidth > (MODIFIED_PARAMS._LAST_CANVAS_WIDTH + 15 + MODIFIED_PARAMS._SIDE_BAR_WIDTH);
                const _last_modifier = MODIFIED_PARAMS._CANVAS_WIDTH - MODIFIED_PARAMS._LAST_CANVAS_WIDTH >= 0;
                const modify_side_width = DEFAULT_PARAMS._SIDE_BAR_WIDTH < window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH;
                const process_modify = (((modify_side_width || _last_helper) && _last) && _last_modifier);

                MODIFIED_PARAMS._SIDE_BAR_WIDTH = process_modify ? window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH : DEFAULT_PARAMS._SIDE_BAR_WIDTH;
                MODIFIED_PARAMS._CANVAS_WIDTH = process_modify ? MODIFIED_PARAMS._CANVAS_WIDTH : Math.max(DEFAULT_PARAMS._CANVAS_WIDTH,window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15);

                nav_height = Number(window.getComputedStyle(main_nav).height.split("px")[0]);
                MODIFIED_PARAMS._CANVAS_HEIGHT = Math.abs(window.innerHeight - 50 - nav_height);

                this.drawCanvas(false);
            });
        }
    }

    drawCanvas(set_last_canvas_width = true) {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        const off_set_height = 15 + Number(window.getComputedStyle(nav).height.split("px")[0]);
        canvas.style.top = `${off_set_height}px`;
        svg_container.style.top = `${off_set_height}px`;
        main_menu.style.top = `${off_set_height}px`;

        ctx.globalAlpha = MODIFIED_PARAMS._GLOBAL_ALPHA;
        canvas.style.borderColor = MODIFIED_PARAMS._BORDER_COLOR;
        canvas.style.opacity = MODIFIED_PARAMS._CANVAS_OPACITY;
        canvas.style.backgroundColor = MODIFIED_PARAMS._CANVAS_BACKGROUND_COLOR;

        while(svg_container.firstChild) svg_container.removeChild(svg_container.firstChild);
        const canvas_border_width = Number(window.getComputedStyle(canvas).borderWidth.split("px")[0]);

        const main_menu_height = MODIFIED_PARAMS._CANVAS_HEIGHT + 2 * canvas_border_width;
        main_menu.style.height = `${main_menu_height}px`;
        main_nav.style.width = `${window.innerWidth - 15}px`;

        const svg_canvas_main_menu = new CreateSVG(svg_container,"10",`${main_menu_height}`);
        const svg_canvas_main_menu_line_drag = new CreateSVGLineDrag(svg_canvas_main_menu,"0","0","0",`${main_menu_height}`,svg_vert_bar_color,"14",svg_hover_color);
        svg_canvas_main_menu_line_drag.dragFunction(this.canvas_main_menu_drag_function);
        svg_canvas_main_menu_line_drag.changeAcceleration(10);

        basicDrawFunction(set_last_canvas_width);

        DrawCanvas.drawCount++;
    }

    canvas_main_menu_drag_function(deltaX: number,deltaY: number) {
        MODIFIED_PARAMS._CANVAS_WIDTH += deltaX;
        MODIFIED_PARAMS._SIDE_BAR_WIDTH -= deltaX;

        if(MODIFIED_PARAMS._CANVAS_WIDTH > DEFAULT_PARAMS._CANVAS_WIDTH && MODIFIED_PARAMS._SIDE_BAR_WIDTH > DEFAULT_PARAMS._SIDE_BAR_WIDTH) basicDrawFunction();

        else {
            MODIFIED_PARAMS._CANVAS_WIDTH -= deltaX;
            MODIFIED_PARAMS._SIDE_BAR_WIDTH += deltaX;
        }
    }
}

// From math_lib.ts/mathlib.js file
const _PROJ: Projection = new Projection();
const _CAMERA: CameraObjects = new CameraObjects();

window.addEventListener("load",()=>{
    new BasicSettings();
    new DrawCanvas();

    console.log(MODIFIED_PARAMS)
})
