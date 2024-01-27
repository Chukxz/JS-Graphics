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

  points3DToVec3D(pointList: Point3D[]) : _3D_VEC_[]{
    const retList: _3D_VEC_[] = [];
    for(let point of pointList){
        retList.push([point.x,point.y,point.z])
    }
    return retList;
  }

  vecs3DToPoints3D(vecList: _3D_VEC_[]) : Point3D[]{
    const retList: Point3D[] = [];
    for(let vec of vecList){
        retList.push(new Point3D(vec[0], vec[1], vec[2]));
    }
    return retList;
  }

  vecs4DToPoints3D(vecList: _4D_VEC_[]){
    const retList: Point3D[] = [];
    for(let vec of vecList){
        retList.push(new Point3D(vec[0], vec[1], vec[2]));
    }
    return retList;
  }

  vecs4DToPoints2D(vecList: _4D_VEC_[]){
    const retList: Point2D[] = [];
    for(let vec of vecList){
        retList.push(new Point2D(vec[0], vec[1]));
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
  private normalize: boolean;
  private theta: number;
  private q_vector: _3D_VEC_;
  private q_quarternion: _4D_VEC_;
  private q_inv_quarternion: _4D_VEC_;

  constructor () {
      this.q_vector = DEFAULT_PARAMS._Q_VEC
      this.q_quarternion = DEFAULT_PARAMS._Q_QUART;
      this.q_inv_quarternion = DEFAULT_PARAMS._Q_INV_QUART;
      this.theta = DEFAULT_PARAMS._THETA;
  }

  vector(input_vec: _3D_VEC_,normalized = true) { // recommended if vector is not a unit vector i.e non-normalized
      // normalize flag to normalize vector (create a unit vector)
      if(normalized === true) this.q_vector = input_vec;
      else {
          const [v1,v2,v3] = input_vec
          const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3,-0.5);
          this.q_vector = [v1 * inv_mag,v2 * inv_mag,v3 * inv_mag];
      }
  }

  q_mag(quart: _4D_VEC_) {
      const [w,x,y,z] = quart;
      return Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,0.5);
  }

  quarternion(normalized = true) {
      // quarternion

      const [v1,v2,v3] = this.q_vector;
      const [a,b] = [Math.cos(this.theta * 0.5),Math.sin(this.theta * 0.5)];
      this.q_quarternion = [a,v1 * b,v2 * b,v3 * b];

      if(normalized === false) // normalize the quartenion
      {
          const [w,x,y,z] = this.q_quarternion;
          const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,-0.5);
          this.q_quarternion = [w * inv_mag,x * inv_mag,y * inv_mag,z * inv_mag];
      }
  };

  inv_quartenion(normalized = true) {
      // inverse quarternion           
      const [v1,v2,v3] = this.q_vector;
      const [a,b] = [Math.cos(this.theta * 0.5),Math.sin(this.theta * 0.5)];
      this.q_inv_quarternion = [a,-v1 * b,-v2 * b,-v3 * b];

      if(normalized === false) // normalize the quartenion
      {
          const [w,x,y,z] = this.q_inv_quarternion;
          const inv_mag = Math.pow(w ** 2 + x ** 2 + y ** 2 + z ** 2,-0.5);
          this.q_inv_quarternion = [w * inv_mag,x * inv_mag,y * inv_mag,z * inv_mag];
      }
  };

  q_mult(quart_A: _4D_VEC_,quart_B: _4D_VEC_): _4D_VEC_ {
      // quarternion _ quarternion multiplication
      const [w1,x1,y1,z1] = quart_A
      const [w2,x2,y2,z2] = quart_B

      return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2),(w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2),(w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2),(w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
  }

  q_v_invq_mult(input_vec: _3D_VEC_): _3D_VEC_ {
      // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
      // with additional translating (for points) and scaling (for point and vectors) capabilities
      const output_vec: _4D_VEC_ = [0,...input_vec]

      return this.q_mult(this.q_quarternion,this.q_mult(output_vec,this.q_inv_quarternion)).splice(1) as _3D_VEC_;
  }

  q_v_q_mult(input_vec: _3D_VEC_): _3D_VEC_ {
      // quarternion _ vector _ inverse quarternion multiplication for point and vector reflection
      // with additional translating (for points) and scaling (for point and vectors) capabilities
      const output_vec: _4D_VEC_ = [0,...input_vec]

      return this.q_mult(this.q_quarternion,this.q_mult(output_vec,this.q_quarternion)).splice(1) as _3D_VEC_;
  }

  q_rot(_angle: number = 0,_vector: _3D_VEC_ = [0,0,1],_point: _3D_VEC_ = [0,0,0]): _3D_VEC_ {
      this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT * _angle;
      this.vector(_vector);
      this.quarternion();
      this.inv_quartenion()
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

      console.log(minorMat)

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

  mag(vec: number[]): number {
      const v_len: number = vec.length;
      var magnitude: number = 0;

      for(let i = 0; i < v_len; i++) {
          magnitude += vec[i] ** 2
      }

      return Math.sqrt(magnitude);
  }

  normalizeVec(vec: number[]): number[] {
      const len: number = Math.round(vec.length);
      const magnitude: number = this.mag(vec);
      const ret_vec: number[] = [];

      for(let i = 0; i < len; i++) {
          ret_vec[i] = vec[i] / magnitude;
      }

      return ret_vec;
  }

  dotProduct(vecA_or_magA: number | number[],vecB_or_magB: number | number[],angle = undefined): number {
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

  crossProduct(vecs_or_mags: number[] | number[][],angle = undefined,unitVec = undefined): number | number[] {
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

  getCrossProductAngle(vecs: number[] | number[][]): number | undefined { // get the angle between the vectors (makes sense in 3d, but feels kinda weird for higher dimensions but sorta feels like it works...???)
      var cross_product_angle: number | undefined = undefined;
      const vecs_len = vecs.length;
      const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
      var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
      // it means that all the vectors are of dimenstion n + 1
      const cross_product_mag = this.mag(this.crossProduct(vecs) as number[]);
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

  getCrossPUnitVec(vecs: number[]) {
      var cross_product_unit_vec: number[] = [];

      const cross_product = this.crossProduct(vecs);
      const cross_product_mag = this.mag((cross_product as number[]));
      cross_product_unit_vec = _Matrix.scaMult(1 / cross_product_mag,(cross_product as number[]));

      return cross_product_unit_vec;
  }
}

class PerspectiveProjection {

  constructor () {}

  changeNearZ(val: number) {
      MODIFIED_PARAMS._NZ = val;
      this.setPersProjectParam();
  }

  changeFarZ(val: number) {
      MODIFIED_PARAMS._FZ = val;
      this.setPersProjectParam();
  }

  changeProjAngle(val: number) {
      MODIFIED_PARAMS._PROJ_ANGLE = val;
      this.setPersProjectParam();
  }

  setPersProjectParam() {
      MODIFIED_PARAMS._DIST = 1 / (Math.tan(MODIFIED_PARAMS._PROJ_ANGLE / 2 * MODIFIED_PARAMS._ANGLE_CONSTANT));
      MODIFIED_PARAMS._PROJECTION_MAT = [MODIFIED_PARAMS._DIST / MODIFIED_PARAMS._ASPECT_RATIO,0,0,0,0,MODIFIED_PARAMS._DIST,0,0,0,0,(-MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ),(2 * MODIFIED_PARAMS._FZ * MODIFIED_PARAMS._NZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ),0,0,1,0];

      console.log("persproj")
      const inverse_res: number[] | undefined = _Matrix.getInvMat(MODIFIED_PARAMS._PROJECTION_MAT,4);
      if(typeof inverse_res === "undefined") return;
      if(inverse_res.length !== 16) return;
      MODIFIED_PARAMS._INV_PROJECTION_MAT = inverse_res as _16D_VEC_;
  }

  persProject(input_array: _4D_VEC_): _4D_VEC_ {
      return _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT,input_array,[4,4],[4,1]) as _4D_VEC_;
  }

  invPersProject(input_array: _4D_VEC_): _4D_VEC_ {
      return _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT,input_array,[4,4],[4,1]) as _4D_VEC_;
  }
}

class Clip {
    constructor () {}

    canvasTo(arr: _4D_VEC_): _4D_VEC_ {
        const array: _4D_VEC_ = [...arr];
        array[0] -= MODIFIED_PARAMS._HALF_X;
        array[1] -= MODIFIED_PARAMS._HALF_Y;
        return array;
    }

    clipCoords(arr: _4D_VEC_): _4D_VEC_ {
        const array: _4D_VEC_ = [...arr];
        array[0] /= MODIFIED_PARAMS._HALF_X;
        array[1] /= MODIFIED_PARAMS._HALF_Y;
        return array;
    }

    toCanvas(arr: _4D_VEC_): _4D_VEC_ {
        const array: _4D_VEC_ = [...arr];
        array[0] += MODIFIED_PARAMS._HALF_X;
        array[1] += MODIFIED_PARAMS._HALF_Y;
        return array;
    }

    unclipCoords(arr: _4D_VEC_): _4D_VEC_ {
        const array: _4D_VEC_ = [...arr];
        array[0] *= MODIFIED_PARAMS._HALF_X;
        array[1] *= MODIFIED_PARAMS._HALF_Y;
        return array;
    }
}

interface OPTICALELEMENT {
    instance_number: number;
    optical_type: _OPTICAL_;
    _LOOK_AT_POINT: _3D_VEC_;
    _U: _3D_VEC_;
    _V: _3D_VEC_;
    _N: _3D_VEC_;
    _C: _3D_VEC_;
    _MATRIX: _16D_VEC_;
    _INV_MATRIX: _16D_VEC_,
    depthBuffer: Float64Array,
    frameBuffer: Uint8Array,
    translation_array : _3D_VEC_,
}

class CreateObject {
    object_rotation_angle: number;
    object_revolution_angle: number;
    object_translation_array: _3D_VEC_;
    object_rotation_axis: _3D_VEC_;
    object_revolution_axis: _3D_VEC_;
    rendered_points_list: _3D_VEC_[];
    object_revolution_angle_backup: number;
    object_translation_array_backup: _3D_VEC_;
    points_list: Point3D[];

    constructor () {
        this.object_rotation_angle = 0;
        this.object_revolution_angle = 0;
        this.object_translation_array = [0,0,0];
        this.object_rotation_axis = [0,0,0];
        this.object_revolution_axis = [0,0,0];
        this.rendered_points_list = [];
        this.object_revolution_angle_backup = 0;
        this.object_translation_array_backup = [0,0,0];
        this.points_list = [];
    }
}

class OpticalElement extends CreateObject {
    // Default

    // _CAM_MATRIX : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    // _INV_CAM_MATRIX : [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1],
    // actpos = [0,0,1],
    // usedpos = [0,0,-1]

    instance: OPTICALELEMENT = {
        instance_number: 0,
        optical_type: "none",
        _LOOK_AT_POINT: [0,0,0],
        _U: [0,0,0],
        _V: [0,0,0],
        _N: [0,0,0],
        _C: [0,0,0],
        _MATRIX: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1] as _16D_VEC_,
        _INV_MATRIX: [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1] as _16D_VEC_,
        depthBuffer: _Miscellanous.initDepthBuffer(),
        frameBuffer: _Miscellanous.initFrameBuffer(),
        translation_array : [0,0,0],
    }

    constructor (optical_type_input: _OPTICAL_) {
        super();
        this.instance.optical_type = optical_type_input;
        return this;
    }

    resetBuffers() {
        //_Miscellanous.resetDepthBuffer(this.instance.depthBuffer);
        //_Miscellanous.resetFrameBuffer(this.instance.frameBuffer);
    }

    setCoordSystem() {
        const DIFF: _3D_VEC_ = _Matrix.matAdd(this.instance._LOOK_AT_POINT,this.instance._C,true) as _3D_VEC_;
        const UP: _3D_VEC_ = [0,1,0];

        this.instance._N = _Vector.normalizeVec(DIFF) as _3D_VEC_;
        this.instance._U = _Vector.normalizeVec(_Vector.crossProduct([UP,this.instance._N]) as number[]) as _3D_VEC_;
        this.instance._V = _Vector.normalizeVec(_Vector.crossProduct([this.instance._N,this.instance._U]) as number[]) as _3D_VEC_;

        this.points_list = _Miscellanous.vecs3DToPoints3D([this.instance._U, this.instance._V, this.instance._N]);
    }

    setConversionMatrices() {
        this.instance._MATRIX = [...this.instance._U,this.instance._C[0],...this.instance._V,this.instance._C[1],...this.instance._N,this.instance._C[2],...[0,0,0,1]] as _16D_VEC_;
        this.instance._INV_MATRIX = _Matrix.getInvMat(this.instance._MATRIX,4) as _16D_VEC_;
    }

    setLookAtPos(look_at_point: _3D_VEC_) {
        this.instance._LOOK_AT_POINT = look_at_point;
    }

    // rotateObject(axis: _3D_VEC_,angle: number) {
        

    //     for(const index in object.points_list) {
    //         const orig_pt = object.points_list[index];
    //         const original_vector: _3D_VEC_ = [orig_pt.x,orig_pt.y,orig_pt.z];
    //         const rotated_vector = this.vertexRotate(original_vector,axis,angle);
    //         const translated_vector = this.vertexTranslate(rotated_vector,object.object_translation_array);
    //         const revolved_vector = this.vertexRotate(translated_vector,object.object_revolution_axis,object.object_revolution_angle);
    //         object.rendered_points_list.push(revolved_vector);
    //     }

    //     object.object_rotation_angle = angle;
    //     object.object_rotation_axis = axis;
    // }

    // revolveObject(axis: _3D_VEC_,angle: number) {
    //     const object = this.getCurrentObjectInstance();
    //     if(typeof object === "undefined") return;

    //     object.rendered_points_list = [];

    //     for(const index in object.points_list) {
    //         const orig_pt = object.points_list[index];
    //         const original_vector: _3D_VEC_ = [orig_pt.x,orig_pt.y,orig_pt.z];
    //         const rotated_vector = this.vertexRotate(original_vector,object.object_rotation_axis,object.object_rotation_angle);
    //         const translated_vector = this.vertexTranslate(rotated_vector,object.object_translation_array);
    //         const revolved_vector = this.vertexRotate(translated_vector,axis,angle);
    //         object.rendered_points_list.push(revolved_vector);
    //     }

    //     object.object_revolution_angle = angle;
    //     object.object_revolution_angle_backup = angle;
    //     object.object_revolution_axis = axis;
    // }

    // translateObject(translation_array: _3D_VEC_) {
    //     const object = this.getCurrentObjectInstance();
    //     if(typeof object === "undefined") return;

    //     object.rendered_points_list = [];

    //     for(const index in object.points_list) {
    //         const orig_pt = object.points_list[index];
    //         const original_vector: _3D_VEC_ = [orig_pt.x,orig_pt.y,orig_pt.z];
    //         const rotated_vector = this.vertexRotate(original_vector,object.object_rotation_axis,object.object_rotation_angle);
    //         const translated_vector = this.vertexTranslate(rotated_vector,translation_array);
    //         const revolved_vector = this.vertexRotate(translated_vector,object.object_revolution_axis,object.object_revolution_angle);
    //         object.rendered_points_list.push(revolved_vector);
    //     }

    //     object.object_translation_array = translation_array;
    //     object.object_translation_array_backup = translation_array;
    // }

    rotate(plane: _PLANE_,angle: number) : void | undefined {
        if(plane === "U-V") {
            const _U_N = _Quartenion.q_rot(angle,this.instance._U,this.instance._N);
            const _V_N = _Quartenion.q_rot(angle,this.instance._V,this.instance._N);

            if(typeof _U_N === "number") return undefined
            if(typeof _V_N === "number") return undefined
            this.instance._U = _U_N as _3D_VEC_;
            this.instance._V = _V_N as _3D_VEC_;

        } else if(plane === "U-N") {
            const _U_V = _Quartenion.q_rot(angle,this.instance._U,this.instance._V);
            const _V_N = _Quartenion.q_rot(angle,this.instance._V,this.instance._N);

            if(typeof _U_V === "number") return undefined
            if(typeof _V_N === "number") return undefined
            this.instance._U = _U_V as _3D_VEC_;
            this.instance._V = _V_N as _3D_VEC_;

        } else if(plane === "V-N") {
            const _U_V = _Quartenion.q_rot(angle,this.instance._U,this.instance._V);
            const _U_N = _Quartenion.q_rot(angle,this.instance._U,this.instance._N);

            if(typeof _U_V === "number") return undefined
            if(typeof _U_N === "number") return undefined
            this.instance._U = _U_V as _3D_VEC_;
            this.instance._V = _U_N as _3D_VEC_;
        }

        this.setConversionMatrices()
    }

    translate(translation_array: _3D_VEC_) {
        this.instance._C = translation_array;
    }

    worldToOpticalObject(ar: _3D_VEC_): _4D_VEC_ {
        console.log("instance", this.instance)
        const arr: _4D_VEC_ = [...ar,1]
        const result: _4D_VEC_ = _Matrix.matMult(this.instance._MATRIX,arr,[4,4],[4,1]) as _4D_VEC_;
        return result;
    }

    opticalObjectToWorld(arr: _4D_VEC_): _3D_VEC_ {
        const result: _4D_VEC_ = _Matrix.matMult(this.instance._INV_MATRIX,arr,[4,4],[4,1]) as _4D_VEC_;
        const new_result: _3D_VEC_ = result.slice(0,3) as _3D_VEC_;
        return new_result;
    }
}

