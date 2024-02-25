"use strict"

const pListCache: {} = {};
const pArgCache: {} = {};
const genBackgroundColor = "#888";

const root = document.querySelector(":root") as HTMLElement;

const nav = document.getElementsByTagName("nav")[0];
const main_nav = document.getElementById("main_nav") as HTMLUListElement;
// const click_elem = document.getElementById
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

const c_m_h_with_cross_hairs = document.getElementsByClassName("with_cross_hairs") as HTMLCollectionOf<HTMLElement>;
const camera_divs = document.getElementsByClassName("camera_div") as HTMLCollectionOf<HTMLDivElement>;

const elem_col = "#333";
const elem_hover_col = "#111";
const elem_active_col = "#4CAF50";

const svg_vert_bar_color = "#aaa";
const svg_objects_color = elem_col;
const svg_hover_color = "#ccc";
const svg_objects_strokeWidth = "2";
const svg_del_color = "#eee";

const nav_height = Number(window.getComputedStyle(nav).height.split("px")[0]);
var main_menu_width = 0;
var main_menu_height = 0;

var isTouchDevice = "ontouchstart" in window;
var isTouchDeviceToggleable = true;
const TouchMouseEventId = "Clicking";

var sub_menu : HTMLDivElement | undefined = undefined;
var create_main_menu_divider = true;
let svg_main_menu_divider: CreateSVG | undefined = undefined;
let svg_main_menu_divider_line_drag: CreateSVGLineDrag | undefined = undefined;
let svg_main_menu_divider_top = Math.min(-100, -window.innerHeight/3);
let svg_canvas_main_menu : CreateSVG | undefined = undefined;
let svg_canvas_main_menu_line_drag : CreateSVGLineDrag | undefined = undefined;

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

type _MIN_MAX_XY_ = { minX: number,maxX: number,minY: number,maxY: number };

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

type _OBJ_VERT_ = { [index: string]: _4D_VEC_ };

type _CAM_RENDERED_OBJ_ = { object: CreateMeshObject,vertices: _OBJ_VERT_ };

type _VERT_TOOLTIP_HELPER_ = { before: number; after: number };

type _TOOLTIP_POSITION_ = "top" | "bottom" | "left" | "right";

type _PROJ_TYPE_ = "Orthographic" | "Perspective";

type _MIN_MAX_XYZ_ = {minX : number, maxX : number, minY : number, maxY : number, minZ : number, maxZ : number};

type _MIN_MAX_XYZ_INDEX_ = {minXIndex : number, maxXIndex : number, minYIndex : number, maxYIndex : number, minZIndex : number, maxZIndex : number};

type _MINMAX_ = {min_max : _MIN_MAX_XYZ_, indices : _MIN_MAX_XYZ_INDEX_};

type _TRIANGULATED_MESH_POINTS_ = { mesh: MeshDataStructure ,points: Point3D[] };

type _BOUNDING_BOX_ = { d_l_f : Point3D;
                        d_l_b : Point3D;
                        d_r_f : Point3D;
                        d_r_b : Point3D;
                        t_l_f : Point3D;
                        t_l_b : Point3D;
                        t_r_f : Point3D;
                        t_r_b : Point3D;
                        };

type _BOUNDING_SPHERE_ = {center : Point3D, radius : number};

type _WINDOW_EDGE_ = "top" | "bottom" | "left" | "right";

type _SUPPORTED_INPUT_TYPES_ = "text" | "number" | "radio" | "checkbox" | "file";

type _OBJECTEDGE_ = {
    object : CameraObject | CreateObject;
    prev: number | null;
    next: number | null;
}

type _CAMOBJECTEDGE_ = {
    object: CameraObject;
    prev: number | null;
    next: number | null;
}

type _MESHOBJECTEDGE_ = {
    object: CreateMeshObject;
    prev: number | null;
    next: number | null;
}

