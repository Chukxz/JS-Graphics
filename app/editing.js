// window.parent.addEventListener("message", (e) => window.parent.postMessage(e.data));
window.parent.addEventListener("message", (e) => { if (e.data === "Editing")
    edit(); });
function edit() {
    while (main_menu.firstChild)
        main_menu.removeChild(main_menu.firstChild);
    create_main_menu_divider = true;
    const menu_header = document.createElement("p");
    menu_header.textContent = "Mesh Objects";
    menu_header.style.paddingLeft = "10px";
    main_menu.appendChild(menu_header);
    const object_container_div = document.createElement("div");
    object_container_div.className = "container_div";
    object_container_div.style.zIndex = "inherit";
    if (svg_main_menu_divider_top < 0)
        svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    root.style.setProperty("--container-div-height", `${svg_main_menu_divider_top - 80}px`);
    object_container_div.style.paddingTop = "30px";
    object_container_div.style.overflowX = "hidden";
    object_container_div.style.overflowY = "auto";
    main_menu.appendChild(object_container_div);
    const object_div_1d = document.createElement("div");
    const object_div_2d = document.createElement("div");
    const object_div_3d = document.createElement("div");
    object_container_div.appendChild(object_div_1d);
    object_container_div.appendChild(object_div_2d);
    object_container_div.appendChild(object_div_3d);
    /* 1D Shapes */
    new CreatePoint_SVG_Indicator(object_div_1d, "point");
    new CreateLine_SVG_Indicator(object_div_1d, "line");
    /* 2D Shapes */
    new CreatePolygon_SVG_Indicator(object_div_2d, "polygon");
    new CreateRectangle_SVG_Indicator(object_div_2d, "rectangle");
    new CreateEllipse_SVG_Indicator(object_div_2d, "ellipse");
    new CreateCircle_SVG_Indicator(object_div_2d, "circle");
    /* 3D Shapes */
    new Pyramid_SVG_Indicator(object_div_3d, "pyramid");
    new Cone_SVG_Indicator(object_div_3d, "cone");
    new Prism_SVG_Indicator(object_div_3d, "prism");
    new Cylinder_SVG_Indicator(object_div_3d, "cylinder");
    new Cuboid_SVG_Indicator(object_div_3d, "cuboid");
    new Sphere_SVG_Indicator(object_div_3d, "sphere");
    new Torus_SVG_Indicator(object_div_3d, "torus");
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
    constructor(container, id) {
        super(container, id, 1, "Point");
        new CreateSVGCircle(this.svg_class, "10", "10", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePoint());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class CreateLine_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 1, "Line");
        new CreateSVGLine(this.svg_class, "1", "19", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateLine());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
/* 1D Shapes */
/* 2D Shapes */
class CreatePolygon_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 3, "Polygon");
        new CreateSVGLine(this.svg_class, "1", "19", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePolygon());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class CreateEllipse_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 1, "Ellipse");
        new CreateSVGEllipse(this.svg_class, "10", "10", "9", "5", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateEllipse());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class CreateCircle_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 1, "Circle");
        new CreateSVGCircle(this.svg_class, "10", "10", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCircle());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class CreateRectangle_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 4, "Rectangle");
        new CreateSVGLine(this.svg_class, "1", "1", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "1", "1", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateRectangle());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
/* 2D Shapes */
/* 3D Shapes */
class Pyramid_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 6, "Pyramid");
        new CreateSVGLine(this.svg_class, "1", "19", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "10", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "12", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePyramid());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class Cone_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 3, "Cone");
        new CreateSVGLine(this.svg_class, "1", "16", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGEllipse(this.svg_class, "10", "16", "9", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCone());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class Prism_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 9, "Prism");
        new CreateSVGLine(this.svg_class, "3", "8", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "17", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "8", "17", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "8", "3", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "10", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "17", "8", "17", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "19", "10", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "12", "17", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "19", "17", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePrism());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class Cylinder_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 4, "Cylinder");
        new CreateSVGEllipse(this.svg_class, "10", "4", "7", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "16", "7", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGLine(this.svg_class, "3", "4", "3", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "17", "4", "17", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCylinder());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class Cuboid_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 12, "Cuboid");
        new CreateSVGLine(this.svg_class, "1", "7", "12", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "7", "1", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "12", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "7", "12", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "7", "1", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "7", "1", "7", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "7", "12", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "1", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "7", "7", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "7", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "7", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "19", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCuboid());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class Sphere_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 5, "Sphere");
        new CreateSVGCircle(this.svg_class, "10", "10", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "10", "3", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "10", "9", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGPath(this.svg_class, "M 7 7, L 7 13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGPath(this.svg_class, "M 13 7, L 13 13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateSphere());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
class Torus_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container, id) {
        super(container, id, 10, "Torus");
        new CreateSVGEllipse(this.svg_class, "10", "4", "7", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "16", "7", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "10", "9", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "3", "10", "2", "6", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "17", "10", "2", "6", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGLine(this.svg_class, "10", "6", "10", "18", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "10", "5", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "10", "5", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "10", "15", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "10", "15", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            console.log(_ObjectRendering.instance, "###################");
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateTorus());
            _ObjectRendering.renderWorld();
            const rendered_object = _ObjectRendering.renderObject();
            _Draw.drawObject(rendered_object);
        });
    }
}
/* 3D Shapes */
/* Shape SVG Icons */ 
