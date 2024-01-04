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
    class Miscellanous {
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
    }
    class BinarySearch {
        recursive(elem, arr, min, max) {
            if (min > max)
                return -1;
            else {
                let mid = Math.floor((min + max) / 2);
                if (this.satisfies() === 0)
                    return mid;
                else if (this.satisfies() === -1)
                    return this.recursive(elem, arr, min, mid - 1);
                else
                    return this.recursive(elem, arr, mid + 1, max);
            }
        }
        iterative(arr) {
            let min = 0;
            let max = arr.length - 1;
            while (min <= max) {
                let mid = Math.floor((min + max) / 2);
                if (this.satisfies() === 0)
                    return mid;
                else if (this.satisfies() === -1)
                    max = mid - 1;
                else
                    min = mid + 1;
            }
            return -1;
        }
    }
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
        constructor(vertex_num = 0) {
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
            this.deleted_halfedges_dict = {};
            this.face_indexes_set = new Set();
            this.max_face_index = 0;
        }
        maxFaceIndex() {
            const test = Math.max(...[...this.face_indexes_set]);
            if (test !== Infinity && test !== -Infinity && test > this.max_face_index)
                this.max_face_index = test;
        }
        halfEdge(start, end, face_index) {
            this.vertex_indexes.add(start);
            this.vertex_indexes.add(end);
            this.vertex_no = [...this.vertex_indexes].length;
            const comp = Math.max(start, end);
            this.face_indexes_set.add(face_index);
            this.maxFaceIndex();
            if (this.multiplier % comp === this.multiplier)
                this.multiplier *= 10;
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
        addHalfEdge(edge, face_vertices = this.face_indexes_tmp) {
            if (typeof edge === "string")
                edge = edge.split("-").map((value) => Number(value));
            const halfEdgeKey = this.setHalfEdge(...edge);
            this.HalfEdgeDict[halfEdgeKey].face_vertices = face_vertices;
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
                console.log(`Alpha\tprev : ${alpha_prev}\nBeta\tnext : ${beta_next}`);
                console.log(`Beta\tprev : ${beta_prev}\nAlpha\tnext : ${alpha_next}`);
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
                const faces_of_edge = this.getFacesofDeletedEdge(edge);
                const alpha_edges = this.getEdgesofFacethatExists(faces_of_edge[0]);
                const beta_edges = this.getEdgesofFacethatExists(faces_of_edge[1]);
                console.log(`Faces of deleted edge :`);
                console.log(faces_of_edge);
                console.log(alpha_edges.length, "+++++++++", beta_edges.length);
                console.log("Alpha edges : ", alpha_edges, "\nBeta edges :", beta_edges);
                if (alpha_edges.length > 2 && beta_edges.length > 2) {
                    const f_index = this.faces.indexOf(faces_of_edge[0].join("-"));
                    if (f_index >= 0)
                        this.faces.splice(f_index, 1);
                    const s_index = this.faces.indexOf(faces_of_edge[1].join("-"));
                    if (s_index >= 0)
                        this.faces.splice(s_index, 1);
                    const new_face_vertices = this.mergeDeletedFaces(faces_of_edge, edge);
                    const new_face_index = this.max_face_index + 1;
                    const first_face_index = this.deleted_halfedges_dict[edge].face_index;
                    const second_face_index = this.deleted_halfedges_dict[twinHalfEdgeKey].face_index;
                    this.face_indexes_set.add(new_face_index);
                    this.face_indexes_set.delete(first_face_index);
                    this.face_indexes_set.delete(second_face_index);
                    this.maxFaceIndex();
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
                    this.faces.push(new_face_vertices.join('-'));
                }
                if (alpha_edges.length <= 2) {
                    for (const edge of alpha_edges)
                        if (this.HalfEdgeDict[edge]) {
                            this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                            this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                        }
                    this.maxFaceIndex();
                    const index = this.faces.indexOf(faces_of_edge[0].join("-"));
                    if (index >= 0) {
                        this.faces.splice(index, 1);
                    }
                }
                if (beta_edges.length <= 2) {
                    for (const edge of beta_edges)
                        if (this.HalfEdgeDict[edge]) {
                            this.HalfEdgeDict[edge].face_vertices = this.HalfEdgeDict[edge].vertices;
                            this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                        }
                    this.maxFaceIndex();
                    const index = this.faces.indexOf(faces_of_edge[1].join("-"));
                    if (index >= 0) {
                        this.faces.splice(index, 1);
                    }
                }
                // special case
                if (alpha_edges.length === 2 && beta_edges.length === 2) {
                    const test_alpha_edges = alpha_edges.join("-");
                    const test_beta_edges = beta_edges.join("-");
                    if (test_alpha_edges.includes(a) && test_alpha_edges.includes(b) && test_beta_edges.includes(a) && test_beta_edges.includes(b)) {
                        const new_face_vertices = this.mergeDeletedFaces(faces_of_edge, edge);
                        console.log(new_face_vertices);
                        const new_face_index = this.max_face_index + 1;
                        console.log(new_face_index);
                        console.log(this.max_face_index);
                        const first_face_index = this.deleted_halfedges_dict[edge].face_index;
                        const second_face_index = this.deleted_halfedges_dict[twinHalfEdgeKey].face_index;
                        this.face_indexes_set.add(new_face_index);
                        this.face_indexes_set.delete(first_face_index);
                        this.face_indexes_set.delete(second_face_index);
                        console.log(first_face_index, "*********", second_face_index);
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
                        this.faces.push(new_face_vertices.join('-'));
                    }
                }
                if (this.faces.length === 2) {
                    const face_alpha = this.modifyMergedFace(this.faces[0].split("-").map((value) => Number(value)));
                    const face_beta = this.modifyMergedFace(this.faces[1].split("-").map((value) => Number(value)).reverse());
                    console.log(face_alpha.join("-") === face_beta.join("-"));
                    if (face_alpha.join("-") === face_beta.join("-")) {
                        for (const edge of this.getEdgesofFace(face_beta)) {
                            this.face_indexes_set.delete(this.HalfEdgeDict[edge].face_index);
                            this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
                            delete this.HalfEdgeDict[edge];
                        }
                        this.maxFaceIndex();
                        const index = this.faces.indexOf(face_beta.join("-"));
                        if (index >= 0) {
                            this.faces.splice(index, 1);
                        }
                    }
                }
            }
            // if vertex a belongs to only one edge remove it
            if (this.getEdgesOfVertexFast(Number(a), edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(a));
            }
            // if vertex b belongs to only one edge remove it
            if (this.getEdgesOfVertexFast(Number(b), edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(b));
            }
            delete this.HalfEdgeDict[edge]; // delete the halfedge
            this.vertex_no = [...this.vertex_indexes].length; // update vertex number
            if (!this.HalfEdgeDict[twinHalfEdgeKey])
                this.edge_no--; // decrease edge number if the twin does not exist
            return true; // halfedge was successfully deleted
        }
        mergeDeletedFaces(faces, edge) {
            const alpha_face = this.prepareDeletedFaces(faces[0], edge);
            const beta_face = this.prepareDeletedFaces(faces[1], edge);
            const [a, b] = edge.split("-").map((value) => Number(value));
            if (alpha_face.join("-") === beta_face.join("-")) {
                const a_index = alpha_face.indexOf(a);
                const b_index = beta_face.indexOf(b);
                const min_index = Math.min(a_index, b_index);
                alpha_face.splice(min_index, 2);
                console.log(alpha_face);
                return this.modifyMergedFace(alpha_face);
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
            const [a, b] = edge.split("-").map((value) => Number(value));
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
            if (!prepped) {
                remainder = [...edge_num_list, ...remainder];
            }
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
        addVertex(vertex, vertex_or_face_or_edge) {
            if (typeof vertex_or_face_or_edge === "string")
                vertex_or_face_or_edge = vertex_or_face_or_edge.split("-").map((value) => Number(value));
            if (vertex_or_face_or_edge.length === 1)
                return this.addHalfEdge(`${vertex}-${vertex_or_face_or_edge[0]}`);
            if (vertex_or_face_or_edge.length >= 2)
                for (const val of vertex_or_face_or_edge)
                    return this.addHalfEdge(`${vertex}-${val}`);
            return `${vertex}`; // is not supposed to happen
        }
        removeVertex(vertex) {
            let count = 0;
            for (const edge in this.HalfEdgeDict) {
                if (edge.split("-").includes(`${vertex}`)) {
                    const [a, b] = edge.split("-");
                    const twinHalfEdgeKey = `${b}-${a}`;
                    this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
                    delete (this.HalfEdgeDict[edge]);
                    this.deleted_halfedges_dict[twinHalfEdgeKey] = this.HalfEdgeDict[twinHalfEdgeKey];
                    delete (this.HalfEdgeDict[twinHalfEdgeKey]);
                    this.vertex_indexes.delete(Number(vertex));
                    this.vertex_no = [...this.vertex_indexes].length;
                    this.edge_no--;
                    count++;
                }
            }
            return count;
        }
        getEdgesOfVertexFast(vertex, edge_num_list) {
            const edge_list = [];
            edge_num_list.map((value) => {
                const min = value % this.multiplier;
                const max = (value - min) / this.multiplier;
                if (vertex === min || vertex === max)
                    edge_list.push(`${min}-${max}`);
            });
            return edge_list;
        }
        getEdgesofVertex(vertex, no_half_edge = false) {
            const edge_list = [];
            for (const edge in this.HalfEdgeDict) {
                const [a, b] = edge.split("-");
                var rev = b + "-" + a;
                if (no_half_edge === true)
                    if (edge_list.includes(rev))
                        continue;
                if (edge_list.includes(edge))
                    continue;
                // edge touches vertex and is not in the edge_list
                if (edge.split("-").includes(`${vertex}`))
                    edge_list.push(edge);
            }
            return edge_list;
        }
        getFacesofVertexSpecific(edge_list) {
            const face_list = [];
            const faces = [];
            for (const edge of edge_list) {
                const face = this.HalfEdgeDict[edge].face_vertices;
                if (!face_list.includes(face.join("-"))) {
                    face_list.push(face.join("-"));
                    faces.push(face);
                }
            }
            return faces;
        }
        getFaceIndexesofVertexSpecific(edge_list) {
            const face_indexes = new Set();
            for (const edge of edge_list) {
                const face_index = this.HalfEdgeDict[edge].face_index;
                face_indexes.add(face_index);
            }
            return [...face_indexes];
        }
        getFacesofVertexGeneric(vertex) {
            const edge_list = this.getEdgesofVertex(vertex);
            return this.getFacesofVertexSpecific(edge_list);
        }
        addEdge(edge) {
            if (typeof edge === "string")
                edge = edge.split("-").map((value) => Number(value));
            this.setHalfEdge(...edge);
            this.setHalfEdge(edge[1], edge[0]);
            return edge;
        }
        removeEdge(edge) {
            if (typeof edge === "object")
                edge = edge.join("-");
            const [a, b] = edge.split("-");
            const remove_thf = this.removeHalfEdge(b + "-" + a);
            const remove_hf = this.removeHalfEdge(edge);
            return remove_hf || remove_thf;
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
        //             this.removeEdge(edge);
        //         }
        //     }
        //     return res_h.bool || res_t_h.bool;
        // }
        processMergeEdges(a_1, b_1, a_2, b_2) {
            let test = -1;
            // Check if both halfEdges or their twin halfedges exist
            if (((cube.mesh.HalfEdgeDict[a_1 + "-" + b_1]) || (cube.mesh.HalfEdgeDict[b_1 + "-" + a_1])) &&
                ((cube.mesh.HalfEdgeDict[a_2 + "-" + b_2]) || (cube.mesh.HalfEdgeDict[b_2 + "-" + a_2]))) {
                const halfEdgeKey_union = [a_1, b_1, a_2, b_2];
                const halfEdgeKey_unique_union = [...new Set(halfEdgeKey_union)];
                if (halfEdgeKey_unique_union.length <= 2)
                    return test;
                // get the common vertex of the adjacent edges
                for (const index in halfEdgeKey_union) {
                    const val = halfEdgeKey_union[index];
                    if (Number(index) === halfEdgeKey_unique_union.length) {
                        test = val;
                        break;
                    }
                    const cmp_val = halfEdgeKey_unique_union[index];
                    if (val !== cmp_val) {
                        test = val;
                        break;
                    }
                }
                return test;
            }
            return test;
        }
        mergeEdges(edge_1, edge_2) {
            if (typeof edge_1 === "object")
                edge_1 = edge_1.join("-");
            const [a_1, b_1] = edge_1.split("-").map((value) => Number(value));
            if (typeof edge_2 === "object")
                edge_2 = edge_2.join("-");
            const [a_2, b_2] = edge_2.split("-").map((value) => Number(value));
            const common_vertex = this.processMergeEdges(a_1, b_1, a_2, b_2);
            if (common_vertex < 0)
                return false;
            else {
            }
        }
        edgeReverse(edge) {
            if (typeof edge === "object")
                edge = edge.join("-");
            const [a, b] = edge.split("-");
            return `${b}-${a}`;
        }
        getVerticesofEdge(edge) {
            if (typeof edge === "string")
                return edge.split("-").map((value) => Number(value));
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
        getFacesofEdge(edge) {
            if (typeof edge === "object")
                edge = edge.join("-");
            const twinHalfEdgeKey = this.HalfEdgeDict[edge].twin;
            return [this.getFacesOfHalfEdge(edge), this.getFacesOfHalfEdge(twinHalfEdgeKey)];
        }
        getFacesofDeletedHalfEdge(halfEdge) {
            if (this.deleted_halfedges_dict[halfEdge]) {
                return this.deleted_halfedges_dict[halfEdge].face_vertices;
            }
            else
                return [];
        }
        getFacesofDeletedEdge(edge) {
            if (typeof edge === "object")
                edge = edge.join("-");
            const twinHalfEdgeKey = this.deleted_halfedges_dict[edge].twin;
            return [this.getFacesofDeletedHalfEdge(edge), this.getFacesofDeletedHalfEdge(twinHalfEdgeKey)];
        }
        edgeToNumber() {
            const edge_num_set = new Set();
            for (const edge in this.HalfEdgeDict) {
                const [a, b] = edge.split("-").map((value) => Number(value));
                const [min, max] = [Math.min(a, b), Math.max(a, b)];
                edge_num_set.add(max * this.multiplier + min);
            }
            return [...edge_num_set];
        }
        addFace(face) {
            this.face_vertices_tmp = face.split("-").map((value) => Number(value));
            const sorted_face = [...this.face_vertices_tmp].sort((a, b) => a - b).join("-");
            // If face is not found in faces add face to faces and set its halfedges
            if (!this.faces.includes(face) && this.face_vertices_tmp.length > 2 && !this.sorted_faces.includes(sorted_face)) {
                this.faces.push(face);
                this.sorted_faces.push(sorted_face);
                const first_index = this.face_vertices_tmp[0];
                const second_index = this.face_vertices_tmp[1];
                const last_index = this.face_vertices_tmp[this.face_vertices_tmp.length - 1];
                for (let p in this.face_vertices_tmp) {
                    const index = Number(p);
                    const i = this.face_vertices_tmp[p];
                    const j = this.face_vertices_tmp[(index + 1) % this.face_vertices_tmp.length];
                    const halfEdgeKey = this.setHalfEdge(i, j, this.faces.length - 1);
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
            let found_edges = 0;
            const face_vertices = face.split("-").map((value) => Number(value));
            const sorted_face = [...face_vertices].sort((a, b) => a - b).join("-");
            const face_len = face.length;
            var face_index = -1;
            // Check if face is found in faces, if yes remove it
            if (this.faces.includes(face)) {
                // iterate through the edges until an edge's face marching the face is found
                for (const edge in this.HalfEdgeDict) {
                    // Check if the edge's vertices marches the face's vertices
                    if (this.HalfEdgeDict[edge].face_vertices.join("-") === face_vertices.join("-")) {
                        let old_halfEdgeKey = edge;
                        face_index = this.HalfEdgeDict[old_halfEdgeKey].face_index;
                        let new_halfEdgeKey = this.HalfEdgeDict[old_halfEdgeKey].next;
                        // remove the halfedge later (we are postponing the removal of the original halfedge here)
                        found_edges++;
                        // Try to crawl with next until the found edges tally with the face's length
                        while (found_edges < face_len) {
                            // If the next halfedge is non-existent break the while loop
                            if (new_halfEdgeKey === "-") {
                                new_halfEdgeKey = edge;
                                break;
                            }
                            old_halfEdgeKey = new_halfEdgeKey;
                            new_halfEdgeKey = this.HalfEdgeDict[old_halfEdgeKey].next; // update the halfedge
                            this.removeHalfEdge(old_halfEdgeKey); // remove the halfedge non-iteratively
                            found_edges++;
                        }
                        // If the found edges do not yet tally try to crawl with previous until the found edges tally with the face's length
                        while (found_edges < face_len) {
                            if (new_halfEdgeKey === "-")
                                break; // If the previous halfedge is non-existent break the while loop
                            old_halfEdgeKey = new_halfEdgeKey;
                            new_halfEdgeKey = this.HalfEdgeDict[old_halfEdgeKey].prev; // update the halfedge
                            this.removeHalfEdge(old_halfEdgeKey); // remove the halfedge non-iteratively
                            found_edges++;
                        }
                        // If the found edges don't yet still tally with the face's length at this point we leave it like that and proceed to remove the original halfedge that we postponed
                        this.removeHalfEdge(edge); // remove the halfedge
                        this.faces[face_index] = "";
                        this.sorted_faces[face_index] = "";
                        return true; // face removed successfully
                    }
                }
            }
            return false; // face not removed
        }
        getVerticesofFace(face) {
            return face;
        }
        getEdgesofFace(face) {
            return face.map((value, index) => `${value}-${face[(index + 1) % face.length]}`);
        }
        getEdgesofFacethatExists(face) {
            const potential_edges = this.getEdgesofFace(face);
            const existing_edges = [];
            for (const edge of potential_edges) {
                if (edge in this.HalfEdgeDict && !(edge in this.deleted_halfedges_dict))
                    existing_edges.push(edge);
            }
            return existing_edges;
        }
        splitFace() { }
        mergeface() { }
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
        triangulate(points_list) {
            const start = new Date().getTime();
            const triangulated_points_list = [];
            triangulated_points_list.push(...points_list);
            const new_mesh = new MeshDataStructure();
            for (const face of this.faces) {
                const vertex_indexes = face.split("-").map((value) => Number(value));
                const face_edges = this.getEdgesofFace(vertex_indexes);
                const vertices = vertex_indexes.map((value) => { return points_list[value]; });
                const [x_min, x_max, y_min, y_max, z_min, z_max] = this.getMinMax(vertices);
                const avg_point = new Point3D((x_min + x_max) / 2, (y_min + y_max) / 2, (z_min + z_max) / 2);
                const avg_point_index = triangulated_points_list.push(avg_point) - 1;
                new_mesh.addFace(vertex_indexes.join("-"));
                new_mesh.faces.pop();
                for (const edge of face_edges) {
                    const [a, b] = edge.split("-");
                    const prev = `${avg_point_index}-${a}`;
                    const next = `${b}-${avg_point_index}`;
                    const new_vertex_indexes = [avg_point_index, Number(a), Number(b)];
                    new_mesh.setHalfEdge(avg_point_index, Number(a));
                    new_mesh.setHalfEdge(Number(b), avg_point_index);
                    new_mesh.HalfEdgeDict[prev].face_vertices = new_vertex_indexes;
                    new_mesh.HalfEdgeDict[next].face_vertices = new_vertex_indexes;
                    new_mesh.HalfEdgeDict[edge].face_vertices = new_vertex_indexes;
                    new_mesh.HalfEdgeDict[prev].prev = next;
                    new_mesh.HalfEdgeDict[prev].next = edge;
                    new_mesh.HalfEdgeDict[edge].prev = prev;
                    new_mesh.HalfEdgeDict[edge].next = next;
                    new_mesh.HalfEdgeDict[next].prev = edge;
                    new_mesh.HalfEdgeDict[next].next = prev;
                    new_mesh.faces.push(`${avg_point_index}-${a}-${b}`);
                }
            }
            const end = new Date().getTime();
            console.log(`Time taken to triangulate : ${end - start} ms`);
            return { "points": triangulated_points_list, mesh: new_mesh };
        }
    }
    class CreateObject {
        width;
        height;
        depth;
        points_list;
        mesh;
        constructor() {
            this.points_list = [];
            this.mesh = new MeshDataStructure();
        }
        changePoint(index, new_x, new_y, new_z) {
            this.points_list[index] = new Point3D(new_x, new_y, new_z);
        }
    }
    class CreateBox extends CreateObject {
        default_faces;
        constructor(width = 100, height = 100, depth = 100) {
            super();
            this.points_list = [];
            this.width = width / 2;
            this.height = height / 2;
            this.depth = depth / 2;
            this.default_faces = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 3, 7, 4], [1, 5, 6, 2], [2, 6, 7, 3], [0, 4, 5, 1]]; // standard default mesh configuration
            console.log(this.default_faces);
            for (const face of this.default_faces)
                this.mesh.addFace(face.join("-"));
            this.calculatePoints();
        }
        editDimensions(width, height, depth) {
            this.points_list = [];
            this.width = width / 2;
            this.height = height / 2;
            this.depth = depth / 2;
            this.calculatePoints();
        }
        calculatePoints() {
            //-~(-((0+num)%2)*2) ouputs -1 if num = 0, else 1 if num = 1
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
                        if (index === 0 || index === 3 || index === 4 || index === 7)
                            sgn_i = -1;
                        else
                            sgn_i = 1;
                        this.points_list[index] = new Point3D(sgn_i * this.width, sgn_j * this.height, sgn_k * this.depth);
                    }
                }
            }
        }
    }
    class CreatePyramidalBase extends CreateObject {
        base_length;
        base_half_edges;
        base_face;
        constructor(base_length, width, height, depth) {
            super();
            this.width = width / 2;
            this.height = height / 2;
            this.depth = depth / 2;
            this.base_half_edges = [];
            this.base_face = [];
            this.base_length = base_length;
            for (let i = 0; i < base_length; i++) {
                this.base_half_edges.push(`${i + 1}-${(i + 1) % base_length + 1}`);
                this.base_face.push(i + 1);
            }
        }
        calculatePoints() {
            const angle_inc = 360 / this.base_length;
            this.points_list[0] = new Point3D(0, this.height, 0);
            for (let i = 0; i < this.base_length; i++) {
                const cur_ang = i * angle_inc;
                const conv = Math.PI / 180;
                this.points_list[i + 1] = new Point3D(Math.cos((cur_ang + 90) * conv) * this.width, -this.height, Math.sin((cur_ang + 90) * conv) * this.depth);
            }
        }
    }
    class CreatePyramid extends CreatePyramidalBase {
        half_edges;
        faces;
        last;
        penultimate;
        primary;
        constructor(base_length = 3, width = 100, height = 100, depth = 100) {
            super(base_length, width, height, depth);
            this.half_edges = [];
            this.faces = [];
            this.mesh = new MeshDataStructure();
            this.half_edges.push(...this.base_half_edges);
            this.faces.push(this.base_face);
            for (let i = 0; i < base_length; i++) {
                const proposed_half_edge = `${0}-${this.half_edges[i]}`;
                const permutations = misc.getPermutationsArr(proposed_half_edge.split("-").map((value) => Number(value)), 3);
                this.setMesh(permutations);
            }
            console.log(this.faces);
            for (const face of this.faces)
                this.mesh.addFace(face.join("-"));
            this.calculatePoints();
        }
        setMesh(permutations) {
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
        editDimensions(width, height, depth) {
            this.points_list = [];
            this.width = width / 2;
            this.height = height / 2;
            this.depth = depth / 2;
            this.calculatePoints();
        }
    }
    class CatmullClark {
        points_list;
        mesh;
        face_points;
        edge_points;
        done_edges_dict;
        mesh_faces_len;
        constructor(object) {
            this.points_list = object.points_list;
            this.mesh = object.mesh;
            this.face_points = [];
            this.edge_points = [];
            this.done_edges_dict = {};
            this.mesh_faces_len = 0;
        }
        getEdgePoints(edge) {
            return edge.split("-").map((value) => this.points_list[Number(value)]);
        }
        getFacePoints(face) {
            return face.split("-").map((value) => this.points_list[Number(value)]);
        }
        getPoints(array) {
            return array.map((value) => this.points_list[value]);
        }
        insertVertexInHalfEdge(vertex, edge, consider_prev_next = true) {
            const [a, b] = edge.split("-").map((value) => Number(value));
            const twin = `${b}-${a}`;
            const face_index = this.mesh.HalfEdgeDict[edge].face_index;
            const prev = this.mesh.HalfEdgeDict[edge].prev;
            const next = this.mesh.HalfEdgeDict[edge].next;
            const halfEdgeKey_1 = this.mesh.setHalfEdge(a, vertex, face_index);
            const halfEdgeKey_2 = this.mesh.setHalfEdge(vertex, b, face_index);
            if (consider_prev_next === true) {
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
            const overall_start = new Date().getTime();
            console.log(`Iteration Number : ${orig_iter - iteration_num}`);
            console.log(`Mesh faces difference : ${this.mesh_faces_len}`);
            console.log(`Points List Length : ${this.points_list.length}`);
            console.log(`Object Faces Length : ${this.mesh.faces.length - this.mesh_faces_len}`);
            console.log(`Object Edges Length : ${Object.keys(this.mesh.HalfEdgeDict).length / 2}`);
            iteration_num--;
            const start = new Date().getTime();
            const fast_edge_list = this.mesh.edgeToNumber();
            const end = new Date().getTime();
            console.log(`Time taken to get fast edge list : ${end - start} ms`);
            let _a_ = new Date().getTime();
            const mesh_halfedgedict_copy = JSON.parse(JSON.stringify(this.mesh.HalfEdgeDict));
            let _b_ = new Date().getTime();
            console.log(`Time taken to copy mesh : ${_b_ - _a_} ms`);
            const face_start = new Date().getTime();
            for (const face of this.mesh.faces) {
                if (face !== "") {
                    const face_points = this.getFacePoints(face);
                    const sum = this.mesh.sumPoints(face_points);
                    const len = face_points.length;
                    const face_point = new Point3D(sum.x / len, sum.y / len, sum.z / len);
                    this.face_points.push(face_point);
                }
            }
            const face_end = new Date().getTime();
            console.log(`Time taken for face iteration : ${face_end - face_start} ms`);
            const edge_start = new Date().getTime();
            for (const edge in mesh_halfedgedict_copy) {
                const edge_vertices_full = [];
                const [a, b] = edge.split("-");
                const twinHalfEdgeKey = `${b}-${a}`;
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
            const edge_end = new Date().getTime();
            console.log(`Time taken for edge iteration : ${edge_end - edge_start} ms`);
            const point_start = new Date().getTime();
            var FofV = 0;
            var EofV = 0;
            var EDofV = 0;
            var FDofV = 0;
            for (const point_index in this.points_list) {
                const P = this.points_list[point_index];
                const F_list = [];
                const R_list = [];
                var n_f = 0;
                var n_e = 0;
                const EofV_start = new Date().getTime();
                const edge_list = this.mesh.getEdgesOfVertexFast(Number(point_index), fast_edge_list);
                const EofV_end = new Date().getTime();
                EofV += EofV_end - EofV_start;
                const EDofV_start = new Date().getTime();
                edge_list.map((value) => {
                    const edge_vertices = value.split("-").map((value) => this.points_list[Number(value)]);
                    const sum = this.mesh.sumPoints(edge_vertices);
                    const edge_midpoint = new Point3D(sum.x / 2, sum.y / 2, sum.z / 2);
                    R_list.push(edge_midpoint);
                    n_e++;
                });
                const EDofV_end = new Date().getTime();
                EDofV += EDofV_end - EDofV_start;
                const FofV_start = new Date().getTime();
                const face_list = this.mesh.getFaceIndexesofVertexSpecific(edge_list);
                const FofV_end = new Date().getTime();
                FofV += FofV_end - FofV_start;
                const FDofV_start = new Date().getTime();
                face_list.map((value) => {
                    const face_point = this.face_points[value - this.mesh_faces_len];
                    F_list.push(face_point);
                    n_f++;
                });
                const FDofV_end = new Date().getTime();
                FDofV += FDofV_end - FDofV_start;
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
            const point_end = new Date().getTime();
            console.log(`Current Mesh Multiplier value : ${this.mesh.multiplier}`);
            console.log(`Time taken to get edges of vertex : ${EofV} ms`);
            console.log(`Time taken to get edge points of edges of vertex : ${EDofV} ms`);
            console.log(`Time taken to get faces of edges of vertex : ${FofV} ms`);
            console.log(`Time taken to get face points of faces of edges of vertex : ${EDofV} ms`);
            console.log(`Time taken for point iteration : ${point_end - point_start} ms`);
            const p_len = this.points_list.length;
            this.mesh_faces_len += this.mesh.faces.length - this.mesh_faces_len;
            this.points_list.push(...this.face_points, ...this.edge_points);
            const face_index_start = new Date().getTime();
            for (const face_list_index in this.mesh.faces) {
                const face = this.mesh.faces[face_list_index];
                if (face !== "") {
                    const face_edges = this.mesh.getEdgesofFace(face.split("-").map((value) => Number(value)));
                    const boundary = [];
                    for (const face_edge_index in face_edges) {
                        const face_edge = face_edges[face_edge_index];
                        const index = this.done_edges_dict[face_edge];
                        const halfEdgeKeys = this.insertVertexInHalfEdge(index, face_edge, false);
                        boundary.push(...halfEdgeKeys);
                    }
                    const iter_num = boundary.length * 0.5;
                    let edge_index = 0;
                    while (edge_index < iter_num) {
                        const [a, b] = boundary[(Number(edge_index) * 2 + 1) % boundary.length].split("-").map((value) => Number(value)); // shift the edge index
                        const [c, d] = boundary[(Number(edge_index) * 2 + 2) % boundary.length].split("-").map((value) => Number(value)); // shift the edge index
                        const third_edge = this.mesh.setHalfEdge(d, p_len + Number(face_list_index));
                        const fourth_edge = this.mesh.setHalfEdge(p_len + Number(face_list_index), a);
                        this.mesh.HalfEdgeDict[`${a}-${b}`].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                        this.mesh.HalfEdgeDict[`${c}-${d}`].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                        this.mesh.HalfEdgeDict[third_edge].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                        this.mesh.HalfEdgeDict[fourth_edge].face_vertices = [a, b, d, p_len + Number(face_list_index)];
                        const face_index_beta = this.mesh.faces.push(`${a}-${b}-${d}-${p_len + Number(face_list_index)}`) - 1;
                        this.mesh.HalfEdgeDict[`${a}-${b}`].face_index = face_index_beta;
                        this.mesh.HalfEdgeDict[`${c}-${d}`].face_index = face_index_beta;
                        this.mesh.HalfEdgeDict[third_edge].face_index = face_index_beta;
                        this.mesh.HalfEdgeDict[fourth_edge].face_index = face_index_beta;
                        this.mesh.HalfEdgeDict[`${a}-${b}`].prev = fourth_edge;
                        this.mesh.HalfEdgeDict[`${c}-${d}`].prev = `${a}-${b}`;
                        this.mesh.HalfEdgeDict[third_edge].prev = `${c}-${d}`;
                        this.mesh.HalfEdgeDict[fourth_edge].prev = third_edge;
                        this.mesh.HalfEdgeDict[`${a}-${b}`].next = `${c}-${d}`;
                        this.mesh.HalfEdgeDict[`${c}-${d}`].next = third_edge;
                        this.mesh.HalfEdgeDict[third_edge].next = fourth_edge;
                        this.mesh.HalfEdgeDict[fourth_edge].next = `${a}-${b}`;
                        edge_index++;
                    }
                    this.mesh.faces[face_list_index] = "";
                }
            }
            const face_index_end = new Date().getTime();
            console.log(`Time taken for face iteration to get boundary : ${face_index_end - face_index_start} ms`);
            //this.mesh.faces.splice(0, mesh_faces_len);
            this.face_points = [];
            this.edge_points = [];
            const overall_end = new Date().getTime();
            console.log(`Total time taken : ${overall_end - overall_start} ms`);
            console.log("\n\n");
            this.iterate(iteration_num, orig_iter);
        }
        triangulate() {
            return this.mesh.triangulate(this.points_list);
        }
        display() {
            return { points: this.points_list, mesh: this.mesh };
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
    const misc = new Miscellanous();
    const pyramid = new CreatePyramid();
    const cube = new CreateBox();
    // console.log(pyramid.mesh.HalfEdgeDict)
    // console.log(pyramid.mesh.faces)
    // console.log(pyramid.mesh.vertex_indexes)
    // console.log(`Face indexes : ${[...pyramid.mesh.face_indexes_set]}`)
    // console.log("\n\n\n\n")
    // pyramid.mesh.removeEdge("3-1")
    // pyramid.mesh.removeEdge("2-0")
    // console.log(pyramid.mesh.HalfEdgeDict)
    // console.log(pyramid.mesh.faces)
    // console.log(pyramid.mesh.vertex_indexes)
    // console.log(`Face indexes : ${[...pyramid.mesh.face_indexes_set]}`)
    // console.log(cube.mesh.HalfEdgeDict)
    // console.log(cube.mesh.faces)
    // console.log(cube.mesh.vertex_indexes)
    // console.log(`Face indexes : ${[...cube.mesh.face_indexes_set]}`)
    // console.log("\n\n\n\n")
    // cube.mesh.removeEdge("1-2");
    // // cube.mesh.removeEdge("3-2");
    // cube.mesh.removeEdge("4-7");
    // cube.mesh.removeEdge("3-0");
    // console.log(cube.mesh.HalfEdgeDict)
    // console.log(cube.mesh.faces)
    // console.log(cube.mesh.vertex_indexes)
    // console.log(`Face indexes : ${[...cube.mesh.face_indexes_set]}`)
    function processMergeEdges(a_1, b_1, a_2, b_2) {
        let test = -1;
        // Check if both halfEdges or their twin halfedges exist
        if (((cube.mesh.HalfEdgeDict[a_1 + "-" + b_1]) || (cube.mesh.HalfEdgeDict[b_1 + "-" + a_1])) &&
            ((cube.mesh.HalfEdgeDict[a_2 + "-" + b_2]) || (cube.mesh.HalfEdgeDict[b_2 + "-" + a_2]))) {
            const halfEdgeKey_union = [a_1, b_1, a_2, b_2];
            const halfEdgeKey_unique_union = [...new Set(halfEdgeKey_union)];
            if (halfEdgeKey_unique_union.length <= 2)
                return test;
            // get the common vertex of the adjacent edges
            for (const index in halfEdgeKey_union) {
                const val = halfEdgeKey_union[index];
                if (Number(index) === halfEdgeKey_unique_union.length) {
                    test = val;
                    break;
                }
                const cmp_val = halfEdgeKey_unique_union[index];
                if (val !== cmp_val) {
                    test = val;
                    break;
                }
            }
            return test;
        }
        return test;
    }
    console.log(processMergeEdges(2, 1, 1, 5));
    // console.log("PYRAMID : ")
    // const pyramid_catmull_clark = new CatmullClark(pyramid);
    // pyramid_catmull_clark.iterate(6);
    // console.log("\n\n\n\n\n\n")
    // console.log("CUBE : ")
    // const cube_catmull_clark = new CatmullClark(cube);
    // cube_catmull_clark.iterate(6);
    // console.log(cube.mesh)
    // cube.mesh.removeHalfEdge("0-1")
    // console.log("Egde to number : ")
    // const e_s = new Date().getTime();
    // const c_f_e = cube_catmull_clark.mesh.edgeToNumber()
    // const e_e = new Date().getTime()
    // const c_e_v = cube_catmull_clark.mesh.getEdgesOfVertexFast(0, c_f_e)
    // const e_v = new Date().getTime()
    // const c_f = cube_catmull_clark.mesh.getFacesofVertexSpecific(c_e_v)
    // const e_f = new Date().getTime();
    // const no_hf = cube_catmull_clark.mesh.getEdgesofVertex(0, true);
    // const e_no_hf = new Date().getTime();
    // const hf = cube_catmull_clark.mesh.getEdgesofVertex(0, false)
    // const e_hf = new Date().getTime();
    // const n_f = cube_catmull_clark.mesh.getFacesofVertexGeneric(0);
    // const e_nf = new Date().getTime();
    // console.log(c_f_e)
    // console.log(c_e_v)
    // console.log(c_f)
    // console.log(no_hf)
    // console.log(hf)
    // console.log(n_f)
    // console.log(`Time taken to get all egdes connections: ${e_e - e_s} ms`)
    // console.log(`Time taken to get all edges of vertex : ${e_v - e_e} ms`)
    // console.log(`Time taken to get all faces of vertex : ${e_f - e_v} ms`)
    // console.log(`Time taken to get all edges of vertex with no halfedge : ${e_no_hf - e_f} ms`)
    // console.log(`Time taken to get all edges of vertex with halfedge : ${e_hf - e_no_hf} ms`)
    // console.log(`Time taken to get all faces of vertex : ${e_nf - e_hf} ms`)
    // console.log("\n\n\n",cube.mesh)
    // const cube_catmull_clark = new CatmullClark(cube);
    // const pyramid_catmull_clark = new CatmullClark(pyramid);
    // console.log("CUBE\n\n\n")
    // console.log(cube_catmull_clark.display().points)
    // console.log(cube_catmull_clark.display().mesh.faces)
    // var cutr = cube_catmull_clark.triangulate()
    // console.log(cutr.points)
    // console.log(cutr.mesh.faces)
    // cube_catmull_clark.iterate(1);
    // console.log(cube_catmull_clark.display().points)
    // console.log(cube_catmull_clark.display().mesh.faces)
    // cutr = cube_catmull_clark.triangulate()
    // console.log(cutr.points)
    // console.log(cutr.mesh.faces)
    // console.log("PYRAMID\n\n\n")
    // console.log(pyramid_catmull_clark.display().points)
    // console.log(pyramid_catmull_clark.display().mesh.faces)
    // var pytr = pyramid_catmull_clark.triangulate()
    // console.log(pytr.points)
    // console.log(pytr.mesh.faces)
    // pyramid_catmull_clark.iterate(1);
    // console.log(pyramid_catmull_clark.display().points)
    // console.log(pyramid_catmull_clark.display().mesh.faces)
    // pytr = pyramid_catmull_clark.triangulate()
    // console.log(pytr.points)
    // console.log(pytr.mesh.faces)
    // console.log("DONE");
})();