enum Nav_list{
    Editing = "Editing",
    Animation = "Animation",
    Sculpting = "Sculpting",
    Lighting = "Lighting",
    Rendering = "Rendering",
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
    _T_B_R_L : _4D_VEC_,
    _EPSILON : number,
    _MIN_Z : number,
    _MAX_Z : number,
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
    _FZ: 600,
    _PROJ_TYPE : "Orthographic",
    _VERT_PROJ_ANGLE: 60,
    _HORI_PROJ_ANGLE : 60,
    _ASPECT_RATIO: 1,
    _HALF_X: 50,
    _HALF_Y: 50,
    _PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    _INV_PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    _GRID_VERT_THETA: 15,
    _ACTIVE: "",
    _SIDE_BAR_WIDTH: 120,
    _T_B_R_L : [0,0,0,0],
    _EPSILON : 1e-10,
    _MIN_Z : -1,
    _MAX_Z : 1,
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

const camera_ui_handler = () =>{
    const c_len = `${_CAMERA.camera_objects.instance}`.length;
    const accom_1 = 170 + (c_len * 10);
    const accom_2 = 150 + (c_len * 10);

    for(const camera_div of camera_divs) {
        const camera_elem = camera_div.children[0] as HTMLParagraphElement;
        const camera_icon_elem = camera_div.children[3] as HTMLParagraphElement;

        if(main_menu_width >= accom_1){
            camera_elem.style.display = "block";
            camera_icon_elem.style.display = "none";
            camera_elem.textContent = `Camera ${camera_elem.id.split("_")[1]}`;
        }

        else if(main_menu_width < accom_1 && main_menu_width >= accom_2){
            camera_elem.style.display = "block";
            camera_icon_elem.style.display = "none";
            camera_elem.textContent = `Cam ${camera_elem.id.split("_")[1]}`;
        }

        else if(main_menu_width < accom_2) {
            camera_elem.style.display = "none";
            camera_icon_elem.style.display = "block";
        }
    }
}

const canvas_main_menu_drag_function = (deltaX: number,deltaY: number) => {
    MODIFIED_PARAMS._CANVAS_WIDTH += deltaX;
    MODIFIED_PARAMS._SIDE_BAR_WIDTH -= deltaX;

    if(MODIFIED_PARAMS._CANVAS_WIDTH > DEFAULT_PARAMS._CANVAS_WIDTH && MODIFIED_PARAMS._SIDE_BAR_WIDTH > DEFAULT_PARAMS._SIDE_BAR_WIDTH) basicDrawFunction(true);

    else {
        MODIFIED_PARAMS._CANVAS_WIDTH -= deltaX;
        MODIFIED_PARAMS._SIDE_BAR_WIDTH += deltaX;
    }
}

const main_menu_divider_drag_function = (deltaX: number,deltaY: number) => {
    if(typeof svg_main_menu_divider === "undefined") return;
    if(typeof svg_main_menu_divider_line_drag === "undefined") return;

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
    const adjustment = isTouchDevice === true ? 0 : 20;
    const canvas_border_width = Number(window.getComputedStyle(canvas).borderWidth.split("px")[0]);
    const main_menu_computed_style : CSSStyleDeclaration = window.getComputedStyle(main_menu);
    const main_menu_border_width = Number(main_menu_computed_style.borderWidth.split("px")[0]);
    const adj = canvas_border_width + main_menu_border_width;

    canvas.width = MODIFIED_PARAMS._CANVAS_WIDTH;
    canvas.height = MODIFIED_PARAMS._CANVAS_HEIGHT;
    svg_container.style.left = `${MODIFIED_PARAMS._CANVAS_WIDTH + 20}px`;
    main_menu.style.left = `${MODIFIED_PARAMS._CANVAS_WIDTH + adj + adjustment}px`;
    main_menu.style.width = `${MODIFIED_PARAMS._SIDE_BAR_WIDTH - adj - adjustment + 10}px`;

    if(set_last_canvas_width) MODIFIED_PARAMS._LAST_CANVAS_WIDTH = MODIFIED_PARAMS._CANVAS_WIDTH;

    // Coordinate Space
    MODIFIED_PARAMS._HALF_X = MODIFIED_PARAMS._CANVAS_WIDTH / 2;
    MODIFIED_PARAMS._HALF_Y = MODIFIED_PARAMS._CANVAS_HEIGHT / 2;

    // Perspective Projection
    MODIFIED_PARAMS._ASPECT_RATIO = MODIFIED_PARAMS._CANVAS_WIDTH / MODIFIED_PARAMS._CANVAS_HEIGHT;
    _PROJ.setProjectionParam();

    main_menu_width = Number(main_menu_computed_style.width.split("px")[0]);
    main_menu_height = Number(main_menu_computed_style.height.split("px")[0]);
    if(main_menu_width > 200) main_menu_animate = true;
    else main_menu_animate = false;

    root.style.setProperty("--camera-paragraph-width",`${main_menu_width - 100}px`);
    root.style.setProperty("--custom-menu-header-width",`${main_menu_width - 100}px`);
    root.style.setProperty("--custom-sub-menu-width",`${main_menu_width - 2*main_menu_border_width}px`);

    for(const elem of c_m_h_with_cross_hairs) {
        if(main_menu_width < 200) elem.style.visibility = "hidden";
        else elem.style.visibility = "visible";
    }

    camera_ui_handler();

    // const l_width = Math.min(Math.max((main_menu_width - 40) / 2, 30),200);
    // root.style.setProperty("--custom-sub-menu-label-width",`${l_width}px`);
    // root.style.setProperty("--custom-sub-menu-input-width",`${main_menu_width - 40 - l_width}px`);

    const l_xyz_width = Math.min(Math.max((main_menu_width - 40) / 3, 20),150);
    root.style.setProperty("--custom-sub-menu-xyz-para-width",`${l_xyz_width}px`);
    root.style.setProperty("--custom-sub-menu-xyz-input-width",`${(main_menu_width - 70 - l_xyz_width) / 3}px`);

    if(create_main_menu_divider === true) {
        svg_main_menu_divider = new CreateSVG(main_menu,`${main_menu_width - 2*main_menu_border_width}`,"10","main-menu-divider_",1);
        svg_main_menu_divider.svg.style.position = "absolute";
        create_main_menu_divider = false;
    }

    if(typeof svg_main_menu_divider !== "undefined" && create_main_menu_divider === false) {
        svg_main_menu_divider.remove();
        svg_main_menu_divider.init(`${main_menu_width - 2*main_menu_border_width}`,"10");
        svg_main_menu_divider.svg.style.position = "absolute";
        svg_main_menu_divider_line_drag = new CreateSVGLineDrag(svg_main_menu_divider,"0","0",`${main_menu_width - 2*main_menu_border_width}`,`0`,svg_vert_bar_color,"14",svg_hover_color);
        svg_main_menu_divider_line_drag.dragFunction(main_menu_divider_drag_function);
        svg_main_menu_divider_line_drag.changeAcceleration(10);
        if(svg_main_menu_divider_top < 0) svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
        svg_main_menu_divider.svg.style.top = `${svg_main_menu_divider_top}px`;
    }

    if(typeof sub_menu !== "undefined") {
        sub_menu.style.top = `${svg_main_menu_divider_top+8}px`;
        sub_menu.style.height = `${main_menu_height - svg_main_menu_divider_top - 20}px`;
    }

    const elems = document.getElementsByClassName("object_div") as HTMLCollectionOf<HTMLDivElement>;

    for(const elem of elems){
        if(typeof elem === "undefined") continue;
        const elem_height = Number(window.getComputedStyle(elem).height.split("px")[0]);
        elem.style.height = `${elem_height}px`;
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

class Line{
    p : Point2D;
    q : Point2D;

    constructor(p : Point2D, q : Point2D){
        this.p = p;
        this.q = q;
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
        const start_child = document.getElementById(start_nav) as HTMLLIElement;
        this.modifyState(start_child,true);
        this.setCanvas();
        const elem = document.getElementById(TouchMouseEventId) as HTMLLIElement;
        this.displayMouseTouchEvent(elem);

        main_nav.addEventListener("click",(event)=>{
            const child = event.target as HTMLLIElement | HTMLUListElement;

            if (child.id !== TouchMouseEventId && child.id !== main_nav.id) {
                this.modifyState(child as HTMLLIElement);
                event.stopPropagation();
            }
            if(child.id === TouchMouseEventId && child.id !== main_nav.id) {
                if(isTouchDeviceToggleable) isTouchDevice = !isTouchDevice;
                this.displayMouseTouchEvent(child as HTMLLIElement);
                event.stopPropagation();
            }
        });

        main_nav.addEventListener("mouseover", (event)=>{
            const child = event.target as HTMLLIElement | HTMLUListElement;
            if (child.id !== TouchMouseEventId && child.id !== main_nav.id){ 
                this.hoverState(child as HTMLLIElement);
                event.stopPropagation();
            }
        })

        main_nav.addEventListener("mouseout", (event)=>{
            const child = event.target as HTMLLIElement | HTMLUListElement;
            if (child.id !== TouchMouseEventId && child.id !== main_nav.id){
                this.unhoverState(child as HTMLLIElement);
                event.stopPropagation();
            } 
        })

        main_menu.addEventListener("click",(event)=>{
            const elem = event.target as Element;
            const full_id = elem.id.split("_");
            const id = full_id[0];

            if (id === "point" || id === "line"     || id === "polygon" || id === "rectangle" ||
            id === "ellipse"   || id === "circle"   || id === "pyramid" || id === "cone"      ||
            id === "prism"     || id === "cylinder" || id === "cuboid"  || id === "sphere"    ||
            id === "torus") _ShapeClick.shape_click(id);


            if(id === "gen-proj"){
                if(general_projection){
                    if(typeof general_projection.projection === "undefined") return;
                    general_projection.remove();
                    if(MODIFIED_PARAMS._PROJ_TYPE === "Orthographic") MODIFIED_PARAMS._PROJ_TYPE = "Perspective";
                    else if(MODIFIED_PARAMS._PROJ_TYPE === "Perspective") MODIFIED_PARAMS._PROJ_TYPE = "Orthographic";
                    general_projection.loadCameraIcon();
                }

            }

            if(id === "cross") {   
                console.log(MODIFIED_PARAMS._ACTIVE)  
                
                if(MODIFIED_PARAMS._ACTIVE === "Rendering"){
                    _CAMERA.createNewCameraObject();
                    if(camera_indicator) camera_indicator.showCameras();
                }
                
                if(MODIFIED_PARAMS._ACTIVE === "Editing"){
                    if(mesh_sample_container_div){
                        if(mesh_sample_container_div.style.display === "none") {
                            if(cross_indicator) cross_indicator.svg_sub_container.className = "animate";
                            setTimeout(()=>{
                                if(cross_indicator && mesh_sample_container_div){
                                    mesh_sample_container_div.style.display = "block";
                                    cross_indicator.tooltip_class.tooltip_text_elem.textContent = "Close Objects";
                                }
                            },800);
                        }   
                        else if(mesh_sample_container_div.style.display === "block") 
                        {
                            if(cross_indicator) cross_indicator.svg_sub_container.className = "rev-animate";
                            setTimeout(()=>{
                                if(cross_indicator && mesh_sample_container_div){
                                    mesh_sample_container_div.style.display = "none";
                                    cross_indicator.tooltip_class.tooltip_text_elem.textContent = "Add Objects";
                                }
                            },800);
                        }
                    }
                }
            }

            if(id === "camera-remove"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    camera_indicator.removeCamera(instance);
                    camera_indicator.showCameras();
                }
            }

            if(id === "camera-proj"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    camera_indicator.toggleProjType(instance);
                    camera_indicator.showCameras();
                }
            }

            if(id === "camera-icon" || id === "camera-para"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    camera_indicator.clickCamera(instance);
                }
            }

            if(id === "undo"){}

            if(id === "redo"){}
            console.log(event.target,"******************",id);
        });

        main_menu.addEventListener("mouseover",(event)=>{
            const elem = event.target as Element;
            const full_id = elem.id.split("_");
            const id = full_id[0];

            if(id === "point") if(_Point) if(!_Point.hovered) _Point.start_event();
            if(id === "line") if(_Line) if(!_Line.hovered) _Line.start_event();
            if(id === "polygon") if(_Polygon) if(!_Polygon.hovered)_Polygon.start_event();
            if(id === "rectangle") if(_Rectangle) if(!_Rectangle.hovered) _Rectangle.start_event();
            if(id === "ellipse") if(_Ellipse) if(!_Ellipse.hovered) _Ellipse.start_event();
            if(id === "circle") if(_Circle) if(!_Circle.hovered) _Circle.start_event();
            if(id === "pyramid") if(_Pyramid) if(!_Pyramid.hovered) _Pyramid.start_event();
            if(id === "cone") if(_Cone) if(!_Cone.hovered) _Cone.start_event();
            if(id === "prism") if(_Prism) if(!_Prism.hovered) _Prism.start_event();
            if(id === "cylinder") if(_Cylinder) if(!_Cylinder.hovered) _Cylinder.start_event();
            if(id === "cuboid") if(_Cuboid) if(!_Cuboid.hovered) _Cuboid.start_event();
            if(id === "sphere") if(_Sphere) if(!_Sphere.hovered) _Sphere.start_event();
            if(id === "torus") if(_Torus) if(!_Torus.hovered) _Torus.start_event();

            if(id === "gen-proj") if(general_projection) if(!general_projection.hovered) general_projection.start_event();
            if(id === "cross") if(cross_indicator) if(!cross_indicator.hovered) cross_indicator.start_event();

            if(id === "camera-remove"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    const remove = _CAMERA.camera_objects.object_dict[instance].object.delete;

                    if(remove) if(!remove.hovered) remove.start_event();
                }
            }

            if(id === "camera-proj"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    const projection = _CAMERA.camera_objects.object_dict[instance].object.projection;

                    if(projection) if(!projection.hovered) projection.start_event();
                }
            }

            if(id === "camera-icon"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    const icon = _CAMERA.camera_objects.object_dict[instance].object.icon;

                    if(icon) if(!icon.hovered) icon.start_event();
                }
            }

