class CreateObject {
  width: number;
  height: number;
  depth: number;
  points_list: Point3D[]
  mesh: MeshDataStructure;
  _is_degenerate_: boolean;
  vert_st: number;
  shape: string;

  constructor (width: number,height: number,depth: number,start_vertex: number) {
      this.points_list = [];
      this.mesh = new MeshDataStructure();
      this.width = width;
      this.height = height;
      this.depth = depth;
      this._is_degenerate_ = false;
      this.vert_st = start_vertex;
      this.shape = "Generic";
  }

  reconstructMesh() {}

  initMesh() {};

  changePoint(index: number,new_x: number,new_y: number,new_z: number) {
      if(index < this.points_list.length) {
          this.points_list[index] = new Point3D(new_x,new_y,new_z);
          return true;
      }
      return false;
  }

  addPoint(new_x: number,new_y: number,new_z: number,vertex_or_face_or_edge = "") {
      if(vertex_or_face_or_edge === "") return this.points_list.length;
      if(this._is_degenerate_) return this.points_list.length;
      else {
          this.mesh.addVertex(this.mesh.max_vertex_index + 1,vertex_or_face_or_edge);
          return this.points_list.push(new Point3D(new_x,new_y,new_z));
      }
  }

  removePoint(vertex_index = -1) {
      if(vertex_index >= 0) {
          const count = this.mesh.removeVertex(vertex_index);
          if(count > 0) {
              this.points_list.splice(vertex_index,1);
              return true;
          }
      }
      return false
  }

  addEdge(edge = ""){
      if(edge === "") return [] as number[];
      return this.mesh.addEdge(edge)
  }

  removeEdge(edge = ""){
      if(edge === "") return false;
      return this.mesh.removeEdge(edge);
  }

  addFace(face = ""){
      if(face === "") return false;
      return this.mesh.addFace(face);
  }

  removeFace(face = ""){
      if(face === "") return false;
      return this.mesh.removeFace(face);
  }

  modifyDimensions(width = this.width,height = this.height,depth = this.depth) {
      if(!this._is_degenerate_) {
          this.width = width;
          this.height = height;
          this.depth = depth;
          this.points_list = [];
      }
  }

  calculatePoints() {}

  editDimensions() {}
}

/* 1D Shapes */
class CreatePoint extends CreateObject {
  point: Point3D;
  constructor (x = 0,y = 0,z = 0,start_vertex = 0) {
      super(0,0,0,start_vertex);
      this.shape = "Point";
      this.point = new Point3D(x,y,z);
      this._is_degenerate_ = true;
      return this.initMesh();
  }

  reconstructMesh(start_vertex = 0) {
      this.vert_st = start_vertex;
      this.mesh.reset();
      return this.initMesh();
  }

  initMesh() {
      this.mesh.addVertex(this.vert_st,[this.vert_st]);
      return this;
  }

  calculatePoints() {
      this.points_list[0] = this.point;
      return this;
  }

  editDimensions(x = this.point.x,y = this.point.y,z = this.point.z) {
      this.point = new Point3D(x,y,z);
      this.points_list = [];
      return this;
  }
}

class CreateLine extends CreateObject {
  start: Point3D;
  end: Point3D;
  constructor (s_x = 0,s_y = 0,s_z = 0,e_x = 0,e_y = 0,e_z = 0,start_vertex = 0) {
      super(0,0,0,start_vertex);
      this.shape = "Line";
      this._is_degenerate_ = true;
      this.start = new Point3D(s_x,s_y,s_z);
      this.end = new Point3D(e_x,e_y,e_z);
      return this.initMesh();
  }

  reconstructMesh(start_vertex = 0) {
      this.vert_st = start_vertex;
      this.mesh.reset();
      return this.initMesh();
  }

  initMesh() {
      this.addEdge(`${this.vert_st}-${this.vert_st + 1}`);
      return this;
  }

