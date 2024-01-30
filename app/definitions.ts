interface PICK {
    color: HTMLElement | null;
    pixel: HTMLElement | null;
}

type _ANGLE_UNIT_ = "deg" | "rad" | "grad";

type _2D_VEC_ = [number,number];

type _3D_VEC_ = [number,number,number];

type _4D_VEC_ = [number,number,number,number];

type _7D_VEC_ = [..._3D_VEC_,..._4D_VEC_];

type _9D_VEC_ = [..._3D_VEC_,..._3D_VEC_,..._3D_VEC_];

type _16D_VEC_ = [..._4D_VEC_,..._4D_VEC_,..._4D_VEC_,..._4D_VEC_];

type _3_3_MAT_ = [_3D_VEC_,_3D_VEC_,_3D_VEC_];

type _3_2_MAT_ = [_2D_VEC_,_2D_VEC_,_2D_VEC_];

type _3_4_MAT_ = [_4D_VEC_,_4D_VEC_,_4D_VEC_];

type _3_7_MAT_ = [_7D_VEC_,_7D_VEC_,_7D_VEC_];

type _PLANE_ = "U-V" | "U-N" | "V-N";

type _OBJ_STATE_ = "local" | "object" | "world";

type _HANDEDNESS_ = "left" | "right";

type _OPTICAL_ = "light" | "camera" | "none";

type _CDV_ = "convex-hull" | "delaunay" | "voronoi";

// 0 - 
// 1 - Convex Hull
// 2 - Delaunay
// 3 - Voronoi
// 4 - Convex Hull and Delaunay
// 5 - Convex Hull and Voronoi
// 6 - Delaunay and Voronoi
// 7 - Convex Hull, Delaunay and Voronoi

type _CDV_SWITCH_ = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// A - Basic Point ( Points of Graph)
// B - Super Triangle Point
// C - Voronoi Point ( Triangle Circumcenters)
// D - Basic Edge ( Basic point - Basic Point)
// E - Super Edge ( Basic Point or Super Point - Basic Point or Super Point)
// F - Voronoi Edge ( Voronoi Point - Voronoi Point)
// G - Mid_Edge ( Mid_Point { of selected Voronoi Edge} - Voronoi Point)
// H - Polygon { Triangle ( Basic Point - Basic Point - Basic Point ) }

type _RET_TYPE_ = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"

type _CONVEX_HULL = { hull: Point2D[],points: number[],history: Ret[][] };

type _DELAUNAY = { list: string[],full_point_list: Point2D[],history: Ret[][]; };

type _VORONOI = { edges: string[],full_point_list: Point2D[],history: Ret[][] };

type _FULL_CDV = [_CONVEX_HULL,_DELAUNAY,_VORONOI,MeshDataStructure,string[],Point2D[],Ret[],Point2D[]];

type _RET = { ret_list: Ret[],list: string[] };

type _MINMAX = { minX: number,maxX: number,minY: number,maxY: number };

type _CROSS = { ph: Point2D,qh: Point2D,pv: Point2D,qv: Point2D };

type _MID_EDGES_LIST = {
    mid_pt_index: number;
    circum_pt_index: number;
}

type _HALFEDGE_ = {
  vertices: _2D_VEC_;
  face_vertices: number[];
  twin: string;
  prev: string;
  next: string;
}

enum _ERROR_ {
    _NO_ERROR_ = 1e12,
    _SETTINGS_ERROR_,
    _MISCELLANOUS_ERROR_,
    _QUARTERNION_ERROR_,
    _MATRIX_ERROR_,
    _VECTOR_ERROR_,
    _PERSPECTIVE_PROJ_ERROR_,
    _CLIP_ERROR_,
    _LOCAL_SPACE_ERROR_,
    _WORLD_SPACE_ERROR_,
    _CLIP_SPACE_ERROR_,
    _SCREEN_SPACE_ERROR_,
    _OPTICAL_ELEMENT_OBJECT_ERROR_,
    _RENDER_ERROR_,
    _DRAW_CANVAS_ERROR_,
}

interface _DRAG_ {
    change: (value: number) => void,
    start: (element: any) => void,
    sensitivity: number
}

