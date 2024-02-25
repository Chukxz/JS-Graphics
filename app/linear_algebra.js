class ConvexHull2D {
    jarvisConvexHull(points) {
        const n = points.length;
        const triangulation_mesh = new MeshDataStructure(0); // not needed but added for forwards compatibility
        const convex_hull_history = []; // Initialize the history
        const points_on_hull = [];
        const point_ret_list = [];
        for (let point in points)
            point_ret_list.push(new Ret(point, color_list[(Number(point) % (color_list.length - 1)) + 1], false, 1, "A"));
        convex_hull_history.push(point_ret_list);
        const ret_list = [];
        var first;
        var now;
        var next;
        var prev;
        if (n < 3) {
            first = 0;
            for (let i = 0; i < n; i++) {
                now = i;
                if (i === n - 1)
                    next = first;
                else
                    next = i + 1;
                points_on_hull[i] = i;
                ret_list.push(new Ret(`${now}-${next}`, "cyan", true, 10, "D"));
                convex_hull_history.push([...point_ret_list, ...ret_list]); // push it to the history so we can see the change                      
            }
            return [{ "hull": points, "points": points_on_hull, history: convex_hull_history }, { list: [], full_point_list: [], history: [] }, { edges: [], full_point_list: [], history: [] }, triangulation_mesh, [], points, point_ret_list, []];
        } // there must be at least three points
        const hull = [];
        // Find the leftmost point and bottom-most point
        let l = 0;
        for (let i = 1; i < n; i++) {
            if (points[i].x < points[l].x)
                l = i;
            // For handling leftmost colinear points
            else if (points[i].x === points[l].x && points[i].y < points[l].y) {
                l = i;
            }
        }
        // Start form leftmost point and keep moving counterclockwise untill we reach the start point
        // again. This loop runs O(h) tiems where h is the number of points in the result or output.
        let p = l, q = 0;
        do {
            // Add current point to result
            hull.push(points[p]);
            points_on_hull.push(p);
            prev = p;
            // Search for a point 'q' such that orientation (p,q,x) is counterclockwise
            // for all points 'x'. The idea is to keep track of last visited most counterclock-wise point in q
            // If any point 'i' is more counterclock-wise than q, then update q
            q = (p + 1) % n;
            for (let i = 0; i < n; i++) {
                // If i is more counterclockwise than current q, then update p
                if (_Linear.findOrientation(points[p], points[i], points[q]) === 2)
                    q = i;
                // HANDLING  COLLINEAR POINTS
                // If point q lies in the middle, then also update q
                if (p !== i && _Linear.findOrientation(points[p], points[i], points[q]) === 0 &&
                    _Linear.onSegment(points[p], points[q], points[i]))
                    q = i;
            }
            // Now q is the most counterclockwise with respect to p. Set p as q for next iteration.
            // so that q is added tor result 'hull'
            p = q;
            now = p;
            ret_list.push(new Ret(`${prev}-${now}`, "cyan", true, 10, "D"));
            convex_hull_history.push([...point_ret_list, ...ret_list]); // push it to the history so we can see the change  
        } while (p != l); // While we don't come to first point
        return [{ "hull": hull, "points": points_on_hull, history: convex_hull_history }, { list: [], full_point_list: [], history: [] }, { edges: [], full_point_list: [], history: [] }, triangulation_mesh, [], points, point_ret_list, []];
    }
}
const _ConvexHull = new ConvexHull2D();
class Delaunay2D {
    constructor() { }
    superTriangle(pointList) {
        const rect = _Linear.getTriBoundingRect(pointList);
        const tri = _Linear.findCircTriFSq(rect);
        return tri;
    }
    get_edges(triangulation_mesh) {
        const ret_list = [];
        const _list = [];
        const results = Object.keys(triangulation_mesh.HalfEdgeDict);
        // reduce duplicate edges in the halfedge dictionary of the triangle data structure to one edge
        // when converting to an edge array
        for (let result of results) {
            const [a, b] = result.split("-").map((value) => { return Number(value); });
            const rev_result = `${b}-${a}`;
            if (!(_list.includes(result) || _list.includes(rev_result))) {
                const [i, j] = [Math.min(a, b), Math.max(a, b)];
                _list.push(`${i}-${j}`);
            }
        }
        for (let val of _list) {
            ret_list.push(new Ret(val, "black", true, 5, "E"));
        }
        return { "ret_list": ret_list, "list": _list };
    }
    get_ret(input, ret_list) {
        const null_ret = new Ret("-");
        for (let ret of ret_list) {
            if (ret.equals(input))
                return ret;
            else
                return null_ret;
        }
        return null_ret;
    }
    bowyer_watson(_full_cdv) {
        const pointList = _full_cdv[5];
        const pointList_len = pointList.length;
        const convex_hull = _full_cdv[0];
        const points_ret_list = _full_cdv[6];
        const delaunay_history = []; // Initialize the history
        const triangulation_mesh = new MeshDataStructure(pointList_len); // triangle data structure
        const [a, b, c] = this.superTriangle(pointList); // must be large enough to completely contain all the points in pointList
        // mark the super triangle points with values starting from length of pointlist to length of pointlist + 3 and add it to the triangle data structure
        triangulation_mesh.addFace([pointList_len, pointList_len + 1, pointList_len + 2]);
        // joint the points list and super triangle points together into one common list
        const fullPointList = [...pointList, a, b, c];
        const super_points_ret = [];
        super_points_ret.push(new Ret(`${pointList_len}`, "black", false, 1, "B"));
        super_points_ret.push(new Ret(`${pointList_len + 1}`, "black", false, 1, "B"));
        super_points_ret.push(new Ret(`${pointList_len + 2}`, "black", false, 1, "B"));
        delaunay_history.push(points_ret_list); // push it to the history so we can see the change
        delaunay_history.push([...points_ret_list, ...super_points_ret]); // push it to the history so we can see the change
        delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation_mesh).ret_list]); // push it to the history so we can see the change
        // add all the points one at a time to the triangulation_mesh
        for (let p in pointList) {
            const point = pointList[p];
            const point_num = Number(p);
            const badTriangles = [];
            const gray_edges = [];
            // first find all the triangles that are no longer valid due to the insertion
            for (let triangle of triangulation_mesh.faces) {
                const [a, b, c] = [...triangle.split("-").map((value) => { return value; })];
                const [p, q, r] = [a, b, c].map((value) => { return fullPointList[value]; });
                const coords = _Linear.getCircumCircle(p, q, r);
                const _a = new Ret(`${a}-${point_num}`, "yellow", true, 5, "E");
                const _b = new Ret(`${b}-${point_num}`, "yellow", true, 5, "E");
                const _c = new Ret(`${c}-${point_num}`, "yellow", true, 5, "E");
                delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation_mesh).ret_list, ...gray_edges, _a, _b, _c]); // push it to the history so we can see the change
                const invalid_tri_list = [];
                // if point is inside circumcircle of triangle add triangle to bad triangles
                if (_Linear.isInsideCirc(point, [coords.x, coords.y, coords.r])) {
                    badTriangles.push(triangle);
                    const ret_a = new Ret(`${a}-${point_num}`, "red", true, 5, "E");
                    const ret_b = new Ret(`${b}-${point_num}`, "red", true, 5, "E");
                    const ret_c = new Ret(`${c}-${point_num}`, "red", true, 5, "E");
                    invalid_tri_list.push(...[new Ret(`${a}-${b}`, "red", true, 5, "E"), new Ret(`${b}-${c}`, "red", true, 5, "E"), new Ret(`${a}-${c}`, "red", true, 5, "E")]);
                    gray_edges.push(...[new Ret(`${a}-${b}`, "gray", true, 5, "E"), new Ret(`${b}-${c}`, "gray", true, 5, "E"), new Ret(`${a}-${c}`, "gray", true, 5, "E")]);
                    delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation_mesh).ret_list, ret_a, ret_b, ret_c, ...invalid_tri_list]); // push it to the history so we can see the change
                    delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation_mesh).ret_list, ...gray_edges]); // push it to the history so we can see the change
                }
            }
            const polygon = [];
            const bad_edges_dict = {};
            // find the boundary of the polygonal hole
            for (let bad_triangle of badTriangles) {
                const triangle_face = bad_triangle.split("-").map((value) => { return Number(value); });
                const bad_edges = triangulation_mesh.getEdgesofFace(triangle_face);
                for (let bad_edge of bad_edges) {
                    const [i, j] = bad_edge.split("-").map((value) => { return Number(value); });
                    const [a, b] = [Math.min(i, j), Math.max(i, j)];
                    // Find how many times the bad edge occurs and increment the value denoting its frequency accordingly
                    if (!bad_edges_dict[`${a}-${b}`]) {
                        bad_edges_dict[`${a}-${b}`] = 1;
                    }
                    else {
                        bad_edges_dict[`${a}-${b}`]++;
                    }
                }
                // remove each bad triangle from the triangle data structure
                triangulation_mesh.removeFace(triangle_face.join("-"));
            }
            // if edge is not shared by any other triangles (occurence or frequency is one) in bad triangles add edge to polygon
            const poly_edge_ret = [];
            for (let bad_edge in bad_edges_dict) {
                if (bad_edges_dict[bad_edge] === 1) {
                    polygon.push(bad_edge);
                    poly_edge_ret.push(new Ret(bad_edge, "green", true, 5, "E"));
                    delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation_mesh).ret_list, ...gray_edges, ...poly_edge_ret]); // push it to the history so we can see the change
                }
            }
            // re-triangulate the polygonal hole using the point and add the triangles to the triangle data structure
            for (let polygonal_edge of polygon) {
                const [a, b] = polygonal_edge.split("-").map((value) => { return Number(value); });
                // add a new triangle with the vertices of polygonal_edge and the point number
                triangulation_mesh.addtriangle(a, b, point_num);
                delaunay_history.push([...points_ret_list, ...super_points_ret, ...poly_edge_ret, ...this.get_edges(triangulation_mesh).ret_list]); // push it to the history so we can see the change
            }
        }
        // get the edges
        delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation_mesh).ret_list]); // push it to the history so we can see the change
        // If triangle contains a vertex from original super-triangle remove triangle from triangulation_mesh
        const prune_list = [];
        for (let triangle of triangulation_mesh.triangleList) {
            const num_triangle = triangle.split("-").map((value) => { return Number(value); });
            for (let num of num_triangle) {
                if (num === pointList_len || num === pointList_len + 1 || num === pointList_len + 2) {
                    prune_list.push(num_triangle);
                    break;
                }
            }
        }
        for (let triangle of prune_list) {
            triangulation_mesh.removeTriangle(triangle[0], triangle[1], triangle[2]); // remove triangle containing vertices of super triangle
            delaunay_history.push([...points_ret_list, ...super_points_ret, ...this.get_edges(triangulation_mesh).ret_list]); // push it to the history so we can see the change
        }
        // get the vertices of the convex hull of the points list
        const convex_hull_vertices = convex_hull.points;
        // get the edges of the convex hull from the previously gotten convex hull vertices
        const convex_hull_edges = _Miscellanous.genEdgefromArray(convex_hull_vertices, true);
        const convex_hull_edges_unsorted = _Miscellanous.genEdgefromArray(convex_hull_vertices, false);
        const convex_hull_edges_ret_list = [];
        // show the convex_hull edges
        for (let edge of convex_hull_edges) {
            convex_hull_edges_ret_list.push(new Ret(edge, "cyan", true, 10, "D"));
        }
        delaunay_history.push([...this.get_edges(triangulation_mesh).ret_list, ...convex_hull_edges_ret_list]); // push it to the history so we can see the change
        const ret_list = [];
        const _list = this.get_edges(triangulation_mesh).list;
        // for each edge of the convex hull, check if it exists in the delaunay edge array and add it if it doesn't
        for (let edge in convex_hull_edges) {
            if (!_list.includes(convex_hull_edges[edge])) {
                _list.push(convex_hull_edges[edge]);
                const edge_unsorted = convex_hull_edges_unsorted[edge];
                // get and sort the two edge numbers in ascending order
                const [a, b] = edge_unsorted.split("-").map((value) => { return Number(value); });
                const i = Math.min(a, b);
                const j = Math.max(a, b);
                // // create a list of points identical in all respects to the pointlist except that the indexes corresponding to the two edge numbers are removed
                // const test_points = pointList.slice()
                // test_points.splice(i,1);
                // test_points.splice(j-1,1);
                // console.log(test_points)
                const k = _Linear.getSmallestTriArea(pointList[i], i, pointList[j], j, pointList);
                triangulation_mesh.addtriangle(i, j, k);
                ret_list.push(new Ret(convex_hull_edges[edge], "orange", true, 5, "D"));
                delaunay_history.push([...this.get_edges(triangulation_mesh).ret_list, ...convex_hull_edges_ret_list, ...ret_list]); // push it to the history so we can see the change
            }
        }
        delaunay_history.push([...this.get_edges(triangulation_mesh).ret_list, ...convex_hull_edges_ret_list, ...ret_list]); // push it to the history so we can see the change
        delaunay_history.push([...this.get_edges(triangulation_mesh).ret_list, ...ret_list]); // push it to the history so we can see the change
        return [convex_hull, { list: _list, full_point_list: fullPointList, history: delaunay_history }, { edges: [], full_point_list: [], history: [] }, triangulation_mesh, convex_hull_edges, pointList, points_ret_list, []];
    }
}
const _Delaunay = new Delaunay2D();
// this.degree_list = _Miscellanous.createArrayFromArgs(n).fill(0);
class Voronoi2D {
    adjacency_list;
    getTriCircumCircles(pointList, triangle_list) {
        const voronoi_points_list = [];
        for (let triangle of triangle_list) {
            const [pA, pB, pC] = triangle.split("-").map((value) => { return pointList[value]; });
            const tri_circum = _Linear.getCircumCircle(pA, pB, pC);
            voronoi_points_list.push(tri_circum);
        }
        return voronoi_points_list;
    }
    getTriAsc(triangle) {
        var tri_num_list = triangle.split("-").map((value) => { return Number(value); });
        const min = Math.min(...tri_num_list);
        const max = Math.max(...tri_num_list);
        var mid = 0;
        for (let num of tri_num_list) {
            if (num !== min && num !== max) {
                mid = num;
                break;
            }
        }
        return tri_num_list = [min, mid, max]; // ensure triangle numbers are ordered in ascending order
    }
    checkTriEquality(tri_input, tri_comp) {
        var found = 0;
        for (let num of tri_input) {
            for (let num_c of tri_comp) {
                if (num === num_c)
                    found++;
            }
        }
        if (found >= 2)
            return true;
        else
            return false;
    }
    getAdjTriangles(triangle_list) {
        const adj_triangle_dict = {};
        const adj_triangle_list = _Miscellanous.createArrayFromList([triangle_list.length, 1]).map((value) => { return value = []; });
        for (let tri in triangle_list) {
            if (!adj_triangle_dict[tri])
                adj_triangle_dict[tri] = [];
            const tri_input = this.getTriAsc(triangle_list[tri]);
            for (let tri_c in triangle_list) {
                if (triangle_list[tri] == triangle_list[tri_c])
                    continue;
                if (!adj_triangle_dict[tri_c])
                    adj_triangle_dict[tri_c] = [];
                if (!adj_triangle_dict[tri].includes(triangle_list[tri_c])) {
                    const tri_comp = this.getTriAsc(triangle_list[tri_c]);
                    if (this.checkTriEquality(tri_input, tri_comp) === true) {
                        adj_triangle_dict[tri].push(triangle_list[tri_c]);
                        adj_triangle_dict[tri_c].push(triangle_list[tri]);
                        adj_triangle_list[tri].push(Number(tri_c));
                        adj_triangle_list[tri_c].push(Number(tri));
                    }
                }
            }
        }
        return { dict: adj_triangle_dict, list: adj_triangle_list };
    }
    getConvexHullExtremes(convex_hull_points) {
        var [minX, maxX, minY, maxY] = [Infinity, -Infinity, Infinity, -Infinity];
        // get minimum  and maximum values of x and y
        for (let point of convex_hull_points) {
            if (point.x < minX)
                minX = point.x;
            if (point.x > maxX)
                maxX = point.x;
            if (point.y < minY)
                minY = point.y;
            if (point.y > maxY)
                maxY = point.y;
        }
        return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    }
    getCrossPoints(p, c_extremes, margin = 10) {
        const left_diff = Math.abs(p.x - c_extremes.minX);
        const right_diff = Math.abs(p.x - c_extremes.maxX);
        const up_diff = Math.abs(p.y - c_extremes.minY);
        const down_diff = Math.abs(p.y - c_extremes.maxY);
        const left_point = new Point2D(p.x - left_diff - margin, p.y);
        const right_point = new Point2D(p.x + right_diff + margin, p.y);
        const up_point = new Point2D(p.x, p.y - up_diff - margin);
        const down_point = new Point2D(p.x, p.y + down_diff + margin);
        return { ph: left_point, qh: right_point, pv: up_point, qv: down_point };
    }
    convexHullIntersect(p1, q1, point_list, convex_hull_edges) {
        for (let edge of convex_hull_edges) {
            const [p2, q2] = edge.split("-").map((value) => { return point_list[value]; });
            if (_Linear.doIntersect(p1, q1, p2, q2) === true)
                return true;
        }
        return false;
    }
    compute_voronoi(_full_cdv) {
        const triangulation_mesh = _full_cdv[3];
        const n = triangulation_mesh.vertex_no;
        const pt_list = _full_cdv[5];
        this.adjacency_list = _Miscellanous.createArrayFromList([n, 1]).map(() => { return []; });
        const halfedge_dict_list = Object.keys(triangulation_mesh.HalfEdgeDict);
        const convex_hull_edges = _full_cdv[4];
        const convex_hull_points = _full_cdv[0].hull;
        const points_ret_list = _full_cdv[6];
        const voronoi_history = [];
        var voronoi_edges_list = [];
        const convex_hull_voronoi_no_intersect = [];
        var voronoi_convex_hull_intersect = [];
        const mid_pt_list = [];
        const mid_pt_edges_list = [];
        const convex_hull = _full_cdv[0];
        const delaunay = _full_cdv[1];
        const new_v = [];
        const new_m = [];
        const new_l = [];
        voronoi_history.push(points_ret_list); // push it to the history so we can see the change
        // get the circumcenters of all the triangles in the previously computed delaunay (or delone) triangulation_mesh
        // and store them in a list indexing them according to the index of their respective containing triangles
        const voronoi_points_list = this.getTriCircumCircles(pt_list, triangulation_mesh.triangleList);
        // record changes
        const voronoi_points_ret_list = [];
        for (let p_index in voronoi_points_list) {
            if (voronoi_points_ret_list.length > 0)
                voronoi_points_ret_list.push([...voronoi_points_ret_list[voronoi_points_ret_list.length - 1], new Ret(p_index, "darkred", false, 1, "C"), new Ret(p_index, "red", false, 1, "H")]);
            else
                voronoi_points_ret_list.push([new Ret(p_index, "darkred", false, 1, "C"), new Ret(p_index, "red", false, 1, "H")]);
            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list[p_index]]); // push it to the history so we can see the change
        }
        const voronoi_points_ret_list_last = voronoi_points_ret_list[voronoi_points_ret_list.length - 1];
        const voronoi_points_list_divide = voronoi_points_list.length;
        var end_pt_index = voronoi_points_list_divide;
        // compute the adjacent triangles
        const adj_triangles = this.getAdjTriangles(triangulation_mesh.triangleList);
        // compute the adjacency matrix for the vertices
        for (let edge of halfedge_dict_list) {
            const [a, b] = edge.split("-").map((value) => { return Number(value); });
            const [start, end] = [Math.min(a, b), Math.max(a, b)];
            this.adjacency_list[start].push(end);
            this.adjacency_list[end].push(start);
        }
        for (let list in this.adjacency_list) {
            this.adjacency_list[list] = [...new Set(this.adjacency_list[list])]; // ensure uniqueness
        }
        // console.log(triangulation_mesh.triangleList)
        // console.log(halfedge_dict_list)
        // console.log(voronoi_points_list)
        // console.log(this.adjacency_list)
        // console.log(adj_triangles.dict);
        // console.log(adj_triangles.list);
        // console.log(pt_list);
        // for each triangle circumcenter vertex, get the adjacent triangles to the triangle containing it
        for (let index in voronoi_points_list) {
            for (let val of adj_triangles.list[index]) {
                const a = Math.min(Number(index), Number(val));
                const b = Math.max(Number(index), Number(val));
                voronoi_edges_list.push(`${a}-${b}`);
            }
        }
        // ensure uniqueness
        voronoi_edges_list = [...new Set(voronoi_edges_list)];
        // record changes
        const voronoi_edges_ret_list = [];
        for (let edge of voronoi_edges_list) {
            const [a, b] = edge.split("-");
            if (voronoi_edges_ret_list.length > 0)
                voronoi_edges_ret_list.push([...voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1], new Ret(edge, "coral", true, 5, "F"), new Ret(a, "magenta", false, 1, "C"), new Ret(b, "magenta", false, 1, "C")]);
            else
                voronoi_edges_ret_list.push([new Ret(edge, "coral", true, 5, "F"), new Ret(a, "magenta", false, 1, "C"), new Ret(b, "magenta", false, 1, "C")]);
            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1]]); // push it to the history so we can see the change
        }
        const voronoi_edges_ret_list_last = voronoi_edges_ret_list[voronoi_edges_ret_list.length - 1];
        // prepare animation data for convex hull edges
        const convex_hull_edges_ret_list = [];
        for (let edge of convex_hull_edges) {
            convex_hull_edges_ret_list.push(new Ret(edge, "cyan", true, 10, "D"));
        }
        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...voronoi_edges_ret_list_last, ...convex_hull_edges_ret_list]); // push it to the history so we can see the change
        // get all the convex hull edges that do not intersect with the voronoi edges
        // we loop through each edge of the convex hull
        // in each convex hull edge, we check if there exists a voronoi edge that intersects with it by attempting to loop through all the voronoi edges
        // if any intersecting voronoi edge is found we abort the current loop of the voronoi edges as the condition of no-intersection has been violated and return true for the convex hull edge
        // else we continue to loop through the voronoi to make sure that no voronoi edge intersects  and if none intersects at the end of the loop we return false for the convex hull edge
        // if the result is false (no-intersection) we record it.
        const no_intersect_ret_list = [];
        for (let edge of convex_hull_edges) {
            var [p1, q1] = [...edge.split("-").map((value) => { return pt_list[value]; })];
            var last_intersect = true;
            for (let v_edge of voronoi_edges_list) {
                var [p2, q2] = [...v_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
                if (no_intersect_ret_list.length <= 0)
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, new Ret(edge, "yellow", true, 10, "D"), new Ret(v_edge, "yellow", true, 5, "F")]); // push it to the history so we can see the change
                else
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list[no_intersect_ret_list.length - 1], new Ret(edge, "yellow", true, 10, "D"), new Ret(v_edge, "yellow", true, 5, "F")]); // push it to the history so we can see the change
                const intersect = _Linear.doIntersect(p1, q1, p2, q2);
                if (intersect === true) {
                    last_intersect = intersect;
                    if (no_intersect_ret_list.length <= 0)
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, new Ret(edge, "red", true, 10, "D"), new Ret(v_edge, "red", true, 5, "F")]); // push it to the history so we can see the change
                    else
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list[no_intersect_ret_list.length - 1], new Ret(edge, "red", true, 10, "D"), new Ret(v_edge, "red", true, 5, "F")]); // push it to the history so we can see the change
                    break;
                }
                last_intersect = intersect;
            }
            if (last_intersect === false) {
                convex_hull_voronoi_no_intersect.push(edge);
                if (no_intersect_ret_list.length > 0)
                    no_intersect_ret_list.push([...no_intersect_ret_list[no_intersect_ret_list.length - 1], new Ret(edge, "darkcyan", true, 10, "D")]);
                else
                    no_intersect_ret_list.push([new Ret(edge, "darkcyan", true, 10, "D")]);
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list[no_intersect_ret_list.length - 1]]); // push it to the history so we can see the change
            }
        }
        const no_intersect_ret_list_last = no_intersect_ret_list[no_intersect_ret_list.length - 1];
        // for each non-intersecting convex hull edge get the midpoint of the convex hull edge,
        // get the circumcenter of the triangle that has and edge corresponding to the convex hull edge
        // and get the gradient of the line that connects the circumcenter of that triangle to the midpoint
        const mid_no_intersect_ret_list = [];
        for (let index in convex_hull_voronoi_no_intersect) {
            const edge = convex_hull_voronoi_no_intersect[index];
            const [a, b] = [...edge.split("-").map((value) => { return pt_list[Number(value)]; })];
            const midPoint = new Point2D((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
            const _mid_pt_index = mid_pt_list.push(midPoint) - 1;
            const triangle = triangulation_mesh.HalfEdgeDict[edge].face_vertices.join("-");
            const _circum_pt_index = triangulation_mesh.triangleList.indexOf(triangle);
            mid_pt_edges_list[index] = { mid_pt_index: _mid_pt_index, circum_pt_index: _circum_pt_index };
            if (mid_no_intersect_ret_list.length > 0)
                mid_no_intersect_ret_list.push([...mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1], ...[new Ret(`${_mid_pt_index}-${_circum_pt_index}`, "purple", true, 5, "G")]]);
            else
                mid_no_intersect_ret_list.push([new Ret(`${_mid_pt_index}-${_circum_pt_index}`, "purple", true, 5, "G")]);
            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1]]); // push it to the history so we can see the change
        }
        const mid_no_intersect_ret_list_last = mid_no_intersect_ret_list[mid_no_intersect_ret_list.length - 1];
        // for each line gotten from above, use the gradient of the line to make the line longer while keeping the start coordinate
        // of the line as the circumcenter and ensuring that the line's end coordinate is located outwards
        for (let index in mid_pt_edges_list) {
            const val = mid_pt_edges_list[index];
            const start = voronoi_points_list[val.circum_pt_index];
            const inter = mid_pt_list[val.mid_pt_index];
            const gradient = _Linear.get_gradient(start, inter);
            const [p1, q1] = convex_hull_voronoi_no_intersect[index].split("-").map((value) => { return pt_list[value]; });
            const end = _Linear.specialGetLineFromPointGradient(p1, q1, start, gradient, 50);
            voronoi_points_list.push(end);
            voronoi_edges_list.push(`${val.circum_pt_index}-${end_pt_index}`);
            voronoi_points_ret_list_last.push(new Ret(`${end_pt_index}`, "darkred", true, 1, "C"));
            new_m.push(new Ret(`${val.circum_pt_index}-${end_pt_index}`, "darkblue", true, 5, "F"));
            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...mid_no_intersect_ret_list_last, ...new_m]); // push it to the history so we can see the change
            end_pt_index++;
        }
        // get all the voronoi edges that intersect with the convex hull edges
        for (let v_index in voronoi_edges_list) {
            const v_edge = voronoi_edges_list[v_index];
            var [p1, q1] = [...v_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
            for (let edge of convex_hull_edges) {
                var [p2, q2] = [...edge.split("-").map((value) => { return pt_list[value]; })];
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, new Ret(v_edge, "yellow", true, 5, "F"), new Ret(edge, "yellow", true, 10, "D")]); // push it to the history so we can see the change
                const intersect = _Linear.doIntersect(p1, q1, p2, q2);
                if (intersect === true) {
                    voronoi_convex_hull_intersect.push(v_edge);
                    new_v.push(new Ret(v_edge, "maroon", true, 5, "F"));
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, new Ret(edge, "lightsalmon", true, 10, "D")]); // push it to the history so we can see the change
                    break;
                }
            }
        }
        // ensure uniqueness
        voronoi_convex_hull_intersect = [...new Set(voronoi_convex_hull_intersect)];
        const c_extremes = this.getConvexHullExtremes(convex_hull_points);
        const no_duplicate = [];
        // from the afore gotten voronoi edges get those that intersect with others
        for (let v1_edge of voronoi_convex_hull_intersect) {
            var [p1, q1] = [...v1_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
            for (let v2_edge of voronoi_convex_hull_intersect) {
                if (v1_edge === v2_edge)
                    continue;
                no_duplicate.push(v1_edge + v2_edge);
                var counter_duplicate = v2_edge + v1_edge;
                if (no_duplicate.includes(counter_duplicate))
                    continue;
                var [p2, q2] = [...v2_edge.split("-").map((value) => { return voronoi_points_list[value]; })];
                voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "yellow", true, 5, "F"), new Ret(v2_edge, "yellow", true, 5, "F")]); // push it to the history so we can see the change
                const intersect = _Linear.doIntersect(p1, q1, p2, q2);
                if (intersect === true) {
                    // get the point that is the same for both edges
                    const v_a = v1_edge.split("-");
                    const v_b = v2_edge.split("-");
                    const v_test_1 = v_a.includes(v_b[0]);
                    const v_test_2 = v_a.includes(v_b[1]);
                    if ((v_test_1 || v_test_2) === false)
                        continue;
                    const v = v_test_1 ? [v_b[0], 1] : [v_b[1], 0];
                    // get the points that exist outside the convex hull
                    const point = voronoi_points_list[v[0]];
                    const boundary_points = this.getCrossPoints(point, c_extremes, 10);
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "darkgoldenrod", true, 5, "F"), new Ret(v2_edge, "darkgoldenrod", true, 5, "F"), new Ret(`${v[0]}`, "yellow", false, 1, "C")]); // push it to the history so we can see the change
                    const point_ph_intersect = this.convexHullIntersect(point, boundary_points.ph, pt_list, convex_hull_edges);
                    const point_qh_intersect = this.convexHullIntersect(point, boundary_points.qh, pt_list, convex_hull_edges);
                    const point_pv_intersect = this.convexHullIntersect(point, boundary_points.pv, pt_list, convex_hull_edges);
                    const point_qv_intersect = this.convexHullIntersect(point, boundary_points.qv, pt_list, convex_hull_edges);
                    // If true then it is inside the convex hull so we skip it
                    if (point_ph_intersect === true &&
                        point_qh_intersect === true &&
                        point_pv_intersect === true &&
                        point_qv_intersect === true) {
                        voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "red", true, 5, "F"), new Ret(v2_edge, "red", true, 5, "F"), new Ret(`${v[0]}`, "red", false, 1, "C")]); // push it to the history so we can see the change
                        continue;
                    }
                    // If not then it is not inside the convex hull and we can safely do some work
                    // get the midpoint of the edges connecting the lines shared by this point
                    const a = v_a[v[1]];
                    const b = v_b.slice().splice(Number(v[1]), 1)[0];
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l, new Ret(v1_edge, "burlywood", true, 5, "F"), new Ret(v2_edge, "burlywood", true, 5, "F"), new Ret(`${v[0]}`, "green", false, 1, "C")]); // push it to the history so we can see the change
                    var p1 = voronoi_points_list[a];
                    var q1 = voronoi_points_list[b];
                    const midpoint = _Linear.get_midpoint(p1, q1);
                    const inter = voronoi_points_list[v[0]];
                    const gradient = _Linear.get_gradient(midpoint, inter);
                    const end = _Linear.getLineFromPointGradient(inter, gradient, 50, p1.y < q1.y);
                    voronoi_points_list.push(end);
                    voronoi_edges_list.push(`${v[0]}-${end_pt_index}`);
                    new_l.push(new Ret(`${v[0]}-${end_pt_index}`, "coral", true, 5, "F"), new Ret(v1_edge, "burlywood", true, 5, "F"), new Ret(v2_edge, "burlywood", true, 5, "F"), new Ret(`${v[0]}`, "green", false, 1, "C"));
                    voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l]); // push it to the history so we can see the change
                    end_pt_index++;
                }
            }
            voronoi_history.push([...points_ret_list, ...voronoi_points_ret_list_last, ...convex_hull_edges_ret_list, ...voronoi_edges_ret_list_last, ...no_intersect_ret_list_last, ...new_m, ...new_v, ...new_l]); // push it to the history so we can see the change
        }
        return [convex_hull, delaunay, { edges: voronoi_edges_list, full_point_list: voronoi_points_list, history: voronoi_history }, triangulation_mesh, convex_hull_edges, pt_list, points_ret_list, mid_pt_list];
    }
}
const _Voronoi2D = new Voronoi2D();
class Linear_Algebra_Animate {
    cur_index;
    running;
    cdv_switch;
    time;
    section;
    ret_group_num;
    ret_num;
    convex_hull;
    delaunay;
    voronoi;
    triangle_list;
    convex_hull_edges;
    points;
    points_ret_list;
    midpoints;
    super_points;
    voronoi_points;
    constructor(input, cdv_switch = 0, cur_index = 0) {
        this.cur_index = cur_index;
        this.cdv_switch = cdv_switch;
        this.running = false;
        this.time = 1000;
        this.section = 0;
        this.ret_group_num = 0;
        this.convex_hull = input[0];
        this.delaunay = input[1];
        this.voronoi = input[2];
        this.triangle_list = input[3].triangleList;
        this.convex_hull_edges = input[4];
        this.points = input[5];
        this.points_ret_list = input[6];
        this.midpoints = input[7];
        this.super_points = this.delaunay.full_point_list;
        this.voronoi_points = this.voronoi.full_point_list;
        // console.log(this.convex_hull.history);
        // console.log(this.delaunay.history);
        // console.log(this.voronoi.history);
        switch (this.cdv_switch) {
            case 0:
                length = 0;
                break;
            case 1:
                length = this.convex_hull.history.length;
                break;
            case 2:
                length = this.delaunay.history.length;
                break;
            case 3:
                length = this.voronoi.history.length;
                break;
            case 4:
                length = this.convex_hull.history.length + this.delaunay.history.length;
                break;
            case 6:
                length = this.delaunay.history.length + this.voronoi.history.length;
                break;
            case 7:
                length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length;
                break;
        }
        anim_number_input.max = `${length - 1}`;
        after_anim1.innerHTML = `${length - 1}`;
    }
    changeCDVSwitch(input) {
        this.running = false;
        this.cdv_switch = input;
        this.section = 0;
        this.ret_group_num = 0;
        var length = 0;
        switch (this.cdv_switch) {
            case 0:
                length = 0;
                break;
            case 1:
                length = this.convex_hull.history.length;
                break;
            case 2:
                length = this.delaunay.history.length;
                break;
            case 3:
                length = this.voronoi.history.length;
                break;
            case 4:
                length = this.convex_hull.history.length + this.delaunay.history.length;
                break;
            case 6:
                length = this.delaunay.history.length + this.voronoi.history.length;
                break;
            case 7:
                length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length;
                break;
        }
        anim_number_input.max = `${length - 1}`;
        after_anim1.innerHTML = `${length - 1}`;
    }
    // A - Basic Point ( Points of Graph)
    // B - Super Triangle Point
    // C - Voronoi Point ( Triangle Circumcenters)
    // D - Basic Edge ( Basic point - Basic Point)
    // E - Super Edge ( Basic Point or Super Point - Basic Point or Super Point)
    // F - Voronoi Edge ( Voronoi Point - Voronoi Point)
    // G - Mid_Edge ( Mid_Point { of selected Voronoi Edge} - Voronoi Point)
    // H - Polygon { Triangle ( Basic Point - Basic Point - Basic Point ) }
    render_ret(ret, super_points, voronoi_points, midpoints, triangle_list) {
        const type = ret._type;
        var point1;
        var point2;
        switch (type) {
            case "A":
            case "B":
                point1 = super_points[Number(ret._ret)];
                _Experimental.drawPoint(point1, ret._color_code, ret._color_code, ret._s_width);
                break;
            case "C":
                point1 = voronoi_points[Number(ret._ret)];
                _Experimental.drawPoint(point1, ret._color_code, ret._color_code, ret._s_width);
                break;
            case "D":
            case "E":
                [point1, point2] = ret._ret.split("-").map((value) => { return super_points[Number(value)]; });
                _Experimental.drawLine(point1, point2, ret._color_code, ret._s_width);
                break;
            case "F":
                [point1, point2] = ret._ret.split("-").map((value) => { return voronoi_points[Number(value)]; });
                _Experimental.drawLine(point1, point2, ret._color_code, ret._s_width);
                break;
            case "G":
                var [a, b] = ret._ret.split("-").map((value) => { return Number(value); });
                point1 = midpoints[a];
                point2 = voronoi_points[b];
                _Experimental.drawLine(point1, point2, ret._color_code, ret._s_width);
                break;
            case "H":
                var [p, q, r] = triangle_list[Number(ret._ret)].split("-").map((value) => { return super_points[Number(value)]; });
                _Experimental.drawPolygon([p, q, r], ret._color_code, ret._color_code, ret._s_width, false);
                break;
        }
    }
    // 0 - 
    // 1 - Convex Hull
    // 2 - Delaunay
    // 3 - Voronoi
    // 4 - Convex Hull and Delaunay
    // 5 - Convex Hull and Voronoi
    // 6 - Delaunay and Voronoi
    // 7 - Convex Hull, Delaunay and Voronoi
    select_selection_system() {
        var num = this.cur_index;
        switch (this.cdv_switch) {
            case 0: return [0, 0];
            case 1:
                return [0, num % this.convex_hull.history.length];
            case 2:
                return [1, num % this.delaunay.history.length];
            case 3:
                return [2, num % this.voronoi.history.length];
            case 4:
                if (num < this.convex_hull.history.length)
                    return [0, num];
                else
                    return [1, num - this.convex_hull.history.length];
            case 5:
                if (num < this.convex_hull.history.length)
                    return [0, num];
                else
                    return [2, num - this.convex_hull.history.length];
            case 6:
                if (num < this.delaunay.history.length)
                    return [1, num];
                else
                    return [2, num - this.delaunay.history.length];
            case 7:
                if (num < this.convex_hull.history.length)
                    return [0, num];
                else
                    num = num - this.convex_hull.history.length;
                if (num < this.delaunay.history.length)
                    return [1, num];
                else
                    return [2, num - this.delaunay.history.length];
            default: return [0, 0];
        }
    }
    selection_system(section, ret_group_num, stops) {
        if (ret_group_num < (stops[section] - 1)) {
            ret_group_num++;
            this.cur_index++;
            return [section, ret_group_num];
        }
        if (section < 2) {
            section++;
            ret_group_num = 0;
            this.cur_index++;
            return [section, ret_group_num];
        }
        else {
            section = 0;
            ret_group_num = 0;
            this.cur_index = 0;
            this.running = false;
            return [section, ret_group_num];
        }
    }
    history_snapshot() {
        this.running = false;
        [this.section, this.ret_group_num] = this.select_selection_system();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        status.innerHTML = `Current count: ${this.cur_index}`;
        anim_number_input.value = `${this.cur_index}`;
        anim_number.innerHTML = anim_number_input.value;
        if (this.section === 0) {
            if (this.cdv_switch === 1 || this.cdv_switch === 4 || this.cdv_switch === 5 || this.cdv_switch === 7) {
                const group = this.convex_hull.history[this.ret_group_num];
                for (let ret of group) {
                    this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                }
            }
        }
        if (this.section === 1) {
            if (this.cdv_switch === 2 || this.cdv_switch === 4 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                const group = this.delaunay.history[this.ret_group_num];
                for (let ret of group) {
                    this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                }
            }
        }
        if (this.section === 2) {
            if (this.cdv_switch === 3 || this.cdv_switch === 5 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                const group = this.voronoi.history[this.ret_group_num];
                for (let ret of group) {
                    this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                }
            }
        }
    }
    animate_history() {
        var length = 0;
        var stops = [this.convex_hull.history.length, this.delaunay.history.length, this.voronoi.history.length];
        [this.section, this.ret_group_num] = this.select_selection_system();
        switch (this.cdv_switch) {
            case 0:
                length = 0;
                break;
            case 1:
                length = this.convex_hull.history.length;
                break;
            case 2:
                length = this.delaunay.history.length;
                break;
            case 3:
                length = this.voronoi.history.length;
                break;
            case 4:
                length = this.convex_hull.history.length + this.delaunay.history.length;
                break;
            case 6:
                length = this.delaunay.history.length + this.voronoi.history.length;
                break;
            case 7:
                length = this.convex_hull.history.length + this.delaunay.history.length + this.voronoi.history.length;
                break;
        }
        if (length <= 0)
            return;
        this.running = true;
        var id = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            status.innerHTML = `Running, count: ${this.cur_index}`;
            anim_number_input.value = `${this.cur_index}`;
            anim_number.innerHTML = anim_number_input.value;
            if (this.section === 0) {
                if (this.cdv_switch === 1 || this.cdv_switch === 4 || this.cdv_switch === 5 || this.cdv_switch === 7) {
                    const group = this.convex_hull.history[this.ret_group_num];
                    for (let ret of group) {
                        this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                    }
                    [this.section, this.ret_group_num] = this.selection_system(this.section, this.ret_group_num, stops);
                }
            }
            if (this.section === 1) {
                if (this.cdv_switch === 2 || this.cdv_switch === 4 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                    const group = this.delaunay.history[this.ret_group_num];
                    for (let ret of group) {
                        this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                    }
                    [this.section, this.ret_group_num] = this.selection_system(this.section, this.ret_group_num, stops);
                }
            }
            if (this.section === 2) {
                if (this.cdv_switch === 3 || this.cdv_switch === 5 || this.cdv_switch === 6 || this.cdv_switch === 7) {
                    const group = this.voronoi.history[this.ret_group_num];
                    for (let ret of group) {
                        this.render_ret(ret, this.super_points, this.voronoi_points, this.midpoints, this.triangle_list);
                    }
                    [this.section, this.ret_group_num] = this.selection_system(this.section, this.ret_group_num, stops);
                }
            }
            if (this.cur_index >= length || this.running === false) {
                clearInterval(id);
                this.running = false;
                if (this.cur_index >= length) {
                    status.innerHTML = "Done";
                    this.cur_index = 0;
                }
                else {
                    anim_number_input.value = `${this.cur_index}`;
                    anim_number.innerHTML = anim_number_input.value;
                    status.innerHTML = `Paused, count: ${this.cur_index}`;
                }
            }
        }, this.time);
    }
}
class LinearAlgebraSupport {
    cur_index;
    cdv_switch;
    time;
    c_result;
    d_result;
    v_result;
    points;
    animate;
    c_1;
    c_2;
    c_3;
    constructor(points, cdv_switch = 0, cur_index = 0) {
        this.points = points;
        this.c_result = _ConvexHull.jarvisConvexHull(this.points);
        this.d_result = _Delaunay.bowyer_watson(this.c_result);
        this.v_result = _Voronoi2D.compute_voronoi(this.d_result);
        this.animate = new Linear_Algebra_Animate(this.v_result, cdv_switch, cur_index);
        this.time = 1000; // fallback time;
        this.cur_index = cur_index;
        this.cdv_switch = cdv_switch;
        this.animate.cur_index = this.cur_index;
        this.animate.cdv_switch = this.cdv_switch;
        this.c_1 = false;
        this.c_2 = false;
        this.c_3 = false;
        this.setC_S();
    }
    checkC_S() {
        if (this.c_1 === false && this.c_2 === false && this.c_3 === false)
            this.cdv_switch = 0;
        if (this.c_1 === true && this.c_2 === false && this.c_3 === false)
            this.cdv_switch = 1;
        if (this.c_1 === false && this.c_2 === true && this.c_3 === false)
            this.cdv_switch = 2;
        if (this.c_1 === false && this.c_2 === false && this.c_3 === true)
            this.cdv_switch = 3;
        if (this.c_1 === true && this.c_2 === true && this.c_3 === false)
            this.cdv_switch = 4;
        if (this.c_1 === true && this.c_2 === false && this.c_3 === true)
            this.cdv_switch = 5;
        if (this.c_1 === false && this.c_2 === true && this.c_3 === true)
            this.cdv_switch = 6;
        if (this.c_1 === true && this.c_2 === true && this.c_3 === true)
            this.cdv_switch = 7;
        this.changeCDVSwitch(this.cdv_switch);
    }
    setC_S() {
        if (this.cdv_switch = 0) {
            this.c_1 === false, this.c_2 === false, this.c_3 === false;
        }
        if (this.cdv_switch = 1) {
            this.c_1 === true, this.c_2 === false, this.c_3 === false;
        }
        if (this.cdv_switch = 2) {
            this.c_1 === false, this.c_2 === true, this.c_3 === false;
        }
        if (this.cdv_switch = 3) {
            this.c_1 === false, this.c_2 === false, this.c_3 === true;
        }
        if (this.cdv_switch = 4) {
            this.c_1 === true, this.c_2 === true, this.c_3 === false;
        }
        if (this.cdv_switch = 5) {
            this.c_1 === true, this.c_2 === false, this.c_3 === true;
        }
        if (this.cdv_switch = 6) {
            this.c_1 === false, this.c_2 === true, this.c_3 === true;
        }
        if (this.cdv_switch = 7) {
            this.c_1 === true, this.c_2 === true, this.c_3 === true;
        }
    }
    changeCDVSwitch(input) {
        this.cdv_switch = input;
        this.animate.changeCDVSwitch(this.cdv_switch);
    }
    changeCurIndex(cur_index = 0) {
        this.cur_index = cur_index;
        this.animate.cur_index = this.cur_index;
    }
    changeTime(time) {
        this.time = time;
        this.animate.time = this.time;
    }
    runAnimation() {
        this.animate.animate_history();
    }
    takeSnapshot() {
        this.animate.history_snapshot();
    }
}
class ObjectManager {
}
class PointLight {
}
class DirectionalLight {
}
class SpotLight {
}
class AreaLight {
}
class AmbientLight {
}
class AmbientLighting {
}
class DiffuseLighting {
}
class SpecularLighting {
}
class FlatShading {
}
class GouraudShading {
}
class PhongShading {
}
class BlinnPhongShading {
}
// We implement a function closure here by binding the variable 'implementDrag'
// to a local function and invoking the local function, this ensures that we have
// some sort of private variables
var implementDrag = (function () {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, prev = 0, now = Date.now(), dt = now - prev + 1, dX = 0, dY = 0, sens = 10, 
    // We invoke the local functions (changeSens and startDrag) as methods
    // of the object 'retObject' and set the return value of the local function
    // to 'retObject'
    retObject = {
        change: changeSens,
        start: drag,
        sensitivity: getSens()
    };
    function changeSens(value) {
        sens = value;
    }
    function getSens() {
        return sens;
    }
    function drag(element) {
        startDragMobile(element);
        startDrag(element);
    }
    function startDrag(element) {
        element.onmousedown = dragMouseDown;
    }
    function startDragMobile(element) {
        element.addEventListener('touchstart', dragTouchstart, { 'passive': true });
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = dragMouseup;
        document.onmousemove = dragMousemove;
    }
    function dragTouchstart(e) {
        e = e || window.event;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        document.addEventListener('touchend', dragTouchend, { 'passive': true });
        document.addEventListener('touchmove', dragTouchmove, { 'passive': true });
    }
    function dragMousemove(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        pos3 = e.clientX;
        pos4 = e.clientY;
        dX = pos1 / dt;
        dY = pos2 / dt;
        prev = now;
        now = Date.now();
        dt = now - prev + 1;
        console.log(`X: ${dX * sens}`);
        console.log(`Y: ${dY * sens}`);
    }
    function dragTouchmove(e) {
        e = e || window.event;
        pos1 = e.touches[0].clientX - pos3;
        pos2 = e.touches[0].clientY - pos4;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        dX = pos1 / dt;
        dY = pos2 / dt;
        prev = now;
        now = Date.now();
        dt = now - prev + 1;
        console.log(`X: ${dX * sens}`);
        console.log(`Y: ${dY * sens}`);
    }
    function dragMouseup() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    function dragTouchend() {
        document.addEventListener('touchend', () => null, { 'passive': true });
        document.addEventListener('touchmove', () => null, { 'passive': true });
    }
    return retObject;
})();
implementDrag.start(canvas);
function pick(event, destination) {
    const bounding = canvas.getBoundingClientRect();
    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;
    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;
    const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    destination.color.innerHTML = rgba;
    destination.pixel.innerHTML = `(${x},${y})`;
    return rgba;
}
canvas.addEventListener("mousemove", (event) => pick(event, hovered));
canvas.addEventListener("click", (event) => pick(event, selected));
const _Classes = (bases) => {
    class Bases {
        constructor() {
            bases.foreach((base) => Object.assign(this, new base()));
        }
    }
    bases.forEach((base) => {
        Object.getOwnPropertyNames(base.prototype)
            .filter(prop => prop != 'constructor')
            .forEach(prop => Bases.prototype[prop] = base.prototype[prop]);
    });
    return Bases;
};
class Experimental {
    constructor() { }
    draw(coords, fill_style = "red", stroke_style = "black", stroke_width = 1, fill_bool = false) {
        ctx.globalAlpha = MODIFIED_PARAMS._GLOBAL_ALPHA;
        if (coords.length === 1) {
            const a = coords[0];
            if (a.r === 0)
                this.drawPoint(a, fill_style, stroke_style);
            else
                this.drawCircle(a.x, a.y, a.r, fill_style, stroke_style);
        }
        if (coords.length === 2) {
            const [a, b] = [...coords];
            this.drawLine(a, b, stroke_style, stroke_width);
        }
        if (coords.length === 3) {
            const [p, q, r] = [...coords];
            this.drawTriangle(p, q, r, fill_style, stroke_style);
        }
        else if (coords.length > 3) {
            this.drawPolygon(coords, fill_style, stroke_style, stroke_width, fill_bool);
        }
    }
    getCircumCircle_(coords) {
        const [a, b, c] = [...coords];
        return _Linear.getCircumCircle(a, b, c);
    }
    getInCircle_(coords) {
        const [a, b, c] = [...coords];
        return _Linear.getInCircle(a, b, c);
    }
    drawTriangle(a, b, c, fill_style = "red", stroke_style = "black") {
        if (typeof a !== "undefined" && typeof b !== "undefined" && typeof c !== "undefined") {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.closePath();
            const _a = (Math.sqrt((c.x - b.x) ** 2 + (c.y - b.y) ** 2));
            const _b = (Math.sqrt((c.x - a.x) ** 2 + (c.y - a.y) ** 2));
            const _c = (Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2));
            const perimeter = _a + _b + _c;
            const semiperimeter = perimeter * 0.5;
            const area = Math.sqrt(semiperimeter * (semiperimeter - _a) * (semiperimeter - _b) * (semiperimeter - _c));
            const stroke_width = Math.round(Math.sqrt(area / perimeter));
            ctx.fillStyle = fill_style;
            ctx.fill();
            ctx.strokeStyle = stroke_style;
            ctx.lineWidth = stroke_width;
            ctx.stroke();
        }
    }
    drawPolygon(coords, fill_style = "red", stroke_style = "black", stroke_width = 1, fill_bool = false) {
        ctx.beginPath();
        ctx.moveTo(coords[0].x, coords[0].y);
        for (let coord of coords) {
            ctx.lineTo(coord.x, coord.y);
        }
        ctx.closePath();
        if (fill_bool === true) {
            ctx.fillStyle = fill_style;
            ctx.fill();
        }
        ctx.strokeStyle = stroke_style;
        ctx.lineWidth = stroke_width;
        ctx.stroke();
    }
    drawCircle(x, y, r, fill_style = "red", stroke_style = "black") {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.closePath();
        const circumference = 2 * Math.PI * r;
        const area = Math.PI * r ** 2;
        const stroke_width = Math.round(Math.sqrt(area / circumference));
        ctx.fillStyle = fill_style;
        ctx.fill();
        ctx.strokeStyle = stroke_style;
        ctx.lineWidth = stroke_width;
        ctx.stroke();
    }
    drawPoint(o, fill_style = "black", stroke_style = "black", stroke_width = 1) {
        if (typeof o !== "undefined") {
            ctx.beginPath();
            ctx.arc(o.x, o.y, 5, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = fill_style;
            ctx.fill();
            ctx.strokeStyle = stroke_style;
            ctx.lineWidth = stroke_width;
            ctx.stroke();
        }
    }
    drawText(x, y, text, fill_style = "black") {
        ctx.fillStyle = fill_style;
        ctx.lineWidth = 5;
        ctx.fillText(text, x, y);
    }
    drawLineFromPointGradient(p, gradient, x_scale, stroke_style = "black", width = 1) {
        const intercept = p.y - gradient * p.x;
        const new_x = p.x + x_scale;
        const new_y = gradient * new_x + intercept;
        this.drawLine(new Point2D(p.x, p.y), new Point2D(new_x, new_y), stroke_style, width);
    }
    drawLine(a, b, stroke_style = "black", stroke_width = 1) {
        if (typeof a !== "undefined" && typeof b !== "undefined") {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = stroke_style;
            ctx.lineWidth = stroke_width;
            ctx.stroke();
        }
    }
    drawDelaunay(delaunay, stroke_style = "black", stroke_width = 1) {
        const edges = delaunay.list;
        const point_list = delaunay.full_point_list;
        for (let edge of edges) {
            const [start, end] = edge.split("-").map((value) => { return point_list[Number(value)]; });
            this.drawLine(start, end, stroke_style, stroke_width);
        }
    }
    drawPoints(points, fill_style = "red", stroke_style = "red", stroke_width = 1, divide = points.length) {
        for (let pt_index in points) {
            if (Number(pt_index) >= divide)
                continue;
            const point = points[pt_index];
            this.drawPoint(point, fill_style, stroke_style, stroke_width);
        }
    }
    labelPoints(points, fill_style = "orange", x_offset = 5, y_offset = -5, divide = points.length) {
        for (let pt_index in points) {
            if (Number(pt_index) >= divide)
                continue;
            const point = points[pt_index];
            this.drawText(point.x + x_offset, point.y + y_offset, pt_index, fill_style);
        }
    }
}
const _Experimental = new Experimental();
// const tricoords = [200, 400, 300, 100, 500, 450];
const points_Set = [
    // [23, 29],
    // [328, 87],
    // [98, 234],
    // [892, 382],
    // [745, 342],
    // [442, 298],
    // [232, 450],
    // [900, 23],
    // [500, 500],
    // [573, 18],
    [294, 289],
    [423, 200],
    [234, 234],
    [300, 213],
    [278, 258],
    [352, 331]
];
const pts = [
    [302, 447],
    [519, 406],
    [354, 321],
    [555, 427],
    [357, 502],
    [365, 511],
    [401, 488],
    [335, 320],
    [531, 449],
    [418, 336]
];
pts.forEach((value, index) => { pts[index] = [value[0] / 3 + 200, value[1] / 3 + 200]; });
// console.log(pts)
_DrawCanvas.drawCanvas();
// const gen_points = _Miscellanous.generatePointsArray(300,600,300,550,10,false);
// const gen_points = _Miscellanous.generatePointsArray(300,900,150,380,50,true);
// const gen_points = _Miscellanous.generatePointsArray(50,1200,50,500,20,false);
// const mod_points_Set = _Miscellanous.toPoints(gen_points);
// const start = new Date().getTime();
// const end = new Date().getTime();
// if (d_result[5] === true) console.log(`Time taken for bowyer-watson with animation logging: ${end - start}`);
// if (d_result[5] === false) 
// console.log(`Time taken for voronoi diagram without animation logging: ${end - start}`);
const pts_mod = _Miscellanous.toPoints2D(pts);
const color_list = _Miscellanous.ranHexCol(20);
const _LinearAlgebraSupport = new LinearAlgebraSupport(pts_mod, 0);
_LinearAlgebraSupport.animate.time = Number(anim_speed_input.value); // actual time
anim_number_input.oninput = function () {
    _LinearAlgebraSupport.animate.running = false;
    anim_number.innerHTML = anim_number_input.value;
    _LinearAlgebraSupport.changeCurIndex(Number(anim_number_input.value));
    _LinearAlgebraSupport.takeSnapshot();
};
anim_speed_input.oninput = function () {
    _LinearAlgebraSupport.animate.running = false;
    anim_speed.innerHTML = anim_speed_input.value;
    _LinearAlgebraSupport.animate.time = Number(anim_speed_input.value);
};
anim_info_btn.onclick = function () {
    if (_LinearAlgebraSupport.animate.running === false) {
        _LinearAlgebraSupport.runAnimation();
    }
    else {
        _LinearAlgebraSupport.animate.running = false;
    }
};
c_1.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    _LinearAlgebraSupport.animate.running = false;
    if (_LinearAlgebraSupport.c_1 === true) {
        _LinearAlgebraSupport.c_1 = false;
        c_1.style.backgroundColor = "#4CAF50";
        _LinearAlgebraSupport.checkC_S();
    }
    else if (_LinearAlgebraSupport.c_1 === false) {
        _LinearAlgebraSupport.c_1 = true;
        c_1.style.backgroundColor = "rgb(106, 231, 11)";
        _LinearAlgebraSupport.checkC_S();
    }
    _LinearAlgebraSupport.takeSnapshot();
};
c_2.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    _LinearAlgebraSupport.animate.running = false;
    if (_LinearAlgebraSupport.c_2 === true) {
        _LinearAlgebraSupport.c_2 = false;
        c_2.style.backgroundColor = "#4CAF50";
        _LinearAlgebraSupport.checkC_S();
    }
    else if (_LinearAlgebraSupport.c_2 === false) {
        _LinearAlgebraSupport.c_2 = true;
        c_2.style.backgroundColor = "rgb(106, 231, 11)";
        _LinearAlgebraSupport.checkC_S();
    }
    _LinearAlgebraSupport.takeSnapshot();
};
c_3.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    _LinearAlgebraSupport.animate.running = false;
    if (_LinearAlgebraSupport.c_3 === true) {
        _LinearAlgebraSupport.c_3 = false;
        c_3.style.backgroundColor = "#4CAF50";
        _LinearAlgebraSupport.checkC_S();
    }
    else if (_LinearAlgebraSupport.c_3 === false) {
        _LinearAlgebraSupport.c_3 = true;
        c_3.style.backgroundColor = "rgb(106, 231, 11)";
        _LinearAlgebraSupport.checkC_S();
    }
    _LinearAlgebraSupport.takeSnapshot();
};
for (let elem of c_elems) {
    elem.addEventListener("mouseover", (ev) => { elem.style.border = "3px solid burlywood"; });
    elem.addEventListener("mouseout", () => { elem.style.border = "none"; });
}
// EDITING
// ANIMATION
// SCULPTING
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
    sumPoints(points, dim) {
        var res = 0;
        for (const point of points) {
            switch (dim) {
                case 0:
                    res += point.x;
                    break;
                case 1:
                    res += point.y;
                    break;
                case 2:
                    res += point.z;
                    break;
            }
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
            const sum_x = this.sumPoints(face_vertices, 0);
            const sum_y = this.sumPoints(face_vertices, 1);
            const sum_z = this.sumPoints(face_vertices, 2);
            const face_point = new Point3D(sum_x / this.face_vertex_num, sum_y / this.face_vertex_num, sum_z / this.face_vertex_num);
            this.face_points.push(face_point);
        }
        for (const edge of this.connectivity_matrix.edges) {
            const edge_vertices_full = [];
            const [f_p_a, f_p_b] = this.getEdgeNeighbouringFacePoints(edge);
            const edge_vertices = this.getEdgeVertices(edge);
            edge_vertices_full.push(...edge_vertices, f_p_a, f_p_b);
            const sum_x = this.sumPoints(edge_vertices_full, 0);
            const sum_y = this.sumPoints(edge_vertices_full, 1);
            const sum_z = this.sumPoints(edge_vertices_full, 2);
            const edge_point = new Point3D(sum_x / 4, sum_y / 4, sum_z / 4);
            this.edge_points.push(edge_point);
        }
        for (const point_index in this.points_list) {
            const P = this.points_list[point_index];
            const F_list = [];
            const R_list = [];
            var n = 0;
            for (const face_point_index in this.face_points) {
                const face = this.connectivity_matrix.faces[face_point_index];
                if (this.isTouchingVertex(face, Number(point_index))) {
                    F_list.push(this.face_points[face_point_index]);
                    n++;
                }
            }
            for (const edge of this.connectivity_matrix.edges) {
                if (this.isTouchingVertex(edge, Number(point_index))) {
                    const edge_vertices = this.getEdgeVertices(edge);
                    const sum_x = this.sumPoints(edge_vertices, 0);
                    const sum_y = this.sumPoints(edge_vertices, 1);
                    const sum_z = this.sumPoints(edge_vertices, 2);
                    const edge_midpoint = new Point3D(sum_x / 2, sum_y / 2, sum_z / 2);
                    R_list.push(edge_midpoint);
                    n++;
                }
            }
            n /= 2;
            const f_sum_x = this.sumPoints(F_list, 0);
            const f_sum_y = this.sumPoints(F_list, 1);
            const f_sum_z = this.sumPoints(F_list, 2);
            const r_sum_x = this.sumPoints(R_list, 0);
            const r_sum_y = this.sumPoints(R_list, 1);
            const r_sum_z = this.sumPoints(R_list, 2);
            const F = new Point3D(f_sum_x / n, f_sum_y / n, f_sum_z / n);
            const R = new Point3D(r_sum_x / n, r_sum_y / n, r_sum_z / n);
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