  calculatePoints() {
      this.points_list = [this.start,this.end];
      return this;
  }

  editDimensions(s_x = this.start.x,s_y = this.start.y,s_z = this.start.z,e_x = this.end.x,e_y = this.end.y,e_z = this.end.z) {
      this.start = new Point3D(s_x,s_y,s_z);
      this.end = new Point3D(e_x,e_y,e_z);
      this.points_list = [];
      return this;
  }
}
/* 1D Shapes */

/* 2D Shapes */
class CreatePolygon extends CreateObject {
  vertex_number: number;
  half_edges: string[];
  face: number[];
  increment: number;

  constructor (vertex_number = 3,width = 10,depth = 10,increment = 0,start_vertex = 0) {
      super(width,0,depth,start_vertex);
      this.shape = "Polygon";
      this.half_edges = [];
      this.face = [];
      this.vertex_number = Math.max(vertex_number,3);
      this.increment = increment;
      return this.initMesh();
  }

  reconstructMesh(vertex_number = 3,increment = 0,start_vertex = 0) {
      this.vert_st = start_vertex;
      this.half_edges = [];
      this.face = [];
      this.vertex_number = Math.max(vertex_number,3);
      this.increment = increment;
      this.mesh.reset();
      return this.initMesh();
  }

  initMesh() {
      for(let i = 0; i < this.vertex_number; i++) {
          const num = i + 1 + this.increment + this.vert_st;
          const modulo_operand = this.vertex_number + this.increment + this.vert_st;
          const input_res = num % modulo_operand;
          const output_res = input_res === 0 ? this.increment + this.vert_st : input_res;
          this.half_edges.push(`${i + this.increment + this.vert_st}-${output_res}`);
          this.face.push(i + this.increment + this.vert_st);
      }

      if(this.increment === 0) this.addFace(this.face.join("-"));
      return this;
  }

  calculatePoints() {
      const angle_inc = 360 / this.vertex_number;
      var inc = 0;
      if(this.increment === 1) inc = 1;
      for(let i = 0; i < this.vertex_number; i++) {
          const cur_ang = i * angle_inc;
          const conv = Math.PI / 180;
          this.points_list[i + inc] = new Point3D(Math.cos((cur_ang + 90) * conv) * (this.width / 2),this.height / 2,Math.sin((cur_ang + 90) * conv) * (this.depth / 2));
      }
      return this;
  }

  editDimensions(width = this.width,depth = this.depth,height = this.height) {
      this.modifyDimensions(width,height,depth);
      return this;
  }
}

class CreateEllipse extends CreatePolygon {
  constructor (vertex_number = 10,width = 10,depth = 10,increment = 0,start_vertex = 0) {
      const vert_number = Math.max(vertex_number,10);
      super(vert_number,width,depth,increment,start_vertex);
      this.shape = "Ellipse";
  }

  reconstructMesh(vertex_number = 10,increment = 0,start_vertex = 0) {
      return super.reconstructMesh(Math.max(vertex_number,10),increment,start_vertex);
  }

  calculatePoints() {
      if(this.increment === 1) {
          this.points_list[0] = new Point3D(0,this.height / 2,0);
          super.calculatePoints();
      }
      else super.calculatePoints();
      return this;
  }

  editDimensions(width = this.width,depth = this.depth) {
      this.modifyDimensions(width,0,depth);
      return this;
  }
}


class CreateCircle extends CreateEllipse {
  constructor (vertex_number = 10,radius = 10,increment = 0,start_vertex = 0) {
      super(vertex_number,radius,radius,increment,start_vertex);
      this.shape = "Circle";
  }

  reconstructMesh(vertex_number = 10,increment = 0,start_vertex = 0) {
      return super.reconstructMesh(vertex_number,increment,start_vertex);
  }

  editDimensions(radius = this.width) {
      this.modifyDimensions(radius,0,radius);
      return this;
  }
}

