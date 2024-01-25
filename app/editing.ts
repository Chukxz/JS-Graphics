// window.parent.addEventListener("message", (e) => window.parent.postMessage(e.data));

window.parent.addEventListener("message",(e) => { if(e.data === "Editing") edit() });

type _VERT_TOOLTIP_HELPER_ = { before: number; after: number };

/* 1D Shapes */
let point : CreatePoint_SVG_Indicator;
let line : CreateLine_SVG_Indicator;

/* 2D Shapes */
let polygon : CreatePolygon_SVG_Indicator;
let rectangle : CreateRectangle_SVG_Indicator;
let ellipse : CreateEllipse_SVG_Indicator;
let circle :  CreateCircle_SVG_Indicator;

/* 3D Shapes */
let pyramid : Pyramid_SVG_Indicator;
let cone : Cone_SVG_Indicator;
let prism :  Prism_SVG_Indicator;
let cylinder : Cylinder_SVG_Indicator;
let cuboid : Cuboid_SVG_Indicator;
let sphere : Sphere_SVG_Indicator;
let torus : Torus_SVG_Indicator;

function edit() {
  while(main_menu.firstChild) main_menu.removeChild(main_menu.firstChild);
  const objs = document.createElement("p");
  objs.textContent = "Create Objects";
  main_menu.appendChild(objs);

  const object_div_1d = document.createElement("div");
  object_div_1d.style.zIndex = "inherit";

  const object_div_2d = document.createElement("div");
  object_div_2d.style.zIndex = "inherit";

  const object_div_3d = document.createElement("div");
  object_div_3d.style.zIndex = "inherit";

  main_menu.appendChild(object_div_1d);
  main_menu.appendChild(object_div_2d);
  main_menu.appendChild(object_div_3d);

  /* 1D Shapes */
  point = new CreatePoint_SVG_Indicator(object_div_1d);
  line = new CreateLine_SVG_Indicator(object_div_1d);

  /* 2D Shapes */
  polygon = new CreatePolygon_SVG_Indicator(object_div_2d);
  rectangle = new CreateRectangle_SVG_Indicator(object_div_2d);
  ellipse = new CreateEllipse_SVG_Indicator(object_div_2d);
  circle = new CreateCircle_SVG_Indicator(object_div_2d);

  /* 3D Shapes */
  pyramid = new Pyramid_SVG_Indicator(object_div_3d);
  cone = new Cone_SVG_Indicator(object_div_3d);
  prism = new Prism_SVG_Indicator(object_div_3d);
  cylinder = new Cylinder_SVG_Indicator(object_div_3d);
  cuboid = new Cuboid_SVG_Indicator(object_div_3d);
  sphere = new Sphere_SVG_Indicator(object_div_3d);
  torus = new Torus_SVG_Indicator(object_div_3d);
}

function closeEdit() {
  /* 1D Shapes */
  point.closeSVGIndicator();
  line.closeSVGIndicator();

  /* 2D Shapes */
  polygon.closeSVGIndicator();
  rectangle.closeSVGIndicator();
  ellipse.closeSVGIndicator();
  circle.closeSVGIndicator();

  /* 3D Shapes */
  pyramid.closeSVGIndicator();
  cone.closeSVGIndicator();
  prism.closeSVGIndicator();
  cylinder.closeSVGIndicator();
  cuboid.closeSVGIndicator();
  sphere.closeSVGIndicator();
  torus.closeSVGIndicator();
}

class SVG_Indicator {
  svg_class: CreateSVG;
  tooltip_class: CreateToolTip;

  constructor (container: HTMLElement,max_child_elem_count: number,tooltip_text = "Generic") {
    const sub_container = document.createElement("div");
    sub_container.style.margin = "10px";
    container.appendChild(sub_container);
    this.svg_class = new CreateSVG(sub_container,"20","20",max_child_elem_count);
    this.tooltip_class = new CreateToolTip(container,sub_container,tooltip_text,5,100);
    this.tooltip_class.top_tooltip();
    //this.svg_class.svg.addEventListener("click", (()=>console.log(tooltip_text)))
  }

  closeSVGIndicator() {
    this.tooltip_class.closeTooltip();
    this.svg_class.closeSVG();
  }
}

