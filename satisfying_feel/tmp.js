(function () {
    class Point2D {
        x;
        y;
        r;
        constructor(x, y, r = 0) {
            this.x = x;
            this.y = y;
            this.r = r;
        }
    }
    class Point3D {
        x;
        y;
        z;
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    class MeshDataStructure {
        HalfEdgeDict;
        face_tmp;
        faces;
        prev;
        next;
        temp;
        face_vertices_tmp;
        edge_no;
        vertex_no;
        constructor(vertex_num) {
            this.HalfEdgeDict = {};
            this.face_tmp = [];
            this.faces = [];
            this.prev = null;
            this.next = null;
            this.temp = null;
            this.face_vertices_tmp = "-";
            this.edge_no = 0;
            this.vertex_no = vertex_num;
        }
        halfEdge(start, end) {
            return {
                vertices: [start, end],
                face_vertices: "-",
                twin: "-",
                prev: "-",
                next: "-",
            };
        }
        setHalfEdge(a, b) {
            let halfEdgeKey = `${a}-${b}`;
            let twinHalfEdgeKey = `${b}-${a}`;
            // If halfedge does exist in halfedge dict switch halfedge key to twin halfedge key and vice-versa
            if (this.HalfEdgeDict[halfEdgeKey]) {
                const halfEdgeKeyTemp = twinHalfEdgeKey;
                twinHalfEdgeKey = halfEdgeKey;
                halfEdgeKey = halfEdgeKeyTemp;
            }
            // If halfedge does not exist in halfedge dict, create halfedge and increment the edge number
            if (!this.HalfEdgeDict[halfEdgeKey]) {
                this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(a, b);
                this.edge_no++;
                this.HalfEdgeDict[halfEdgeKey].face_vertices = this.face_vertices_tmp;
            }
            // if twin halfedge also does exist in halfedge dict, decrement the edge number
            if (this.HalfEdgeDict[halfEdgeKey]) {
                this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
                this.HalfEdgeDict[halfEdgeKey].twin = halfEdgeKey;
                this.edge_no--;
            }
            return halfEdgeKey;
        }
        addFace(face) {
            // sort the face vertices in ascending order
            this.face_vertices_tmp = [...face].sort((a, b) => a - b).join("-");
            // If face is not found in faces add face to faces and set its halfedges
            if (!this.faces.includes(this.face_vertices_tmp)) {
                this.faces.push(this.face_vertices_tmp);
                for (const i in face) {
                    const halfEdgeKey = this.setHalfEdge(face[i], face[(Number(i) + 1) % face.length]);
                    const [a, b] = halfEdgeKey.split("-");
                    if (this.temp === null) {
                        this.prev = "null-" + a;
                    }
                    else {
                        this.prev = this.temp + "-" + a;
                    }
                    if (this.HalfEdgeDict[halfEdgeKey] !== undefined) {
                        this.HalfEdgeDict[halfEdgeKey].next = halfEdgeKey;
                    }
                    this.next = b + "-null";
                    this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
                    this.HalfEdgeDict[halfEdgeKey].next = this.next;
                    this.temp = a + "-" + b;
                }
                // reset temp, prev and next
                this.temp = null;
                this.prev = null;
                this.next = null;
            }
        }
        removeFace(face) {
            let found_edges = 0;
            // sort the face vertices in ascending order
            this.face_vertices_tmp = [...face].sort((a, b) => a - b).join("-");
            // Check if face is found in faces, if yes remove it
            if (this.faces.includes(this.face_vertices_tmp)) {
                // iterate through the edges until an edge's face marching the face is found
                for (const edge in this.HalfEdgeDict) {
                    // If the edge's face marches the face then crawl with next until the found edges tally with the face's length
                    if (this.HalfEdgeDict[edge].face_vertices === this.face_vertices_tmp) {
                        found_edges++;
                        let cur_halfEdge = this.HalfEdgeDict[edge].next; // update the halfedge
                        let twinHalfEdgeKey = this.HalfEdgeDict[edge].twin;
                        if (!this.HalfEdgeDict[edge])
                            this.edge_no--; // If the twin does not exist decrease edge number
                        delete this.HalfEdgeDict[edge]; // delete the previous halfedge
                        while (found_edges < face.length) {
                            cur_halfEdge = this.HalfEdgeDict[edge].next; // update the halfedge
                            twinHalfEdgeKey = this.HalfEdgeDict[edge].twin;
                            if (!this.HalfEdgeDict[edge])
                                this.edge_no--; // If the twin does not exist decrease edge number   
                            delete this.HalfEdgeDict[edge]; // delete the previous halfedge
                            found_edges++;
                        }
                    }
                }
            }
        }
        getEdgesofFace(face) {
            return face.map((value, index) => { return `${value}-${face[(index + 1) % face.length]}`; });
        }
        splitFace() { }
        mergeface() { }
        addEdge() { }
        removeEdge() { }
        splitEdge() { }
        getFacesofEdge(edge) {
            return [this.HalfEdgeDict[edge].face_vertices, this.HalfEdgeDict[this.HalfEdgeDict[edge].twin].face_vertices];
        }
        addVertex() { }
        removeVertex() { }
        triangulate() { }
    }
    class CatmullClark {
        points_list;
        connectivity_matrix;
        edges;
        faces;
        face_vertex_num;
        face_points;
        edge_points;
        new_edges;
        new_faces;
        getEdgeVertices(edge) {
            return edge.split("-").map((value) => { return this.points_list[Number(value)]; });
        }
        getFaceVertices(face) {
            return face.split("-").map((value) => { return this.points_list[Number(value)]; });
        }
        sumPoints(points) {
            var res = new Point3D(0, 0, 0);
            for (const point of points) {
                res.x += point.x;
                res.y += point.y;
                res.z += point.z;
            }
            return res;
        }
        isTouchingVertex(elem, vertex) {
            const arr = elem.split("-").map((value) => { return Number(value); });
            for (const val of arr) {
                if (val === vertex)
                    return true;
            }
            return false;
        }
        constructor(points_list, connectivity_matrix, face_vertex_num) {
            this.points_list = points_list;
            this.connectivity_matrix = connectivity_matrix;
            this.face_vertex_num = face_vertex_num;
            this.face_points = [];
            this.edge_points = [];
            this.new_faces = [];
            this.new_edges = [];
        }
        getEdgesFromFace(face) {
            const arr = face.split("-");
            const arr_len = arr.length;
            const ret_list = [];
            for (let i = 0; i < arr_len; i++) {
                if (i === arr_len - 1) {
                    ret_list.push(arr[i] + "-" + arr[0]);
                    return ret_list;
                }
                ret_list.push(arr[i] + "-" + arr[i + 1]);
            }
            return ret_list;
        }
        getEdgeNeighbouringFacePoints(edge) {
            const ret_list = [];
            const [a, b] = edge.split("-");
            var index = 0;
            for (const face of this.connectivity_matrix.faces) {
                let num = 0;
                const face_vertices = face.split("-");
                for (const vertex of face_vertices) {
                    if (vertex === a || vertex === b)
                        num++;
                }
                if (num === 2)
                    ret_list.push(this.face_points[index]);
                index++;
            }
            return ret_list;
        }
        iterate(iteration_num = 1) {
            if (iteration_num <= 0)
                return;
            iteration_num--;
            for (const face of this.connectivity_matrix.faces) {
                const face_vertices = this.getFaceVertices(face);
                const sum = this.sumPoints(face_vertices);
                const face_point = new Point3D(sum.x / this.face_vertex_num, sum.y / this.face_vertex_num, sum.z / this.face_vertex_num);
                this.face_points.push(face_point);
            }
            for (const edge of this.connectivity_matrix.edges) {
                const edge_vertices_full = [];
                const [f_p_a, f_p_b] = this.getEdgeNeighbouringFacePoints(edge);
                const edge_vertices = this.getEdgeVertices(edge);
                edge_vertices_full.push(...edge_vertices, f_p_a, f_p_b);
                const sum = this.sumPoints(edge_vertices_full);
                const edge_point = new Point3D(sum.x / 4, sum.y / 4, sum.z / 4);
                this.edge_points.push(edge_point);
            }
            for (const point_index in this.points_list) {
                const P = this.points_list[point_index];
                const F_list = [];
                const R_list = [];
                var n_f = 0;
                var n_e = 0;
                for (const face of this.connectivity_matrix.faces) {
                    if (this.isTouchingVertex(face, Number(point_index))) {
                        F_list.push(this.face_points[n_f]);
                        n_f++;
                    }
                }
                for (const edge of this.connectivity_matrix.edges) {
                    if (this.isTouchingVertex(edge, Number(point_index))) {
                        const edge_vertices = this.getEdgeVertices(edge);
                        const sum = this.sumPoints(edge_vertices);
                        const edge_midpoint = new Point3D(sum.x / 2, sum.y / 2, sum.z / 2);
                        R_list.push(edge_midpoint);
                        n_e++;
                    }
                }
                // console.log(n_f + "________________\n" + n_e + "___________________")
                const n = (n_f + n_e) / 2;
                const f_sum = this.sumPoints(F_list);
                const r_sum = this.sumPoints(R_list);
                const F = new Point3D(f_sum.x / n, f_sum.y / n, f_sum.z / n);
                const R = new Point3D(r_sum.x / n, r_sum.y / n, r_sum.z / n);
                const X = (F.x + 2 * R.x + (n - 3) * P.x) / n;
                const Y = (F.y + 2 * R.y + (n - 3) * P.y) / n;
                const Z = (F.z + 2 * R.z + (n - 3) * P.z) / n;
                this.points_list[point_index] = new Point3D(X, Y, Z);
            }
            const p_len = this.points_list.length;
            const f_len = this.face_points.length;
            this.points_list.push(...this.face_points, ...this.edge_points);
            for (const face_point_index in this.face_points) {
                const face_vertex = Number(face_point_index) + p_len;
                const boundary = [];
                const edges = this.getEdgesFromFace(this.connectivity_matrix.faces[face_point_index]);
                for (let edge of edges) {
                    var c_edge_index = 0;
                    for (const c_edge of this.connectivity_matrix.edges) {
                        const [a, b] = c_edge.split("-");
                        const counter_c_edge = `${b}-${a}`;
                        if (edge === c_edge || edge === counter_c_edge) {
                            const b = c_edge_index + p_len + f_len;
                            const [a, c] = edge.split("-");
                            boundary.push(a + `-${b}`, `${b}-` + c);
                        }
                        else
                            c_edge_index++;
                    }
                }
                const iter_num = boundary.length / 2;
                for (let i = 0; i < iter_num; i++) {
                    const sub_boundary = [];
                    let num = 0;
                    while (num < 2) {
                        sub_boundary.push(boundary[(i * 2 + num + 1) % boundary.length]);
                        num++;
                    }
                    const [a, c] = sub_boundary[0].split("-");
                    const b = sub_boundary[sub_boundary.length - 1].split("-")[1];
                    const a_list = `${face_vertex}-${a}`;
                    const b_list = `${b}-${face_vertex}`;
                    this.new_edges.push(a_list, ...sub_boundary, b_list);
                    for (let j = 0; j < iter_num; j++)
                        this.new_faces.push(`${face_vertex}-${a}-${c}-${b}`);
                }
            }
            this.new_faces = [...new Set(this.new_faces)];
            this.new_edges = [...new Set(this.new_edges)];
            this.connectivity_matrix.edges = this.new_edges;
            this.connectivity_matrix.faces = this.new_faces;
            this.face_points = [];
            this.edge_points = [];
            this.new_edges = [];
            this.new_faces = [];
            this.iterate(iteration_num);
        }
        getMinMax(list) {
            return [Math.min(...list), Math.max(...list)];
        }
        triangulate() {
            const triangulated_points_list = [];
            const triangulated_connectivity_matrix = { faces: [], edges: [] };
            triangulated_points_list.push(...this.points_list);
            for (const face of this.connectivity_matrix.faces) {
                const face_edges = this.getEdgesFromFace(face);
                const vertex_indexes = face.split("-").map((value) => { return Number(value); });
                const vertices = vertex_indexes.map((value) => { return this.points_list[value]; });
                const x_list = vertices.map((value) => { return value.x; });
                const y_list = vertices.map((value) => { return value.y; });
                const z_list = vertices.map((value) => { return value.z; });
                const [x_min, x_max] = this.getMinMax(x_list);
                const [y_min, y_max] = this.getMinMax(y_list);
                const [z_min, z_max] = this.getMinMax(z_list);
                const avg_point = new Point3D((x_min + x_max) / 2, (y_min + y_max) / 2, (z_min + z_max) / 2);
                const avg_point_index = triangulated_points_list.push(avg_point);
                for (const edge of face_edges) {
                    const [a, b] = edge.split("-");
                    triangulated_connectivity_matrix.edges.push(`${avg_point_index}-${a}`, `${edge}`, `${b}-${avg_point_index}`);
                    triangulated_connectivity_matrix.faces.push(`${a}-${avg_point_index}-${b}`);
                }
            }
            return { "points": triangulated_points_list, connectivity: triangulated_connectivity_matrix };
        }
        display() {
            return { "points": this.points_list, connectivity: this.connectivity_matrix };
        }
    }
    function toPoints2D(pointList) {
        const retList = [];
        for (let point in pointList) {
            retList[point] = new Point2D(pointList[point][0], pointList[point][1]);
        }
        return retList;
    }
    function toPoints3D(pointList) {
        const retList = [];
        for (let point in pointList) {
            retList[point] = new Point3D(pointList[point][0], pointList[point][1], pointList[point][2]);
        }
        return retList;
    }
    const cube_points = [
        [0, 0, 0],
        [100, 0, 0],
        [0, 100, 0],
        [100, 100, 0],
        [0, 0, 100],
        [100, 0, 100],
        [0, 100, 100],
        [100, 100, 100]
    ];
    const cube_connectivity_matrix = {
        faces: ["0-2-3-1", "4-6-7-5", "0-2-6-4", "1-3-7-5", "2-3-7-6", "0-1-5-4"],
        edges: ["0-1", "0-2", "0-4", "1-3", "1-5", "2-3", "2-6", "3-7", "4-5", "4-6", "5-7", "6-7"],
    };
    const triangular_pyramid_points = [
        [0, 0, 0],
        [50, 0, 0],
        [25, 50, 25],
        [25, 0, 50]
    ];
    const triangular_pyramid_connectivity_matrix = {
        faces: ["0-1-2", "0-1-3", "0-2-3", "1-2-3"],
        edges: ["0-1", "0-2", "0-3", "1-2", "1-3", "2-3"],
    };
    const mod_cube_points = toPoints3D(cube_points);
    const mod_triangular_pyramid_points = toPoints3D(triangular_pyramid_points);
    const cube_catmull_clark = new CatmullClark(mod_cube_points, cube_connectivity_matrix, 4);
    const triangular_pyramid_catmull_clark = new CatmullClark(mod_triangular_pyramid_points, triangular_pyramid_connectivity_matrix, 4);
    //   console.log("cube :")
    //     // console.log(cube_catmull_clark.display().points)
    //     // console.log(cube_catmull_clark.display().connectivity)
    //   cube_catmull_clark.iterate(1);
    //   console.log(cube_catmull_clark.display().points)
    //   console.log(cube_catmull_clark.display().connectivity)
    //   // const tc = cube_catmull_clark.triangulate();
    //   // console.log(tc.points)
    //   // console.log(tc.connectivity);
    //   console.log("triangular pyramid : ")
    //     console.log(triangular_pyramid_catmull_clark.display().points)
    //     console.log(triangular_pyramid_catmull_clark.display().connectivity)
    //   triangular_pyramid_catmull_clark.iterate(1);
    //   console.log(triangular_pyramid_catmull_clark.display().points)
    //   console.log(triangular_pyramid_catmull_clark.display().connectivity)
    //   // const tt = triangular_pyramid_catmull_clark.triangulate();
    //   // console.log(tt.points);
    //   // console.log(tt.connectivity)
    //   console.log("done");
})();