            if(id === "camera-para"){}

            if(id === "main-menu-divider") if(svg_main_menu_divider_line_drag) svg_main_menu_divider_line_drag.event_in();            
            if(id === "undo") if(undo) if(!undo.hovered) undo.start_event();
            if(id === "redo") if(redo) if(!redo.hovered) redo.start_event();
        });

        main_menu.addEventListener("mouseout",(event)=>{
            const elem = event.target as Element;
            const full_id = elem.id.split("_");
            const id = full_id[0];

            if(_Point) if(_Point.hovered && id === "point") _Point.end_event();
            if(_Line) if(_Line.hovered && id === "line") _Line.end_event();
            if(_Polygon) if(_Polygon.hovered && id === "polygon") _Polygon.end_event();
            if(_Rectangle) if(_Rectangle.hovered && id === "rectangle") _Rectangle.end_event();
            if(_Ellipse) if(_Ellipse.hovered && id === "ellipse") _Ellipse.end_event();
            if(_Circle) if(_Circle.hovered && id === "circle") _Circle.end_event();
            if(_Pyramid) if(_Pyramid.hovered && id === "pyramid") _Pyramid.end_event();
            if(_Cone) if(_Cone.hovered && id === "cone") _Cone.end_event();
            if(_Prism) if(_Prism.hovered && id === "prism") _Prism.end_event();
            if(_Cylinder) if(_Cylinder.hovered && id === "cylinder") _Cylinder.end_event();
            if(_Cuboid) if(_Cuboid.hovered && id === "cuboid") _Cuboid.end_event();
            if(_Sphere) if(_Sphere.hovered && id === "sphere") _Sphere.end_event();
            if(_Torus) if(_Torus.hovered && id === "torus") _Torus.end_event();

            if(general_projection) if(general_projection.hovered && id !== "gen-proj") general_projection.end_event();
            if(cross_indicator) if(cross_indicator.hovered && id !== "cross") cross_indicator.end_event();

            if(camera_indicator){
                const instance = Number(full_id[1]);
                const camera_object =_CAMERA.camera_objects.object_dict[instance].object;

                if(camera_object){
                    const remove = camera_object.delete;
                    const projection = camera_object.projection;
                    const icon = camera_object.icon;

                    if(remove) if(remove.hovered && id === "camera-remove") remove.end_event();
                    if(projection) if(projection.hovered && id === "camera-proj") projection.end_event();
                    if(icon) if(icon.hovered && id === "camera-icon") icon.end_event();
                }
            }
            
            if(id === "main-menu-divider") if(svg_main_menu_divider_line_drag) svg_main_menu_divider_line_drag.event_out();
            if(undo) if(undo.hovered && id !== "undo") undo.end_event();
            if(redo) if(redo.hovered && id !== "redo") redo.end_event();   
        });
        
        main_menu.addEventListener("touchstart",(event)=>{
            const elem = event.target as Element;
            const full_id = elem.id.split("_");
            const id = full_id[0];

            if(id === "point") if(_Point) if(!_Point.hovered) _Point.start_event();
            if(id === "line") if(_Line) if(!_Line.hovered) _Line.start_event();
            if(id === "polygon") if(_Polygon) if(!_Polygon.hovered)_Polygon.start_event();
            if(id === "rectangle") if(_Rectangle) if(!_Rectangle.hovered) _Rectangle.start_event();
            if(id === "ellipse") if(_Ellipse) if(!_Ellipse.hovered) _Ellipse.start_event();
            if(id === "circle") if(_Circle) if(!_Circle.hovered) _Circle.start_event();
            if(id === "pyramid") if(_Pyramid) if(!_Pyramid.hovered) _Pyramid.start_event();
            if(id === "cone") if(_Cone) if(!_Cone.hovered) _Cone.start_event();
            if(id === "prism") if(_Prism) if(!_Prism.hovered) _Prism.start_event();
            if(id === "cylinder") if(_Cylinder) if(!_Cylinder.hovered) _Cylinder.start_event();
            if(id === "cuboid") if(_Cuboid) if(!_Cuboid.hovered) _Cuboid.start_event();
            if(id === "sphere") if(_Sphere) if(!_Sphere.hovered) _Sphere.start_event();
            if(id === "torus") if(_Torus) if(!_Torus.hovered) _Torus.start_event();

            if(id === "gen-proj") if(general_projection) if(!general_projection.hovered) general_projection.start_event();
            if(id === "cross") if(cross_indicator) if(!cross_indicator.hovered) cross_indicator.start_event();

            if(id === "camera-remove"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    const remove =_CAMERA.camera_objects.object_dict[instance].object.delete;

                    if(remove) if(!remove.hovered) remove.start_event();
                }
            }

            if(id === "camera-proj"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    const projection = _CAMERA.camera_objects.object_dict[instance].object.projection;

                    if(projection) if(!projection.hovered) projection.start_event();
                }
            }

            if(id === "camera-icon"){
                if(camera_indicator){
                    const instance = Number(full_id[1]);
                    const icon =_CAMERA.camera_objects.object_dict[instance].object.icon;

                    if(icon) if(!icon.hovered) icon.start_event();
                }
            }

            if(id === "camera-para"){}
            
            if(id === "main-menu-divider") if(svg_main_menu_divider_line_drag) svg_main_menu_divider_line_drag.event_in(); 
            if(id === "undo") if(undo) if(!undo.hovered) undo.start_event();
            if(id === "redo") if(redo) if(!redo.hovered) redo.start_event();
        },{"passive":true});

        main_menu.addEventListener("touchend",(event)=>{
            const elem = event.target as Element;
            const full_id = elem.id.split("_");
            const id = full_id[0];

            if(_Point) if(_Point.hovered && id === "point") _Point.end_event();
            if(_Line) if(_Line.hovered && id === "line") _Line.end_event();
            if(_Polygon) if(_Polygon.hovered && id === "polygon") _Polygon.end_event();
            if(_Rectangle) if(_Rectangle.hovered && id === "rectangle") _Rectangle.end_event();
            if(_Ellipse) if(_Ellipse.hovered && id === "ellipse") _Ellipse.end_event();
            if(_Circle) if(_Circle.hovered && id === "circle") _Circle.end_event();
            if(_Pyramid) if(_Pyramid.hovered && id === "pyramid") _Pyramid.end_event();
            if(_Cone) if(_Cone.hovered && id === "cone") _Cone.end_event();
            if(_Prism) if(_Prism.hovered && id === "prism") _Prism.end_event();
            if(_Cylinder) if(_Cylinder.hovered && id === "cylinder") _Cylinder.end_event();
            if(_Cuboid) if(_Cuboid.hovered && id === "cuboid") _Cuboid.end_event();
            if(_Sphere) if(_Sphere.hovered && id === "sphere") _Sphere.end_event();
            if(_Torus) if(_Torus.hovered && id === "torus") _Torus.end_event();

            if(general_projection) if(general_projection.hovered && id !== "gen-proj") general_projection.end_event();
            if(cross_indicator) if(cross_indicator.hovered && id !== "cross") cross_indicator.end_event();

            if(camera_indicator){
                const instance = Number(full_id[1]);
                const camera_object = _CAMERA.camera_objects.object_dict[instance].object;

                if(camera_object){
                    const remove = camera_object.delete;
                    const projection = camera_object.projection;
                    const icon = camera_object.icon;

                    if(remove) if(remove.hovered && id === "camera-remove") remove.end_event();
                    if(projection) if(projection.hovered && id === "camera-proj") projection.end_event();
                    if(icon) if(icon.hovered && id === "camera-icon") icon.end_event();
                }
            }
            
            if(id === "main-menu-divider") if(svg_main_menu_divider_line_drag) svg_main_menu_divider_line_drag.event_out(); 
            if(undo) if(undo.hovered && id !== "undo") undo.end_event();
            if(redo) if(redo.hovered && id !== "redo") redo.end_event();
        },{"passive":true});
    }

    displayMouseTouchEvent(elem : HTMLLIElement) {
        if(isTouchDevice === true) {
            if(svg_canvas_main_menu) {
                svg_canvas_main_menu.remove();
                svg_canvas_main_menu = undefined;
                svg_canvas_main_menu_line_drag = undefined;
            }

            elem.innerHTML = "Touch";
        }
        else {
            svg_canvas_main_menu = new CreateSVG(svg_container,"10",`${main_menu_height}`,"main_menu_line_drag",1);
            svg_canvas_main_menu_line_drag = new CreateSVGLineDrag(svg_canvas_main_menu,"0","0","0",`${main_menu_height}`,svg_vert_bar_color,"14",svg_hover_color);
            svg_canvas_main_menu_line_drag.dragFunction(canvas_main_menu_drag_function);
            svg_canvas_main_menu_line_drag.changeAcceleration(10);

            elem.innerHTML = "Mouse";
        }

        basicDrawFunction(true);
    }

    setGlobalAlpha(alpha: number) {
        MODIFIED_PARAMS._GLOBAL_ALPHA = alpha;
    }

    setCanvasOpacity(opacity: string) {
        MODIFIED_PARAMS._CANVAS_OPACITY = opacity;
    }

    setCanvas(): void {
        // Canvas and sidebar

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

    unhoverState(elem: HTMLLIElement) {
        if(elem.id === main_nav.id) return;
        if(elem.id !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = elem_col;
        }
    }

    hoverState(elem: HTMLLIElement) {
        if(elem.id === main_nav.id) return;
        if(elem.id !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = elem_hover_col;
        }
    }

    modifyState(elem: HTMLLIElement,first = false) {
        if(elem.id === main_nav.id) return;
        if(elem.id !== MODIFIED_PARAMS._ACTIVE) {
            MODIFIED_PARAMS._ACTIVE = elem.id;
            elem.style.backgroundColor = elem_active_col;
            if(first === false) this._last_active.style.backgroundColor = elem_col;
            this._last_active = elem;
            sendMessage(elem.id);
        }
    }
}

