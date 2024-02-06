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
    object_container_div.style.zIndex = "inherit";
    if (svg_main_menu_divider_top < 0)
        svg_main_menu_divider_top = main_menu_height + svg_main_menu_divider_top;
    console.log(svg_main_menu_divider_top);
    object_container_div.style.height = `${svg_main_menu_divider_top - 80}px`;
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
    new CreatePoint_SVG_Indicator(object_div_1d);
    new CreateLine_SVG_Indicator(object_div_1d);
    /* 2D Shapes */
    new CreatePolygon_SVG_Indicator(object_div_2d);
    new CreateRectangle_SVG_Indicator(object_div_2d);
    new CreateEllipse_SVG_Indicator(object_div_2d);
    new CreateCircle_SVG_Indicator(object_div_2d);
    /* 3D Shapes */
    new Pyramid_SVG_Indicator(object_div_3d);
    new Cone_SVG_Indicator(object_div_3d);
    new Prism_SVG_Indicator(object_div_3d);
    new Cylinder_SVG_Indicator(object_div_3d);
    new Cuboid_SVG_Indicator(object_div_3d);
    new Sphere_SVG_Indicator(object_div_3d);
    new Torus_SVG_Indicator(object_div_3d);
    sub_menu = new CreateSubMenu().submenu;
    basicDrawFunction();
}
class SVG_Indicator {
    svg_class;
    tooltip_class;
    svg_container;
    tooltip_container;
    constructor(container, max_child_elem_count, tooltip_text = "Generic") {
        const sub_container = document.createElement("div");
        sub_container.style.margin = "10px";
        container.appendChild(sub_container);
        this.svg_class = new CreateSVG(sub_container, "20", "20", max_child_elem_count);
        this.tooltip_class = new CreateToolTip(container, sub_container, tooltip_text, 5, 100);
        this.svg_container = sub_container;
        this.tooltip_container = container;
    }
}
class Shape_SVG_Indicator extends SVG_Indicator {
    constructor(container, max_child_elem_count, tooltip_text = "Generic") {
        super(container, max_child_elem_count, tooltip_text);
        this.tooltip_class.top_tooltip();
    }
}
class Other_SVG_Indicator extends SVG_Indicator {
    constructor(container, max_child_elem_count, tooltip_text = "Generic", tooltip_position = "left") {
        super(container, max_child_elem_count, tooltip_text);
        this.svg_container.style.display = "inline";
        this.svg_container.style.position = "absolute";
        this.svg_container.style.right = "10px";
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
/* Shape SVG Icons */
/* 1D Shapes */
class CreatePoint_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 1, "Point");
        new CreateSVGCircle(this.svg_class, "10", "10", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePoint());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class CreateLine_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 1, "Line");
        new CreateSVGLine(this.svg_class, "1", "19", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateLine());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
/* 1D Shapes */
/* 2D Shapes */
class CreatePolygon_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 3, "Polygon");
        new CreateSVGLine(this.svg_class, "1", "19", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePolygon());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class CreateEllipse_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 1, "Ellipse");
        new CreateSVGEllipse(this.svg_class, "10", "10", "9", "5", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateEllipse());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class CreateCircle_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 1, "Circle");
        new CreateSVGCircle(this.svg_class, "10", "10", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCircle());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class CreateRectangle_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 4, "Rectangle");
        new CreateSVGLine(this.svg_class, "1", "1", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "1", "1", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateRectangle());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
