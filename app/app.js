"use strict";
const pListCache = {};
const pArgCache = {};
const genBackgroundColor = "#888";
const root = document.querySelector(":root");
const nav = document.getElementsByTagName("nav")[0];
const main_nav = document.getElementById("main_nav");
main_nav.style.width = `${window.innerWidth - 15}px`;
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const svg_container = document.getElementById("container");
const main_menu = document.getElementById("main");
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
const svg_vert_bar_color = "#aaa";
const svg_objects_color = "#333";
const svg_hover_color = "#ccc";
const svg_objects_strokeWidth = "2";
var isTouchDevice = "ontouchstart" in window;
var isTouchDeviceToggleable = true;
const TouchMouseEventId = "Clicking";
const sendMessage = (function_name) => window.parent.postMessage(function_name);
const DEFAULT_PARAMS = {
    _GLOBAL_ALPHA: 1,
    _CANVAS_OPACITY: '1',
    _CANVAS_WIDTH: 100,
    _CANVAS_HEIGHT: 100,
    _LAST_CANVAS_WIDTH: 100,
    _BORDER_COLOR: '#aaa',
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
    _ACTIVE: "",
    _SIDE_BAR_WIDTH: 100,
};
const MODIFIED_PARAMS = JSON.parse(JSON.stringify(DEFAULT_PARAMS));
//const catmull_clark_subdivision_worker = new Worker("catmull_clark_worker.js");
const worker_script = `
    onmessage = (e) => {
        console.log(e.data)
      
        postMessage("goodluck");
      };
    `;