class CreateRectangle extends CreateObject {
  half_edges: string[];
  face: number[];
  increment: number;

  constructor (width = 10,depth = 10,increment = 0,start_vertex = 0) {
      super(width,0,depth,start_vertex);
      this.shape = "Rectangle";
      this.half_edges = [];
      this.face = [];
      this.increment = increment;
      return this.initMesh();
  }

  reconstructMesh(increment = 0,start_vertex = 0) {
      this.vert_st = start_vertex;
      this.half_edges = [];
      this.face = [];
      this.increment = increment;
      this.mesh.reset();
      return this.initMesh();
  }

  initMesh() {
      for(let i = 0; i < 4; i++) {
          const num = i + 1 + this.increment + this.vert_st;
          const modulo_operand = 4 + this.increment + this.vert_st;
          const input_res = num % modulo_operand;
          const output_res = input_res === 0 ? this.increment + this.vert_st : input_res;
          this.half_edges.push(`${i + this.increment + this.vert_st}-${output_res}`);
          this.face.push(i + this.increment + this.vert_st);
      }

      if(this.increment === 0) this.addFace(this.face.join("-"));
      return this;
  }

  calculatePoints() {
      var inc = 0;
      if(this.increment === 1) inc = 1;
      this.points_list[0 + inc] = new Point3D(-this.width / 2,this.height / 2,-this.depth / 2);
      this.points_list[1 + inc] = new Point3D(this.width / 2,this.height / 2,-this.depth / 2);
      this.points_list[2 + inc] = new Point3D(this.width / 2,this.height / 2,this.depth / 2);
      this.points_list[3 + inc] = new Point3D(-this.width / 2,this.height / 2,this.depth / 2);
      return this;
  }

  editDimensions(width = this.width,depth = this.depth) {
      this.modifyDimensions(width,0,depth);
      return this;
  }
}
/* 2D Shapes */

/* 3D Shapes */
class CreatePyramidalBase extends CreateObject {
  base_class: CreatePolygon | CreateRectangle;
  choice: number;
  constructor (vertex_number = 3,width = 10,height = 10,depth = 10,choice = 1,start_vertex = 0) {
      super(width,height,depth,start_vertex);
      this.initBase(choice,vertex_number,start_vertex);
      this.base_class.height = height;
  }

  reconstructMesh(vertex_number = 3,choice = 1,start_vertex = 0) {
      this.vert_st = start_vertex;
      this.refreshBase(choice,vertex_number,start_vertex);
  }

  initBase(choice: number,vertex_number: number,start_vertex: number) {
      switch(choice) {
          case 1:
              this.base_class = new CreatePolygon(vertex_number,this.width,this.depth,1,start_vertex);
              break;
          case 2:
              this.base_class = new CreateRectangle(this.width,this.depth,1,start_vertex);
      }
      this.choice = choice;
  }

  refreshBase(choice: number,vertex_number: number,start_vertex: number) {
      this.vert_st = start_vertex;
      if(this.choice === choice) {
          if(this.base_class.shape === "Rectangle") (this.base_class as CreateRectangle).reconstructMesh(this.base_class.increment,start_vertex);
          if(this.base_class.shape === "Rolygon") (this.base_class as CreatePolygon).reconstructMesh(vertex_number,this.base_class.increment,start_vertex);
      }

      else this.initBase(choice,vertex_number,start_vertex);
  }

  calculatePoints() {
      this.base_class.points_list[0] = new Point3D(0,this.height / 2,0);
      this.base_class.calculatePoints();
      this.points_list = [...this.base_class.points_list];
  }

  editDimensions(width = this.width,height = this.height,depth = this.depth) {
      this.modifyDimensions(width,height,depth);
      this.base_class.modifyDimensions(width,height,depth);
      this.points_list = [];
  }
}

