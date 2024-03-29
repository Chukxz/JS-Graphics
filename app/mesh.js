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
        for (const point of points) {
            if (minX > point.x)
                minX = point.x;
            if (maxX < point.x)
                maxX = point.x;
            if (minY > point.y)
                minY = point.y;
            if (maxY < point.y)
                maxY = point.y;
            if (minZ > point.z)
                minZ = point.z;
            if (maxZ < point.z)
                maxZ = point.z;
        }
        return [minX, maxX, minY, maxY, minZ, maxZ];
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
                const [xmin, xmax, ymin, ymax, zmin, zmax] = this.getMinMax(face_points);
                const average_point = new Point3D((xmin + xmax) * 0.5, (ymin + ymax) * 0.5, (zmin + zmax) * 0.5);
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
class CreateObject {
    width;
    height;
    depth;
    points_list;
    mesh;
    _is_degenerate_;
    vert_st;
    shape;
    constructor(width, height, depth, start_vertex) {
        this.points_list = [];
        this.mesh = new MeshDataStructure();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this._is_degenerate_ = false;
        this.vert_st = start_vertex;
        this.shape = "Generic";
    }
    reconstructMesh() { }
    initMesh() { }
    ;
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
    calculatePoints() { }
    editDimensions() { }
}
class CreatePoint extends CreateObject {
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
class CreateLine extends CreateObject {
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
class CreatePolygon extends CreateObject {
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
class CreateRectangle extends CreateObject {
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
class CreatePyramidalBase extends CreateObject {
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
    }
    editDimensions(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        this.base_class.modifyDimensions(width, height, depth);
        this.points_list = [];
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
            const permutations = misc.getPermutationsArr(proposed_half_edge.split("-").map(value => Number(value)), 3);
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
class CreatePrismBases extends CreateObject {
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
    }
    editDimensions(width = this.width, height = this.height, depth = this.depth) {
        this.modifyDimensions(width, height, depth);
        this.base_class_1.modifyDimensions(width, -height, depth);
        this.base_class_2.modifyDimensions(width, height, depth);
        this.points_list = [];
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
class CreateCuboid extends CreateObject {
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
class CreateSphere extends CreateObject {
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
class CreateTorus extends CreateObject {
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
class CatmullClark {
    points_list;
    mesh;
    face_points;
    edge_points;
    done_edges_dict;
    mesh_faces_len;
    tmp_faces;
    constructor(object) {
        this.points_list = object.points_list;
        this.mesh = object.mesh;
        this.face_points = [];
        this.edge_points = [];
        this.done_edges_dict = {};
        this.mesh_faces_len = 0;
        this.mesh.sorted_faces = [];
        this.tmp_faces = new Set();
    }
    getEdgePoints(edge) {
        return edge.split("-").map(value => this.points_list[Number(value)]);
    }
    getFacePoints(face) {
        return face.split("-").map(value => this.points_list[Number(value)]);
    }
    getPoints(array) {
        return array.map(value => this.points_list[value]);
    }
    insertVertexInHalfEdge(vertex, edge, face_index, consider_prev_next = true) {
        const [a, b] = edge.split("-").map(value => Number(value));
        const twin = `${b}-${a}`;
        const halfEdgeKey_1 = this.mesh.setHalfEdge(a, vertex, face_index);
        const halfEdgeKey_2 = this.mesh.setHalfEdge(vertex, b, face_index);
        if (consider_prev_next === true) {
            const prev = this.mesh.HalfEdgeDict[edge].prev;
            const next = this.mesh.HalfEdgeDict[edge].next;
            this.mesh.HalfEdgeDict[halfEdgeKey_1].prev = prev;
            this.mesh.HalfEdgeDict[halfEdgeKey_2].next = next;
            if (prev !== "-")
                this.mesh.HalfEdgeDict[prev].next = halfEdgeKey_1;
            if (next !== "-")
                this.mesh.HalfEdgeDict[next].prev = halfEdgeKey_2;
        }
        if (!this.mesh.HalfEdgeDict[twin])
            this.mesh.edge_no--;
        delete this.mesh.HalfEdgeDict[edge];
        return [halfEdgeKey_1, halfEdgeKey_2];
    }
    iterate(iteration_num = 1, orig_iter = iteration_num + 1) {
        if (iteration_num <= 0)
            return;
        this.tmp_faces = new Set([...this.mesh.faces]);
        this.mesh.faces.clear();
        // const overall_start = new Date().getTime();
        // console.log(`Iteration Number : ${orig_iter - iteration_num}`);
        // console.log(`Mesh faces difference : ${this.mesh_faces_len}`);
        // console.log(`Points List Length : ${this.points_list.length}`);
        // console.log(`Object Faces Length : ${this.tmp_faces.size}`);
        // console.log(`Object Edges Length : ${Object.keys(this.mesh.HalfEdgeDict).length / 2}`);
        iteration_num--;
        // const start = new Date().getTime();
        const fast_edge_list = this.mesh.edgeToNumber();
        // const end = new Date().getTime();
        // console.log(`Time taken to get fast edge list : ${end - start} ms`)
        // let _a_ = new Date().getTime()
        const mesh_halfedgedict_copy = JSON.parse(JSON.stringify(this.mesh.HalfEdgeDict));
        // let _b_ = new Date().getTime()
        // console.log(`Time taken to copy mesh : ${_b_ - _a_} ms`);
        // const face_start = new Date().getTime()
        for (const face of this.tmp_faces) {
            const face_points = this.getFacePoints(face);
            const sum = this.mesh.sumPoints(face_points);
            const len = face_points.length;
            const face_point = new Point3D(sum.x / len, sum.y / len, sum.z / len);
            this.face_points.push(face_point);
        }
        // const face_end = new Date().getTime()
        // console.log(`Time taken for face iteration : ${face_end - face_start} ms`)
        // const edge_start = new Date().getTime()
        for (const edge in mesh_halfedgedict_copy) {
            const edge_vertices_full = [];
            const [a, b] = edge.split("-");
            const twinHalfEdgeKey = b + "-" + a;
            const edge_face_index = mesh_halfedgedict_copy[edge].face_index - this.mesh_faces_len;
            const f_p_a = this.face_points[edge_face_index];
            const twin_edge_face_index = mesh_halfedgedict_copy[twinHalfEdgeKey].face_index - this.mesh_faces_len;
            const f_p_b = this.face_points[twin_edge_face_index];
            edge_vertices_full.push(this.points_list[Number(a)], this.points_list[Number(b)], f_p_a, f_p_b);
            const sum = this.mesh.sumPoints(edge_vertices_full);
            const edge_point = new Point3D(sum.x / 4, sum.y / 4, sum.z / 4);
            const edge_index = this.edge_points.push(edge_point) - 1 + this.face_points.length + this.points_list.length;
            if (mesh_halfedgedict_copy[twinHalfEdgeKey])
                delete mesh_halfedgedict_copy[twinHalfEdgeKey]; // we don't need the twin halfedges again in the mesh halfedge dict copy
            this.done_edges_dict[edge] = edge_index;
            this.done_edges_dict[twinHalfEdgeKey] = edge_index;
        }
        // const edge_end = new Date().getTime()
        // console.log(`Time taken for edge iteration : ${edge_end - edge_start} ms`)
        // const point_start = new Date().getTime()
        // var FofV = 0;
        // var EofV = 0;
        // var EDofV = 0;
        // var FDofV = 0;
        for (const point_index in this.points_list) {
            const P = this.points_list[point_index];
            const F_list = [];
            const R_list = [];
            var n_f = 0;
            var n_e = 0;
            // const EofV_start = new Date().getTime();
            const edge_list = this.mesh.getEdgesOfVertexFast(Number(point_index), fast_edge_list);
            const EofV_end = new Date().getTime();
            // EofV += EofV_end - EofV_start;
            // const EDofV_start = new Date().getTime();
            edge_list.map(value => {
                const edge_vertices = value.split("-").map(value => this.points_list[Number(value)]);
                const sum = this.mesh.sumPoints(edge_vertices);
                const edge_midpoint = new Point3D(sum.x / 2, sum.y / 2, sum.z / 2);
                R_list.push(edge_midpoint);
                n_e++;
            });
            // const EDofV_end = new Date().getTime();
            // EDofV += EDofV_end - EDofV_start;
            // const FofV_start = new Date().getTime()
            const face_index_list = this.mesh.getFaceIndexesOfVertexSpecific(edge_list);
            // const FofV_end = new Date().getTime();
            // FofV += FofV_end - FofV_start;
            // const FDofV_start = new Date().getTime();
            face_index_list.map(value => {
                const face_point = this.face_points[value - this.mesh_faces_len];
                F_list.push(face_point);
                n_f++;
            });
            // const FDofV_end = new Date().getTime();
            // FDofV += FDofV_end - FDofV_start;
            const n = (n_f + n_e) / 2;
            const f_sum = this.mesh.sumPoints(F_list);
            const r_sum = this.mesh.sumPoints(R_list);
            const F = new Point3D(f_sum.x / n, f_sum.y / n, f_sum.z / n);
            const R = new Point3D(r_sum.x / n, r_sum.y / n, r_sum.z / n);
            const X = (F.x + 2 * R.x + (n - 3) * P.x) / n;
            const Y = (F.y + 2 * R.y + (n - 3) * P.y) / n;
            const Z = (F.z + 2 * R.z + (n - 3) * P.z) / n;
            this.points_list[point_index] = new Point3D(X, Y, Z);
        }
        // const point_end = new Date().getTime()
        // console.log(`Current Mesh Multiplier value : ${this.mesh.multiplier}`)
        // console.log(`Time taken to get edges of vertex : ${EofV} ms`)
        // console.log(`Time taken to get edge points of edges of vertex : ${EDofV} ms`)
        // console.log(`Time taken to get faces of edges of vertex : ${FofV} ms`)
        // console.log(`Time taken to get face points of faces of edges of vertex : ${EDofV} ms`)
        // console.log(`Time taken for point iteration : ${point_end - point_start} ms`)
        const p_len = this.points_list.length;
        this.mesh_faces_len += this.tmp_faces.size;
        this.points_list.push(...this.face_points, ...this.edge_points);
        // const face_index_start = new Date().getTime();
        for (const face of this.tmp_faces) {
            const face_list_index = this.mesh.getFaceIndexOfFace(face);
            const face_edges = this.mesh.getEdgesOfFace(face.split("-").map(value => Number(value)));
            const boundary = [];
            for (const face_edge_index in face_edges) {
                const face_edge = face_edges[face_edge_index];
                const index = this.done_edges_dict[face_edge];
                const halfEdgeKeys = this.insertVertexInHalfEdge(index, face_edge, -1, false);
                boundary.push(...halfEdgeKeys);
            }
            const b_len = boundary.length;
            const iter_num = b_len * 0.5;
            let edge_index = 0;
            while (edge_index < iter_num) {
                const [a, b] = boundary[((Number(edge_index) * 2) + 1) % b_len].split("-").map(value => Number(value)); // shift the edge index
                const [c, d] = boundary[((Number(edge_index) * 2) + 2) % b_len].split("-").map(value => Number(value)); // shift the edge index
                const third_edge = this.mesh.setHalfEdge(d, p_len + Number(face_list_index));
                const fourth_edge = this.mesh.setHalfEdge(p_len + Number(face_list_index), a);
                this.mesh.HalfEdgeDict[`${a}-${b}`].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                this.mesh.HalfEdgeDict[`${c}-${d}`].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                this.mesh.HalfEdgeDict[third_edge].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                this.mesh.HalfEdgeDict[fourth_edge].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                const face_index_beta = this.mesh.faces.add(`${a}-${b}-${d}-${p_len + Number(face_list_index)}`).size - 1 + this.mesh_faces_len;
                this.mesh.HalfEdgeDict[`${a}-${b}`].face_index = face_index_beta;
                this.mesh.HalfEdgeDict[`${c}-${d}`].face_index = face_index_beta;
                this.mesh.HalfEdgeDict[third_edge].face_index = face_index_beta;
                this.mesh.HalfEdgeDict[fourth_edge].face_index = face_index_beta;
                this.mesh.face_index_map.set(face_index_beta, [a, b, d, p_len + Number(face_list_index)].join("-"));
                this.mesh.HalfEdgeDict[`${a}-${b}`].prev = fourth_edge;
                this.mesh.HalfEdgeDict[`${c}-${d}`].prev = `${a}-${b}`;
                this.mesh.HalfEdgeDict[third_edge].prev = `${c}-${d}`;
                this.mesh.HalfEdgeDict[fourth_edge].prev = third_edge;
                this.mesh.HalfEdgeDict[`${a}-${b}`].next = `${c}-${d}`;
                this.mesh.HalfEdgeDict[`${c}-${d}`].next = third_edge;
                this.mesh.HalfEdgeDict[third_edge].next = fourth_edge;
                this.mesh.HalfEdgeDict[fourth_edge].next = `${a}-${b}`;
                this.mesh.face_indexes_set.add(face_index_beta);
                this.mesh.maxFaceIndex();
                edge_index++;
            }
            this.mesh.face_indexes_set.delete(-1);
        }
        // const face_index_end = new Date().getTime()
        // console.log(`Time taken for face iteration to get boundary : ${face_index_end - face_index_start} ms`)
        this.tmp_faces.clear();
        this.face_points = [];
        this.edge_points = [];
        this.done_edges_dict = {};
        // const overall_end = new Date().getTime();
        // console.log(`Total time taken : ${overall_end - overall_start} ms`)
        // console.log("\n\n");
        this.iterate(iteration_num, orig_iter);
    }
    triangulate() {
        this.mesh.triangulate(this.points_list);
    }
    display() {
        return { points: this.points_list, mesh: this.mesh };
    }
}