class ClipSpace {
    constructor () {};

    opticalObjectToClip(arr: _4D_VEC_): _4D_VEC_ {
        const orig_proj: _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT,arr,[4,4],[4,1]) as _4D_VEC_;
        const pers_div: _4D_VEC_ = _Matrix.scaMult(1 / orig_proj[3],orig_proj,true) as _4D_VEC_;
        return pers_div;
    };

    clipToOpticalObject(arr: _4D_VEC_): _4D_VEC_ {
        const rev_pers_div: _4D_VEC_ = _Matrix.scaMult(arr[3],arr,true) as _4D_VEC_;
        const rev_orig_proj: _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT,rev_pers_div,[4,4],[4,1]) as _4D_VEC_;
        return rev_orig_proj;
    };
}

class ScreenSpace {
    constructor () {};

    clipToScreen(arr: _4D_VEC_): _4D_VEC_ | undefined {
        if(arr[2] >= -1.1 && arr[2] <= 1.1 && arr[2] != Infinity) {
            arr[2] = arr[2];
            const [i,j,k,l] = _Clip.unclipCoords(arr);
            const [x,y,z,w] = _Clip.toCanvas([i,j,k,l]);
            return [x,y,z,w];
        }
        else return undefined;
    };

    screenToClip(arr: _4D_VEC_): _4D_VEC_ {
        const [i,j,k,l] = _Clip.canvasTo(arr);
        const [x,y,z,w] = _Clip.clipCoords([i,j,k,l]);
        return [x,y,z,w];
    };
}