class CreatePyramid extends CreatePyramidalBase {
  half_edges: string[];
  faces: number[][];
  last: number;
  penultimate: number;
  primary: number;
  constructor (base_vertex_number = 3,width = 10,height = 10,depth = 10,choice = 1,start_vertex = 0) {
      super(base_vertex_number,width,height,depth,choice,start_vertex);
      this.shape = "Pyramid";
      this.half_edges = [];
      this.faces = [];
      this.mesh = this.base_class.mesh;
      return this.initMesh(base_vertex_number);
  }

  reconstructMesh(base_vertex_number = 3,choice = 1,start_vertex = 0) {
      super.reconstructMesh(base_vertex_number,choice,start_vertex);
      this.half_edges = [];
      this.faces = [];
      this.mesh = this.base_class.mesh;
      this.mesh.reset();
      return this.initMesh(base_vertex_number);
  }

  initMesh(base_vertex_number = 0) {
      this.half_edges.push(...this.base_class.half_edges);
      this.faces.push(this.base_class.face);

      for(let i = 0; i < base_vertex_number; i++) {
          const proposed_half_edge = `${0}-${this.half_edges[i]}`;
          const permutations = _Miscellanous.getPermutationsArr(proposed_half_edge.split("-").map(value => Number(value)),3);
          this.initMeshHelper(permutations);
      }

      for(const face of this.faces) this.addFace(face.join("-"));
      return this;
  }

  initMeshHelper(permutations: number[][]) {
      optionLoop: for(const permutation of permutations) {
          const tmp_edge_list: string[] = [];
          const edges = permutation.map((value,index,array) => `${value}-${array[(index + 1) % array.length]}`);
          for(const edge of edges) {
              if(!this.half_edges.includes(edge)) tmp_edge_list.push(edge);
              else continue optionLoop;
          }
          this.half_edges.push(...tmp_edge_list);
          this.faces.push(permutation);
          break optionLoop;
      }
  }

  calculatePoints() {
      super.calculatePoints();
      return this;
  }

  editDimensions(width = this.width,height = this.height,depth = this.depth) {
      super.editDimensions(width,height,depth);
      return this;
  }
}

class CreateCone extends CreatePyramid {
  constructor (base_vertex_number = 10,radius = 10,height = 10,start_vertex = 0) {
      super(Math.max(base_vertex_number,10),radius,height,radius,1,start_vertex);
      this.shape = "Cone";
      return this;
  }

  reconstructMesh(base_vertex_number = 10,start_vertex = 0) {
      super.reconstructMesh(base_vertex_number,1,start_vertex);
      return this;
  }

  calculatePoints() {
      super.calculatePoints();
      return this;
  }

  editDimensions_RH(radius = this.width,height = this.height) {
      this.modifyDimensions(radius,height,radius);
      return this;
  }

  editDimensions_WHD(width = this.width,height = this.height,depth = this.depth) {
      this.modifyDimensions(width,height,depth);
      return this;
  }
}

class CreatePrismBases extends CreateObject {
  base_class_1: CreatePolygon | CreateRectangle;
  base_class_2: CreatePolygon | CreateRectangle;
  choice: number;
  constructor (vertex_number = 3,width = 10,height = 10,depth = 10,choice = 1,start_vertex = 0) {
      super(width,height,depth,start_vertex);
      this.initBase(choice,vertex_number,start_vertex);
      this.base_class_1.height = -height;
      this.base_class_2.height = height;
  }

  reconstructMesh(vertex_number = 3,choice = 1,start_vertex = 0) {
      this.vert_st = start_vertex;
      this.refreshBase(choice,vertex_number,start_vertex);
  }

  initBase(choice: number,vertex_number: number,start_vertex: number) {
      switch(choice) {
          case 1:
              this.base_class_1 = new CreatePolygon(vertex_number,this.width,this.depth,2,start_vertex);
              start_vertex += this.base_class_1.half_edges.length;
              this.base_class_2 = new CreatePolygon(vertex_number,this.width,this.depth,2,start_vertex);
              break;
          case 2:
              this.base_class_1 = new CreateRectangle(this.width,this.depth,2,start_vertex);
              start_vertex += this.base_class_1.half_edges.length;
              this.base_class_2 = new CreateRectangle(this.width,this.depth,2,start_vertex);
      }
      this.choice = choice;
  }

