window.parent.addEventListener("message",(e) => { if(e.data === "Rendering") render(); });

function render() {
    while(main_menu.firstChild)main_menu.removeChild(main_menu.firstChild);
    create_main_menu_divider = true;

    const svg_class_proj = new CreateSVG(main_menu, "20","20",6);
    svg_class_proj.svg.style.marginTop = "18px";
    svg_class_proj.svg.style.float = "right";
    svg_class_proj.svg.style.marginRight = "5px";
    
    const general_projection = new CreateCameraProjection_SVG_Indicator(main_menu);
    general_projection.clickFunction();

    const cross_indicator = new CreateCross_SVG_Indicator(main_menu,"Add Camera");

    const menu_header = document.createElement("p");
    menu_header.className = "custom_menu_header with_cross_hairs";
    menu_header.textContent = "Camera Objects";
    menu_header.style.paddingLeft = "10px";
    main_menu.appendChild(menu_header);

    const overall_camera_div = document.createElement("div");
    overall_camera_div.id = "overall_camera_div";
    overall_camera_div.className = "container_div";
    overall_camera_div.style.zIndex = "inherit";
    if(svg_main_menu_divider_top < 0) svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    console.log(svg_main_menu_divider_top)
    root.style.setProperty("--container-div-height",`${svg_main_menu_divider_top - 80}px`);
    overall_camera_div.style.overflowX = "hidden";
    overall_camera_div.style.overflowY = "auto";
    main_menu.appendChild(overall_camera_div);

    sub_menu = new CreateSubMenu().submenu;

    const undo = new CreateUndo_SVG_Indicator(sub_menu, "Undo","left_2px","top_0px","right")
    const redo = new CreateRedo_SVG_Indicator(sub_menu, "Redo", "right_2px","top_0px", "left");

    const camera_indicator = new CameraIndicator(overall_camera_div, sub_menu);    

    const crossClick = () => {
        _CAMERA.createNewCameraObject();
        camera_indicator.showCameras();
    }

    cross_indicator.clickFunction(crossClick);

    basicDrawFunction()
}

class CreateSubMenuContent{
    instance_para : HTMLParagraphElement;
    sub_menu_container : HTMLDivElement;

    constructor(container : HTMLDivElement){
        this.sub_menu_container = document.createElement("div");
        this.sub_menu_container.style.margin = "40px 0 0 10px";
        container.appendChild(this.sub_menu_container);

        this.instance_para = document.createElement("p");
        this.sub_menu_container.appendChild(this.instance_para);
    }

    refreshInstance(instance : number){
        this.instance_para.innerHTML = `Current Camera Instance : ${instance}`;
        _CAMERA.current_camera_instance = instance;
    }
}

class CameraIndicator extends CreateSubMenuContent {
    camera_objects: CameraObject[];
    camera_container: HTMLDivElement;
    menu_container : HTMLDivElement;

    constructor (container: HTMLDivElement, menu_container : HTMLDivElement) {
        super(menu_container);
        this.camera_container = container;
        this.menu_container = container;
        this.showCameras();
    }

    showCameras() {
        while(this.camera_container.firstChild) this.camera_container.removeChild(this.camera_container.firstChild);
        this.camera_objects = _CAMERA.camera_objects_array;
        const sub_container = document.createElement("div");
        sub_container.style.margin = "10px";
        this.camera_container.appendChild(sub_container);

        var index = 0;
        for(const camera_object of this.camera_objects) {
            this.showCamera(sub_container,camera_object,index);
            index++;
        }

        camera_ui_handler();
        this.refreshInstance(_CAMERA.current_camera_instance);
        //this.svg_class.svg.addEventListener("click", (()=>console.log(tooltip_text)))
    }

