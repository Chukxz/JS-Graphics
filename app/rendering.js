window.parent.addEventListener("message", (e) => { if (e.data === "Rendering")
    render(); });
class GetNumberFromString {
    string_;
    number_;
    convertible_;
    res;
    constructor(_string_) {
        this.string_ = _string_;
        this.number_ = Number(_string_);
        if (Number.isFinite(this.number_))
            this.convertible_ = true;
        if (this.convertible_ === true)
            if (this.string_ !== `${this.number_}`)
                this.convertible_ = false;
        this.res = this.convertible_ === true ? this.number_ : null;
    }
}
class Dragging {
    start_instance_number;
    current_instance_number;
    direction;
    show;
    constructor() {
        this.direction = "d";
        this.start_instance_number = -1;
        this.current_instance_number = -1;
    }
    drag(ev, instance_number) {
        this.start_instance_number = instance_number;
        _CAMERA.camera_objects.object_dict[this.start_instance_number].object.blank = true;
    }
    allowDrop(ev) {
        ev.preventDefault();
        const id_list = ev.target.id.split("_");
        if (id_list.length > 1) {
            const potential_instance = id_list[1];
            const check_instance = new GetNumberFromString(potential_instance).res;
            if (check_instance !== null) {
                this.direction = _CAMERA.camera_objects.getDirection(this.start_instance_number, check_instance);
                if (check_instance !== this.current_instance_number) {
                    this.current_instance_number = check_instance;
                    this.insertObject();
                }
            }
        }
    }
    drop(ev) {
        this.insertObject();
        _CAMERA.camera_objects.object_dict[this.start_instance_number].object.blank = false;
        if (camera_indicator)
            camera_indicator.showCameras();
    }
    insertObject() { }
}
class CameraDragging extends Dragging {
    constructor() { super(); }
    insertObject() {
        _CAMERA.camera_objects.moveObject(this.start_instance_number, this.current_instance_number, this.direction);
        console.log(this.direction, this.start_instance_number, this.current_instance_number, _CAMERA.camera_objects.object_dict[this.start_instance_number].object.blank);
    }
}
const cam_dragging = new CameraDragging();
function render() {
    while (main_menu.firstChild)
        main_menu.removeChild(main_menu.firstChild);
    create_main_menu_divider = true;
    general_projection = new CreateCameraProjection_SVG_Indicator(main_menu, "gen-proj");
    cross_indicator = new CreateCross_SVG_Indicator(main_menu, "cross", "Add Cameras");
    const menu_header = document.createElement("p");
    menu_header.style.paddingLeft = "10px";
    menu_header.className = "custom_menu_header with_cross_hairs";
    menu_header.textContent = "Cameras";
    menu_header.style.fontWeight = "bold";
    main_menu.appendChild(menu_header);
    const overall_camera_div = document.createElement("div");
    overall_camera_div.id = "overall_camera_div";
    overall_camera_div.className = "container_div";
    overall_camera_div.style.position = "absolute";
    overall_camera_div.style.zIndex = "inherit";
    if (svg_main_menu_divider_top < 0)
        svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    root.style.setProperty("--container-div-height", `${svg_main_menu_divider_top - 80}px`);
    overall_camera_div.style.overflowX = "hidden";
    overall_camera_div.style.overflowY = "auto";
    main_menu.appendChild(overall_camera_div);
    sub_menu = new CreateSubMenu().submenu;
    undo = new CreateUndo_SVG_Indicator(sub_menu, "undo", "Undo", "left_2px", "top_0px", "right");
    redo = new CreateRedo_SVG_Indicator(sub_menu, "redo", "Redo", "right_2px", "top_0px", "left");
    camera_indicator = new CameraIndicator(overall_camera_div, sub_menu);
    basicDrawFunction();
}
class CameraIndicator extends CreateSubMenuContent {
    camera_container;
    menu_container;
    look_at_pos;
    cam_pos;
    constructor(container, menu_container) {
        super(menu_container);
        this.camera_container = container;
        this.menu_container = menu_container;
        this.showCameras();
    }
    refreshInstance(instance) {
        this.instance_para.innerHTML = `Camera : ${instance}`;
        _CAMERA.current_camera_instance = instance;
    }
    showCameras(additional = true) {
        while (this.camera_container.firstChild)
            this.camera_container.removeChild(this.camera_container.firstChild);
        const sub_container = document.createElement("div");
        sub_container.id = "camera-container";
        sub_container.style.margin = "2px 10px";
        this.camera_container.appendChild(sub_container);
        sub_container.addEventListener("dragover", (ev) => { cam_dragging.allowDrop(ev); });
        sub_container.addEventListener("drop", (ev) => { cam_dragging.drop(ev); });
        for (const camera_object_instance in _CAMERA.camera_objects.object_dict) {
            ;
            this.showCamera(sub_container, camera_object_instance);
        }
        this.refreshInstance(_CAMERA.current_camera_instance);
        camera_ui_handler();
        //this.svg_class.svg.addEventListener("click", (()=>console.log(tooltip_text)))
    }
    showCamera(sub_container, camera_instance) {
        const camera = _CAMERA.camera_objects.object_dict[camera_instance].object;
        const instance = camera.instance.instance_number;
        const blank = camera.blank;
        const cam_div = document.createElement("div");
        cam_div.style.clear = "both";
        cam_div.className = "camera_div";
        cam_div.draggable = true;
        sub_container.appendChild(cam_div);
        const cam = document.createElement("p");
        cam.className = "camera";
        cam.id = `camera-para_${instance}`;
        cam.textContent = "";
        cam.style.color = "#fff";
        cam.style.padding = "5px";
        cam.style.cursor = "pointer";
        cam.style.overflowX = "clip";
        cam.style.float = "left";
        if (blank)
            cam.style.backgroundColor = svg_vert_bar_color;
        else
            cam.style.backgroundColor = elem_hover_col;
        cam.style.borderRadius = "8px";
        cam_div.appendChild(cam);
        cam_div.addEventListener("dragstart", (ev) => { cam_dragging.drag(ev, instance); });
        let _col = elem_hover_col;
        let _h_col = svg_del_color;
        if (Object.keys(_CAMERA.camera_objects.object_dict).length === 1) {
            _col = svg_vert_bar_color;
            _h_col = svg_vert_bar_color;
        }
        cam.addEventListener("click", () => { this.clickCamera(instance); });
        const projection_type = _CAMERA.camera_objects.object_dict[instance].object.instance._PROJ_TYPE;
        const svg_class_rm = new CreateSVG(cam_div, "20", "20", "camera-remove_" + instance, 6);
        svg_class_rm.svg.style.marginTop = "18px";
        svg_class_rm.svg.style.float = "right";
        _CAMERA.camera_objects.object_dict[instance].object.delete = new CreateSVGDelete(svg_class_rm, "M 3 3, L 17 17", "M 3 17, L 17 3", _col, svg_objects_strokeWidth, _h_col);
        const svg_class_proj = new CreateSVG(cam_div, "20", "20", "camera-proj_" + instance, 6);
        svg_class_proj.svg.style.marginTop = "18px";
        svg_class_proj.svg.style.float = "right";
        svg_class_proj.svg.style.marginRight = "2px";
        if (projection_type === "Orthographic") {
            _CAMERA.camera_objects.object_dict[instance].object.projection = new CreateSVGCameraProjection(svg_class_proj, "M 7 2, L 18 2, L 18 12, L 7 12, Z", "M 2 8, L 13 8, L 13 18, L 2 18, Z", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        }
        else if (projection_type === "Perspective") {
            _CAMERA.camera_objects.object_dict[instance].object.projection = new CreateSVGCameraProjection(svg_class_proj, "M 9 3, L 17 3, L 17 10, L 9 10, Z", "M 1 8, L 13 8, L 13 19, L 1 19, Z", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        }
        const svg_class_cam_icon = new CreateSVG(cam_div, "20", "20", "camera-icon_" + instance, 1);
        svg_class_cam_icon.svg.style.marginTop = "18px";
        svg_class_cam_icon.svg.style.float = "right";
        svg_class_cam_icon.svg.style.marginRight = "2px";
        svg_class_cam_icon.svg.style.display = "none";
        _CAMERA.camera_objects.object_dict[instance].object.icon = new CreateSVGCameraIcon(svg_class_cam_icon, svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
    removeCamera(instance) {
        _CAMERA.deleteCameraObject(instance);
    }
    toggleProjType(instance) {
        const projection_type = _CAMERA.camera_objects.object_dict[instance].object.instance._PROJ_TYPE;
        if (projection_type === "Orthographic") {
            _CAMERA.camera_objects.object_dict[instance].object.instance._PROJ_TYPE = "Perspective";
        }
        else if (projection_type === "Perspective") {
            _CAMERA.camera_objects.object_dict[instance].object.instance._PROJ_TYPE = "Orthographic";
        }
        _PROJ.setProjectionParam();
    }
    clickCamera(instance) {
        this.refreshInstance(instance);
        console.log(_CAMERA.camera_objects.object_dict, _CAMERA.current_camera_instance);
    }
}
function gridRender() {
    const a = MODIFIED_PARAMS._CANVAS_WIDTH;
    const b = MODIFIED_PARAMS._FZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const c = MODIFIED_PARAMS._FZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(a,b,c,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_3 = new Point3D(a, b, c);
    const e = 0;
    const f = MODIFIED_PARAMS._FZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const g = MODIFIED_PARAMS._FZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(e,f,g,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_4 = new Point3D(e, f, g);
    const h = MODIFIED_PARAMS._CANVAS_WIDTH;
    const i = MODIFIED_PARAMS._NZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const j = MODIFIED_PARAMS._NZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(h,i,j,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_2 = new Point3D(h, i, j);
    const k = 0;
    const l = MODIFIED_PARAMS._NZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const m = MODIFIED_PARAMS._NZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(k,l,m,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_1 = new Point3D(k, l, m);
    //const points = [p_1,p_2,p_3,p_4];
}
// function renderGrid(points_list : Point3D[]) {
//   for(let point in points_list){
//     const a = points_list[point];
//     const b = points_list[Number(point+1)%points_list.length];
//     const s_t_c_a = new ScreenSpace().screenToClip([a.x,a.y,a.z,1]);
//     const o_t_c_a = new ClipSpace().opticalObjectToClip(s_t_c_a);
//     const c_t_s_a = new ScreenSpace().clipToScreen(o_t_c_a);
//     const s_t_c_b = new ScreenSpace().screenToClip([b.x,b.y,b.z,1]);
//     const o_t_c_b = new ClipSpace().opticalObjectToClip(s_t_c_b);
//     const c_t_s_b = new ScreenSpace().clipToScreen(o_t_c_b);
//     if(typeof c_t_s_a === "undefined" || typeof c_t_s_b === "undefined") continue;
//     console.log(MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
//     console.log("Point A : ", a, " Point B : ", b)
//     console.log("stca : ", s_t_c_b, " stcb : ", s_t_c_b)
//     console.log("ctsa : ", c_t_s_a, " ctsb : ", c_t_s_b)
//     const [c_t_s_a_2D, c_t_s_b_2D] = new Miscellanous().vecs4DToPoints2D([c_t_s_a,c_t_s_b]);
//     //drawPoint(c_t_s_a_2D)
//     drawLine(c_t_s_a_2D,c_t_s_b_2D);
//   }
// }
class Draw {
    constructor() { }
    drawPoint(point, _strokeStyle = "black", _lineWidth = 1, _fillStyle = "black") {
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = _fillStyle;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    drawVertex(vertex, _strokeStyle = "black", _lineWidth = 1, _fillStyle = "black") {
        const z = vertex[2];
        if (z < MODIFIED_PARAMS._MIN_Z || z > MODIFIED_PARAMS._MAX_Z)
            return;
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;
        ctx.arc(vertex[0], vertex[1], 3, 0, 2 * Math.PI);
        ctx.fillStyle = _fillStyle;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    lineDraw(a, b, _strokeStyle = "black", _lineWidth = 2) {
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.closePath();
    }
    drawLine(a, b, _strokeStyle = "black", _lineWidth = 2) {
        if (typeof a === "undefined" || typeof b === "undefined")
            return;
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
        ctx.closePath();
    }
    xToCanvas(val) { return ((val / Math.abs(val)) * MODIFIED_PARAMS._HALF_X) + MODIFIED_PARAMS._HALF_X; }
    ;
    yToCanvas(val) { return ((val / Math.abs(val)) * -MODIFIED_PARAMS._HALF_Y) + MODIFIED_PARAMS._HALF_Y; }
    ;
    frustrum_to_canvas(t_b_r_l) {
        const [_t, _b, _r, _l] = t_b_r_l;
        return [
            this.yToCanvas(_t),
            this.yToCanvas(_b),
            this.xToCanvas(_r),
            this.xToCanvas(_l)
        ];
    }
    drawProjBounds(t_b_r_l, _strokeStyle = "black", line_Width = 2) {
        const [_t, _b, _r, _l] = t_b_r_l;
        const t = this.yToCanvas(_t);
        const b = this.yToCanvas(_b);
        const r = this.xToCanvas(_r);
        const l = this.xToCanvas(_l);
        const projection_type = _CAMERA.camera_objects[_CAMERA.current_camera_instance].instance._PROJ_TYPE;
        if (projection_type === "Orthographic")
            console.log(t, b, r, l, "orth t_b_r_l");
        if (projection_type === "Perspective")
            console.log(t, b, r, l, "pers t_b_r_l");
        this.drawBounds(l, t, l, b, _strokeStyle, line_Width);
        this.drawBounds(r, t, r, b, _strokeStyle, line_Width);
        this.drawBounds(l, t, r, t, _strokeStyle, line_Width);
        this.drawBounds(l, b, r, b, _strokeStyle, line_Width);
    }
    drawBounds(x1, y1, x2, y2, _strokeStyle = "black", _lineWidth = 2) {
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
    drawObject(object_vertices) {
        if (!object_vertices)
            return;
        for (const vertex in object_vertices.vertices)
            this.drawVertex(_ViewSpace.NDCToCanvas(object_vertices.vertices[vertex]));
        const half_edges = structuredClone(object_vertices.object.mesh.HalfEdgeDict);
        for (const edge in half_edges) {
            const [a, b] = edge.split("-").map((value) => _ViewSpace.NDCToCanvas(object_vertices.vertices[value]));
            this.drawLine(a, b);
        }
    }
}
const _Draw = new Draw();