  refreshBase(choice: number,vertex_number: number,start_vertex: number) {
      if(this.choice === choice) {
          if(this.base_class_1.shape === "Rectangle") {
              (this.base_class_1 as CreateRectangle).reconstructMesh(this.base_class_1.increment,start_vertex);
              start_vertex += this.base_class_1.half_edges.length;
              (this.base_class_2 as CreateRectangle).reconstructMesh(this.base_class_2.increment,start_vertex);
          }
          if(this.base_class_1.shape === "Polygon") {
              (this.base_class_1 as CreatePolygon).reconstructMesh(vertex_number,this.base_class_1.increment,start_vertex);
              start_vertex += this.base_class_1.half_edges.length;
              (this.base_class_2 as CreatePolygon).reconstructMesh(vertex_number,this.base_class_2.increment,start_vertex);
          }
      }

      else this.initBase(choice,vertex_number,start_vertex);
  }

  calculatePoints() {
      this.base_class_1.calculatePoints();
      this.base_class_2.calculatePoints();
      this.points_list = [...this.base_class_1.points_list,...this.base_class_2.points_list];
  }

  editDimensions(width = this.width,height = this.height,depth = this.depth) {
      this.modifyDimensions(width,height,depth);
      this.base_class_1.modifyDimensions(width,-height,depth);
      this.base_class_2.modifyDimensions(width,height,depth);
      this.points_list = [];
  }
}

class CreatePrism extends CreatePrismBases {
  half_edges: string[];
  faces: number[][];
  last: number;
  penultimate: number;
  primary: number;
  constructor (vertex_number = 3,width = 10,height = 10,depth = 10,choice = 1,start_vertex = 0) {
      super(vertex_number,width,height,depth,choice,start_vertex);
      this.shape = "Prism";
      this.half_edges = [];
      this.faces = [];
      this.mesh = this.base_class_1.mesh;
      this.addFace(this.base_class_1.face.join("-"));
      this.addFace(this.base_class_2.face.reverse().join("-"));
      return this.initMesh();
  }

  reconstructMesh(vertex_number = 3,choice = 1,start_vertex = 0) {
      super.reconstructMesh(vertex_number,choice,start_vertex);
      this.half_edges = [];
      this.faces = [];
      this.mesh = this.base_class_1.mesh;
      this.addFace(this.base_class_1.face.join("-"));
      this.addFace(this.base_class_2.face.reverse().join("-"));
      this.mesh.reset();
      return this.initMesh();
  }

  initMesh() {
      for(const index in this.base_class_2.half_edges) {
          const edge = this.base_class_1.half_edges[index];
          const other_edge = this.base_class_2.half_edges[index];
          const mod_edge = other_edge.split("-").reverse().join("-");
          this.addFace(edge + "-" + mod_edge);
      }
      return this;
  }

  calculatePoints() {
      super.calculatePoints();
      return this;
  }

  editDimensions(width = this.width,height = this.height,depth = this.depth) {
      super.editDimensions(width,height,depth);
      return this;
  }
}

class CreateCylinder extends CreatePrism {
  constructor (base_vertex_number = 10,radius = 10,height = 10,start_vertex = 0) {
      super(Math.max(base_vertex_number,10),radius,height,radius,1,start_vertex);
      this.shape = "Cylinder";
      return this;
  }

  reconstructMesh(base_vertex_number = 10,start_vertex = 0) {
      this.vert_st = start_vertex;
      super.reconstructMesh(base_vertex_number,1,start_vertex);
      return this;
  }