interface _BASIC_PARAMS_ {
    _GLOBAL_ALPHA: number,
    _CANVAS_OPACITY: string,
    _CANVAS_WIDTH: number,
    _CANVAS_HEIGHT: number,
    _BORDER_COLOR: string,
    _BORDER_WIDTH: string,
    _BORDER_RADIUS: string,
    _BORDER_STYLE: string,
    _THETA: number,
    _ANGLE_UNIT: _ANGLE_UNIT_
    _ANGLE_CONSTANT: number,
    _REVERSE_ANGLE_CONSTANT: number,
    _HANDEDNESS: _HANDEDNESS_;
    _HANDEDNESS_CONSTANT: number,
    _X: _3D_VEC_,
    _Y: _3D_VEC_,
    _Z: _3D_VEC_,
    _Q_VEC: _3D_VEC_,
    _Q_QUART: _4D_VEC_,
    _Q_INV_QUART: _4D_VEC_,
    _NZ: number,
    _FZ: number,
    _PROJ_ANGLE: number,
    _ASPECT_RATIO: number,
    _DIST: number,
    _HALF_X: number,
    _HALF_Y: number,
    _PROJECTION_MAT: _16D_VEC_,
    _INV_PROJECTION_MAT: _16D_VEC_,
    _ACTIVE: string,
}

const DEFAULT_PARAMS: _BASIC_PARAMS_ =
{
    _GLOBAL_ALPHA: 1,
    _CANVAS_OPACITY: '1',
    _CANVAS_WIDTH: 1,
    _CANVAS_HEIGHT: 1,
    _BORDER_COLOR: 'red',
    _BORDER_WIDTH: '4',
    _BORDER_RADIUS: '2',
    _BORDER_STYLE: "solid",
    _THETA: 0,
    _ANGLE_UNIT: "deg",
    _ANGLE_CONSTANT: Math.PI / 180,
    _REVERSE_ANGLE_CONSTANT: 180 / Math.PI,
    _HANDEDNESS: "right",
    _HANDEDNESS_CONSTANT: 1,
    _X: [1,0,0],
    _Y: [0,1,0],
    _Z: [0,0,1],
    _Q_VEC: [0,0,0],
    _Q_QUART: [0,0,0,0],
    _Q_INV_QUART: [0,0,0,0],
    _NZ: -0.1,
    _FZ: -100,
    _PROJ_ANGLE: 60,
    _ASPECT_RATIO: 1,
    _DIST: 1,
    _HALF_X: 1,
    _HALF_Y: 1,
    _PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    _INV_PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    _ACTIVE: "",
}

const MODIFIED_PARAMS: _BASIC_PARAMS_ = JSON.parse(JSON.stringify(DEFAULT_PARAMS));

class Point2D {
  x: number;
  y: number;
  r: number;
  constructor (x: number,y: number,r = 0) {
      this.x = x;
      this.y = y;
      this.r = r;
  }
}

class Point3D {
  x: number;
  y: number;
  z: number;
  constructor (x: number,y: number,z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
  }
}

class Ret {
  public _ret: string;
  public _color_code: string;
  public _line: boolean;
  public _s_width: number;
  public _type: _RET_TYPE_;

  constructor (ret: string,color_code = "black",line = true,_s_width = 1,type: _RET_TYPE_ = "A") {
      this._line = line;
      this._ret = ret;
      this._color_code = color_code;
      this._s_width = _s_width;
      this._type = type;
  }

  equals(input: string) {
      if(this._line === true) {
          const [i_a,i_b] = input.split("-");
          const [r_a,r_b] = this._ret.split("-");

          if((i_a === r_a) && (i_b === r_b)) return true;
          else return false;
      }
      else return false;
  }
}

class MeshDataStructure {
  HalfEdgeDict: {};
  face_tmp: number[];
  faces: string[];
  sorted_faces : string[];
  prev: string | null;
  next: string | null;
  temp: string | null;
  face_vertices_tmp: number[];
  face_indexes_tmp : number[];
  edge_no: number;
  vertex_no: number;
  vertex_indexes: Set<number>;
  multiplier = 10;