const _ScreenSpace = new ScreenSpace();

class OpticalElement_Objects {
    optical_element_array: OpticalElement[]
    instance_number: number;
    arrlen: number;

    selected_light_instances: object;
    selected_camera_instances: object;

    max_camera_instance_number: number;
    max_light_instance_number: number;

    instance_number_to_list_map: object;

    constructor () {
        this.arrlen = 0;
        this.instance_number = 0;
        this.max_camera_instance_number = 0;
        this.max_light_instance_number = 0;

        this.optical_element_array = [];
        this.selected_light_instances = {};
        this.selected_camera_instances = {};
        this.instance_number_to_list_map = {};

        let self = this;

        window.addEventListener("load",()=>{
            self.createNewCameraObject();
            self.createNewLightObject();
        })
    }

    createNewCameraObject() {
        this.max_camera_instance_number = this.instance_number;
        this.optical_element_array[this.arrlen] = new OpticalElement("camera");
        this.instance_number_to_list_map[this.instance_number] = this.arrlen;
        this.instance_number++;
        this.arrlen++;

        this.optical_element_array[0].translate(0,0,-10);
        this.optical_element_array[0].setLookAtPos(0,0,0);
        this.optical_element_array[0].setCoordSystem();
        this.optical_element_array[0].setConversionMatrices();
        console.log(this.optical_element_array[0].instance)
        this.select_camera_instance(0);
    }