  calculatePoints() {
      super.calculatePoints();
      return this;
  }

  editDimensions_RH(radius = this.width,height = this.height) {
      this.modifyDimensions(radius,height,radius);
      return this;
  }

  editDimensions_WHD(width = this.width,height = this.height,depth = this.depth) {
      this.modifyDimensions(width,height,depth);
      return this;
  }
}

class CreateCuboid extends CreateObject {
  default_faces: number[][];
  default_vertex_map: number[];

  constructor (width = 10,height = 10,depth = 10,start_vertex = 0) {
      super(width,height,depth,start_vertex);
      this.shape = "Cuboid";
      this.default_faces = [[0,1,2,3],[4,6,7,5],[0,3,6,4],[1,5,7,2],[3,2,7,6],[0,4,5,1]] // standard default mesh configuration
      this.default_vertex_map = [0,1,3,2,4,5,6,7];
      return this.initMesh();
  }

  reconstructMesh(start_vertex = 0) {
      this.vert_st = start_vertex;
      this.mesh.reset();
      return this.initMesh();
  }

  initMesh() {
      for(const index in this.default_faces) {
          for(const sub_index in this.default_faces[index]) {
              const value = this.default_faces[index][sub_index] + this.vert_st;
              this.default_faces[index][sub_index] = value;
          }
      }
      for(const face of this.default_faces) this.addFace(face.join("-"));
      return this;
  }

  editDimensions(width = this.width,height = this.height,depth = this.depth) {
      this.modifyDimensions(width,height,depth);
      return this;
  }

  calculatePoints() {
      var sgn_k = 1;
      var sgn_j = 1;
      var sgn_i = 1;

      for(let k = 0; k < 2; k++) {
          for(let j = 0; j < 2; j++) {
              for(let i = 0; i < 2; i++) {
                  const index = k * 4 + j * 2 + i;

                  if(k === 0) sgn_k = -1;
                  else sgn_k = 1;
                  if(j === 0) sgn_j = -1;
                  else sgn_j = 1;
                  if(i === 0) sgn_i = -1;
                  else sgn_i = 1;

                  this.points_list[this.default_vertex_map[index]] = new Point3D(sgn_i * (this.width / 2),sgn_j * (this.height / 2),sgn_k * (this.depth / 2));
              }
          }
      }
      return this;
  }
}

class CreateSphere extends CreateObject {
  lat_divs: number;
  long_divs: number;
  radius: number | undefined;

  constructor (radius = 10,latitude_divisions = 10,longitude_divisions = 10,start_vertex = 0) {
      super(radius,radius,radius,start_vertex);
      this.shape = "Sphere";
      this.radius = radius;
      return this.initMesh(latitude_divisions,longitude_divisions,start_vertex);
  }

  reconstructMesh(latitude_divisions = 10,longitude_divisions = 10,start_vertex = 0) {
      this.mesh.reset();
      return this.initMesh(latitude_divisions,longitude_divisions,start_vertex);
  }

  initMesh(latitude_divisions = 10,longitude_divisions = 10,start_vertex = 0) {
      this.lat_divs = Math.max(latitude_divisions,10);
      this.long_divs = Math.max(longitude_divisions,10);
      const north_pole = start_vertex;
      this.vert_st = ++start_vertex;
      const south_pole = ((this.lat_divs - 1) * this.long_divs) + this.vert_st;

      for(let lat = 0; lat <= this.lat_divs; lat++) {
          if(lat === 0 || lat === this.lat_divs) continue;

          for(let long = 0; long < this.long_divs; long++) {
              const inc = ((lat - 1) * this.long_divs);
              const first = inc + long;
              const second = (first + 1) % this.long_divs + inc;

              if(lat === this.lat_divs - 1) {
                  this.addFace(`${first + this.vert_st}-${second + this.vert_st}-${south_pole}`);
                  continue;
              }
              if(lat === 1) this.addFace(`${north_pole}-${first + this.vert_st}-${second + this.vert_st}`);

              const third = first + this.long_divs;
              const fourth = (third + 1) % this.long_divs + (lat * this.long_divs);
              this.addFace(`${first + this.vert_st}-${second + this.vert_st}-${fourth + this.vert_st}-${third + this.vert_st}`);
          }
      }
      return this;
  }