class CreateSVG {
    svg: SVGSVGElement;
    svg_ns: string;
    max_child_elem_count: number;
    container_: HTMLElement;
    id_ : string;

    constructor (container: HTMLElement,width: string,height: string,id:string,max_child_element_count = 1) {
        this.max_child_elem_count = max_child_element_count;
        this.container_ = container;
        this.id_ = id;
        this.init(width,height);
    }

    init(width: string,height: string) {
        const svgNS = "http://www.w3.org/2000/svg";
        const _svg = document.createElementNS(svgNS,"svg");
        this.svg = _svg;
        this.svg_ns = svgNS;

        _svg.setAttribute("width",width);
        _svg.setAttribute("height",height);
        _svg.id = `${this.id_}_svg`;

        this.container_.appendChild(_svg);
    }

    remove() {
        if(this.container_.hasChildNodes()) this.container_.removeChild(this.svg);
    }

    event_in(){};
    event_out(){};
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
        _path.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.path = _path;

        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) svg_class.svg.appendChild(this.path);
    }

    event_in(){
        if(this.hover_fill_) this.path.setAttribute("fill",this.hover_color_);
        this.path.setAttribute("stroke",this.hover_color_);
    }

    event_out(){
        if(this.hover_fill_) this.path.setAttribute("fill",this.fill_);
        this.path.setAttribute("stroke",this.stroke_);
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
        this.line_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;

        _line.setAttribute("x1",x1);
        _line.setAttribute("y1",y1);
        _line.setAttribute("x2",x2);
        _line.setAttribute("y2",y2);
        _line.setAttribute("stroke",stroke);
        _line.setAttribute("stroke-width",strokeWidth);
        _line.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.line = _line;

        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) svg_class.svg.appendChild(_line);
    }

    event_in(){
        this.line.setAttribute("stroke",this.hover_color_);
    }

    event_out(){
        this.line.setAttribute("stroke",this.stroke_);
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
        _circle.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.circle = _circle;


        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) svg_class.svg.appendChild(_circle);
    }

    event_in(){
        if(this.hover_fill_) this.circle.setAttribute("fill",this.hover_color_);
        this.circle.setAttribute("stroke",this.hover_color_);
    }

    event_out(){
        if(this.hover_fill_) this.circle.setAttribute("fill",this.fill_);
        this.circle.setAttribute("stroke",this.stroke_);
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
        _ellipse.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.ellipse = _ellipse;


        if(svg_class.svg.childElementCount < svg_class.max_child_elem_count) svg_class.svg.appendChild(_ellipse);
    }

    event_in(){
        if(this.hover_fill_) this.ellipse.setAttribute("fill",this.hover_color_);
        this.ellipse.setAttribute("stroke",this.hover_color_);
    }

    event_out(){
        if(this.hover_fill_) this.ellipse.setAttribute("fill",this.fill_);
        this.ellipse.setAttribute("stroke",this.stroke_);
    }
}