  constructor (vertex_num = 0) {
      this.HalfEdgeDict = {};
      this.face_tmp = [];
      this.faces = [];
      this.sorted_faces = [];
      this.prev = null;
      this.next = null;
      this.temp = null;
      this.face_vertices_tmp = [];
      this.face_indexes_tmp = [];
      this.edge_no = 0;
      this.vertex_no = vertex_num;
      this.vertex_indexes = new Set();
  }

  halfEdge(start: number,end: number): _HALFEDGE_ {
      this.vertex_indexes.add(start);
      this.vertex_indexes.add(end);
      this.vertex_no = [...this.vertex_indexes].length;
      const comp = Math.max(start, end);
      if(this.multiplier % comp === this.multiplier) this.multiplier*=10;
      return {
          vertices: [start,end],
          face_vertices: [],
          twin: "-",
          prev: "-",
          next: "-",
      };
  }

  setHalfEdge(a: number,b: number,set_halfEdge = true) {
      let halfEdgeKey = `${a}-${b}`;
      let twinHalfEdgeKey = `${b}-${a}`;

      // If halfedge does exist in halfedge dict switch halfedge key to twin halfedge key and vice-versa
      if((this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_)) {
          const halfEdgeKeyTemp = twinHalfEdgeKey;
          twinHalfEdgeKey = halfEdgeKey;
          halfEdgeKey = halfEdgeKeyTemp;
      }

      // If halfedge does not exist in halfedge dict, create halfedge and increment the edge number
      if(!(this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_) && set_halfEdge === true) {
          (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_) = this.halfEdge(a,b);
          this.edge_no++;
          (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).face_vertices = this.face_vertices_tmp;
      }
      else twinHalfEdgeKey;

      // if twin halfedge exists in halfedge dict, decrement the edge number
      if((this.HalfEdgeDict[twinHalfEdgeKey] as _HALFEDGE_)) {
          (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).twin = twinHalfEdgeKey;
          (this.HalfEdgeDict[twinHalfEdgeKey] as _HALFEDGE_).twin = halfEdgeKey;
          this.edge_no--;
      }

      return halfEdgeKey;
  }

  addHalfEdge(edge: string | _2D_VEC_) {
      if(typeof edge === "string") edge = edge.split("-").map((value) => Number(value)) as _2D_VEC_;
      return this.setHalfEdge(...edge);
  }