  calculatePoints() {
      this.points_list.push(new Point3D(0,this.height,0)); // north pole;
      for(let lat = 0; lat <= this.lat_divs; lat++) {
          const theta = lat * Math.PI / this.lat_divs;
          const sin_theta = Math.sin(theta);
          const cos_theta = Math.cos(theta);

          if(lat === 0 || lat === this.lat_divs) continue;

          for(let long = 0; long < this.long_divs; long++) {
              const phi = long * 2 * Math.PI / this.long_divs;
              const sin_phi = Math.sin(phi);
              const cos_phi = Math.cos(phi);
              const X = this.width * sin_theta * cos_phi;
              const Y = this.height * cos_theta;
              const Z = this.depth * sin_theta * -sin_phi;
              this.points_list.push(new Point3D(X,Y,Z));
          }
      }
      this.points_list.push(new Point3D(0,-this.height,0)); // south pole
      return this;
  }

  editDimensions_R(radius = this.width) {
      this.modifyDimensions(radius,radius,radius);
      this.radius = radius;
      return this;
  }

  editDimensions_WHD(width = this.width,height = this.height,depth = this.depth) {
      this.modifyDimensions(width,height,depth);
      this.radius = undefined;
      return this;
  }
}

class CreateTorus extends CreateObject {
  lat_divs: number;
  long_divs: number;
  toroidal_radius: number | undefined;
  toroidal_width: number;
  toroidal_depth: number;
  polar_width: number;
  polar_radius: number | undefined;
  polar_height: number;

  constructor (R = 7,r = 3,latitude_divisions = 10,longitude_divisions = 10,start_vertex = 0) {
      super(R + 2 * r,r,R + 2 * r,start_vertex);
      this.shape = "Torus";
      this.toroidal_radius = R;
      this.toroidal_width = R;
      this.toroidal_depth = R;
      this.polar_radius = r;
      this.polar_width = r;
      this.polar_height = r;
      return this.initMesh(latitude_divisions,longitude_divisions);
  }

  reconstructMesh(latitude_divisions = 10,longitude_divisions = 10,start_vertex = 0) {
      this.vert_st = start_vertex;
      this.mesh.reset();
      return this.initMesh(latitude_divisions,longitude_divisions);
  }

  initMesh(latitude_divisions = 10,longitude_divisions = 10) {
      this.lat_divs = Math.max(latitude_divisions,10);
      this.long_divs = Math.max(longitude_divisions,10);

      var inc = 0;
      var moderate_inc = 0;
      var first = 0;
      var second = 0;
      var third = 0;
      var fourth = 0;
      var other_first = 0;
      var other_second = 0;
      var other_third = 0;
      var other_fourth = 0;

      for(let lat = 0; lat <= this.lat_divs; lat++) {
          if(lat === this.lat_divs) continue;

          for(let long = 0; long < this.long_divs; long++) {
              if(lat === 0) {
                  first = long;
                  second = (first + 1) % this.long_divs;
                  third = first + this.long_divs;
                  fourth = (third + 1) % this.long_divs + this.long_divs;

                  other_first = first;
                  other_second = second;
                  other_third = third + this.long_divs;
                  other_fourth = fourth + this.long_divs;

                  if(long === 0) moderate_inc = third;
                  if(long === this.long_divs - 1) inc = moderate_inc;
              }

              else if(lat === this.lat_divs - 1) {
                  first = inc + long;
                  second = (first + 1) % this.long_divs + inc;
                  third = first + (2 * this.long_divs);
                  fourth = (third + 1) % this.long_divs + inc + (2 * this.long_divs);

                  other_first = first + this.long_divs;
                  other_second = second + this.long_divs;
                  other_third = third;
                  other_fourth = fourth;

                  if(long === 0) moderate_inc = third;
                  if(long === this.long_divs - 1) inc = moderate_inc;
              }

              else {
                  first = inc + long;
                  second = (first + 1) % this.long_divs + inc;
                  third = first + (2 * this.long_divs);
                  fourth = (third + 1) % this.long_divs + inc + (2 * this.long_divs);

                  other_first = first + this.long_divs;
                  other_second = second + this.long_divs;
                  other_third = third + this.long_divs;
                  other_fourth = fourth + this.long_divs;

                  if(long === 0) moderate_inc = third;
                  if(long === this.long_divs - 1) inc = moderate_inc;
              }

              this.addFace(`${first + this.vert_st}-${second + this.vert_st}-${fourth + this.vert_st}-${third + this.vert_st}`); // outer face
              this.addFace(`${other_second + this.vert_st}-${other_first + this.vert_st}-${other_third + this.vert_st}-${other_fourth + this.vert_st}`); // inner face
          }
      }
      return this;
  }