/* 2D Shapes */
/* 3D Shapes */
class Pyramid_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 6, "Pyramid");
        new CreateSVGLine(this.svg_class, "1", "12", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "12", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "19", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "12", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePyramid());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class Cone_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 3, "Cone");
        new CreateSVGLine(this.svg_class, "1", "16", "10", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGEllipse(this.svg_class, "10", "16", "9", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCone());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class Prism_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 9, "Prism");
        new CreateSVGLine(this.svg_class, "3", "1", "10", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "8", "17", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "1", "17", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "1", "3", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "8", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "17", "1", "17", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "12", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "19", "17", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "3", "12", "17", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreatePrism());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class Cylinder_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 4, "Cylinder");
        new CreateSVGEllipse(this.svg_class, "10", "4", "7", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "16", "7", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGLine(this.svg_class, "3", "4", "3", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "17", "4", "17", "16", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCylinder());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class Cuboid_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 12, "Cuboid");
        new CreateSVGLine(this.svg_class, "1", "1", "12", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "7", "7", "19", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "12", "12", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "7", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "1", "1", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "7", "7", "7", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "1", "12", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "7", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "1", "7", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "1", "19", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "12", "7", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "12", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateCuboid());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class Sphere_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 5, "Sphere");
        new CreateSVGCircle(this.svg_class, "10", "10", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "10", "3", "9", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGEllipse(this.svg_class, "10", "10", "9", "3", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor, false);
        new CreateSVGPath(this.svg_class, "M 7 7, L 7 13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGPath(this.svg_class, "M 13 7, L 13 13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        this.svg_container.addEventListener("click", () => {
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateSphere());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
class Torus_SVG_Indicator extends Shape_SVG_Indicator {
    constructor(container) {
        super(container, 10, "Torus");
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
            _ObjectRendering.changeCurrentObjectInstance(_ObjectRendering.instance);
            _ObjectRendering.addObjects(new CreateTorus());
            _ObjectRendering.renderLocal();
            const rendered_object = _ObjectRendering.renderObject();
            new Draw().drawObject(rendered_object);
        });
    }
}
/* 3D Shapes */
/* Shape SVG Icons */
/* Other SVG Icons */
class CreateCross_SVG_Indicator extends Other_SVG_Indicator {
    constructor(container, text, tooltip_postition = "left") {
        super(container, 2, text, tooltip_postition);
        new CreateSVGLine(this.svg_class, "1", "10", "19", "10", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "10", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
    clickFunction(func) {
        this.svg_container.addEventListener("click", func);
    }
}
/* Other SVG Icons */
class CreateToolTip {
    tooltip_container_elem;
    tooltip_elem;
    tooltip_text_elem;
    vert_padding;
    width;
    tooltip_text_elem_orientation = "default";
    default_positioning;
    constructor(tooltip_container, tooltip, tooltip_text, vert_padding = 5, width) {
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
        };
        tooltip.appendChild(tooltip_text_element);
        tooltip.addEventListener("mouseover", () => { if (!isTouchDevice)
            tooltip_text_element.style.visibility = "visible"; });
        tooltip.addEventListener("mouseout", () => { if (!isTouchDevice)
            tooltip_text_element.style.visibility = "hidden"; });
        tooltip.addEventListener("touchstart", () => { if (isTouchDevice)
            tooltip_text_element.style.visibility = "visible"; }, { 'passive': true });
        tooltip.addEventListener("touchend", () => { if (isTouchDevice)
            tooltip_text_element.style.visibility = "hidden"; }, { 'passive': true });
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
        this.tooltip_elem.addEventListener("mousemove", () => {
            if (!isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper = this.vertical_tooltip_helper(half_width, container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent", `${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        });
        this.tooltip_elem.addEventListener("touchstart", () => {
            if (isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper = this.vertical_tooltip_helper(half_width, container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent", `${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        }, { 'passive': true });
    }
    bottom_tooltip() {
        this.toDefault();
        this.tooltip_text_elem.style.top = "100%";
        this.tooltip_text_elem.style.left = "50%";
        this.tooltip_text_elem.className = "tooltiptext_bottom";
        this.tooltip_text_elem.style.margin = "5px 0";
        this.tooltip_elem.addEventListener("mousemove", () => {
            if (!isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper = this.vertical_tooltip_helper(half_width, container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent", `${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        });
        this.tooltip_elem.addEventListener("touchstart", () => {
            if (isTouchDevice) {
                const half_width = this.width / 2;
                const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
                const helper = this.vertical_tooltip_helper(half_width, container_width);
                this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
                root.style.setProperty("--margin-left-percent", `${(half_width - helper.before + helper.after) / this.width * 100}%`);
            }
        }, { 'passive': true });
    }
    vertical_tooltip_helper(half_width, container_width) {
        const tooltip_margin_right = Number(window.getComputedStyle(this.tooltip_elem).marginRight.split("px")[0]);
        const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
        const after = half_width > (container_width - this.tooltip_elem.offsetLeft - tooltip_margin_right) ? half_width - tooltip_margin_right : 0;
        return { before: before, after: after };
    }
}