    createNewLightObject() {
        this.max_light_instance_number = this.instance_number;
        this.optical_element_array[this.arrlen] = new OpticalElement("light");
        this.instance_number_to_list_map[this.instance_number] = this.arrlen;
        this.instance_number++;
        this.arrlen++;

        this.select_light_instance(1);
    }

    createNewMultipleCameraObjects = (num: number) => { if(num > 0) while(num > 0) { this.createNewCameraObject(); num--; } }

    createNewMultipleLightObjects = (num: number) => { if(num > 0) while(num > 0) { this.createNewLightObject(); num--; } }

    private deleteOpticalObject(instance_number_input: number,index: number) {
        this.optical_element_array.splice(index,1);
        delete this.instance_number_to_list_map[instance_number_input];

        for(const key in this.instance_number_to_list_map) {
            if(Number(key) > instance_number_input) {
                this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
            }
        }

        if(instance_number_input in this.selected_camera_instances) delete this.selected_camera_instances[instance_number_input];
        if(instance_number_input in this.selected_light_instances) delete this.selected_light_instances[instance_number_input];

        if(Object.keys(this.selected_camera_instances).length === 0) this.selected_camera_instances[0] = 0;
        if(Object.keys(this.selected_light_instances).length === 0) this.selected_light_instances[1] = 1;
    }

