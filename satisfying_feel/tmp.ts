(function () {

    type _CONNECTIVITY_ = {
        faces: string[];
        edges: string[];
    }

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

    type _2D_VEC_ = [number,number];

    type _3D_VEC_ = [number,number,number];

    type _HALFEDGE_ = {
        vertices: _2D_VEC_;
        face_vertices: number[];
        twin: string;
        prev: string;
        next: string;
        face_index: number;
    }

    const precision = 1e10;

    class Miscellanous {
        getPermutationsArr(arr: number[],permutationSize: number) {
            const permutations: number[][] = [];

            function backtrack(currentPerm: any) {
                if(currentPerm.length === permutationSize) {
                    permutations.push(currentPerm.slice());
                    return;
                }
                arr.forEach((item) => {
                    if(currentPerm.includes(item))
                        return;
                    currentPerm.push(item);
                    backtrack(currentPerm);
                    currentPerm.pop();
                });
            }
            backtrack([]);
            return permutations;
        }
        getCombinationsArr(arr: number[],combinationSize: number) {
            const combinations: number[][] = [];

            function backtrack(startIndex: number,currentCombination: any) {
                if(currentCombination.length === combinationSize) {
                    combinations.push(currentCombination.slice());
                    return;
                }
                for(let i = startIndex; i < arr.length; i++) {
                    currentCombination.push(arr[i]);
                    backtrack(i + 1,currentCombination);
                    currentCombination.pop();
                }
            }
            backtrack(0,[]);
            return combinations;
        }
        getFibonacciNum(num: number) {
            if(num < 0)
                return 0;
            else if(num === 0 || num === 1)
                return 1;
            else
                return this.getFibonacciNum(num - 1) + this.getFibonacciNum(num - 2);
        }
        getFibonacciSeq(start: number,stop: number) {
            var s = Math.max(start,0);
            const hold: number[] = [];
            var n = 0;
            while(s <= stop) {
                hold[n] = this.getFibonacciNum(s);
                n++;
                s++;
            }
            return hold;
        }
        getFactorialNum(num: number) {
            if(num <= 1)
                return 1;
            else
                return num * this.getFactorialNum(num - 1);
        }
        getFactorialSeq(start: number,stop: number) {
            var s = Math.max(start,0);
            const hold: number[] = [];
            var n = 0;
            while(s <= stop) {
                hold[n] = this.getFactorialNum(s);
                n++;
                s++;
            }
            return hold;
        }

        getCombinationsNum(n: number,r: number) {
            return (this.getFactorialNum(n) / ((this.getFactorialNum(n - r)) * (this.getFactorialNum(r))));
        }

        getPermutationsNum(n: number,r: number) {
            return (this.getFactorialNum(n) / (this.getFactorialNum(n - r)));
        }
    }

    abstract class BinarySearch<T>{

        abstract satisfies(): -1 | 0 | 1;

        recursive(elem: T,arr: T[],min: number,max: number) // min = 0, max = inputArray.length - 1
        {
            if(min > max) return -1;

            else {
                let mid = Math.floor((min + max) / 2);

                if(this.satisfies() === 0) return mid;
                else if(this.satisfies() === -1) return this.recursive(elem,arr,min,mid - 1);
                else return this.recursive(elem,arr,mid + 1,max);
            }
        }

        iterative(arr: T[]) {
            let min = 0;
            let max = arr.length - 1;

            while(min <= max) {
                let mid = Math.floor((min + max) / 2);

                if(this.satisfies() === 0) return mid;
                else if(this.satisfies() === -1) max = mid - 1;
                else min = mid + 1;
            }

            return -1;
        }
    }

    class MeshDataStructure {
        HalfEdgeDict: {};
        face_tmp: number[];
        faces: Set<string>;
        sorted_faces: string[];
        prev: string | null;
        next: string | null;
        temp: string | null;
        face_vertices_tmp: number[];
        face_indexes_tmp: number[];
        edge_no: number;
        vertex_no: number;
        vertex_indexes: Set<number>;
        multiplier = 10;
        deleted_halfedges_dict: {};
        face_indexes_set: Set<number>;
        max_face_index: number;
        face_index_map: {};
        max_vertex_index: number;

        constructor (vertex_num = 0) {
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
            this.vertex_no = vertex_num;
            this.vertex_indexes = new Set();
            this.deleted_halfedges_dict = {};
            this.face_indexes_set = new Set();
            this.max_face_index = -1;
            this.face_index_map = {};
            this.max_vertex_index = -1;
        }

        maxFaceIndex() {
            const test = Math.max(...[...this.face_indexes_set])
            if(test !== Infinity && test !== -Infinity && test > this.max_face_index) this.max_face_index = test;
        }

        maxVertexIndex() {
            const test = Math.max(...[...this.vertex_indexes])
            if(test !== Infinity && test !== -Infinity && test > this.max_vertex_index) this.max_vertex_index = test;
        }

        halfEdge(start: number,end: number,face_index: number): _HALFEDGE_ {
            this.vertex_indexes.add(start);
            this.vertex_indexes.add(end);
            this.maxVertexIndex();
            this.vertex_no = [...this.vertex_indexes].length;
            const comp = Math.max(start,end);
            if(this.multiplier % comp === this.multiplier) this.multiplier *= 10;
            this.face_indexes_set.add(face_index);
            this.maxFaceIndex();
            return {
                vertices: [start,end],
                face_vertices: [],
                twin: "-",
                prev: "-",
                next: "-",
                face_index: face_index,
            };
        }

        setHalfEdge(a: number,b: number,face_index = -1,set_halfEdge = true) {
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
                (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_) = this.halfEdge(a,b,face_index);
                this.edge_no++;
                (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).face_vertices = this.face_vertices_tmp;
                this.face_index_map[face_index] = this.face_vertices_tmp.join("-");
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

        addHalfEdge(edge: string | _2D_VEC_,face_vertices = this.face_indexes_tmp,face_index = -1,prev = "-",next = "-") {
            if(typeof edge === "string") edge = edge.split("-").map(value => Number(value)) as _2D_VEC_;
            const halfEdgeKey = this.setHalfEdge(...edge);
            (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).face_vertices = face_vertices;
            (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).prev = prev;
            (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).next = next;
            (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).face_index = face_index
            return halfEdgeKey;
        }

        removeHalfEdge(edge: string) {
            if(!this.HalfEdgeDict[edge]) return false; // halfedge was not deleted because it does not exist

            const [a,b] = edge.split("-");
            const twinHalfEdgeKey = b + "-" + a;

            const edge_num_list = this.edgeToNumber();
            this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];

            // twin half edge exists
            if(this.HalfEdgeDict[twinHalfEdgeKey]) {
                (this.HalfEdgeDict[twinHalfEdgeKey] as _HALFEDGE_).twin = "-";

                let prev_halfEdgeKey = (this.HalfEdgeDict[edge] as _HALFEDGE_).prev;
                let next_halfEdgeKey = (this.HalfEdgeDict[edge] as _HALFEDGE_).next;

                if(prev_halfEdgeKey !== "-" && prev_halfEdgeKey !== twinHalfEdgeKey) this.HalfEdgeDict[prev_halfEdgeKey].next = "-";
                if(next_halfEdgeKey !== "-" && next_halfEdgeKey !== twinHalfEdgeKey) this.HalfEdgeDict[next_halfEdgeKey].prev = "-";
            }

            // twin half edge does not exist
            if(!this.HalfEdgeDict[twinHalfEdgeKey]) {

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

                if(this.deleted_halfedges_dict[twinHalfEdgeKey]) {
                    beta_prev = this.deleted_halfedges_dict[twinHalfEdgeKey].prev;
                    beta_next = this.deleted_halfedges_dict[twinHalfEdgeKey].next;

                    beta_prev_exists = !!this.HalfEdgeDict[beta_prev];
                    beta_next_exists = !!this.HalfEdgeDict[beta_next];
                }


                console.log(`Alpha\tprev : ${alpha_prev}\nBeta\tnext : ${beta_next}`);
                console.log(`Beta\tprev : ${beta_prev}\nAlpha\tnext : ${alpha_next}`);

                if(alpha_prev_exists && beta_next_exists) {
                    (this.HalfEdgeDict[alpha_prev] as _HALFEDGE_).next = beta_next;
                    (this.HalfEdgeDict[beta_next] as _HALFEDGE_).prev = alpha_prev;
                }
                else if(alpha_prev_exists) (this.HalfEdgeDict[alpha_prev] as _HALFEDGE_).next = "-";
                else if(beta_next_exists) (this.HalfEdgeDict[beta_next] as _HALFEDGE_).prev = "-";

                if(beta_prev_exists && alpha_next_exists) {
                    (this.HalfEdgeDict[beta_prev] as _HALFEDGE_).next = alpha_next;
                    (this.HalfEdgeDict[alpha_next] as _HALFEDGE_).prev = beta_prev;
                }

                else if(beta_prev_exists) (this.HalfEdgeDict[beta_prev] as _HALFEDGE_).next = "-";
                else if(alpha_next_exists) (this.HalfEdgeDict[alpha_next] as _HALFEDGE_).prev = "-";

                const faces_of_edge = this.getFacesOfDeletedEdge(edge);
                const alpha_edges = this.getEdgesOfFace(faces_of_edge[0]);
                const beta_edges = this.getEdgesOfFace(faces_of_edge[1]);

                console.log(`Faces of deleted edge :`)
                console.log(faces_of_edge)
                console.log(alpha_edges.length,"+++++++++",beta_edges.length)
                console.log("Alpha edges : ",alpha_edges,"\nBeta edges :",beta_edges)

                if(alpha_edges.length >= 2 && beta_edges.length >= 2) {
                    this.faces.delete(faces_of_edge[0].join("-"));
                    this.faces.delete(faces_of_edge[1].join("-"));

                    const new_face_vertices = this.mergeDeletedFaces(faces_of_edge,edge);
                    const new_face_index = this.max_face_index + 1;

                    const first_face_index = (this.deleted_halfedges_dict[edge] as _HALFEDGE_).face_index;
                    const second_face_index = (this.deleted_halfedges_dict[twinHalfEdgeKey] as _HALFEDGE_).face_index;

                    this.face_indexes_set.add(new_face_index);
                    this.maxFaceIndex();
                    this.face_index_map[new_face_index] = new_face_vertices.join("-");
                    this.face_indexes_set.delete(first_face_index);
                    this.face_indexes_set.delete(second_face_index);

                    for(const edge of alpha_edges) {
                        if(this.HalfEdgeDict[edge]) {
                            (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices = new_face_vertices;
                            (this.HalfEdgeDict[edge] as _HALFEDGE_).face_index = new_face_index;

                        }
                    }
                    for(const edge of beta_edges) {
                        if(this.HalfEdgeDict[edge]) {
                            (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices = new_face_vertices;
                            (this.HalfEdgeDict[edge] as _HALFEDGE_).face_index = new_face_index;
                        }
                    }
                    this.faces.add(new_face_vertices.join('-'))
                }

                if(alpha_edges.length < 2) {
                    for(const edge of alpha_edges) if(this.HalfEdgeDict[edge]) {
                        (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices = (this.HalfEdgeDict[edge] as _HALFEDGE_).vertices;
                        this.face_indexes_set.delete((this.HalfEdgeDict[edge] as _HALFEDGE_).face_index);
                    }
                    this.faces.delete(faces_of_edge[0].join("-"));
                }

                if(beta_edges.length < 2) {
                    for(const edge of beta_edges) if(this.HalfEdgeDict[edge]) {
                        (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices = (this.HalfEdgeDict[edge] as _HALFEDGE_).vertices;
                        this.face_indexes_set.delete((this.HalfEdgeDict[edge] as _HALFEDGE_).face_index);
                    }
                    this.faces.delete(faces_of_edge[1].join("-"));
                }

                const biFacial_handling_result = this.biFacialHandling();
                if(biFacial_handling_result.length > 0) this.removeFace(biFacial_handling_result.join("-"));
            }


            // if vertex a belongs to at most one edge remove it from the vertex indexes set
            if(this.getEdgesOfVertexFast(Number(a),edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(a));
            }

            // if vertex b belongs to at most one edge remove it from the vertex indexes set
            if(this.getEdgesOfVertexFast(Number(b),edge_num_list).length <= 1) {
                this.vertex_indexes.delete(Number(b));
            }

            delete this.HalfEdgeDict[edge]; // delete the halfedge

            this.vertex_no = [...this.vertex_indexes].length; // update vertex number
            if(!this.HalfEdgeDict[twinHalfEdgeKey]) this.edge_no-- // decrease edge number if the twin does not exist

            return true; // halfedge was successfully deleted
        }

        mergeDeletedFaces(faces: number[][],edge: string) {
            const alpha_face = this.prepareDeletedFaces(faces[0],edge);
            const beta_face = this.prepareDeletedFaces(faces[1],edge);
            const [a,b] = edge.split("-").map(value => Number(value));

            if(alpha_face.join("-") === beta_face.join("-")) {
                const a_index = alpha_face.indexOf(a);
                const b_index = beta_face.indexOf(b);
                const min_index = Math.min(a_index,b_index);
                alpha_face.splice(min_index,2);
                console.log(alpha_face)
                return this.modifyMergedFace(alpha_face);
            }

            const alpha_dict = {};
            const beta_dict = {};

            for(const index in alpha_face) alpha_dict[alpha_face[index]] = index;
            for(const index in beta_face) beta_dict[beta_face[index]] = index;

            var face_bool = true;
            var index = 0;
            var monitor = 0;
            const stop = faces[0].length + faces[1].length - 2;
            var collide = 0;
            var monitor_bool = true;
            const merged_face: number[] = [];

            while(true) {
                const cur_index = face_bool ? index % alpha_face.length : index % beta_face.length;
                const cur_value = face_bool ? alpha_face[cur_index] : beta_face[cur_index];

                if(cur_value === a || cur_value === b) {
                    if(collide < 2) {
                        merged_face[merged_face.length] = cur_value;
                        face_bool = !face_bool;
                        const dict = face_bool ? alpha_dict : beta_dict;
                        index = dict[cur_value];
                        collide++;
                    }

                    else monitor_bool = false;
                }

                else merged_face[merged_face.length] = cur_value;

                if(monitor_bool === true) monitor++;
                monitor_bool = true;
                index++;

                if(monitor === stop) break;
            }

            return this.modifyMergedFace(merged_face);
        }

        prepareDeletedFaces(face: number[],edge: string) {
            var prepped = false;
            var remainder: number[] = [];
            const [a,b] = edge.split("-").map(value => Number(value));
            var edge_num_list: number[] = [];

            for(const index in face) {
                const cur_val = face[index];
                const next_val = face[(Number(index) + 1) % face.length];
                const last_val = Number(index) === (face.length - 1) ? true : false;

                if((cur_val === a || cur_val === b) && (next_val === a || next_val === b)) {
                    if(!last_val) {
                        remainder = face;
                        prepped = true;
                        break;
                    }

                    if(last_val) {
                        edge_num_list = [cur_val,next_val];
                    }
                }

                if(!(cur_val === a || cur_val === b)) remainder.push(cur_val);
            }

            if(!prepped) {
                remainder = [...edge_num_list,...remainder];
            }

            return remainder;
        }

        modifyMergedFace(face: number[]) {
            var min = Infinity;
            var min_index = 0;

            for(const index in face) {
                const vertex = face[index];
                if(min > vertex) {
                    min = vertex;
                    min_index = Number(index);
                }
            }

            var rem = face.splice(min_index);
            return [...rem,...face];
        }

        biFacialHandling() {
            if(this.faces.size === 2) { // Check if there are only two faces left in the mesh
                const faces = [...this.faces];
                const face_one = [...faces[0].split("-").map(value => Number(value))];
                const face_two = [...faces[1].split("-").map(value => Number(value))];

                if(face_one.length !== face_two.length) return []; // if both faces don't have the same number of vertices then abort and return false
                if(face_one.length <= 3) return face_two; // automatically consider them as complements in this case
                // else then try to compute if the two faces are complements
                if(this.modifyMergedFace(face_one).join("-") === this.modifyMergedFace(face_two).join("-")) return face_two; // if the two faces are complements return true;

                return []; // default return value;
            }

            return []; // default return value;
        }

        addVertex(vertex: string | number,vertex_or_face_or_edge: string | number[]) {
            if(typeof vertex_or_face_or_edge === "string") vertex_or_face_or_edge = vertex_or_face_or_edge.split("-").map(value => Number(value));
            vertex = Number(vertex);

            if(vertex_or_face_or_edge.length === 1) {
                this.vertex_indexes.add(vertex);
                this.maxVertexIndex();
                this.vertex_no = [...this.vertex_indexes].length;
                const comp = Math.max(this.max_vertex_index,vertex);
                if(this.multiplier % comp === this.multiplier) this.multiplier *= 10;
            }

            else if(vertex_or_face_or_edge.length >= 2) {
                var face_index = -1;
                if(vertex_or_face_or_edge.length > 2) {
                    if(this.faces.has(vertex_or_face_or_edge.join("-"))) {
                        face_index = this.getFaceIndexOfFace(vertex_or_face_or_edge.join("-"));
                    }
                }

                for(const val of vertex_or_face_or_edge) {
                    this.addHalfEdge(`${vertex}-${val}`,vertex_or_face_or_edge,face_index);
                }
            }
        }

        removeVertex(vertex: string | number) {
            let count = 0;
            for(const edge in this.HalfEdgeDict) {
                if(edge.split("-").includes(`${vertex}`)) {
                    this.removeEdge(edge);
                }
            }
            return count;
        }

        getEdgesOfVertexFast(vertex: number,edge_num_list: number[]) {
            const edge_list: string[] = [];
            edge_num_list.map(value => {
                const min = value % this.multiplier;
                const max = (value - min) / this.multiplier;
                if(vertex === min || vertex === max) edge_list.push(`${min}-${max}`);
            });
            return edge_list;
        }

        getEdgesOfVertex(vertex: string | number,no_half_edge = false) {
            const edge_list: string[] = [];
            const edge_set: Set<string> = new Set();

            if(no_half_edge === false) {
                for(const edge in this.HalfEdgeDict) {
                    // edge touches vertex and is not in the edge_list
                    if(edge.split("-").includes(`${vertex}`)) edge_list.push(edge);
                }
            }

            if(no_half_edge === true) {
                for(const edge in this.HalfEdgeDict) {
                    // edge touches vertex and is not in the edge_list also ensure no edge complements (halfedges that are twin halfedges of previously existing halfedges)
                    if(edge.split("-").includes(`${vertex}`)) {
                        const [a,b] = edge.split("-").map(value => Number(value));
                        edge_set.add(`${Math.min(a,b)}-${Math.max(a,b)}`);
                    }
                }
                edge_list.push(...[...edge_set]);
            }

            return edge_list;
        }

        getFacesOfVertexSpecific(edge_list: string[]) {
            const face_set: Set<string> = new Set();
            const faces: number[][] = [];

            for(const edge of edge_list) {
                const face = (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices;
                if(!face_set.delete(face.join("-"))) {
                    face_set.add(face.join("-"));
                    faces.push(face);
                }
            }

            return faces;
        }

        getFaceIndexesOfVertexSpecific(edge_list: string[]) {
            const face_indexes: Set<number> = new Set();

            for(const edge of edge_list) {
                const face_index = (this.HalfEdgeDict[edge] as _HALFEDGE_).face_index;
                face_indexes.add(face_index);
            }

            return [...face_indexes];
        }

        getFacesOfVertexGeneric(vertex: string | number,no_half_edge = false) {
            const edge_list = this.getEdgesOfVertex(vertex,no_half_edge);
            return this.getFacesOfVertexSpecific(edge_list);
        }


        addEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "string") edge = edge.split("-").map(value => Number(value)) as _2D_VEC_;
            this.setHalfEdge(...edge);
            this.setHalfEdge(edge[1],edge[0]);
            return edge;
        }

        removeEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            const remove_thf = this.removeHalfEdge(edge.split("-").reverse().join("-"));
            const remove_hf = this.removeHalfEdge(edge);

            return remove_hf || remove_thf;
        }


        splitEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            const [a,b] = edge.split("-").map(value => Number(value));

            const faces_of_edge = this.getFacesOfEdge(edge);
            const new_vertex = this.max_vertex_index + 1;

            if(faces_of_edge[0].length > 0) {
                const new_face = faces_of_edge[0].join("-").replace(edge,`${a}-${new_vertex}-${b}`);
                this.vertex_indexes.add(new_vertex);

                if(faces_of_edge[0].length > 2) {
                    this.removeFace(faces_of_edge[0].join("-"));
                    this.addFace(new_face);
                }

                else {
                    var prev = "-";
                    var next = "-";
                    if(this.HalfEdgeDict[edge]) {
                        prev = (this.HalfEdgeDict[edge] as _HALFEDGE_).prev;
                        next = (this.HalfEdgeDict[edge] as _HALFEDGE_).next;
                        this.deleted_halfedges_dict[edge] = this.HalfEdgeDict[edge];
                        delete this.HalfEdgeDict[edge];
                        const face_index = (this.HalfEdgeDict[edge] as _HALFEDGE_).face_index;


                        this.addHalfEdge(`${a}-${new_vertex}`,new_face.split("-").map(value => Number(value)),face_index,prev,`${new_vertex}-${b}`);
                        this.addHalfEdge(`${new_vertex}-${b}`,new_face.split("-").map(value => Number(value)),face_index,`${a}-${new_vertex}`,next);
                    }
                }
            }

            if(faces_of_edge[1].length > 0) {
                const new_face = faces_of_edge[1].join("-").replace(b + "-" + a,`${b}-${new_vertex}-${a}`);
                this.vertex_indexes.add(new_vertex);

                if(faces_of_edge[1].length > 2) {
                    this.removeFace(faces_of_edge[1].join("-"));
                    this.addFace(new_face);
                }

                else {
                    var prev = "-";
                    var next = "-";
                    if(this.HalfEdgeDict[b + "-" + a]) {
                        prev = (this.HalfEdgeDict[b + "-" + a] as _HALFEDGE_).prev;
                        next = (this.HalfEdgeDict[b + "-" + a] as _HALFEDGE_).next;
                        this.deleted_halfedges_dict[b + "-" + a] = this.HalfEdgeDict[b + "-" + a];
                        delete this.HalfEdgeDict[b + "-" + a];
                        const face_index = (this.HalfEdgeDict[b + "-" + a] as _HALFEDGE_).face_index;

                        this.addHalfEdge(`${b}-${new_vertex}`,new_face.split("-").map(value => Number(value)),face_index,prev,`${new_vertex}-${a}`);
                        this.addHalfEdge(`${new_vertex}-${a}`,new_face.split("-").map(value => Number(value)),face_index,`${b}-${new_vertex}`,next);
                    }
                }
            }

            this.maxVertexIndex();
        }

        mergeEdges(edge_1: string | _2D_VEC_,edge_2: string | _2D_VEC_) {
            if(typeof edge_1 === "object") edge_1 = edge_1.join("-");
            const [a_1,b_1] = edge_1.split("-").map(value => Number(value));

            if(typeof edge_2 === "object") edge_2 = edge_2.join("-");
            const [a_2,b_2] = edge_2.split("-").map(value => Number(value));


            const common_vertex_face_num = this.getCommonVertAndFacesofEdges(a_1,b_1,a_2,b_2);
            const common_vertex = common_vertex_face_num.common_vertex;
            const common_faces = common_vertex_face_num.faces;

            if(common_vertex < 0) return false;

            const edge_list = this.getEdgesOfVertex(common_vertex,true);
            const rev_edge_1 = `${b_1}-${a_1}`;
            const rev_edge_2 = `${b_2}-${a_2}`;
            let initial_max_face_index = this.max_face_index;

            for(const edge of edge_list) {
                if(!(edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2)) {
                    const edge_faces = this.getFacesOfEdge(edge);
                    const rem_edge = this.removeEdge(edge);
                    if(rem_edge) {
                        const has_face_0 = this.faces.has(edge_faces[0].join("-"));
                        const has_face_1 = this.faces.has(edge_faces[1].join("-"));

                        if(!has_face_0) {
                            const index = common_faces.indexOf(edge_faces[0].join("-"));
                            if(index >= 0) common_faces.splice(index,1);
                        }

                        if(!has_face_1) {
                            const index = common_faces.indexOf(edge_faces[1].join("-"));
                            if(index >= 0) common_faces.splice(index,1);
                        }

                        if(this.max_face_index > initial_max_face_index) {
                            common_faces.push(this.face_index_map[this.max_face_index])
                            initial_max_face_index = this.max_face_index;
                            this.face_indexes_set.add(initial_max_face_index);
                        }
                    }
                }
            }

            for(const face of common_faces) {
                const working_face = [...face.split("-").map(value => Number(value))];
                const index = working_face.indexOf(common_vertex);
                if(index >= 0) {
                    working_face.splice(index,1);
                }

                if(working_face.length <= 2) this.removeFace(face);

                else {
                    const required_edges = this.getEdgesOrientation(face,edge_1,edge_2);

                    if(required_edges.prev === "-" || required_edges.next === "-") continue;

                    const a = required_edges.prev.split("-")[0];
                    const b = required_edges.next.split("-")[1];
                    const prev = (this.HalfEdgeDict[required_edges.prev] as _HALFEDGE_).prev;
                    const next = (this.HalfEdgeDict[required_edges.next] as _HALFEDGE_).next;
                    const old_face_index = required_edges.face_index;
                    this.face_indexes_set.delete(old_face_index);
                    const new_face_index = this.getFaceIndexOfFace(working_face.join("-"));
                    this.face_indexes_set.add(new_face_index);
                    this.face_index_map[new_face_index] = working_face.join("-");
                    this.addHalfEdge(a + "-" + b,working_face,new_face_index,prev,next);

                    if(prev !== "-") if(this.HalfEdgeDict[prev]) {
                        (this.HalfEdgeDict[prev] as _HALFEDGE_).next = a + "-" + b;
                    }

                    if(next !== "-") if(this.HalfEdgeDict[next]) {
                        (this.HalfEdgeDict[next] as _HALFEDGE_).prev = a + "-" + b;
                    }

                    for(const edge of required_edges.edges_of_face) {
                        if(this.HalfEdgeDict[edge]) {
                            const face = (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices.join("-");
                            this.faces.delete(face);
                            (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices = working_face;
                            this.faces.add(working_face.join("-"));
                        }
                    }
                }
            }

            if(this.HalfEdgeDict[edge_1]) {
                this.deleted_halfedges_dict[edge_1] = this.HalfEdgeDict[edge_1];
                delete this.HalfEdgeDict[edge_1];
            }

            if(this.HalfEdgeDict[rev_edge_1]) {
                this.deleted_halfedges_dict[rev_edge_1] = this.HalfEdgeDict[rev_edge_1];
                delete this.HalfEdgeDict[rev_edge_1];
            }

            if(this.HalfEdgeDict[edge_2]) {
                this.deleted_halfedges_dict[edge_2] = this.HalfEdgeDict[edge_2];
                delete this.HalfEdgeDict[edge_2];
            }

            if(this.HalfEdgeDict[rev_edge_2]) {
                this.deleted_halfedges_dict[rev_edge_2] = this.HalfEdgeDict[rev_edge_2];
                delete this.HalfEdgeDict[rev_edge_2];
            }

            this.edge_no = this.edge_no - 2; // update edge number

            this.vertex_indexes.delete(common_vertex);
            this.vertex_no = [...this.vertex_indexes].length; // update vertex number

            const biFacial_handling_result = this.biFacialHandling();
            if(biFacial_handling_result.length > 0) this.removeFace(biFacial_handling_result.join("-"));

            this.face_indexes_set.delete(-1);
        }

        getCommonVertAndFacesofEdges(a_1: number,b_1: number,a_2: number,b_2: number) {
            const test: { common_vertex: number; faces: string[] } = { common_vertex: -1,faces: [] };

            // Check if both halfEdges or their twin halfedges exist
            if(
                ((this.HalfEdgeDict[a_1 + "-" + b_1]) || (this.HalfEdgeDict[b_1 + "-" + a_1])) &&
                ((this.HalfEdgeDict[a_2 + "-" + b_2]) || (this.HalfEdgeDict[b_2 + "-" + a_2]))) {

                const halfEdgeKey_union_list = [a_1,b_1,a_2,b_2];
                const halfEdgeKey_union_set = new Set(halfEdgeKey_union_list);

                if(halfEdgeKey_union_set.size <= 2) return test;

                // get the common vertex of the adjacent edges
                for(const val of halfEdgeKey_union_list) {
                    const check_vertex = halfEdgeKey_union_set.delete(val);
                    if(check_vertex === false) {
                        test.common_vertex = val;
                        break;
                    }
                }

                // get the faces
                const faces_list: string[] = [];
                if(this.HalfEdgeDict[`${a_1}-${b_1}`]) faces_list.push((this.HalfEdgeDict[`${a_1}-${b_1}`] as _HALFEDGE_).face_vertices.join("-"));
                if(this.HalfEdgeDict[`${b_1}-${a_1}`]) faces_list.push((this.HalfEdgeDict[`${b_1}-${a_1}`] as _HALFEDGE_).face_vertices.join("-"));
                if(this.HalfEdgeDict[`${a_2}-${b_2}`]) faces_list.push((this.HalfEdgeDict[`${a_2}-${b_2}`] as _HALFEDGE_).face_vertices.join("-"));
                if(this.HalfEdgeDict[`${b_2}-${a_2}`]) faces_list.push((this.HalfEdgeDict[`${b_2}-${a_2}`] as _HALFEDGE_).face_vertices.join("-"));
                const face_set: Set<string> = new Set(faces_list);
                test.faces.push(...[...face_set])

                // get the faces' index
                const face_indexes_list: number[] = [];
                if(this.HalfEdgeDict[`${a_1}-${b_1}`]) face_indexes_list.push((this.HalfEdgeDict[`${a_1}-${b_1}`] as _HALFEDGE_).face_index);
                if(this.HalfEdgeDict[`${b_1}-${a_1}`]) face_indexes_list.push((this.HalfEdgeDict[`${b_1}-${a_1}`] as _HALFEDGE_).face_index);
                if(this.HalfEdgeDict[`${a_2}-${b_2}`]) face_indexes_list.push((this.HalfEdgeDict[`${a_2}-${b_2}`] as _HALFEDGE_).face_index);
                if(this.HalfEdgeDict[`${b_2}-${a_2}`]) face_indexes_list.push((this.HalfEdgeDict[`${b_2}-${a_2}`] as _HALFEDGE_).face_index);

                return test;
            }

            return test;
        }

        getEdgesOrientation(face: string,edge_1: string,edge_2: string) {
            const edges_orientation: { prev: string,next: string,edges_of_face: string[],face_index: number } = { prev: "-",next: "-",edges_of_face: [],face_index: -1 };
            const rev_edge_1 = edge_1.split("-").reverse().join("-");
            const rev_edge_2 = edge_2.split("-").reverse().join("-");
            const face_edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));
            edges_orientation.edges_of_face.push(...face_edges);
            edges_orientation.face_index = face_edges.length >= 1 ? (this.HalfEdgeDict[face_edges[0]] as _HALFEDGE_).face_index : -1;
            var found_edge = "-";

            for(const edge of face_edges) {
                if(edge === edge_1 || edge === rev_edge_1 || edge === edge_2 || edge === rev_edge_2) {
                    if(this.HalfEdgeDict[edge]) {
                        found_edge = edge;
                        break;
                    }
                }
            }

            if(found_edge === "-") return edges_orientation;

            else {
                const prev = (this.HalfEdgeDict[found_edge] as _HALFEDGE_).prev;
                const next = (this.HalfEdgeDict[found_edge] as _HALFEDGE_).next;

                if(prev !== "-") if(prev === edge_1 || prev === rev_edge_1 || prev === edge_2 || prev === rev_edge_2) if(this.HalfEdgeDict[prev]) edges_orientation.prev = prev;
                if(next !== "-") if(next === edge_1 || next === rev_edge_1 || next === edge_2 || next === rev_edge_2) if(this.HalfEdgeDict[next]) edges_orientation.next = next;

                if(edges_orientation.prev === "-") edges_orientation.prev = found_edge;
                else if(edges_orientation.next === "-") edges_orientation.next = found_edge;
            }

            return edges_orientation;
        }

        edgeReverse(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            const [a,b] = edge.split("-");
            return `${b}-${a}`;
        }

        getVerticesOfEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "string") return edge.split("-").map(value => Number(value)) as _2D_VEC_;
            else return edge;
        }

        getFacesOfHalfEdge(halfEdge: string) {
            if(this.HalfEdgeDict[halfEdge]) {
                return (this.HalfEdgeDict[halfEdge] as _HALFEDGE_).face_vertices;
            }
            else return [];
        }

        getFacesOfEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            return [this.getFacesOfHalfEdge(edge),this.getFacesOfHalfEdge(edge.split("-").reverse().join("-"))];
        }

        getFacesOfDeletedHalfEdge(halfEdge: string) {
            if(this.deleted_halfedges_dict[halfEdge]) {
                return (this.deleted_halfedges_dict[halfEdge] as _HALFEDGE_).face_vertices;
            }
            else return [];
        }

        getFacesOfDeletedEdge(edge: string | _2D_VEC_) {
            if(typeof edge === "object") edge = edge.join("-");
            return [this.getFacesOfDeletedHalfEdge(edge),this.getFacesOfDeletedHalfEdge(edge.split("-").reverse().join("-"))];
        }

        edgeToNumber() {
            const edge_num_set: Set<number> = new Set();

            for(const edge in this.HalfEdgeDict) {
                const [a,b] = edge.split("-").map(value => Number(value));
                const [min,max] = [Math.min(a,b),Math.max(a,b)];
                edge_num_set.add(max * this.multiplier + min);
            }

            return [...edge_num_set];
        }

        addFace(face: string) {
            this.face_vertices_tmp = face.split("-").map(value => Number(value));
            const sorted_face = [...this.face_vertices_tmp].sort((a,b) => a - b).join("-");
            const face_set: Set<string> = new Set(this.faces);
            const sorted_face_set: Set<string> = new Set(this.sorted_faces);

            // If face is not found in faces add face to faces and set its halfedges
            if(!face_set.delete(face) && this.face_vertices_tmp.length > 2 && !sorted_face_set.delete(sorted_face)) {
                this.faces.add(face);
                this.sorted_faces.push(sorted_face);

                const first_index = this.face_vertices_tmp[0];
                const second_index = this.face_vertices_tmp[1];
                const last_index = this.face_vertices_tmp[this.face_vertices_tmp.length - 1];
                const face_index = this.max_face_index + 1;

                for(let p in this.face_vertices_tmp) {
                    const index = Number(p);
                    const i = this.face_vertices_tmp[p];
                    const j = this.face_vertices_tmp[(index + 1) % this.face_vertices_tmp.length];
                    const halfEdgeKey = this.setHalfEdge(i,j,face_index);
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
                    if(index === this.face_vertices_tmp.length - 1) (this.HalfEdgeDict[halfEdgeKey] as _HALFEDGE_).next = `${first_index}-${second_index}`;

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
            // Check if face is found in faces
            if(this.faces.has(face)) {
                const face_num_list = face.split("-").map(value => Number(value)); // get the ideal halfedges of the face
                const existing_face_edges = this.getEdgesOfFacethatExists(face_num_list); // get the actual (existing) halfedges of the face

                // check if all the ideal halfedges of the face exist (are actual)
                if(existing_face_edges.length === face_num_list.length) {
                    const edge_num_list = this.edgeToNumber();
                    // remove the face and its halfedges
                    for(const half_edge of existing_face_edges) {
                        const [a,b] = half_edge.split("-");
                        this.deleted_halfedges_dict = this.HalfEdgeDict[half_edge];
                        this.face_indexes_set.delete((this.HalfEdgeDict[half_edge] as _HALFEDGE_).face_index);
                        delete this.HalfEdgeDict[half_edge];

                        // if vertex a belongs to at most one edge remove it from the vertex indexes set
                        if(this.getEdgesOfVertexFast(Number(a),edge_num_list).length <= 1) {
                            this.vertex_indexes.delete(Number(a));
                        }

                        // if vertex b belongs to at most one edge remove it from the vertex indexes set
                        if(this.getEdgesOfVertexFast(Number(b),edge_num_list).length <= 1) {
                            this.vertex_indexes.delete(Number(b));
                        }

                        this.vertex_no = [...this.vertex_indexes].length; // update vertex number
                        if(!this.HalfEdgeDict[b + "-" + a]) this.edge_no-- // decrease edge number if the twin does not exist
                    }
                    this.faces.delete(face);

                    return true; // face was removed
                }

                else return false; // face not removed
            }

            return false; // face not removed
        }

        getEdgesOfFace(face: number[]) {
            return face.map((value,index) => `${value}-${face[(index + 1) % face.length]}`);
        }

        getEdgesOfFacethatExists(face: number[]) {
            const potential_edges = this.getEdgesOfFace(face);
            const existing_edges: string[] = [];

            for(const half_edge of potential_edges) {
                if(half_edge in this.HalfEdgeDict) existing_edges.push(half_edge);
            }

            return existing_edges;
        }

        getFaceIndexOfFace(face: string) {
            const edges = this.getEdgesOfFace(face.split("-").map(value => Number(value)));

            for(const halfedge of edges) {
                if(halfedge in this.HalfEdgeDict) return (this.HalfEdgeDict[halfedge] as _HALFEDGE_).face_index;
            }

            return -1;
        }

        splitFace() {}

        mergeface() {}

        sumPoints(points: Point3D[]): Point3D {
            var res: Point3D = new Point3D(0,0,0);
            for(const point of points) {
                res.x += point.x;
                res.y += point.y;
                res.z += point.z;
            }
            return res;
        }

        getMinMax(points: Point3D[]) {
            var minX = Infinity;
            var maxX = -Infinity;
            var minY = Infinity;
            var maxY = -Infinity;
            var minZ = Infinity;
            var maxZ = -Infinity;

            for(const point of points) {
                if(minX > point.x) minX = point.x;
                if(maxX < point.x) maxX = point.x;
                if(minY > point.y) minY = point.y;
                if(maxY < point.y) maxY = point.y;
                if(minZ > point.z) minZ = point.z;
                if(maxZ < point.z) maxZ = point.z;
            }

            return [minX,maxX,minY,maxY,minZ,maxZ];
        }

        triangulate(points_list: Point3D[] | undefined = undefined) {
            const triangulated_points_list: Point3D[] = [];
            if(typeof points_list !== "undefined") {
                triangulated_points_list.push(...points_list);
            }

            const start = new Date().getTime();
            const new_mesh = new MeshDataStructure();
            var new_vertex = this.max_vertex_index;

            for(const face of this.faces) {
                const vertex_indexes = face.split("-").map(value => Number(value));
                const face_edges = this.getEdgesOfFace(vertex_indexes);
                new_vertex++;

                if(typeof points_list !== "undefined") {
                    const face_vertices = (this.HalfEdgeDict[face_edges[0]] as _HALFEDGE_).face_vertices;
                    const face_points = face_vertices.map(value => points_list[value]);
                    const [xmin,xmax,ymin,ymax,zmin,zmax] = this.getMinMax(face_points);
                    console.log(xmin,xmax,ymin,ymax,zmin,zmax,"*****************");
                    const average_point = new Point3D((xmin + xmax) * 0.5,(ymin + ymax) * 0.5,(zmin + zmax) * 0.5);
                    triangulated_points_list.push(average_point);
                }

                for(const edge of face_edges) {
                    const [a,b] = edge.split("-");
                    new_mesh.addFace(`${new_vertex}-${a}-${b}`);
                }
            }
            const end = new Date().getTime();
            console.log(`Time taken to triangulate : ${end - start} ms`);

            return { mesh: new_mesh, points: triangulated_points_list };
        }

        quad_to_tri(points_list: Point3D[] | undefined = undefined) {
            const triangulated_points_list: Point3D[] = [];
            if(typeof points_list !== "undefined") {
                triangulated_points_list.push(...points_list);
            }

            const new_mesh = new MeshDataStructure();
            
            for(const face of this.faces) {
                const vertex_indexes = face.split("-").map(value => Number(value));
                const face_edges = this.getEdgesOfFace(vertex_indexes);

                if(face_edges.length === 4){
                    const [a,b] = face_edges[0].split("-");
                    const [c,d] = face_edges[1].split("-");
                    const [e,f] = face_edges[2].split("-");
                    const [g,h] = face_edges[3].split("-");

                    new_mesh.addFace(`${a}-${b}-${d}`);
                    new_mesh.addFace(`${e}-${f}-${h}`);
                }
                else new_mesh.addFace(face);
            }

            return { mesh: new_mesh, points: triangulated_points_list };
        }
    }

    class CreateObject {
        width: number;
        height: number;
        depth: number;
        points_list: Point3D[]
        mesh: MeshDataStructure;
        _is_degenerate_: boolean;
        vert_st: number;
        constructor (width: number,height: number,depth: number,start_vertex: number) {
            this.points_list = [];
            this.mesh = new MeshDataStructure();
            this.width = width;
            this.height = height;
            this.depth = depth;
            this._is_degenerate_ = false;
            this.vert_st = start_vertex;
        }

        changePoint(index: number,new_x: number,new_y: number,new_z: number) {
            if(index < this.points_list.length) {
                this.points_list[index] = new Point3D(new_x,new_y,new_z);
                return true;
            }
            return false;
        }

        addPoint(new_x: number,new_y: number,new_z: number) {
            if(this._is_degenerate_) return this.points_list.length;
            else return this.points_list.push(new Point3D(new_x,new_y,new_z));
        }

        modifyDimensions(width = this.width,height = this.height,depth = this.depth) {
            if(!this._is_degenerate_) {
                this.width = width;
                this.height = height;
                this.depth = depth;
                this.points_list = [];
            }
        }
    }

    class CreatePoint extends CreateObject {
        point: Point3D;
        constructor (x = 0,y = 0,z = 0,start_vertex = 0) {
            super(0,0,0,start_vertex);
            this._is_degenerate_ = true;
            this.point = new Point3D(x,y,z);
            this.points_list[0] = this.point;

            this.mesh.addVertex(this.vert_st,[this.vert_st]);
        }

        modifyPoint(x = this.point.x,y = this.point.y,z = this.point.z) {
            this.point = new Point3D(x,y,z);
            this.points_list[0] = this.point;
        }
    }

    class CreateLine extends CreateObject {
        start: Point3D;
        end: Point3D;
        constructor (s_x = 0,s_y = 0,s_z = 0,e_x = 0,e_y = 0,e_z = 0,start_vertex = 0) {
            super(0,0,0,start_vertex);
            this._is_degenerate_ = true;
            this.start = new Point3D(s_x,s_y,s_z);
            this.end = new Point3D(e_x,e_y,e_z);
            this.points_list = [this.start,this.end];

            this.mesh.addHalfEdge(`${this.vert_st}-${this.vert_st + 1}`,[this.vert_st,this.vert_st + 1],-1);
        }

        modifyEdge(s_x = this.start.x,s_y = this.start.y,s_z = this.start.z,e_x = this.end.x,e_y = this.end.y,e_z = this.end.z) {
            this.start = new Point3D(s_x,s_y,s_z);
            this.end = new Point3D(e_x,e_y,e_z);
            this.points_list = [this.start,this.end];
        }
    }

    class CreatePolygon extends CreateObject {
        vertex_number: number;
        half_edges: string[];
        face: number[];
        increment: number;

        constructor (vertex_number = 3,width = 10,depth = 10,increment = 0,start_vertex = 0) {
            super(width,0,depth,start_vertex);
            this.half_edges = [];
            this.face = [];
            this.vertex_number = Math.max(vertex_number,3);
            this.increment = increment;

            for(let i = 0; i < this.vertex_number; i++) {
                const num = i + 1 + increment + this.vert_st;
                const modulo_operand = this.vertex_number + increment + this.vert_st;
                const input_res = num % modulo_operand;
                const output_res = input_res === 0 ? increment + this.vert_st : input_res;
                this.half_edges.push(`${i + increment + this.vert_st}-${output_res}`);
                this.face.push(i + increment + this.vert_st);
            }

            if(this.increment === 0) this.mesh.addFace(this.face.join("-"));
        }

        base_calculatePoints() {
            const angle_inc = 360 / this.vertex_number;
            for(let i = 0; i < this.vertex_number; i++) {
                const cur_ang = i * angle_inc;
                const conv = Math.PI / 180;
                this.points_list[i + this.increment] = new Point3D(Math.cos((cur_ang + 90) * conv) * (this.width / 2),this.height / 2,Math.sin((cur_ang + 90) * conv) * (this.depth / 2));
            }
        }

        polygon_editDimensions(width = this.width,depth = this.depth) {
            this.modifyDimensions(width,0,depth);
            this.base_calculatePoints();
        }
    }

    class CreateEllipse extends CreatePolygon {
        constructor (vertex_number = 10,width = 10,depth = 10,increment = 0,start_vertex = 0) {
            const vert_number = Math.max(vertex_number,10);
            super(vert_number,width,depth,increment,start_vertex);

            if(this.increment === 0) this.mesh.addFace(this.face.join("-"));
        }

        ellipse_calculatePoints() {
            if(this.increment === 1) {
                this.points_list[0] = new Point3D(0,this.height / 2,0);
                this.base_calculatePoints();
            }
        }

        ellipse_editDimensions(width = this.width,depth = this.depth) {
            if(this.increment === 0) {
                this.modifyDimensions(width,0,depth);
                this.base_calculatePoints();
            }
            else if(this.increment === 1) {
                this.modifyDimensions(width,0,depth);
                this.ellipse_calculatePoints();
            }
        }
    }


    class CreateCircle extends CreateEllipse {
        constructor (vertex_number = 10,radius = 10,increment = 0,start_vertex = 0) {
            super(vertex_number,radius,radius,increment,start_vertex);

            if(this.increment === 0) this.mesh.addFace(this.face.join("-"));
        }

        circle_editDimensions(radius = this.width) {
            if(this.increment === 0) {
                this.modifyDimensions(radius,0,radius);
                this.base_calculatePoints();
            }
            else if(this.increment === 1) {
                this.modifyDimensions(radius,0,radius);
                this.ellipse_calculatePoints();
            }
        }
    }

    class CreateRectangle extends CreateObject {
        half_edges: string[];
        face: number[];
        increment: number;

        constructor (width = 10,depth = 10,increment = 0,start_vertex = 0) {
            super(width,0,depth,start_vertex);
            this.half_edges = [];
            this.face = [];
            this.increment = increment;

            for(let i = 0; i < 4; i++) {
                const num = i + 1 + increment + this.vert_st;
                const modulo_operand = 4 + increment + this.vert_st;
                const input_res = num % modulo_operand;
                const output_res = input_res === 0 ? increment + this.vert_st : input_res;
                this.half_edges.push(`${i + increment + this.vert_st}-${output_res}`);
                this.face.push(i + increment + this.vert_st);
            }

            if(this.increment === 0) this.mesh.addFace(this.face.join("-"));
        }

        base_calculatePoints() {
            this.points_list[0 + this.increment] = new Point3D(-this.width / 2,this.height / 2,-this.depth / 2);
            this.points_list[1 + this.increment] = new Point3D(this.width / 2,this.height / 2,-this.depth / 2);
            this.points_list[2 + this.increment] = new Point3D(this.width / 2,this.height / 2,this.depth / 2);
            this.points_list[3 + this.increment] = new Point3D(-this.width / 2,this.height / 2,this.depth / 2);
        }

        rectangle_editDimensions(width = this.width,depth = this.depth) {
            this.modifyDimensions(width,0,depth);
            this.base_calculatePoints();
        }
    }

    class CreatePyramidalBase {
        base_class: CreatePolygon | CreateRectangle;
        points_list: Point3D[];
        width: number;
        height: number;
        depth: number;
        constructor (vertex_number = 3,width = 10,height = 10,depth = 10,choice = 1,start_vertex = 0) {
            this.width = width;
            this.height = height;
            this.depth = depth;

            switch(choice) {
                case 1:
                    this.base_class = new CreatePolygon(vertex_number,width,depth,1,start_vertex);
                    break;
                case 2:
                    this.base_class = new CreateRectangle(width,depth,1,start_vertex);
            }
            this.base_class.height = height;
        }

        pyramid_calculatePoints() {
            this.base_class.points_list[0] = new Point3D(0,this.height / 2,0);
            this.base_class.base_calculatePoints();
            this.points_list = [...this.base_class.points_list];
        }

        pyramid_editDimensions(width = this.width,height = this.height,depth = this.depth) {
            this.base_class.modifyDimensions(width,height,depth);
            this.points_list = [];
            this.pyramid_calculatePoints();
        }
    }

    class CreatePyramid extends CreatePyramidalBase {
        half_edges: string[];
        faces: number[][];
        last: number;
        penultimate: number;
        primary: number;
        mesh: MeshDataStructure;
        constructor (base_vertex_number = 3,width = 10,height = 10,depth = 10,choice = 1,start_vertex = 0) {
            super(base_vertex_number,width,height,depth,choice,start_vertex);
            this.half_edges = [];
            this.faces = [];
            this.mesh = this.base_class.mesh;

            this.half_edges.push(...this.base_class.half_edges);
            this.faces.push(this.base_class.face);

            for(let i = 0; i < base_vertex_number; i++) {
                const proposed_half_edge = `${0}-${this.half_edges[i]}`;
                const permutations = misc.getPermutationsArr(proposed_half_edge.split("-").map(value => Number(value)),3);
                this.setMesh(permutations);
            }

            for(const face of this.faces) this.mesh.addFace(face.join("-"));
            this.pyramid_calculatePoints();
        }

        setMesh(permutations: number[][]) {
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
    }

    class CreateCone extends CreateEllipse {
        faces: number[][];
        last: number;
        penultimate: number;
        primary: number;

        constructor (radius = 10,base_vertex_number = 10,start_vertex = 0) {
            super(base_vertex_number,radius,radius,1,start_vertex);
            this.faces = [];
            this.faces.push(this.face);

            for(let i = 0; i < base_vertex_number; i++) {
                const proposed_half_edge = `${0}-${this.half_edges[i]}`;
                const permutations = misc.getPermutationsArr(proposed_half_edge.split("-").map(value => Number(value)),3);
                this.setMesh(permutations);
            }

            for(const face of this.faces) this.mesh.addFace(face.join("-"));
            this.ellipse_calculatePoints();
        }

        setMesh(permutations: number[][]) {
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

        cone_editDimensions_R(radius = this.width) {
            this.modifyDimensions(radius,0,radius);
            this.ellipse_calculatePoints();
        }

        cone_editDimensions_WD(width = this.width,depth = this.depth) {
            this.modifyDimensions(width,0,depth);
            this.ellipse_calculatePoints();
        }
    }

    class CreateCuboid extends CreateObject {
        default_faces: number[][];
        default_vertex_map: number[];

        constructor (width = 10,height = 10,depth = 10,start_vertex = 0) {
            super(width,height,depth,start_vertex);
            this.default_faces = [[0,1,2,3],[4,6,7,5],[0,3,6,4],[1,5,7,2],[3,2,7,6],[0,4,5,1]] // standard default mesh configuration
            for(const index in this.default_faces) {
                for(const sub_index in this.default_faces[index]) {
                    const value = this.default_faces[index][sub_index] + this.vert_st;
                    this.default_faces[index][sub_index] = value;
                }
            }
            this.default_vertex_map = [0,1,3,2,4,5,6,7];
            ;
            for(const face of this.default_faces) this.mesh.addFace(face.join("-"));
            this.cuboid_calculatePoints();
        }

        cuboid_editDimensions(width = this.width,height = this.height,depth = this.depth) {
            this.modifyDimensions(width,height,depth);
            this.cuboid_calculatePoints();
        }

        cuboid_calculatePoints() {
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
        }
    }


    class CreateSphere extends CreateObject {
        lat_divs: number;
        long_divs: number;
        radius: number;

        constructor (radius = 10,latitude_divisions = 10,longitude_divisions = 10,start_vertex = 0) {
            super(radius,radius,radius,start_vertex);
            this.lat_divs = latitude_divisions;
            this.long_divs = longitude_divisions;
            const north_pole = start_vertex;
            this.vert_st = ++start_vertex;
            this.radius = 0;
            const south_pole = ((this.lat_divs - 1) * this.long_divs) + this.vert_st + 1;

            for(let lat = 0; lat <= this.lat_divs; lat++) {
                if(lat === 0 || lat === this.lat_divs) continue;

                for(let long = 0; long < this.long_divs; long++) {
                    const first = ((lat - 1) * this.long_divs) + long;
                    const second = (first + 1) % this.long_divs + ((lat - 1) * this.long_divs);

                    if(lat === this.lat_divs - 1) {
                        this.mesh.addFace(`${first + this.vert_st}-${second + this.vert_st}-${south_pole}`);
                        continue;
                    }
                    if(lat === 1) this.mesh.addFace(`${north_pole}-${first + this.vert_st}-${second + this.vert_st}`);

                    const third = first + this.long_divs;
                    const fourth = (third + 1) % this.long_divs + (lat * this.long_divs)
                    this.mesh.addFace(`${first + this.vert_st}-${second + this.vert_st}-${fourth + this.vert_st}-${third + this.vert_st}`);
                }
            }

            this.sphere_calculatePoints();
        }

        sphere_calculatePoints() {
            for(let lat = 0; lat <= this.lat_divs; lat++) {
                const theta = lat * Math.PI;
                const sin_theta = Math.sin(theta);
                const cos_theta = Math.cos(theta);

                if(lat === 0 || lat === this.lat_divs) {
                    this.points_list.push(new Point3D(0,(this.height * cos_theta),0));
                }

                for(let long = 0; long < this.long_divs; long++) {
                    const phi = long * 2 * Math.PI;
                    const sin_phi = Math.sin(phi);
                    const cos_phi = Math.cos(phi);
                    this.points_list.push(new Point3D((this.width * sin_theta * cos_phi),(this.height * cos_theta),-(this.depth * sin_theta * sin_phi)));
                }
            }
        }

        sphere_editDimensions_R(radius = this.width) {
            this.modifyDimensions(radius,radius,radius);
            this.sphere_calculatePoints();
        }

        sphere_editDimensions_WHD(width = this.width,height = this.height,depth = this.depth) {
            this.modifyDimensions(width,height,depth);
            this.sphere_calculatePoints();
        }
    }

    class CreateTorus {}


    class CatmullClark {
        points_list: Point3D[];
        mesh: MeshDataStructure;
        face_points: Point3D[];
        edge_points: Point3D[];
        done_edges_dict: {};
        mesh_faces_len: number;
        tmp_faces: Set<string>;

        constructor (object: CreateObject) {
            this.points_list = object.points_list;
            this.mesh = object.mesh;
            this.face_points = [];
            this.edge_points = [];
            this.done_edges_dict = {};
            this.mesh_faces_len = 0;
            this.mesh.sorted_faces = [];
            this.tmp_faces = new Set();
        }

        getEdgePoints(edge: string): Point3D[] {
            return edge.split("-").map(value => this.points_list[Number(value)]);
        }

        getFacePoints(face: string): Point3D[] {
            return face.split("-").map(value => this.points_list[Number(value)]);
        }

        getPoints(array: number[]): Point3D[] {
            return array.map(value => this.points_list[value]);
        }

        insertVertexInHalfEdge(vertex: number,edge: string,face_index: number,consider_prev_next = true) {
            const [a,b] = edge.split("-").map(value => Number(value));
            const twin = `${b}-${a}`;
            const halfEdgeKey_1 = this.mesh.setHalfEdge(a,vertex,face_index);
            const halfEdgeKey_2 = this.mesh.setHalfEdge(vertex,b,face_index);


            if(consider_prev_next === true) {
                const prev = (this.mesh.HalfEdgeDict[edge] as _HALFEDGE_).prev;
                const next = (this.mesh.HalfEdgeDict[edge] as _HALFEDGE_).next;

                (this.mesh.HalfEdgeDict[halfEdgeKey_1] as _HALFEDGE_).prev = prev;
                (this.mesh.HalfEdgeDict[halfEdgeKey_2] as _HALFEDGE_).next = next;

                if(prev !== "-") (this.mesh.HalfEdgeDict[prev] as _HALFEDGE_).next = halfEdgeKey_1;
                if(next !== "-") (this.mesh.HalfEdgeDict[next] as _HALFEDGE_).prev = halfEdgeKey_2;
            }

            if(!this.mesh.HalfEdgeDict[twin]) this.mesh.edge_no--;

            delete this.mesh.HalfEdgeDict[edge];

            return [halfEdgeKey_1,halfEdgeKey_2];
        }

        iterate(iteration_num = 1,orig_iter = iteration_num + 1) {
            if(iteration_num <= 0) return;

            this.tmp_faces = new Set([...this.mesh.faces]);
            this.mesh.faces.clear();
            const overall_start = new Date().getTime();
            console.log(`Iteration Number : ${orig_iter - iteration_num}`);
            console.log(`Mesh faces difference : ${this.mesh_faces_len}`);
            console.log(`Points List Length : ${this.points_list.length}`);
            console.log(`Object Faces Length : ${this.tmp_faces.size}`);
            console.log(`Object Edges Length : ${Object.keys(this.mesh.HalfEdgeDict).length / 2}`);

            iteration_num--;

            const start = new Date().getTime();
            const fast_edge_list = this.mesh.edgeToNumber();
            const end = new Date().getTime();
            console.log(`Time taken to get fast edge list : ${end - start} ms`)
            let _a_ = new Date().getTime()
            const mesh_halfedgedict_copy = JSON.parse(JSON.stringify(this.mesh.HalfEdgeDict))
            let _b_ = new Date().getTime()
            console.log(`Time taken to copy mesh : ${_b_ - _a_} ms`);


            const face_start = new Date().getTime()
            for(const face of this.tmp_faces) {
                const face_points = this.getFacePoints(face);
                const sum = this.mesh.sumPoints(face_points);
                const len = face_points.length;

                const face_point = new Point3D(sum.x / len,sum.y / len,sum.z / len);
                this.face_points.push(face_point);
            }
            const face_end = new Date().getTime()
            console.log(`Time taken for face iteration : ${face_end - face_start} ms`)

            const edge_start = new Date().getTime()
            for(const edge in mesh_halfedgedict_copy) {
                const edge_vertices_full: Point3D[] = [];
                const [a,b] = edge.split("-");
                const twinHalfEdgeKey = b + "-" + a;

                const edge_face_index = (mesh_halfedgedict_copy[edge] as _HALFEDGE_).face_index - this.mesh_faces_len;
                const f_p_a = this.face_points[edge_face_index];

                const twin_edge_face_index = (mesh_halfedgedict_copy[twinHalfEdgeKey] as _HALFEDGE_).face_index - this.mesh_faces_len;
                const f_p_b = this.face_points[twin_edge_face_index];

                edge_vertices_full.push(this.points_list[Number(a)],this.points_list[Number(b)],f_p_a,f_p_b);
                const sum = this.mesh.sumPoints(edge_vertices_full);

                const edge_point = new Point3D(sum.x / 4,sum.y / 4,sum.z / 4);
                const edge_index = this.edge_points.push(edge_point) - 1 + this.face_points.length + this.points_list.length;

                if(mesh_halfedgedict_copy[twinHalfEdgeKey]) delete mesh_halfedgedict_copy[twinHalfEdgeKey] // we don't need the twin halfedges again in the mesh halfedge dict copy
                this.done_edges_dict[edge] = edge_index;
                this.done_edges_dict[twinHalfEdgeKey] = edge_index;
            }
            const edge_end = new Date().getTime()
            console.log(`Time taken for edge iteration : ${edge_end - edge_start} ms`)

            const point_start = new Date().getTime()
            var FofV = 0;
            var EofV = 0;
            var EDofV = 0;
            var FDofV = 0;
            for(const point_index in this.points_list) {
                const P = this.points_list[point_index];
                const F_list: Point3D[] = [];
                const R_list: Point3D[] = [];
                var n_f = 0;
                var n_e = 0;

                const EofV_start = new Date().getTime();
                const edge_list = this.mesh.getEdgesOfVertexFast(Number(point_index),fast_edge_list);
                const EofV_end = new Date().getTime();
                EofV += EofV_end - EofV_start;

                const EDofV_start = new Date().getTime();
                edge_list.map(value => {
                    const edge_vertices = value.split("-").map(value => this.points_list[Number(value)]);
                    const sum = this.mesh.sumPoints(edge_vertices);
                    const edge_midpoint = new Point3D(sum.x / 2,sum.y / 2,sum.z / 2);
                    R_list.push(edge_midpoint);
                    n_e++;
                })
                const EDofV_end = new Date().getTime();
                EDofV += EDofV_end - EDofV_start;

                const FofV_start = new Date().getTime()
                const face_index_list = this.mesh.getFaceIndexesOfVertexSpecific(edge_list);
                const FofV_end = new Date().getTime();
                FofV += FofV_end - FofV_start;

                const FDofV_start = new Date().getTime();
                face_index_list.map(value => {
                    const face_point = this.face_points[value - this.mesh_faces_len];
                    F_list.push(face_point);
                    n_f++;
                })
                const FDofV_end = new Date().getTime();
                FDofV += FDofV_end - FDofV_start;

                const n = (n_f + n_e) / 2

                const f_sum = this.mesh.sumPoints(F_list);
                const r_sum = this.mesh.sumPoints(R_list);

                const F = new Point3D(f_sum.x / n,f_sum.y / n,f_sum.z / n);
                const R = new Point3D(r_sum.x / n,r_sum.y / n,r_sum.z / n);

                const X = (F.x + 2 * R.x + (n - 3) * P.x) / n;
                const Y = (F.y + 2 * R.y + (n - 3) * P.y) / n;
                const Z = (F.z + 2 * R.z + (n - 3) * P.z) / n;

                this.points_list[point_index] = new Point3D(X,Y,Z);
            }
            const point_end = new Date().getTime()
            console.log(`Current Mesh Multiplier value : ${this.mesh.multiplier}`)
            console.log(`Time taken to get edges of vertex : ${EofV} ms`)
            console.log(`Time taken to get edge points of edges of vertex : ${EDofV} ms`)
            console.log(`Time taken to get faces of edges of vertex : ${FofV} ms`)
            console.log(`Time taken to get face points of faces of edges of vertex : ${EDofV} ms`)
            console.log(`Time taken for point iteration : ${point_end - point_start} ms`)



            const p_len = this.points_list.length;
            this.mesh_faces_len += this.tmp_faces.size;
            this.points_list.push(...this.face_points,...this.edge_points);

            const face_index_start = new Date().getTime();
            for(const face of this.tmp_faces) {
                const face_list_index = this.mesh.getFaceIndexOfFace(face);
                const face_edges = this.mesh.getEdgesOfFace(face.split("-").map(value => Number(value)));
                const boundary: string[] = [];

                for(const face_edge_index in face_edges) {
                    const face_edge = face_edges[face_edge_index];
                    const index = this.done_edges_dict[face_edge];
                    const halfEdgeKeys = this.insertVertexInHalfEdge(index,face_edge,-1,false);

                    boundary.push(...halfEdgeKeys);
                }

                const b_len = boundary.length;
                const iter_num = b_len * 0.5;
                let edge_index = 0;
                while(edge_index < iter_num) {
                    const [a,b] = boundary[((Number(edge_index) * 2) + 1) % b_len].split("-").map(value => Number(value)); // shift the edge index
                    const [c,d] = boundary[((Number(edge_index) * 2) + 2) % b_len].split("-").map(value => Number(value)); // shift the edge index

                    const third_edge = this.mesh.setHalfEdge(d,p_len + Number(face_list_index));
                    const fourth_edge = this.mesh.setHalfEdge(p_len + Number(face_list_index),a);

                    (this.mesh.HalfEdgeDict[`${a}-${b}`] as _HALFEDGE_).face_vertices = [a,b,d,p_len + Number(face_list_index)];
                    (this.mesh.HalfEdgeDict[`${c}-${d}`] as _HALFEDGE_).face_vertices = [a,b,d,p_len + Number(face_list_index)];
                    (this.mesh.HalfEdgeDict[third_edge] as _HALFEDGE_).face_vertices = [a,b,d,p_len + Number(face_list_index)];
                    (this.mesh.HalfEdgeDict[fourth_edge] as _HALFEDGE_).face_vertices = [a,b,d,p_len + Number(face_list_index)];

                    const face_index_beta = this.mesh.faces.add(`${a}-${b}-${d}-${p_len + Number(face_list_index)}`).size - 1 + this.mesh_faces_len;

                    (this.mesh.HalfEdgeDict[`${a}-${b}`] as _HALFEDGE_).face_index = face_index_beta;
                    (this.mesh.HalfEdgeDict[`${c}-${d}`] as _HALFEDGE_).face_index = face_index_beta;
                    (this.mesh.HalfEdgeDict[third_edge] as _HALFEDGE_).face_index = face_index_beta;
                    (this.mesh.HalfEdgeDict[fourth_edge] as _HALFEDGE_).face_index = face_index_beta;
                    this.mesh.face_index_map[face_index_beta] = [a,b,d,p_len + Number(face_list_index)].join("-");

                    (this.mesh.HalfEdgeDict[`${a}-${b}`] as _HALFEDGE_).prev = fourth_edge;
                    (this.mesh.HalfEdgeDict[`${c}-${d}`] as _HALFEDGE_).prev = `${a}-${b}`;
                    (this.mesh.HalfEdgeDict[third_edge] as _HALFEDGE_).prev = `${c}-${d}`;
                    (this.mesh.HalfEdgeDict[fourth_edge] as _HALFEDGE_).prev = third_edge;

                    (this.mesh.HalfEdgeDict[`${a}-${b}`] as _HALFEDGE_).next = `${c}-${d}`;
                    (this.mesh.HalfEdgeDict[`${c}-${d}`] as _HALFEDGE_).next = third_edge;
                    (this.mesh.HalfEdgeDict[third_edge] as _HALFEDGE_).next = fourth_edge;
                    (this.mesh.HalfEdgeDict[fourth_edge] as _HALFEDGE_).next = `${a}-${b}`;

                    this.mesh.face_indexes_set.add(face_index_beta);
                    this.mesh.maxFaceIndex();
                    edge_index++;
                }
                this.mesh.face_indexes_set.delete(-1);
            }
            const face_index_end = new Date().getTime()
            console.log(`Time taken for face iteration to get boundary : ${face_index_end - face_index_start} ms`)

            this.tmp_faces.clear();
            this.face_points = [];
            this.edge_points = [];
            this.done_edges_dict = {};
            const overall_end = new Date().getTime();
            console.log(`Total time taken : ${overall_end - overall_start} ms`)

            console.log("\n\n");
            this.iterate(iteration_num,orig_iter);
        }

        triangulate() {
            return this.mesh.triangulate(this.points_list);
        }

        display() {
            return { points: this.points_list,mesh: this.mesh };
        }
    }

    function toPoints2D(pointList: any[]): Point2D[] {
        const retList: Point2D[] = [];
        for(let point in pointList) {
            retList[point] = new Point2D(pointList[point][0],pointList[point][1]);
        }
        return retList;
    }

    function toPoints3D(pointList: any[]): Point3D[] {
        const retList: Point3D[] = [];
        for(let point in pointList) {
            retList[point] = new Point3D(pointList[point][0],pointList[point][1],pointList[point][2]);
        }
        return retList;
    }

    const misc = new Miscellanous();

    const pyramid = new CreatePyramid();
    const cube = new CreateCuboid();

    const sphere = new CreateSphere(5,6,8,0);

    console.log(sphere.mesh.faces);
    console.log(sphere.mesh.HalfEdgeDict)
    console.log(sphere.points_list)

    // console.log("\n\n\n\n\n\n")

    // console.log("CUBE : ")

    // const cube_catmull_clark = new CatmullClark(cube);
    // cube_catmull_clark.iterate(5);

    // cube.mesh.removeHalfEdge("0-1")

    // console.log("Egde to number : ")


    // const e_s = new Date().getTime();
    // const c_f_e = cube_catmull_clark.mesh.edgeToNumber()
    // const e_e = new Date().getTime()
    // const c_e_v = cube_catmull_clark.mesh.getEdgesOfVertexFast(0, c_f_e)
    // const e_v = new Date().getTime()
    // const c_f = cube_catmull_clark.mesh.getFacesOfVertexSpecific(c_e_v)
    // const e_f = new Date().getTime();
    // const no_hf = cube_catmull_clark.mesh.getEdgesOfVertex(0, true);
    // const e_no_hf = new Date().getTime();
    // const hf = cube_catmull_clark.mesh.getEdgesOfVertex(0, false)
    // const e_hf = new Date().getTime();
    // const n_f = cube_catmull_clark.mesh.getFacesOfVertexGeneric(0);
    // const e_nf = new Date().getTime();

    // console.log(c_f_e)
    // console.log(c_e_v)
    // console.log(c_f)
    // console.log(no_hf)
    // console.log(hf)
    // console.log(n_f)

    // console.log(`Time taken to get all egdes connections: ${e_e - e_s} ms`)
    // console.log(`Time taken to get all edges of vertex : ${e_v - e_e} ms`)
    // console.log(`Time taken to get all faces of vertex with specific method: ${e_f - e_v} ms`)
    // console.log(`Time taken to get all edges of vertex with no halfedge : ${e_no_hf - e_f} ms`)
    // console.log(`Time taken to get all edges of vertex with halfedge : ${e_hf - e_no_hf} ms`)
    // console.log(`Time taken to get all faces of vertex with generic method : ${e_nf - e_hf} ms`)



    // console.log("\n\n\n",cube.mesh)

    // const cube_catmull_clark = new CatmullClark(cube);
    // const pyramid_catmull_clark = new CatmullClark(pyramid);

    // console.log("CUBE\n\n\n")
    // console.log(cube_catmull_clark.display().points)
    // console.log(cube_catmull_clark.display().mesh.faces)

    // var cutr = cube_catmull_clark.triangulate()
    // console.log(cutr.points)
    // console.log(cutr.mesh.faces)

    //cube_catmull_clark.iterate(6);

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

    //pyramid_catmull_clark.iterate(6);

    // console.log(pyramid_catmull_clark.display().points)
    // console.log(pyramid_catmull_clark.display().mesh.faces)

    // pytr = pyramid_catmull_clark.triangulate()
    // console.log(pytr.points)
    // console.log(pytr.mesh.faces)

    // console.log("DONE");

})()
