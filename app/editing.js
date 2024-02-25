// window.parent.addEventListener("message", (e) => window.parent.postMessage(e.data));
window.parent.addEventListener("message", (e) => { if (e.data === "Editing")
    edit(); });
function edit() {
    while (main_menu.firstChild)
        main_menu.removeChild(main_menu.firstChild);
    create_main_menu_divider = true;
    cross_indicator = new CreateCross_SVG_Indicator(main_menu, "cross", "Add Objects");
    const menu_header = document.createElement("p");
    menu_header.style.paddingLeft = "10px";
    menu_header.className = "custom_menu_header with_cross_hairs";
    menu_header.textContent = "Objects";
    menu_header.style.fontWeight = "bold";
    main_menu.appendChild(menu_header);
    const object_container_div = document.createElement("div");
    object_container_div.className = "container_div";
    object_container_div.style.zIndex = "inherit";
    object_container_div.style.position = "absolute";
    mesh_sample_container_div = document.createElement("div");
    mesh_sample_container_div.className = "container_div";
    mesh_sample_container_div.style.zIndex = "inherit";
    mesh_sample_container_div.style.display = "none";
    mesh_sample_container_div.style.position = "absolute";
    mesh_sample_container_div.style.zIndex = `${Number(window.getComputedStyle(object_container_div).zIndex) + 10}`;
    if (svg_main_menu_divider_top < 0)
        svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    root.style.setProperty("--container-div-height", `${svg_main_menu_divider_top - 80}px`);
    object_container_div.style.overflowX = "hidden";
    object_container_div.style.overflowY = "auto";
    mesh_sample_container_div.style.paddingTop = "30px";
    mesh_sample_container_div.style.overflowX = "hidden";
    mesh_sample_container_div.style.overflowY = "auto";
    main_menu.appendChild(object_container_div);
    main_menu.appendChild(mesh_sample_container_div);
    const object_div_1d = document.createElement("div");
    const object_div_2d = document.createElement("div");
    const object_div_3d = document.createElement("div");
    mesh_sample_container_div.appendChild(object_div_1d);
    mesh_sample_container_div.appendChild(object_div_2d);
    mesh_sample_container_div.appendChild(object_div_3d);
    /* 1D Shapes */
    _Point = new CreatePoint_SVG_Indicator(object_div_1d, "point");
    _Line = new CreateLine_SVG_Indicator(object_div_1d, "line");
    /* 2D Shapes */
    _Polygon = new CreatePolygon_SVG_Indicator(object_div_2d, "polygon");
    _Rectangle = new CreateRectangle_SVG_Indicator(object_div_2d, "rectangle");
    _Ellipse = new CreateEllipse_SVG_Indicator(object_div_2d, "ellipse");
    _Circle = new CreateCircle_SVG_Indicator(object_div_2d, "circle");
    /* 3D Shapes */
    _Pyramid = new CreatePyramid_SVG_Indicator(object_div_3d, "pyramid");
    _Cone = new CreateCone_SVG_Indicator(object_div_3d, "cone");
    _Prism = new CreatePrism_SVG_Indicator(object_div_3d, "prism");
    _Cylinder = new CreateCylinder_SVG_Indicator(object_div_3d, "cylinder");
    _Cuboid = new CreateCuboid_SVG_Indicator(object_div_3d, "cuboid");
    _Sphere = new CreateSphere_SVG_Indicator(object_div_3d, "sphere");
    _Torus = new CreateTorus_SVG_Indicator(object_div_3d, "torus");
    sub_menu = new CreateSubMenu().submenu;
    basicDrawFunction();
}
class Shape_SVG_Indicator extends SVG_Indicator {
    constructor(container, id, max_child_elem_count, tooltip_text = "Generic") {
        super(container, id, max_child_elem_count, tooltip_text, false);
        this.tooltip_class.top_tooltip();
    }
}
/* Shape SVG Icons */
/* 1D Shapes */
class CreatePoint_SVG_Indicator extends Shape_SVG_Indicator {
    point;
    constructor(container, id) {
        super(container, id, 1, "Point");
        this.point = new CreateSVGCircle(this.svg_class, "10", "10", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color);
    }
    start_event() {
        this.point.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        this.point.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateLine_SVG_Indicator extends Shape_SVG_Indicator {
    line;
    constructor(container, id) {
        super(container, id, 1, "Line");
        this.line = new CreateSVGLine(this.svg_class, "1", "19", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
    start_event() {
        this.line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        this.line.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
/* 1D Shapes */
/* 2D Shapes */
class CreatePolygon_SVG_Indicator extends Shape_SVG_Indicator {
    lines;
    constructor(container, id) {
        super(container, id, 3, "Polygon");
        this.lines = [];
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        for (const line of this.lines)
            line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateEllipse_SVG_Indicator extends Shape_SVG_Indicator {
    ellipse;
    constructor(container, id) {
        super(container, id, 1, "Ellipse");
        this.ellipse = new CreateSVGEllipse(this.svg_class, "10", "10", "9", "5", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
    }
    start_event() {
        this.ellipse.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        this.ellipse.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateCircle_SVG_Indicator extends Shape_SVG_Indicator {
    circle;
    constructor(container, id) {
        super(container, id, 1, "Circle");
        this.circle = new CreateSVGCircle(this.svg_class, "10", "10", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
    }
    start_event() {
        this.circle.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        this.circle.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateRectangle_SVG_Indicator extends Shape_SVG_Indicator {
    lines;
    constructor(container, id) {
        super(container, id, 4, "Rectangle");
        this.lines = [];
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "1", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "1", "1", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "19", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        for (const line of this.lines)
            line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
/* 2D Shapes */
/* 3D Shapes */
class CreatePyramid_SVG_Indicator extends Shape_SVG_Indicator {
    lines;
    constructor(container, id) {
        super(container, id, 6, "Pyramid");
        this.lines = [];
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "1", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "10", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "12", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        for (const line of this.lines)
            line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateCone_SVG_Indicator extends Shape_SVG_Indicator {
    lines;
    ellipse;
    constructor(container, id) {
        super(container, id, 3, "Cone");
        this.lines = [];
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "16", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "1", "19", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.ellipse = new CreateSVGEllipse(this.svg_class, "10", "16", "9", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
    }
    start_event() {
        for (const line of this.lines)
            line.event_in();
        this.ellipse.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        this.ellipse.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreatePrism_SVG_Indicator extends Shape_SVG_Indicator {
    lines;
    constructor(container, id) {
        super(container, id, 9, "Prism");
        this.lines = [];
        this.lines.push(new CreateSVGLine(this.svg_class, "3", "8", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "1", "17", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "3", "8", "17", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "3", "8", "3", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "1", "10", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "17", "8", "17", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "3", "19", "10", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "12", "17", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "3", "19", "17", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        for (const line of this.lines)
            line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateCylinder_SVG_Indicator extends Shape_SVG_Indicator {
    ellipses;
    lines;
    constructor(container, id) {
        super(container, id, 4, "Cylinder");
        this.ellipses = [];
        this.lines = [];
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "10", "4", "7", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "10", "16", "7", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.lines.push(new CreateSVGLine(this.svg_class, "3", "4", "3", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "17", "4", "17", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        for (const ellipse of this.ellipses)
            ellipse.event_in();
        for (const line of this.lines)
            line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        for (const ellipse of this.ellipses)
            ellipse.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateCuboid_SVG_Indicator extends Shape_SVG_Indicator {
    lines;
    constructor(container, id) {
        super(container, id, 12, "Cuboid");
        this.lines = [];
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "7", "12", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "7", "1", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "12", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "7", "12", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "7", "1", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "7", "1", "7", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "12", "7", "12", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "19", "1", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "7", "7", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "12", "7", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "19", "7", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "12", "19", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        for (const line of this.lines)
            line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateSphere_SVG_Indicator extends Shape_SVG_Indicator {
    circle;
    ellipses;
    paths;
    constructor(container, id) {
        super(container, id, 5, "Sphere");
        this.ellipses = [];
        this.paths = [];
        this.circle = new CreateSVGCircle(this.svg_class, "10", "10", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "10", "10", "3", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "10", "10", "9", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.paths.push(new CreateSVGPath(this.svg_class, "M 7 7, L 7 13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.paths.push(new CreateSVGPath(this.svg_class, "M 13 7, L 13 13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        this.circle.event_in();
        for (const ellipse of this.ellipses)
            ellipse.event_in();
        for (const path of this.paths)
            path.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        this.circle.event_out();
        for (const ellipse of this.ellipses)
            ellipse.event_out();
        for (const path of this.paths)
            path.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
class CreateTorus_SVG_Indicator extends Shape_SVG_Indicator {
    ellipses;
    lines;
    constructor(container, id) {
        super(container, id, 10, "Torus");
        this.ellipses = [];
        this.lines = [];
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "10", "4", "7", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "10", "16", "7", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "10", "10", "9", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "3", "10", "2", "6", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.ellipses.push(new CreateSVGEllipse(this.svg_class, "17", "10", "2", "6", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false));
        this.lines.push(new CreateSVGLine(this.svg_class, "10", "6", "10", "18", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "10", "5", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "1", "10", "5", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "19", "10", "15", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
        this.lines.push(new CreateSVGLine(this.svg_class, "19", "10", "15", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color));
    }
    start_event() {
        for (const ellipse of this.ellipses)
            ellipse.event_in();
        for (const line of this.lines)
            line.event_in();
        this.tooltip_class.call_function_in();
        this.hovered = true;
    }
    end_event() {
        for (const line of this.lines)
            line.event_out();
        for (const ellipse of this.ellipses)
            ellipse.event_out();
        this.tooltip_class.call_function_out();
        this.hovered = false;
    }
}
/* 3D Shapes */
/* Shape SVG Icons */ 