class CreateSVGLineDrag extends CreateSVGLine {
    implement_drag: IMPL_DRAG_;

    constructor (svg_class: CreateSVG,x1: string,y1: string,x2: string,y2: string,stroke: string,strokeWidth: string,hover_color: string,custom_event_listeners = false) {
        super(svg_class,x1,y1,x2,y2,stroke,strokeWidth,hover_color);

        if(custom_event_listeners){
            this.svg_class_.svg.addEventListener("mouseenter",()=>{this.event_in()});  
            this.svg_class_.svg.addEventListener("mouseleave",()=>{this.event_out()}); 
            this.svg_class_.svg.addEventListener("touchstart",()=>{this.event_in()},{"passive":true}); 
            this.svg_class_.svg.addEventListener("touchend",()=>{this.event_out()},{"passive":true});    
        }
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
    hovered : boolean;

    constructor (svg_class: CreateSVG, d_1: string,d_2: string,stroke: string,strokeWidth: string,hover_color: string,fill = "none",hover_fill = false) {
        this.svg_class_ = svg_class;
        this.hovered = false;
        this.path_1 = new CreateSVGPath(svg_class, d_1, stroke, strokeWidth, hover_color, fill, hover_fill);
        this.path_2 = new CreateSVGPath(svg_class, d_2, stroke, strokeWidth, hover_color, fill, hover_fill)
    }

    start_event(){
        this.path_1.event_in();
        this.path_2.event_in();
        this.hovered = true;
    }

    end_event(){
        this.path_1.event_out();
        this.path_2.event_out();
        this.hovered = false;
    }
}

class CreateSVGCameraExperimental {
    svg_class_: CreateSVG;
    path_1: CreateSVGPath;
    path_2: CreateSVGPath;

    constructor (svg_class: CreateSVG,d_1: string,d_2: string,stroke: string,strokeWidth: string,hover_color: string,fill = "none",hover_fill = false) {
        this.svg_class_ = svg_class;
        // this.path_1 = new CreateSVGPath(svg_class, d_1, stroke, strokeWidth, hover_color, fill, hover_fill);
        // this.path_2 = new CreateSVGPath(svg_class, d_2, stroke, strokeWidth, hover_color, fill, hover_fill);

        const p_1_proc = d_1.split(",");
        const p_2_proc = d_2.split(",");

        for(const index in p_1_proc){
            if(Number(index) === 4) break;
            let inc = 0;
            if(Number(index) > 0) inc = 1;
            console.log(p_1_proc[index],"***********")

            const elems_1 = p_1_proc[index].split(" ");
            const elems_2 = p_2_proc[index].split(" ");

            const [x1, y1, x2, y2] = [elems_1[1+inc], elems_1[2+inc], elems_2[1+inc], elems_2[2+inc]]
            new CreateSVGLine(svg_class, `${x1}`,`${y1}`,`${x2}`,`${y2}`, stroke, strokeWidth, hover_color);
            new CreateSVGLine(svg_class, `${x1}`,`${x2}`,`${y1}`,`${y2}`, stroke, strokeWidth, hover_color);

            console.log(x1,y1,x2,y2,"#########", elems_1, elems_2);
        }
    }

    // clickFunction(instance : number,func: (instance_number_input : number) => void) {
    //     this.svg_class_.svg.addEventListener("click",()=>{func(instance)});
    // }
}

class CreateSVGCameraIcon{
    path : CreateSVGPath;
    hovered : boolean;
    constructor(svg_class: CreateSVG,stroke: string,strokeWidth: string,hover_color: string,fill = "none",hover_fill = false){
        this.hovered = false;
        const path_string = "M 18 4, L 12 10, L 12 3, L 1 1, L 1 19, L 12 17, L 12 10, L 18 16";
        this.path = new CreateSVGPath(svg_class, path_string, stroke, svg_objects_strokeWidth, svg_hover_color, fill, hover_fill);
    }

    start_event(){
        this.path.event_in();
        this.hovered = true;
    }

    end_event(){
        this.path.event_out();
        this.hovered = false;
    }

    // clickFunction(instance : number,func: (instance_number_input : number) => void) {
    //     this.svg_class_.svg.addEventListener("click",()=>{func(instance)});
    // }
}

class CreateSVGCameraProjection{
    svg_class_: CreateSVG;
    path_1: CreateSVGPath;
    path_2: CreateSVGPath;
    lines : CreateSVGLine[];
    hovered : boolean;

    constructor (svg_class: CreateSVG,d_1: string,d_2: string,stroke: string,strokeWidth: string,hover_color: string,fill = "none",hover_fill = false) {
        this.svg_class_ = svg_class;
        this.hovered = false;
        this.path_1 = new CreateSVGPath(svg_class, d_1, stroke, strokeWidth, hover_color, fill, hover_fill);
        this.path_2 = new CreateSVGPath(svg_class, d_2, stroke, strokeWidth, hover_color, fill, hover_fill);
        this.lines = [];
        const p_1_proc = d_1.split(",");
        const p_2_proc = d_2.split(",");

        for(const index in p_1_proc){
            if(Number(index) === 4) break;
            let inc = 0;
            if(Number(index) > 0) inc = 1;
    
            const elems_1 = p_1_proc[index].split(" ");
            const elems_2 = p_2_proc[index].split(" ");
            const [x1, y1, x2, y2] = [elems_1[1+inc], elems_1[2+inc], elems_2[1+inc], elems_2[2+inc]];
            this.lines.push(new CreateSVGLine(svg_class, `${x1}`,`${y1}`,`${x2}`,`${y2}`, stroke, strokeWidth, hover_color));
        }
    }

    start_event(){
        for(const line of this.lines) line.event_in();
        this.path_1.event_in();
        this.path_2.event_in();
        this.hovered = true;
    }

