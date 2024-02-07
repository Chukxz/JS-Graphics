window.parent.addEventListener("message",(e) => { if(e.data === "Rendering") render() });

function render() {
    while(main_menu.firstChild)main_menu.removeChild(main_menu.firstChild);
    create_main_menu_divider = true;

    const cross_indicator = new CreateCross_SVG_Indicator(main_menu,"Add Camera");

    const menu_header = document.createElement("p");
    menu_header.className = "custom_menu_header with_cross_hairs";
    menu_header.textContent = "Camera Objects";
    menu_header.style.paddingLeft = "10px";
    main_menu.appendChild(menu_header);

    const camera_div = document.createElement("div");
    camera_div.id = "camera_div";
    camera_div.className = "container_div";
    camera_div.style.zIndex = "inherit";
    if(svg_main_menu_divider_top < 0) svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    console.log(svg_main_menu_divider_top)
    root.style.setProperty("--container-div-height",`${svg_main_menu_divider_top - 80}px`);
    camera_div.style.overflowX = "hidden";
    camera_div.style.overflowY = "auto";
    main_menu.appendChild(camera_div);

    const camera_indicator = new CameraIndicator(camera_div);

    const crossClick = () => {
        _CAMERA.createNewCameraObject();
        camera_indicator.showCameras();
    }

    cross_indicator.clickFunction(crossClick);

    sub_menu = new CreateSubMenu().submenu;

    const redo = new CreateRedo_SVG_Indicator(sub_menu, "Redo", "left-50px","top-0px", "right");
    const undo = new CreateUndo_SVG_Indicator(sub_menu, "Undo","left-10px","top-0px","right")
    const remove = new CreateDelete_SVG_Indicator(sub_menu, "Remove", "right-10px", "top-0px","left");

    basicDrawFunction()
}

class CameraIndicator {
    camera_objects: CameraObject[];
    camera_container: HTMLDivElement;

    constructor (container: HTMLDivElement) {
        this.camera_container = container;
        this.showCameras();
    }

    showCameras() {
        while(this.camera_container.firstChild) this.camera_container.removeChild(this.camera_container.firstChild);
        this.camera_objects = _CAMERA.camera_objects_array;
        const sub_container = document.createElement("div");
        sub_container.style.margin = "10px";
        this.camera_container.appendChild(sub_container);

        console.log(this.camera_objects)

        for(const camera_object of this.camera_objects) {
            this.showCamera(sub_container,camera_object);
        }
        //this.svg_class.svg.addEventListener("click", (()=>console.log(tooltip_text)))
    }

    showCamera(sub_container: HTMLDivElement,camera: CameraObject) {
        const cam = document.createElement("p");
        cam.className = "camera";
        cam.textContent = `Camera   ${camera.instance.instance_number}`;
        cam.style.backgroundColor = elem_hover_col;
        cam.style.color = "#fff";
        cam.style.padding = "5px";
        cam.style.borderRadius = "8px";
        cam.style.cursor = "pointer";
        cam.style.overflowX = "clip"
        sub_container.appendChild(cam);

        cam.addEventListener("click",() => {});
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

    drawObject(object: _CAM_RENDERED_OBJ_ | undefined) {
        if(typeof object === "undefined") return;
        for(const vertex in object.vertices) {
            const vertexes = object.vertices[vertex];
            if(typeof vertexes === "undefined") continue;
            this.drawVertex(vertexes);
        }
        const half_edges = structuredClone(object.object.mesh.HalfEdgeDict)
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