    deleteCameraObject(instance_number_input: number) {
        if(instance_number_input > 1 && instance_number_input <= this.max_camera_instance_number) {
            const index = this.instance_number_to_list_map[instance_number_input];
            if(this.optical_element_array[index].instance.optical_type === "camera")// additional safety checks
            {
                this.deleteOpticalObject(instance_number_input,index);
                this.arrlen = this.optical_element_array.length;
            }
        }
    }

    deleteLightObject(instance_number_input: number) {
        if(instance_number_input > 1 && instance_number_input <= this.max_light_instance_number) {
            const index = this.instance_number_to_list_map[instance_number_input];
            if(this.optical_element_array[index].instance.optical_type === "light") // additional safety checks
            {
                this.deleteOpticalObject(instance_number_input,index);
                this.arrlen = this.optical_element_array.length;
            }
        }
    }

    // doesn't delete the first one
    deleteAllCameraObjects() {
        for(const key in this.instance_number_to_list_map) {
            const index = this.instance_number_to_list_map[key];
            if(index > 1 && this.optical_element_array[index].instance.optical_type === "camera") {
                this.deleteOpticalObject(Number(key),index);
            }
        }
        this.arrlen = this.optical_element_array.length;
    }

    // doesn't delete the first one
    deleteAllLightObjects() {
        for(const key in this.instance_number_to_list_map) {
            const index = this.instance_number_to_list_map[key];
            if(index > 1 && this.optical_element_array[index].instance.optical_type === "light") {
                this.deleteOpticalObject(Number(key),index);
            }
        }
        this.arrlen = this.optical_element_array.length;
    }

