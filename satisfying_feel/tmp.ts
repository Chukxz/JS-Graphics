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
    }

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
                    backtrack(i+1,currentCombination);
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
            const start = new Date().getTime();
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
            const end = new Date().getTime();
            console.log(`Time taken to triangulate : ${end - start} ms`);
            return { "points": triangulated_points_list, mesh : new_mesh };
        }    
    }

    class CreateObject{
        width : number;
        height : number;
        depth : number;
        points_list : Point3D[]
        mesh : MeshDataStructure;
        constructor(){
            this.points_list = [];
            this.mesh = new MeshDataStructure();
        }

        changePoint(index : number, new_x : number, new_y : number, new_z : number){
            this.points_list[index] = new Point3D(new_x, new_y, new_z);
        }
    }

    class CreateBox extends CreateObject {
        default_faces: number[][];
        constructor (width = 100,height = 100,depth = 100) {
            super();
            this.points_list = [];
            this.width = width/2;
            this.height = height/2;
            this.depth = depth/2;
            this.default_faces = [[0,1,2,3],[4,6,7,5],[0,3,6,4],[1,5,7,2],[3,2,7,6],[0,4,5,1]] // standard default mesh configuration

            console.log(this.default_faces)

            for(const face of this.default_faces) this.mesh.addFace(face.join("-"));
            this.calculatePoints();
        }

        editDimensions(width : number, height : number, depth : number){
            this.points_list = [];
            this.width = width/2;
            this.height = height/2;
            this.depth = depth/2;

            this.calculatePoints();
        }

        calculatePoints(){
            //-~(-((0+num)%2)*2) ouputs -1 if num = 0, else 1 if num = 1

            var sgn_k = 1;
            var sgn_j = 1;
            var sgn_i = 1;
            for(let k = 0; k<2; k++){
                for(let j = 0; j<2; j++){
                    for(let i = 0; i<2; i++){
                        const index = k*4+j*2+i;

                        if (k === 0) sgn_k = -1;
                        else sgn_k = 1;
                        if (j === 0) sgn_j = -1;
                        else sgn_j = 1;
                        if (index === 0 || index === 3 || index === 4 || index === 7) sgn_i = -1;
                        else sgn_i = 1;

                        this.points_list[index] = new Point3D(sgn_i*this.width, sgn_j*this.height, sgn_k*this.depth);
                    }
                }
            }
        }
    }

    class CreatePyramidalBase extends CreateObject{
        base_length: number;
        base_half_edges: string[];
        base_face: number[];
        constructor (base_length : number, width : number, height : number, depth : number) {
            super();
            this.width = width/2;
            this.height = height/2;
            this.depth = depth/2;
            this.base_half_edges = [];
            this.base_face = [];
            this.base_length = base_length;

            for(let i = 0; i < base_length; i++) {
                this.base_half_edges.push(`${i + 1}-${(i + 1) % base_length + 1}`);
                this.base_face.push(i + 1);
            }
        }

        calculatePoints(){
            const angle_inc = 360 / this.base_length;
            this.points_list[0] = new Point3D(0, this.height, 0);

            for(let i = 0; i < this.base_length; i++) {
                const cur_ang = i * angle_inc;
                const conv = Math.PI / 180;
                this.points_list[i+1] = new Point3D(Math.cos((cur_ang+90)*conv)*this.width, -this.height, Math.sin((cur_ang+90)*conv)*this.depth);
            }
        }
    }

    class CreatePyramid extends CreatePyramidalBase {
        half_edges: string[];
        faces: number[][];
        last: number;
        penultimate: number;
        primary: number;
        constructor (base_length = 3, width = 100, height = 100, depth = 100) {
            super(base_length, width, height, depth);
            this.half_edges = [];
            this.faces = [];
            this.mesh = new MeshDataStructure();
            this.half_edges.push(...this.base_half_edges);
            this.faces.push(this.base_face);

            for(let i = 0; i < base_length; i++) {
                const proposed_half_edge = `${0}-${this.half_edges[i]}`;
                const permutations = misc.getPermutationsArr(proposed_half_edge.split("-").map((value) => Number(value)),3);
                this.setMesh(permutations);
            }

            console.log(this.faces)
            for(const face of this.faces) this.mesh.addFace(face.join("-"));
            this.calculatePoints();
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

        editDimensions(width : number, height : number, depth : number){
            this.points_list = [];
            this.width = width/2;
            this.height = height/2;
            this.depth = depth/2;

            this.calculatePoints();
        }
    }


    class CatmullClark {
        points_list: Point3D[];
        mesh: MeshDataStructure;
        face_points: Point3D[];
        edge_points: Point3D[];
        done_edges: string[];
        done_indexes : number[]

        constructor (object : CreateObject) {
            this.points_list = object.points_list;
            this.mesh = object.mesh;
            this.face_points = [];
            this.edge_points = [];
            this.done_edges = [];
            this.done_indexes = [];
        }

        getEdgePoints(edge : string): Point3D[] {
            return edge.split("-").map((value) => this.points_list[Number(value)]);
        }

        getFacePoints(face : string): Point3D[] {
            return face.split("-").map((value) => this.points_list[Number(value)]);
        }

        getPoints(array : number[]): Point3D[] {
            return array.map((value) => this.points_list[value]);
        }

        insertVertexInHalfEdge(vertex: number,edge: string) {
            const [a,b] = edge.split("-").map((value) => Number(value));
            const twin = `${b}-${a}`;

            const prev = (this.mesh.HalfEdgeDict[edge] as _HALFEDGE_).prev;
            const next = (this.mesh.HalfEdgeDict[edge] as _HALFEDGE_).next;

            const halfEdgeKey_1 = this.mesh.setHalfEdge(a,vertex);
            const halfEdgeKey_2 = this.mesh.setHalfEdge(vertex,b);

            (this.mesh.HalfEdgeDict[halfEdgeKey_1] as _HALFEDGE_).prev = prev;
            (this.mesh.HalfEdgeDict[halfEdgeKey_2] as _HALFEDGE_).next = next;

            if(prev !== "-") (this.mesh.HalfEdgeDict[prev] as _HALFEDGE_).next = halfEdgeKey_1;
            if(next !== "-") (this.mesh.HalfEdgeDict[next] as _HALFEDGE_).prev = halfEdgeKey_2;

            if(!this.mesh.HalfEdgeDict[twin]) this.mesh.edge_no--;

            delete this.mesh.HalfEdgeDict[edge];

            return [halfEdgeKey_1,halfEdgeKey_2];
        }

        iterate(iteration_num = 1, orig_iter = iteration_num+1) {

            if(iteration_num <= 0) return;
            const overall_start = new Date().getTime();
            console.log(`Iteration Number : ${orig_iter-iteration_num}`);
            console.log(`Points List Length : ${this.points_list.length}`);
            console.log(`Object Faces Length : ${this.mesh.faces.length}`);
            console.log(`Object Edges Length : ${Object.keys(this.mesh.HalfEdgeDict).length/2}`);

            iteration_num--;

            const start = new Date().getTime();
            const fast_edge_list = this.mesh.edgeToNumber();
            const end = new Date().getTime();
            console.log(`Time taken to get fast edge list : ${end - start} ms`)
            

            const face_start = new Date().getTime()
            for(const face of this.mesh.faces) {
                const face_points = this.getFacePoints(face);
                const sum = this.mesh.sumPoints(face_points);
                const len = face_points.length;

                const face_point = new Point3D(sum.x / len,sum.y / len,sum.z / len);
                this.face_points.push(face_point);
            }
            const face_end = new Date().getTime()
            console.log(`Time taken for face iteration : ${face_end - face_start} ms`)


            const edge_start = new Date().getTime()
            for(const edge in this.mesh.HalfEdgeDict) {
                const edge_vertices_full: Point3D[] = [];
                const [a,b] = edge.split("-");
                const twinHalfEdgeKey = `${b}-${a}`;

                if(!this.done_edges.includes(edge)) {
                    const edge_vertices = (this.mesh.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices;
                    const edge_face_index = this.mesh.faces.indexOf(edge_vertices.join("-"));
                    const f_p_a = this.face_points[edge_face_index];

                    const twin_edge_vertices = (this.mesh.HalfEdgeDict[twinHalfEdgeKey] as _HALFEDGE_).face_vertices;
                    const twin_edge_face_index = this.mesh.faces.indexOf(twin_edge_vertices.join("-"));
                    const f_p_b = this.face_points[twin_edge_face_index];

                    edge_vertices_full.push(this.points_list[Number(a)],this.points_list[Number(b)],f_p_a,f_p_b);
                    const sum = this.mesh.sumPoints(edge_vertices_full);

                    const edge_point = new Point3D(sum.x / 4,sum.y / 4,sum.z / 4);
                    const edge_index = this.edge_points.push(edge_point) - 1 + this.face_points.length + this.points_list.length;
                
                    this.done_edges.push(edge, twinHalfEdgeKey);
                    this.done_indexes.push(edge_index, edge_index);
                }
            }
            const edge_end = new Date().getTime()
            console.log(`Time taken for edge iteration : ${edge_end - edge_start} ms`)

            const point_start = new Date().getTime()
            var FofV = 0;
            var EofV = 0
            for(const point_index in this.points_list) {
                const P = this.points_list[point_index];
                const F_list: Point3D[] = [];
                const R_list: Point3D[] = [];
                var n_f = 0;
                var n_e = 0;

                const EofV_start = new Date().getTime();
                const edge_list = this.mesh.getEdgesOfVertexFast(Number(point_index), fast_edge_list);

                edge_list.map((value) => {
                    const edge_vertices = value.split("-").map((value) => this.points_list[value]);
                    const sum = this.mesh.sumPoints(edge_vertices);
                    const edge_midpoint = new Point3D(sum.x / 2,sum.y / 2,sum.z / 2);
                    R_list.push(edge_midpoint);
                    n_e++;
                })
                const EofV_end = new Date().getTime();
                EofV += EofV_end-EofV_start;

                const FofV_start = new Date().getTime()
                this.mesh.getFacesofVertexSpecific(edge_list).map((value) => {
                    const face_index = this.mesh.faces.indexOf(value.join("-"));
                    const face_point = this.face_points[face_index];
                    F_list.push(face_point);
                    n_f++;
                })
                const FofV_end = new Date().getTime();
                FofV += FofV_end-FofV_start;

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
            console.log(this.mesh.multiplier)
            console.log(`Time taken to get edges of vertex : ${EofV} ms`)
            console.log(`Time taken to get faces of vertex : ${FofV} ms`)
            console.log(`Time taken for point iteration : ${point_end - point_start} ms`)



            const p_len = this.points_list.length;
            const mesh_faces_len = this.mesh.faces.length;

            this.points_list.push(...this.face_points,...this.edge_points);

            const face_index_start = new Date().getTime()
            for(const face_index in this.mesh.faces) {
                const face = this.mesh.faces[face_index];
                const face_edges = this.mesh.getEdgesofFace(face.split("-").map((value) => Number(value)));
                const boundary: string[] = [];

                for(const face_edge_index in face_edges) {
                    const face_edge = face_edges[face_edge_index];

                    const index = this.done_indexes[this.done_edges.indexOf(face_edge)];
                    const halfEdgeKeys = this.insertVertexInHalfEdge(index, face_edge);
                    
                    boundary.push(...halfEdgeKeys);
                }

                const inter_num = boundary.length * 0.5;
                let edge_index = 0;
                while(edge_index < inter_num) {
                    const [a,b] = boundary[(Number(edge_index) * 2 + 1) % boundary.length].split("-").map((value) => Number(value)); // shift the edge index
                    const [c,d] = boundary[(Number(edge_index) * 2 + 2) % boundary.length].split("-").map((value) => Number(value)); // shift the edge index

                    const third_edge = this.mesh.setHalfEdge(d,p_len + Number(face_index));
                    const fourth_edge = this.mesh.setHalfEdge(p_len + Number(face_index),a);

                    (this.mesh.HalfEdgeDict[`${a}-${b}`] as _HALFEDGE_).face_vertices = [a, b, d, p_len + Number(face_index)];
                    (this.mesh.HalfEdgeDict[`${c}-${d}`] as _HALFEDGE_).face_vertices = [a, b, d, p_len + Number(face_index)];
                    (this.mesh.HalfEdgeDict[third_edge] as _HALFEDGE_).face_vertices = [a, b, d, p_len + Number(face_index)];
                    (this.mesh.HalfEdgeDict[fourth_edge] as _HALFEDGE_).face_vertices = [a, b, d, p_len + Number(face_index)];

                    this.mesh.faces.push(`${a}-${b}-${d}-${p_len + Number(face_index)}`);
                    edge_index++;
                }
            }
            const face_index_end = new Date().getTime()
            console.log(`Time taken for face iteration to get boundary : ${face_index_end - face_index_start} ms`)



            this.mesh.faces.splice(0, mesh_faces_len);
            this.face_points = [];
            this.edge_points = [];
            this.done_edges = [];
            this.done_indexes = [];
            const overall_end = new Date().getTime();
            console.log(`Total time taken : ${overall_end - overall_start} ms`)

            console.log("\n\n")

            this.iterate(iteration_num, orig_iter);
        }

        triangulate(){
            return this.mesh.triangulate(this.points_list);
        }

        display() {
            return { points: this.points_list, mesh: this.mesh};
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
    const cube = new CreateBox();

    const cube_catmull_clark = new CatmullClark(cube);
    cube_catmull_clark.iterate(5);


    console.log(cube.mesh)

    // cube.mesh.removeHalfEdge("0-1")

    console.log("Egde to number : ")


    const e_s = new Date().getTime();
    const c_f_e = cube.mesh.edgeToNumber()
    const e_e = new Date().getTime()
    const c_e_v = cube.mesh.getEdgesOfVertexFast(0, c_f_e)
    const e_v = new Date().getTime()
    const c_f = cube.mesh.getFacesofVertexSpecific(c_e_v)
    const e_f = new Date().getTime();
    const no_hf = cube.mesh.getEdgesofVertex(0, true);
    const e_no_hf = new Date().getTime();
    const hf = cube.mesh.getEdgesofVertex(0, false)
    const e_hf = new Date().getTime();

    console.log(c_f_e)
    console.log(c_e_v)
    console.log(c_f)
    console.log(no_hf)
    console.log(hf)

    console.log(`Time taken to get all egdes connections: ${e_e - e_s} ms`)
    console.log(`Time taken to get all edges of vertex : ${e_v - e_e} ms`)
    console.log(`Time taken to get all faces of vertex : ${e_f - e_v} ms`)
    console.log(`Time taken to get all edges of vertex with no halfedge : ${e_no_hf - e_f} ms`)
    console.log(`Time taken to get all edges of vertex with halfedge : ${e_hf - e_no_hf} ms`)


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

})()