    end_event(){
        for(const line of this.lines) line.event_out();
        this.path_1.event_out();
        this.path_2.event_out();
        this.hovered = false;
    }

    remove(){
        this.svg_class_.svg.removeChild(this.path_1.path);
        this.svg_class_.svg.removeChild(this.path_2.path);
        for(const line of this.lines){
            this.svg_class_.svg.removeChild(line.line);
        }
    }
}


class SVG_Indicator {
    svg_class: CreateSVG;
    tooltip_class: CreateToolTip;
    svg_container: HTMLDivElement;
    svg_sub_container : HTMLDivElement;
    tooltip_container: HTMLDivElement;
    hovered : boolean;

    constructor (container: HTMLDivElement,id :string, max_child_elem_count: number,tooltip_text = "Generic",respect_animate = true) {
        const sub_container = document.createElement("div");
        sub_container.style.margin = "10px";
        this.svg_sub_container = document.createElement("div");
        sub_container.appendChild(this.svg_sub_container);
        container.appendChild(sub_container);
        this.svg_class = new CreateSVG(this.svg_sub_container,"20","20",id,max_child_elem_count);
        this.tooltip_class = new CreateToolTip(container,sub_container,tooltip_text,5,100,respect_animate);
        this.svg_container = sub_container;
        this.tooltip_container = container;
        this.svg_container = sub_container;
        this.hovered = false;
    }
}

class Other_SVG_Indicator extends SVG_Indicator {
    constructor (container: HTMLDivElement,id:string,max_child_elem_count: number,tooltip_text = "Generic",hori_pos_ = "right_10px", vert_pos_ = "top_0px",tooltip_position: _TOOLTIP_POSITION_ = "left") {
        super(container,id,max_child_elem_count,tooltip_text,true);
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

class CreateCameraProjection_SVG_Indicator extends Other_SVG_Indicator{
    projection : CreateSVGCameraProjection | undefined;
    constructor (container: HTMLDivElement,id: string,hori_pos = "right_40px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,id,6,"",hori_pos,vert_pos,tooltip_postition);
        this.tooltip_class.tooltip_text_elem.innerHTML = `${MODIFIED_PARAMS._PROJ_TYPE}`;
        this.projection = undefined;
        this.loadCameraIcon();
    }

    loadCameraIcon(){
        this.tooltip_class.tooltip_text_elem.innerHTML = `${MODIFIED_PARAMS._PROJ_TYPE}`;
        if (MODIFIED_PARAMS._PROJ_TYPE === "Orthographic"){
            this.projection = new CreateSVGCameraProjection(this.svg_class,"M 7 2, L 18 2, L 18 12, L 7 12, Z","M 2 8, L 13 8, L 13 18, L 2 18, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
        }
        else if(MODIFIED_PARAMS._PROJ_TYPE === "Perspective"){
            this.projection = new CreateSVGCameraProjection(this.svg_class,"M 9 3, L 17 3, L 17 10, L 9 10, Z","M 1 8, L 13 8, L 13 19, L 1 19, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
        }
    }

    remove(){
        if(this.projection) this.projection.remove();
    }

    start_event(){
        if(this.projection) {
            this.projection.start_event();
            this.tooltip_class.call_function_in();
            this.hovered = true;
        }
    }

    end_event(){
        if(this.projection) this.projection.end_event();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}

class CreateCross_SVG_Indicator extends Other_SVG_Indicator {
    line_1 : CreateSVGLine;
    line_2 : CreateSVGLine;
    constructor (container: HTMLDivElement,id: string,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,id,2,text,hori_pos,vert_pos,tooltip_postition);
        this.line_1 = new CreateSVGLine(this.svg_class,"1","10","19","10",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
        this.line_2 = new CreateSVGLine(this.svg_class,"10","1","10","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
    }

    start_event(){
        this.line_1.event_in();
        this.line_2.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }

    end_event(){
        this.line_1.event_out();
        this.line_2.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}

class CreateUndo_SVG_Indicator extends Other_SVG_Indicator{
    paths : CreateSVGPath[];
    constructor (container: HTMLDivElement,id: string,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,id,3,text,hori_pos,vert_pos,tooltip_postition);
        const svg_helper = new CreateSVGHelper();
        this.paths = [];

        const outer_curved_path = svg_helper.generateSVGArc(10,10,14,12,20,0,180,"Z");
        this.paths.push(new CreateSVGPath(this.svg_class,outer_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true));

        const inner_curved_path = svg_helper.generateSVGArc(7,10,14,12,20,0,180,"Z");
        this.paths.push(new CreateSVGPath(this.svg_class,inner_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false));

        this.paths.push(new CreateSVGPath(this.svg_class,"M 2 4, L 8 6, L 8 2, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true));
    }

    start_event(){
        for(const path of this.paths) path.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }

    end_event(){
        for(const path of this.paths) path.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }

    // clickFunction(func: () => void) {
    //     this.svg_container.addEventListener("click",func);
    // }
}

class CreateRedo_SVG_Indicator extends Other_SVG_Indicator{
    paths : CreateSVGPath[];
    constructor (container: HTMLDivElement,id: string,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
        super(container,id,3,text,hori_pos,vert_pos,tooltip_postition);
        const svg_helper = new CreateSVGHelper();
        this.paths = [];

        const outer_curved_path = svg_helper.generateSVGArc(10,10,14,12,20,180,180,"Z");
        this.paths.push(new CreateSVGPath(this.svg_class,outer_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true));

        const inner_curved_path = svg_helper.generateSVGArc(13,10,14,12,20,180,180,"Z");
        this.paths.push(new CreateSVGPath(this.svg_class,inner_curved_path,svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false));

        this.paths.push(new CreateSVGPath(this.svg_class,"M 18 4, L 12 6, L 12 2, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color,true));
    }

    start_event(){
        for(const path of this.paths) path.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }

    end_event(){
        for(const path of this.paths) path.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }

    // clickFunction(func: () => void) {
    //     this.svg_container.addEventListener("click",func);
    // }
}

class CreateDelete_SVG_Indicator extends Other_SVG_Indicator{
    paths : CreateSVGPath[];
    lines : CreateSVGLine[];

    constructor (container: HTMLDivElement,id: string,text: string,hori_pos = "right_10px", vert_pos = "top_0px",tooltip_postition: _TOOLTIP_POSITION_ = "left") {
    super(container,id,8,text,hori_pos,vert_pos,tooltip_postition);
        this.paths.push(new CreateSVGPath(this.svg_class,"M 3 5, L 4 3, L 7 3, L 9 1, L 11 1, L 13 3, L 16 3, L 17 5",svg_objects_color,svg_objects_strokeWidth,svg_hover_color, svg_objects_color, true));
        this.paths.push(new CreateSVGPath(this.svg_class,"M 3 7, L 5 19, L 15 19, L 17 7",svg_objects_color,svg_objects_strokeWidth,svg_hover_color, svg_objects_color, true));

        this.lines.push(new CreateSVGLine(this.svg_class,"7.5","9","7.5","16",svg_vert_bar_color,svg_objects_strokeWidth,elem_col));
        this.lines.push(new CreateSVGLine(this.svg_class,"12.5","9","12.5","16",svg_vert_bar_color,svg_objects_strokeWidth,elem_col));
    }

    start_event(){
        for(const path of this.paths) path.event_in();
        for(const line of this.lines) line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }

    end_event(){
        for(const path of this.paths) path.event_out();
        for(const line of this.lines) line.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
    
    // clickFunction(func: () => void) {
    //     this.svg_container.addEventListener("click",func);
    // }
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

class CreateSubMenuContent{
    sub_menu_container : HTMLDivElement;
    instance_para : HTMLParagraphElement;
    input_form : CreateForm;

    constructor(container : HTMLDivElement){
        this.sub_menu_container = document.createElement("div");
        this.sub_menu_container.style.margin = "40px 0 0 10px";
        container.appendChild(this.sub_menu_container);

        this.instance_para = document.createElement("p");
        this.sub_menu_container.appendChild(this.instance_para);

        this.input_form = new CreateForm(container, main_menu_width);
    }
}

class CreateForm{
    form : HTMLFormElement;
    container : HTMLDivElement;
    width : number;
    constructor(container_ : HTMLDivElement, width : number){
        this.container = container_;
        this.form = document.createElement("form");
        this.form.style.margin = "10px";
        this.container.appendChild(this.form);
        this.width = width;
    }
}

class CreateInputField{
    form_class : CreateForm;
    input : HTMLInputElement;
    label : HTMLLabelElement;
    constructor(form_class : CreateForm,type = "text",textContent = type, id_ = _Miscellanous.getRanHex(16)){
        this.form_class = form_class;
        const form = this.form_class.form;
        const clear_fix_div = document.createElement("div");
        clear_fix_div.style.overflow = "auto";

        this.label = document.createElement("label");
        this.label.setAttribute("for",id_);
        this.label.className = "sub_menu_label";
        this.label.textContent = textContent;
        this.label.style.float = "left";       

        this.input = document.createElement("input");
        this.input.type = type;
        this.input.id = id_;
        this.input.className = "sub_menu_input";
        this.input.style.float = "right";

        clear_fix_div.appendChild(this.label);
        clear_fix_div.appendChild(this.input);
        form.appendChild(clear_fix_div);
    }
}

class CreateXYZInputField{
    form_class : CreateForm;
    para : HTMLParagraphElement;
    labelX : HTMLLabelElement;
    inputX : HTMLInputElement;
    labelY : HTMLLabelElement;
    inputY : HTMLInputElement;
    labelZ : HTMLLabelElement;
    inputZ : HTMLInputElement;
    constructor(form_class : CreateForm,textContent = "Number x_y_z", instance : number){
        this.form_class = form_class;
        const form = this.form_class.form;
        const clear_fix_div = document.createElement("div");
        clear_fix_div.style.overflow = "auto";

        this.para = document.createElement("p");
        this.para.className = "sub_menu_xyz_para";
        this.para.textContent = textContent;
        this.para.style.float = "left";

        this.labelX = document.createElement("label");
        this.labelX.setAttribute("for", `${instance}_x`);
        this.labelX.textContent = textContent + "X : ";
        this.labelX.style.float = "right";
        this.labelX.style.width = "10px";

        this.inputX = document.createElement("input");
        this.inputX.type = "number";
        this.inputX.id = `${instance}_x`;
        this.inputX.className = "sub_menu_xyz_input";
        this.inputX.style.float = "right";

        this.labelY = document.createElement("label");
        this.labelY.setAttribute("for", `${instance}_y`);
        this.labelY.className = "sub_menu_label";
        this.labelY.textContent = textContent + " Y : ";
        this.labelY.style.float = "right";
        this.labelY.style.width = "10px";   

        this.inputY = document.createElement("input");
        this.inputY.type = "number";
        this.inputY.id = `${instance}_y`;
        this.inputY.className = "sub_menu_xyz_input";
        this.inputY.style.float = "right";

        this.labelZ = document.createElement("label");
        this.labelZ.setAttribute("for", `${instance}_z`);
        this.labelZ.className = "sub_menu_label";
        this.labelZ.textContent = textContent + " Z : ";
        this.labelZ.style.float = "right";       
        this.labelZ.style.width = "10px";

        this.inputZ = document.createElement("input");
        this.inputZ.type = "number";
        this.inputZ.id = `${instance}_z`;
        this.inputZ.className = "sub_menu_xyz_input";
        this.inputZ.style.float = "right";

        clear_fix_div.appendChild(this.para);
        clear_fix_div.appendChild(this.inputZ);
        clear_fix_div.appendChild(this.labelZ);
        clear_fix_div.appendChild(this.inputY);
        clear_fix_div.appendChild(this.labelY);
        clear_fix_div.appendChild(this.inputX);
        clear_fix_div.appendChild(this.labelX);
        form.appendChild(clear_fix_div);
    }
}

class CreateToolTip {
    tooltip_container_elem: HTMLElement;
    tooltip_elem: HTMLElement;
    tooltip_text_elem: HTMLSpanElement;
    tooltip_text_elem_id: string;
    vert_padding: number;
    width: number;
    tooltip_text_elem_orientation = "default";
    respect_anim : boolean;
    default_positioning: { top: string,bottom: string,left: string,right: string,marginLeft: string };
    call_func : () => void;
    constructor (tooltip_container: HTMLDivElement,tooltip: HTMLElement,tooltip_text: string,vert_padding = 5,width: number,respect_animate = true) {
        this.tooltip_container_elem = tooltip_container;

        tooltip.style.position = "relative";
        tooltip.style.display = "inline-block";
        this.tooltip_elem = tooltip;

        this.tooltip_text_elem = document.createElement("span");
        this.tooltip_text_elem.style.position = "absolute";
        this.tooltip_text_elem.style.visibility = "hidden";
        this.tooltip_text_elem.innerHTML = tooltip_text;
        this.tooltip_text_elem.style.backgroundColor = svg_objects_color;
        this.tooltip_text_elem.style.textAlign = "center";
        this.tooltip_text_elem.style.width = `${width}px`;
        this.tooltip_text_elem.style.zIndex = `${Number(window.getComputedStyle(tooltip).zIndex) + 10}`;
        this.tooltip_text_elem.style.borderRadius = "5px";
        this.tooltip_text_elem.style.padding = `${vert_padding}px 0`;
        this.vert_padding = vert_padding;

        this.width = width;
        
        this.default_positioning = {
            top: window.getComputedStyle(this.tooltip_text_elem).top,
            bottom: window.getComputedStyle(this.tooltip_text_elem).bottom,
            left: window.getComputedStyle(this.tooltip_text_elem).left,
            right: window.getComputedStyle(this.tooltip_text_elem).right,
            marginLeft: window.getComputedStyle(this.tooltip_text_elem).marginLeft,
        }

        this.respect_anim = respect_animate;
        tooltip.appendChild(this.tooltip_text_elem);
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
        this.tooltip_text_elem_orientation = "left";
        this.tooltip_text_elem.className = "tooltiptext_left";

        this.call_func = () => {};
    }

    right_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
        this.tooltip_text_elem.style.left = "105%";
        this.tooltip_text_elem_orientation = "right";
        this.tooltip_text_elem.className = "tooltiptext_right";

        this.call_func = () => {};
    }

    top_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.bottom = "100%";
        this.tooltip_text_elem.style.left = "50%";
        this.tooltip_text_elem.className = "tooltiptext_top";
        this.tooltip_text_elem.style.margin = "5px 0";

        this.call_func = () => {
            const half_width = this.width / 2;
            const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
            const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
            this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
            root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
        };
    }

    bottom_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.top = "100%";
        this.tooltip_text_elem.style.left = "50%";
        this.tooltip_text_elem.className = "tooltiptext_bottom";
        this.tooltip_text_elem.style.margin = "5px 0";

        this.call_func = () => {      
            const half_width = this.width / 2;
            const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
            const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
            this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
            root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
        }
    }

    vertical_tooltip_helper(half_width: number,container_width: number): _VERT_TOOLTIP_HELPER_ {
        const tooltip_margin_right = Number(window.getComputedStyle(this.tooltip_elem).marginRight.split("px")[0]);
        const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
        const after = half_width > (container_width - this.tooltip_elem.offsetLeft - tooltip_margin_right) ? half_width - tooltip_margin_right : 0;
        return { before: before,after: after };
    }

    call_function_in(){
        this.call_func();

        if(!isTouchDevice && (main_menu_animate || !this.respect_anim)) this.tooltip_text_elem.style.visibility = "visible";
        if(isTouchDevice && (main_menu_animate || !this.respect_anim)) this.tooltip_text_elem.style.visibility = "visible";
    }

    call_function_out(){
        if(!isTouchDevice && (main_menu_animate || !this.respect_anim)) this.tooltip_text_elem.style.visibility = "hidden";
        if(isTouchDevice && (main_menu_animate || !this.respect_anim)) this.tooltip_text_elem.style.visibility = "hidden";
    }
}

class ShapeClick{
    shape : string;
    constructor(){
        this.shape = "";
    }
    
    shape_click (shape : string){
        this.shape = shape;
        let ret_object : CreateMeshObject | null;

        switch (this.shape){
            case "point" :
                ret_object = new CreatePoint();
                break;
            case "line" :
                ret_object = new CreateLine();
                break;
            case "polygon" : 
                ret_object = new CreatePolygon();
                break;
            case "rectangle" : 
                ret_object = new  CreateRectangle();
                break;
            case "ellipse" : 
                ret_object = new CreateEllipse();
                break;
            case "circle" : 
                ret_object = new CreateCircle();
                break;
            case "pyramid" : 
                ret_object = new CreatePyramid();
                break;
            case "cone" : 
                ret_object = new CreateCone();
                break;
            case "prism" : 
                ret_object = new CreatePrism();
                break;
            case "cylinder" : 
                ret_object = new CreateCylinder();
                break;
            case "cuboid" : 
                ret_object = new CreateCuboid();
                break;
            case "sphere" :
                ret_object = new CreateSphere();
                break;
            case "torus" : 
                ret_object = new CreateTorus();
                break;
            default : ret_object = null;
        }
            
        if (ret_object){
            console.log(_ObjectRendering.instance,"###################")
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(ret_object);
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        }
    }
}

class DrawCanvas {
    protected static drawCount = 0;
    constructor () {
        this.drawCanvas();

        window.addEventListener("orientationchange",() => {
            const href = window.location.href;
            window.location.assign(href);
        });

        window.addEventListener("resize",() => {
                const _last = window.innerWidth > MODIFIED_PARAMS._LAST_CANVAS_WIDTH;
                const _last_helper = window.innerWidth > (MODIFIED_PARAMS._LAST_CANVAS_WIDTH + 15 + MODIFIED_PARAMS._SIDE_BAR_WIDTH);
                const _last_modifier = MODIFIED_PARAMS._CANVAS_WIDTH - MODIFIED_PARAMS._LAST_CANVAS_WIDTH >= 0;
                const modify_side_width = DEFAULT_PARAMS._SIDE_BAR_WIDTH < window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH;
                const process_modify = (((modify_side_width || _last_helper) && _last) && _last_modifier);

                MODIFIED_PARAMS._SIDE_BAR_WIDTH = process_modify ? window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH : DEFAULT_PARAMS._SIDE_BAR_WIDTH;
                MODIFIED_PARAMS._CANVAS_WIDTH = process_modify ? MODIFIED_PARAMS._CANVAS_WIDTH : Math.max(DEFAULT_PARAMS._CANVAS_WIDTH,window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15);
                MODIFIED_PARAMS._CANVAS_HEIGHT = Math.abs(window.innerHeight - 50 - nav_height);
                main_nav.style.width = `${window.innerWidth - 15}px`;
                this.drawCanvas(false);
        });
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


        svg_canvas_main_menu = new CreateSVG(svg_container,"10",`${main_menu_height}`,"main_menu_line_drag",1);
        svg_canvas_main_menu_line_drag = new CreateSVGLineDrag(svg_canvas_main_menu,"0","0","0",`${main_menu_height}`,svg_vert_bar_color,"14",svg_hover_color,true);
        svg_canvas_main_menu_line_drag.dragFunction(canvas_main_menu_drag_function);
        svg_canvas_main_menu_line_drag.changeAcceleration(10);

        basicDrawFunction(set_last_canvas_width);

        DrawCanvas.drawCount++;

        // console.log("Screen Orientation : ",screen.orientation)
        // console.log("Color Depth : ",screen.colorDepth)
        // console.log("Pixel Depth : ", screen.pixelDepth)
        // console.log("Available Screen Width : ", screen.availWidth)
        // console.log("Available Screen Height : ",screen.availHeight)
        // console.log("Screen Width : ",screen.width)
        // console.log("Screen Height : ", screen.height)
        // console.log("Inner Window Width : ",window.innerWidth)
        // console.log("Inner Window Height : ",window.innerHeight)
        // console.log("Outer Window Width : ",window.outerWidth)
        // console.log("Outer Window Height : ",window.outerHeight)
        // console.log("nav height : ",nav_height, "nav width : ", Number(window.getComputedStyle(main_nav).width.split("px")[0]))

        // console.log(window.location.href)
    }
}

const _ShapeClick = new ShapeClick();
// From math_lib.ts/mathlib.js file
const _PROJ: Projection = new Projection();
const _CAMERA: CameraObjects = new CameraObjects();
const _Quarternion = new Quarternion();

window.addEventListener("load",()=>{
    new BasicSettings();
    new DrawCanvas();

    console.log(MODIFIED_PARAMS)
})

/* Parameters */

let _Point : CreatePoint_SVG_Indicator | null = null;
let _Line : CreateLine_SVG_Indicator | null = null;
let _Polygon : CreatePolygon_SVG_Indicator | null = null;
let _Rectangle : CreateRectangle_SVG_Indicator | null = null;
let _Ellipse : CreateEllipse_SVG_Indicator | null = null;
let _Circle : CreateCircle_SVG_Indicator | null = null;
let _Pyramid : CreatePyramid_SVG_Indicator | null = null;
let _Cone :  CreateCone_SVG_Indicator | null = null;
let _Prism : CreatePrism_SVG_Indicator | null = null;
let _Cylinder : CreateCylinder_SVG_Indicator | null = null;
let _Cuboid : CreateCuboid_SVG_Indicator | null = null;
let _Sphere : CreateSphere_SVG_Indicator | null = null;
let _Torus : CreateTorus_SVG_Indicator | null = null;

let mesh_sample_container_div : HTMLDivElement | null = null;
let general_projection : CreateCameraProjection_SVG_Indicator | null = null;
let cross_indicator : CreateCross_SVG_Indicator | null = null;
let undo : CreateUndo_SVG_Indicator | null = null;
let redo : CreateRedo_SVG_Indicator | null = null;
let camera_indicator : CameraIndicator | null = null;
