window.parent.addEventListener("message",(e) => { if(e.data === "Rendering") render() });

function render() {
  while(main_menu.firstChild) main_menu.removeChild(main_menu.firstChild);
  console.log(MODIFIED_PARAMS._NZ,MODIFIED_PARAMS._FZ,MODIFIED_PARAMS._PROJ_ANGLE,MODIFIED_PARAMS._CANVAS_WIDTH)

}

function gridRender(){
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

function drawPoint(point: Point2D, _strokeStyle = "black", _lineWidth = 1, _fillStyle = "black") {
  ctx.beginPath();
  ctx.lineWidth = _lineWidth;
  ctx.strokeStyle = _strokeStyle;

  ctx.arc(point.x,point.y,3,0,2*Math.PI);
  ctx.fillStyle = _fillStyle;

  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function drawVertex(vertex : _4D_VEC_, _strokeStyle = "black", _lineWidth = 1, _fillStyle = "black") {
  ctx.beginPath();
  ctx.lineWidth = _lineWidth;
  ctx.strokeStyle = _strokeStyle;

  ctx.arc(vertex[0],vertex[1],3,0,2*Math.PI);
  ctx.fillStyle = _fillStyle;

  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function drawLine(a: Point2D,b: Point2D,_strokeStyle = "black", _lineWidth = 2) {
  ctx.beginPath();
  ctx.lineWidth = _lineWidth;
  ctx.strokeStyle = _strokeStyle;

  ctx.moveTo(a.x,a.y);
  ctx.lineTo(b.x,b.y);

  ctx.stroke();
  ctx.closePath();
}

function drawObject(object : _CAM_RENDERED_OBJ_ | undefined){
  if(typeof object === "undefined") return;
  for(const vertex in object.vertices){
    const vertexes = object.vertices[vertex];
    if(typeof vertexes === "undefined") continue;
    drawVertex(vertexes);
  }
}
