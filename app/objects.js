class CreateObject extends Vector {
    object_rotation_angle;
    object_revolution_angle;
    object_translation_array;
    object_rotation_axis;
    object_revolution_axis;
    rendered_points_list;
    object_revolution_angle_backup;
    object_translation_array_backup;
    object_scaling_array;
    points_list;
    object_state;
    constructor() {
        super();
        this.object_rotation_angle = 0;
        this.object_revolution_angle = 0;
        this.object_translation_array = [0, 0, 0];
        this.object_rotation_axis = [0, 1, 0];
        this.object_revolution_axis = [0, 1, 0];
        this.rendered_points_list = [];
        this.object_revolution_angle_backup = 0;
        this.object_translation_array_backup = [0, 0, 0];
        this.object_scaling_array = [1, 1, 1];
        this.points_list = [];
        this.object_state = "local";
    }
}
class CreateMeshObject extends CreateObject {
    width;
    height;
    depth;
    mesh;
    _is_degenerate_;
    vert_st;
    shape;
    constructor(width, height, depth, start_vertex) {
        super();
        this.mesh = new MeshDataStructure();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this._is_degenerate_ = false;
        this.vert_st = start_vertex;
        this.shape = "Generic";
    }
    reconstructMesh() { return this; }
    initMesh() { return this; }
    changePoint(index, new_x, new_y, new_z) {
        if (index < this.points_list.length) {
            this.points_list[index] = new Point3D(new_x, new_y, new_z);
            return true;
        }
        return false;
    }
    addPoint(new_x, new_y, new_z, vertex_or_face_or_edge = "") {
        if (vertex_or_face_or_edge === "")
            return this.points_list.length;
        if (this._is_degenerate_)
            return this.points_list.length;
        else {
            this.mesh.addVertex(this.mesh.max_vertex_index + 1, vertex_or_face_or_edge);
            return this.points_list.push(new Point3D(new_x, new_y, new_z));
        }
    }
    removePoint(vertex_index = -1) {
        if (vertex_index >= 0) {
            const count = this.mesh.removeVertex(vertex_index);
            if (count > 0) {
                this.points_list.splice(vertex_index, 1);
                return true;
            }
        }
        return false;
    }
    addEdge(edge = "") {
        if (edge === "")
            return [];
        return this.mesh.addEdge(edge);
    }
    removeEdge(edge = "") {
        if (edge === "")
            return false;
        return this.mesh.removeEdge(edge);
    }
    addFace(face = "") {
        if (face === "")
            return false;
        return this.mesh.addFace(face);
    }
    removeFace(face = "") {
        if (face === "")
            return false;
        return this.mesh.removeFace(face);
    }
    modifyDimensions(width = this.width, height = this.height, depth = this.depth) {
        if (!this._is_degenerate_) {
            this.width = width;
            this.height = height;
            this.depth = depth;
            this.points_list = [];
        }
    }
    calculatePoints() { return this; }
    editDimensions() { return this; }
}
/* 1D Shapes */
class CreatePoint extends CreateMeshObject {
    point;
    constructor(x = 0, y = 0, z = 0, start_vertex = 0) {
        super(0, 0, 0, start_vertex);
        this.shape = "Point";
        this.point = new Point3D(x, y, z);
        this._is_degenerate_ = true;
        return this.initMesh();
    }
    reconstructMesh(start_vertex = 0) {
        this.vert_st = start_vertex;
        this.mesh.reset();
        return this.initMesh();
    }
    initMesh() {
        this.mesh.addVertex(this.vert_st, [this.vert_st]);
        return this;
    }
    calculatePoints() {
        this.points_list[0] = this.point;
        return this;
    }
    editDimensions(x = this.point.x, y = this.point.y, z = this.point.z) {
        this.point = new Point3D(x, y, z);
        this.points_list = [];
        return this;
    }
}
class CreateLine extends CreateMeshObject {
    start;
    end;
    constructor(s_x = 0, s_y = 0, s_z = 0, e_x = 0, e_y = 0, e_z = 0, start_vertex = 0) {
        super(0, 0, 0, start_vertex);
        this.shape = "Line";
        this._is_degenerate_ = true;
        this.start = new Point3D(s_x, s_y, s_z);
        this.end = new Point3D(e_x, e_y, e_z);
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
        this.points_list = [this.start, this.end];
        return this;
    }
    editDimensions(s_x = this.start.x, s_y = this.start.y, s_z = this.start.z, e_x = this.end.x, e_y = this.end.y, e_z = this.end.z) {
        this.start = new Point3D(s_x, s_y, s_z);
        this.end = new Point3D(e_x, e_y, e_z);
        this.points_list = [];
        return this;
    }
}
/* 1D Shapes */
/* 2D Shapes */
class CreatePolygon extends CreateMeshObject {
    vertex_number;
    half_edges;
    face;
    increment;
    constructor(vertex_number = 3, width = 10, depth = 10, increment = 0, start_vertex = 0) {
        super(width, 0, depth, start_vertex);
        this.shape = "Polygon";
        this.half_edges = [];
        this.face = [];
        this.vertex_number = Math.max(vertex_number, 3);
        this.increment = increment;
        return this.initMesh();
    }
    reconstructMesh(vertex_number = 3, increment = 0, start_vertex = 0) {
        this.vert_st = start_vertex;
        this.half_edges = [];
        this.face = [];
        this.vertex_number = Math.max(vertex_number, 3);
        this.increment = increment;
        this.mesh.reset();
        return this.initMesh();
    }
    initMesh() {
        for (let i = 0; i < this.vertex_number; i++) {
            const num = i + 1 + this.increment + this.vert_st;
            const modulo_operand = this.vertex_number + this.increment + this.vert_st;
            const input_res = num % modulo_operand;
            const output_res = input_res === 0 ? this.increment + this.vert_st : input_res;
            this.half_edges.push(`${i + this.increment + this.vert_st}-${output_res}`);
            this.face.push(i + this.increment + this.vert_st);
        }
        if (this.increment === 0)
            this.addFace(this.face.join("-"));
        return this;
    }
    calculatePoints() {
        const angle_inc = 360 / this.vertex_number;
        var inc = 0;
        if (this.increment === 1)
            inc = 1;
        for (let i = 0; i < this.vertex_number; i++) {
            const cur_ang = i * angle_inc;
            const conv = Math.PI / 180;
            this.points_list[i + inc] = new Point3D(Math.cos((cur_ang + 90) * conv) * (this.width / 2), this.height / 2, Math.sin((cur_ang + 90) * conv) * (this.depth / 2));
        }
        return this;
    }
    editDimensions(width = this.width, depth = this.depth, height = this.height) {
        this.modifyDimensions(width, height, depth);
        return this;
    }
}
class CreateEllipse extends CreatePolygon {
    constructor(vertex_number = 10, width = 10, depth = 10, increment = 0, start_vertex = 0) {
        const vert_number = Math.max(vertex_number, 10);
        super(vert_number, width, depth, increment, start_vertex);
        this.shape = "Ellipse";
    }
    reconstructMesh(vertex_number = 10, increment = 0, start_vertex = 0) {
        return super.reconstructMesh(Math.max(vertex_number, 10), increment, start_vertex);
    }
    calculatePoints() {
        if (this.increment === 1) {
            this.points_list[0] = new Point3D(0, this.height / 2, 0);
            super.calculatePoints();
        }
        else
            super.calculatePoints();
        return this;
    }
    editDimensions(width = this.width, depth = this.depth) {
        this.modifyDimensions(width, 0, depth);
        return this;
    }
}
class CreateCircle extends CreateEllipse {
    constructor(vertex_number = 10, radius = 10, increment = 0, start_vertex = 0) {
        super(vertex_number, radius, radius, increment, start_vertex);
        this.shape = "Circle";
    }
    reconstructMesh(vertex_number = 10, increment = 0, start_vertex = 0) {
        return super.reconstructMesh(vertex_number, increment, start_vertex);
    }
    editDimensions(radius = this.width) {
        this.modifyDimensions(radius, 0, radius);
        return this;
    }
}
class CreateRectangle extends CreateMeshObject {
    half_edges;
    face;
    increment;
    constructor(width = 10, depth = 10, increment = 0, start_vertex = 0) {
        super(width, 0, depth, start_vertex);
        this.shape = "Rectangle";
        this.half_edges = [];
        this.face = [];
        this.increment = increment;
        return this.initMesh();
    }
    reconstructMesh(increment = 0, start_vertex = 0) {
        this.vert_st = start_vertex;
        this.half_edges = [];
        this.face = [];
        this.increment = increment;
        this.mesh.reset();
        return this.initMesh();
    }
    initMesh() {
        for (let i = 0; i < 4; i++) {
            const num = i + 1 + this.increment + this.vert_st;
            const modulo_operand = 4 + this.increment + this.vert_st;
            const input_res = num % modulo_operand;
            const output_res = input_res === 0 ? this.increment + this.vert_st : input_res;
            this.half_edges.push(`${i + this.increment + this.vert_st}-${output_res}`);
            this.face.push(i + this.increment + this.vert_st);
        }
        if (this.increment === 0)
            this.addFace(this.face.join("-"));
        return this;
    }
    calculatePoints() {
        var inc = 0;
        if (this.increment === 1)
            inc = 1;
        this.points_list[0 + inc] = new Point3D(-this.width / 2, this.height / 2, -this.depth / 2);
        this.points_list[1 + inc] = new Point3D(this.width / 2, this.height / 2, -this.depth / 2);
        this.points_list[2 + inc] = new Point3D(this.width / 2, this.height / 2, this.depth / 2);
        this.points_list[3 + inc] = new Point3D(-this.width / 2, this.height / 2, this.depth / 2);
        return this;
    }
    editDimensions(width = this.width, depth = this.depth) {
        this.modifyDimensions(width, 0, depth);
        return this;
    }
}
/* 2D Shapes */
/* 3D Shapes */
class CreatePyramidalBase extends CreateMeshObject {
    base_class;
    choice;
    constructor(vertex_number = 3, width = 10, height = 10, depth = 10, choice = 1, start_vertex = 0) {
        super(width, height, depth, start_vertex);
        this.initBase(choice, vertex_number, start_vertex);
        this.base_class.height = height;
    }
    reconstructMesh(vertex_number = 3, choice = 1, start_vertex = 0) {
        this.vert_st = start_vertex;
        this.refreshBase(choice, vertex_number, start_vertex);
        return this;
    }
    initBase(choice, vertex_number, start_vertex) {
        switch (choice) {
            case 1:
                this.base_class = new CreatePolygon(vertex_number, this.width, this.depth, 1, start_vertex);
                break;
            case 2:
                this.base_class = new CreateRectangle(this.width, this.depth, 1, start_vertex);
        }
        this.choice = choice;
    }
    refreshBase(choice, vertex_number, start_vertex) {
        this.vert_st = start_vertex;
        if (this.choice === choice) {
            if (this.base_class.shape === "Rectangle")
                this.base_class.reconstructMesh(this.base_class.increment, start_vertex);
            if (this.base_class.shape === "Rolygon")
                this.base_class.reconstructMesh(vertex_number, this.base_class.increment, start_vertex);
        }
        else
            this.initBase(choice, vertex_number, start_vertex);
    }
    calculatePoints() {
        this.base_class.points_list[0] = new Point3D(0, this.height / 2, 0);
        this.base_class.calculatePoints();
        this.points_list = [...this.base_class.points_list];
        return this;
    }
    editDimensions(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        this.base_class.modifyDimensions(width, height, depth);
        this.points_list = [];
        return this;
    }
}
class CreatePyramid extends CreatePyramidalBase {
    half_edges;
    faces;
    last;
    penultimate;
    primary;
    constructor(base_vertex_number = 3, width = 10, height = 10, depth = 10, choice = 1, start_vertex = 0) {
        super(base_vertex_number, width, height, depth, choice, start_vertex);
        this.shape = "Pyramid";
        this.half_edges = [];
        this.faces = [];
        this.mesh = this.base_class.mesh;
        return this.initMesh(base_vertex_number);
    }
    reconstructMesh(base_vertex_number = 3, choice = 1, start_vertex = 0) {
        super.reconstructMesh(base_vertex_number, choice, start_vertex);
        this.half_edges = [];
        this.faces = [];
        this.mesh = this.base_class.mesh;
        this.mesh.reset();
        return this.initMesh(base_vertex_number);
    }
    initMesh(base_vertex_number = 0) {
        this.half_edges.push(...this.base_class.half_edges);
        this.faces.push(this.base_class.face);
        for (let i = 0; i < base_vertex_number; i++) {
            const proposed_half_edge = `${0}-${this.half_edges[i]}`;
            const permutations = new Miscellanous().getPermutationsArr(proposed_half_edge.split("-").map(value => Number(value)), 3);
            this.initMeshHelper(permutations);
        }
        for (const face of this.faces)
            this.addFace(face.join("-"));
        return this;
    }
    initMeshHelper(permutations) {
        optionLoop: for (const permutation of permutations) {
            const tmp_edge_list = [];
            const edges = permutation.map((value, index, array) => `${value}-${array[(index + 1) % array.length]}`);
            for (const edge of edges) {
                if (!this.half_edges.includes(edge))
                    tmp_edge_list.push(edge);
                else
                    continue optionLoop;
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
    editDimensions(width = this.width, height = this.height, depth = this.depth) {
        super.editDimensions(width, height, depth);
        return this;
    }
}
class CreateCone extends CreatePyramid {
    constructor(base_vertex_number = 10, radius = 10, height = 10, start_vertex = 0) {
        super(Math.max(base_vertex_number, 10), radius, height, radius, 1, start_vertex);
        this.shape = "Cone";
        return this;
    }
    reconstructMesh(base_vertex_number = 10, start_vertex = 0) {
        super.reconstructMesh(base_vertex_number, 1, start_vertex);
        return this;
    }
    calculatePoints() {
        super.calculatePoints();
        return this;
    }
    editDimensions_RH(radius = this.width, height = this.height) {
        this.modifyDimensions(radius, height, radius);
        return this;
    }
    editDimensions_WHD(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        return this;
    }
}
class CreatePrismBases extends CreateMeshObject {
    base_class_1;
    base_class_2;
    choice;
    constructor(vertex_number = 3, width = 10, height = 10, depth = 10, choice = 1, start_vertex = 0) {
        super(width, height, depth, start_vertex);
        this.initBase(choice, vertex_number, start_vertex);
        this.base_class_1.height = -height;
        this.base_class_2.height = height;
    }
    reconstructMesh(vertex_number = 3, choice = 1, start_vertex = 0) {
        this.vert_st = start_vertex;
        this.refreshBase(choice, vertex_number, start_vertex);
        return this;
    }
    initBase(choice, vertex_number, start_vertex) {
        switch (choice) {
            case 1:
                this.base_class_1 = new CreatePolygon(vertex_number, this.width, this.depth, 2, start_vertex);
                start_vertex += this.base_class_1.half_edges.length;
                this.base_class_2 = new CreatePolygon(vertex_number, this.width, this.depth, 2, start_vertex);
                break;
            case 2:
                this.base_class_1 = new CreateRectangle(this.width, this.depth, 2, start_vertex);
                start_vertex += this.base_class_1.half_edges.length;
                this.base_class_2 = new CreateRectangle(this.width, this.depth, 2, start_vertex);
        }
        this.choice = choice;
    }
    refreshBase(choice, vertex_number, start_vertex) {
        if (this.choice === choice) {
            if (this.base_class_1.shape === "Rectangle") {
                this.base_class_1.reconstructMesh(this.base_class_1.increment, start_vertex);
                start_vertex += this.base_class_1.half_edges.length;
                this.base_class_2.reconstructMesh(this.base_class_2.increment, start_vertex);
            }
            if (this.base_class_1.shape === "Polygon") {
                this.base_class_1.reconstructMesh(vertex_number, this.base_class_1.increment, start_vertex);
                start_vertex += this.base_class_1.half_edges.length;
                this.base_class_2.reconstructMesh(vertex_number, this.base_class_2.increment, start_vertex);
            }
        }
        else
            this.initBase(choice, vertex_number, start_vertex);
    }
    calculatePoints() {
        this.base_class_1.calculatePoints();
        this.base_class_2.calculatePoints();
        this.points_list = [...this.base_class_1.points_list, ...this.base_class_2.points_list];
        return this;
    }
    editDimensions(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        this.base_class_1.modifyDimensions(width, -height, depth);
        this.base_class_2.modifyDimensions(width, height, depth);
        this.points_list = [];
        return this;
    }
}
class CreatePrism extends CreatePrismBases {
    half_edges;
    faces;
    last;
    penultimate;
    primary;
    constructor(vertex_number = 3, width = 10, height = 10, depth = 10, choice = 1, start_vertex = 0) {
        super(vertex_number, width, height, depth, choice, start_vertex);
        this.shape = "Prism";
        this.half_edges = [];
        this.faces = [];
        this.mesh = this.base_class_1.mesh;
        this.addFace(this.base_class_1.face.join("-"));
        this.addFace(this.base_class_2.face.reverse().join("-"));
        return this.initMesh();
    }
    reconstructMesh(vertex_number = 3, choice = 1, start_vertex = 0) {
        super.reconstructMesh(vertex_number, choice, start_vertex);
        this.half_edges = [];
        this.faces = [];
        this.mesh = this.base_class_1.mesh;
        this.addFace(this.base_class_1.face.join("-"));
        this.addFace(this.base_class_2.face.reverse().join("-"));
        this.mesh.reset();
        return this.initMesh();
    }
    initMesh() {
        for (const index in this.base_class_2.half_edges) {
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
    editDimensions(width = this.width, height = this.height, depth = this.depth) {
        super.editDimensions(width, height, depth);
        return this;
    }
}
class CreateCylinder extends CreatePrism {
    constructor(base_vertex_number = 10, radius = 10, height = 10, start_vertex = 0) {
        super(Math.max(base_vertex_number, 10), radius, height, radius, 1, start_vertex);
        this.shape = "Cylinder";
        return this;
    }
    reconstructMesh(base_vertex_number = 10, start_vertex = 0) {
        this.vert_st = start_vertex;
        super.reconstructMesh(base_vertex_number, 1, start_vertex);
        return this;
    }
    calculatePoints() {
        super.calculatePoints();
        return this;
    }
    editDimensions_RH(radius = this.width, height = this.height) {
        this.modifyDimensions(radius, height, radius);
        return this;
    }
    editDimensions_WHD(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        return this;
    }
}
class CreateCuboid extends CreateMeshObject {
    default_faces;
    default_vertex_map;
    constructor(width = 10, height = 10, depth = 10, start_vertex = 0) {
        super(width, height, depth, start_vertex);
        this.shape = "Cuboid";
        this.default_faces = [[0, 1, 2, 3], [4, 6, 7, 5], [0, 3, 6, 4], [1, 5, 7, 2], [3, 2, 7, 6], [0, 4, 5, 1]]; // standard default mesh configuration
        this.default_vertex_map = [0, 1, 3, 2, 4, 5, 6, 7];
        return this.initMesh();
    }
    reconstructMesh(start_vertex = 0) {
        this.vert_st = start_vertex;
        this.mesh.reset();
        return this.initMesh();
    }
    initMesh() {
        for (const index in this.default_faces) {
            for (const sub_index in this.default_faces[index]) {
                const value = this.default_faces[index][sub_index] + this.vert_st;
                this.default_faces[index][sub_index] = value;
            }
        }
        for (const face of this.default_faces)
            this.addFace(face.join("-"));
        return this;
    }
    editDimensions(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        return this;
    }
    calculatePoints() {
        var sgn_k = 1;
        var sgn_j = 1;
        var sgn_i = 1;
        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 2; i++) {
                    const index = k * 4 + j * 2 + i;
                    if (k === 0)
                        sgn_k = -1;
                    else
                        sgn_k = 1;
                    if (j === 0)
                        sgn_j = -1;
                    else
                        sgn_j = 1;
                    if (i === 0)
                        sgn_i = -1;
                    else
                        sgn_i = 1;
                    this.points_list[this.default_vertex_map[index]] = new Point3D(sgn_i * (this.width / 2), sgn_j * (this.height / 2), sgn_k * (this.depth / 2));
                }
            }
        }
        return this;
    }
}
class CreateSphere extends CreateMeshObject {
    lat_divs;
    long_divs;
    radius;
    constructor(radius = 10, latitude_divisions = 10, longitude_divisions = 10, start_vertex = 0) {
        super(radius, radius, radius, start_vertex);
        this.shape = "Sphere";
        this.radius = radius;
        return this.initMesh(latitude_divisions, longitude_divisions, start_vertex);
    }
    reconstructMesh(latitude_divisions = 10, longitude_divisions = 10, start_vertex = 0) {
        this.mesh.reset();
        return this.initMesh(latitude_divisions, longitude_divisions, start_vertex);
    }
    initMesh(latitude_divisions = 10, longitude_divisions = 10, start_vertex = 0) {
        this.lat_divs = Math.max(latitude_divisions, 10);
        this.long_divs = Math.max(longitude_divisions, 10);
        const north_pole = start_vertex;
        this.vert_st = ++start_vertex;
        const south_pole = ((this.lat_divs - 1) * this.long_divs) + this.vert_st;
        for (let lat = 0; lat <= this.lat_divs; lat++) {
            if (lat === 0 || lat === this.lat_divs)
                continue;
            for (let long = 0; long < this.long_divs; long++) {
                const inc = ((lat - 1) * this.long_divs);
                const first = inc + long;
                const second = (first + 1) % this.long_divs + inc;
                if (lat === this.lat_divs - 1) {
                    this.addFace(`${first + this.vert_st}-${second + this.vert_st}-${south_pole}`);
                    continue;
                }
                if (lat === 1)
                    this.addFace(`${north_pole}-${first + this.vert_st}-${second + this.vert_st}`);
                const third = first + this.long_divs;
                const fourth = (third + 1) % this.long_divs + (lat * this.long_divs);
                this.addFace(`${first + this.vert_st}-${second + this.vert_st}-${fourth + this.vert_st}-${third + this.vert_st}`);
            }
        }
        return this;
    }
    calculatePoints() {
        this.points_list.push(new Point3D(0, this.height, 0)); // north pole;
        for (let lat = 0; lat <= this.lat_divs; lat++) {
            const theta = lat * Math.PI / this.lat_divs;
            const sin_theta = Math.sin(theta);
            const cos_theta = Math.cos(theta);
            if (lat === 0 || lat === this.lat_divs)
                continue;
            for (let long = 0; long < this.long_divs; long++) {
                const phi = long * 2 * Math.PI / this.long_divs;
                const sin_phi = Math.sin(phi);
                const cos_phi = Math.cos(phi);
                const X = this.width * sin_theta * cos_phi;
                const Y = this.height * cos_theta;
                const Z = this.depth * sin_theta * -sin_phi;
                this.points_list.push(new Point3D(X, Y, Z));
            }
        }
        this.points_list.push(new Point3D(0, -this.height, 0)); // south pole
        return this;
    }
    editDimensions_R(radius = this.width) {
        this.modifyDimensions(radius, radius, radius);
        this.radius = radius;
        return this;
    }
    editDimensions_WHD(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        this.radius = undefined;
        return this;
    }
}
class CreateTorus extends CreateMeshObject {
    lat_divs;
    long_divs;
    toroidal_radius;
    toroidal_width;
    toroidal_depth;
    polar_width;
    polar_radius;
    polar_height;
    constructor(R = 7, r = 3, latitude_divisions = 10, longitude_divisions = 10, start_vertex = 0) {
        super(R + 2 * r, r, R + 2 * r, start_vertex);
        this.shape = "Torus";
        this.toroidal_radius = R;
        this.toroidal_width = R;
        this.toroidal_depth = R;
        this.polar_radius = r;
        this.polar_width = r;
        this.polar_height = r;
        return this.initMesh(latitude_divisions, longitude_divisions);
    }
    reconstructMesh(latitude_divisions = 10, longitude_divisions = 10, start_vertex = 0) {
        this.vert_st = start_vertex;
        this.mesh.reset();
        return this.initMesh(latitude_divisions, longitude_divisions);
    }
    initMesh(latitude_divisions = 10, longitude_divisions = 10) {
        this.lat_divs = Math.max(latitude_divisions, 10);
        this.long_divs = Math.max(longitude_divisions, 10);
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
        for (let lat = 0; lat <= this.lat_divs; lat++) {
            if (lat === this.lat_divs)
                continue;
            for (let long = 0; long < this.long_divs; long++) {
                if (lat === 0) {
                    first = long;
                    second = (first + 1) % this.long_divs;
                    third = first + this.long_divs;
                    fourth = (third + 1) % this.long_divs + this.long_divs;
                    other_first = first;
                    other_second = second;
                    other_third = third + this.long_divs;
                    other_fourth = fourth + this.long_divs;
                    if (long === 0)
                        moderate_inc = third;
                    if (long === this.long_divs - 1)
                        inc = moderate_inc;
                }
                else if (lat === this.lat_divs - 1) {
                    first = inc + long;
                    second = (first + 1) % this.long_divs + inc;
                    third = first + (2 * this.long_divs);
                    fourth = (third + 1) % this.long_divs + inc + (2 * this.long_divs);
                    other_first = first + this.long_divs;
                    other_second = second + this.long_divs;
                    other_third = third;
                    other_fourth = fourth;
                    if (long === 0)
                        moderate_inc = third;
                    if (long === this.long_divs - 1)
                        inc = moderate_inc;
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
                    if (long === 0)
                        moderate_inc = third;
                    if (long === this.long_divs - 1)
                        inc = moderate_inc;
                }
                this.addFace(`${first + this.vert_st}-${second + this.vert_st}-${fourth + this.vert_st}-${third + this.vert_st}`); // outer face
                this.addFace(`${other_second + this.vert_st}-${other_first + this.vert_st}-${other_third + this.vert_st}-${other_fourth + this.vert_st}`); // inner face
            }
        }
        return this;
    }
    calculatePoints() {
        for (let lat = 0; lat <= this.lat_divs; lat++) {
            const theta = lat * Math.PI / this.lat_divs;
            const sin_theta = Math.sin(theta);
            const cos_theta = Math.cos(theta);
            const other_points_list_tmp = [];
            for (let long = 0; long < this.long_divs; long++) {
                const phi = long * 2 * Math.PI / this.long_divs;
                const sin_phi = Math.sin(phi);
                const cos_phi = Math.cos(phi);
                const X_1 = (this.toroidal_width * cos_phi) + ((this.polar_width + (this.polar_width * sin_theta)) * cos_phi);
                const X_2 = (this.toroidal_width * cos_phi) + ((this.polar_width - (this.polar_width * sin_theta)) * cos_phi);
                const Y = this.polar_height * cos_theta;
                const Z_1 = (this.toroidal_depth * -sin_phi) + ((this.polar_width + (this.polar_width * sin_theta)) * -sin_phi);
                const Z_2 = (this.toroidal_depth * -sin_phi) + ((this.polar_width - (this.polar_width * sin_theta)) * -sin_phi);
                this.points_list.push(new Point3D(X_1, Y, Z_1));
                if (lat === 0 || lat === this.lat_divs)
                    continue;
                other_points_list_tmp.push(new Point3D(X_2, Y, Z_2));
            }
            this.points_list.push(...other_points_list_tmp);
        }
        return this;
    }
    editDimensions_R(toroidal_radius = this.toroidal_width, polar_radius = this.polar_width) {
        this.modifyDimensions(toroidal_radius + 2 * polar_radius, polar_radius, toroidal_radius + 2 * polar_radius);
        this.toroidal_radius = toroidal_radius;
        this.polar_radius = polar_radius;
        this.toroidal_width = toroidal_radius;
        this.toroidal_depth = toroidal_radius;
        this.polar_width = polar_radius;
        this.polar_height = polar_radius;
        return this;
    }
    editDimensions_WHD(inner_width = this.polar_width, inner_height = this.polar_height, outer_width = this.toroidal_width, outer_depth = this.toroidal_depth) {
        this.modifyDimensions(outer_width + 2 * inner_width, inner_height, outer_depth * 2 * inner_width);
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
class CreateGrid extends CreateMeshObject {
    constructor(width, depth) {
        super(width, 0, depth, 0);
    }
}
/* Grid Object */
class ObjectRendering extends Miscellanous {
    instance;
    objects;
    instance_number_to_list_map;
    selected_object_instances;
    current_object_instance;
    constructor() {
        super();
        this.instance = 0;
        this.objects = [];
        this.instance_number_to_list_map = {};
        this.selected_object_instances = new Set();
        this.current_object_instance = 0;
    }
    changeCurrentObjectInstance(value) { this.current_object_instance = value; }
    getCurrentObjectInstance() {
        return this.objects[this.instance_number_to_list_map[this.current_object_instance]];
    }
    deleteObjectHelper(instance_number_input, index) {
        this.objects.splice(index, 1);
        delete this.instance_number_to_list_map[instance_number_input];
        for (const key in this.instance_number_to_list_map) {
            if (Number(key) > instance_number_input) {
                this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
            }
        }
        if (instance_number_input in this.selected_object_instances)
            this.selected_object_instances.delete(instance_number_input);
    }
    addObjects(object) {
        object.calculatePoints();
        this.objects.push(object);
        this.instance_number_to_list_map[this.instance] = this.instance;
        this.instance++;
    }
    removeObject(object_instance) {
        const index = this.instance_number_to_list_map[object_instance];
        this.deleteObjectHelper(object_instance, index);
    }
    delete_all_objects() {
        this.objects = [];
        this.instance_number_to_list_map = {};
    }
    select_object(selected_instance) {
        const selection = this.instance_number_to_list_map[selected_instance];
        this.selected_object_instances.add(selection);
    }
    select_multiple_objects(selected_instances) { for (const instance of selected_instances)
        this.select_object(instance); }
    select_all_objects() { for (const index in this.objects) {
        this.select_object(Number(index));
    } ; }
    deselect_object(selected_instance) {
        const selection = this.instance_number_to_list_map[selected_instance];
        this.selected_object_instances.delete(selected_instance);
    }
    deselect_multiple_objects(selected_instances) { for (const instance of selected_instances)
        this.deselect_object(instance); }
    deselect_all_objects() { this.selected_object_instances.clear(); }
    vertexRotate(object, point, axis, angle) {
        return object.q_rot(angle, axis, point);
    }
    ;
    vertexScale(point, scaling_array) {
        return [point[0] * scaling_array[0], point[1] * scaling_array[1], point[2] * scaling_array[2]];
    }
    ;
    vertexTranslate(object, point, translation_array) {
        return object.matAdd(point, translation_array);
    }
    ;
    rotateObject(axis, angle, incremental = false) {
        const object = this.getCurrentObjectInstance();
        if (typeof object === "undefined")
            return;
        if (incremental === true)
            angle = object.object_rotation_angle + angle;
        object.rendered_points_list = [];
        for (const index in object.points_list) {
            const orig_pt = object.points_list[index];
            const original_vector = [orig_pt.x, orig_pt.y, orig_pt.z];
            const rotated_vector = this.vertexRotate(object, original_vector, axis, angle);
            const translated_vector = this.vertexTranslate(object, rotated_vector, object.object_translation_array);
            const revolved_vector = this.vertexRotate(object, translated_vector, object.object_revolution_axis, object.object_revolution_angle);
            const final_vector = this.vertexScale(revolved_vector, object.object_scaling_array);
            object.rendered_points_list.push(final_vector);
        }
        object.object_rotation_angle = angle;
        object.object_rotation_axis = axis;
    }
    revolveObject(axis, angle, incremental = false) {
        const object = this.getCurrentObjectInstance();
        if (typeof object === "undefined")
            return;
        if (object.object_state === "local")
            return;
        if (incremental === true)
            angle = object.object_revolution_angle + angle;
        object.rendered_points_list = [];
        for (const index in object.points_list) {
            const orig_pt = object.points_list[index];
            const original_vector = [orig_pt.x, orig_pt.y, orig_pt.z];
            const rotated_vector = this.vertexRotate(object, original_vector, object.object_rotation_axis, object.object_rotation_angle);
            const translated_vector = this.vertexTranslate(object, rotated_vector, object.object_translation_array);
            const revolved_vector = this.vertexRotate(object, translated_vector, axis, angle);
            const final_vector = this.vertexScale(revolved_vector, object.object_scaling_array);
            object.rendered_points_list.push(final_vector);
        }
        object.object_revolution_angle = angle;
        object.object_revolution_angle_backup = angle;
        object.object_revolution_axis = axis;
    }
    translateObject(translation_array, incremental = false) {
        const object = this.getCurrentObjectInstance();
        if (typeof object === "undefined")
            return;
        if (object.object_state === "local")
            return;
        if (incremental === true)
            translation_array = object.matAdd(object.object_translation_array, translation_array);
        object.rendered_points_list = [];
        for (const index in object.points_list) {
            const orig_pt = object.points_list[index];
            const original_vector = [orig_pt.x, orig_pt.y, orig_pt.z];
            const rotated_vector = this.vertexRotate(object, original_vector, object.object_rotation_axis, object.object_rotation_angle);
            const translated_vector = this.vertexTranslate(object, rotated_vector, translation_array);
            const revolved_vector = this.vertexRotate(object, translated_vector, object.object_revolution_axis, object.object_revolution_angle);
            const final_vector = this.vertexScale(revolved_vector, object.object_scaling_array);
            object.rendered_points_list.push(final_vector);
        }
        object.object_translation_array = translation_array;
        object.object_translation_array_backup = translation_array;
    }
    scaleObject(scaling_array, incremental = false) {
        const object = this.getCurrentObjectInstance();
        if (typeof object === "undefined")
            return;
        if (incremental === true)
            scaling_array = object.matAdd(object.object_scaling_array, scaling_array);
        object.rendered_points_list = [];
        for (const index in object.points_list) {
            const orig_pt = object.points_list[index];
            const original_vector = [orig_pt.x, orig_pt.y, orig_pt.z];
            const rotated_vector = this.vertexRotate(object, original_vector, object.object_rotation_axis, object.object_rotation_angle);
            const translated_vector = this.vertexTranslate(object, rotated_vector, object.object_translation_array);
            const revolved_vector = this.vertexRotate(object, translated_vector, object.object_revolution_axis, object.object_revolution_angle);
            const final_vector = this.vertexScale(revolved_vector, object.object_scaling_array);
            object.rendered_points_list.push(final_vector);
        }
        object.object_scaling_array = scaling_array;
    }
    rotateObject_incremental(axis, angle) {
    }
    renderLocal() {
        const object = this.getCurrentObjectInstance();
        if (typeof object === "undefined")
            return;
        object.object_state = "local";
        object.object_revolution_angle_backup = object.object_revolution_angle;
        object.object_revolution_angle = 0;
        object.object_translation_array_backup = object.object_translation_array;
        object.object_translation_array = [0, 0, 0];
        this.rotateObject(object.object_rotation_axis, object.object_rotation_angle);
    }
    renderWorld() {
        const object = this.getCurrentObjectInstance();
        if (typeof object === "undefined")
            return;
        object.object_state = "world";
        object.object_revolution_angle = object.object_revolution_angle_backup;
        object.object_translation_array = object.object_translation_array_backup;
        this.revolveObject(object.object_revolution_axis, object.object_revolution_angle);
    }
    configureObjectSpace(space) {
        if (space === "local")
            this.renderLocal();
        if (space === "world")
            this.renderWorld();
    }
    renderObject() {
        const object = this.getCurrentObjectInstance();
        if (typeof object === "undefined")
            return undefined;
        const renderedObjectVertices = {};
        for (const index in object.rendered_points_list) {
            const vertex = object.rendered_points_list[index];
            const rendered_vertex = _OPTICAL_ELEMS.render(vertex, "camera");
            renderedObjectVertices[index] = rendered_vertex;
        }
        return { object: object, vertices: renderedObjectVertices };
    }
}
