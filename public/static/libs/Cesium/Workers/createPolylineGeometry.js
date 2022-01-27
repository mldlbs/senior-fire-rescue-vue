/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(["./when-8d13db60","./Check-70bec281","./Math-61ede240","./Cartographic-f27b0939","./Cartesian2-09435a6c","./BoundingSphere-c409f092","./Cartesian4-5af5bb24","./RuntimeError-ba10bc3e","./WebGLConstants-4c11ee5f","./ComponentDatatype-5862616f","./GeometryAttribute-2243653a","./PrimitiveType-97893bc7","./FeatureDetection-7bd32c34","./Transforms-1509c877","./buildModuleUrl-392763e2","./GeometryAttributes-aacecde6","./IndexDatatype-9435b55f","./IntersectionTests-dbfba52c","./Plane-2bcb9154","./VertexFormat-fe4db402","./arrayRemoveDuplicates-2869246d","./ArcType-66bc286a","./EllipsoidRhumbLine-6ca4b1e6","./EllipsoidGeodesic-db2069b3","./PolylinePipeline-65700d85","./Color-69f1845f"],function(ae,m,oe,ie,v,ne,e,t,r,le,se,pe,a,o,l,de,ce,i,n,C,ue,ye,s,p,fe,he){var me=[];function ve(e,t,r,a,o){var i,n=me;n.length=o;var l=r.red,s=r.green,p=r.blue,d=r.alpha,c=a.red,u=a.green,y=a.blue,f=a.alpha;if(he.Color.equals(r,a)){for(i=0;i<o;i++)n[i]=he.Color.clone(r);return n}var h=(c-l)/o,m=(u-s)/o,v=(y-p)/o,C=(f-d)/o;for(i=0;i<o;i++)n[i]=new he.Color(l+i*h,s+i*m,p+i*v,d+i*C);return n}function w(e){var t=(e=ae.defaultValue(e,ae.defaultValue.EMPTY_OBJECT)).positions,r=e.colors,a=ae.defaultValue(e.width,1),o=ae.defaultValue(e.hMax,-1),i=ae.defaultValue(e.colorsPerVertex,!1);if(!ae.defined(t)||t.length<2)throw new m.DeveloperError("At least two positions are required.");if("number"!=typeof a)throw new m.DeveloperError("width must be a number");if(ae.defined(r)&&(i&&r.length<t.length||!i&&r.length<t.length-1))throw new m.DeveloperError("colors has an invalid length.");this._positions=t,this._colors=r,this._width=a,this._hMax=o,this._colorsPerVertex=i,this._dist=e.dist,this._period=e.period,this._vertexFormat=C.VertexFormat.clone(ae.defaultValue(e.vertexFormat,C.VertexFormat.DEFAULT)),this._followSurface=ae.defaultValue(e.followSurface,!0),ae.defined(e.followSurface)&&(l.deprecationWarning("PolylineGeometry.followSurface","PolylineGeometry.followSurface is deprecated and will be removed in Cesium 1.55. Use PolylineGeometry.arcType instead."),e.arcType=e.followSurface?ye.ArcType.GEODESIC:ye.ArcType.NONE),this._arcType=ae.defaultValue(e.arcType,ye.ArcType.GEODESIC),this._followSurface=this._arcType!==ye.ArcType.NONE,this._granularity=ae.defaultValue(e.granularity,oe.CesiumMath.RADIANS_PER_DEGREE),this._ellipsoid=v.Ellipsoid.clone(ae.defaultValue(e.ellipsoid,v.Ellipsoid.WGS84)),this._workerName="createPolylineGeometry";var n=1+t.length*ie.Cartesian3.packedLength;n+=ae.defined(r)?1+r.length*he.Color.packedLength:1,this.packedLength=n+v.Ellipsoid.packedLength+C.VertexFormat.packedLength+4+2}w.pack=function(e,t,r){if(!ae.defined(e))throw new m.DeveloperError("value is required");if(!ae.defined(t))throw new m.DeveloperError("array is required");var a;r=ae.defaultValue(r,0);var o=e._positions,i=o.length;for(t[r++]=i,a=0;a<i;++a,r+=ie.Cartesian3.packedLength)ie.Cartesian3.pack(o[a],t,r);var n=e._colors;for(i=ae.defined(n)?n.length:0,t[r++]=i,a=0;a<i;++a,r+=he.Color.packedLength)he.Color.pack(n[a],t,r);return v.Ellipsoid.pack(e._ellipsoid,t,r),r+=v.Ellipsoid.packedLength,C.VertexFormat.pack(e._vertexFormat,t,r),r+=C.VertexFormat.packedLength,t[r++]=e._width,t[r++]=e._colorsPerVertex?1:0,t[r++]=e._arcType,t[r++]=e._granularity,t[r++]=e._hMax,t[r++]=e._dist,t[r]=e._period,t};var _=v.Ellipsoid.clone(v.Ellipsoid.UNIT_SPHERE),b=new C.VertexFormat,g={positions:void 0,colors:void 0,ellipsoid:_,vertexFormat:b,width:void 0,colorsPerVertex:void 0,arcType:void 0,granularity:void 0};w.unpack=function(e,t,r){if(!ae.defined(e))throw new m.DeveloperError("array is required");var a;t=ae.defaultValue(t,0);var o=e[t++],i=new Array(o);for(a=0;a<o;++a,t+=ie.Cartesian3.packedLength)i[a]=ie.Cartesian3.unpack(e,t);var n=0<(o=e[t++])?new Array(o):void 0;for(a=0;a<o;++a,t+=he.Color.packedLength)n[a]=he.Color.unpack(e,t);var l=v.Ellipsoid.unpack(e,t,_);t+=v.Ellipsoid.packedLength;var s=C.VertexFormat.unpack(e,t,b);t+=C.VertexFormat.packedLength;var p=e[t++],d=1===e[t++],c=e[t++],u=e[t++],y=e[t++],f=1==e[t++],h=e[t];return ae.defined(r)?(r._positions=i,r._colors=n,r._ellipsoid=v.Ellipsoid.clone(l,r._ellipsoid),r._vertexFormat=C.VertexFormat.clone(s,r._vertexFormat),r._width=p,r._colorsPerVertex=d,r._arcType=c,r._granularity=u,r._hMax=y,r._dist=f,r._period=h,r):(g.positions=i,g.colors=n,g.width=p,g.colorsPerVertex=d,g.arcType=c,g.granularity=u,g.hMax=y,g.dist=f,g.period=h,new w(g))};var Ce=new ie.Cartesian3,we=new ie.Cartesian3,_e=new ie.Cartesian3,be=new ie.Cartesian3;return w.createGeometry=function(e){var t,r,a,o=e._width,i=e._hMax,n=e._vertexFormat,l=e._colors,s=e._colorsPerVertex,p=e._arcType,d=e._granularity,c=e._ellipsoid,u=e._dist,y=e._period,f=ue.arrayRemoveDuplicates(e._positions,ie.Cartesian3.equalsEpsilon),h=f.length;if(!(h<2||o<=0)){if(p===ye.ArcType.GEODESIC||p===ye.ArcType.RHUMB){var m,v;v=p===ye.ArcType.GEODESIC?(m=oe.CesiumMath.chordLength(d,c.maximumRadius),fe.PolylinePipeline.numberOfPoints):(m=d,fe.PolylinePipeline.numberOfPointsRhumbLine);var C=fe.PolylinePipeline.extractHeights(f,c);if(ae.defined(l)){var w=1;for(t=0;t<h-1;++t)w+=v(f[t],f[t+1],m);var _=new Array(w),b=0;for(t=0;t<h-1;++t){var g=f[t],E=f[t+1],A=l[t],P=v(g,E,m);if(s&&t<w){var T=ve(0,0,A,l[t+1],P),D=T.length;for(r=0;r<D;++r)_[b++]=T[r]}else for(r=0;r<P;++r)_[b++]=he.Color.clone(A)}_[b]=he.Color.clone(l[l.length-1]),l=_,me.length=0}f=p===ye.ArcType.GEODESIC?fe.PolylinePipeline.generateCartesianArc({positions:f,minDistance:m,ellipsoid:c,height:C,hMax:i}):fe.PolylinePipeline.generateCartesianRhumbArc({positions:f,granularity:m,ellipsoid:c,height:C})}var x,k=4*(h=f.length)-4,G=new Float64Array(3*k),V=new Float64Array(3*k),F=new Float64Array(3*k),L=new Float32Array(2*k),S=n.st?new Float32Array(2*k):void 0,O=ae.defined(l)?new Uint8Array(4*k):void 0,M=u?new Float32Array(3*k):void 0,I=0,R=0,B=0,N=0,U=0,q=0;for(r=0;r<h;++r){var W,H;0===r?(x=Ce,ie.Cartesian3.subtract(f[0],f[1],x),ie.Cartesian3.add(f[0],x,x)):x=f[r-1],ie.Cartesian3.clone(x,_e),ie.Cartesian3.clone(f[r],we),r===h-1?(x=Ce,ie.Cartesian3.subtract(f[h-1],f[h-2],x),ie.Cartesian3.add(f[h-1],x,x)):x=f[r+1],ie.Cartesian3.clone(x,be),ae.defined(O)&&(W=0===r||s?l[r]:l[r-1],r!==h-1&&(H=l[r]));var Y=r===h-1?2:4;for(a=0===r?2:0;a<Y;++a){ie.Cartesian3.pack(we,G,I),ie.Cartesian3.pack(_e,V,I),ie.Cartesian3.pack(be,F,I),I+=3;var z=a-2<0?-1:1,J=a%2*2-1,j=J*r/h;if(L[R++]=0<i?j:J,L[R++]=z*o,n.st&&(S[B++]=r/(h-1),S[B++]=Math.max(L[R-2],0)),ae.defined(O)){var K=a<2?W:H;O[N++]=he.Color.floatToByte(K.red),O[N++]=he.Color.floatToByte(K.green),O[N++]=he.Color.floatToByte(K.blue),O[N++]=he.Color.floatToByte(K.alpha)}u&&(M[3*U]=q,U++)}q+=ie.Cartesian3.distance(x,f[r])}if(u){var Q=q,X=Math.random()*(0<y?y:Q);for(r=0;r<k;r++)M[3*r+1]=Q,M[3*r+2]=X}var Z=new de.GeometryAttributes;Z.position=new se.GeometryAttribute({componentDatatype:le.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:G}),Z.prevPosition=new se.GeometryAttribute({componentDatatype:le.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:V}),Z.nextPosition=new se.GeometryAttribute({componentDatatype:le.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:F}),Z.expandAndWidth=new se.GeometryAttribute({componentDatatype:le.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:L}),n.st&&(Z.st=new se.GeometryAttribute({componentDatatype:le.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:S})),ae.defined(O)&&(Z.color=new se.GeometryAttribute({componentDatatype:le.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:4,values:O,normalize:!0})),u&&(Z.dist=new se.GeometryAttribute({componentDatatype:le.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:M}));var $=ce.IndexDatatype.createTypedArray(k,6*h-6),ee=0,te=0,re=h-1;for(r=0;r<re;++r)$[te++]=ee,$[te++]=ee+2,$[te++]=ee+1,$[te++]=ee+1,$[te++]=ee+2,$[te++]=ee+3,ee+=4;return new se.Geometry({attributes:Z,indices:$,primitiveType:pe.PrimitiveType.TRIANGLES,boundingSphere:ne.BoundingSphere.fromPoints(f),geometryType:se.GeometryType.POLYLINES})}},function(e,t){return ae.defined(t)&&(e=w.unpack(e,t)),e._ellipsoid=v.Ellipsoid.clone(e._ellipsoid),w.createGeometry(e)}});