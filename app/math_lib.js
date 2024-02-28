class MeshDataStructure {
    HalfEdgeDict;
    face_tmp;
    faces;
    sorted_faces;
    prev;
    next;
    temp;
    face_vertices_tmp;
    face_indexes_tmp;
    edge_no;
    vertex_no;
    vertex_indexes;
    multiplier = 10;
    deleted_halfedges_dict;
    face_indexes_set;
    max_face_index;
    face_index_map;
    max_vertex_index;
    constructor() {
        this.reset();
    }
    reset() {
        this.HalfEdgeDict = {};
        this.face_tmp = [];
        this.faces = new Set();
        this.sorted_faces = [];
        this.prev = null;
        this.next = null;
        this.temp = null;
        this.face_vertices_tmp = [];
        this.face_indexes_tmp = [];
        this.edge_no = 0;
        this.vertex_no = 0;
        this.vertex_indexes = new Set();
        this.deleted_halfedges_dict = {};
        this.face_indexes_set = new Set();
        this.max_face_index = 0;
        this.face_index_map = new Map();
        this.max_vertex_index = 0;
    }
    maxFaceIndex() {
        const test = Math.max(...[...this.face_indexes_set]);
        if (test !== Infinity && test !== -Infinity && test > this.max_face_index)
            this.max_face_index = test;
    }
    maxVertexIndex() {
        const test = Math.max(...[...this.vertex_indexes]);
        if (test !== Infinity && test !== -Infinity && test > this.max_vertex_index)
            this.max_vertex_index = test;
    }
    halfEdge(start, end, face_index) {
        this.vertex_indexes.add(start);
        this.vertex_indexes.add(end);
        this.maxVertexIndex();
        this.vertex_no = [...this.vertex_indexes].length;
        const comp = Math.max(start, end);
        if (this.multiplier % comp === this.multiplier)
            this.multiplier *= 10;
        this.face_indexes_set.add(face_index);
        this.maxFaceIndex();
        return {
            vertices: [start, end],
            face_vertices: [],
            twin: "-",
            prev: "-",
            next: "-",
            face_index: face_index,
        };
    }
    setHalfEdge(a, b, face_index = -1, set_halfEdge = true) {
        let halfEdgeKey = `${a}-${b}`;
        let twinHalfEdgeKey = `${b}-${a}`;
        // If halfedge does exist in halfedge dict switch halfedge key to twin halfedge key and vice-versa
        if (this.HalfEdgeDict[halfEdgeKey]) {
            const halfEdgeKeyTemp = twinHalfEdgeKey;
            twinHalfEdgeKey = halfEdgeKey;
            halfEdgeKey = halfEdgeKeyTemp;
        }
        // If halfedge does not exist in halfedge dict, create halfedge and increment the edge number
        if (!this.HalfEdgeDict[halfEdgeKey] && set_halfEdge === true) {
            this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(a, b, face_index);
            this.edge_no++;
            this.HalfEdgeDict[halfEdgeKey].face_vertices = this.face_vertices_tmp;
            this.face_index_map.set(face_index, this.face_vertices_tmp.join("-"));
        }
        else
            twinHalfEdgeKey;
        // if twin halfedge exists in halfedge dict, decrement the edge number
        if (this.HalfEdgeDict[twinHalfEdgeKey]) {
            this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
            this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
            this.edge_no--;
        }
        return halfEdgeKey;
    }
    addHalfEdge(edge, face_vertices = this.face_indexes_tmp, face_index = -1, prev = "-", next = "-") {
        if (typeof edge === "string")
            edge = edge.split("-").map(value => Number(value));
        const halfEdgeKey = this.setHalfEdge(...edge);
        this.HalfEdgeDict[halfEdgeKey].face_vertices = face_vertices;
        this.HalfEdgeDict[halfEdgeKey].prev = prev;
        this.HalfEdgeDict[halfEdgeKey].next = next;
        this.HalfEdgeDict[halfEdgeKey].face_index = face_index;
        return halfEdgeKey;
    }
    removeHalfEdge(edge) {
        if (!this.HalfEdgeDict[edge])
            return false; // halfedge was not deleted because it does not exist
        const [a, b] = edge.split("-");
        const twinHalfEdgeKey = b + "-" + a;
        const edge_num_list = this.edgeToNumber();
        this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
        // twin half edge exists
        if (this.HalfEdgeDict[twinHalfEdgeKey]) {
            this.HalfEdgeDict[twinHalfEdgeKey].twin = "-";
            let prev_halfEdgeKey = this.HalfEdgeDict[edge].prev;
            let next_halfEdgeKey = this.HalfEdgeDict[edge].next;
            if (prev_halfEdgeKey !== "-" && prev_halfEdgeKey !== twinHalfEdgeKey)
                this.HalfEdgeDict[prev_halfEdgeKey].next = "-";
            if (next_halfEdgeKey !== "-" && next_halfEdgeKey !== twinHalfEdgeKey)
                this.HalfEdgeDict[next_halfEdgeKey].prev = "-";
        }
        // twin half edge does not exist
        if (!this.HalfEdgeDict[twinHalfEdgeKey]) {
            var alpha_prev = "-";
            var alpha_next = "-";
            var beta_prev = "-";
            var beta_next = "-";
            var alpha_prev_exists = false;
            var alpha_next_exists = false;
            var beta_prev_exists = false;
            var beta_next_exists = false;
            alpha_prev = this.deleted_halfedges_dict[edge].prev;
            alpha_next = this.deleted_halfedges_dict[edge].next;
            alpha_prev_exists = !!this.HalfEdgeDict[alpha_prev];
            alpha_next_exists = !!this.HalfEdgeDict[alpha_next];
            if (this.deleted_halfedges_dict[twinHalfEdgeKey]) {
                beta_prev = this.deleted_halfedges_dict[twinHalfEdgeKey].prev;
                beta_next = this.deleted_halfedges_dict[twinHalfEdgeKey].next;
                beta_prev_exists = !!this.HalfEdgeDict[beta_prev];
                beta_next_exists = !!this.HalfEdgeDict[beta_next];
            }
            if (alpha_prev_exists && beta_next_exists) {
                this.HalfEdgeDict[alpha_prev].next = beta_next;
                this.HalfEdgeDict[beta_next].prev = alpha_prev;
            }
            else if (alpha_prev_exists)
                this.HalfEdgeDict[alpha_prev].next = "-";
            else if (beta_next_exists)
                this.HalfEdgeDict[beta_next].prev = "-";
            if (beta_prev_exists && alpha_next_exists) {
                this.HalfEdgeDict[beta_prev].next = alpha_next;
                this.HalfEdgeDict[alpha_next].prev = beta_prev;
            }
            else if (beta_prev_exists)
                this.HalfEdgeDict[beta_prev].next = "-";
            else if (alpha_next_exists)
                this.HalfEdgeDict[alpha_next].prev = "-";
            const faces_of_edge = this.getFacesOfDeletedEdge(edge);
            const alpha_edges = this.getEdgesOfFace(faces_of_edge[0]);
            const beta_edges = this.getEdgesOfFace(faces_of_edge[1]);
            if (alpha_edges.length >= 2 && beta_edges.length >= 2) {
                this.faces.delete(faces_of_edge[0].join("-"));
                this.faces.delete(faces_of_edge[1].join("-"));
                const new_face_vertices = this.mergeDeletedFaces(faces_of_edge, edge);
                const new_face_index = this.max_face_index + 1;
                const first_face_index = this.deleted_halfedges_dict[edge].face_index;
                const second_face_index = this.deleted_halfedges_dict[twinHalfEdgeKey].face_index;
                this.face_indexes_set.add(new_face_index);
                this.maxFaceIndex();
                this.face_index_map.set(new_face_index, new_face_vertices.join("-"));
                this.face_indexes_set.delete(first_face_index);
                this.face_indexes_set.delete(second_face_index);
                for (const edge of alpha_edges) {
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = new_face_vertices;
                        this.HalfEdgeDict[edge].face_index = new_face_index;
                    }
                }
                for (const edge of beta_edges) {
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = new_face_vertices;
                        this.HalfEdgeDict[edge].face_index = new_face_index;
                    }
                }
                this.faces.add(new_face_vertices.join('-'));
            }
            if (alpha_edges.length < 2) {
                for (const edge of alpha_edges)
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                        this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                    }
                this.faces.delete(faces_of_edge[0].join("-"));
            }
            if (beta_edges.length < 2) {
                for (const edge of beta_edges)
                    if (this.HalfEdgeDict[edge]) {
                        this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                        this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                    }
                this.faces.delete(faces_of_edge[1].join("-"));
            }
            const biFacial_handling_result = this.biFacialHandling();
            if (biFacial_handling_result.length > 0)
                this.removeFace(biFacial_handling_result.join("-"));
            // if vertex a belongs to at most one edge remove it from the vertex indexes set
            if (this.getEdgesOfVertexFast(Number(a), edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(a));
            }
            // if vertex b belongs to at most one edge remove it from the vertex indexes set
            if (this.getEdgesOfVertexFast(Number(b), edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(b));
            }
            this.vertex_no = [...this.vertex_indexes].length; // update vertex number
            this.edge_no--; // decrease edge number as the twin does not exist
        }
        delete this.HalfEdgeDict[edge]; // delete the halfedge
        return true; // halfedge was successfully deleted
    }
    mergeDeletedFaces(faces, edge) {
        const alpha_face = this.prepareDeletedFaces(faces[0], edge);
        const beta_face = this.prepareDeletedFaces(faces[1], edge);
        const [a, b] = edge.split("-").map(value => Number(value));
        if (alpha_face.join("-") === beta_face.join("-")) {
            const a_index = alpha_face.indexOf(a);
            const b_index = beta_face.indexOf(b);
            const min_index = Math.min(a_index, b_index);
            alpha_face.splice(min_index, 2);
            this.modifyMergedFace(alpha_face);
        }
        const alpha_dict = {};
        const beta_dict = {};
        for (const index in alpha_face)
            alpha_dict[alpha_face[index]] = index;
        for (const index in beta_face)
            beta_dict[beta_face[index]] = index;
        var face_bool = true;
        var index = 0;
        var monitor = 0;
        const stop = faces[0].length + faces[1].length - 2;
        var collide = 0;
        var monitor_bool = true;
        const merged_face = [];
        while (true) {
            const cur_index = face_bool ? index % alpha_face.length : index % beta_face.length;
            const cur_value = face_bool ? alpha_face[cur_index] : beta_face[cur_index];
            if (cur_value === a || cur_value === b) {
                if (collide < 2) {
                    merged_face[merged_face.length] = cur_value;
                    face_bool = !face_bool;
                    const dict = face_bool ? alpha_dict : beta_dict;
                    index = dict[cur_value];
                    collide++;
                }
                else
                    monitor_bool = false;
            }
            else
                merged_face[merged_face.length] = cur_value;
            if (monitor_bool === true)
                monitor++;
            monitor_bool = true;
            index++;
            if (monitor === stop)
                break;
        }
        return this.modifyMergedFace(merged_face);
    }
    prepareDeletedFaces(face, edge) {
        var prepped = false;
        var remainder = [];
        const [a, b] = edge.split("-").map(value => Number(value));
        var edge_num_list = [];
        for (const index in face) {
            const cur_val = face[index];
            const next_val = face[(Number(index) + 1) % face.length];
            const last_val = Number(index) === (face.length - 1) ? true : false;
            if ((cur_val === a || cur_val === b) && (next_val === a || next_val === b)) {
                if (!last_val) {
                    remainder = face;
                    prepped = true;
                    break;
                }
                if (last_val) {
                    edge_num_list = [cur_val, next_val];
                }
            }
            if (!(cur_val === a || cur_val === b))
                remainder.push(cur_val);
        }
        if (!prepped)
            remainder = [...edge_num_list, ...remainder];
        return remainder;
    }
    modifyMergedFace(face) {
        var min = Infinity;
        var min_index = 0;
        for (const index in face) {
            const vertex = face[index];
            if (min > vertex) {
                min = vertex;
                min_index = Number(index);
            }
        }
        var rem = face.splice(min_index);
        return [...rem, ...face];
    }
    biFacialHandling() {
        if (this.faces.size === 2) { // Check if there are only two faces left in the mesh
            const faces = [...this.faces];
            const face_one = [...faces[0].split("-").map(value => Number(value))];
            const face_two = [...faces[1].split("-").map(value => Number(value))];
            if (face_one.length !== face_two.length)
                return []; // if both faces don't have the same number of vertices then abort and return false
            if (face_one.length <= 3)
                return face_two; // automatically consider them as complements in this case
            // else then try to compute if the two faces are complements
            if (this.modifyMergedFace(face_one).join("-") === this.modifyMergedFace(face_two).join("-"))
                return face_two; // if the two faces are complements return true;
            return []; // default return value;
        }
        return []; // default return value;
    }
    addVertex(vertex, vertex_or_face_or_edge) {
        if (typeof vertex_or_face_or_edge === "string")
            vertex_or_face_or_edge = vertex_or_face_or_edge.split("-").map(value => Number(value));
        vertex = Number(vertex);
        if (vertex_or_face_or_edge.length === 1) {
            this.vertex_indexes.add(vertex);
            this.maxVertexIndex();
            this.vertex_no = [...this.vertex_indexes].length;
            const comp = Math.max(this.max_vertex_index, vertex);
            if (this.multiplier % comp === this.multiplier)
                this.multiplier *= 10;
        }
        else if (vertex_or_face_or_edge.length >= 2) {
            var face_index = -1;
            if (vertex_or_face_or_edge.length > 2) {
                if (this.faces.has(vertex_or_face_or_edge.join("-"))) {
                    face_index = this.getFaceIndexOfFace(vertex_or_face_or_edge.join("-"));
                }
            }
            for (const val of vertex_or_face_or_edge) {
                this.addHalfEdge(`${vertex}-${val}`, vertex_or_face_or_edge, face_index);
            }
        }
    }
    removeVertex(vertex) {
        let count = 0;
        for (const edge in this.HalfEdgeDict) {
            if (edge.split("-").includes(`${vertex}`)) {
                this.removeEdge(edge);
            }
        }
        return count;
    }
    getEdgesOfVertexFast(vertex, edge_num_list) {
        const edge_list = [];
        edge_num_list.map(value => {
            const min = value % this.multiplier;
            const max = (value - min) / this.multiplier;
            if (vertex === min || vertex === max)
                edge_list.push(`${min}-${max}`);
        });
        return edge_list;
    }
    getEdgesOfVertex(vertex, no_half_edge = false) {
        const edge_list = [];
        const edge_set = new Set();
        if (no_half_edge === false) {
            for (const edge in this.HalfEdgeDict) {
                // edge touches vertex and is not in the edge_list
                if (edge.split("-").includes(`${vertex}`))
                    edge_list.push(edge);
            }
        }
        if (no_half_edge === true) {
            for (const edge in this.HalfEdgeDict) {
                // edge touches vertex and is not in the edge_list also ensure no edge complements (halfedges that are twin halfedges of previously existing halfedges)
                if (edge.split("-").includes(`${vertex}`)) {
                    const [a, b] = edge.split("-").map(value => Number(value));
                    edge_set.add(`${Math.min(a, b)}-${Math.max(a, b)}`);
                }
            }
            edge_list.push(...[...edge_set]);
        }
        return edge_list;
    }
    getFacesOfVertexSpecific(edge_list) {
        const face_set = new Set();
        const faces = [];
        for (const edge of edge_list) {
            const face = this.HalfEdgeDict[edge].face_vertices;
            if (!face_set.delete(face.join("-"))) {
                face_set.add(face.join("-"));
                faces.push(face);
            }
        }
        return faces;
    }
    getFaceIndexesOfVertexSpecific(edge_list) {
        const face_indexes = new Set();
        for (const edge of edge_list) {
            const face_index = this.HalfEdgeDict[edge].face_index;
            face_indexes.add(face_index);
        }
        return [...face_indexes];
    }
    getFacesOfVertexGeneric(vertex, no_half_edge = false) {
        const edge_list = this.getEdgesOfVertex(vertex, no_half_edge);
        this.getFacesOfVertexSpecific(edge_list);
    }
    addEdge(edge) {
        if (typeof edge === "string")
            edge = edge.split("-").map(value => Number(value));
        this.setHalfEdge(...edge);
        this.setHalfEdge(edge[1], edge[0]);
        return edge;
    }
    removeEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        const remove_thf = this.removeHalfEdge(edge.split("-").reverse().join("-"));
        const remove_hf = this.removeHalfEdge(edge);
        return remove_hf || remove_thf;
    }
    splitEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        const [a, b] = edge.split("-").map(value => Number(value));
        const faces_of_edge = this.getFacesOfEdge(edge);
        const new_vertex = this.max_vertex_index + 1;
        if (faces_of_edge[0].length > 0) {
            const new_face = faces_of_edge[0].join("-").replace(edge, `${a}-${new_vertex}-${b}`);
            this.vertex_indexes.add(new_vertex);
            if (faces_of_edge[0].length > 2) {
                this.removeFace(faces_of_edge[0].join("-"));
                this.addFace(new_face);
            }
            else {
                var prev = "-";
                var next = "-";
                if (this.HalfEdgeDict[edge]) {
                    prev = this.HalfEdgeDict[edge].prev;
                    next = this.HalfEdgeDict[edge].next;
                    this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
                    delete this.HalfEdgeDict[edge];
                    const face_index = this.HalfEdgeDict[edge].face_index;
                    this.addHalfEdge(`${a}-${new_vertex}`, new_face.split("-").map(value => Number(value)), face_index, prev, `${new_vertex}-${b}`);
                    this.addHalfEdge(`${new_vertex}-${b}`, new_face.split("-").map(value => Number(value)), face_index, `${a}-${new_vertex}`, next);
                }
            }
        }
        if (faces_of_edge[1].length > 0) {
            const new_face = faces_of_edge[1].join("-").replace(b + "-" + a, `${b}-${new_vertex}-${a}`);
            this.vertex_indexes.add(new_vertex);
            if (faces_of_edge[1].length > 2) {
                this.removeFace(faces_of_edge[1].join("-"));
                this.addFace(new_face);
            }
            else {
                var prev = "-";
                var next = "-";
                if (this.HalfEdgeDict[b + "-" + a]) {
                    prev = this.HalfEdgeDict[b + "-" + a].prev;
                    next = this.HalfEdgeDict[b + "-" + a].next;
                    this.deleted_halfedges_dict[b + "-" + a] = this.HalfEdgeDict[b + "-" + a];
                    delete this.HalfEdgeDict[b + "-" + a];
                    const face_index = this.HalfEdgeDict[b + "-" + a].face_index;
                    this.addHalfEdge(`${b}-${new_vertex}`, new_face.split("-").map(value => Number(value)), face_index, prev, `${new_vertex}-${a}`);
                    this.addHalfEdge(`${new_vertex}-${a}`, new_face.split("-").map(value => Number(value)), face_index, `${b}-${new_vertex}`, next);
                }
            }
        }
        this.maxVertexIndex();
    }
    mergeEdges(edge_1, edge_2) {
        if (typeof edge_1 === "object")
            edge_1 = edge_1.join("-");
        const [a_1, b_1] = edge_1.split("-").map(value => Number(value));
        if (typeof edge_2 === "object")
            edge_2 = edge_2.join("-");
        const [a_2, b_2] = edge_2.split("-").map(value => Number(value));
        const common_vertex_face_num = this.getCommonVertAndFacesofEdges(a_1, b_1, a_2, b_2);
        const common_vertex = common_vertex_face_num.common_vertex;
        const common_faces = common_vertex_face_num.faces;
        if (common_vertex < 0)
            return false;
        const edge_list = this.getEdgesOfVertex(common_vertex, true);
        const rev_edge_1 = `${b_1}-${a_1}`;
        const rev_edge_2 = `${b_2}-${a_2}`;
        let initial_max_face_index = this.max_face_index;
        for (const edge of edge_list) {
            if (!(edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2)) {
                const edge_faces = this.getFacesOfEdge(edge);
                const rem_edge = this.removeEdge(edge);
                if (rem_edge) {
                    const has_face_0 = this.faces.has(edge_faces[0].join("-"));
                    const has_face_1 = this.faces.has(edge_faces[1].join("-"));
                    if (!has_face_0) {
                        const index = common_faces.indexOf(edge_faces[0].join("-"));
                        if (index >= 0)
                            common_faces.splice(index, 1);
                    }
                    if (!has_face_1) {
                        const index = common_faces.indexOf(edge_faces[1].join("-"));
                        if (index >= 0)
                            common_faces.splice(index, 1);
                    }
                    if (this.max_face_index > initial_max_face_index) {
                        const face_to_push = this.face_index_map.get(this.max_face_index);
                        if (typeof face_to_push !== "undefined")
                            common_faces.push(face_to_push);
                        initial_max_face_index = this.max_face_index;
                        this.face_indexes_set.add(initial_max_face_index);
                    }
                }
            }
        }
        for (const face of common_faces) {
            const working_face = [...face.split("-").map(value => Number(value))];
            const index = working_face.indexOf(common_vertex);
            if (index >= 0) {
                working_face.splice(index, 1);
            }
            if (working_face.length <= 2)
                this.removeFace(face);
            else {
                const required_edges = this.getEdgesOrientation(face, edge_1, edge_2);
                if (required_edges.prev === "-" || required_edges.next === "-")
                    continue;
                const a = required_edges.prev.split("-")[0];
                const b = required_edges.next.split("-")[1];
                const prev = this.HalfEdgeDict[required_edges.prev].prev;
                const next = this.HalfEdgeDict[required_edges.next].next;
                const old_face_index = required_edges.face_index;
                this.face_indexes_set.delete(old_face_index);
                const new_face_index = this.getFaceIndexOfFace(working_face.join("-"));
                this.face_indexes_set.add(new_face_index);
                this.face_index_map.set(new_face_index, working_face.join("-"));
                this.addHalfEdge(a + "-" + b, working_face, new_face_index, prev, next);
                if (prev !== "-")
                    if (this.HalfEdgeDict[prev]) {
                        this.HalfEdgeDict[prev].next = a + "-" + b;
                    }
                if (next !== "-")
                    if (this.HalfEdgeDict[next]) {
                        this.HalfEdgeDict[next].prev = a + "-" + b;
                    }
                for (const edge of required_edges.edges_of_face) {
                    if (this.HalfEdgeDict[edge]) {
                        const face = this.HalfEdgeDict[edge].face_vertices.join("-");
                        this.faces.delete(face);
                        this.HalfEdgeDict[edge].face_vertices = working_face;
                        this.faces.add(working_face.join("-"));
                    }
                }
            }
        }
        if (this.HalfEdgeDict[edge_1]) {
            this.deleted_halfedges_dict[edge_1] = this.HalfEdgeDict[edge_1];
            delete this.HalfEdgeDict[edge_1];
        }
        if (this.HalfEdgeDict[rev_edge_1]) {
            this.deleted_halfedges_dict[rev_edge_1] = this.HalfEdgeDict[rev_edge_1];
            delete this.HalfEdgeDict[rev_edge_1];
        }
        if (this.HalfEdgeDict[edge_2]) {
            this.deleted_halfedges_dict[edge_2] = this.HalfEdgeDict[edge_2];
            delete this.HalfEdgeDict[edge_2];
        }
        if (this.HalfEdgeDict[rev_edge_2]) {
            this.deleted_halfedges_dict[rev_edge_2] = this.HalfEdgeDict[rev_edge_2];
            delete this.HalfEdgeDict[rev_edge_2];
        }
        this.edge_no = this.edge_no - 2; // update edge number
        this.vertex_indexes.delete(common_vertex);
        this.vertex_no = [...this.vertex_indexes].length; // update vertex number
        const biFacial_handling_result = this.biFacialHandling();
        if (biFacial_handling_result.length > 0)
            this.removeFace(biFacial_handling_result.join("-"));
        this.face_indexes_set.delete(-1);
    }
    getCommonVertAndFacesofEdges(a_1, b_1, a_2, b_2) {
        const test = { common_vertex: -1, faces: [] };
        // Check if both halfEdges or their twin halfedges exist
        if (((this.HalfEdgeDict[a_1 + "-" + b_1]) || (this.HalfEdgeDict[b_1 + "-" + a_1])) &&
            ((this.HalfEdgeDict[a_2 + "-" + b_2]) || (this.HalfEdgeDict[b_2 + "-" + a_2]))) {
            const halfEdgeKey_union_list = [a_1, b_1, a_2, b_2];
            const halfEdgeKey_union_set = new Set(halfEdgeKey_union_list);
            if (halfEdgeKey_union_set.size <= 2)
                return test;
            // get the common vertex of the adjacent edges
            for (const val of halfEdgeKey_union_list) {
                const check_vertex = halfEdgeKey_union_set.delete(val);
                if (check_vertex === false) {
                    test.common_vertex = val;
                    break;
                }
            }
            // get the faces
            const faces_list = [];
            if (this.HalfEdgeDict[`${a_1}-${b_1}`])
                faces_list.push(this.HalfEdgeDict[`${a_1}-${b_1}`].face_vertices.join("-"));
            if (this.HalfEdgeDict[`${b_1}-${a_1}`])
                faces_list.push(this.HalfEdgeDict[`${b_1}-${a_1}`].face_vertices.join("-"));
            if (this.HalfEdgeDict[`${a_2}-${b_2}`])
                faces_list.push(this.HalfEdgeDict[`${a_2}-${b_2}`].face_vertices.join("-"));
            if (this.HalfEdgeDict[`${b_2}-${a_2}`])
                faces_list.push(this.HalfEdgeDict[`${b_2}-${a_2}`].face_vertices.join("-"));
            const face_set = new Set(faces_list);
            test.faces.push(...[...face_set]);
            // get the faces' index
            const face_indexes_list = [];
            if (this.HalfEdgeDict[`${a_1}-${b_1}`])
                face_indexes_list.push(this.HalfEdgeDict[`${a_1}-${b_1}`].face_index);
            if (this.HalfEdgeDict[`${b_1}-${a_1}`])
                face_indexes_list.push(this.HalfEdgeDict[`${b_1}-${a_1}`].face_index);
            if (this.HalfEdgeDict[`${a_2}-${b_2}`])
                face_indexes_list.push(this.HalfEdgeDict[`${a_2}-${b_2}`].face_index);
            if (this.HalfEdgeDict[`${b_2}-${a_2}`])
                face_indexes_list.push(this.HalfEdgeDict[`${b_2}-${a_2}`].face_index);
            return test;
        }
        return test;
    }
    getEdgesOrientation(face, edge_1, edge_2) {
        const edges_orientation = { prev: "-", next: "-", edges_of_face: [], face_index: -1 };
        const rev_edge_1 = edge_1.split("-").reverse().join("-");
        const rev_edge_2 = edge_2.split("-").reverse().join("-");
        const face_edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));
        edges_orientation.edges_of_face.push(...face_edges);
        edges_orientation.face_index = face_edges.length >= 1 ? this.HalfEdgeDict[face_edges[0]].face_index : -1;
        var found_edge = "-";
        for (const edge of face_edges) {
            if (edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2) {
                if (this.HalfEdgeDict[edge]) {
                    found_edge = edge;
                    break;
                }
            }
        }
        if (found_edge === "-")
            return edges_orientation;
        else {
            const prev = this.HalfEdgeDict[found_edge].prev;
            const next = this.HalfEdgeDict[found_edge].next;
            if (prev !== "-")
                if (prev === edge_1 || prev === rev_edge_1 || prev === edge_2 || prev === rev_edge_2)
                    if (this.HalfEdgeDict[prev])
                        edges_orientation.prev = prev;
            if (next !== "-")
                if (next === edge_1 || next === rev_edge_1 || next === edge_2 || next === rev_edge_2)
                    if (this.HalfEdgeDict[next])
                        edges_orientation.next = next;
            if (edges_orientation.prev === "-")
                edges_orientation.prev = found_edge;
            else if (edges_orientation.next === "-")
                edges_orientation.next = found_edge;
        }
        return edges_orientation;
    }
    edgeReverse(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        const [a, b] = edge.split("-");
        return `${b}-${a}`;
    }
    getVerticesOfEdge(edge) {
        if (typeof edge === "string")
            return edge.split("-").map(value => Number(value));
        else
            return edge;
    }
    getFacesOfHalfEdge(halfEdge) {
        if (this.HalfEdgeDict[halfEdge]) {
            return this.HalfEdgeDict[halfEdge].face_vertices;
        }
        else
            return [];
    }
    getFacesOfEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        return [this.getFacesOfHalfEdge(edge), this.getFacesOfHalfEdge(edge.split("-").reverse().join("-"))];
    }
    getFacesOfDeletedHalfEdge(halfEdge) {
        if (this.deleted_halfedges_dict[halfEdge]) {
            return this.deleted_halfedges_dict[halfEdge].face_vertices;
        }
        else
            return [];
    }
    getFacesOfDeletedEdge(edge) {
        if (typeof edge === "object")
            edge = edge.join("-");
        return [this.getFacesOfDeletedHalfEdge(edge), this.getFacesOfDeletedHalfEdge(edge.split("-").reverse().join("-"))];
    }
    edgeToNumber() {
        const edge_num_set = new Set();
        for (const edge in this.HalfEdgeDict) {
            const [a, b] = edge.split("-").map(value => Number(value));
            const [min, max] = [Math.min(a, b), Math.max(a, b)];
            edge_num_set.add(max * this.multiplier + min);
        }
        return [...edge_num_set];
    }
    addFace(face) {
        this.face_vertices_tmp = face.split("-").map(value => Number(value));
        const sorted_face = [...this.face_vertices_tmp].sort((a, b) => a - b).join("-");
        const face_set = new Set(this.faces);
        const sorted_face_set = new Set(this.sorted_faces);
        // If face is not found in faces add face to faces and set its halfedges
        if (!face_set.delete(face) && this.face_vertices_tmp.length > 2 && !sorted_face_set.delete(sorted_face)) {
            this.faces.add(face);
            this.sorted_faces.push(sorted_face);
            const first_index = this.face_vertices_tmp[0];
            const second_index = this.face_vertices_tmp[1];
            const last_index = this.face_vertices_tmp[this.face_vertices_tmp.length - 1];
            const face_index = this.max_face_index + 1;
            for (let p in this.face_vertices_tmp) {
                const index = Number(p);
                const i = this.face_vertices_tmp[p];
                const j = this.face_vertices_tmp[(index + 1) % this.face_vertices_tmp.length];
                const halfEdgeKey = this.setHalfEdge(i, j, face_index);
                const [a, b] = halfEdgeKey.split("-");
                if (this.temp === null) {
                    this.prev = "-";
                }
                else {
                    this.prev = this.temp + "-" + a;
                }
                if (this.HalfEdgeDict[this.prev]) {
                    this.HalfEdgeDict[this.prev].next = halfEdgeKey;
                }
                this.next = "-";
                this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
                this.HalfEdgeDict[halfEdgeKey].next = this.next;
                this.temp = a;
                if (index === 0)
                    this.HalfEdgeDict[halfEdgeKey].prev = `${last_index}-${first_index}`;
                if (index === this.face_vertices_tmp.length - 1)
                    this.HalfEdgeDict[halfEdgeKey].next = `${first_index}-${second_index}`;
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
    removeFace(face) {
        // Check if face is found in faces
        if (this.faces.has(face)) {
            const existing_face_edges = this.getEdgesOfFacethatExists(face.split("-").map(value => Number(value)));
            const edge_num_list = this.edgeToNumber();
            // remove the face and its halfedges
            for (const half_edge of existing_face_edges) {
                const [a, b] = half_edge.split("-");
                this.deleted_halfedges_dict[half_edge] = this.HalfEdgeDict[half_edge];
                this.face_indexes_set.delete(this.HalfEdgeDict[half_edge].face_index);
                delete this.HalfEdgeDict[half_edge];
                // if vertex a belongs to at most one edge remove it from the vertex indexes set
                if (this.getEdgesOfVertexFast(Number(a), edge_num_list).length <= 1) {
                    this.vertex_indexes.delete(Number(a));
                }
                // if vertex b belongs to at most one edge remove it from the vertex indexes set
                if (this.getEdgesOfVertexFast(Number(b), edge_num_list).length <= 1) {
                    this.vertex_indexes.delete(Number(b));
                }
                this.vertex_no = [...this.vertex_indexes].length; // update vertex number
                if (!this.HalfEdgeDict[b + "-" + a])
                    this.edge_no--; // decrease edge number if the twin does not exist
            }
            this.faces.delete(face);
            return true; // face was removed
        }
        return false; // face not removed because it was not found
    }
    getEdgesOfFace(face) {
        return face.map((value, index) => `${value}-${face[(index + 1) % face.length]}`);
    }
    getEdgesOfFacethatExists(face) {
        const potential_edges = this.getEdgesOfFace(face);
        const existing_edges = [];
        for (const half_edge of potential_edges) {
            if (half_edge in this.HalfEdgeDict)
                existing_edges.push(half_edge);
        }
        return existing_edges;
    }
    getFaceIndexOfFace(face) {
        const edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));
        for (const halfedge of edges) {
            if (halfedge in this.HalfEdgeDict)
                this.HalfEdgeDict[halfedge].face_index;
        }
        return -1;
    }
    splitFace(face, vert_1, vert_2) {
        vert_1 = Number(vert_1);
        vert_2 = Number(vert_2);
        if (this.faces.has(face)) {
            if (!face.includes(`${vert_1}`) || !face.includes(`${vert_2}`))
                return false; // face not split as one or both vertices not found in face
            const face_vertices = face.split("-").map(value => Number(value));
            const edges = this.getEdgesOfFace(face_vertices);
            const bi_edges = [];
            for (const edge of edges)
                if (edge.includes(`${vert_1}`))
                    bi_edges.push(edge);
            for (const bi_edge of bi_edges)
                if (bi_edge.includes(`${vert_2}`))
                    return false; // face not split due to both vertices belonging to the same edge
            const vert_1_index = face_vertices.indexOf(vert_1);
            const vert_2_index = face_vertices.indexOf(vert_2);
            const first_vertex = vert_2_index > vert_1_index ? vert_1_index : vert_2_index;
            const second_vertex = vert_2_index > vert_1_index ? vert_2_index : vert_1_index;
            var pre = face_vertices.splice(0, first_vertex + 1);
            var post = face_vertices.splice(second_vertex - pre.length);
            var other_face = [post[0], ...face_vertices.reverse(), pre[pre.length - 1]];
            pre.push(...post);
            this.removeFace(face);
            this.addFace(pre.join("-"));
            this.addFace(other_face.join("-"));
            return true; // face was split
        }
        return false; // face not split as it doesn't exist
    }
    mergeFace(face_1, face_2) {
        if (!this.faces.has(face_1) || !this.faces.has(face_2))
            return false; // faces not merged because one or both do not exist
        const face_1_edges = this.getEdgesOfFace(face_1.split("-").map(value => Number(value)));
        const face_2_edges = this.getEdgesOfFace(face_2.split("-").map(value => Number(value)));
        for (const edge of face_1_edges) {
            const twin_edge = edge.split("-").reverse().join("-");
            if (face_2_edges.includes(twin_edge)) {
                this.removeEdge(edge);
                return true; // faces were merged
            }
        }
        return false; // faces not merged because they do not have a common edge;
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
    getMinMax(points) {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        var minZ = Infinity;
        var maxZ = -Infinity;
        const indices = { minXIndex: 0,
            maxXIndex: 0,
            minYIndex: 0,
            maxYIndex: 0,
            minZIndex: 0,
            maxZIndex: 0 };
        for (const _index in points) {
            const index = Number(_index);
            const point = points[index];
            if (minX > point.x) {
                minX = point.x;
                indices.minXIndex = index;
            }
            ;
            if (maxX < point.x) {
                maxX = point.x;
                indices.maxXIndex = index;
            }
            ;
            if (minY > point.y) {
                minY = point.y;
                indices.minYIndex = index;
            }
            ;
            if (maxY < point.y) {
                maxY = point.y;
                indices.maxYIndex = index;
            }
            ;
            if (minZ > point.z) {
                minZ = point.z;
                indices.minZIndex = index;
            }
            ;
            if (maxZ < point.z) {
                maxZ = point.z;
                indices.maxZIndex = index;
            }
            ;
        }
        const minmax = { minX: minX, maxX: maxX, minY: minY, maxY: maxY, minZ: minZ, maxZ: maxZ };
        return { min_max: minmax, indices: indices };
    }
    triangulate(points_list = undefined) {
        const triangulated_points_list = [];
        if (typeof points_list !== "undefined") {
            triangulated_points_list.push(...points_list);
        }
        const start = new Date().getTime();
        const new_mesh = new MeshDataStructure();
        var new_vertex = this.max_vertex_index;
        for (const face of this.faces) {
            const vertex_indexes = face.split("-").map(value => Number(value));
            const face_edges = this.getEdgesOfFace(vertex_indexes);
            new_vertex++;
            if (typeof points_list !== "undefined") {
                const face_vertices = this.HalfEdgeDict[face_edges[0]].face_vertices;
                const face_points = face_vertices.map(value => points_list[value]);
                const minmax = this.getMinMax(face_points).min_max;
                const average_point = new Point3D((minmax.minX + minmax.maxX) * 0.5, (minmax.minY + minmax.maxY) * 0.5, (minmax.minZ + minmax.maxZ) * 0.5);
                triangulated_points_list.push(average_point);
            }
            for (const edge of face_edges) {
                const [a, b] = edge.split("-");
                new_mesh.addFace(`${new_vertex}-${a}-${b}`);
            }
        }
        const end = new Date().getTime();
        console.log(`Time taken to triangulate : ${end - start} ms`);
        return { mesh: new_mesh, points: triangulated_points_list };
    }
    quad_to_tri(points_list = undefined) {
        const triangulated_points_list = [];
        if (typeof points_list !== "undefined") {
            triangulated_points_list.push(...points_list);
        }
        const new_mesh = new MeshDataStructure();
        for (const face of this.faces) {
            const vertex_indexes = face.split("-").map(value => Number(value));
            const face_edges = this.getEdgesOfFace(vertex_indexes);
            if (face_edges.length === 4) {
                const [a, b] = face_edges[0].split("-");
                const [c, d] = face_edges[1].split("-");
                const [e, f] = face_edges[2].split("-");
                const [g, h] = face_edges[3].split("-");
                new_mesh.addFace(`${a}-${b}-${d}`);
                new_mesh.addFace(`${e}-${f}-${h}`);
            }
            else
                new_mesh.addFace(face);
        }
        return { mesh: new_mesh, points: triangulated_points_list };
    }
}
class ObjectHelper {
    instance;
    prev;
    next;
    object_dict;
    start_instance;
    constructor() {
        this.instance = 0;
        this.prev = null;
        this.next = null;
        this.object_dict = {};
        this.start_instance = 0;
    }
    updateObjectDict() {
        const len = Object.keys(this.object_dict).length;
        if (this.prev !== null)
            this.object_dict[this.prev].next = this.instance;
        this.object_dict[this.instance] = { index: len, prev: this.prev, next: this.next };
        this.prev = this.instance;
        this.instance++;
    }
    moveObject(instance, end, direction = "d") {
        const object_inst = this.object_dict[instance];
        console.log(this.object_dict);
        console.log(object_inst, this.object_dict[end]);
        if (!object_inst)
            return;
        const object_end = this.object_dict[end];
        if (!object_end)
            return;
        this.deleteObjectInstance(instance);
        const prev = object_end.prev;
        const next = object_end.next;
        console.log(this.object_dict);
        console.log(prev, next);
        switch (direction) {
            case "u":
                if (prev !== null)
                    this.object_dict[prev].next = instance;
                this.object_dict[instance] = { index: object_inst.index, prev: prev, next: end };
                object_end.prev = instance;
                break;
            case "d":
                object_end.next = instance;
                this.object_dict[instance] = { index: object_inst.index, prev: end, next: next };
                if (next !== null)
                    this.object_dict[next].prev = instance;
                break;
            default: return;
        }
    }
    deleteObjectInstance(instance) {
        const prev = this.object_dict[instance].prev;
        const next = this.object_dict[instance].next;
        if (prev !== null) {
            if (this.object_dict[prev])
                this.object_dict[prev].next = next;
        }
        if (next !== null) {
            if (this.object_dict[next])
                this.object_dict[next].prev = prev;
        }
        delete this.object_dict[instance];
    }
    getDirection(start_instance, current_instance) {
        var link = this.object_dict[start_instance].prev;
        while (link !== null) {
            if (link === current_instance)
                return "u";
            else
                link = this.object_dict[link].prev;
        }
        link = this.object_dict[start_instance].next;
        while (link !== null) {
            if (link === current_instance)
                return "d";
            else
                link = this.object_dict[link].next;
        }
        return "u";
    }
}
class Miscellanous {
    constructor() { }
    // rad_to_deg();
    // rad_to_grad();
    // deg_to_rad();
    // deg_to_grad();
    // grad_to_rad();
    // grad_to_deg();
    initDepthBuffer() {
        const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
        return new Float64Array(elementNum);
    }
    resetDepthBuffer(depthBuffer) {
        return depthBuffer.fill(Infinity);
    }
    initFrameBuffer() {
        const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
        return new Uint8Array(elementNum * 4);
    }
    resetFrameBuffer(frameBuffer) {
        return frameBuffer.map((value, index) => {
            const mod4 = index % 4;
            if (mod4 < 3) {
                return value = 0;
            }
            else
                return value = 255;
        });
    }
    getPermutationsArr(arr, permutationSize) {
        const permutations = [];
        function backtrack(currentPerm) {
            if (currentPerm.length === permutationSize) {
                permutations.push(currentPerm.slice());
                return;
            }
            arr.forEach((item) => {
                if (currentPerm.includes(item))
                    return;
                currentPerm.push(item);
                backtrack(currentPerm);
                currentPerm.pop();
            });
        }
        backtrack([]);
        return permutations;
    }
    getCombinationsArr(arr, combinationSize) {
        const combinations = [];
        function backtrack(startIndex, currentCombination) {
            if (currentCombination.length === combinationSize) {
                combinations.push(currentCombination.slice());
                return;
            }
            for (let i = startIndex; i < arr.length; i++) {
                currentCombination.push(arr[i]);
                backtrack(i + 1, currentCombination);
                currentCombination.pop();
            }
        }
        backtrack(0, []);
        return combinations;
    }
    getFibonacciNum(num) {
        if (num < 0)
            return 0;
        else if (num === 0 || num === 1)
            return 1;
        else
            return this.getFibonacciNum(num - 1) + this.getFibonacciNum(num - 2);
    }
    getFibonacciSeq(start, stop) {
        var s = Math.max(start, 0);
        const hold = [];
        var n = 0;
        while (s <= stop) {
            hold[n] = this.getFibonacciNum(s);
            n++;
            s++;
        }
        return hold;
    }
    getFactorialNum(num) {
        if (num <= 1)
            return 1;
        else
            return num * this.getFactorialNum(num - 1);
    }
    getFactorialSeq(start, stop) {
        var s = Math.max(start, 0);
        const hold = [];
        var n = 0;
        while (s <= stop) {
            hold[n] = this.getFactorialNum(s);
            n++;
            s++;
        }
        return hold;
    }
    getCombinationsNum(n, r) {
        return (this.getFactorialNum(n) / ((this.getFactorialNum(n - r)) * (this.getFactorialNum(r))));
    }
    getPermutationsNum(n, r) {
        return (this.getFactorialNum(n) / (this.getFactorialNum(n - r)));
    }
    getParamAsList(maxPLen, paramList) {
        if (arguments.length === 2) {
            const key = `${paramList}-${maxPLen}`;
            if (pListCache[key] !== undefined) {
                return pListCache[key];
            }
            var count = 0;
            var compParamList = [];
            for (let i of paramList) {
                if (i < maxPLen) {
                    compParamList[count] = i;
                    count++;
                }
            }
            pListCache[key] = compParamList;
            return compParamList;
        }
        return [0];
    }
    getParamAsArg(maxPLen = Infinity, ...args) {
        const key = `${args}-${maxPLen}`;
        if (pArgCache[key] !== undefined) {
            return pArgCache[key];
        }
        if (arguments.length > 1 && arguments.length <= 4) {
            var start = 0;
            var end = maxPLen;
            var interval = 1;
            if (arguments.length === 2) {
                if (arguments[1] !== undefined) {
                    end = Math.min(arguments[1], maxPLen);
                }
                else {
                    end = maxPLen;
                }
            }
            else {
                start = arguments[1] || 0;
                if (arguments[1] !== undefined) {
                    end = Math.min(arguments[2], maxPLen);
                }
                else {
                    end = maxPLen;
                }
                interval = arguments[3] || 1;
            }
            var count = 0;
            var index = 0;
            var compParamList = [];
            for (let i = start; i < end; i++) {
                index = start + (count * interval);
                if (index < end) {
                    compParamList[count] = index;
                    count++;
                }
            }
            pArgCache[key] = compParamList;
            return compParamList;
        }
        return [0];
    }
    createArrayFromArgs(length) {
        var arr = new Array(length || 0), i = length;
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) {
                arr[length - 1 - i] = this.createArrayFromArgs.apply(this, args);
            }
        }
        return arr;
    }
    createArrayFromList(param) {
        var arr = new Array(param[0] || 0), i = param[0];
        if (param.length > 1) {
            var args = Array.prototype.slice.call(param, 1);
            while (i--) {
                arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this, args);
            }
        }
        return arr;
    }
    getArrayIndex(array, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === value)
                return i;
            else
                return -1;
        }
        return -1;
    }
    deepCopy(val) {
        var res = JSON.parse(JSON.stringify(val));
        if (typeof structuredClone === "function") {
            res = structuredClone(val);
        }
        return res;
    }
    toPoints2D(pointList) {
        const retList = [];
        for (let point in pointList) {
            retList[point] = new Point2D(pointList[point][0], pointList[point][1]);
        }
        return retList;
    }
    toPoints3D(pointList) {
        const retList = [];
        for (let point in pointList) {
            retList[point] = new Point3D(pointList[point][0], pointList[point][1], pointList[point][2]);
        }
        return retList;
    }
    points2DTo3D(pointList, z_coords, use_z_coords = false) {
        const retList = [];
        var index = 0;
        for (let point of pointList) {
            if (use_z_coords === true) {
                retList.push(new Point3D(point.x, point.y, z_coords[index]));
                index++;
            }
            else
                retList.push(new Point3D(point.x, point.y, 0));
        }
        return retList;
    }
    points3DTo2D(pointList) {
        const retList = [];
        for (let point of pointList) {
            retList.push(new Point2D(point.x, point.y));
        }
        return retList;
    }
    points2DToVec3D(pointList) {
        const retList = [];
        for (let point of pointList) {
            retList.push([point.x, point.y, point.r]);
        }
        return retList;
    }
    points3DToVec3D(pointList) {
        const retList = [];
        for (let point of pointList) {
            retList.push([point.x, point.y, point.z]);
        }
        return retList;
    }
    vecs3DToPoints3D(vecList) {
        const retList = [];
        for (let vec of vecList) {
            retList.push(new Point3D(vec[0], vec[1], vec[2]));
        }
        return retList;
    }
    vecs3DToPoints2D(vecList) {
        const retList = [];
        for (let vec of vecList) {
            retList.push(new Point2D(vec[0], vec[1]));
        }
        return retList;
    }
    vecs4DToPoints3D(vecList) {
        const retList = [];
        for (let vec of vecList) {
            retList.push(new Point3D(vec[0], vec[1], vec[2]));
        }
        return retList;
    }
    vecs4DToPoints2D(vecList) {
        const retList = [];
        for (let vec of vecList) {
            retList.push(new Point2D(vec[0], vec[1]));
        }
        return retList;
    }
    genEdgefromArray(array, sort = true) {
        var prev = array[array.length - 1]; // set previous to last element in the array
        var a = 0;
        var b = 0;
        const result = [];
        for (let index in array) {
            if (sort === true) {
                [a, b] = [Math.min(prev, array[index]), Math.max(prev, array[index])];
            }
            else
                [a, b] = [prev, array[index]];
            result[index] = `${a}-${b}`;
            prev = array[index];
        }
        return result;
    }
    genArray(min, n, diff, decimal) {
        const list = [];
        for (let i = 0; i < n; i++) {
            if (decimal === true)
                list[i] = min + Math.random() * diff;
            else if (decimal === false)
                list[i] = Math.round(min + Math.random() * diff);
        }
        return list;
    }
    generatePointsArray2D(minX = 0, maxX = 100, minY = 0, maxY = 100, n = 10, decimal = false) {
        const _minX = Math.min(minX, maxX);
        const _maxX = Math.max(minX, maxX);
        const _minY = Math.min(minY, maxY);
        const _maxY = Math.max(minY, maxY);
        const diffX = _maxX - _minX;
        const diffY = _maxY - _minY;
        const xlist = this.genArray(_minX, n, diffX, decimal);
        const ylist = this.genArray(_minY, n, diffY, decimal);
        const xylist = [];
        for (let i = 0; i < n; i++) {
            xylist[i] = [xlist[i], ylist[i]];
        }
        return xylist;
    }
    generatePointsArray3D(minX = 0, maxX = 100, minY = 0, maxY = 100, minZ = 0, maxZ = 100, n = 10, decimal = false) {
        const _minX = Math.min(minX, maxX);
        const _maxX = Math.max(minX, maxX);
        const _minY = Math.min(minY, maxY);
        const _maxY = Math.max(minY, maxY);
        const _minZ = Math.min(minZ, maxZ);
        const _maxZ = Math.max(minZ, maxZ);
        const diffX = _maxX - _minX;
        const diffY = _maxY - _minY;
        const diffZ = _maxZ - _minZ;
        const xlist = this.genArray(_minX, n, diffX, decimal);
        const ylist = this.genArray(_minY, n, diffY, decimal);
        const zlist = this.genArray(_minZ, n, diffZ, decimal);
        const xyzlist = [];
        for (let i = 0; i < n; i++) {
            xyzlist[i] = [xlist[i], ylist[i], zlist[i]];
        }
        return xyzlist;
    }
    getRanHex = (size = 1) => [...Array(size)].map((elem) => elem = Math.floor(Math.random() * 16).toString(16)).join("");
    ranHexCol = (num = 100, size = 6, exclude_col = "black") => [...Array(num)].map((elem, index) => elem = index === 0 ? exclude_col : "#" + this.getRanHex(size));
}
const _Miscellanous = new Miscellanous();
class Quarternion {
    theta;
    q_vector;
    q_quarternion;
    q_inv_quarternion;
    constructor() {
        this.q_vector = DEFAULT_PARAMS._Q_VEC;
        this.q_quarternion = DEFAULT_PARAMS._Q_QUART;
        this.q_inv_quarternion = DEFAULT_PARAMS._Q_INV_QUART;
        this.theta = DEFAULT_PARAMS._THETA;
    }
    vector(input_vec) {
        // normalize flag to normalize vector (create a unit vector)
        const [v1, v2, v3] = input_vec;
        const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3, -0.5);
        this.q_vector = [v1 * inv_mag, v2 * inv_mag, v3 * inv_mag];
    }
    q_mag(quart) {
        const [w, x, y, z] = quart;
        return Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2, 0.5);
    }
    quarternion() {
        // quarternion
        const [v1, v2, v3] = this.q_vector;
        const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
        const [w, x, y, z] = [a, v1 * b, v2 * b, v3 * b];
        const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2, -0.5);
        this.q_quarternion = [w * inv_mag, x * inv_mag, y * inv_mag, z * inv_mag];
    }
    ;
    inv_quartenion() {
        // inverse quarternion           
        const [v1, v2, v3] = this.q_vector;
        const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
        const [w, x, y, z] = [a, -v1 * b, -v2 * b, -v3 * b];
        const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2, -0.5);
        this.q_inv_quarternion = [w * inv_mag, x * inv_mag, y * inv_mag, z * inv_mag];
    }
    ;
    q_mult(quart_A, quart_B) {
        // quarternion _ quarternion multiplication
        const [w1, x1, y1, z1] = quart_A;
        const [w2, x2, y2, z2] = quart_B;
        return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2), (w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2), (w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2), (w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
    }
    q_v_invq_mult(input_vec) {
        // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
        // with additional translating (for points) and scaling (for point and vectors) capabilities
        const output_vec = [0, ...input_vec];
        return this.q_mult(this.q_quarternion, this.q_mult(output_vec, this.q_inv_quarternion)).splice(1);
    }
    q_v_q_mult(input_vec) {
        // quarternion _ vector _ quarternion multiplication for point and vector reflection
        // with additional translating (for points) and scaling (for point and vectors) capabilities
        const output_vec = [0, ...input_vec];
        return this.q_mult(this.q_quarternion, this.q_mult(output_vec, this.q_quarternion)).splice(1);
    }
    q_rot(_angle = 0, _vector = [0, 0, 1], _point = [0, 0, 0]) {
        this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
        this.vector(_vector);
        this.quarternion();
        this.inv_quartenion();
        return this.q_v_invq_mult(_point);
    }
    q_ref(_angle = 0, _vector = [0, 0, 1], _point = [0, 0, 0]) {
        this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
        this.vector(_vector);
        this.quarternion();
        return this.q_v_q_mult(_point);
    }
}
class Matrix {
    constructor() { }
    matMult(matA, matB, shapeA, shapeB) {
        if (shapeA[1] !== shapeB[0])
            return [];
        else {
            const matC = [];
            for (let i = 0; i < shapeA[0]; i++) {
                for (let j = 0; j < shapeB[1]; j++) {
                    var sum = 0;
                    for (let k = 0; k < shapeB[0]; k++) {
                        sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                    }
                    matC.push(sum);
                }
            }
            return matC;
        }
    }
    scaMult(scalarVal, matIn, leaveLast = false) {
        const matInlen = matIn.length;
        const matOut = [];
        for (let i = 0; i < matInlen; i++) {
            if (i === matInlen - 1 && leaveLast === true) {
                // Do nothing...don't multiply the last matrix value by the scalar value
                // useful when perspective division is going on.
                matOut.push(matIn[i]);
            }
            else {
                matOut.push(matIn[i] * scalarVal);
            }
        }
        return matOut;
    }
    matAdd(matA, matB, neg = false) {
        const matC = [];
        const matAlen = matA.length;
        const matBlen = matB.length;
        var sgn = 1;
        if (neg === true) {
            sgn = -1;
        }
        if (matAlen === matBlen) {
            for (let i = 0; i < matAlen; i++) {
                matC.push(matA[i] + sgn * matB[i]);
            }
        }
        return matC;
    }
    getTranspMat(matIn, shapeMat) {
        const shpA = shapeMat[0];
        const shpB = shapeMat[1];
        const matOut = [];
        for (let i = 0; i < shpB; i++) {
            for (let j = 0; j < shpA; j++) {
                matOut.push(matIn[(j * shpB) + i]);
            }
        }
        return matOut;
    }
    getIdentMat(val) {
        const num = val ** 2;
        const matOut = [];
        for (let i = 0; i < num; i++) {
            if (i % val === 0) {
                matOut.push(1);
            }
            else
                matOut.push(0);
        }
        return matOut;
    }
    getRestMat(matIn, shapeNum, row, column) {
        const matOut = [];
        for (let i = 0; i < shapeNum; i++) {
            for (let j = 0; j < shapeNum; j++) {
                if (i !== row && j !== column) {
                    matOut.push(matIn[(i * shapeNum) + j]);
                }
            }
        }
        return matOut;
    }
    getDet(matIn, shapeNum) {
        if (shapeNum > 0) {
            // If it is a 1x1 matrix, return the matrix
            if (shapeNum === 1) {
                return matIn;
            }
            // If it is a 2x2 matrix, return the determinant
            if (shapeNum === 2) {
                return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
            }
            // If it an nxn matrix, where n > 2, recursively compute the determinant,
            //using the first row of the matrix
            else {
                var res = 0;
                const tmp = [];
                for (let i = 0; i < shapeNum; i++) {
                    tmp.push(matIn[i]);
                }
                const cofMatSgn = this.getCofSgnMat([1, shapeNum]);
                var a = 0;
                const cofLen = cofMatSgn.length;
                for (let i = 0; i < cofLen; i++) {
                    var ret = this.getRestMat(matIn, shapeNum, a, i);
                    var verify = this.getDet(ret, shapeNum - 1);
                    res += (cofMatSgn[i] * tmp[i] * verify);
                }
                return res;
            }
        }
        else
            return 0;
    }
    getMinorMat(matIn, shapeNum) {
        const matOut = [];
        for (let i = 0; i < shapeNum; i++) {
            for (let j = 0; j < shapeNum; j++) {
                const result = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1);
                matOut.push(result);
            }
        }
        return matOut;
    }
    getCofSgnMat(shapeMat) {
        const shpA = shapeMat[0];
        const shpB = shapeMat[1];
        const matOut = [];
        for (let i = 0; i < shpA; i++) {
            for (let j = 0; j < shpB; j++) {
                if ((i + j) % 2 === 0) {
                    matOut.push(1);
                }
                else
                    matOut.push(-1);
            }
        }
        return matOut;
    }
    getCofMat(matIn, shapeNum) {
        const cofMatSgn = this.getCofSgnMat([shapeNum, shapeNum]);
        const minorMat = this.getMinorMat(matIn, shapeNum);
        const matOut = [];
        const len = shapeNum ** 2;
        for (let i = 0; i < len; i++) {
            matOut.push(cofMatSgn[i] * minorMat[i]);
        }
        return matOut;
    }
    getAdjMat(matIn, shapeNum) {
        const result = this.getCofMat(matIn, shapeNum);
        return this.getTranspMat(result, [shapeNum, shapeNum]);
    }
    getInvMat(matIn, shapeNum) {
        const det_result = this.getDet(matIn, shapeNum);
        if (det_result === 0)
            return undefined;
        const adj_result = this.getAdjMat(matIn, shapeNum);
        return this.scaMult(1 / det_result, adj_result);
    }
}
const _Matrix = new Matrix();
class Vector {
    constructor() { }
    mag(vec) {
        if (typeof vec === "number")
            return vec;
        const v_len = vec.length;
        var magnitude = 0;
        for (let i = 0; i < v_len; i++) {
            magnitude += vec[i] ** 2;
        }
        return Math.sqrt(magnitude);
    }
    normalizeVec(vec) {
        const len = vec.length;
        const magnitude = this.mag(vec);
        const ret_vec = [];
        for (let i = 0; i < len; i++) {
            if (magnitude === 0)
                ret_vec[i] = 0;
            else
                ret_vec[i] = vec[i] / magnitude;
        }
        return ret_vec;
    }
    dotProduct(vecA_or_magA, vecB_or_magB, angle = undefined) {
        // Can be:
        //          1. two vectors without an angle (angle is undefined and vectors are 2d vectors or higher).
        //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
        // Use vectors if you know the components e.g [x,y] values for 2d vectors, [x,y,z] values for 3d vectors and so on.
        // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
        if (typeof angle === "number") { // Magnitude use.
            const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
            return vecA_or_magA * vecB_or_magB * Math.cos(toRad);
        }
        const vec_a_len = vecA_or_magA.length;
        const vec_b_len = vecB_or_magB.length;
        //verify first that both vectors are of the same size and both are 2d or higher.
        if (vec_a_len === vec_b_len && vec_b_len >= 2) {
            var dot_product = 0;
            for (let i = 0; i < vec_a_len; i++) {
                dot_product += vecA_or_magA[i] * vecB_or_magB[i];
            }
            return dot_product;
        }
        return 0;
    }
    getDotProductAngle(vecA, vecB) {
        const dot_product = this.dotProduct(vecA, vecB);
        const cosAng = Math.acos(dot_product / (this.mag(vecA) * this.mag(vecB)));
        return MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * cosAng;
    }
    getCrossProductByMatrix(vecs, vecs_len) {
        var cross_product = [];
        const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
        var matrix_array_top_row = [];
        for (let i = 0; i < proper_vec_len; i++) {
            matrix_array_top_row[i] = 0; // Actually the number 0 is just a placeholder as we don't need any numbers here but we put 0 to make it a number array.
        }
        var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
        // it means that all the vectors are of dimenstion n + 1
        var other_rows_array = [];
        for (let i = 0; i < vecs_len; i++) {
            const vec_len = vecs[i].length;
            if (vec_len !== proper_vec_len)
                same_shape++; // If a vector is not the same dimension with n + 1,
            // increment the same_shape variable to capture this error.
            else
                other_rows_array.push(...vecs[i]); // Else if the vector is the same dimension with n + 1, push the vector to a matrix array.
        }
        if (same_shape === 0) { // All the vectors are the same dimension of n + 1.
            const matrix_array = [...matrix_array_top_row, ...other_rows_array];
            const storeCofSgn = _Matrix.getCofSgnMat([proper_vec_len, 1]);
            for (let i = 0; i < proper_vec_len; i++) {
                const rest_matrix_array = _Matrix.getRestMat(matrix_array, proper_vec_len, 0, i);
                cross_product[i] = storeCofSgn[i] * _Matrix.getDet(rest_matrix_array, vecs_len);
            }
        }
        return cross_product;
    }
    crossProduct(vecs_or_mags, angle = undefined, unitVec = undefined) {
        var cross_product = [];
        const vecs_or_mags_len = vecs_or_mags.length;
        // Can be:
        //          1. two vectors without an angle (angle is undefined and vectors are 3d vectors or higher).
        //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
        // Use vectors if you know the components e.g [x,y,z] values for 3d vectors, [w,x,y,z] values for 4d vectors and so on.
        // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
        if (typeof angle === "undefined") { // Vector use.
            cross_product = [...this.getCrossProductByMatrix(vecs_or_mags, vecs_or_mags_len)];
        }
        if (typeof angle === "number") { // Magnitude use.
            var magnitude = 1; // initial magnitude place holder
            const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
            for (let i = 0; i < vecs_or_mags_len; i++) {
                magnitude *= vecs_or_mags[i];
            }
            if (typeof unitVec === "undefined")
                cross_product = magnitude * Math.sin(toRad);
            else if (typeof unitVec === "object")
                cross_product = _Matrix.scaMult(magnitude * Math.sin(toRad), unitVec);
        }
        return cross_product;
    }
    getCrossProductAngle(vecs) {
        var cross_product_angle = undefined;
        const vecs_len = vecs.length;
        const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
        var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
        // it means that all the vectors are of dimenstion n + 1
        const cross_product_mag = this.mag(this.crossProduct(vecs));
        var vecs_m = 1;
        for (let i = 0; i < vecs_len; i++) {
            const vec_len = vecs[i].length;
            if (vec_len !== proper_vec_len)
                same_shape++; // If a vector is not the same dimension with n + 1,
            // increment the same_shape variable to capture this error.
            else
                vecs_m *= this.mag(vecs[i]);
        }
        if (same_shape === 0) {
            const sinAng = Math.asin(cross_product_mag / vecs_m);
            const fromRad = MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * sinAng;
            cross_product_angle = fromRad;
        }
        return cross_product_angle;
    }
    getCrossPUnitVec(vecs) {
        var cross_product_unit_vec = [];
        const cross_product = this.crossProduct(vecs);
        const cross_product_mag = this.mag(cross_product);
        cross_product_unit_vec = _Matrix.scaMult(1 / cross_product_mag, cross_product);
        return cross_product_unit_vec;
    }
}
const _Vector = new Vector();
class Linear {
    constructor() { }
    getSlope(A_, B_) {
        var numer = B_[1] - A_[1];
        var denum = B_[0] - A_[0];
        return numer / denum;
    }
    getMid(a, b, paramList) {
        var ret = [];
        var count = 0;
        for (let val of paramList) {
            ret.push([(a[val] + b[val]) / 2]);
            count++;
        }
        return ret;
    }
    getDist(a, b, paramList) {
        var ret = 0;
        const pLen = paramList.length;
        for (let val = 0; val < pLen; val++) {
            ret += (a[val] - b[val]) ** 2;
        }
        return Math.sqrt(ret);
    }
    getTriArea(a, b, c) {
        var S = (a + b + c) / 2;
        return Math.sqrt(S * (S - a) * (S - b) * (S - c));
    }
    isInsideCirc(point, circle) {
        const x = Math.abs(point.x - circle[0]);
        const y = Math.abs(point.y - circle[1]);
        const r = circle[2];
        if ((x ** 2 + y ** 2) <= r ** 2) {
            return true;
        }
        else
            return false;
    }
    isInsideTri(pvec, avec, bvec, cvec) {
        const [TotalArea, triA, triB, triC] = this.interpolateTriCore2(pvec, avec, bvec, cvec);
        const sum = triA + triB + triC;
        if (Math.round(sum) === Math.round(TotalArea)) {
            return true;
        }
        return false;
    }
    getCircumCircle(a, b, c) {
        const mid_AB = [(a.x + b.x) / 2, (a.y + b.y) / 2];
        const mid_AC = [(a.x + c.x) / 2, (a.y + c.y) / 2];
        const grad_AB = (b.y - a.y) / (b.x - a.x);
        const grad_AC = (c.y - a.y) / (c.x - a.x);
        const norm_AB = -1 / grad_AB;
        const norm_AC = -1 / grad_AC;
        const intercept_norm_AB = mid_AB[1] - (norm_AB * mid_AB[0]);
        const intercept_norm_AC = mid_AC[1] - (norm_AC * mid_AC[0]);
        var X = 0;
        var Y = 0;
        var compute_X = true;
        var compute_Y = true;
        if (Math.abs(grad_AB) === 0) {
            X = mid_AB[0];
            compute_X = false;
        }
        else if (Math.abs(grad_AB) === Infinity) {
            Y = mid_AB[1];
            compute_Y = false;
        }
        if (Math.abs(grad_AC) === 0) {
            X = mid_AC[0];
            compute_X = false;
        }
        else if (Math.abs(grad_AC) === Infinity) {
            Y = mid_AC[1];
            compute_Y = false;
        }
        if (compute_X === true)
            X = (intercept_norm_AB - intercept_norm_AC) / (norm_AC - norm_AB);
        if (compute_Y === true)
            Y = (norm_AB * X) + intercept_norm_AB;
        const r_squared = (a.x - X) ** 2 + (a.y - Y) ** 2;
        return new Point2D(X, Y, (Math.sqrt(r_squared)));
    }
    getInCircle(a, b, c) {
        const BC = Math.sqrt((c.x - b.x) ** 2 + (c.y - b.y) ** 2);
        const AC = Math.sqrt((c.x - a.x) ** 2 + (c.y - a.y) ** 2);
        const AB = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
        const X = (BC * a.x + AC * b.x + AB * c.x) / (AB + AC + BC);
        const Y = (BC * a.y + AC * b.y + AB * c.y) / (AB + AC + BC);
        const s = (AB + AC + BC) / 2;
        const r_squared = ((s - AB) * (s - AC) * (s - BC)) / s;
        return new Point2D(X, Y, (Math.sqrt(r_squared)));
    }
    findCircTriFSq(rect, angle = 45) {
        var mid = (rect[2] / 2) + rect[0];
        var lSmall = rect[2] / 2;
        var hSmall = Math.tan((angle * Math.PI) / 180) * lSmall;
        var hBig = hSmall + rect[3];
        var lBig = hBig / (Math.tan((angle * Math.PI) / 180));
        var A = new Point2D(mid - lBig, rect[1] + rect[3]);
        var B = new Point2D(mid, rect[1] - hSmall);
        var C = new Point2D(mid + lBig, rect[1] + rect[3]);
        return [A, B, C];
    }
    getTriBoundingRect(vertices) {
        var n = vertices.length;
        var xArr = [0, 0, 0];
        var yArr = [0, 0, 0];
        var xmin = Infinity;
        var ymin = Infinity;
        var xmax = 0;
        var ymax = 0;
        for (let i = 0; i < n; i++) {
            xArr[i] = vertices[i].x;
            yArr[i] = vertices[i].y;
            if (xArr[i] < xmin) {
                xmin = xArr[i];
            }
            if (yArr[i] < ymin) {
                ymin = yArr[i];
            }
            if (xArr[i] > xmax) {
                xmax = xArr[i];
            }
            if (yArr[i] > ymax) {
                ymax = yArr[i];
            }
        }
        return [xmin, ymin, xmax - xmin, ymax - ymin];
    }
    superTriangle(pointList) {
        const rect = this.getTriBoundingRect(pointList);
        const tri = this.findCircTriFSq(rect);
        return tri;
    }
    interpolateTriCore1(pvec, avec, bvec, cvec) {
        const indexList = [0, 1];
        const Adist = this.getDist(bvec, cvec, indexList);
        const Bdist = this.getDist(avec, cvec, indexList);
        const Cdist = this.getDist(avec, bvec, indexList);
        const apdist = this.getDist(pvec, avec, indexList);
        const bpdist = this.getDist(pvec, bvec, indexList);
        const cpdist = this.getDist(pvec, cvec, indexList);
        return [Adist, Bdist, Cdist, apdist, bpdist, cpdist];
    }
    interpolateTriCore2(pvec, avec, bvec, cvec) {
        const [Adist, Bdist, Cdist, apdist, bpdist, cpdist] = this.interpolateTriCore1(pvec, avec, bvec, cvec);
        const TotalArea = this.getTriArea(Adist, Bdist, Cdist);
        const triA = this.getTriArea(Adist, bpdist, cpdist);
        const triB = this.getTriArea(Bdist, apdist, cpdist);
        const triC = this.getTriArea(Cdist, apdist, bpdist);
        return [TotalArea, triA, triB, triC];
    }
    interpolateTriCore3(pvec, avec, bvec, cvec) {
        const [TotalArea, triA, triB, triC] = this.interpolateTriCore2(pvec, avec, bvec, cvec);
        const aRatio = triA / TotalArea;
        const bRatio = triB / TotalArea;
        const cRatio = triC / TotalArea;
        const aPa = _Matrix.scaMult(aRatio, avec);
        const bPb = _Matrix.scaMult(bRatio, bvec);
        const cPc = _Matrix.scaMult(cRatio, cvec);
        return _Matrix.matAdd(_Matrix.matAdd(aPa, bPb), cPc);
    }
    interpolateTri(pvec, avec, bvec, cvec) {
        return this.interpolateTriCore3(pvec, avec, bvec, cvec);
    }
    // Given three collinear points p,q,r, the function checks if
    // point q lies on line segment "pr"
    onSegment(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
            return true;
        return false;
    }
    //To find orientation of ordered triplet (p,q,r),
    //The function returns the following values
    // 0 --> p,q and r are collinear
    // 1 --> Clockwise
    // 2 --> Counterclockwise
    findOrientation(p, q, r) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0)
            return 0; // collinear
        return (val > 0) ? 1 : 2; // clock or counterclock wise
    }
    // if val returned is 0, points are collinear
    // if val returned is greater than 0, points are clockwise
    // if val returned is lesser than 0, points are counterclockwise
    findOrientationDegree(p, q, r) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        return val;
    }
    // The main function that returns true if line segment 'p1q1'
    // and 'p2q2' intersect
    doIntersect(p1, q1, p2, q2) {
        // Find the four orientations needed for general and 
        //special cases
        const o1 = this.findOrientation(p1, q1, p2);
        const o2 = this.findOrientation(p1, q1, q2);
        const o3 = this.findOrientation(p2, q2, p1);
        const o4 = this.findOrientation(p2, q2, q1);
        // General Case
        if (o1 !== o2 && o3 !== o4)
            return true;
        // Special Cases
        // p1,q1 and p2 are collinear and p2 lies on segment p1q1
        if (o1 === 0 && this.onSegment(p1, p2, q1))
            return true;
        // p1,q1 and q2 are collinear and q2 lies on segment p1q1
        if (o2 === 0 && this.onSegment(p1, q2, q1))
            return true;
        // p2,q2 and p1 are collinear and p1 lies on segment p2q2
        if (o3 === 0 && this.onSegment(p2, p1, q2))
            return true;
        // p2,q2 and q1 are collinear and q1 lies on segment p2q2
        if (o4 === 0 && this.onSegment(p2, q1, q2))
            return true;
        return false; // Doesnt't fall in any of the above cases
    }
    lineLineIntersection(p1, q1, p2, q2) {
        // line p1 q1 represented as a1x + b1y = c1
        const a1 = q1.y - p1.y;
        const b1 = p1.x - q1.x;
        const c1 = a1 * (p1.x) + b1 * (p1.y);
        // line p2 q2 represented as a2x + b2y = c2
        const a2 = q2.y - p2.y;
        const b2 = p2.x - q2.x;
        const c2 = a2 * (p2.x) + b2 * (p2.y);
        const determinant = a1 * b2 - a2 * b1;
        if (determinant === 0)
            return null;
        else {
            const x = (b2 * c1 - b1 * c2) / determinant;
            const y = (a1 * c2 - a2 * c1) / determinant;
            return new Point2D(x, y);
        }
    }
    intersectionPoints(p1, q1, p2, q2) {
        // Find the four orientations needed for general and 
        //special cases
        const o1 = this.findOrientation(p1, q1, p2);
        const o2 = this.findOrientation(p1, q1, q2);
        const o3 = this.findOrientation(p2, q2, p1);
        const o4 = this.findOrientation(p2, q2, q1);
        // General Case
        if (o1 !== o2 && o3 !== o4) {
            const intersection = this.lineLineIntersection(p1, q1, p2, q2);
            if (!intersection)
                return null;
            return intersection;
        }
        // Special Cases
        // p1,q1 and p2 are collinear and p2 lies on segment p1q1
        if (o1 === 0 && this.onSegment(p1, p2, q1))
            return p2;
        // p1,q1 and q2 are collinear and q2 lies on segment p1q1
        if (o2 === 0 && this.onSegment(p1, q2, q1))
            return q2;
        // p2,q2 and p1 are collinear and p1 lies on segment p2q2
        if (o3 === 0 && this.onSegment(p2, p1, q2))
            return p1;
        // p2,q2 and q1 are collinear and q1 lies on segment p2q2
        if (o4 === 0 && this.onSegment(p2, q1, q2))
            return q1;
        return null; // Doesnt't fall in any of the above cases
    }
    mostCWPoint(p, q, points) {
        var orientation = 0;
        var index = -1;
        for (let point in points) {
            const res = this.findOrientationDegree(p, q, points[point]);
            if (res > orientation) {
                orientation = res;
                index = Number(point);
            }
        }
        return index;
    }
    mostCCWPoint(p, q, points) {
        var orientation = 0;
        var index = -1;
        for (let point in points) {
            const res = this.findOrientationDegree(p, q, points[point]);
            if (res < orientation) {
                orientation = res;
                index = Number(point);
            }
        }
        return index;
    }
    getSmallestTriArea(p, p_index, q, q_index, points) {
        var area = Infinity;
        var index = -1;
        for (let point_ in points) {
            const point = Number(point_);
            if (point === p_index || point === q_index)
                continue;
            const r = points[point];
            const pq = Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
            const pr = Math.sqrt((p.x - r.x) ** 2 + (p.y - r.y) ** 2);
            const qr = Math.sqrt((q.x - r.x) ** 2 + (q.y - r.y) ** 2);
            const tri_area = this.getTriArea(pq, pr, qr);
            if (tri_area < area) {
                area = tri_area;
                index = point;
            }
        }
        return index;
    }
    get_gradient(p, q) {
        return ((q.y - p.y) / (q.x - p.x));
    }
    get_distance(p, q) {
        return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
    }
    get_midpoint(p, q) {
        return new Point2D((p.x + q.x) * 0.5, (p.y + q.y) * 0.5);
    }
    getLineFromPointGradient(p, gradient, x_scale, invert = false) {
        const intercept = p.y - gradient * p.x;
        const new_x = invert ? p.x - x_scale : p.x + x_scale;
        const new_y = gradient * new_x + intercept;
        return new Point2D(new_x, new_y, 0);
    }
    specialGetLineFromPointGradient(p1, q1, p2, gradient, x_scale) {
        const intercept = p2.y - gradient * p2.x;
        const new_a_x = p2.x + x_scale;
        const new_a_y = gradient * new_a_x + intercept;
        const new_b_x = p2.x - x_scale;
        const new_b_y = gradient * new_b_x + intercept;
        const q2_a = new Point2D(new_a_x, new_a_y);
        const q2_b = new Point2D(new_b_x, new_b_y);
        const q2 = this.doIntersect(p1, q1, p2, q2_a) ? q2_a : q2_b;
        return q2;
    }
    lineSegmentIntersectsPlane(start, end, plane_normal, plane_point) {
        const direction = _Matrix.matAdd(end, start, true);
        const dotProduct = _Vector.dotProduct(direction, plane_normal);
        if (Math.abs(dotProduct) < MODIFIED_PARAMS._EPSILON)
            return null; // line segment is almost or exactly parallel to the plane
        const t = ((plane_point[0] - start[0]) * plane_normal[0] +
            (plane_point[1] - start[1]) * plane_normal[1] +
            (plane_point[2] - start[2]) * plane_normal[2]) / dotProduct;
        return t >= 0 && t <= 1;
    }
    getPlaneNormal(a, b, c) {
        const vec_1 = _Matrix.matAdd(b, a, true);
        const vec_2 = _Matrix.matAdd(c, a, true);
        const normal = _Vector.crossProduct([vec_1, vec_2]);
        _Vector.crossProduct([vec_1, vec_2]);
        if (Math.abs(normal[0]) < MODIFIED_PARAMS._EPSILON && Math.abs(normal[1]) < MODIFIED_PARAMS._EPSILON && Math.abs(normal[2]) < MODIFIED_PARAMS._EPSILON)
            return null; // points on plane are almost or exactly collinear
        return normal;
    }
}
const _Linear = new Linear();
class ViewSpace {
    constructor() { }
    homoVec(arr, type = "point") {
        const res = [...arr];
        if (type === "vector")
            res[3] = 0;
        if (type === "point")
            res[3] = 1;
        return res;
    }
    revHomoVec(arr) {
        return [...arr].splice(0, 3);
    }
    NDCToCanvas(arr) {
        const array = [...arr];
        array[0] = (array[0] * MODIFIED_PARAMS._HALF_X) + MODIFIED_PARAMS._HALF_X;
        array[1] = (array[1] * -MODIFIED_PARAMS._HALF_Y) + MODIFIED_PARAMS._HALF_Y;
        return array;
    }
    canvasToNDC(arr) {
        const array = [...arr];
        array[0] = (array[0] - MODIFIED_PARAMS._HALF_X) / MODIFIED_PARAMS._HALF_X;
        array[1] = (array[1] - MODIFIED_PARAMS._HALF_X) / -MODIFIED_PARAMS._HALF_Y;
        return array;
    }
}
const _ViewSpace = new ViewSpace();
class Clip {
    constructor() { }
    clip(object_vertices) {
        const half_edges = object_vertices.object.mesh.HalfEdgeDict;
        const [t, b, r, l] = [1, -1, 1, -1];
        const is_bounding_box_contained = this.checkBoundingBox(object_vertices, [t, b, r, l]);
        if (!is_bounding_box_contained)
            return null;
        for (const half_edge in half_edges) {
            const [_a, _b] = half_edge.split("-");
            const twin_half_edge = _b + "-" + _a;
            const point_a = object_vertices.vertices[Number(_a)];
            const point_b = object_vertices.vertices[Number(_b)];
            const is_window_contained = this.isLineSegmentInsideWindow(point_a, point_b, [t, b, r, l]);
            delete object_vertices.object.mesh.HalfEdgeDict[twin_half_edge];
            if (!is_window_contained) {
                delete object_vertices.object.mesh.HalfEdgeDict[half_edge];
            }
        }
        return object_vertices;
    }
    checkBoundingBox(object_vertices, [t, b, r, l]) {
        const [n, f] = [MODIFIED_PARAMS._MIN_Z, MODIFIED_PARAMS._MAX_Z];
        const min_x = object_vertices.vertices[object_vertices.object.indices["minXIndex"]];
        const max_x = object_vertices.vertices[object_vertices.object.indices["maxXIndex"]];
        const min_y = object_vertices.vertices[object_vertices.object.indices["minYIndex"]];
        const max_y = object_vertices.vertices[object_vertices.object.indices["maxYIndex"]];
        const min_z = object_vertices.vertices[object_vertices.object.indices["minZIndex"]];
        const max_z = object_vertices.vertices[object_vertices.object.indices["maxZIndex"]];
        if (min_x[0] < l && max_x[0] < l || min_x[0] > r && max_x[0] > r)
            return false;
        if (min_y[1] < b && max_y[1] < b || min_y[1] > t && max_y[1] > t)
            return false;
        if (min_z[2] < n && max_z[2] < n || min_z[2] > f && max_z[2] > f)
            return false;
        return true;
    }
    isLineSegmentInsideWindow(start, end, [t, b, r, l]) {
        if (start[2] < MODIFIED_PARAMS._MIN_Z && end[2] < MODIFIED_PARAMS._MIN_Z || start[2] > MODIFIED_PARAMS._MAX_Z && end[2] > MODIFIED_PARAMS._MAX_Z)
            return false; // check n and f planes
        if (start[1] < b && end[1] < b || start[1] > t && end[1] > t)
            return false; // check t and b planes
        if (start[0] < l && end[0] < l || start[0] > r && end[0] > r)
            return false; // check l and r planes
        else
            return true;
    }
}
const _Clip = new Clip();
class Projection {
    constructor() { }
    changeNearZ(val) {
        MODIFIED_PARAMS._NZ = val;
        this.setProjectionParam();
    }
    changeFarZ(val) {
        MODIFIED_PARAMS._FZ = val;
        this.setProjectionParam();
    }
    changeProjAngle(vert, hori) {
        MODIFIED_PARAMS._VERT_PROJ_ANGLE = vert;
        MODIFIED_PARAMS._HORI_PROJ_ANGLE = hori;
        this.setProjectionParam();
    }
    setProjectionParam() {
        const camera_index = _CAMERA.camera_objects_dict.object_dict[_CAMERA.current_camera_instance].index;
        const projection_type = _CAMERA.camera_objects_list[camera_index].instance._PROJ_TYPE;
        if (projection_type === "Orthographic")
            this.orthographicProjection();
        else if (projection_type === "Perspective")
            this.perspectiveProjection();
        else
            return;
        const inverse_res = _Matrix.getInvMat(MODIFIED_PARAMS._PROJECTION_MAT, 4);
        if (typeof inverse_res === "undefined")
            return;
        if (inverse_res.length !== 16)
            return;
        MODIFIED_PARAMS._INV_PROJECTION_MAT = inverse_res;
    }
    orthographicProjection() {
        const a_v = MODIFIED_PARAMS._VERT_PROJ_ANGLE * MODIFIED_PARAMS._ANGLE_CONSTANT;
        const a_h = MODIFIED_PARAMS._HORI_PROJ_ANGLE * MODIFIED_PARAMS._ANGLE_CONSTANT;
        const [n, f] = [MODIFIED_PARAMS._NZ, MODIFIED_PARAMS._FZ];
        const t = f * Math.tan(a_v / 2);
        const b = -t;
        const r = f * Math.tan(a_h / 2) * MODIFIED_PARAMS._ASPECT_RATIO;
        const l = -r;
        MODIFIED_PARAMS._T_B_R_L = [t, b, r, l];
        MODIFIED_PARAMS._PROJECTION_MAT = [2 / (r - l), 0, 0, 0, 0, 2 / (t - b), 0, 0, 0, 0, -2 / (f - n), 0, -(r + l) / (r - l), -(t + b) / (t - b), -(f + n) / (f - n), 1];
    }
    perspectiveProjection() {
        const a_v = MODIFIED_PARAMS._VERT_PROJ_ANGLE * MODIFIED_PARAMS._ANGLE_CONSTANT;
        const a_h = MODIFIED_PARAMS._HORI_PROJ_ANGLE * MODIFIED_PARAMS._ANGLE_CONSTANT;
        const [n, f] = [MODIFIED_PARAMS._NZ, MODIFIED_PARAMS._FZ];
        const t = n * Math.tan(a_v / 2);
        const b = -t;
        const r = n * Math.tan(a_h / 2) * MODIFIED_PARAMS._ASPECT_RATIO;
        const l = -r;
        MODIFIED_PARAMS._T_B_R_L = [t / n * f, b / n * f, r / n * f, l / n * f];
        MODIFIED_PARAMS._PROJECTION_MAT = [2 * n / (r - l), 0, 0, 0, 0, 2 * n / (t - b), 0, 0, (r + l) / (r - l), (t + b) / (t - b), -(f + n) / (f - n), -1, 0, 0, -2 * f * n / (f - n), 0];
    }
    project(input_array) {
        return _Matrix.matMult(input_array, MODIFIED_PARAMS._PROJECTION_MAT, [1, 4], [4, 4]);
    }
    invProject(input_array) {
        return _Matrix.matMult(input_array, MODIFIED_PARAMS._INV_PROJECTION_MAT, [1, 4], [4, 4]);
    }
}
class CameraObject extends Quarternion {
    instance = {
        history_id: 0,
        time_id: 0,
        instance_number: 0,
        _LOOK_AT_POINT: [0, 0, 0],
        _U: [1, 0, 0],
        _V: [0, 1, 0],
        _N: [0, 0, 1],
        _C: [0, 0, 0],
        _PROJ_TYPE: MODIFIED_PARAMS._PROJ_TYPE,
        _MATRIX: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        _INV_MATRIX: [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1],
        theta: 0,
        q_vector: [0, 1, 0],
        q_quarternion: [1, 0, 0, 0],
        q_inv_quarternion: [1, 0, 0, 0],
    };
    depthBuffer;
    frameBuffer;
    cam_history;
    prev_h;
    next_h;
    selected;
    delete;
    projection;
    icon;
    blank;
    constructor(instance_number) {
        super();
        this.instance.instance_number = instance_number;
        this.cam_history = [];
        this.prev_h = false;
        this.next_h = false;
        this.selected = false;
        this.delete = null;
        this.projection = null;
        this.icon = null;
        this.blank = false;
        this.initializeBuffers();
        this.setCameraPos_nonIncremental([0, 10, -400]);
        return this;
    }
    initializeBuffers() {
        this.depthBuffer = _Miscellanous.initDepthBuffer();
        this.frameBuffer = _Miscellanous.initFrameBuffer();
    }
    resetBuffers() {
        _Miscellanous.resetDepthBuffer(this.depthBuffer);
        _Miscellanous.resetFrameBuffer(this.frameBuffer);
    }
    prevHistory() {
        const id = this.instance.history_id;
        if (id === 0)
            return;
        const required_id = id - 1;
        this.instance = structuredClone(this.cam_history[required_id]);
    }
    nextHistory() {
        const id = this.instance.history_id;
        if (id === this.cam_history.length - 1)
            return;
        const required_id = id + 1;
        this.instance = structuredClone(this.cam_history[required_id]);
    }
    addHistory() {
        const time = new Date().getTime();
        const id = this.cam_history.length;
        this.instance.history_id = id;
        this.instance.time_id = time;
        this.cam_history.push(structuredClone(this.instance));
        if (id > 0)
            this.prev_h = true;
        this.next_h = false;
    }
    goToHistory(id) {
        this.instance = structuredClone(this.cam_history[id]);
        if (id === 0)
            this.prev_h = false;
        else
            this.prev_h = true;
        if (id === this.cam_history.length - 1)
            this.next_h = false;
        else
            this.next_h = true;
    }
    deleteRightWardHistories(id) {
        this.cam_history.splice(id + 1);
    }
    changeProjType(projection_type) {
        this.instance._PROJ_TYPE = projection_type;
    }
    isInBetween(a, b, c) {
        const dist_ac = Math.abs(a[2] - c[2]);
        const dist_ab = Math.abs(a[2] - b[2]);
        const dist_bc = Math.abs(b[2] - c[2]);
        return dist_ac >= dist_ab && dist_ac >= dist_bc;
    }
    setConversionMatrices() {
        // camera coordinate system is always left handed but world may be right or left handed
        // negate the forward (N) vector in right handed world coordinate systems
        const sgn = MODIFIED_PARAMS._HANDEDNESS;
        const neg_N = _Matrix.scaMult(-1, this.instance._N);
        this.instance._MATRIX = [...this.instance._U, sgn * this.instance._C[0], ...this.instance._V, sgn * this.instance._C[1], ...neg_N, sgn * this.instance._C[2], ...[0, 0, 0, 1]];
        this.instance._INV_MATRIX = _Matrix.getInvMat(this.instance._MATRIX, 4);
        this.instance.theta = this.theta;
        this.instance.q_vector = this.q_vector;
        this.instance.q_quarternion = this.q_quarternion;
        this.instance.q_inv_quarternion = this.q_inv_quarternion;
        this.addHistory();
    }
    getQuartenions(start, end) {
        const angle = _Vector.getDotProductAngle(start, end);
        if (!Number.isFinite(angle))
            return false;
        const check = Math.abs(angle / 90) % 1;
        if (check > 0.05 && check < 0.95) {
            const cross_product = _Vector.crossProduct([start, end]);
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
            this.vector(cross_product);
            this.quarternion();
            this.inv_quartenion();
            return true;
        }
        return false;
    }
    applyQuartenions(got_quart, normal) {
        if (got_quart) {
            this.instance._U = this.q_v_invq_mult(this.instance._U);
            this.instance._V = this.q_v_invq_mult(this.instance._V);
            this.instance._N = this.q_v_invq_mult(this.instance._N);
        }
        else {
            this.instance._N = normal;
            this.instance._U = _Vector.normalizeVec(_Vector.crossProduct([this.instance._V, this.instance._N]));
            this.instance._V = _Vector.normalizeVec(_Vector.crossProduct([this.instance._N, this.instance._U]));
        }
    }
    translateHelper() {
        const DIFF = _Matrix.matAdd(this.instance._LOOK_AT_POINT, this.instance._C, true);
        if (_Vector.mag(DIFF) === 0)
            DIFF[2] = 1;
        const NORMAL = _Vector.normalizeVec(DIFF);
        const got_quarternions = this.getQuartenions(this.instance._N, NORMAL);
        this.applyQuartenions(got_quarternions, NORMAL);
        this.setConversionMatrices();
    }
    setLookAtPos_nonIncremental(look_at_point) {
        this.instance._LOOK_AT_POINT = look_at_point;
        this.translateHelper();
    }
    setCameraPos_nonIncremental(translation_array) {
        this.instance._C = translation_array;
        this.translateHelper();
    }
    setAxisX() { }
    setAxisY() { }
    setAxisZ() { }
    rotateCamera_incremental(axis, angle) {
        const DIFF = _Matrix.matAdd(this.instance._LOOK_AT_POINT, this.instance._C, true);
        const NEW_DIFF = this.q_rot(angle, axis, DIFF);
        this.instance._LOOK_AT_POINT = _Matrix.matAdd(this.instance._C, NEW_DIFF);
        this.instance._U = this.q_rot(angle, axis, this.instance._U);
        this.instance._V = this.q_rot(angle, axis, this.instance._V);
        this.instance._N = this.q_rot(angle, axis, this.instance._N);
        this.setConversionMatrices();
    }
    revolveCamera_incremental(axis, angle) {
        const DIFF = _Matrix.matAdd(this.instance._LOOK_AT_POINT, this.instance._C, true);
        const NEW_DIFF = this.q_rot(angle, axis, DIFF);
        this.instance._C = _Matrix.matAdd(this.instance._LOOK_AT_POINT, NEW_DIFF, true);
        this.instance._U = this.q_rot(angle, axis, this.instance._U);
        this.instance._V = this.q_rot(angle, axis, this.instance._V);
        this.instance._N = this.q_rot(angle, axis, this.instance._N);
        this.setConversionMatrices();
    }
    translateObject_incremental(translation_array) {
        this.instance._C = _Matrix.matAdd(this.instance._C, translation_array);
        this.translateHelper();
    }
    worldToCamera(arr) {
        const toHomoVec = _ViewSpace.homoVec(arr);
        const camSpace = _Matrix.matMult(this.instance._MATRIX, toHomoVec, [4, 4], [4, 1]);
        return camSpace;
    }
    cameraToWorld(arr) {
        const camSpace = _Matrix.matMult(this.instance._INV_MATRIX, arr, [4, 4], [4, 1]);
        const fromHomoVec = _ViewSpace.revHomoVec(camSpace);
        return fromHomoVec;
    }
}
class NDCSpace {
    constructor() { }
    project(arr, projection_type) {
        if (projection_type === "Orthographic")
            return _Matrix.matMult(arr, MODIFIED_PARAMS._PROJECTION_MAT, [1, 4], [4, 4]);
        else if (projection_type === "Perspective") {
            const proj = _Matrix.matMult(arr, MODIFIED_PARAMS._PROJECTION_MAT, [1, 4], [4, 4]);
            return _Matrix.scaMult(1 / proj[3], proj, true);
        }
        return arr;
    }
    unProject(arr, projection_type) {
        if (projection_type === "Orthographic")
            return _Matrix.matMult(arr, MODIFIED_PARAMS._INV_PROJECTION_MAT, [1, 4], [4, 4]);
        else if (projection_type === "Perspective") {
            const rev_proj_div = _Matrix.scaMult(arr[3], arr, true);
            return _Matrix.matMult(rev_proj_div, MODIFIED_PARAMS._INV_PROJECTION_MAT, [1, 4], [4, 4]);
            ;
        }
        return arr;
    }
}
const _NDCSpace = new NDCSpace();
class CameraObjects extends ViewSpace {
    camera_objects_dict;
    camera_objects_list;
    current_camera_instance;
    max_camera_instance;
    constructor() {
        super();
        this.current_camera_instance = 0;
        this.max_camera_instance = 0;
        this.camera_objects_dict = new ObjectHelper();
        this.camera_objects_list = [];
        this.createNewCameraObject();
    }
    changeCurrentInstanceNumber(instance_number) {
        if (instance_number in this.camera_objects_dict.object_dict)
            this.current_camera_instance = instance_number;
    }
    changeProjType(projection_type) {
        const index = this.camera_objects_dict.object_dict[this.current_camera_instance].index;
        const _camera = this.camera_objects_list[Number(index)];
        _camera.changeProjType(projection_type);
        MODIFIED_PARAMS._PROJ_TYPE = projection_type;
    }
    createNewCameraObject() {
        this.current_camera_instance = this.camera_objects_dict.instance;
        this.max_camera_instance = this.camera_objects_dict.instance;
        this.camera_objects_list.push(new CameraObject(this.current_camera_instance));
        this.camera_objects_dict.updateObjectDict();
    }
    createNewMultipleCameraObjects = (num) => { if (num > 0)
        while (num > 0) {
            this.createNewCameraObject();
            num--;
        } };
    deleteCameraObjectHelper(instance_number_input) {
        const index = this.camera_objects_dict.object_dict[instance_number_input].index;
        this.camera_objects_list.splice(index, 1);
        this.camera_objects_dict.deleteObjectInstance(instance_number_input);
        for (const index in this.camera_objects_list) {
            const _camera = this.camera_objects_list[index];
            const instance = _camera.instance.instance_number;
        }
        if (instance_number_input === this.current_camera_instance)
            this.current_camera_instance = Number(Object.keys(this.camera_objects_dict.object_dict)[0]);
    }
    // won't delete if there is only one camera object left
    deleteCameraObject(instance_number_input) {
        if (Object.keys(this.camera_objects_dict.object_dict).length === 1)
            return;
        if (instance_number_input <= this.max_camera_instance) {
            this.deleteCameraObjectHelper(instance_number_input);
        }
    }
    // doesn't delete the first camera object
    deleteAllCameraObjects() {
        for (const key in this.camera_objects_dict.object_dict) {
            this.deleteCameraObject(Number(key));
        }
    }
    render(vertex) {
        const current_camera_index = this.camera_objects_dict.object_dict[this.current_camera_instance].index;
        const current_camera = this.camera_objects_list[current_camera_index];
        const world_to_camera_space = current_camera.worldToCamera(vertex);
        const proj_div = _NDCSpace.project(world_to_camera_space, current_camera.instance._PROJ_TYPE);
        return proj_div;
    }
}
/*
Projection and CameraObjects classes are initiated in the app.ts/app.js file and used through this program as a single long-lived instance by composition;
Other classes in this file are used by inheritance or by composition (multiple mostly short-lived instances)

*/
