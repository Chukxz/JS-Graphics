// window.parent.addEventListener("message", (e) => window.parent.postMessage(e.data));
window.parent.addEventListener("message", (e) => { if (e.data === "Editing")
    edit(); });
function edit() {
    while (main_menu.firstChild)
        main_menu.removeChild(main_menu.firstChild);
    const objs = document.createElement("p");
    objs.textContent = "Create Objects";
    main_menu.appendChild(objs);
    const object_div_2d = document.createElement("div");
    object_div_2d.style.zIndex = "inherit";
    const object_div_3d = document.createElement("div");
    object_div_3d.style.zIndex = "inherit";
    main_menu.appendChild(object_div_2d);
    main_menu.appendChild(object_div_3d);
    /* 1D Shapes */
    new CreatePoint_SVG_Indicator(object_div_2d);
    new CreateLine_SVG_Indicator(object_div_2d);
    /* 2D Shapes */
    new CreatePolygon_SVG_Indicator(object_div_2d);
    new CreateRectangle_SVG_Indicator(object_div_2d);
    new CreateEllipse_SVG_Indicator(object_div_2d);
    new CreateCircle_SVG_Indicator(object_div_2d);
    /* 3D Shapes */
    new Pyramid_SVG_Indicator(object_div_3d);
    new Cuboid_SVG_Indicator(object_div_3d);
}
class SVG_Indicator {
    svg_class;
    tooltip_class;
    constructor(container, max_child_elem_count, tooltip_text = "Generic") {
        const sub_container = document.createElement("div");
        sub_container.style.margin = "10px";
        container.appendChild(sub_container);
        this.svg_class = new CreateSVG(sub_container, "20", "20", max_child_elem_count);
        this.tooltip_class = new CreateToolTip(container, sub_container, tooltip_text, 5, 100);
        this.tooltip_class.top_tooltip();
        //this.svg_class.svg.addEventListener("click", (()=>console.log(tooltip_text)))
    }
}
/* 1D Shapes */
class CreatePoint_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 1, "Point");
        new CreateSVGCircle(this.svg_class, "9", "9", "2", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, svg_objects_color);
    }
}
class CreateLine_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 1, "Line");
        new CreateSVGLine(this.svg_class, "1", "19", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
}
/* 1D Shapes */
/* 2D Shapes */
class CreatePolygon_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 3, "Polygon");
        new CreateSVGLine(this.svg_class, "1", "19", "9", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
}
class CreateEllipse_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 1, "Ellipse");
        new CreateSVGEllipse(this.svg_class, "9", "9", "8", "5", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor);
    }
}
class CreateCircle_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 1, "Circle");
        new CreateSVGCircle(this.svg_class, "9", "9", "8", svg_objects_color, svg_objects_strokeWidth, svg_hover_color, genBackgroundColor);
    }
}
class CreateRectangle_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 4, "Rectangle");
        new CreateSVGLine(this.svg_class, "1", "1", "19", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "1", "1", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "1", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
}
/* 2D Shapes */
/* 3D Shapes */
class Pyramid_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 6, "Pyramid");
        new CreateSVGLine(this.svg_class, "1", "12", "9", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "1", "19", "12", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "9", "1", "9", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "13", "9", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "10", "19", "19", "13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "13", "19", "13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
}
class Cuboid_SVG_Indicator extends SVG_Indicator {
    constructor(container) {
        super(container, 12, "Cuboid");
        new CreateSVGLine(this.svg_class, "1", "1", "12", "1", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "8", "7", "19", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "13", "12", "13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "8", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "1", "1", "13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "8", "7", "8", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "1", "12", "13", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "19", "7", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "1", "8", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "1", "19", "7", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "1", "13", "8", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
        new CreateSVGLine(this.svg_class, "12", "13", "19", "19", svg_objects_color, svg_objects_strokeWidth, svg_hover_color);
    }
}
/* 3D Shapes */
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
        const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
        const after = half_width > (container_width - this.tooltip_elem.offsetLeft) ? half_width - (container_width - this.tooltip_elem.offsetLeft) + this.tooltip_container_elem.offsetLeft : 0;
        return { before: before, after: after };
    }
}