    showCamera(sub_container: HTMLDivElement,camera: CameraObject, index:number) {

        const cam_div = document.createElement("div");
        cam_div.style.clear = "both";
        cam_div.className = "camera_div";
        sub_container.appendChild(cam_div);

        const cam = document.createElement("p");
        cam.className = "camera";
        const instance = camera.instance.instance_number;
        cam.id = `${instance}`;
        cam.textContent = "";
        cam.style.color = "#fff";
        cam.style.padding = "5px";
        cam.style.cursor = "pointer";
        cam.style.overflowX = "clip";
        cam.style.float = "left";
        cam.style.backgroundColor = elem_hover_col;
        cam.style.borderRadius = "8px";
        cam_div.appendChild(cam);

        let _col = elem_hover_col;
        let _h_col = svg_del_color;
        if(this.camera_objects.length === 1) {
            _col = svg_vert_bar_color;
            _h_col = svg_vert_bar_color;
        }

        cam.addEventListener("click",() => {this.clickCamera(instance)});
        const projection_type : _PROJ_TYPE_ = _CAMERA.camera_objects_array[index].instance._PROJ_TYPE;
        const instance_number_input = Number(cam.id);

        const svg_class_rm = new CreateSVG(cam_div, "20","20",6);
        svg_class_rm.svg.style.marginTop = "18px";
        svg_class_rm.svg.style.float = "right";
        const remove = new CreateSVGDelete(svg_class_rm, "M 3 3, L 17 17", "M 3 17, L 17 3", _col, svg_objects_strokeWidth, _h_col);
        remove.clickFunction(instance_number_input,this);

        const svg_class_proj = new CreateSVG(cam_div, "20","20",6);
        svg_class_proj.svg.style.marginTop = "18px";
        svg_class_proj.svg.style.float = "right";
        svg_class_proj.svg.style.marginRight = "2px";
        let projection : CreateSVGCameraProjection | undefined = undefined;

        if (projection_type === "Orthographic"){
            projection = new CreateSVGCameraProjection(svg_class_proj,"M 7 2, L 18 2, L 18 12, L 7 12, Z","M 2 8, L 13 8, L 13 18, L 2 18, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
        }
        else if(projection_type === "Perspective"){
            projection = new CreateSVGCameraProjection(svg_class_proj,"M 9 3, L 17 3, L 17 10, L 9 10, Z","M 1 8, L 13 8, L 13 19, L 1 19, Z",svg_objects_color,svg_objects_strokeWidth,svg_hover_color);
        }

        if(typeof projection !== "undefined") projection.clickFunction(instance_number_input, projection_type, this);

        const svg_class_cam_icon = new CreateSVG(cam_div, "20","20",1);
        svg_class_cam_icon.svg.style.marginTop = "18px";
        svg_class_cam_icon.svg.style.float = "right";
        svg_class_cam_icon.svg.style.marginRight = "2px";
        svg_class_cam_icon.svg.style.display = "none";
        const cam_icon = new CreateSVGCameraIcon(svg_class_cam_icon,svg_objects_color,svg_objects_strokeWidth,svg_hover_color)
    }

    removeCamera(instance : number){
        _CAMERA.deleteCameraObject(instance);
    }

    changeProjType(instance : number, projection_type : _PROJ_TYPE_){
        const index = _CAMERA.instance_number_to_list_map[instance];

        if(projection_type === "Orthographic"){
            _CAMERA.camera_objects_array[index].instance._PROJ_TYPE = "Perspective";
        }
        else if(projection_type === "Perspective"){
            _CAMERA.camera_objects_array[index].instance._PROJ_TYPE = "Orthographic";
        }

        _PROJ.setProjectionParam();
    }

    clickCamera(instance : number){
        this.refreshInstance(instance);
        console.log(_CAMERA.instance_number_to_list_map,_CAMERA.current_camera_instance)
    }
}

function gridRender() {
    const a = MODIFIED_PARAMS._CANVAS_WIDTH;
    const b = MODIFIED_PARAMS._FZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const c = MODIFIED_PARAMS._FZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(a,b,c,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_3 = new Point3D(a,b,c);

    const e = 0;
    const f = MODIFIED_PARAMS._FZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const g = MODIFIED_PARAMS._FZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(e,f,g,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_4 = new Point3D(e,f,g);

    const h = MODIFIED_PARAMS._CANVAS_WIDTH;
    const i = MODIFIED_PARAMS._NZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const j = MODIFIED_PARAMS._NZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(h,i,j,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_2 = new Point3D(h,i,j);

    const k = 0;
    const l = MODIFIED_PARAMS._NZ * Math.sin(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    const m = MODIFIED_PARAMS._NZ * Math.cos(MODIFIED_PARAMS._ANGLE_CONSTANT * MODIFIED_PARAMS._GRID_VERT_THETA);
    // console.log(k,l,m,MODIFIED_PARAMS._ASPECT_RATIO,MODIFIED_PARAMS._CANVAS_WIDTH,MODIFIED_PARAMS._CANVAS_HEIGHT);
    const p_1 = new Point3D(k,l,m);

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
    constructor(){}

    drawPoint(point: Point2D,_strokeStyle = "black",_lineWidth = 1,_fillStyle = "black") {
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;

        ctx.arc(point.x,point.y,3,0,2 * Math.PI);
        ctx.fillStyle = _fillStyle;

        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    drawVertex(vertex: _4D_VEC_,_strokeStyle = "black",_lineWidth = 1,_fillStyle = "black") {
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;

        ctx.arc(vertex[0],vertex[1],3,0,2 * Math.PI);
        ctx.fillStyle = _fillStyle;

        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    lineDraw(a: Point2D,b: Point2D,_strokeStyle = "black",_lineWidth = 2) {
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;

        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);

        ctx.stroke();
        ctx.closePath();
    }

    drawLine(a: _4D_VEC_ | undefined,b: _4D_VEC_ | undefined,_strokeStyle = "black",_lineWidth = 2) {
        if(typeof a === "undefined" || typeof b === "undefined") return;
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;

        ctx.moveTo(a[0],a[1]);
        ctx.lineTo(b[0],b[1]);

        ctx.stroke();
        ctx.closePath();
    }

    xToCanvas(val : number){return (val * MODIFIED_PARAMS._HALF_X) + MODIFIED_PARAMS._HALF_X};

    yToCanvas(val : number){ return (val * -MODIFIED_PARAMS._HALF_Y) + MODIFIED_PARAMS._HALF_Y}

    drawOrthBounds(t_b_r_l : _4D_VEC_,  _strokeStyle = "black",line_Width = 2){
        const [_t, _b, _r, _l] = t_b_r_l;
        const t = this.yToCanvas(_t);
        const b = this.yToCanvas(_b);
        const r = this.xToCanvas(_r);
        const l = this.xToCanvas(_l);

        console.log(t,b,r,l," orth t_b_r_l");

        this.drawBounds(l, t, l, b, _strokeStyle, line_Width);
        this.drawBounds(r, t, r, b, _strokeStyle, line_Width);
        this.drawBounds(l, t, r, t, _strokeStyle, line_Width);
        this.drawBounds(l, b, r, b, _strokeStyle, line_Width);
    }

    drawPersBounds(t_b_r_l : _4D_VEC_, n : number, f : number, _strokeStyle = "black",line_Width = 2){
        const [_n_t, _n_b, _n_r, _n_l] = t_b_r_l;
        const n_t = this.yToCanvas(_n_t);
        const n_b = this.yToCanvas(_n_b);
        const n_r = this.xToCanvas(_n_r);
        const n_l = this.xToCanvas(_n_l);

        this.drawBounds(n_l, n_t, n_l, n_b, _strokeStyle, line_Width);
        this.drawBounds(n_r, n_t, n_r, n_b, _strokeStyle, line_Width);
        this.drawBounds(n_l, n_t, n_r, n_t, _strokeStyle, line_Width);
        this.drawBounds(n_l, n_b, n_r, n_b, _strokeStyle, line_Width);

        const [_f_t, _f_b, _f_r, _f_l] = [(_n_t/n)*f, (_n_b/n)*f, (_n_r/n)*f, (_n_l/n)*f];
        const f_t = this.yToCanvas(_f_t);
        const f_b = this.yToCanvas(_f_b);
        const f_r = this.xToCanvas(_f_r);
        const f_l = this.xToCanvas(_f_l);
        
        this.drawBounds(f_l, f_t, f_l, f_b, _strokeStyle, line_Width);
        this.drawBounds(f_r, f_t, f_r, f_b, _strokeStyle, line_Width);
        this.drawBounds(f_l, f_t, f_r, f_t, _strokeStyle, line_Width);
        this.drawBounds(f_l, f_b, f_r, f_b, _strokeStyle, line_Width);

        this.drawBounds(n_l, n_t, f_l, f_t, _strokeStyle, line_Width);
        this.drawBounds(n_l, n_b, f_l, f_b, _strokeStyle, line_Width);
        this.drawBounds(n_r, n_t, f_r, f_t, _strokeStyle, line_Width);
        this.drawBounds(n_r, n_b, f_r, f_b, _strokeStyle, line_Width);

        console.log(n_t,n_b,n_r,n_l," pers near t_b_r_l")
        console.log(f_t,f_b,f_r,f_l, " pers far t_b_r_l")

    }

    drawBounds(x1 : number, y1 : number, x2 : number, y2 : number, _strokeStyle = "black",_lineWidth = 2){
        ctx.beginPath();
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _strokeStyle;

        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);

        ctx.stroke();
        ctx.closePath();
    }

    drawObject(object: _CAM_RENDERED_OBJ_ | undefined) {
        if(typeof object === "undefined") return;
        for(const vertex in object.vertices) {
            const vertexes = object.vertices[vertex];
            if(typeof vertexes === "undefined") continue;
            this.drawVertex(vertexes);
        }
        const half_edges = structuredClone(object.object.mesh.HalfEdgeDict);
        for(const half_edge in half_edges) {
            const twin = half_edges[half_edge].twin;
            if(half_edges[twin]) delete half_edges[twin];
        }

        for(const edge in half_edges) {
            const [a,b] = edge.split("-").map((value) => object.vertices[value]);
            this.drawLine(a,b)
        }
    }
}