  calculatePoints() {
      for(let lat = 0; lat <= this.lat_divs; lat++) {
          const theta = lat * Math.PI / this.lat_divs;
          const sin_theta = Math.sin(theta);
          const cos_theta = Math.cos(theta);
          const other_points_list_tmp: Point3D[] = [];

          for(let long = 0; long < this.long_divs; long++) {
              const phi = long * 2 * Math.PI / this.long_divs;
              const sin_phi = Math.sin(phi);
              const cos_phi = Math.cos(phi);

              const X_1 = (this.toroidal_width * cos_phi) + ((this.polar_width + (this.polar_width * sin_theta)) * cos_phi);
              const X_2 = (this.toroidal_width * cos_phi) + ((this.polar_width - (this.polar_width * sin_theta)) * cos_phi);
              const Y = this.polar_height * cos_theta;
              const Z_1 = (this.toroidal_depth * -sin_phi) + ((this.polar_width + (this.polar_width * sin_theta)) * -sin_phi);
              const Z_2 = (this.toroidal_depth * -sin_phi) + ((this.polar_width - (this.polar_width * sin_theta)) * -sin_phi);

              this.points_list.push(new Point3D(X_1,Y,Z_1));
              if(lat === 0 || lat === this.lat_divs) continue;
              other_points_list_tmp.push(new Point3D(X_2,Y,Z_2));
          }

          this.points_list.push(...other_points_list_tmp);
      }
      return this;
  }

  editDimensions_R(toroidal_radius = this.toroidal_width,polar_radius = this.polar_width) {
      this.modifyDimensions(toroidal_radius + 2 * polar_radius,polar_radius,toroidal_radius + 2 * polar_radius);
      this.toroidal_radius = toroidal_radius;
      this.polar_radius = polar_radius;
      this.toroidal_width = toroidal_radius;
      this.toroidal_depth = toroidal_radius;
      this.polar_width = polar_radius;
      this.polar_height = polar_radius;
      return this;
  }

  editDimensions_WHD(inner_width = this.polar_width,inner_height = this.polar_height,outer_width = this.toroidal_width,outer_depth = this.toroidal_depth) {
      this.modifyDimensions(outer_width + 2 * inner_width,inner_height,outer_depth * 2 * inner_width);
      this.toroidal_radius = undefined;
      this.polar_radius = undefined;
      this.toroidal_width = outer_width;
      this.toroidal_depth = outer_depth;
      this.polar_width = inner_width;
      this.polar_height = inner_height;
      return this;
  }
}
/* 3D Shapes */

/* Grid Object */
class CreateGrid extends CreateObject{
    constructor(width:number,depth:number){
        super(width,0,depth,0);
    }
}
/* Grid Object */