    // doesn't delete the first two
    deleteAllOpticalObjects() {
        for(const key in this.instance_number_to_list_map) {
            const index = this.instance_number_to_list_map[key];
            if(index > 1) {
                this.deleteOpticalObject(Number(key),index);
            }
        }
        this.arrlen = this.optical_element_array.length;
    }

    select_camera_instance(instance_number_input: number) {
        if(instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
            const selection = this.instance_number_to_list_map[instance_number_input];
            if(this.optical_element_array[selection].instance.optical_type === "camera") this.selected_camera_instances[instance_number_input] = selection;
        }
    }

    deselect_camera_instance(instance_number_input: number) {
        if(instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
            if(instance_number_input in this.selected_camera_instances) {
                const selection = this.instance_number_to_list_map[instance_number_input];
                if(this.optical_element_array[selection].instance.optical_type === "camera") delete this.selected_camera_instances[instance_number_input];

                if(Object.keys(this.selected_camera_instances).length === 0) {
                    this.selected_camera_instances[0] = 0;
                    if(instance_number_input === 0) return;
                }
            }
        }
    }

    select_light_instance(instance_number_input: number) {
        if(instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
            const selection = this.instance_number_to_list_map[instance_number_input]
            if(this.optical_element_array[selection].instance.optical_type === "light") this.selected_light_instances[instance_number_input] = selection;
        }
    }