/* 1D Shapes */
class CreatePoint_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGCircle[];

  constructor (container: HTMLElement) {
    super(container,1,"Point");
    this.objects = [new CreateSVGCircle(this.svg_class,"10","10","2",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,svg_objects_color)];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class CreateLine_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGLine[];

  constructor (container: HTMLElement) {
    super(container,1,"Line");
    this.objects = [new CreateSVGLine(this.svg_class,"1","19","19","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color)];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}
/* 1D Shapes */


/* 2D Shapes */
class CreatePolygon_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGLine[];

  constructor (container: HTMLElement) {
    super(container,3,"Polygon");
    this.objects = [
      new CreateSVGLine(this.svg_class,"1","19","10","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","1","19","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"1","19","19","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color)
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class CreateEllipse_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGEllipse[];

  constructor (container: HTMLElement) {
    super(container,1,"Ellipse");
    this.objects = [new CreateSVGEllipse(this.svg_class,"10","10","9","5",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false)];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class CreateCircle_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGCircle[];

  constructor (container: HTMLElement) {
    super(container,1,"Circle");
    this.objects = [new CreateSVGCircle(this.svg_class,"10","10","9",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false)];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class CreateRectangle_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGLine[];

  constructor (container: HTMLElement) {
    super(container,4,"Rectangle");

    this.objects = [new CreateSVGLine(this.svg_class,"1","1","19","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
    new CreateSVGLine(this.svg_class,"1","19","19","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
    new CreateSVGLine(this.svg_class,"1","1","1","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
    new CreateSVGLine(this.svg_class,"19","1","19","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color)
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}
/* 2D Shapes */

/* 3D Shapes */
class Pyramid_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGLine[];

  constructor (container: HTMLElement) {
    super(container,6,"Pyramid");

    this.objects = [
      new CreateSVGLine(this.svg_class,"1","12","10","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","1","19","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","1","10","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),

      new CreateSVGLine(this.svg_class,"1","12","10","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","19","19","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"1","12","19","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class Cone_SVG_Indicator extends SVG_Indicator {
  objects: [CreateSVGLine,CreateSVGLine,CreateSVGEllipse];

  constructor (container: HTMLElement) {
    super(container,3,"Cone");

    this.objects = [
      new CreateSVGLine(this.svg_class,"1","16","10","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","1","19","16",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGEllipse(this.svg_class,"10","16","9","3",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class Prism_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGLine[];

  constructor (container: HTMLElement) {
    super(container,9,"Prism");

    this.objects = [
      new CreateSVGLine(this.svg_class,"3","1","10","8",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","8","17","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"3","1","17","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),

      new CreateSVGLine(this.svg_class,"3","1","3","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","8","10","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"17","1","17","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),

      new CreateSVGLine(this.svg_class,"3","12","10","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"10","19","17","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"3","12","17","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class Cylinder_SVG_Indicator extends SVG_Indicator {
  objects: [CreateSVGEllipse,CreateSVGEllipse,CreateSVGLine,CreateSVGLine];

  constructor (container: HTMLElement) {
    super(container,4,"Cylinder");

    this.objects = [
      new CreateSVGEllipse(this.svg_class,"10","4","7","3",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
      new CreateSVGEllipse(this.svg_class,"10","16","7","3",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),

      new CreateSVGLine(this.svg_class,"3","4","3","16",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"17","4","17","16",svg_objects_color,svg_objects_strokeWidth,svg_hover_color)
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class Cuboid_SVG_Indicator extends SVG_Indicator {
  objects: CreateSVGLine[];

  constructor (container: HTMLElement) {
    super(container,12,"Cuboid");

    this.objects = [
      new CreateSVGLine(this.svg_class,"1","1","12","1",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"7","7","19","7",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"1","12","12","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"7","19","19","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),

      new CreateSVGLine(this.svg_class,"1","1","1","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"7","7","7","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"12","1","12","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"19","7","19","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),

      new CreateSVGLine(this.svg_class,"1","1","7","7",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"12","1","19","7",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"1","12","7","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"12","12","19","19",svg_objects_color,svg_objects_strokeWidth,svg_hover_color)
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class Sphere_SVG_Indicator extends SVG_Indicator {
  objects: [CreateSVGCircle,CreateSVGEllipse,CreateSVGEllipse,CreateSVGPath,CreateSVGPath];

  constructor (container: HTMLElement) {
    super(container,5,"Sphere");

    this.objects = [
      new CreateSVGCircle(this.svg_class,"10","10","9",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
      new CreateSVGEllipse(this.svg_class,"10","10","3","9",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
      new CreateSVGEllipse(this.svg_class,"10","10","9","3",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),

      new CreateSVGPath(this.svg_class,"M 7 7, L 7 13",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGPath(this.svg_class,"M 13 7, L 13 13",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}

class Torus_SVG_Indicator extends SVG_Indicator {
  objects: [CreateSVGEllipse,CreateSVGEllipse,CreateSVGEllipse,CreateSVGEllipse,CreateSVGEllipse,CreateSVGLine,CreateSVGLine,CreateSVGLine,CreateSVGLine,CreateSVGLine];

  constructor (container: HTMLElement) {
    super(container,10,"Torus");

    this.objects = [
      new CreateSVGEllipse(this.svg_class,"10","4","7","2",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
      new CreateSVGEllipse(this.svg_class,"10","16","7","2",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
      new CreateSVGEllipse(this.svg_class,"10","10","9","2",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),

      new CreateSVGEllipse(this.svg_class,"3","10","2","6",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
      new CreateSVGEllipse(this.svg_class,"17","10","2","6",svg_objects_color,svg_objects_strokeWidth,svg_hover_color,genBackgroundColor,false),
      new CreateSVGLine(this.svg_class,"10","6","10","18",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),

      new CreateSVGLine(this.svg_class,"1","10","5","8",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"1","10","5","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"19","10","15","8",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
      new CreateSVGLine(this.svg_class,"19","10","15","12",svg_objects_color,svg_objects_strokeWidth,svg_hover_color),
    ];
  }

  closeSVGIndicator() {
    for(const object of this.objects) object.closeSVGObject();
    super.closeSVGIndicator();
  }
}
/* 3D Shapes */

class CreateToolTip {
  tooltip_container_elem: HTMLElement;
  tooltip_elem: HTMLElement;
  tooltip_text_elem: HTMLSpanElement;
  vert_padding: number;
  width: number;
  tooltip_text_elem_orientation = "default";
  default_positioning: { top: string,bottom: string,left: string,right: string,marginLeft: string };
  constructor (tooltip_container: HTMLElement,tooltip: HTMLElement,tooltip_text: string,vert_padding = 5,width: number) {
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
    }

    tooltip.appendChild(tooltip_text_element);

    tooltip.addEventListener("mouseover",() => { if(!isTouchDevice) tooltip_text_element.style.visibility = "visible" });
    tooltip.addEventListener("mouseout",() => { if(!isTouchDevice) tooltip_text_element.style.visibility = "hidden" });
    tooltip.addEventListener("touchstart",() => { if(isTouchDevice) tooltip_text_element.style.visibility = "visible" },{ 'passive': true });
    tooltip.addEventListener("touchend",() => { if(isTouchDevice) tooltip_text_element.style.visibility = "hidden" },{ 'passive': true });
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

    this.tooltip_elem.removeEventListener("touchstart",() => {
      if(isTouchDevice) {
        const half_width = this.width / 2;
        const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
        const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
        this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
        root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
      }
    });
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

    this.tooltip_elem.addEventListener("mousemove",() => {
      if(!isTouchDevice) {
        const half_width = this.width / 2;
        const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
        const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
        this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
        root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
      }
    });
    this.tooltip_elem.addEventListener("touchstart",() => {
      if(isTouchDevice) {
        const half_width = this.width / 2;
        const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
        const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
        this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
        root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
      }
    },{ 'passive': true });
  }

  bottom_tooltip() {
    this.toDefault();
    this.tooltip_text_elem.style.top = "100%";
    this.tooltip_text_elem.style.left = "50%";
    this.tooltip_text_elem.className = "tooltiptext_bottom";
    this.tooltip_text_elem.style.margin = "5px 0";

    this.tooltip_elem.addEventListener("mousemove",() => {
      if(!isTouchDevice) {
        const half_width = this.width / 2;
        const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
        const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
        this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
        root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
      }
    });
    this.tooltip_elem.addEventListener("touchstart",() => {
      if(isTouchDevice) {
        const half_width = this.width / 2;
        const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
        const helper: _VERT_TOOLTIP_HELPER_ = this.vertical_tooltip_helper(half_width,container_width);
        this.tooltip_text_elem.style.marginLeft = `-${half_width - helper.before + helper.after}px`;
        root.style.setProperty("--margin-left-percent",`${(half_width - helper.before + helper.after) / this.width * 100}%`);
      }
    },{ 'passive': true });
  }

  vertical_tooltip_helper(half_width: number,container_width: number): _VERT_TOOLTIP_HELPER_ {
    const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
    const after = half_width > (container_width - this.tooltip_elem.offsetLeft) ? half_width - (container_width - this.tooltip_elem.offsetLeft) + this.tooltip_container_elem.offsetLeft : 0;
    return { before: before,after: after };
  }

  closeTooltip() {
    this.toDefault();

    this.tooltip_elem.removeEventListener("mouseover",() => { if(!isTouchDevice) this.tooltip_text_elem.style.visibility = "visible" });
    this.tooltip_elem.removeEventListener("mouseout",() => { if(!isTouchDevice) this.tooltip_text_elem.style.visibility = "hidden" });
    this.tooltip_elem.removeEventListener("touchstart",() => { if(isTouchDevice) this.tooltip_text_elem.style.visibility = "visible" });
    this.tooltip_elem.removeEventListener("touchend",() => { if(isTouchDevice) this.tooltip_text_elem.style.visibility = "hidden" });

    this.tooltip_elem.removeChild(this.tooltip_text_elem);
  }
}