  removeHalfEdge(edge: string,confirm = false,get_faces = true,iterative_search = true,delete_associated_half_edges = false) {
      if(confirm === true) {
          if(!this.HalfEdgeDict[edge]) return false; // halfedge was not deleted because it does not exist
      }

      const [a,b] = edge.split("-");
      const face_vertices = (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices;// get the face vertices
      const new_face_vertices: Set<number> = new Set(face_vertices); // modified face vertices

      // if vertex a belongs to only one face remove it and modify the face vertices
      if(get_faces === true) {
          if(this.getFacesofVertexGeneric(a).length <= 1) {
              this.vertex_indexes.delete(Number(a));
              new_face_vertices.delete(Number(a));
          }

          // if vertex b belongs to only one face remove it and modify the face vertices
          if(this.getFacesofVertexGeneric(b).length <= 1) {
              this.vertex_indexes.delete(Number(b));
              new_face_vertices.delete(Number(b));
          }
      }

      if(iterative_search === true) {
          // get the previous and the next halfedges
          let prev_halfEdgeKey = (this.HalfEdgeDict[edge] as _HALFEDGE_).prev;
          let next_halfEdgeKey = (this.HalfEdgeDict[edge] as _HALFEDGE_).next;
          let cur_halfEdgeKey = "-";

          // If the previous halfedge exists
          if(prev_halfEdgeKey === undefined || prev_halfEdgeKey !== "-") {
              (this.HalfEdgeDict[prev_halfEdgeKey] as _HALFEDGE_).next = "-";

              while(prev_halfEdgeKey !== "-") {
                  (this.HalfEdgeDict[prev_halfEdgeKey] as _HALFEDGE_).face_vertices = [...new_face_vertices];
                  cur_halfEdgeKey = prev_halfEdgeKey;
                  prev_halfEdgeKey = (this.HalfEdgeDict[prev_halfEdgeKey] as _HALFEDGE_).prev;
                  if(delete_associated_half_edges === true) delete this.HalfEdgeDict[cur_halfEdgeKey];
              }
          }

          // If the next halfedge exists
          if(next_halfEdgeKey === undefined || next_halfEdgeKey !== "-") {
              (this.HalfEdgeDict[next_halfEdgeKey] as _HALFEDGE_).prev = "-";

              while(next_halfEdgeKey !== "-") {
                  (this.HalfEdgeDict[next_halfEdgeKey] as _HALFEDGE_).face_vertices = [...new_face_vertices];
                  cur_halfEdgeKey = next_halfEdgeKey;
                  next_halfEdgeKey = (this.HalfEdgeDict[next_halfEdgeKey] as _HALFEDGE_).next;
                  if(delete_associated_half_edges === true) delete this.HalfEdgeDict[cur_halfEdgeKey];
              }
          }

          if(delete_associated_half_edges === true) this.faces.splice(this.faces.indexOf(face_vertices.join("-")),1);
          else this.faces[this.faces.indexOf(face_vertices.join("-"))] = [...new_face_vertices].join("-");
      }

      delete this.HalfEdgeDict[a + "-" + b]; // delete the halfedge

      this.vertex_no = [...this.vertex_indexes].length; // update vertex number
      const twinHalfEdgeKey = b + "-" + a;
      if(!this.HalfEdgeDict[twinHalfEdgeKey]) this.edge_no-- // decrease edge number if the twin does not exist

      return true; // halfedge was successfully deleted
  }


  addVertex(vertex: string | number,vertex_or_face_or_edge: string | number[]) {
      if(typeof vertex_or_face_or_edge === "string") vertex_or_face_or_edge = vertex_or_face_or_edge.split("-").map((value) => Number(value));
      if(vertex_or_face_or_edge.length === 1) return this.addHalfEdge(`${vertex}-${vertex_or_face_or_edge[0]}`);
      if(vertex_or_face_or_edge.length >= 2) for(const val of vertex_or_face_or_edge) return this.addHalfEdge(`${vertex}-${val}`);
      return `${vertex}` // is not supposed to happen
  }

  removeVertex(vertex: string | number) {
      let count = 0;
      for(const edge in this.HalfEdgeDict) {
          if(edge.split("-").includes(`${vertex}`)) {
              const [a,b] = edge.split("-");
              const twinHalfEdgeKey = `${b}-${a}`;
              delete (this.HalfEdgeDict[edge]);
              delete (this.HalfEdgeDict[twinHalfEdgeKey]);
              this.vertex_indexes.delete(Number(vertex));
              this.vertex_no = [...this.vertex_indexes].length;
              this.edge_no--;
              count++;
          }
      }
      return count;
  }

  getEdgesOfVertexFast(vertex : number, edge_num_list : number[]){
      const edge_list : string[] = [];
      edge_num_list.map((value)=>{
          const min = value % this.multiplier;
          const max = (value - min) / this.multiplier;
          if (vertex === min || vertex === max) edge_list.push(`${min}-${max}`);
      });
      return edge_list;
  }

  getEdgesofVertex(vertex: string | number,no_half_edge = false) {
      const edge_list: string[] = [];

      for(const edge in this.HalfEdgeDict) {
              const [a,b] = edge.split("-");
              var rev = b + "-" + a;

              if(no_half_edge === true) if (edge_list.includes(rev)) continue

              if(edge_list.includes(edge)) continue;

              // edge touches vertex and is not in the edge_list
              if(edge.split("-").includes(`${vertex}`)) edge_list.push(edge);
          }

      return edge_list;
  }

  getFacesofVertexSpecific(edge_list : string[]) {
      const face_list: string[] = [];
      const faces: number[][] = [];

      for(const edge of edge_list) {
          const face = (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices;
          if(!face_list.includes(face.join("-"))) {
              face_list.push(face.join("-"));
              faces.push(face);
          }
      }

      return faces;
  }

  getFacesofVertexGeneric(vertex : string | number){
      const edge_list = this.getEdgesofVertex(vertex);
      return this.getFacesofVertexSpecific(edge_list);
  }


  addEdge(edge: string | _2D_VEC_) {
      if(typeof edge === "string") edge = edge.split("-").map((value) => Number(value)) as _2D_VEC_;
      this.setHalfEdge(...edge);
      this.setHalfEdge(edge[1],edge[0]);
      return edge;
  }

  removeEdge(edge: string | _2D_VEC_,confirm = false,get_faces = true) {
      if(typeof edge === "object") edge = edge.join("-");
      const [a,b] = edge.split("-");
      return this.removeHalfEdge(edge,confirm,get_faces) || this.removeHalfEdge(b + "-" + a,confirm,get_faces);
  }

  // setSplitEdge(a: string,b: string,vertex: string | number) {
  //     if(!this.HalfEdgeDict[a + "-" + b]) this.setHalfEdge(Number(a),Number(b)); // create halfedge if it doesn't exist
  //     // If the halfEdge exists split it and update the next and previous halfEdges if they exist
  //     if(this.HalfEdgeDict[a + "-" + b]) {
  //         // Get the two split halfEdges
  //         const edge_a = `${a}-${vertex}`;
  //         const edge_b = `${vertex}-${b}`;

  //         // Get and take care of the previous and next halfEdges of the original halfEdge (halfEdge before splitting)
  //         let prev = (this.HalfEdgeDict[a + "-" + b] as _HALFEDGE_).prev;
  //         let next = (this.HalfEdgeDict[a + "-" + b] as _HALFEDGE_).next;

  //         // Create the two split halfEdges
  //         this.setHalfEdge(Number(a),Number(vertex));
  //         this.setHalfEdge(Number(vertex),Number(b));
  //         (this.HalfEdgeDict[edge_a] as _HALFEDGE_).next = edge_b;
  //         (this.HalfEdgeDict[edge_b] as _HALFEDGE_).prev = edge_a;

  //         if(prev !== "-") {
  //             (this.HalfEdgeDict[prev] as _HALFEDGE_).next = edge_a;
  //             (this.HalfEdgeDict[edge_a] as _HALFEDGE_).prev = prev;
  //         }

  //         if(next !== "-") {
  //             (this.HalfEdgeDict[next] as _HALFEDGE_).prev = edge_b;
  //             (this.HalfEdgeDict[edge_b] as _HALFEDGE_).next = next;
  //         }

  //         delete this.HalfEdgeDict[a + "-" + b];

  //         return true; // edge split successfully
  //     }

  //     return false; // edge not found
  // }

  // splitEdge(vertex: string | number,edge: string | _2D_VEC_) {
  //     if(typeof edge === "object") edge = edge.join("-");
  //     const [a,b] = edge.split("-");

  //     // Split the edge
  //     var bool_h = this.setSplitEdge(a,b,vertex);
  //     var bool_t_h = this.setSplitEdge(b,a,vertex);

  //     if(bool_h || bool_t_h) this.edge_no--;

  //     return bool_h || bool_t_h;
  // }

  // setMergeEdges(a_1: string,b_1: string,a_2: string,b_2: string) {
  //     var ltr = false; // left to right ( [a1, b1] ----- [a2, b2] )
  //     var rtl = false; // right to left ( [a2, b2] ----- [a1, b1] )
  //     let test: string[] = [];

  //     // Check if both halfEdges exist
  //     if(this.HalfEdgeDict[a_1 + "-" + b_1] && this.HalfEdgeDict[a_2 + "-" + b_2]) {
  //         // Check if they are adjacent and find their order
  //         if(this.HalfEdgeDict[a_1 + "-" + b_1].next === a_2 + "-" + b_2) ltr = true;
  //         if(this.HalfEdgeDict[a_1 + "-" + b_1].prev === a_2 + "-" + b_2) rtl = true;

  //         // if edges are not adjacent return false
  //         if((ltr || rtl) !== true) return { bool: ltr || rtl,v: test[0] };

  //         var prev = "-";
  //         var next = "-";

  //         const halfEdgeKey_union = [a_1,b_1,a_2,b_2].map((value,index,array) => value + "-" + array[(index + 1) % array.length]);

  //         // get the common vertex of the adjacent edges
  //         for(const val of halfEdgeKey_union) {
  //             test = val.split("-");
  //             if(test[0] === test[1]) {
  //                 break;
  //             }
  //         }

  //         if(ltr === true) {
  //             const halfEdge = this.setHalfEdge(Number(a_1),Number(b_2));
  //             prev = (this.HalfEdgeDict[a_1 + "-" + b_1] as _HALFEDGE_).prev;
  //             next = (this.HalfEdgeDict[a_2 + "-" + b_2] as _HALFEDGE_).next;
  //             (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).prev = prev;
  //             (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).next = next;
  //             if(prev !== "-") {
  //                 (this.HalfEdgeDict[prev] as _HALFEDGE_).next = halfEdge;
  //                 const face_set = new Set((this.HalfEdgeDict[prev] as _HALFEDGE_).face_vertices);
  //                 face_set.delete(Number(test[0]));
  //                 (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).face_vertices = [...face_set];
  //             }
  //             if(next != "-") {
  //                 (this.HalfEdgeDict[next] as _HALFEDGE_).prev = halfEdge;
  //                 const face_set = new Set((this.HalfEdgeDict[next] as _HALFEDGE_).face_vertices);
  //                 face_set.delete(Number(test[0]));
  //                 (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).face_vertices = [...face_set];
  //             }
  //         }

  //         if(rtl === true) {
  //             const halfEdge = this.setHalfEdge(Number(a_2),Number(b_1));
  //             prev = (this.HalfEdgeDict[a_2 + "-" + b_2] as _HALFEDGE_).prev;
  //             next = (this.HalfEdgeDict[a_1 + "-" + b_1] as _HALFEDGE_).next;
  //             (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).prev = prev;
  //             (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).next = next;
  //             if(prev !== "-") {
  //                 (this.HalfEdgeDict[prev] as _HALFEDGE_).next = halfEdge;
  //                 const face_set = new Set((this.HalfEdgeDict[prev] as _HALFEDGE_).face_vertices);
  //                 face_set.delete(Number(test[0]));
  //                 (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).face_vertices = [...face_set];
  //             }
  //             if(next != "-") {
  //                 (this.HalfEdgeDict[next] as _HALFEDGE_).prev = halfEdge;
  //                 const face_set = new Set((this.HalfEdgeDict[next] as _HALFEDGE_).face_vertices);
  //                 face_set.delete(Number(test[0]));
  //                 (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).face_vertices = [...face_set];
  //             }
  //         }

  //         delete this.HalfEdgeDict[a_1 + "-" + b_1];
  //         delete this.HalfEdgeDict[a_2 + "-" + b_2];
  //     }

  //     return { bool: ltr || rtl,v: test[0] }; // true if edges were merged successfully; false if one or both edges were not found, or if edges were not adjacent
  // }

  // mergeEdges(edge_1: string | _2D_VEC_,edge_2: string | _2D_VEC_) {
  //     if(typeof edge_1 === "object") edge_1 = edge_1.join("-");
  //     const [a_1,b_1] = edge_1.split("-");

  //     if(typeof edge_2 === "object") edge_2 = edge_2.join("-");
  //     const [a_2,b_2] = edge_2.split("-");

  //     // Merge the edges
  //     var res_h = this.setMergeEdges(a_1,b_1,a_2,b_2);
  //     var res_t_h = this.setMergeEdges(b_1,a_1,b_2,a_2);

  //     if(res_h.bool || res_t_h.bool) {
  //         this.edge_no = this.edge_no - 2;
  //         const v = res_h.bool ? res_h.v : res_t_h.v
  //         const vertex_edges = this.getEdgesofVertex(v);

  //         for(const edge of vertex_edges) {
  //             this.removeEdge(edge,true,false);
  //         }
  //     }

  //     return res_h.bool || res_t_h.bool;
  // }

  edgeReverse(edge: string | _2D_VEC_) {
      if(typeof edge === "object") edge = edge.join("-");
      const [a,b] = edge.split("-");
      return `${b}-${a}`;
  }

  getVerticesofEdge(edge: string | _2D_VEC_) {
      if(typeof edge === "string") return edge.split("-").map((value) => Number(value)) as _2D_VEC_;
      else return edge;
  }

  getFacesofEdge(edge: string | _2D_VEC_) {
      if(typeof edge === "object") edge = edge.join("-");
      const twinHalfEdgeKey = (this.HalfEdgeDict[edge] as _HALFEDGE_).twin;
      return [(this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices,(this.HalfEdgeDict[twinHalfEdgeKey] as _HALFEDGE_).face_vertices];
  }

  edgeToNumber(){
      const edge_num_set : Set<number> = new Set();
      for (const edge in (this.HalfEdgeDict as _HALFEDGE_)){
          const [a,b] = edge.split("-").map((value)=>Number(value));
          const [min, max] = [Math.min(a,b), Math.max(a,b)];
          edge_num_set.add(max*this.multiplier+min);
      }
      return [...edge_num_set];
  }

  addFace(face: string) {
      this.face_vertices_tmp = face.split("-").map((value)=>Number(value));
      const sorted_face = [...this.face_vertices_tmp].sort((a,b)=>a-b).join("-");

      // If face is not found in faces add face to faces and set its halfedges
      if(!this.faces.includes(face) && this.face_vertices_tmp.length > 2 && !this.sorted_faces.includes(sorted_face)) {
          this.faces.push(face);
          this.sorted_faces.push(sorted_face);

          const first_index = this.face_vertices_tmp[0];
          const second_index = this.face_vertices_tmp[1];
          const last_index = this.face_vertices_tmp[this.face_vertices_tmp.length-1];

          for(let p in this.face_vertices_tmp) {
              const index = Number(p);
              const i = this.face_vertices_tmp[p];
              const j = this.face_vertices_tmp[(index + 1) % this.face_vertices_tmp.length];
              const halfEdgeKey = this.setHalfEdge(i, j);
              const [a,b] = halfEdgeKey.split("-");

              if(this.temp === null) {
                  this.prev = "-";
              }
              else {
                  this.prev = this.temp + "-" + a;
              }

              if(this.HalfEdgeDict[this.prev]) {
                  (this.HalfEdgeDict[this.prev] as _HALFEDGE_).next = halfEdgeKey;
              }

              this.next = "-";
              (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).prev = this.prev;
              (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).next = this.next;

              this.temp = a;

              if(index === 0) (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).prev = `${last_index}-${first_index}`;
              if(index === this.face_vertices_tmp.length-1) (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).next = `${first_index}-${second_index}`;

          }

          // reset temp, prev and next
          this.temp = null;
          this.prev = null;
          this.next = null;
          this.face_vertices_tmp = [];

          return true; // face added successfully
      }

      return false; // face not added
  }

  removeFace(face: string) {
      let found_edges = 0;
      const face_vertices = face.split("-").map((value)=>Number(value));
      const sorted_face = [...face_vertices].sort((a,b)=>a-b).join("-");

      const face_len = face.length;

      // Check if face is found in faces, if yes remove it
      if(this.faces.includes(face)) {
          // iterate through the edges until an edge's face marching the face is found
          for(const edge in this.HalfEdgeDict) {
              // Check if the edge's vertices marches the face's vertices
              if((this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices.join("-") === face_vertices.join("-")) {
                  let old_halfEdgeKey = edge;
                  let new_halfEdgeKey = (this.HalfEdgeDict[old_halfEdgeKey] as _HALFEDGE_).next;
                  // remove the halfedge later (we are postponing the removal of the original halfedge here)
                  found_edges++;

                  // Try to crawl with next until the found edges tally with the face's length
                  while(found_edges < face_len) {
                      // If the next halfedge is non-existent break the while loop
                      if(new_halfEdgeKey === undefined || new_halfEdgeKey === "-") {
                          new_halfEdgeKey = edge;
                          break;
                      }

                      old_halfEdgeKey = new_halfEdgeKey;
                      new_halfEdgeKey = (this.HalfEdgeDict[old_halfEdgeKey] as _HALFEDGE_).next; // update the halfedge
                      this.removeHalfEdge(old_halfEdgeKey,false); // remove the halfedge non-iteratively
                      found_edges++;
                  }

                  // If the found edges do not yet tally try to crawl with previous until the found edges tally with the face's length
                  while(found_edges < face_len) {
                      if(new_halfEdgeKey === undefined || new_halfEdgeKey === "-") break; // If the previous halfedge is non-existent break the while loop

                      old_halfEdgeKey = new_halfEdgeKey;
                      new_halfEdgeKey = (this.HalfEdgeDict[old_halfEdgeKey] as _HALFEDGE_).prev; // update the halfedge
                      this.removeHalfEdge(old_halfEdgeKey,false); // remove the halfedge non-iteratively
                      found_edges++;
                  }

                  // If the found edges don't yet still tally with the face's length at this point we leave it like that and proceed to remove the original halfedge that we postponed

                  this.removeHalfEdge(edge,false); // remove the halfedge
                  this.faces.splice(this.faces.indexOf(face),1);
                  this.sorted_faces.splice(this.sorted_faces.indexOf(sorted_face))

                  return true; // face removed successfully
              }
          }
      }

      return false; // face not removed
  }

  getVerticesofFace(face: number[]) {
      return face;
  }

  getEdgesofFace(face: number[]) {
      return face.map((value,index) => `${value}-${face[(index + 1) % face.length]}`);
  }

  splitFace() {}

  mergeface() {}

  sumPoints(points : Point3D[]): Point3D {
      var res: Point3D = new Point3D(0,0,0);
      for(const point of points) {
          res.x += point.x;
          res.y += point.y;
          res.z += point.z;
      }
      return res;
  }

  getMinMax(points : Point3D[]){
      var minX = Infinity;
      var maxX = -Infinity;
      var minY = Infinity;
      var maxY = -Infinity;
      var minZ = Infinity;
      var maxZ = -Infinity;

      for(const point of points){
          if(minX > point.x) minX = point.x;
          if(maxX < point.x) maxX = point.x;
          if(minY > point.y) minY = point.y;
          if(maxY < point.y) maxY = point.y;
          if(minZ > point.z) minZ = point.z;
          if(maxZ < point.z) maxZ = point.z;
      }

     return [minX, maxX, minY, maxY, minZ, maxZ]; 
  }

  triangulate(points_list : Point3D[]) {
      const triangulated_points_list: Point3D[] = [];
      triangulated_points_list.push(...points_list);
      const new_mesh = new MeshDataStructure();

      for(const face of this.faces) {
          const vertex_indexes = face.split("-").map((value) => Number(value));
          const face_edges = this.getEdgesofFace(vertex_indexes);

          const vertices = vertex_indexes.map((value) => { return points_list[value] });

          const [x_min,x_max, y_min, y_max, z_min, z_max] = this.getMinMax(vertices);

          const avg_point = new Point3D((x_min + x_max) / 2,(y_min + y_max) / 2,(z_min + z_max) / 2);
          const avg_point_index = triangulated_points_list.push(avg_point)-1;

          new_mesh.addFace(vertex_indexes.join("-"));
          new_mesh.faces.pop();

          for(const edge of face_edges) {
              const [a,b] = edge.split("-");
              const prev = `${avg_point_index}-${a}`;
              const next = `${b}-${avg_point_index}`;
              const new_vertex_indexes = [avg_point_index, Number(a), Number(b)];

              new_mesh.setHalfEdge(avg_point_index, Number(a));
              new_mesh.setHalfEdge(Number(b), avg_point_index);
              (new_mesh.HalfEdgeDict[prev] as _HALFEDGE_).face_vertices = new_vertex_indexes;
              (new_mesh.HalfEdgeDict[next] as _HALFEDGE_).face_vertices = new_vertex_indexes;
              (new_mesh.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices = new_vertex_indexes;

              (new_mesh.HalfEdgeDict[prev] as _HALFEDGE_).prev = next;
              (new_mesh.HalfEdgeDict[prev] as _HALFEDGE_).next = edge;
              (new_mesh.HalfEdgeDict[edge] as _HALFEDGE_).prev = prev;
              (new_mesh.HalfEdgeDict[edge] as _HALFEDGE_).next = next;
              (new_mesh.HalfEdgeDict[next] as _HALFEDGE_).prev = edge;
              (new_mesh.HalfEdgeDict[next] as _HALFEDGE_).next = prev;

              new_mesh.faces.push(`${avg_point_index}-${a}-${b}`);
          }
      }
      return { "points": triangulated_points_list, mesh : new_mesh };
  }    
}