    deselect_light_instance(instance_number_input: number) {
        if(instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
            if(instance_number_input in this.selected_light_instances) {
                const selection = this.instance_number_to_list_map[instance_number_input];
                if(this.optical_element_array[selection].instance.optical_type === "light") delete this.selected_light_instances[instance_number_input];

                if(Object.keys(this.selected_light_instances).length === 0) {
                    this.selected_light_instances[1] = 1;
                    if(instance_number_input === 1) return;
                }
            }
        }
    }

    render(vertex: _3D_VEC_,optical_type: _OPTICAL_, instance_number = 0): _4D_VEC_ | undefined {
        var world_to_optical_object_space: _4D_VEC_ = [0,0,0,0];

        switch(optical_type) {
            case "none": return undefined;
            case "camera":
                if(instance_number in this.selected_camera_instances) {
                    world_to_optical_object_space = this.optical_element_array[this.selected_camera_instances[instance_number]].worldToOpticalObject(vertex); 
                    break;
                }
                else return undefined;
            case "light":
                if(instance_number in this.selected_light_instances) {
                    world_to_optical_object_space = this.optical_element_array[this.selected_light_instances[instance_number]].worldToOpticalObject(vertex); 
                    break;
                }
                else return undefined;
        }

        console.log(vertex)
        console.log(world_to_optical_object_space)
        const optical_object_to_clip_space: _4D_VEC_ = _ClipSpace.opticalObjectToClip(world_to_optical_object_space);
        console.log(optical_object_to_clip_space)
        return _ScreenSpace.clipToScreen(optical_object_to_clip_space);
    }
}

const _Miscellanous = new Miscellanous();
const _Quartenion = new Quarternion();
const _Matrix = new Matrix();
const _Vector = new Vector();
const _Linear = new Linear();
const _PerspectiveProjection = new PerspectiveProjection();
const _Clip = new Clip()
const _ClipSpace = new ClipSpace();
const _Optical_Objects = new OpticalElement_Objects();
