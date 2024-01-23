// window.parent.addEventListener("message", (e) => window.parent.postMessage(e.data));

window.parent.addEventListener("message", (e)=>{if(e.data === "Editing") edit()});


function edit(){
  while (main_menu.firstChild) main_menu.removeChild(main_menu.firstChild);

  const object_div = document.createElement("div");
  main_menu.appendChild(object_div);

  const objs = document.createElement("p");
  objs.textContent = "Create Objects";
  object_div.style.zIndex = "inherit";
  object_div.appendChild(objs);

  new Box_SVG_Indicator(object_div); 

}

class CreateToolTip{
  tooltip_container_elem : HTMLElement;
  tooltip_elem : HTMLElement;
  tooltip_text_elem : HTMLSpanElement;
  vert_padding : number;
  width : number;
  tooltip_text_elem_orientation = "default";
  default_positioning : {top:string, bottom:string, left:string, right:string,marginLeft:string};
  constructor(tooltip_container: HTMLElement, tooltip : HTMLElement, tooltip_text : string, vert_padding = 5, width : number){
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
    tooltip_text_element.style.zIndex = `${Number(window.getComputedStyle(tooltip).zIndex)+10}`;
    tooltip_text_element.style.borderRadius = "5px";
    tooltip_text_element.style.padding = `${vert_padding}px 0`;
    this.vert_padding = vert_padding;

    this.default_positioning = {
      top : window.getComputedStyle(tooltip_text_element).top,
      bottom : window.getComputedStyle(tooltip_text_element).bottom,
      left : window.getComputedStyle(tooltip_text_element).left,
      right : window.getComputedStyle(tooltip_text_element).right,
      marginLeft : window.getComputedStyle(tooltip_text_element).marginLeft,
    }

    tooltip.appendChild(tooltip_text_element);
    tooltip.addEventListener("mousemove", () => tooltip_text_element.style.visibility = "visible");
    tooltip.addEventListener("mouseout", () => tooltip_text_element.style.visibility = "hidden");
  }

  change_vert_padding(vert_padding:number){
    this.tooltip_text_elem.style.padding = `${vert_padding}px 0`;
    this.vert_padding = vert_padding;

    if(this.tooltip_text_elem_orientation === "left" || this.tooltip_text_elem_orientation === "right") this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
  }

  change_width(width:number){
    this.tooltip_text_elem.style.width = `${width}px`;
    this.width = width;
  }

  toDefault(){
    this.tooltip_text_elem.style.top = this.default_positioning.top;
    this.tooltip_text_elem.style.bottom = this.default_positioning.bottom;
    this.tooltip_text_elem.style.left = this.default_positioning.left;
    this.tooltip_text_elem.style.right = this.default_positioning.right;
    this.tooltip_text_elem.style.marginLeft = this.default_positioning.marginLeft;
    this.tooltip_text_elem.style.padding = `${this.vert_padding}px 0`;
    this.tooltip_text_elem_orientation = "";
  }

  left_tooltip(){
    this.toDefault();
    this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
    this.tooltip_text_elem.style.right = "105%";
    this.tooltip_text_elem_orientation = "right";
    this.tooltip_text_elem.className = "tooltiptext_right";
  }

  right_tooltip(){
    this.toDefault();
    this.tooltip_text_elem.style.top = `-${this.vert_padding}px`;
    this.tooltip_text_elem.style.left = "105%";
    this.tooltip_text_elem_orientation = "left";
    this.tooltip_text_elem.className = "tooltiptext_left";
  }

  top_tooltip(){
    this.toDefault();
    this.tooltip_text_elem.style.bottom = "100%";
    this.tooltip_text_elem.style.left = "50%";
    const half_width = this.width/2;
    const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
    const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
    const after = half_width > (container_width - this.tooltip_elem.offsetLeft) ? half_width - (container_width - this.tooltip_elem.offsetLeft) + this.tooltip_container_elem.offsetLeft : 0;
    this.tooltip_text_elem.className = "tooltiptext_top";
    this.tooltip_text_elem.style.margin = "5px 0";

    this.tooltip_elem.addEventListener("mousemove", () => {
    this.tooltip_text_elem.style.marginLeft = `-${half_width-before+after}px`;
    root.style.setProperty("--margin-left-percent",`${(half_width-before+after)/this.width*100}%`);
    });
  }

  bottom_tooltip(){
    this.toDefault();
    this.tooltip_text_elem.style.top = "100%";
    this.tooltip_text_elem.style.left = "50%";
    const half_width = this.width/2;
    const container_width = Number(window.getComputedStyle(this.tooltip_container_elem).width.split("px")[0]);
    const before = half_width > this.tooltip_elem.offsetLeft ? half_width - this.tooltip_elem.offsetLeft : 0;
    const after = half_width > (container_width - this.tooltip_elem.offsetLeft) ? half_width - (container_width - this.tooltip_elem.offsetLeft) + this.tooltip_container_elem.offsetLeft : 0;
    this.tooltip_text_elem.className = "tooltiptext_bottom";
    this.tooltip_text_elem.style.margin = "5px 0";

    this.tooltip_elem.addEventListener("mousemove", () => {
      this.tooltip_text_elem.style.marginLeft = `-${half_width-before+after}px`;
      root.style.setProperty("--margin-left-percent",`${(half_width-before+after)/this.width*100}%`);
      });
  }
}

class SVG_Indicator{
  svg_class : CreateSVG;
  tooltip_class : CreateToolTip;
  constructor(container:HTMLElement, max_child_elem_count:number,tooltip_text="Generic"){
    const sub_container = document.createElement("div");
    sub_container.style.margin = "10px";
    container.appendChild(sub_container);
    this.svg_class = new CreateSVG(sub_container, "20","20", max_child_elem_count);
    this.tooltip_class = new CreateToolTip(container,sub_container,tooltip_text,5,100);
    this.tooltip_class.top_tooltip();
  }
}

class Box_SVG_Indicator extends SVG_Indicator{
  constructor(container:HTMLElement){
    super(container,12,"Cuboid");
    new CreateSVGLine(this.svg_class, "1", "1", "12", "1", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "8", "7", "19", "7", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "1", "13", "12", "13", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "8", "19", "19", "19", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "1", "1", "1", "13", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "8", "7", "8", "19", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "12", "1", "12", "13", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "19", "7", "19", "19", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "1", "1", "8", "7", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "12", "1", "19", "7", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "1", "13", "8", "19", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);
    new CreateSVGLine(this.svg_class, "12", "13", "19", "19", svg_objects_color, svg_objects_strokeWidth,svg_hover_color);   
  }
}