"use strict";
const pListCache = {};
const pArgCache = {};
const genBackgroundColor = "#888";
const root = document.querySelector(":root");
const nav = document.getElementsByTagName("nav")[0];
const main_nav = document.getElementById("main_nav");
// const click_elem = document.getElementById
main_nav.style.width = `${window.innerWidth - 15}px`;
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const svg_container = document.getElementById("container");
const main_menu = document.getElementById("main");
var main_menu_animate = true;
const stats = document.getElementById("status");
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
const c_m_h_with_cross_hairs = document.getElementsByClassName("with_cross_hairs");
const camera_divs = document.getElementsByClassName("camera_div");
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
var sub_menu = undefined;
var create_main_menu_divider = false;
let svg_main_menu_divider = undefined;
let svg_main_menu_divider_line_drag = undefined;
let svg_main_menu_divider_top = Math.min(-100, -window.innerHeight / 3);
var Nav_list;
(function (Nav_list) {
    Nav_list["Editing"] = "Editing";
    Nav_list["Animation"] = "Animation";
    Nav_list["Sculpting"] = "Sculpting";
    Nav_list["Lighting"] = "Lighting";
    Nav_list["Rendering"] = "Rendering";
})(Nav_list || (Nav_list = {}));
const start_nav = Nav_list.Rendering;
var Handedness;
(function (Handedness) {
    Handedness[Handedness["left"] = 1] = "left";
    Handedness[Handedness["right"] = -1] = "right";
})(Handedness || (Handedness = {}));
const DEFAULT_PARAMS = {
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
    _HANDEDNESS: Handedness.left,
    _X: [1, 0, 0],
    _Y: [0, 1, 0],
    _Z: [0, 0, 1],
    _Q_VEC: [0, 1, 0],
    _Q_QUART: [1, 0, 0, 0],
    _Q_INV_QUART: [1, 0, 0, 0],
    _NZ: 0.1,
    _FZ: 600,
    _PROJ_TYPE: "Orthographic",
    _VERT_PROJ_ANGLE: 60,
    _HORI_PROJ_ANGLE: 60,
    _ASPECT_RATIO: 1,
    _HALF_X: 50,
    _HALF_Y: 50,
    _PROJECTION_MAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    _INV_PROJECTION_MAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    _GRID_VERT_THETA: 15,
    _ACTIVE: "",
    _SIDE_BAR_WIDTH: 120,
    _T_B_R_L: [0, 0, 0, 0],
    _EPSILON: 1e-10,
    _MIN_Z: -1,
    _MAX_Z: 1,
};
const MODIFIED_PARAMS = JSON.parse(JSON.stringify(DEFAULT_PARAMS));
const sendMessage = (function_name) => window.parent.postMessage(function_name);
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
    is_active;
    blob_url;
    constructor(function_script, args) {
        const worker_script = `onmessage = (e) => {
                const result = ${function_script};

                postMessage(result);
            }`;
        const blob = new Blob([worker_script], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        const worker = new Worker(blobURL);
        worker.postMessage(args);
    }
}
const implementDrag = function () {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, prev = 0, now = Date.now(), dt = now - prev + 1, dX = 0, dY = 0, acc = 1, call_function = (deltaX, deltaY) => { }, 
    // We invoke the local functions (changeSens and startDrag) as methods
    // of the object 'retObject' and set the return value of the local function
    // to 'retObject'
    retObject = {
        changeAcc: changeAcceleration,
        start: drag,
        acceleration: getAcceleration(),
        deltaX: dX,
        deltaY: dY,
    };
    function changeAcceleration(acceleration) {
        acc = acceleration;
    }
    function getAcceleration() {
        return acc;
    }
    function drag(element, call_func) {
        startDrag(element);
        startDragMobile(element);
        call_function = call_func;
    }
    function startDrag(element) {
        element.onmousedown = dragMouseDown;
    }
    function startDragMobile(element) {
        element.addEventListener('touchstart', dragTouchstart, { 'passive': true });
    }
    function dragMouseDown(e) {
        e = e || undefined;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = dragMouseup;
        document.onmousemove = dragMousemove;
    }
    function dragTouchstart(e) {
        e = e || undefined;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        document.addEventListener('touchend', dragTouchend, { 'passive': true });
        document.addEventListener('touchmove', dragTouchmove, { 'passive': true });
    }
    function dragMousemove(e) {
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
        call_function(dX, dY);
    }
    function dragTouchmove(e) {
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
        call_function(dX, dY);
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
};
const camera_ui_handler = () => {
    const c_len = `${_CAMERA.instance_number}`.length;
    const accom_1 = 170 + (c_len * 10);
    const accom_2 = 150 + (c_len * 10);
    for (const camera_div of camera_divs) {
        const camera_elem = camera_div.children[0];
        const camera_icon_elem = camera_div.children[3];
        if (main_menu_width >= accom_1) {
            camera_elem.style.display = "block";
            camera_icon_elem.style.display = "none";
            camera_elem.textContent = `Camera ${camera_elem.id.split("_")[1]}`;
        }
        else if (main_menu_width < accom_1 && main_menu_width >= accom_2) {
            camera_elem.style.display = "block";
            camera_icon_elem.style.display = "none";
            camera_elem.textContent = `Cam ${camera_elem.id.split("_")[1]}`;
        }
        else if (main_menu_width < accom_2) {
            camera_elem.style.display = "none";
            camera_icon_elem.style.display = "block";
        }
    }
};
const main_menu_divider_drag_function = (deltaX, deltaY) => {
    if (typeof svg_main_menu_divider === "undefined")
        return;
    if (typeof svg_main_menu_divider_line_drag === "undefined")
        return;
    svg_main_menu_divider.svg.style.position = "absolute";
    const main_menu_height = Number(window.getComputedStyle(main_menu).height.split("px")[0]);
    const _top = Number(window.getComputedStyle(svg_main_menu_divider.svg).top.split("px")[0]);
    const max_val = Math.max(100, _top + deltaY);
    const min_val = Math.min(main_menu_height - 100, max_val);
    svg_main_menu_divider.svg.style.top = `${min_val}px`;
    svg_main_menu_divider_top = min_val;
    if (typeof sub_menu === "undefined")
        return;
    sub_menu.style.top = `${svg_main_menu_divider_top + 8}px`;
    sub_menu.style.height = `${main_menu_height - svg_main_menu_divider_top - 20}px`;
    root.style.setProperty("--container-div-height", `${svg_main_menu_divider_top - 80}px`);
};
const basicDrawFunction = (set_last_canvas_width = true) => {
    canvas.width = MODIFIED_PARAMS._CANVAS_WIDTH;
    canvas.height = MODIFIED_PARAMS._CANVAS_HEIGHT;
    svg_container.style.left = `${MODIFIED_PARAMS._CANVAS_WIDTH + 20}px`;
    main_menu.style.left = `${MODIFIED_PARAMS._CANVAS_WIDTH + 30}px`;
    main_menu.style.width = `${MODIFIED_PARAMS._SIDE_BAR_WIDTH - 20}px`;
    if (set_last_canvas_width)
        MODIFIED_PARAMS._LAST_CANVAS_WIDTH = MODIFIED_PARAMS._CANVAS_WIDTH;
    // Coordinate Space
    MODIFIED_PARAMS._HALF_X = MODIFIED_PARAMS._CANVAS_WIDTH / 2;
    MODIFIED_PARAMS._HALF_Y = MODIFIED_PARAMS._CANVAS_HEIGHT / 2;
    // Perspective Projection
    MODIFIED_PARAMS._ASPECT_RATIO = MODIFIED_PARAMS._CANVAS_WIDTH / MODIFIED_PARAMS._CANVAS_HEIGHT;
    _PROJ.setProjectionParam();
    const main_menu_computed_style = window.getComputedStyle(main_menu);
    main_menu_width = Number(main_menu_computed_style.width.split("px")[0]);
    main_menu_height = Number(main_menu_computed_style.height.split("px")[0]);
    const main_menu_border_width = Number(main_menu_computed_style.borderWidth.split("px")[0]);
    if (main_menu_width > 200)
        main_menu_animate = true;
    else
        main_menu_animate = false;
    root.style.setProperty("--camera-paragraph-width", `${main_menu_width - 100}px`);
    root.style.setProperty("--custom-menu-header-width", `${main_menu_width - 100}px`);
    root.style.setProperty("--custom-sub-menu-width", `${main_menu_width - 2 * main_menu_border_width}px`);
    for (const elem of c_m_h_with_cross_hairs) {
        if (main_menu_width < 200)
            elem.style.visibility = "hidden";
        else
            elem.style.visibility = "visible";
    }
    camera_ui_handler();
    // const l_width = Math.min(Math.max((main_menu_width - 40) / 2, 30),200);
    // root.style.setProperty("--custom-sub-menu-label-width",`${l_width}px`);
    // root.style.setProperty("--custom-sub-menu-input-width",`${main_menu_width - 40 - l_width}px`);
    const l_xyz_width = Math.min(Math.max((main_menu_width - 40) / 3, 20), 150);
    root.style.setProperty("--custom-sub-menu-xyz-para-width", `${l_xyz_width}px`);
    root.style.setProperty("--custom-sub-menu-xyz-input-width", `${(main_menu_width - 70 - l_xyz_width) / 3}px`);
    if (create_main_menu_divider === true) {
        svg_main_menu_divider = new CreateSVG(main_menu, `${main_menu_width - 2 * main_menu_border_width}`, "10", "main_menu_divider_", 1);
        create_main_menu_divider = false;
    }
    if (typeof svg_main_menu_divider === "undefined")
        return;
    svg_main_menu_divider.remove();
    svg_main_menu_divider.init(main_menu, `${main_menu_width - 2 * main_menu_border_width}`, "10", "main_menu_divider_", 1);
    svg_main_menu_divider.svg.style.position = "absolute";
    svg_main_menu_divider_line_drag = new CreateSVGLineDrag(svg_main_menu_divider, "0", "0", `${main_menu_width - 2 * main_menu_border_width}`, `0`, svg_vert_bar_color, "14", svg_hover_color);
    svg_main_menu_divider_line_drag.dragFunction(main_menu_divider_drag_function);
    svg_main_menu_divider_line_drag.changeAcceleration(10);
    if (svg_main_menu_divider_top < 0)
        svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    svg_main_menu_divider.svg.style.top = `${svg_main_menu_divider_top}px`;
    if (typeof sub_menu === "undefined")
        return;
    sub_menu.style.top = `${svg_main_menu_divider_top + 8}px`;
    sub_menu.style.height = `${main_menu_height - svg_main_menu_divider_top - 20}px`;
    const elems = document.getElementsByClassName("object_div");
    for (const elem of elems) {
        if (typeof elem === "undefined")
            continue;
        const elem_height = Number(window.getComputedStyle(elem).height.split("px")[0]);
        elem.style.height = `${elem_height}px`;
    }
};
class MeshDataStructure {
    HalfEdgeDict;
    face_tmp;
    faces;
    sorted_faces;
    prev;
    next;
    temp;
    face_vertices_tmp;
    face_indexes_tmp;
    edge_no;
    vertex_no;
    vertex_indexes;
    multiplier = 10;
    deleted_halfedges_dict;
    face_indexes_set;
    max_face_index;
    face_index_map;
    max_vertex_index;
    constructor() {
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
        const test = Math.max(...[...this.face_indexes_set]);
        if (test !== Infinity && test !== -Infinity && test > this.max_face_index)
            this.max_face_index = test;
    }
    maxVertexIndex() {
        const test = Math.max(...[...this.vertex_indexes]);
        if (test !== Infinity && test !== -Infinity && test > this.max_vertex_index)
            this.max_vertex_index = test;
    }
    halfEdge(start, end, face_index) {
        this.vertex_indexes.add(start);
        this.vertex_indexes.add(end);
        this.maxVertexIndex();
        this.vertex_no = [...this.vertex_indexes].length;
        const comp = Math.max(start, end);
        if (this.multiplier % comp === this.multiplier)
            this.multiplier *= 10;
        this.face_indexes_set.add(face_index);
        this.maxFaceIndex();
        return {
            vertices: [start, end],
            face_vertices: [],
            twin: "-",
            prev: "-",
            next: "-",
            face_index: face_index,
        };
    }
    setHalfEdge(a, b, face_index = -1, set_halfEdge = true) {
        let halfEdgeKey = `${a}-${b}`;
        let twinHalfEdgeKey = `${b}-${a}`;
        // If halfedge does exist in halfedge dict switch halfedge key to twin halfedge key and vice-versa
        if (this.HalfEdgeDict[halfEdgeKey]) {
            const halfEdgeKeyTemp = twinHalfEdgeKey;
            twinHalfEdgeKey = halfEdgeKey;
            halfEdgeKey = halfEdgeKeyTemp;
        }
        // If halfedge does not exist in halfedge dict, create halfedge and increment the edge number
        if (!this.HalfEdgeDict[halfEdgeKey] && set_halfEdge === true) {
            this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(a, b, face_index);
            this.edge_no++;
            this.HalfEdgeDict[halfEdgeKey].face_vertices = this.face_vertices_tmp;
            this.face_index_map.set(face_index, this.face_vertices_tmp.join("-"));
        }
        else
            twinHalfEdgeKey;
        // if twin halfedge exists in halfedge dict, decrement the edge number
        if (this.HalfEdgeDict[twinHalfEdgeKey]) {
            this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
            this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
            this.edge_no--;
        }
        return halfEdgeKey;
    }
    addHalfEdge(edge, face_vertices = this.face_indexes_tmp, face_index = -1, prev = "-", next = "-") {
        if (typeof edge === "string")
            edge = edge.split("-").map(value => Number(value));
        const halfEdgeKey = this.setHalfEdge(...edge);
        this.HalfEdgeDict[halfEdgeKey].face_vertices = face_vertices;
        this.HalfEdgeDict[halfEdgeKey].prev = prev;
        this.HalfEdgeDict[halfEdgeKey].next = next;
        this.HalfEdgeDict[halfEdgeKey].face_index = face_index;
        return halfEdgeKey;
    }
    removeHalfEdge(edge) {
        if (!this.HalfEdgeDict[edge])
            return false; // halfedge was not deleted because it does not exist
        const [a, b] = edge.split("-");
        const twinHalfEdgeKey = b + "-" + a;
        const edge_num_list = this.edgeToNumber();
        this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
        // twin half edge exists
        if (this.HalfEdgeDict[twinHalfEdgeKey]) {
            this.HalfEdgeDict[twinHalfEdgeKey].twin = "-";
            let prev_halfEdgeKey = this.HalfEdgeDict[edge].prev;
            let next_halfEdgeKey = this.HalfEdgeDict[edge].next;
            if (prev_halfEdgeKey !== "-" && prev_halfEdgeKey !== twinHalfEdgeKey)
                this.HalfEdgeDict[prev_halfEdgeKey].next = "-";
            if (next_halfEdgeKey !== "-" && next_halfEdgeKey !== twinHalfEdgeKey)
                this.HalfEdgeDict[next_halfEdgeKey].prev = "-";
        }
        // twin half edge does not exist
        if (!this.HalfEdgeDict[twinHalfEdgeKey]) {
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
            if (this.deleted_halfedges_dict[twinHalfEdgeKey]) {
                beta_prev = this.deleted_halfedges_dict[twinHalfEdgeKey].prev;
                beta_next = this.deleted_halfedges_dict[twinHalfEdgeKey].next;
                beta_prev_exists = !!this.HalfEdgeDict[beta_prev];
                beta_next_exists = !!this.HalfEdgeDict[beta_next];
            }
            if (alpha_prev_exists && beta_next_exists) {
                this.HalfEdgeDict[alpha_prev].next = beta_next;
                this.HalfEdgeDict[beta_next].prev = alpha_prev;
            }
            else if (alpha_prev_exists)
                this.HalfEdgeDict[alpha_prev].next = "-";
            else if (beta_next_exists)
                this.HalfEdgeDict[beta_next].prev = "-";
            if (beta_prev_exists && alpha_next_exists) {
                this.HalfEdgeDict[beta_prev].next = alpha_next;
                this.HalfEdgeDict[alpha_next].prev = beta_prev;
            }
            else if (beta_prev_exists)
                this.HalfEdgeDict[beta_prev].next = "-";
            else if (alpha_next_exists)
                this.HalfEdgeDict[alpha_next].prev = "-";
            const faces_of_edge = this.getFacesOfDeletedEdge(edge);
            const alpha_edges = this.getEdgesOfFace(faces_of_edge[0]);
            const beta_edges = this.getEdgesOfFace(faces_of_edge[1]);
            if (alpha_edges.length >= 2 && beta_edges.length >= 2) {
                this.faces.delete(faces_of_edge[0].join("-"));
                this.faces.delete(faces_of_edge[1].join("-"));
                const new_face_vertices = this.mergeDeletedFaces(faces_of_edge, edge);
                const new_face_index = this.max_face_index + 1;
                const first_face_index = this.deleted_halfedges_dict[edge].face_index;
                const second_face_index = this.deleted_halfedges_dict[twinHalfEdgeKey].face_index;
                this.face_indexes_set.add(new_face_index);
                this.maxFaceIndex();
                this.face_index_map.set(new_face_index, new_face_vertices.join("-"));
                this.face_indexes_set.delete(first_face_index);
                this.face_indexes_set.delete(second_face_index);
                for (const edge of alpha_edges) {
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = new_face_vertices;
                        this.HalfEdgeDict[edge].face_index = new_face_index;
                    }
                }
                for (const edge of beta_edges) {
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = new_face_vertices;
                        this.HalfEdgeDict[edge].face_index = new_face_index;
                    }
                }
                this.faces.add(new_face_vertices.join('-'));
            }
            if (alpha_edges.length < 2) {
                for (const edge of alpha_edges)
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                        this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                    }
                this.faces.delete(faces_of_edge[0].join("-"));
            }
            if (beta_edges.length < 2) {
                for (const edge of beta_edges)
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                        this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                    }
                this.faces.delete(faces_of_edge[1].join("-"));
            }
            const biFacial_handling_result = this.biFacialHandling();
            if (biFacial_handling_result.length > 0)
                this.removeFace(biFacial_handling_result.join("-"));
            // if vertex a belongs to at most one edge remove it from the vertex indexes set
            if (this.getEdgesOfVertexFast(Number(a), edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(a));
            }
            // if vertex b belongs to at most one edge remove it from the vertex indexes set
            if (this.getEdgesOfVertexFast(Number(b), edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(b));
            }
            this.vertex_no = [...this.vertex_indexes].length; // update vertex number
            this.edge_no--; // decrease edge number as the twin does not exist
        }
        delete this.HalfEdgeDict[edge]; // delete the halfedge
        return true; // halfedge was successfully deleted
    }
    mergeDeletedFaces(faces, edge) {
        const alpha_face = this.prepareDeletedFaces(faces[0], edge);
        const beta_face = this.prepareDeletedFaces(faces[1], edge);
        const [a, b] = edge.split("-").map(value => Number(value));
        if (alpha_face.join("-") === beta_face.join("-")) {
            const a_index = alpha_face.indexOf(a);
            const b_index = beta_face.indexOf(b);
            const min_index = Math.min(a_index, b_index);
            alpha_face.splice(min_index, 2);
            this.modifyMergedFace(alpha_face);
        }
        const alpha_dict = {};
        const beta_dict = {};
        for (const index in alpha_face)
            alpha_dict[alpha_face[index]] = index;
        for (const index in beta_face)
            beta_dict[beta_face[index]] = index;
        var face_bool = true;
        var index = 0;
        var monitor = 0;
        const stop = faces[0].length + faces[1].length - 2;
        var collide = 0;
        var monitor_bool = true;
        const merged_face = [];
        while (true) {
            const cur_index = face_bool ? index % alpha_face.length : index % beta_face.length;
            const cur_value = face_bool ? alpha_face[cur_index] : beta_face[cur_index];
            if (cur_value === a || cur_value === b) {
                if (collide < 2) {
                    merged_face[merged_face.length] = cur_value;
                    face_bool = !face_bool;
                    const dict = face_bool ? alpha_dict : beta_dict;
                    index = dict[cur_value];
                    collide++;
                }
                else
                    monitor_bool = false;
            }
            else
                merged_face[merged_face.length] = cur_value;
            if (monitor_bool === true)
                monitor++;
            monitor_bool = true;
            index++;
            if (monitor === stop)
                break;
        }
        return this.modifyMergedFace(merged_face);
    }
    prepareDeletedFaces(face, edge) {
        var prepped = false;
        var remainder = [];
        const [a, b] = edge.split("-").map(value => Number(value));
        var edge_num_list = [];
        for (const index in face) {
            const cur_val = face[index];
            const next_val = face[(Number(index) + 1) % face.length];
            const last_val = Number(index) === (face.length - 1) ? true : false;
            if ((cur_val === a || cur_val === b) && (next_val === a || next_val === b)) {
                if (!last_val) {
                    remainder = face;
                    prepped = true;
                    break;
                }
                if (last_val) {
                    edge_num_list = [cur_val, next_val];
                }
            }
            if (!(cur_val === a || cur_val === b))
                remainder.push(cur_val);
        }
        if (!prepped)
            remainder = [...edge_num_list, ...remainder];
        return remainder;
    }
    modifyMergedFace(face) {
        var min = Infinity;
        var min_index = 0;
        for (const index in face) {
            const vertex = face[index];
            if (min > vertex) {
                min = vertex;
                min_index = Number(index);
            }
        }
        var rem = face.splice(min_index);
        return [...rem, ...face];
    }
    biFacialHandling() {
        if (this.faces.size === 2) { // Check if there are only two faces left in the mesh
            const faces = [...this.faces];
            const face_one = [...faces[0].split("-").map(value => Number(value))];
            const face_two = [...faces[1].split("-").map(value => Number(value))];
            if (face_one.length !== face_two.length)
                return []; // if both faces don't have the same number of vertices then abort and return false
            if (face_one.length <= 3)
                return face_two; // automatically consider them as complements in this case
            // else then try to compute if the two faces are complements
            if (this.modifyMergedFace(face_one).join("-") === this.modifyMergedFace(face_two).join("-"))
                return face_two; // if the two faces are complements return true;
            return []; // default return value;
        }
        return []; // default return value;
    }
    addVertex(vertex, vertex_or_face_or_edge) {
        if (typeof vertex_or_face_or_edge === "string")
            vertex_or_face_or_edge = vertex_or_face_or_edge.split("-").map(value => Number(value));
        vertex = Number(vertex);
        if (vertex_or_face_or_edge.length === 1) {
            this.vertex_indexes.add(vertex);
            this.maxVertexIndex();
            this.vertex_no = [...this.vertex_indexes].length;
            const comp = Math.max(this.max_vertex_index, vertex);
            if (this.multiplier % comp === this.multiplier)
                this.multiplier *= 10;
        }
        else if (vertex_or_face_or_edge.length >= 2) {
            var face_index = -1;
            if (vertex_or_face_or_edge.length > 2) {
                if (this.faces.has(vertex_or_face_or_edge.join("-"))) {
                    face_index = this.getFaceIndexOfFace(vertex_or_face_or_edge.join("-"));
                }
            }
            for (const val of vertex_or_face_or_edge) {
                this.addHalfEdge(`${vertex}-${val}`, vertex_or_face_or_edge, face_index);
            }
        }
    }
    removeVertex(vertex) {
        let count = 0;
        for (const edge in this.HalfEdgeDict) {
            if (edge.split("-").includes(`${vertex}`)) {
                this.removeEdge(edge);
            }
        }
        return count;
    }
    getEdgesOfVertexFast(vertex, edge_num_list) {
        const edge_list = [];
        edge_num_list.map(value => {
            const min = value % this.multiplier;
            const max = (value - min) / this.multiplier;
            if (vertex === min || vertex === max)
                edge_list.push(`${min}-${max}`);
        });
        return edge_list;
    }
    getEdgesOfVertex(vertex, no_half_edge = false) {
        const edge_list = [];
        const edge_set = new Set();
        if (no_half_edge === false) {
            for (const edge in this.HalfEdgeDict) {
                // edge touches vertex and is not in the edge_list
                if (edge.split("-").includes(`${vertex}`))
                    edge_list.push(edge);
            }
        }
        if (no_half_edge === true) {
            for (const edge in this.HalfEdgeDict) {
                // edge touches vertex and is not in the edge_list also ensure no edge complements (halfedges that are twin halfedges of previously existing halfedges)
                if (edge.split("-").includes(`${vertex}`)) {
                    const [a, b] = edge.split("-").map(value => Number(value));
                    edge_set.add(`${Math.min(a, b)}-${Math.max(a, b)}`);
                }
            }
            edge_list.push(...[...edge_set]);
        }
        return edge_list;
    }
    getFacesOfVertexSpecific(edge_list) {
        const face_set = new Set();
        const faces = [];
        for (const edge of edge_list) {
            const face = this.HalfEdgeDict[edge].face_vertices;
            if (!face_set.delete(face.join("-"))) {
                face_set.add(face.join("-"));
                faces.push(face);
            }
        }
        return faces;
    }
    getFaceIndexesOfVertexSpecific(edge_list) {
        const face_indexes = new Set();
        for (const edge of edge_list) {
            const face_index = this.HalfEdgeDict[edge].face_index;
            face_indexes.add(face_index);
        }
        return [...face_indexes];
    }
    getFacesOfVertexGeneric(vertex, no_half_edge = false) {
        const edge_list = this.getEdgesOfVertex(vertex, no_half_edge);
        this.getFacesOfVertexSpecific(edge_list);
    }
    addEdge(edge) {
        if (typeof edge === "string")
            edge = edge.split("-").map(value => Number(value));
        this.setHalfEdge(...edge);
        this.setHalfEdge(edge[1], edge[0]);
        return edge;
    }
    removeEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        const remove_thf = this.removeHalfEdge(edge.split("-").reverse().join("-"));
        const remove_hf = this.removeHalfEdge(edge);
        return remove_hf || remove_thf;
    }
    splitEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        const [a, b] = edge.split("-").map(value => Number(value));
        const faces_of_edge = this.getFacesOfEdge(edge);
        const new_vertex = this.max_vertex_index + 1;
        if (faces_of_edge[0].length > 0) {
            const new_face = faces_of_edge[0].join("-").replace(edge, `${a}-${new_vertex}-${b}`);
            this.vertex_indexes.add(new_vertex);
            if (faces_of_edge[0].length > 2) {
                this.removeFace(faces_of_edge[0].join("-"));
                this.addFace(new_face);
            }
            else {
                var prev = "-";
                var next = "-";
                if (this.HalfEdgeDict[edge]) {
                    prev = this.HalfEdgeDict[edge].prev;
                    next = this.HalfEdgeDict[edge].next;
                    this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
                    delete this.HalfEdgeDict[edge];
                    const face_index = this.HalfEdgeDict[edge].face_index;
                    this.addHalfEdge(`${a}-${new_vertex}`, new_face.split("-").map(value => Number(value)), face_index, prev, `${new_vertex}-${b}`);
                    this.addHalfEdge(`${new_vertex}-${b}`, new_face.split("-").map(value => Number(value)), face_index, `${a}-${new_vertex}`, next);
                }
            }
        }
        if (faces_of_edge[1].length > 0) {
            const new_face = faces_of_edge[1].join("-").replace(b + "-" + a, `${b}-${new_vertex}-${a}`);
            this.vertex_indexes.add(new_vertex);
            if (faces_of_edge[1].length > 2) {
                this.removeFace(faces_of_edge[1].join("-"));
                this.addFace(new_face);
            }
            else {
                var prev = "-";
                var next = "-";
                if (this.HalfEdgeDict[b + "-" + a]) {
                    prev = this.HalfEdgeDict[b + "-" + a].prev;
                    next = this.HalfEdgeDict[b + "-" + a].next;
                    this.deleted_halfedges_dict[b + "-" + a] = this.HalfEdgeDict[b + "-" + a];
                    delete this.HalfEdgeDict[b + "-" + a];
                    const face_index = this.HalfEdgeDict[b + "-" + a].face_index;
                    this.addHalfEdge(`${b}-${new_vertex}`, new_face.split("-").map(value => Number(value)), face_index, prev, `${new_vertex}-${a}`);
                    this.addHalfEdge(`${new_vertex}-${a}`, new_face.split("-").map(value => Number(value)), face_index, `${b}-${new_vertex}`, next);
                }
            }
        }
        this.maxVertexIndex();
    }
    mergeEdges(edge_1, edge_2) {
        if (typeof edge_1 === "object")
            edge_1 = edge_1.join("-");
        const [a_1, b_1] = edge_1.split("-").map(value => Number(value));
        if (typeof edge_2 === "object")
            edge_2 = edge_2.join("-");
        const [a_2, b_2] = edge_2.split("-").map(value => Number(value));
        const common_vertex_face_num = this.getCommonVertAndFacesofEdges(a_1, b_1, a_2, b_2);
        const common_vertex = common_vertex_face_num.common_vertex;
        const common_faces = common_vertex_face_num.faces;
        if (common_vertex < 0)
            return false;
        const edge_list = this.getEdgesOfVertex(common_vertex, true);
        const rev_edge_1 = `${b_1}-${a_1}`;
        const rev_edge_2 = `${b_2}-${a_2}`;
        let initial_max_face_index = this.max_face_index;
        for (const edge of edge_list) {
            if (!(edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2)) {
                const edge_faces = this.getFacesOfEdge(edge);
                const rem_edge = this.removeEdge(edge);
                if (rem_edge) {
                    const has_face_0 = this.faces.has(edge_faces[0].join("-"));
                    const has_face_1 = this.faces.has(edge_faces[1].join("-"));
                    if (!has_face_0) {
                        const index = common_faces.indexOf(edge_faces[0].join("-"));
                        if (index >= 0)
                            common_faces.splice(index, 1);
                    }
                    if (!has_face_1) {
                        const index = common_faces.indexOf(edge_faces[1].join("-"));
                        if (index >= 0)
                            common_faces.splice(index, 1);
                    }
                    if (this.max_face_index > initial_max_face_index) {
                        const face_to_push = this.face_index_map.get(this.max_face_index);
                        if (typeof face_to_push !== "undefined")
                            common_faces.push(face_to_push);
                        initial_max_face_index = this.max_face_index;
                        this.face_indexes_set.add(initial_max_face_index);
                    }
                }
            }
        }
        for (const face of common_faces) {
            const working_face = [...face.split("-").map(value => Number(value))];
            const index = working_face.indexOf(common_vertex);
            if (index >= 0) {
                working_face.splice(index, 1);
            }
            if (working_face.length <= 2)
                this.removeFace(face);
            else {
                const required_edges = this.getEdgesOrientation(face, edge_1, edge_2);
                if (required_edges.prev === "-" || required_edges.next === "-")
                    continue;
                const a = required_edges.prev.split("-")[0];
                const b = required_edges.next.split("-")[1];
                const prev = this.HalfEdgeDict[required_edges.prev].prev;
                const next = this.HalfEdgeDict[required_edges.next].next;
                const old_face_index = required_edges.face_index;
                this.face_indexes_set.delete(old_face_index);
                const new_face_index = this.getFaceIndexOfFace(working_face.join("-"));
                this.face_indexes_set.add(new_face_index);
                this.face_index_map.set(new_face_index, working_face.join("-"));
                this.addHalfEdge(a + "-" + b, working_face, new_face_index, prev, next);
                if (prev !== "-")
                    if (this.HalfEdgeDict[prev]) {
                        this.HalfEdgeDict[prev].next = a + "-" + b;
                    }
                if (next !== "-")
                    if (this.HalfEdgeDict[next]) {
                        this.HalfEdgeDict[next].prev = a + "-" + b;
                    }
                for (const edge of required_edges.edges_of_face) {
                    if (this.HalfEdgeDict[edge]) {
                        const face = this.HalfEdgeDict[edge].face_vertices.join("-");
                        this.faces.delete(face);
                        this.HalfEdgeDict[edge].face_vertices = working_face;
                        this.faces.add(working_face.join("-"));
                    }
                }
            }
        }
        if (this.HalfEdgeDict[edge_1]) {
            this.deleted_halfedges_dict[edge_1] = this.HalfEdgeDict[edge_1];
            delete this.HalfEdgeDict[edge_1];
        }
        if (this.HalfEdgeDict[rev_edge_1]) {
            this.deleted_halfedges_dict[rev_edge_1] = this.HalfEdgeDict[rev_edge_1];
            delete this.HalfEdgeDict[rev_edge_1];
        }
        if (this.HalfEdgeDict[edge_2]) {
            this.deleted_halfedges_dict[edge_2] = this.HalfEdgeDict[edge_2];
            delete this.HalfEdgeDict[edge_2];
        }
        if (this.HalfEdgeDict[rev_edge_2]) {
            this.deleted_halfedges_dict[rev_edge_2] = this.HalfEdgeDict[rev_edge_2];
            delete this.HalfEdgeDict[rev_edge_2];
        }
        this.edge_no = this.edge_no - 2; // update edge number
        this.vertex_indexes.delete(common_vertex);
        this.vertex_no = [...this.vertex_indexes].length; // update vertex number
        const biFacial_handling_result = this.biFacialHandling();
        if (biFacial_handling_result.length > 0)
            this.removeFace(biFacial_handling_result.join("-"));
        this.face_indexes_set.delete(-1);
    }
    getCommonVertAndFacesofEdges(a_1, b_1, a_2, b_2) {
        const test = { common_vertex: -1, faces: [] };
        // Check if both halfEdges or their twin halfedges exist
        if (((this.HalfEdgeDict[a_1 + "-" + b_1]) || (this.HalfEdgeDict[b_1 + "-" + a_1])) &&
            ((this.HalfEdgeDict[a_2 + "-" + b_2]) || (this.HalfEdgeDict[b_2 + "-" + a_2]))) {
            const halfEdgeKey_union_list = [a_1, b_1, a_2, b_2];
            const halfEdgeKey_union_set = new Set(halfEdgeKey_union_list);
            if (halfEdgeKey_union_set.size <= 2)
                return test;
            // get the common vertex of the adjacent edges
            for (const val of halfEdgeKey_union_list) {
                const check_vertex = halfEdgeKey_union_set.delete(val);
                if (check_vertex === false) {
                    test.common_vertex = val;
                    break;
                }
            }
            // get the faces
            const faces_list = [];
            if (this.HalfEdgeDict[`${a_1}-${b_1}`])
                faces_list.push(this.HalfEdgeDict[`${a_1}-${b_1}`].face_vertices.join("-"));
            if (this.HalfEdgeDict[`${b_1}-${a_1}`])
                faces_list.push(this.HalfEdgeDict[`${b_1}-${a_1}`].face_vertices.join("-"));
            if (this.HalfEdgeDict[`${a_2}-${b_2}`])
                faces_list.push(this.HalfEdgeDict[`${a_2}-${b_2}`].face_vertices.join("-"));
            if (this.HalfEdgeDict[`${b_2}-${a_2}`])
                faces_list.push(this.HalfEdgeDict[`${b_2}-${a_2}`].face_vertices.join("-"));
            const face_set = new Set(faces_list);
            test.faces.push(...[...face_set]);
            // get the faces' index
            const face_indexes_list = [];
            if (this.HalfEdgeDict[`${a_1}-${b_1}`])
                face_indexes_list.push(this.HalfEdgeDict[`${a_1}-${b_1}`].face_index);
            if (this.HalfEdgeDict[`${b_1}-${a_1}`])
                face_indexes_list.push(this.HalfEdgeDict[`${b_1}-${a_1}`].face_index);
            if (this.HalfEdgeDict[`${a_2}-${b_2}`])
                face_indexes_list.push(this.HalfEdgeDict[`${a_2}-${b_2}`].face_index);
            if (this.HalfEdgeDict[`${b_2}-${a_2}`])
                face_indexes_list.push(this.HalfEdgeDict[`${b_2}-${a_2}`].face_index);
            return test;
        }
        return test;
    }
    getEdgesOrientation(face, edge_1, edge_2) {
        const edges_orientation = { prev: "-", next: "-", edges_of_face: [], face_index: -1 };
        const rev_edge_1 = edge_1.split("-").reverse().join("-");
        const rev_edge_2 = edge_2.split("-").reverse().join("-");
        const face_edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));
        edges_orientation.edges_of_face.push(...face_edges);
        edges_orientation.face_index = face_edges.length >= 1 ? this.HalfEdgeDict[face_edges[0]].face_index : -1;
        var found_edge = "-";
        for (const edge of face_edges) {
            if (edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2) {
                if (this.HalfEdgeDict[edge]) {
                    found_edge = edge;
                    break;
                }
            }
        }
        if (found_edge === "-")
            return edges_orientation;
        else {
            const prev = this.HalfEdgeDict[found_edge].prev;
            const next = this.HalfEdgeDict[found_edge].next;
            if (prev !== "-")
                if (prev === edge_1 || prev === rev_edge_1 || prev === edge_2 || prev === rev_edge_2)
                    if (this.HalfEdgeDict[prev])
                        edges_orientation.prev = prev;
            if (next !== "-")
                if (next === edge_1 || next === rev_edge_1 || next === edge_2 || next === rev_edge_2)
                    if (this.HalfEdgeDict[next])
                        edges_orientation.next = next;
            if (edges_orientation.prev === "-")
                edges_orientation.prev = found_edge;
            else if (edges_orientation.next === "-")
                edges_orientation.next = found_edge;
        }
        return edges_orientation;
    }
    edgeReverse(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        const [a, b] = edge.split("-");
        return `${b}-${a}`;
    }
    getVerticesOfEdge(edge) {
        if (typeof edge === "string")
            return edge.split("-").map(value => Number(value));
        else
            return edge;
    }
    getFacesOfHalfEdge(halfEdge) {
        if (this.HalfEdgeDict[halfEdge]) {
            return this.HalfEdgeDict[halfEdge].face_vertices;
        }
        else
            return [];
    }
    getFacesOfEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        return [this.getFacesOfHalfEdge(edge), this.getFacesOfHalfEdge(edge.split("-").reverse().join("-"))];
    }
    getFacesOfDeletedHalfEdge(halfEdge) {
        if (this.deleted_halfedges_dict[halfEdge]) {
            return this.deleted_halfedges_dict[halfEdge].face_vertices;
        }
        else
            return [];
    }
    getFacesOfDeletedEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        return [this.getFacesOfDeletedHalfEdge(edge), this.getFacesOfDeletedHalfEdge(edge.split("-").reverse().join("-"))];
    }
    edgeToNumber() {
        const edge_num_set = new Set();
        for (const edge in this.HalfEdgeDict) {
            const [a, b] = edge.split("-").map(value => Number(value));
            const [min, max] = [Math.min(a, b), Math.max(a, b)];
            edge_num_set.add(max * this.multiplier + min);
        }
        return [...edge_num_set];
    }
    addFace(face) {
        this.face_vertices_tmp = face.split("-").map(value => Number(value));
        const sorted_face = [...this.face_vertices_tmp].sort((a, b) => a - b).join("-");
        const face_set = new Set(this.faces);
        const sorted_face_set = new Set(this.sorted_faces);
        // If face is not found in faces add face to faces and set its halfedges
        if (!face_set.delete(face) && this.face_vertices_tmp.length > 2 && !sorted_face_set.delete(sorted_face)) {
            this.faces.add(face);
            this.sorted_faces.push(sorted_face);
            const first_index = this.face_vertices_tmp[0];
            const second_index = this.face_vertices_tmp[1];
            const last_index = this.face_vertices_tmp[this.face_vertices_tmp.length - 1];
            const face_index = this.max_face_index + 1;
            for (let p in this.face_vertices_tmp) {
                const index = Number(p);
                const i = this.face_vertices_tmp[p];
                const j = this.face_vertices_tmp[(index + 1) % this.face_vertices_tmp.length];
                const halfEdgeKey = this.setHalfEdge(i, j, face_index);
                const [a, b] = halfEdgeKey.split("-");
                if (this.temp === null) {
                    this.prev = "-";
                }
                else {
                    this.prev = this.temp + "-" + a;
                }
                if (this.HalfEdgeDict[this.prev]) {
                    this.HalfEdgeDict[this.prev].next = halfEdgeKey;
                }
                this.next = "-";
                this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
                this.HalfEdgeDict[halfEdgeKey].next = this.next;
                this.temp = a;
                if (index === 0)
                    this.HalfEdgeDict[halfEdgeKey].prev = `${last_index}-${first_index}`;
                if (index === this.face_vertices_tmp.length - 1)
                    this.HalfEdgeDict[halfEdgeKey].next = `${first_index}-${second_index}`;
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
    removeFace(face) {
        // Check if face is found in faces
        if (this.faces.has(face)) {
            const existing_face_edges = this.getEdgesOfFacethatExists(face.split("-").map(value => Number(value)));
            const edge_num_list = this.edgeToNumber();
            // remove the face and its halfedges
            for (const half_edge of existing_face_edges) {
                const [a, b] = half_edge.split("-");
                this.deleted_halfedges_dict[half_edge] = this.HalfEdgeDict[half_edge];
                this.face_indexes_set.delete(this.HalfEdgeDict[half_edge].face_index);
                delete this.HalfEdgeDict[half_edge];
                // if vertex a belongs to at most one edge remove it from the vertex indexes set
                if (this.getEdgesOfVertexFast(Number(a), edge_num_list).length <= 1) {
                    this.vertex_indexes.delete(Number(a));
                }
                // if vertex b belongs to at most one edge remove it from the vertex indexes set
                if (this.getEdgesOfVertexFast(Number(b), edge_num_list).length <= 1) {
                    this.vertex_indexes.delete(Number(b));
                }
                this.vertex_no = [...this.vertex_indexes].length; // update vertex number
                if (!this.HalfEdgeDict[b + "-" + a])
                    this.edge_no--; // decrease edge number if the twin does not exist
            }
            this.faces.delete(face);
            return true; // face was removed
        }
        return false; // face not removed because it was not found
    }
    getEdgesOfFace(face) {
        return face.map((value, index) => `${value}-${face[(index + 1) % face.length]}`);
    }
    getEdgesOfFacethatExists(face) {
        const potential_edges = this.getEdgesOfFace(face);
        const existing_edges = [];
        for (const half_edge of potential_edges) {
            if (half_edge in this.HalfEdgeDict)
                existing_edges.push(half_edge);
        }
        return existing_edges;
    }
    getFaceIndexOfFace(face) {
        const edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));
        for (const halfedge of edges) {
            if (halfedge in this.HalfEdgeDict)
                this.HalfEdgeDict[halfedge].face_index;
        }
        return -1;
    }
    splitFace(face, vert_1, vert_2) {
        vert_1 = Number(vert_1);
        vert_2 = Number(vert_2);
        if (this.faces.has(face)) {
            if (!face.includes(`${vert_1}`) || !face.includes(`${vert_2}`))
                return false; // face not split as one or both vertices not found in face
            const face_vertices = face.split("-").map(value => Number(value));
            const edges = this.getEdgesOfFace(face_vertices);
            const bi_edges = [];
            for (const edge of edges)
                if (edge.includes(`${vert_1}`))
                    bi_edges.push(edge);
            for (const bi_edge of bi_edges)
                if (bi_edge.includes(`${vert_2}`))
                    return false; // face not split due to both vertices belonging to the same edge
            const vert_1_index = face_vertices.indexOf(vert_1);
            const vert_2_index = face_vertices.indexOf(vert_2);
            const first_vertex = vert_2_index > vert_1_index ? vert_1_index : vert_2_index;
            const second_vertex = vert_2_index > vert_1_index ? vert_2_index : vert_1_index;
            var pre = face_vertices.splice(0, first_vertex + 1);
            var post = face_vertices.splice(second_vertex - pre.length);
            var other_face = [post[0], ...face_vertices.reverse(), pre[pre.length - 1]];
            pre.push(...post);
            this.removeFace(face);
            this.addFace(pre.join("-"));
            this.addFace(other_face.join("-"));
            return true; // face was split
        }
        return false; // face not split as it doesn't exist
    }
    mergeFace(face_1, face_2) {
        if (!this.faces.has(face_1) || !this.faces.has(face_2))
            return false; // faces not merged because one or both do not exist
        const face_1_edges = this.getEdgesOfFace(face_1.split("-").map(value => Number(value)));
        const face_2_edges = this.getEdgesOfFace(face_2.split("-").map(value => Number(value)));
        for (const edge of face_1_edges) {
            const twin_edge = edge.split("-").reverse().join("-");
            if (face_2_edges.includes(twin_edge)) {
                this.removeEdge(edge);
                return true; // faces were merged
            }
        }
        return false; // faces not merged because they do not have a common edge;
    }
    sumPoints(points) {
        var res = new Point3D(0, 0, 0);
        for (const point of points) {
            res.x += point.x;
            res.y += point.y;
            res.z += point.z;
        }
        return res;
    }
    getMinMax(points) {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        var minZ = Infinity;
        var maxZ = -Infinity;
        const indices = { minXIndex: 0,
            maxXIndex: 0,
            minYIndex: 0,
            maxYIndex: 0,
            minZIndex: 0,
            maxZIndex: 0 };
        for (const _index in points) {
            const index = Number(_index);
            const point = points[index];
            if (minX > point.x) {
                minX = point.x;
                indices.minXIndex = index;
            }
            ;
            if (maxX < point.x) {
                maxX = point.x;
                indices.maxXIndex = index;
            }
            ;
            if (minY > point.y) {
                minY = point.y;
                indices.minYIndex = index;
            }
            ;
            if (maxY < point.y) {
                maxY = point.y;
                indices.maxYIndex = index;
            }
            ;
            if (minZ > point.z) {
                minZ = point.z;
                indices.minZIndex = index;
            }
            ;
            if (maxZ < point.z) {
                maxZ = point.z;
                indices.maxZIndex = index;
            }
            ;
        }
        const minmax = { minX: minX, maxX: maxX, minY: minY, maxY: maxY, minZ: minZ, maxZ: maxZ };
        return { min_max: minmax, indices: indices };
    }
    triangulate(points_list = undefined) {
        const triangulated_points_list = [];
        if (typeof points_list !== "undefined") {
            triangulated_points_list.push(...points_list);
        }
        const start = new Date().getTime();
        const new_mesh = new MeshDataStructure();
        var new_vertex = this.max_vertex_index;
        for (const face of this.faces) {
            const vertex_indexes = face.split("-").map(value => Number(value));
            const face_edges = this.getEdgesOfFace(vertex_indexes);
            new_vertex++;
            if (typeof points_list !== "undefined") {
                const face_vertices = this.HalfEdgeDict[face_edges[0]].face_vertices;
                const face_points = face_vertices.map(value => points_list[value]);
                const minmax = this.getMinMax(face_points).min_max;
                const average_point = new Point3D((minmax.minX + minmax.maxX) * 0.5, (minmax.minY + minmax.maxY) * 0.5, (minmax.minZ + minmax.maxZ) * 0.5);
                triangulated_points_list.push(average_point);
            }
            for (const edge of face_edges) {
                const [a, b] = edge.split("-");
                new_mesh.addFace(`${new_vertex}-${a}-${b}`);
            }
        }
        const end = new Date().getTime();
        console.log(`Time taken to triangulate : ${end - start} ms`);
        return { mesh: new_mesh, points: triangulated_points_list };
    }
    quad_to_tri(points_list = undefined) {
        const triangulated_points_list = [];
        if (typeof points_list !== "undefined") {
            triangulated_points_list.push(...points_list);
        }
        const new_mesh = new MeshDataStructure();
        for (const face of this.faces) {
            const vertex_indexes = face.split("-").map(value => Number(value));
            const face_edges = this.getEdgesOfFace(vertex_indexes);
            if (face_edges.length === 4) {
                const [a, b] = face_edges[0].split("-");
                const [c, d] = face_edges[1].split("-");
                const [e, f] = face_edges[2].split("-");
                const [g, h] = face_edges[3].split("-");
                new_mesh.addFace(`${a}-${b}-${d}`);
                new_mesh.addFace(`${e}-${f}-${h}`);
            }
            else
                new_mesh.addFace(face);
        }
        return { mesh: new_mesh, points: triangulated_points_list };
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
class Point3D {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class Line {
    p;
    q;
    constructor(p, q) {
        this.p = p;
        this.q = q;
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
class BasicSettings {
    // Miscellanous
    object_vertices;
    prev_hovered_vertices_array;
    hovered_vertices_array;
    pre_selected_vertices_array;
    selected_vertices_array;
    _last_active;
    constructor() {
        this.setCanvas();
        const start_child = document.getElementById(start_nav);
        this.modifyState(start_child, true);
        const elem = document.getElementById(TouchMouseEventId);
        this.displayMouseTouchEvent(elem);
        main_nav.addEventListener("click", (event) => {
            const child = event.target;
            if (child.id !== TouchMouseEventId && child.id !== main_nav.id) {
                this.modifyState(child);
                event.stopPropagation();
            }
            if (child.id === TouchMouseEventId && child.id !== main_nav.id) {
                if (isTouchDeviceToggleable)
                    isTouchDevice = !isTouchDevice;
                this.displayMouseTouchEvent(child);
                event.stopPropagation();
            }
        });
        main_nav.addEventListener("mouseover", (event) => {
            const child = event.target;
            if (child.id !== TouchMouseEventId && child.id !== main_nav.id) {
                this.hoverState(child);
                event.stopPropagation();
            }
        });
        main_nav.addEventListener("mouseout", (event) => {
            const child = event.target;
            if (child.id !== TouchMouseEventId && child.id !== main_nav.id) {
                this.unhoverState(child);
                event.stopPropagation();
            }
        });
        main_menu.addEventListener("click", (event) => {
            const elem = event.target;
            const full_id = elem.id.split("_");
            const id = full_id[0];
            if (id === "gen-proj") {
                if (general_projection) {
                    if (typeof general_projection.projection === "undefined")
                        return;
                    general_projection.remove();
                    if (MODIFIED_PARAMS._PROJ_TYPE === "Orthographic")
                        MODIFIED_PARAMS._PROJ_TYPE = "Perspective";
                    else if (MODIFIED_PARAMS._PROJ_TYPE === "Perspective")
                        MODIFIED_PARAMS._PROJ_TYPE = "Orthographic";
                    general_projection.loadCameraIcon();
                }
            }
            if (id === "cross") {
                _CAMERA.createNewCameraObject();
                if (camera_indicator)
                    camera_indicator.showCameras();
            }
            if (id === "svg-proj") {
                if (camera_indicator) {
                    const instance = Number(full_id[1]);
                    camera_indicator.toggleProjType(instance);
                    camera_indicator.showCameras();
                    const svg = document.getElementById(`svg-proj_${instance}_svg`);
                    if (svg) {
                        console.log(svg.children);
                    }
                }
            }
            if (id === "svg-remove") {
                if (camera_indicator) {
                    const instance = Number(full_id[1]);
                    camera_indicator.removeCamera(instance);
                    camera_indicator.showCameras();
                }
            }
            if (id === "camera-icon" || id === "camera-para") {
                if (camera_indicator) {
                    const instance = Number(full_id[1]);
                    camera_indicator.clickCamera(instance);
                }
            }
            if (id === "undo") { }
            if (id === "redo") { }
            console.log(event.target, "******************", id);
        });
        main_menu.addEventListener("mouseover", (event) => {
            const elem = event.target;
            const id = elem.id.split("_")[0];
            if (id === "gen-proj") {
                if (general_projection) {
                    if (!general_projection.hovered) {
                        general_projection.tooltip_class.call_function_in();
                        general_projection.start_event();
                        general_projection.hovered = true;
                    }
                }
            }
            if (id === "cross") {
                if (cross_indicator) {
                    if (!cross_indicator.hovered) {
                        cross_indicator.tooltip_class.call_function_in();
                        cross_indicator.start_event();
                        cross_indicator.hovered = true;
                    }
                }
            }
            if (id === "undo") {
                if (undo) {
                    if (!undo.hovered) {
                        undo.tooltip_class.call_function_in();
                        undo.start_event();
                        undo.hovered = true;
                    }
                }
            }
            if (id === "redo") {
                if (redo) {
                    if (!redo.hovered) {
                        redo.tooltip_class.call_function_in();
                        redo.start_event();
                        redo.hovered = true;
                    }
                }
            }
        });
        main_menu.addEventListener("mouseout", (event) => {
            const elem = event.target;
            const id = elem.id.split("_")[0];
            if (general_projection) {
                if (general_projection.hovered && id !== "gen-proj") {
                    general_projection.hovered = false;
                    general_projection.tooltip_class.call_function_out();
                    general_projection.end_event();
                }
            }
            if (cross_indicator) {
                if (cross_indicator.hovered && id !== "cross") {
                    cross_indicator.hovered = false;
                    cross_indicator.tooltip_class.call_function_out();
                    cross_indicator.end_event();
                }
            }
            if (undo) {
                if (undo.hovered && id !== "undo") {
                    undo.hovered = false;
                    undo.tooltip_class.call_function_out();
                    undo.end_event();
                }
            }
            if (redo) {
                if (redo.hovered && id !== "redo") {
                    redo.hovered = false;
                    redo.tooltip_class.call_function_out();
                    redo.end_event();
                }
            }
        });
        main_menu.addEventListener("touchstart", (event) => {
            const elem = event.target;
            const id = elem.id.split("_")[0];
            console.log(event.target, "******************", id);
            if (id === "gen-proj") {
                if (general_projection) {
                    if (!general_projection.hovered) {
                        general_projection.tooltip_class.call_function_in();
                        general_projection.start_event();
                        general_projection.hovered = true;
                    }
                }
            }
            if (id === "cross") {
                if (cross_indicator) {
                    if (!cross_indicator.hovered) {
                        cross_indicator.tooltip_class.call_function_in();
                        cross_indicator.start_event();
                        cross_indicator.hovered = true;
                    }
                }
            }
            if (id === "undo") {
                if (undo) {
                    if (!undo.hovered) {
                        undo.tooltip_class.call_function_in();
                        undo.start_event();
                        undo.hovered = true;
                    }
                }
            }
            if (id === "redo") {
                if (redo) {
                    if (!redo.hovered) {
                        redo.tooltip_class.call_function_in();
                        redo.start_event();
                        redo.hovered = true;
                    }
                }
            }
        }, { "passive": true });
        main_menu.addEventListener("touchend", (event) => {
            const elem = event.target;
            const id = elem.id.split("_")[0];
            if (general_projection) {
                if (general_projection.hovered && id !== "gen-proj") {
                    general_projection.hovered = false;
                    general_projection.tooltip_class.call_function_out();
                    general_projection.end_event();
                }
            }
            if (cross_indicator) {
                if (cross_indicator.hovered && id !== "cross") {
                    cross_indicator.hovered = false;
                    cross_indicator.tooltip_class.call_function_out();
                    cross_indicator.end_event();
                }
            }
            if (undo) {
                if (undo.hovered && id !== "undo") {
                    undo.hovered = false;
                    undo.tooltip_class.call_function_out();
                    undo.end_event();
                }
            }
            if (redo) {
                if (redo.hovered && id !== "redo") {
                    redo.hovered = false;
                    redo.tooltip_class.call_function_out();
                    redo.end_event();
                }
            }
        }, { "passive": true });
    }
    displayMouseTouchEvent(elem) {
        if (isTouchDevice === true)
            elem.innerHTML = "Touch";
        else
            elem.innerHTML = "Mouse";
    }
    setGlobalAlpha(alpha) {
        MODIFIED_PARAMS._GLOBAL_ALPHA = alpha;
    }
    setCanvasOpacity(opacity) {
        MODIFIED_PARAMS._CANVAS_OPACITY = opacity;
    }
    setCanvas() {
        // Canvas and sidebar
        MODIFIED_PARAMS._CANVAS_HEIGHT = Math.abs(window.innerHeight - 50 - nav_height);
        MODIFIED_PARAMS._SIDE_BAR_WIDTH = Math.max(window.innerWidth / 3.5, DEFAULT_PARAMS._SIDE_BAR_WIDTH);
        var width = window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15;
        MODIFIED_PARAMS._CANVAS_WIDTH = width;
    }
    resetCanvasToDefault() {
        canvas.style.borderColor = DEFAULT_PARAMS._BORDER_COLOR;
        ctx.globalAlpha = DEFAULT_PARAMS._GLOBAL_ALPHA;
    }
    changeAngleUnit(angleUnit) {
        MODIFIED_PARAMS._ANGLE_UNIT = angleUnit;
        MODIFIED_PARAMS._ANGLE_CONSTANT = this.angleUnit(angleUnit);
        MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT = this.revAngleUnit(angleUnit);
    }
    setHandedness(value) {
        if (value === 'left')
            MODIFIED_PARAMS._HANDEDNESS = Handedness.left;
        else if (value === 'right')
            MODIFIED_PARAMS._HANDEDNESS = Handedness.right;
    }
    angleUnit(angle_unit) {
        if (angle_unit === "deg")
            return Math.PI / 180; // deg to rad
        else if (angle_unit === 'grad')
            return Math.PI / 200; // grad to rad
        else
            return 1; // rad to rad
    }
    revAngleUnit(angle_unit) {
        if (angle_unit === "deg")
            return 180 / Math.PI; // rad to deg
        else if (angle_unit === 'grad')
            return 200 / Math.PI; // rad to grad
        else
            return 1; // rad to rad
    }
    unhoverState(elem) {
        if (elem.id === main_nav.id)
            return;
        if (elem.id !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = elem_col;
        }
    }
    hoverState(elem) {
        if (elem.id === main_nav.id)
            return;
        if (elem.id !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = elem_hover_col;
        }
    }
    modifyState(elem, first = false) {
        if (elem.id === main_nav.id)
            return;
        if (elem.id !== MODIFIED_PARAMS._ACTIVE) {
            MODIFIED_PARAMS._ACTIVE = elem.id;
            elem.style.backgroundColor = elem_active_col;
            if (first === false)
                this._last_active.style.backgroundColor = elem_col;
            this._last_active = elem;
            sendMessage(elem.id);
        }
    }
}
class CreateSVG {
    svg;
    svg_ns;
    max_child_elem_count;
    container_;
    constructor(container, width, height, id, max_child_element_count = 1) {
        this.init(container, width, height, id, max_child_element_count);
    }
    init(container, width, height, id, max_child_element_count = 1) {
        const svgNS = "http://www.w3.org/2000/svg";
        const _svg = document.createElementNS(svgNS, "svg");
        this.svg = _svg;
        this.svg_ns = svgNS;
        this.max_child_elem_count = max_child_element_count;
        this.container_ = container;
        _svg.setAttribute("width", width);
        _svg.setAttribute("height", height);
        _svg.id = `${id}_svg`;
        container.appendChild(_svg);
    }
    remove() {
        this.container_.removeChild(this.svg);
    }
    event_in() { }
    ;
    event_out() { }
    ;
}
class CreateSVGHelper {
    constructor() { }
    generateSVGArc(cx = 0, cy = 0, w = 10, h = 10, v = 10, start = 0, interval = 360, moveTo = "M", lineTo = "L", closePath = "") {
        const angle_inc = 360 / v;
        let path = "";
        const stop = start + interval;
        if (moveTo !== "M")
            moveTo = "m";
        if (lineTo !== "L")
            lineTo = "l";
        for (let i = 0; i < v; i++) {
            const cur_ang = (i * angle_inc) + start;
            if (cur_ang > stop)
                break;
            const conv = Math.PI / 180;
            const x = Math.cos((cur_ang - 90) * conv) * (w / 2) + cx;
            const y = Math.sin((cur_ang - 90) * conv) * (h / 2) + cy;
            if (i === 0)
                path += `${moveTo} ${x} ${y}`;
            else
                path += `, ${lineTo} ${x} ${y}`;
        }
        path += ` ${closePath}`;
        return path;
    }
}
class CreateSVGPath {
    path;
    path_ns;
    svg_class_;
    stroke_;
    hover_color_;
    fill_;
    hover_fill_;
    constructor(svg_class, d, stroke, strokeWidth, hover_color, fill = "none", hover_fill = false) {
        const _path = document.createElementNS(svg_class.svg_ns, "path");
        this.path_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;
        this.fill_ = fill;
        this.hover_fill_ = hover_fill;
        _path.setAttribute("d", d);
        _path.setAttribute("stroke", stroke);
        _path.setAttribute("stroke-width", strokeWidth);
        _path.setAttribute("fill", fill);
        _path.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.path = _path;
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count)
            svg_class.svg.appendChild(this.path);
    }
    event_in() {
        if (this.hover_fill_)
            this.path.setAttribute("fill", this.hover_color_);
        this.path.setAttribute("stroke", this.hover_color_);
    }
    event_out() {
        if (this.hover_fill_)
            this.path.setAttribute("fill", this.fill_);
        this.path.setAttribute("stroke", this.stroke_);
    }
}
class CreateSVGLine {
    line;
    line_ns;
    svg_class_;
    stroke_;
    hover_color_;
    constructor(svg_class, x1, y1, x2, y2, stroke, strokeWidth, hover_color) {
        const _line = document.createElementNS(svg_class.svg_ns, "line");
        this.line_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;
        _line.setAttribute("x1", x1);
        _line.setAttribute("y1", y1);
        _line.setAttribute("x2", x2);
        _line.setAttribute("y2", y2);
        _line.setAttribute("stroke", stroke);
        _line.setAttribute("stroke-width", strokeWidth);
        _line.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.line = _line;
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count)
            svg_class.svg.appendChild(_line);
    }
    event_in() {
        this.line.setAttribute("stroke", this.hover_color_);
    }
    event_out() {
        this.line.setAttribute("stroke", this.stroke_);
    }
}
class CreateSVGCircle {
    circle;
    circle_ns;
    svg_class_;
    stroke_;
    hover_color_;
    fill_;
    hover_fill_;
    constructor(svg_class, cx, cy, r, stroke, strokeWidth, hover_color, fill, hover_fill = true) {
        const _circle = document.createElementNS(svg_class.svg_ns, "circle");
        this.circle_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;
        this.fill_ = fill;
        this.hover_fill_ = hover_fill;
        _circle.setAttribute("cx", cx);
        _circle.setAttribute("cy", cy);
        _circle.setAttribute("r", r);
        _circle.setAttribute("stroke", stroke);
        _circle.setAttribute("stroke-width", strokeWidth);
        _circle.setAttribute("fill", fill);
        _circle.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.circle = _circle;
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count)
            svg_class.svg.appendChild(_circle);
    }
    event_in() {
        if (this.hover_fill_)
            this.circle.setAttribute("fill", this.hover_color_);
        this.circle.setAttribute("stroke", this.hover_color_);
    }
    event_out() {
        if (this.hover_fill_)
            this.circle.setAttribute("fill", this.fill_);
        this.circle.setAttribute("stroke", this.stroke_);
    }
}
class CreateSVGEllipse {
    ellipse;
    ellipse_ns;
    svg_class_;
    stroke_;
    hover_color_;
    fill_;
    hover_fill_;
    constructor(svg_class, cx, cy, rx, ry, stroke, strokeWidth, hover_color, fill, hover_fill = true) {
        const _ellipse = document.createElementNS(svg_class.svg_ns, "ellipse");
        this.ellipse_ns = svg_class.svg_ns;
        this.svg_class_ = svg_class;
        this.stroke_ = stroke;
        this.hover_color_ = hover_color;
        this.fill_ = fill;
        this.hover_fill_ = hover_fill;
        _ellipse.setAttribute("cx", cx);
        _ellipse.setAttribute("cy", cy);
        _ellipse.setAttribute("rx", rx);
        _ellipse.setAttribute("ry", ry);
        _ellipse.setAttribute("stroke", stroke);
        _ellipse.setAttribute("stroke-width", strokeWidth);
        _ellipse.setAttribute("fill", fill);
        _ellipse.id = `${svg_class.svg.id}_${svg_class.svg.childElementCount}`;
        this.ellipse = _ellipse;
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count)
            svg_class.svg.appendChild(_ellipse);
    }
    event_in() {
        if (this.hover_fill_)
            this.ellipse.setAttribute("fill", this.hover_color_);
        this.ellipse.setAttribute("stroke", this.hover_color_);
    }
    event_out() {
        if (this.hover_fill_)
            this.ellipse.setAttribute("fill", this.fill_);
        this.ellipse.setAttribute("stroke", this.stroke_);
    }
}
class CreateSVGLineDrag extends CreateSVGLine {
    implement_drag;
    constructor(svg_class, x1, y1, x2, y2, stroke, strokeWidth, hover_color) {
        super(svg_class, x1, y1, x2, y2, stroke, strokeWidth, hover_color);
    }
    dragFunction(func) {
        this.implement_drag = implementDrag();
        if (this.svg_class_.max_child_elem_count === 1) {
            this.implement_drag.start(this.svg_class_.svg, func);
        }
    }
    changeAcceleration(acceleration) {
        this.implement_drag.changeAcc(acceleration);
    }
}
class CreateSVGDelete {
    svg_class_;
    path_1;
    path_2;
    constructor(svg_class, d_1, d_2, stroke, strokeWidth, hover_color, fill = "none", hover_fill = false) {
        this.svg_class_ = svg_class;
        this.path_1 = new CreateSVGPath(svg_class, d_1, stroke, strokeWidth, hover_color, fill, hover_fill);
        this.path_2 = new CreateSVGPath(svg_class, d_2, stroke, strokeWidth, hover_color, fill, hover_fill);
    }
}
class CreateSVGCameraExperimental {
    svg_class_;
    path_1;
    path_2;
    constructor(svg_class, d_1, d_2, stroke, strokeWidth, hover_color, fill = "none", hover_fill = false) {
        this.svg_class_ = svg_class;
        // this.path_1 = new CreateSVGPath(svg_class, d_1, stroke, strokeWidth, hover_color, fill, hover_fill);
        // this.path_2 = new CreateSVGPath(svg_class, d_2, stroke, strokeWidth, hover_color, fill, hover_fill);
        const p_1_proc = d_1.split(",");
        const p_2_proc = d_2.split(",");
        for (const index in p_1_proc) {
            if (Number(index) === 4)
                break;
            let inc = 0;
            if (Number(index) > 0)
                inc = 1;
            console.log(p_1_proc[index], "***********");
            const elems_1 = p_1_proc[index].split(" ");
            const elems_2 = p_2_proc[index].split(" ");
            const [x1, y1, x2, y2] = [elems_1[1 + inc], elems_1[2 + inc], elems_2[1 + inc], elems_2[2 + inc]];
            new CreateSVGLine(svg_class, `${x1}`, `${y1}`, `${x2}`, `${y2}`, stroke, strokeWidth, hover_color);
            new CreateSVGLine(svg_class, `${x1}`, `${x2}`, `${y1}`, `${y2}`, stroke, strokeWidth, hover_color);
            console.log(x1, y1, x2, y2, "#########", elems_1, elems_2);
        }
    }
}
class CreateSVGCameraIcon {
    path;
    constructor(svg_class, stroke, strokeWidth, hover_color, fill = "none", hover_fill = false) {
        const path_string = "M 18 4, L 12 10, L 12 3, L 1 1, L 1 19, L 12 17, L 12 10, L 18 16";
        this.path = new CreateSVGPath(svg_class, path_string, stroke, svg_objects_strokeWidth, svg_hover_color, fill, hover_fill);
    }
}
class CreateSVGCameraProjection {
    svg_class_;
    path_1;
    path_2;
    lines;
    constructor(svg_class, d_1, d_2, stroke, strokeWidth, hover_color, fill = "none", hover_fill = false) {
        this.svg_class_ = svg_class;
        this.path_1 = new CreateSVGPath(svg_class, d_1, stroke, strokeWidth, hover_color, fill, hover_fill);
        this.path_2 = new CreateSVGPath(svg_class, d_2, stroke, strokeWidth, hover_color, fill, hover_fill);
        this.lines = [];
        const p_1_proc = d_1.split(",");
        const p_2_proc = d_2.split(",");
        for (const index in p_1_proc) {
            if (Number(index) === 4)
                break;
            let inc = 0;
            if (Number(index) > 0)
                inc = 1;
            const elems_1 = p_1_proc[index].split(" ");
            const elems_2 = p_2_proc[index].split(" ");
            const [x1, y1, x2, y2] = [elems_1[1 + inc], elems_1[2 + inc], elems_2[1 + inc], elems_2[2 + inc]];
            this.lines.push(new CreateSVGLine(svg_class, `${x1}`, `${y1}`, `${x2}`, `${y2}`, stroke, strokeWidth, hover_color));
        }
    }
    start_event() {
        for (const line of this.lines)
            line.event_in();
        this.path_1.event_in();
        this.path_2.event_in();
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        this.path_1.event_out();
        this.path_2.event_out();
    }
    remove() {
        this.svg_class_.svg.removeChild(this.path_1.path);
        this.svg_class_.svg.removeChild(this.path_2.path);
        for (const line of this.lines) {
            this.svg_class_.svg.removeChild(line.line);
        }
    }
}
class SVG_Indicator {
    svg_class;
    tooltip_class;
    svg_container;
    tooltip_container;
    hovered;
    constructor(container, id, max_child_elem_count, tooltip_text = "Generic", respect_animate = true) {
        const sub_container = document.createElement("div");
        sub_container.style.margin = "10px";
        container.appendChild(sub_container);
        this.svg_class = new CreateSVG(sub_container, "20", "20", id, max_child_elem_count);
        this.tooltip_class = new CreateToolTip(container, sub_container, tooltip_text, 5, 100, respect_animate);
        this.svg_container = sub_container;
        this.tooltip_container = container;
        this.hovered = false;
    }
}
class Other_SVG_Indicator extends SVG_Indicator {
    constructor(container, id, max_child_elem_count, tooltip_text = "Generic", hori_pos_ = "right_10px", vert_pos_ = "top_0px", tooltip_position = "left") {
        super(container, id, max_child_elem_count, tooltip_text, true);
        this.svg_container.style.display = "inline";
        this.svg_container.style.position = "absolute";
        const vert_pos = vert_pos_.split("_");
        const hori_pos = hori_pos_.split("_");
        if (vert_pos[0] === "top")
            this.svg_container.style.top = vert_pos[1];
        else if (vert_pos[0] === "bottom")
            this.svg_container.style.bottom = vert_pos[1];
        if (hori_pos[0] === "left")
            this.svg_container.style.left = hori_pos[1];
        else if (hori_pos[0] === "right")
            this.svg_container.style.right = hori_pos[1];
        switch (tooltip_position) {
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
class CreateCameraProjection_SVG_Indicator extends Other_SVG_Indicator {
    projection;
    text;
    constructor(container, id, hori_pos = "right_40px", vert_pos = "top_0px", tooltip_postition = "left") {
        super(container, id, 6, "", hori_pos, vert_pos, tooltip_postition);
        this.tooltip_class.tooltip_text_elem.innerHTML = `${MODIFIED_PARAMS._PROJ_TYPE}`;
        this.projection = undefined;
        this.loadCameraIcon();
    }
    loadCameraIcon() {
        this.tooltip_class.tooltip_text_elem.innerHTML = `${MODIFIED_PARAMS._PROJ_TYPE}`;
        if (MODIFIED_PARAMS._PROJ_TYPE === "Orthographic") {
            this.projection = new CreateSVGCameraProjection(this.svg_class, "M 7 2, L 18 2, L 18 12, L 7 12, Z", "M 2 8, L 13 8, L 13 18, L 2 18, Z", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        }
        else if (MODIFIED_PARAMS._PROJ_TYPE === "Perspective") {
            this.projection = new CreateSVGCameraProjection(this.svg_class, "M 9 3, L 17 3, L 17 10, L 9 10, Z", "M 1 8, L 13 8, L 13 19, L 1 19, Z", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        }
    }
    remove() {
        if (this.projection)
            this.projection.remove();
    }
    start_event() {
        if (this.projection)
            this.projection.start_event();
    }
    end_event() {
        if (this.projection)
            this.projection.end_event();
    }
}
class CreateCross_SVG_Indicator extends Other_SVG_Indicator {
    line_1;
    line_2;
    constructor(container, id, text, hori_pos = "right_10px", vert_pos = "top_0px", tooltip_postition = "left") {
        super(container, id, 2, text, hori_pos, vert_pos, tooltip_postition);
        this.line_1 = new CreateSVGLine(this.svg_class, "1", "10", "19", "10", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.line_2 = new CreateSVGLine(this.svg_class, "10", "1", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
    start_event() {
        this.line_1.event_in();
        this.line_2.event_in();
    }
    end_event() {
        this.line_1.event_out();
        this.line_2.event_out();
    }
}
class CreateUndo_SVG_Indicator extends Other_SVG_Indicator {
    paths;
    constructor(container, id, text, hori_pos = "right_10px", vert_pos = "top_0px", tooltip_postition = "left") {
        super(container, id, 3, text, hori_pos, vert_pos, tooltip_postition);
        const svg_helper = new CreateSVGHelper();
        this.paths = [];
        const outer_curved_path = svg_helper.generateSVGArc(10, 10, 14, 12, 20, 0, 180, "Z");
        this.paths.push(new CreateSVGPath(this.svg_class, outer_curved_path, svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color, true));
        const inner_curved_path = svg_helper.generateSVGArc(7, 10, 14, 12, 20, 0, 180, "Z");
        this.paths.push(new CreateSVGPath(this.svg_class, inner_curved_path, svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.paths.push(new CreateSVGPath(this.svg_class, "M 2 4, L 8 6, L 8 2, Z", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color, true));
    }
    start_event() {
        for (const path of this.paths)
            path.event_in();
    }
    end_event() {
        for (const path of this.paths)
            path.event_out();
    }
}
class CreateRedo_SVG_Indicator extends Other_SVG_Indicator {
    paths;
    constructor(container, id, text, hori_pos = "right_10px", vert_pos = "top_0px", tooltip_postition = "left") {
        super(container, id, 3, text, hori_pos, vert_pos, tooltip_postition);
        const svg_helper = new CreateSVGHelper();
        this.paths = [];
        const outer_curved_path = svg_helper.generateSVGArc(10, 10, 14, 12, 20, 180, 180, "Z");
        this.paths.push(new CreateSVGPath(this.svg_class, outer_curved_path, svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color, true));
        const inner_curved_path = svg_helper.generateSVGArc(13, 10, 14, 12, 20, 180, 180, "Z");
        this.paths.push(new CreateSVGPath(this.svg_class, inner_curved_path, svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.paths.push(new CreateSVGPath(this.svg_class, "M 18 4, L 12 6, L 12 2, Z", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color, true));
    }
    start_event() {
        for (const path of this.paths)
            path.event_in();
    }
    end_event() {
        for (const path of this.paths)
            path.event_out();
    }
}
class CreateDelete_SVG_Indicator extends Other_SVG_Indicator {
    paths;
    lines;
    constructor(container, id, text, hori_pos = "right_10px", vert_pos = "top_0px", tooltip_postition = "left") {
        super(container, id, 8, text, hori_pos, vert_pos, tooltip_postition);
        this.paths.push(new CreateSVGPath(this.svg_class, "M 3 5, L 4 3, L 7 3, L 9 1, L 11 1, L 13 3, L 16 3, L 17 5", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color, true));
        this.paths.push(new CreateSVGPath(this.svg_class, "M 3 7, L 5 19, L 15 19, L 17 7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color, true));
        this.lines.push(new CreateSVGLine(this.svg_class, "7.5", "9", "7.5", "16", svg_vert_bar_color, svg_objects_strokeWidth, elem_col));
        this.lines.push(new CreateSVGLine(this.svg_class, "12.5", "9", "12.5", "16", svg_vert_bar_color, svg_objects_strokeWidth, elem_col));
    }
    start_event() {
        for (const path of this.paths)
            path.event_in();
        for (const line of this.lines)
            line.event_in();
    }
    end_event() {
        for (const path of this.paths)
            path.event_out();
        for (const line of this.lines)
            line.event_out();
    }
}
class CreateSubMenu {
    submenu;
    constructor() {
        this.submenu = document.createElement("div");
        this.submenu.id = "custom_sub_menu";
        this.submenu.style.position = "absolute";
        this.submenu.style.backgroundColor = genBackgroundColor;
        this.submenu.style.zIndex = `${Number(window.getComputedStyle(main_menu).zIndex) + 100}`;
        main_menu.appendChild(this.submenu);
    }
}
class CreateForm {
    form;
    container;
    width;
    constructor(container_, width) {
        this.container = container_;
        this.form = document.createElement("form");
        this.form.style.margin = "10px";
        this.container.appendChild(this.form);
        this.width = width;
    }
}
class CreateInputField {
    form_class;
    input;
    label;
    constructor(form_class, type = "text", textContent = type, id_ = _Miscellanous.getRanHex(16)) {
        this.form_class = form_class;
        const form = this.form_class.form;
        const clear_fix_div = document.createElement("div");
        clear_fix_div.style.overflow = "auto";
        this.label = document.createElement("label");
        this.label.setAttribute("for", id_);
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
class CreateXYZInputField {
    form_class;
    para;
    labelX;
    inputX;
    labelY;
    inputY;
    labelZ;
    inputZ;
    constructor(form_class, textContent = "Number x_y_z", instance) {
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
    tooltip_container_elem;
    tooltip_elem;
    tooltip_text_elem;
    tooltip_text_elem_id;
    vert_padding;
    width;
    tooltip_text_elem_orientation = "default";
    respect_anim;
    default_positioning;
    call_func;
    constructor(tooltip_container, tooltip, tooltip_text, vert_padding = 5, width, respect_animate = true) {
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
        };
        this.respect_anim = respect_animate;
        tooltip.appendChild(this.tooltip_text_elem);
    }
    change_vert_padding(vert_padding) {
        this.tooltip_text_elem.style.padding = `${vert_padding}px 0`;
        this.vert_padding = vert_padding;
        if (this.tooltip_text_elem_orientation === "left" || this.tooltip_text_elem_orientation === "right")
            this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
    }
    change_width(width) {
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
        this.call_func = () => { };
    }
    right_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
        this.tooltip_text_elem.style.left = "105%";
        this.tooltip_text_elem_orientation = "right";
        this.tooltip_text_elem.className = "tooltiptext_right";
        this.call_func = () => { };
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
            const helper = this.vertical_tooltip_helper(half_width, container_width);
            this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
            root.style.setProperty("--margin-left-percent", `${(half_width - helper.before + helper.after) / this.width * 100}%`);
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
            const helper = this.vertical_tooltip_helper(half_width, container_width);
            this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
            root.style.setProperty("--margin-left-percent", `${(half_width - helper.before + helper.after) / this.width * 100}%`);
        };
    }
    vertical_tooltip_helper(half_width, container_width) {
        const tooltip_margin_right = Number(window.getComputedStyle(this.tooltip_elem).marginRight.split("px")[0]);
        const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
        const after = half_width > (container_width - this.tooltip_elem.offsetLeft - tooltip_margin_right) ? half_width - tooltip_margin_right : 0;
        return { before: before, after: after };
    }
    call_function_in() {
        this.call_func();
        if (!isTouchDevice && (main_menu_animate || !this.respect_anim))
            this.tooltip_text_elem.style.visibility = "visible";
        if (isTouchDevice && (main_menu_animate || !this.respect_anim))
            this.tooltip_text_elem.style.visibility = "visible";
    }
    call_function_out() {
        if (!isTouchDevice && (main_menu_animate || !this.respect_anim))
            this.tooltip_text_elem.style.visibility = "hidden";
        if (isTouchDevice && (main_menu_animate || !this.respect_anim))
            this.tooltip_text_elem.style.visibility = "hidden";
    }
}
class DrawCanvas {
    static drawCount = 0;
    constructor() {
        this.drawCanvas();
        window.addEventListener("orientationchange", () => {
            const href = window.location.href;
            window.location.assign(href);
        });
        window.addEventListener("resize", () => {
            const _last = window.innerWidth > MODIFIED_PARAMS._LAST_CANVAS_WIDTH;
            const _last_helper = window.innerWidth > (MODIFIED_PARAMS._LAST_CANVAS_WIDTH + 15 + MODIFIED_PARAMS._SIDE_BAR_WIDTH);
            const _last_modifier = MODIFIED_PARAMS._CANVAS_WIDTH - MODIFIED_PARAMS._LAST_CANVAS_WIDTH >= 0;
            const modify_side_width = DEFAULT_PARAMS._SIDE_BAR_WIDTH < window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH;
            const process_modify = (((modify_side_width || _last_helper) && _last) && _last_modifier);
            MODIFIED_PARAMS._SIDE_BAR_WIDTH = process_modify ? window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH : DEFAULT_PARAMS._SIDE_BAR_WIDTH;
            MODIFIED_PARAMS._CANVAS_WIDTH = process_modify ? MODIFIED_PARAMS._CANVAS_WIDTH : Math.max(DEFAULT_PARAMS._CANVAS_WIDTH, window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15);
            MODIFIED_PARAMS._CANVAS_HEIGHT = Math.abs(window.innerHeight - 50 - nav_height);
            main_nav.style.width = `${window.innerWidth - 15}px`;
            this.drawCanvas(false);
        });
    }
    drawCanvas(set_last_canvas_width = true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const off_set_height = 15 + Number(window.getComputedStyle(nav).height.split("px")[0]);
        canvas.style.top = `${off_set_height}px`;
        svg_container.style.top = `${off_set_height}px`;
        main_menu.style.top = `${off_set_height}px`;
        ctx.globalAlpha = MODIFIED_PARAMS._GLOBAL_ALPHA;
        canvas.style.borderColor = MODIFIED_PARAMS._BORDER_COLOR;
        canvas.style.opacity = MODIFIED_PARAMS._CANVAS_OPACITY;
        canvas.style.backgroundColor = MODIFIED_PARAMS._CANVAS_BACKGROUND_COLOR;
        while (svg_container.firstChild)
            svg_container.removeChild(svg_container.firstChild);
        const canvas_border_width = Number(window.getComputedStyle(canvas).borderWidth.split("px")[0]);
        const main_menu_height = MODIFIED_PARAMS._CANVAS_HEIGHT + 2 * canvas_border_width;
        main_menu.style.height = `${main_menu_height}px`;
        if (!isTouchDevice) {
            const svg_canvas_main_menu = new CreateSVG(svg_container, "10", `${main_menu_height}`, "main_menu_line_drag", 1);
            const svg_canvas_main_menu_line_drag = new CreateSVGLineDrag(svg_canvas_main_menu, "0", "0", "0", `${main_menu_height}`, svg_vert_bar_color, "14", svg_hover_color);
            svg_canvas_main_menu_line_drag.dragFunction(this.canvas_main_menu_drag_function);
            svg_canvas_main_menu_line_drag.changeAcceleration(10);
        }
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
    canvas_main_menu_drag_function(deltaX, deltaY) {
        MODIFIED_PARAMS._CANVAS_WIDTH += deltaX;
        MODIFIED_PARAMS._SIDE_BAR_WIDTH -= deltaX;
        if (MODIFIED_PARAMS._CANVAS_WIDTH > DEFAULT_PARAMS._CANVAS_WIDTH && MODIFIED_PARAMS._SIDE_BAR_WIDTH > DEFAULT_PARAMS._SIDE_BAR_WIDTH)
            basicDrawFunction();
        else {
            MODIFIED_PARAMS._CANVAS_WIDTH -= deltaX;
            MODIFIED_PARAMS._SIDE_BAR_WIDTH += deltaX;
        }
    }
}
// From math_lib.ts/mathlib.js file
const _PROJ = new Projection();
const _CAMERA = new CameraObjects();
const _Quarternion = new Quarternion();
window.addEventListener("load", () => {
    new BasicSettings();
    new DrawCanvas();
    console.log(MODIFIED_PARAMS);
});
