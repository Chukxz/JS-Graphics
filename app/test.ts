(function () {

    type _GETQUART_ = { ang: number,axis: _3D_VEC_; quart: _4D_VEC_; inv_quart: _4D_VEC_ };
    /*
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
                    console.log(this.face_vertices_tmp,"_____")
                    console.log(last_index, "****")
    
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
        const pyramid_catmull_clark = new CatmullClark(pyramid);
    
        console.log("CUBE\n\n\n")
        console.log(cube_catmull_clark.display().points)
        console.log(cube_catmull_clark.display().mesh.faces)
    
        var cutr = cube_catmull_clark.triangulate()
        console.log(cutr.points)
        console.log(cutr.mesh.faces)
    
        cube_catmull_clark.iterate(1);
    
        console.log(cube_catmull_clark.display().points)
        console.log(cube_catmull_clark.display().mesh.faces)
    
        cutr = cube_catmull_clark.triangulate()
        console.log(cutr.points)
        console.log(cutr.mesh.faces)
    
        console.log("PYRAMID\n\n\n")
        console.log(pyramid_catmull_clark.display().points)
        console.log(pyramid_catmull_clark.display().mesh.faces)
    
        var pytr = pyramid_catmull_clark.triangulate()
        console.log(pytr.points)
        console.log(pytr.mesh.faces)
    
        pyramid_catmull_clark.iterate(1);
    
        console.log(pyramid_catmull_clark.display().points)
        console.log(pyramid_catmull_clark.display().mesh.faces)
    
        pytr = pyramid_catmull_clark.triangulate()
        console.log(pytr.points)
        console.log(pytr.mesh.faces)
    
        console.log("DONE");
    
    */

    interface _BASIC_PARAMS_ {
        _GLOBAL_ALPHA: number,
        _CANVAS_OPACITY: string,
        _CANVAS_WIDTH: number,
        _CANVAS_BACKGROUND_COLOR: string,
        _LAST_CANVAS_WIDTH: number,
        _CANVAS_HEIGHT: number,
        _BORDER_COLOR: string,
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
        _GRID_VERT_THETA: number,
        _ACTIVE: string,
        _SIDE_BAR_WIDTH: number,
    }

    const DEFAULT_PARAMS: _BASIC_PARAMS_ =
    {
        _GLOBAL_ALPHA: 1,
        _CANVAS_OPACITY: '1',
        _CANVAS_WIDTH: 100,
        _CANVAS_HEIGHT: 100,
        _CANVAS_BACKGROUND_COLOR: "#888",
        _LAST_CANVAS_WIDTH: 100,
        _BORDER_COLOR: '#aaa',
        _THETA: 0,
        _ANGLE_UNIT: "deg",
        _ANGLE_CONSTANT: Math.PI / 180,
        _REVERSE_ANGLE_CONSTANT: 180 / Math.PI,
        _HANDEDNESS: "left",
        _HANDEDNESS_CONSTANT: 1,
        _X: [1,0,0],
        _Y: [0,1,0],
        _Z: [0,0,1],
        _Q_VEC: [0,0,0],
        _Q_QUART: [0,0,0,0],
        _Q_INV_QUART: [0,0,0,0],
        _NZ: 0.1,
        _FZ: 100,
        _PROJ_ANGLE: 60,
        _ASPECT_RATIO: 1,
        _DIST: 1,
        _HALF_X: 1,
        _HALF_Y: 1,
        _PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _INV_PROJECTION_MAT: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _GRID_VERT_THETA: 15,
        _ACTIVE: "",
        _SIDE_BAR_WIDTH: 100,
    }

    const MODIFIED_PARAMS: _BASIC_PARAMS_ = JSON.parse(JSON.stringify(DEFAULT_PARAMS));

    class Miscellanous {
        constructor () {}
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
        resetDepthBuffer(depthBuffer: Float64Array) {
            return depthBuffer.fill(Infinity);
        }
        initFrameBuffer() {
            const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
            return new Uint8Array(elementNum * 4);
        }
        resetFrameBuffer(frameBuffer: Uint8Array) {
            return frameBuffer.map((value,index) => {
                const mod4 = index % 4;
                if(mod4 < 3) {
                    return value = 0;
                } else
                    return value = 255;
            });
        }
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
        getParamAsList(maxPLen: number,paramList: number[]): number[] {
            if(arguments.length === 2) {
                const key = `${paramList}-${maxPLen}`;
                if(pListCache[key] !== undefined) {
                    return pListCache[key];
                }
                var count = 0;
                var compParamList: number[] = [];
                for(let i of paramList) {
                    if(i < maxPLen) {
                        compParamList[count] = i;
                        count++;
                    }
                }
                pListCache[key] = compParamList;
                return compParamList;
            }
            return [0];
        }
        getParamAsArg(maxPLen = Infinity,...args: number[]): number[] {
            const key = `${args}-${maxPLen}`;
            if(pArgCache[key] !== undefined) {
                return pArgCache[key];
            }
            if(arguments.length > 1 && arguments.length <= 4) {
                var start = 0;
                var end = maxPLen;
                var interval = 1;
                if(arguments.length === 2) {
                    if(arguments[1] !== undefined) {
                        end = Math.min(arguments[1],maxPLen);
                    } else {
                        end = maxPLen;
                    }
                } else {
                    start = arguments[1] || 0;
                    if(arguments[1] !== undefined) {
                        end = Math.min(arguments[2],maxPLen);
                    } else {
                        end = maxPLen;
                    }
                    interval = arguments[3] || 1;
                }
                var count = 0;
                var index = 0;
                var compParamList: number[] = [];
                for(let i = start; i < end; i++) {
                    index = start + (count * interval);
                    if(index < end) {
                        compParamList[count] = index;
                        count++;
                    }
                }
                pArgCache[key] = compParamList;
                return compParamList;
            }
            return [0];
        }
        createArrayFromArgs(length): any[] {
            var arr = new Array(length || 0),
                i = length;
            if(arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments,1);
                while(i--) {
                    arr[length - 1 - i] = this.createArrayFromArgs.apply(this,args);
                }
            }
            return arr;
        }
        createArrayFromList(param: number[]): any[] {
            var arr = new Array(param[0] || 0),
                i = param[0];
            if(param.length > 1) {
                var args = Array.prototype.slice.call(param,1);
                while(i--) {
                    arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this,args);
                }
            }
            return arr;
        }

        getArrayIndex(array: number[],value: number) {
            for(let i = 0; i < array.length; i++) {
                if(array[i] === value) return i;
                else return -1;
            }
            return -1;
        }
        deepCopy(val: any) {
            var res = JSON.parse(JSON.stringify(val));
            if(typeof structuredClone === "function") {
                res = structuredClone(val);
            }
            return res;
        }

        toPoints2D(pointList: any[]): Point2D[] {
            const retList: Point2D[] = [];
            for(let point in pointList) {
                retList[point] = new Point2D(pointList[point][0],pointList[point][1]);
            }
            return retList;
        }

        toPoints3D(pointList: any[]): Point3D[] {
            const retList: Point3D[] = [];
            for(let point in pointList) {
                retList[point] = new Point3D(pointList[point][0],pointList[point][1],pointList[point][2]);
            }
            return retList;
        }

        points2DTo3D(pointList: Point2D[],z_coords: number[],use_z_coords = false): Point3D[] {
            const retList: Point3D[] = [];
            var index = 0;
            for(let point of pointList) {
                if(use_z_coords === true) {
                    retList.push(new Point3D(point.x,point.y,z_coords[index]));
                    index++;
                }
                else retList.push(new Point3D(point.x,point.y,0));
            }
            return retList;
        }

        points3DTo2D(pointList: Point3D[]): Point2D[] {
            const retList: Point2D[] = [];
            for(let point of pointList) {
                retList.push(new Point2D(point.x,point.y));
            }
            return retList;
        }

        points3DToVec3D(pointList: Point3D[]): _3D_VEC_[] {
            const retList: _3D_VEC_[] = [];
            for(let point of pointList) {
                retList.push([point.x,point.y,point.z])
            }
            return retList;
        }

        vecs3DToPoints3D(vecList: _3D_VEC_[]): Point3D[] {
            const retList: Point3D[] = [];
            for(let vec of vecList) {
                retList.push(new Point3D(vec[0],vec[1],vec[2]));
            }
            return retList;
        }

        vecs4DToPoints3D(vecList: _4D_VEC_[]) {
            const retList: Point3D[] = [];
            for(let vec of vecList) {
                retList.push(new Point3D(vec[0],vec[1],vec[2]));
            }
            return retList;
        }

        vecs4DToPoints2D(vecList: _4D_VEC_[]) {
            const retList: Point2D[] = [];
            for(let vec of vecList) {
                retList.push(new Point2D(vec[0],vec[1]));
            }
            return retList;
        }

        genEdgefromArray(array: number[],sort = true) {
            var prev = array[array.length - 1]; // set previous to last element in the array
            var a = 0;
            var b = 0;
            const result: string[] = [];

            for(let index in array) {
                if(sort === true) { [a,b] = [Math.min(prev,array[index]),Math.max(prev,array[index])]; }
                else[a,b] = [prev,array[index]];
                result[index] = `${a}-${b}`;
                prev = array[index];
            }

            return result;
        }

        genArray(min: number,n: number,diff: number,decimal: boolean) {
            const list: number[] = [];
            for(let i = 0; i < n; i++) {
                if(decimal === true) list[i] = min + Math.random() * diff;
                else if(decimal === false) list[i] = Math.round(min + Math.random() * diff);
            }
            return list;
        }

        generatePointsArray(minX = 0,maxX = 100,minY = 0,maxY = 100,n = 10,decimal = false) {
            const _minX = Math.min(minX,maxX);
            const _maxX = Math.max(minX,maxX);
            const _minY = Math.min(minY,maxY);
            const _maxY = Math.max(minY,maxY);
            const diffX = _maxX - _minX;
            const diffY = _maxY - _minY;

            const xlist = this.genArray(_minX,n,diffX,decimal);
            const ylist = this.genArray(_minY,n,diffY,decimal);

            const xylist: number[][] = [];

            for(let i = 0; i < n; i++) {
                xylist[i] = [xlist[i],ylist[i]];
            }

            return xylist;
        }

        getRanHex = (size = 1) => [...Array(size)].map((elem) => elem = Math.floor(Math.random() * 16).toString(16)).join("");

        ranHexCol = (num = 100,size = 6,exclude_col = "black") => [...Array(num)].map((elem,index) => elem = index === 0 ? exclude_col : "#" + this.getRanHex(size));
    }

    class Linear {
        constructor () {}
        getSlope(A_: _2D_VEC_,B_: _2D_VEC_) {
            var numer = B_[1] - A_[1];
            var denum = B_[0] - A_[0];
            return numer / denum;
        }
        getMid(a: number[],b: number[],paramList: number[]) {
            var ret: any[] = [];
            var count = 0;
            for(let val of paramList) {
                ret.push([(a[val] + b[val]) / 2]);
                count++;
            }
            return ret;
        }
        getDist(a: number[],b: number[],paramList: number[]) {
            var ret = 0;
            const pLen = paramList.length;
            for(let val = 0; val < pLen; val++) {
                ret += (a[val] - b[val]) ** 2;
            }
            return Math.sqrt(ret);
        }
        getTriArea(a: number,b: number,c: number) {
            var S = (a + b + c) / 2;
            return Math.sqrt(S * (S - a) * (S - b) * (S - c));
        }
        isInsideCirc(point: Point2D,circle: _3D_VEC_) {
            const x = Math.abs(point.x - circle[0]);
            const y = Math.abs(point.y - circle[1]);
            const r = circle[2];
            if((x ** 2 + y ** 2) <= r ** 2) {
                return true;
            } else
                return false;
        }
        isInsideTri(pvec: _3D_VEC_,avec: _3D_VEC_,bvec: _3D_VEC_,cvec: _3D_VEC_) {
            const [TotalArea,triA,triB,triC] = this.interpolateTriCore2(pvec,avec,bvec,cvec);
            const sum = triA + triB + triC;
            if(Math.round(sum) === Math.round(TotalArea)) {
                return true;
            }
            return false;
        }
        getCircumCircle(a: Point2D,b: Point2D,c: Point2D): Point2D {
            const mid_AB = [(a.x + b.x) / 2,(a.y + b.y) / 2];
            const mid_AC = [(a.x + c.x) / 2,(a.y + c.y) / 2];
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
            if(Math.abs(grad_AB) === 0) {
                X = mid_AB[0];
                compute_X = false;
            } else if(Math.abs(grad_AB) === Infinity) {
                Y = mid_AB[1];
                compute_Y = false;
            }

            if(Math.abs(grad_AC) === 0) {
                X = mid_AC[0];
                compute_X = false;
            } else if(Math.abs(grad_AC) === Infinity) {
                Y = mid_AC[1];
                compute_Y = false;
            }

            if(compute_X === true) X = (intercept_norm_AB - intercept_norm_AC) / (norm_AC - norm_AB);
            if(compute_Y === true) Y = (norm_AB * X) + intercept_norm_AB;
            const r_squared = (a.x - X) ** 2 + (a.y - Y) ** 2;

            return new Point2D(X,Y,(Math.sqrt(r_squared)));
        }

        getInCircle(a: Point2D,b: Point2D,c: Point2D): Point2D {
            const BC = Math.sqrt((c.x - b.x) ** 2 + (c.y - b.y) ** 2);
            const AC = Math.sqrt((c.x - a.x) ** 2 + (c.y - a.y) ** 2);
            const AB = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
            const X = (BC * a.x + AC * b.x + AB * c.x) / (AB + AC + BC);
            const Y = (BC * a.y + AC * b.y + AB * c.y) / (AB + AC + BC)
            const s = (AB + AC + BC) / 2
            const r_squared = ((s - AB) * (s - AC) * (s - BC)) / s;

            return new Point2D(X,Y,(Math.sqrt(r_squared)));
        }

        findCircTriFSq(rect: _4D_VEC_,angle = 45): Point2D[] {
            var mid = (rect[2] / 2) + rect[0];
            var lSmall = rect[2] / 2;
            var hSmall = Math.tan((angle * Math.PI) / 180) * lSmall;
            var hBig = hSmall + rect[3];
            var lBig = hBig / (Math.tan((angle * Math.PI) / 180));
            var A = new Point2D(mid - lBig,rect[1] + rect[3]);
            var B = new Point2D(mid,rect[1] - hSmall);
            var C = new Point2D(mid + lBig,rect[1] + rect[3]);

            return [A,B,C];
        }

        getTriBoundingRect(vertices: Point2D[]): _4D_VEC_ {
            var n = vertices.length;
            var xArr = [0,0,0];
            var yArr = [0,0,0];
            var xmin = Infinity;
            var ymin = Infinity;
            var xmax = 0;
            var ymax = 0;
            for(let i = 0; i < n; i++) {
                xArr[i] = vertices[i].x;
                yArr[i] = vertices[i].y;
                if(xArr[i] < xmin) {
                    xmin = xArr[i];
                }
                if(yArr[i] < ymin) {
                    ymin = yArr[i];
                }
                if(xArr[i] > xmax) {
                    xmax = xArr[i];
                }
                if(yArr[i] > ymax) {
                    ymax = yArr[i];
                }
            }

            return [xmin,ymin,xmax - xmin,ymax - ymin];
        }

        superTriangle(pointList: Point2D[]): Point2D[] {
            const rect = this.getTriBoundingRect(pointList);
            const tri = this.findCircTriFSq(rect);

            return tri;
        }

        interpolateTriCore1(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            const indexList = [0,1];
            const Adist = _Linear.getDist(bvec,cvec,indexList);
            const Bdist = _Linear.getDist(avec,cvec,indexList);
            const Cdist = _Linear.getDist(avec,bvec,indexList);
            const apdist = _Linear.getDist(pvec,avec,indexList);
            const bpdist = _Linear.getDist(pvec,bvec,indexList);
            const cpdist = _Linear.getDist(pvec,cvec,indexList);

            return [Adist,Bdist,Cdist,apdist,bpdist,cpdist];
        }
        interpolateTriCore2(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            const [Adist,Bdist,Cdist,apdist,bpdist,cpdist] = this.interpolateTriCore1(pvec,avec,bvec,cvec);
            const TotalArea = _Linear.getTriArea(Adist,Bdist,Cdist);
            const triA = _Linear.getTriArea(Adist,bpdist,cpdist);
            const triB = _Linear.getTriArea(Bdist,apdist,cpdist);
            const triC = _Linear.getTriArea(Cdist,apdist,bpdist);

            return [TotalArea,triA,triB,triC];
        }
        interpolateTriCore3(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            const [TotalArea,triA,triB,triC] = this.interpolateTriCore2(pvec,avec,bvec,cvec);
            const aRatio = triA / TotalArea;
            const bRatio = triB / TotalArea;
            const cRatio = triC / TotalArea;
            const aPa = _Matrix.scaMult(aRatio,avec);
            const bPb = _Matrix.scaMult(bRatio,bvec);
            const cPc = _Matrix.scaMult(cRatio,cvec);

            return _Matrix.matAdd(_Matrix.matAdd(aPa,bPb),cPc);
        }

        interpolateTri(pvec: _2D_VEC_ | _3D_VEC_,avec: _2D_VEC_ | _3D_VEC_,bvec: _2D_VEC_ | _3D_VEC_,cvec: _2D_VEC_ | _3D_VEC_) {
            return this.interpolateTriCore3(pvec,avec,bvec,cvec);
        }

        // Given three collinear points p,q,r, the function checks if
        // point q lies on line segment "pr"
        onSegment(p: Point2D,q: Point2D,r: Point2D) {
            if(q.x <= Math.max(p.x,r.x) && q.x >= Math.min(p.x,r.x) &&
                q.y <= Math.max(p.y,r.y) && q.y >= Math.min(p.y,r.y))
                return true;

            return false;
        }

        //To find orientation of ordered triplet (p,q,r),
        //The function returns the following values
        // 0 --> p,q and r are collinear
        // 1 --> Clockwise
        // 2 --> Counterclockwise
        findOrientation(p: Point2D,q: Point2D,r: Point2D) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

            if(val === 0) return 0; // collinear

            return (val > 0) ? 1 : 2 // clock or counterclock wise
        }


        // if val returned is 0, points are collinear
        // if val returned is greater than 0, points are clockwise
        // if val returned is lesser than 0, points are counterclockwise
        findOrientationDegree(p: Point2D,q: Point2D,r: Point2D) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

            return val;
        }

        // The main function that returns true if line segment 'p1q1'
        // and 'p2q2' intersect
        doIntersect(p1: Point2D,q1: Point2D,p2: Point2D,q2: Point2D) {
            // Find the four orientations needed for general and 
            //special cases
            const o1 = this.findOrientation(p1,q1,p2);
            const o2 = this.findOrientation(p1,q1,q2);
            const o3 = this.findOrientation(p2,q2,p1);
            const o4 = this.findOrientation(p2,q2,q1);

            // General Case

            if(o1 !== o2 && o3 !== o4) return true;

            // Special Cases
            // p1,q1 and p2 are collinear and p2 lies on segment p1q1
            if(o1 === 0 && this.onSegment(p1,p2,q1)) return true;

            // p1,q1 and q2 are collinear and q2 lies on segment p1q1
            if(o2 === 0 && this.onSegment(p1,q2,q1)) return true;

            // p2,q2 and p1 are collinear and p1 lies on segment p2q2
            if(o3 === 0 && this.onSegment(p2,p1,q2)) return true;

            // p2,q2 and q1 are collinear and q1 lies on segment p2q2
            if(o4 === 0 && this.onSegment(p2,q1,q2)) return true;

            return false; // Doesnt't fall in any of the above cases
        }

        mostCWPoint(p: Point2D,q: Point2D,points: Point2D[]) {
            var orientation = 0;
            var index = -1;
            for(let point in points) {
                const res = this.findOrientationDegree(p,q,points[point]);
                if(res > orientation) {
                    orientation = res;
                    index = Number(point);
                }
            }
            return index;
        }

        mostCCWPoint(p: Point2D,q: Point2D,points: Point2D[]) {
            var orientation = 0;
            var index = -1;
            for(let point in points) {
                const res = this.findOrientationDegree(p,q,points[point]);
                if(res < orientation) {
                    orientation = res;
                    index = Number(point);
                }
            }
            return index;
        }

        getSmallestTriArea(p: Point2D,p_index: number,q: Point2D,q_index: number,points: Point2D[]) {
            var area = Infinity;
            var index = -1;
            for(let point_ in points) {
                const point = Number(point_)
                if(point === p_index || point === q_index) continue;
                const r = points[point];
                const pq = Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
                const pr = Math.sqrt((p.x - r.x) ** 2 + (p.y - r.y) ** 2);
                const qr = Math.sqrt((q.x - r.x) ** 2 + (q.y - r.y) ** 2);

                const tri_area = this.getTriArea(pq,pr,qr);

                if(tri_area < area) {
                    area = tri_area;
                    index = point;
                }
            }

            return index;
        }

        get_gradient(p: Point2D,q: Point2D) {
            return ((q.y - p.y) / (q.x - p.x));
        }

        get_distance(p: Point2D,q: Point2D) {
            return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
        }

        get_midpoint(p: Point2D,q: Point2D) {
            return new Point2D((p.x + q.x) * 0.5,(p.y + q.y) * 0.5);
        }

        getLineFromPointGradient(p: Point2D,gradient: number,x_scale: number,invert = false) {
            const intercept = p.y - gradient * p.x;
            const new_x = invert ? p.x - x_scale : p.x + x_scale;
            const new_y = gradient * new_x + intercept;
            return new Point2D(new_x,new_y,0);
        }

        specialGetLineFromPointGradient(p1: Point2D,q1: Point2D,p2: Point2D,gradient: number,x_scale: number) {
            const intercept = p2.y - gradient * p2.x;
            const new_a_x = p2.x + x_scale;
            const new_a_y = gradient * new_a_x + intercept;
            const new_b_x = p2.x - x_scale;
            const new_b_y = gradient * new_b_x + intercept;
            const q2_a = new Point2D(new_a_x,new_a_y);
            const q2_b = new Point2D(new_b_x,new_b_y);
            const q2 = this.doIntersect(p1,q1,p2,q2_a) ? q2_a : q2_b;
            return q2;
        }
    }

    class Quarternion {
        theta: number;
        q_vector: _3D_VEC_;
        q_quarternion: _4D_VEC_;
        q_inv_quarternion: _4D_VEC_;

        constructor () {
            this.q_vector = DEFAULT_PARAMS._Q_VEC
            this.q_quarternion = DEFAULT_PARAMS._Q_QUART;
            this.q_inv_quarternion = DEFAULT_PARAMS._Q_INV_QUART;
            this.theta = DEFAULT_PARAMS._THETA;
        }

        vector(input_vec: _3D_VEC_) {
            // normalize flag to normalize vector (create a unit vector)
            const [v1,v2,v3] = input_vec;
            const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3,-0.5);
            this.q_vector = [v1 * inv_mag,v2 * inv_mag,v3 * inv_mag];
        }

        q_mag(quart: _4D_VEC_) {
            const [w,x,y,z] = quart;
            return Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,0.5);
        }

        quarternion() {
            // quarternion
            const [v1,v2,v3] = this.q_vector;
            const [a,b] = [Math.cos(this.theta * 0.5),Math.sin(this.theta * 0.5)];
            const [w,x,y,z] = [a,v1 * b,v2 * b,v3 * b];
            this.q_quarternion = [w,x,y,z];
            const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,-0.5);
        };

        inv_quartenion() {
            // inverse quarternion           
            const [v1,v2,v3] = this.q_vector;
            const [a,b] = [Math.cos(this.theta * 0.5),Math.sin(this.theta * 0.5)];
            const [w,x,y,z] = [a,-v1 * b,-v2 * b,-v3 * b];
            this.q_inv_quarternion = [w,x,y,z];
            const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,-0.5);
        };

        q_mult(quart_A: _4D_VEC_,quart_B: _4D_VEC_): _4D_VEC_ {
            // quarternion _ quarternion multiplication
            const [w1,x1,y1,z1] = quart_A;
            const [w2,x2,y2,z2] = quart_B;

            return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2),(w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2),(w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2),(w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
        }

        q_v_invq_mult(input_vec: _3D_VEC_): _3D_VEC_ {
            // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
            // with additional translating (for points) and scaling (for point and vectors) capabilities
            const output_vec: _4D_VEC_ = [0,...input_vec]

            return this.q_mult(this.q_quarternion,this.q_mult(output_vec,this.q_inv_quarternion)).splice(1) as _3D_VEC_;
        }

        q_v_q_mult(input_vec: _3D_VEC_): _3D_VEC_ {
            // quarternion _ vector _ quarternion multiplication for point and vector reflection
            // with additional translating (for points) and scaling (for point and vectors) capabilities
            const output_vec: _4D_VEC_ = [0,...input_vec]

            return this.q_mult(this.q_quarternion,this.q_mult(output_vec,this.q_quarternion)).splice(1) as _3D_VEC_;
        }

        q_rot(_angle: number = 0,_vector: _3D_VEC_ = [0,0,1],_point: _3D_VEC_ = [0,0,0]): _3D_VEC_ {
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
            this.vector(_vector);
            this.quarternion();
            this.inv_quartenion();
            return this.q_v_invq_mult(_point);
        }

        q_ref(_angle: number = 0,_vector: _3D_VEC_ = [0,0,1],_point: _3D_VEC_ = [0,0,0]): _3D_VEC_ {
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
            this.vector(_vector);
            this.quarternion();
            return this.q_v_q_mult(_point);
        }
    }


    class Matrix {
        constructor () {}

        // // Pitch
        // rotX(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1];
        // }

        // // Yaw
        // rotY(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, 1, 0, 0, -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, Math.cos(angle), 0, 0, 0, 0, 1];
        // }

        // //Roll
        // rotZ(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        // }

        // rot3d(x : number, y : number, z : number) : _16D_VEC_ {
        //     return this.matMult(this.rotZ(z), this.matMult(this.rotY(y), this.rotX(x), [4, 4], [4, 4]), [4, 4], [4, 4]) as _16D_VEC_;
        // };

        // transl3d(x : number, y : number, z : number) : _16D_VEC_ {
        //     return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
        // }

        // scale3dim(x : number, y : number, z : number) : _16D_VEC_ {
        //     return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
        // }

        // setObjTransfMat(Sx, Sy, Sz, Rx, Ry, Rz, Tx, Ty, Tz) {
        //     // None of the scale parameters should equal zero as that would make the determinant of the matrix
        //     // equal to zero, thereby making it impossible to get the inverse of the matrix (Zero Division Error)
        //     if (Sx === 0) {
        //         Sx += 0.01;
        //     }
        //     if (Sy === 0) {
        //         Sy += 0.01;
        //     }
        //     if (Sz === 0) {
        //         Sz += 0.01;
        //     }
        //     this.objTransfMat = this.matMult(this.transl3d(Tx, Ty, Tz), this.matMult(this.rot3d(Rx, Ry, Rz), this.scale3dim(Sx, Sy, Sz), [4, 4], [4, 4]), [4, 4], [4, 4]);
        // }

        matMult(matA: number[],matB: number[],shapeA: _2D_VEC_,shapeB: _2D_VEC_): number[] {
            if(shapeA[1] !== shapeB[0]) return []
            else {
                const matC: number[] = []

                for(let i = 0; i < shapeA[0]; i++) {
                    for(let j = 0; j < shapeB[1]; j++) {
                        var sum: number = 0;
                        for(let k = 0; k < shapeB[0]; k++) {
                            sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                        }
                        matC.push(sum);
                    }
                }
                return matC;
            }
        }

        scaMult(scalarVal: number,matIn: number[],leaveLast: boolean = false): number[] {
            const matInlen: number = matIn.length;
            const matOut: number[] = [];
            for(let i = 0; i < matInlen; i++) {
                if(i === matInlen - 1 && leaveLast === true) {
                    // Do nothing...don't multiply the last matrix value by the scalar value
                    // useful when perspective division is going on.
                    matOut.push(matIn[i]);
                } else {
                    matOut.push(matIn[i] * scalarVal);
                }
            }
            return matOut;
        }

        matAdd(matA: number[],matB: number[],neg: boolean = false): number[] {
            const matC: number[] = [];
            const matAlen: number = matA.length;
            const matBlen: number = matB.length;
            var sgn: number = 1;

            if(neg === true) {
                sgn = -1;
            }

            if(matAlen === matBlen) {
                for(let i = 0; i < matAlen; i++) {
                    matC.push(matA[i] + sgn * matB[i]);
                }
            }

            return matC;
        }

        getTranspMat(matIn: number[],shapeMat: _2D_VEC_): number[] {
            const shpA = shapeMat[0];
            const shpB = shapeMat[1];
            const matOut: number[] = [];

            for(let i = 0; i < shpB; i++) {
                for(let j = 0; j < shpA; j++) {
                    matOut.push(matIn[(j * shpB) + i]);
                }
            }

            return matOut;
        }

        getIdentMat(val: number): number[] {
            const num: number = val ** 2;
            const matOut: number[] = [];

            for(let i = 0; i < num; i++) {
                if(i % val === 0) {
                    matOut.push(1);
                } else matOut.push(0);
            }

            return matOut;
        }

        getRestMat(matIn: number[],shapeNum: number,row: number,column: number): number[] {
            const matOut: number[] = [];

            for(let i = 0; i < shapeNum; i++) {
                for(let j = 0; j < shapeNum; j++) {
                    if(i !== row && j !== column) {
                        matOut.push(matIn[(i * shapeNum) + j]);
                    }
                }
            }

            return matOut;
        }

        getDet(matIn: number | number[],shapeNum: number): number {
            if(shapeNum > 0) {
                // If it is a 1x1 matrix, return the matrix
                if(shapeNum === 1) {
                    return matIn as number;
                }
                // If it is a 2x2 matrix, return the determinant
                if(shapeNum === 2) {
                    return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
                }
                // If it an nxn matrix, where n > 2, recursively compute the determinant,
                //using the first row of the matrix
                else {
                    var res: number = 0;
                    const tmp: number[] = [];

                    for(let i = 0; i < shapeNum; i++) {
                        tmp.push(matIn[i]);
                    }

                    const cofMatSgn = this.getCofSgnMat([1,shapeNum]);

                    var a = 0;
                    const cofLen: number = cofMatSgn.length;

                    for(let i = 0; i < cofLen; i++) {
                        var ret: number[] = this.getRestMat(matIn as number[],shapeNum,a,i);

                        var verify = this.getDet(ret,shapeNum - 1);

                        res += (cofMatSgn[i] * tmp[i] * verify);
                    }

                    return res;
                }
            }

            else return 0;
        }

        getMinorMat(matIn: number[],shapeNum: number): number[] {
            const matOut: number[] = [];

            for(let i = 0; i < shapeNum; i++) {
                for(let j = 0; j < shapeNum; j++) {
                    const result: number = this.getDet(this.getRestMat(matIn,shapeNum,i,j),shapeNum - 1);
                    matOut.push(result);
                }
            }

            return matOut;
        }

        getCofSgnMat(shapeMat: _2D_VEC_): number[] {
            const shpA: number = shapeMat[0];
            const shpB: number = shapeMat[1];
            const matOut: number[] = [];

            for(let i = 0; i < shpA; i++) {
                for(let j = 0; j < shpB; j++) {
                    if((i + j) % 2 === 0) {
                        matOut.push(1);
                    } else matOut.push(-1);
                }
            }

            return matOut;
        }

        getCofMat(matIn: number[],shapeNum: number): number[] {
            const cofMatSgn: number[] = this.getCofSgnMat([shapeNum,shapeNum]);
            const minorMat: number[] = this.getMinorMat(matIn,shapeNum);

            const matOut: number[] = [];
            const len: number = shapeNum ** 2;

            for(let i = 0; i < len; i++) {
                matOut.push(cofMatSgn[i] * minorMat[i]);
            }

            return matOut;
        }

        getAdjMat(matIn: number[],shapeNum: number): number[] {
            const result: number[] = this.getCofMat(matIn,shapeNum);

            return this.getTranspMat((result as number[]),[shapeNum,shapeNum]);
        }

        getInvMat(matIn: number[],shapeNum: number): number[] | undefined {
            const det_result: number = this.getDet(matIn,shapeNum);

            if(det_result === 0) return undefined;

            const adj_result: number[] = this.getAdjMat(matIn,shapeNum);

            return _Matrix.scaMult(1 / det_result,(adj_result as number[]));
        }
    }

    class Vector {
        constructor () {}

        mag(vec: number | number[]): number {
            if(typeof vec === "number") return vec;
            const v_len: number = vec.length;
            var magnitude: number = 0;

            for(let i = 0; i < v_len; i++) {
                magnitude += vec[i] ** 2
            }

            return Math.sqrt(magnitude);
        }

        normalizeVec(vec: number[]): number[] {
            const len: number = vec.length;
            const magnitude: number = this.mag(vec);
            const ret_vec: number[] = [];

            for(let i = 0; i < len; i++) {
                ret_vec[i] = vec[i] / magnitude;
            }

            return ret_vec;
        }

        dotProduct(vecA_or_magA: number | number[],vecB_or_magB: number | number[],angle: number | undefined = undefined): number {
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 2d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).

            // Use vectors if you know the components e.g [x,y] values for 2d vectors, [x,y,z] values for 3d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.

            if(typeof angle === "number") { // Magnitude use.
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
                return (vecA_or_magA as number) * (vecB_or_magB as number) * Math.cos(toRad);
            }

            const vec_a_len = (vecA_or_magA as number[]).length;
            const vec_b_len = (vecB_or_magB as number[]).length;

            //verify first that both vectors are of the same size and both are 2d or higher.
            if(vec_a_len === vec_b_len && vec_b_len >= 2) {
                var dot_product = 0;

                for(let i = 0; i < vec_a_len; i++) {
                    dot_product += vecA_or_magA[i] * vecB_or_magB[i];
                }
                return dot_product;
            }

            return 0;
        }

        getDotProductAngle(vecA: number[],vecB: number[]): number { // get the angle between two vectors.
            const dot_product = this.dotProduct(vecA,vecB);
            const cosAng = Math.acos(dot_product as number / (this.mag(vecA) * this.mag(vecB)));

            return MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * cosAng;
        }

        getCrossProductByMatrix(vecs: number[][],vecs_len: number) {
            var cross_product: number[] = [];
            const proper_vec_len: number = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var matrix_array_top_row: number[] = [];

            for(let i = 0; i < proper_vec_len; i++) {
                matrix_array_top_row[i] = 0 // Actually the number 0 is just a placeholder as we don't need any numbers here but we put 0 to make it a number array.
            }

            var same_shape: number = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            var other_rows_array: number[] = [];

            for(let i = 0; i < vecs_len; i++) {
                const vec_len = vecs[i].length;
                if(vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else other_rows_array.push(...vecs[i]); // Else if the vector is the same dimension with n + 1, push the vector to a matrix array.
            }

            if(same_shape === 0) { // All the vectors are the same dimension of n + 1.
                const matrix_array = [...matrix_array_top_row,...other_rows_array];
                const storeCofSgn = _Matrix.getCofSgnMat([proper_vec_len,1]);

                for(let i = 0; i < proper_vec_len; i++) {
                    const rest_matrix_array = _Matrix.getRestMat(matrix_array,proper_vec_len,0,i);
                    cross_product[i] = storeCofSgn[i] * _Matrix.getDet(rest_matrix_array,vecs_len);
                }
            }

            return cross_product;
        }

        crossProduct(vecs_or_mags: number[] | number[][],angle: number | undefined = undefined,unitVec: number[] | undefined = undefined): number | number[] {
            var cross_product: number | number[] = [];
            const vecs_or_mags_len = (vecs_or_mags as number[]).length;
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 3d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).

            // Use vectors if you know the components e.g [x,y,z] values for 3d vectors, [w,x,y,z] values for 4d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
            if(typeof angle === "undefined") { // Vector use.
                cross_product = [...this.getCrossProductByMatrix((vecs_or_mags as number[][]),vecs_or_mags_len)];
            }

            if(typeof angle === "number") { // Magnitude use.
                var magnitude = 1 // initial magnitude place holder
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;

                for(let i = 0; i < vecs_or_mags_len; i++) {
                    magnitude *= (vecs_or_mags as number[])[i];
                }

                if(typeof unitVec === "undefined") cross_product = magnitude * Math.sin(toRad);
                else if(typeof unitVec === "object") cross_product = _Matrix.scaMult(magnitude * Math.sin(toRad),unitVec);
            }

            return cross_product;
        }

        getCrossProductAngle(vecs: number[][]): number | undefined { // get the angle between the vectors (makes sense in 3d, but feels kinda weird for higher dimensions but sorta feels like it works...???)
            var cross_product_angle: number | undefined = undefined;
            const vecs_len = vecs.length;
            const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            const cross_product_mag = this.mag(this.crossProduct(vecs));
            var vecs_m = 1;

            for(let i = 0; i < vecs_len; i++) {
                const vec_len = (vecs[i] as number[]).length;
                if(vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else vecs_m *= this.mag((vecs as number[][])[i]);
            }

            if(same_shape === 0) {
                const sinAng = Math.asin(cross_product_mag / vecs_m);
                const fromRad = MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT * sinAng;
                cross_product_angle = fromRad;
            }

            return cross_product_angle;
        }

        getCrossPUnitVec(vecs: number[][]) {
            var cross_product_unit_vec: number[] = [];

            const cross_product = this.crossProduct(vecs);
            const cross_product_mag = this.mag(cross_product);
            cross_product_unit_vec = _Matrix.scaMult(1 / cross_product_mag,(cross_product as number[]));

            return cross_product_unit_vec;
        }
    }

    const _Miscellanous = new Miscellanous();
    const _Linear = new Linear();
    const _Matrix = new Matrix();
    const _Quarternion = new Quarternion();
    const _Vector = new Vector();

    const U = [1,0,0]
    const V = [0,1,0]
    const N = [0,0,1]

    const C = [10,10,-10]
    const T = [0,0,0]

    const diff = _Matrix.matAdd(T,C,true);

    const prevN = _Vector.normalizeVec([0,0,1]);
    const newN = _Vector.normalizeVec(diff)

    console.log(_Vector.getDotProductAngle(prevN,newN))
    console.log(_Vector.getDotProductAngle(newN,prevN))
    console.log(_Vector.getCrossProductAngle([prevN,newN]))
    console.log(_Vector.getCrossProductAngle([newN,prevN]))

    console.log(_Vector.crossProduct([prevN,newN]))

    console.log("prevN mag : ",_Vector.mag(prevN),"newN mag : ",_Vector.mag(newN))

    const ang = _Vector.getDotProductAngle(prevN,newN);

    const crossP = _Vector.crossProduct([prevN,newN]);

    function getQuart(start: _3D_VEC_,end: _3D_VEC_): Quarternion {
        const vector = new Vector();
        const quarternion = new Quarternion();

        const angle = vector.getDotProductAngle(start,end);
        const cross_product = vector.crossProduct([start,end]) as _3D_VEC_;
        quarternion.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * angle;
        quarternion.vector(cross_product);
        quarternion.quarternion();
        quarternion.inv_quartenion();

        return quarternion;
    }

    console.log(getQuart(prevN as _3D_VEC_,newN as _3D_VEC_));

    const q = _Quarternion.q_rot(ang,crossP as _3D_VEC_,prevN as _3D_VEC_);
    console.log("\nquart_vector : ",_Quarternion.q_vector,"\nquart : ",_Quarternion.q_quarternion,"\ninv_quart : ",_Quarternion.q_inv_quarternion);
    console.log("\nprevN : ",prevN,"\nnewN : ",newN,"\nresult ",q,"\nang : ",ang,"\nquart_ang : ",_Quarternion.theta * MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT,"\ncrossP : ",crossP)

    const qu = getQuart(prevN as _3D_VEC_, newN as _3D_VEC_);
    console.log("new U : ",qu.q_v_invq_mult(U as _3D_VEC_));
    console.log("new V : ",qu.q_v_invq_mult(V as _3D_VEC_));
    console.log("new N : ",qu.q_v_invq_mult(N as _3D_VEC_));

    console.log(_Matrix.matAdd(T,diff,true))
    console.log(C)


    // const center = [0,0,-10];
    // const new_center = _Quarternion.q_rot(180, [0,1,0], center as _3D_VEC_);

    // console.log(_Quarternion.q_rot(180, [0,1,0], center as _3D_VEC_))

    // const new_diff = _Matrix.matAdd([0,0,0], new_center, true);

    // console.log(new_diff)

    // const nN = _Vector.normalizeVec(new_diff)

    // console.log(nN)

//     console.log(_Quarternion.q_rot(180, [0,1,0], [0,0,1]))

const diff_ = _Matrix.matAdd([0,0,-3], [0,0,-15],true)

    console.log(diff_)

    const n_diff_ = _Quarternion.q_rot(180, [0,1,0], diff_ as _3D_VEC_)

console.log(n_diff_)

const n_c_ = _Matrix.matAdd([0,0,-3],n_diff_,true)

console.log(n_c_)
})()
