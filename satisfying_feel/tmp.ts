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
            const permutations: number[] = [];

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
            const combinations: number[] = [];

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

    class MeshDataStructure {
        HalfEdgeDict: {};
        face_tmp: number[];
        faces: string[];
        prev: string | null;
        next: string | null;
        temp: string | null;
        face_vertices_tmp: number[];
        edge_no: number;
        vertex_no: number;
        vertex_indexes: Set<number>;

        constructor (vertex_num = 0) {
            this.HalfEdgeDict = {};
            this.face_tmp = [];
            this.faces = [];
            this.prev = null;
            this.next = null;
            this.temp = null;
            this.face_vertices_tmp = [];
            this.edge_no = 0;
            this.vertex_no = vertex_num;
            this.vertex_indexes = new Set();
        }

        halfEdge(start: number,end: number): _HALFEDGE_ {
            this.vertex_indexes.add(start);
            this.vertex_indexes.add(end);
            this.vertex_no = [...this.vertex_indexes].length;
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
                if(this.getFacesofVertex(a).length <= 1) {
                    this.vertex_indexes.delete(Number(a));
                    new_face_vertices.delete(Number(a));
                }

                // if vertex b belongs to only one face remove it and modify the face vertices
                if(this.getFacesofVertex(b).length <= 1) {
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
                if(prev_halfEdgeKey !== "-") {
                    (this.HalfEdgeDict[prev_halfEdgeKey] as _HALFEDGE_).next = "-";

                    while(prev_halfEdgeKey !== "-") {
                        (this.HalfEdgeDict[prev_halfEdgeKey] as _HALFEDGE_).face_vertices = [...new_face_vertices];
                        cur_halfEdgeKey = prev_halfEdgeKey;
                        prev_halfEdgeKey = (this.HalfEdgeDict[prev_halfEdgeKey] as _HALFEDGE_).prev;
                        if(delete_associated_half_edges === true) delete this.HalfEdgeDict[cur_halfEdgeKey];
                    }
                }

                // If the next halfedge exists
                if(next_halfEdgeKey !== "-") {
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

        getEdgesofVertex(vertex: string | number,no_half_edge = false) {
            const edge_list: string[] = [];

            for(const edge in this.HalfEdgeDict) {
                if(no_half_edge === true) {
                    const [a,b] = edge.split("-");
                    var rev = b + "-" + a;

                    if((edge.split("-").includes(`${vertex}`)) && !edge_list.includes(edge) && !edge_list.includes(rev)) edge_list.push(edge);
                }

                else {
                    if((edge.split("-").includes(`${vertex}`)) && !edge_list.includes(edge)) edge_list.push(edge); // edge touches vertex and is not in the edge_list
                }
            }

            return edge_list;
        }

        getFacesofVertex(vertex: string | number) {
            const face_list: string[] = [];
            const faces: number[][] = [];
            const edge_list = this.getEdgesofVertex(vertex);

            for(const edge of edge_list) {
                const face = (this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices;
                if(!face_list.includes(face.join("-"))) {
                    face_list.push(face.join("-"));
                    faces.push(face);
                }
            }

            return faces;
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

        addFace(face: number[]) {
            this.face_vertices_tmp = face;

            // If face is not found in faces add face to faces and set its halfedges
            if(!this.faces.includes(this.face_vertices_tmp.join("-"))) {
                this.faces.push(this.face_vertices_tmp.join("-"));

                for(const i in face) {
                    const halfEdgeKey = this.setHalfEdge(face[i],face[(Number(i) + 1) % face.length]);
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

        removeFace(face: number[]) {
            let found_edges = 0;

            const face_len = face.length;

            // Check if face is found in faces, if yes remove it
            if(this.faces.includes(face.join("-"))) {
                // iterate through the edges until an edge's face marching the face is found
                for(const edge in this.HalfEdgeDict) {
                    // Check if the edge's vertices marches the face's vertices
                    if((this.HalfEdgeDict[edge] as _HALFEDGE_).face_vertices.join("-") === face.join("-")) {
                        let old_halfEdgeKey = edge;
                        let new_halfEdgeKey = (this.HalfEdgeDict[old_halfEdgeKey] as _HALFEDGE_).next;
                        // remove the halfedge later (we are postponing the removal of the original halfedge here)
                        found_edges++;

                        // Try to crawl with next until the found edges tally with the face's length
                        while(found_edges < face_len) {
                            // If the next halfedge is non-existent break the while loop
                            if(new_halfEdgeKey === "-") {
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
                            if(new_halfEdgeKey === "-") break; // If the previous halfedge is non-existent break the while loop

                            old_halfEdgeKey = new_halfEdgeKey;
                            new_halfEdgeKey = (this.HalfEdgeDict[old_halfEdgeKey] as _HALFEDGE_).prev; // update the halfedge
                            this.removeHalfEdge(old_halfEdgeKey,false); // remove the halfedge non-iteratively
                            found_edges++;
                        }

                        // If the found edges don't yet still tally with the face's length at this point we leave it like that and proceed to remove the original halfedge that we postponed

                        this.removeHalfEdge(edge,false); // remove the halfedge
                        this.faces.splice(this.faces.indexOf(face.join("-")),1);

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

        triangulate() {}
    }

    class CreateBox {
        width: number;
        height: number;
        depth: number;
        mesh: MeshDataStructure;
        default_faces: number[][];
        constructor (width = 10,height = 10,depth = 10) {
            this.width = width;
            this.height = height;
            this.depth = depth;
            this.mesh = new MeshDataStructure();
            this.default_faces = [[0,1,2,3],[4,5,6,7],[0,3,6,5],[1,4,7,2],[2,7,6,3],[0,5,4,1]] // standard default mesh configuration
            for(const face of this.default_faces) this.mesh.addFace(face);
        }
    }

    class CreatePyramid {
        base_length: number;
        base_half_edges: string[];
        base_face: number[];
        constructor (base_length = 3) {
            this.base_half_edges = [];
            this.base_face = [];

            for(let i = 0; i < base_length; i++) {
                this.base_half_edges.push(`${i + 1}-${(i + 1) % base_length + 1}`);
                this.base_face.push(i + 1);
            }
        }
    }

    class Pyramid extends CreatePyramid {
        half_edges: string[];
        faces: number[][];
        last: number;
        penultimate: number;
        primary: number;
        mesh: MeshDataStructure;
        constructor (base_length = 3) {
            super(base_length);
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
            for(const face of this.faces) this.mesh.addFace(face);
        }

        setMesh(permutations: any[]) {
            optionLoop: for(const permutation of permutations) {
                const tmp_edge_list: string[] = [];
                const edges = (permutation as number[]).map((value,index,array) => `${value}-${array[(index + 1) % array.length]}`);
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


    class CatmullClark {
        points_list: Point3D[];
        mesh: MeshDataStructure;
        face_points: Point3D[];
        edge_points: Point3D[];
        done_edges: string[];
        done_indexes : number[]

        constructor (points_list: Point3D[],mesh: MeshDataStructure) {
            this.points_list = points_list;
            this.mesh = mesh;
            this.face_points = [];
            this.edge_points = [];
            this.done_edges = [];
            this.done_indexes = [];
        }

        getEdgePoints(edge: string): Point3D[] {
            return edge.split("-").map((value) => this.points_list[Number(value)]);
        }

        getFacePoints(face: string): Point3D[] {
            return face.split("-").map((value) => this.points_list[Number(value)]);
        }

        getPoints(array: number[]): Point3D[] {
            return array.map((value) => this.points_list[value]);
        }

        sumPoints(points: Point3D[]): Point3D {
            var res: Point3D = new Point3D(0,0,0);
            for(const point of points) {
                res.x += point.x;
                res.y += point.y;
                res.z += point.z;
            }
            return res;
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

        iterate(iteration_num = 1) {

            if(iteration_num <= 0) return;
            iteration_num--;

            for(const face of this.mesh.faces) {
                const face_points = this.getFacePoints(face);
                const sum = this.sumPoints(face_points);
                const len = face_points.length;

                const face_point = new Point3D(sum.x / len,sum.y / len,sum.z / len);
                this.face_points.push(face_point);
            }

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

                    const edge_points = this.getPoints(edge_vertices);
                    edge_vertices_full.push(...edge_points,f_p_a,f_p_b);
                    const sum = this.sumPoints(edge_vertices_full);

                    const edge_point = new Point3D(sum.x / 4,sum.y / 4,sum.z / 4);
                    const edge_index = this.edge_points.push(edge_point) - 1 + this.face_points.length + this.points_list.length;
                
                    this.done_edges.push(edge, twinHalfEdgeKey);
                    this.done_indexes.push(edge_index, edge_index);
                }
            }

            for(const point_index in this.points_list) {
                const P = this.points_list[point_index];
                const F_list: Point3D[] = [];
                const R_list: Point3D[] = [];
                var n_f = 0;
                var n_e = 0;

                this.mesh.getFacesofVertex(point_index).map((value) => {
                    const face_index = this.mesh.faces.indexOf(value.join("-"));
                    const face_point = this.face_points[face_index];
                    F_list.push(face_point);
                    n_f++;
                })

                this.mesh.getEdgesofVertex(point_index,true).map((value) => {
                    const edge_vertices = value.split("-").map((value) => this.points_list[value]);
                    const sum = this.sumPoints(edge_vertices);
                    const edge_midpoint = new Point3D(sum.x / 2,sum.y / 2,sum.z / 2);
                    R_list.push(edge_midpoint);
                    n_e++;
                })

                const n = (n_f + n_e) / 2

                const f_sum = this.sumPoints(F_list);
                const r_sum = this.sumPoints(R_list);

                const F = new Point3D(f_sum.x / n,f_sum.y / n,f_sum.z / n);
                const R = new Point3D(r_sum.x / n,r_sum.y / n,r_sum.z / n);

                const X = (F.x + 2 * R.x + (n - 3) * P.x) / n;
                const Y = (F.y + 2 * R.y + (n - 3) * P.y) / n;
                const Z = (F.z + 2 * R.z + (n - 3) * P.z) / n;

                this.points_list[point_index] = new Point3D(X,Y,Z);
            }

            const p_len = this.points_list.length;
            const mesh_faces_len = this.mesh.faces.length;

            this.points_list.push(...this.face_points,...this.edge_points);

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

            this.mesh.faces.splice(0, mesh_faces_len);
            this.face_points = [];
            this.edge_points = [];
            this.done_edges = [];
            this.done_indexes = [];

            this.iterate(iteration_num);
        }

        // triangulate() {
        //     const triangulated_points_list: Point3D[] = [];
        //     const triangulated_connectivity_matrix: _CONNECTIVITY_ = { faces: [],edges: [] };
        //     triangulated_points_list.push(...this.points_list);

        //     for(const face of this.connectivity_matrix.faces) {
        //         const face_edges = this.getEdgesFromFace(face);

        //         const vertex_indexes = face.split("-").map((value) => Number(value));
        //         const vertices = vertex_indexes.map((value) => { return this.points_list[value] });

        //         const x_list = vertices.map((value) => value.x);
        //         const y_list = vertices.map((value) => value.y);
        //         const z_list = vertices.map((value) => value.z);

        //         const [x_min,x_max] = this.getMinMax(x_list);
        //         const [y_min,y_max] = this.getMinMax(y_list);
        //         const [z_min,z_max] = this.getMinMax(z_list);

        //         const avg_point = new Point3D((x_min + x_max) / 2,(y_min + y_max) / 2,(z_min + z_max) / 2);
        //         const avg_point_index = triangulated_points_list.push(avg_point);

        //         for(const edge of face_edges) {
        //             const [a,b] = edge.split("-");
        //             triangulated_connectivity_matrix.edges.push(`${avg_point_index}-${a}`,`${edge}`,`${b}-${avg_point_index}`);
        //             triangulated_connectivity_matrix.faces.push(`${a}-${avg_point_index}-${b}`);
        //         }
        //     }

        //     return { "points": triangulated_points_list,connectivity: triangulated_connectivity_matrix };
        // }

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

    const cube_points = [
        [0,0,0],
        [100,0,0],
        [0,100,0],
        [100,100,0],
        [0,0,100],
        [100,0,100],
        [0,100,100],
        [100,100,100]
    ];

    const pyramid_points = [
        [0,0,0],
        [50,0,0],
        [25,50,25],
        [25,0,50]
    ];

    const mod_cube_points = toPoints3D(cube_points);
    const mod_pyramid_points = toPoints3D(pyramid_points);

    const misc = new Miscellanous();

    const pyramid = new Pyramid();
    const cube = new CreateBox();

    const pyramid_mesh = pyramid.mesh;
    const cube_mesh = cube.mesh;

    const cube_catmull_clark = new CatmullClark(mod_cube_points,cube_mesh);
    const pyramid_catmull_clark = new CatmullClark(mod_pyramid_points,pyramid_mesh);

    console.log(cube_catmull_clark.display().points)
    console.log(cube_catmull_clark.display().mesh.faces)

    console.log("cube")
    cube_catmull_clark.iterate(1);

    console.log(cube_catmull_clark.display().points)
    console.log(cube_catmull_clark.display().mesh.faces)

    console.log(pyramid_catmull_clark.display().points)
    console.log(pyramid_catmull_clark.display().mesh.faces)

    console.log("pyramid")
    pyramid_catmull_clark.iterate(1);

    console.log(pyramid_catmull_clark.display().points)
    console.log(pyramid_catmull_clark.display().mesh.faces)

    console.log("done");

})()