const blob = new Blob([worker_script], { type: 'application/javascript' });
const blobURL = URL.createObjectURL(blob);
const chunkify = new Worker(blobURL);
chunkify.postMessage("hello");
chunkify.onmessage = (e) => {
    console.log(e.data);
};
URL.revokeObjectURL(blobURL);
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
const implementDrag = (function () {
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
})();
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
        for (const point of points) {
            if (minX > point.x)
                minX = point.x;
            if (maxX < point.x)
                maxX = point.x;
            if (minY > point.y)
                minY = point.y;
            if (maxY < point.y)
                maxY = point.y;
            if (minZ > point.z)
                minZ = point.z;
            if (maxZ < point.z)
                maxZ = point.z;
        }
        return [minX, maxX, minY, maxY, minZ, maxZ];
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
                const [xmin, xmax, ymin, ymax, zmin, zmax] = this.getMinMax(face_points);
                const average_point = new Point3D((xmin + xmax) * 0.5, (ymin + ymax) * 0.5, (zmin + zmax) * 0.5);
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
        for (let child of main_nav.children) {
            const _child = document.getElementById(child.id);
            if (_child.id !== TouchMouseEventId) {
                if (numero === 0)
                    this.modifyState(child.id, _child, true);
                numero++;
                _child.addEventListener("mouseenter", () => { this.hoverState(child.id, _child); });
                _child.addEventListener("mouseout", () => { this.unhoverState(child.id, _child); });
                _child.addEventListener("click", () => { this.modifyState(child.id, _child); });
            }
            else
                _child.addEventListener("click", () => this.toggleMouseTouchEvent());
        }
    }
    toggleMouseTouchEvent() {
        if (isTouchDeviceToggleable) {
            const elem = document.getElementById(TouchMouseEventId);
            elem.style.backgroundColor = "#4CAF50";
            if (isTouchDevice === true) {
                isTouchDevice = false;
                setTimeout((() => {
                    elem.style.backgroundColor = "#333";
                }), 500);
            }
            else {
                isTouchDevice = true;
                setTimeout((() => {
                    elem.style.backgroundColor = "#333";
                }), 500);
            }
            this.displayMouseTouchEvent();
        }
    }
    displayMouseTouchEvent() {
        const elem = document.getElementById(TouchMouseEventId);
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
        MODIFIED_PARAMS._SIDE_BAR_WIDTH = window.innerWidth / 4;
        var width = window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15;
        MODIFIED_PARAMS._CANVAS_WIDTH = width;
        MODIFIED_PARAMS._CANVAS_HEIGHT = window.innerHeight - 100;
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
            MODIFIED_PARAMS._HANDEDNESS_CONSTANT = -1;
        else if (value === 'right')
            MODIFIED_PARAMS._HANDEDNESS_CONSTANT = 1;
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
    unhoverState(value, elem) {
        if (value !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = "#333";
        }
    }
    hoverState(value, elem) {
        if (value !== MODIFIED_PARAMS._ACTIVE) {
            elem.style.backgroundColor = "#111";
        }
    }
    modifyState(value, elem, first = false) {
        if (value !== MODIFIED_PARAMS._ACTIVE) {
            MODIFIED_PARAMS._ACTIVE = value;
            this.refreshState();
            elem.style.backgroundColor = "#4CAF50";
            if (first === false)
                this._last_active.style.backgroundColor = "#333";
            this._last_active = elem;
            sendMessage(value);
        }
    }
    refreshState() { }
}
class CreateSVG {
    svg;
    svg_ns;
    max_child_elem_count;
    constructor(container, width, height, max_child_element_count = 1) {
        const svgNS = "http://www.w3.org/2000/svg";
        const _svg = document.createElementNS(svgNS, "svg");
        this.svg = _svg;
        this.svg_ns = svgNS;
        this.max_child_elem_count = max_child_element_count;
        _svg.setAttribute("width", width);
        _svg.setAttribute("height", height);
        container.appendChild(_svg);
    }
}
class CreateSVGPath {
    path;
    path_ns;
    constructor(svg_class, d, stroke, strokeWidth, hover_color) {
        const _path = document.createElementNS(svg_class.svg_ns, "path");
        this.path = _path;
        this.path_ns = svg_class.svg_ns;
        _path.setAttribute("d", d);
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_path);
            svg_class.svg.addEventListener("mousemove", () => { if (!isTouchDevice)
                _path.setAttribute("stroke", hover_color); });
            svg_class.svg.addEventListener("mouseout", () => { if (!isTouchDevice)
                _path.setAttribute("stroke", stroke); });
            svg_class.svg.addEventListener("touchstart", () => { if (isTouchDevice)
                _path.setAttribute("stroke", hover_color); }, { "passive": true });
            svg_class.svg.addEventListener("touchend", () => { if (isTouchDevice)
                _path.setAttribute("stroke", stroke); }, { "passive": true });
        }
    }
}
class CreateSVGLine {
    line;
    line_ns;
    constructor(svg_class, x1, y1, x2, y2, stroke, strokeWidth, hover_color) {
        const _line = document.createElementNS(svg_class.svg_ns, "line");
        this.line = _line;
        this.line_ns = svg_class.svg_ns;
        _line.setAttribute("x1", x1);
        _line.setAttribute("y1", y1);
        _line.setAttribute("x2", x2);
        _line.setAttribute("y2", y2);
        _line.setAttribute("stroke", stroke);
        _line.setAttribute("stroke-width", strokeWidth);
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_line);
            svg_class.svg.addEventListener("mousemove", () => { if (!isTouchDevice)
                _line.setAttribute("stroke", hover_color); });
            svg_class.svg.addEventListener("mouseout", () => { if (!isTouchDevice)
                _line.setAttribute("stroke", stroke); });
            svg_class.svg.addEventListener("touchstart", () => { if (isTouchDevice)
                _line.setAttribute("stroke", hover_color); }, { "passive": true });
            svg_class.svg.addEventListener("touchend", () => { if (isTouchDevice)
                _line.setAttribute("stroke", stroke); }, { "passive": true });
        }
    }
}
class CreateSVGCircle {
    circle;
    circle_ns;
    constructor(svg_class, cx, cy, r, stroke, strokeWidth, hover_color, fill) {
        const _circle = document.createElementNS(svg_class.svg_ns, "circle");
        this.circle = _circle;
        this.circle_ns = svg_class.svg_ns;
        _circle.setAttribute("cx", cx);
        _circle.setAttribute("cy", cy);
        _circle.setAttribute("r", r);
        _circle.setAttribute("stroke", stroke);
        _circle.setAttribute("stroke-width", strokeWidth);
        _circle.setAttribute("fill", fill);
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_circle);
            svg_class.svg.addEventListener("mousemove", () => { if (!isTouchDevice)
                _circle.setAttribute("stroke", hover_color); });
            svg_class.svg.addEventListener("mouseout", () => { if (!isTouchDevice)
                _circle.setAttribute("stroke", stroke); });
            svg_class.svg.addEventListener("touchstart", () => { if (isTouchDevice)
                _circle.setAttribute("stroke", hover_color); }, { "passive": true });
            svg_class.svg.addEventListener("touchend", () => { if (isTouchDevice)
                _circle.setAttribute("stroke", stroke); }, { "passive": true });
            svg_class.svg.addEventListener("mousemove", () => { if (!isTouchDevice)
                _circle.setAttribute("fill", hover_color); });
            svg_class.svg.addEventListener("mouseout", () => { if (!isTouchDevice)
                _circle.setAttribute("fill", fill); });
            svg_class.svg.addEventListener("touchstart", () => { if (isTouchDevice)
                _circle.setAttribute("fill", hover_color); }, { "passive": true });
            svg_class.svg.addEventListener("touchend", () => { if (isTouchDevice)
                _circle.setAttribute("fill", fill); }, { "passive": true });
        }
    }
}
class CreateSVGEllipse {
    ellipse;
    ellipse_ns;
    constructor(svg_class, cx, cy, rx, ry, stroke, strokeWidth, hover_color, fill) {
        const _ellipse = document.createElementNS(svg_class.svg_ns, "ellipse");
        this.ellipse = _ellipse;
        this.ellipse_ns = svg_class.svg_ns;
        _ellipse.setAttribute("cx", cx);
        _ellipse.setAttribute("cy", cy);
        _ellipse.setAttribute("rx", rx);
        _ellipse.setAttribute("ry", ry);
        _ellipse.setAttribute("stroke", stroke);
        _ellipse.setAttribute("stroke-width", strokeWidth);
        _ellipse.setAttribute("fill", fill);
        if (svg_class.svg.childElementCount < svg_class.max_child_elem_count) {
            svg_class.svg.appendChild(_ellipse);
            svg_class.svg.addEventListener("mousemove", () => { if (!isTouchDevice)
                _ellipse.setAttribute("stroke", hover_color); });
            svg_class.svg.addEventListener("mouseout", () => { if (!isTouchDevice)
                _ellipse.setAttribute("stroke", stroke); });
            svg_class.svg.addEventListener("touchstart", () => { if (isTouchDevice)
                _ellipse.setAttribute("stroke", hover_color); }, { "passive": true });
            svg_class.svg.addEventListener("touchend", () => { if (isTouchDevice)
                _ellipse.setAttribute("stroke", stroke); }, { "passive": true });
            svg_class.svg.addEventListener("mousemove", () => { if (!isTouchDevice)
                _ellipse.setAttribute("fill", hover_color); });
            svg_class.svg.addEventListener("mouseout", () => { if (!isTouchDevice)
                _ellipse.setAttribute("fill", fill); });
            svg_class.svg.addEventListener("touchstart", () => { if (isTouchDevice)
                _ellipse.setAttribute("fill", hover_color); }, { "passive": true });
            svg_class.svg.addEventListener("touchend", () => { if (isTouchDevice)
                _ellipse.setAttribute("fill", fill); }, { "passive": true });
        }
    }
}
class CreateSVGLineDrag extends CreateSVGLine {
    implement_drag;
    constructor(svg_class, x1, y1, x2, y2, stroke, strokeWidth, hover_color) {
        super(svg_class, x1, y1, x2, y2, stroke, strokeWidth, hover_color);
        this.implement_drag = implementDrag;
        if (svg_class.max_child_elem_count === 1) {
            this.implement_drag.start(svg_class.svg, this.dragFunction);
            this.changeAcceleration(10);
        }
    }
    dragFunction(deltaX, deltaY) {
        MODIFIED_PARAMS._CANVAS_WIDTH += deltaX;
        MODIFIED_PARAMS._SIDE_BAR_WIDTH -= deltaX;
        if (MODIFIED_PARAMS._CANVAS_WIDTH > DEFAULT_PARAMS._CANVAS_WIDTH && MODIFIED_PARAMS._SIDE_BAR_WIDTH > DEFAULT_PARAMS._SIDE_BAR_WIDTH)
            basicDrawFunction();
        else {
            MODIFIED_PARAMS._CANVAS_WIDTH -= deltaX;
            MODIFIED_PARAMS._SIDE_BAR_WIDTH += deltaX;
        }
    }
    changeAcceleration(acceleration) {
        this.implement_drag.changeAcc(acceleration);
    }
}
class DrawCanvas {
    static drawCount = 0;
    constructor() {
        this.drawCanvas();
        window.addEventListener("resize", () => {
            const _last = window.innerWidth > MODIFIED_PARAMS._LAST_CANVAS_WIDTH;
            const _last_helper = window.innerWidth > (MODIFIED_PARAMS._LAST_CANVAS_WIDTH + 15 + MODIFIED_PARAMS._SIDE_BAR_WIDTH);
            const _last_modifier = MODIFIED_PARAMS._CANVAS_WIDTH - MODIFIED_PARAMS._LAST_CANVAS_WIDTH >= 0;
            const modify_side_width = DEFAULT_PARAMS._SIDE_BAR_WIDTH < window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH;
            const process_modify = (((modify_side_width || _last_helper) && _last) && _last_modifier);
            MODIFIED_PARAMS._SIDE_BAR_WIDTH = process_modify ? window.innerWidth - 15 - MODIFIED_PARAMS._CANVAS_WIDTH : DEFAULT_PARAMS._SIDE_BAR_WIDTH;
            MODIFIED_PARAMS._CANVAS_WIDTH = process_modify ? MODIFIED_PARAMS._CANVAS_WIDTH : Math.max(DEFAULT_PARAMS._CANVAS_WIDTH, window.innerWidth - MODIFIED_PARAMS._SIDE_BAR_WIDTH - 15);
            MODIFIED_PARAMS._CANVAS_HEIGHT = Math.abs(window.innerHeight - 100);
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
        while (svg_container.firstChild)
            svg_container.removeChild(svg_container.firstChild);
        const canvas_border_width = Number(window.getComputedStyle(canvas).borderWidth.split("px")[0]);
        const svg_child = new CreateSVG(svg_container, "10", `${MODIFIED_PARAMS._CANVAS_HEIGHT + 2 * canvas_border_width}`);
        new CreateSVGLineDrag(svg_child, "0", "0", "0", `${MODIFIED_PARAMS._CANVAS_HEIGHT + 2 * canvas_border_width}`, svg_vert_bar_color, "14", svg_hover_color);
        main_menu.style.height = `${MODIFIED_PARAMS._CANVAS_HEIGHT + 2 * canvas_border_width}px`;
        main_nav.style.width = `${window.innerWidth - 15}px`;
        basicDrawFunction(set_last_canvas_width);
        DrawCanvas.drawCount++;
    }
}
window.onload = function () {
    const _BasicSettings = new BasicSettings();
    _BasicSettings.setGlobalAlpha(0.6);
    const _DrawCanvas = new DrawCanvas();
};
