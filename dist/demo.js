!function(e){var t={};function s(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},s.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/",s(s.s=6)}([function(e,t,s){e.exports=s(1)(68)},function(e,t){e.exports=vendor},function(e,t,s){"use strict";s.r(t);var i=s(0);class n extends i.EventDispatcher{constructor(e,t,s){super(),this.camera=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.target,this.minDistance=1,this.maxDistance=100,this.enableZoom=!0,this.zoomSpeed=6,this.zoomDampingAlpha=.1,this.initialZoom=0,this.enablePan=!0,this.keyPanSpeed=12,this.panDampingAlpha=.1,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ZOOM:i.MOUSE.MIDDLE,PAN:i.MOUSE.LEFT},Object.assign(this,s);let n=!1;if([i.Plane,i.Sphere].forEach(e=>{this.target instanceof e&&(n=!0)}),!n)throw new Error("target must be an instance of type Plane or Sphere");this._mode=this.target instanceof i.Plane?"plane":"sphere",this.target0=this.target.clone(),this.position0=this.camera.position.clone(),this.zoom0=this.camera.zoom,this._mouse=new i.Vector2,this._finalTargetDistance,this._currentTargetDistance,this._changeEvent={type:"change"},this._startEvent={type:"start"},this._endEvent={type:"end"},this._STATES={NONE:-1,DOLLY:1,PAN:2,TOUCH_DOLLY:4,TOUCH_PAN:5},this._state=this._STATES.NONE,this._panTarget=new i.Vector3,this._panCurrent=new i.Vector3,this._minZoomPosition=new i.Vector3,this._maxZoomPosition=new i.Vector3,this._panStart=new i.Vector2,this._panEnd=new i.Vector2,this._panDelta=new i.Vector2,this._dollyStart=new i.Vector2,this._dollyEnd=new i.Vector2,this._dollyDelta=new i.Vector2,this._camOrientation=new i.Vector2,this._lastMouse=new i.Vector2,this._zoomAlpha,this._init()}_init(){if(0==this.target.distanceToPoint(this.camera.position))throw new Error("ORIENTATION_UNKNOWABLE: initial Camera position cannot intersect target plane.");this._straightDollyTrack(),this.camera.position.lerpVectors(this._minZoomPosition,this._maxZoomPosition,this.initialZoom),this._finalTargetDistance=this._currentTargetDistance=Math.abs(this.target.distanceToPoint(this.camera.position)),this.camera.lookAt(this._maxZoomPosition),this._camOrientation=this._maxZoomPosition.clone().sub(this.camera.position).normalize(),this._updateZoomAlpha(),this.domElement.addEventListener("contextmenu",this._onContextMenu.bind(this),!1),this.domElement.addEventListener("mousedown",this._onMouseDown.bind(this),!1),this.domElement.addEventListener("mousewheel",this._onMouseWheel.bind(this),!1),this.domElement.addEventListener("MozMousePixelScroll",this._onMouseWheel.bind(this),!1),this.domElement.addEventListener("touchstart",this._onTouchStart.bind(this),!1),this.domElement.addEventListener("touchend",this._onTouchEnd.bind(this),!1),this.domElement.addEventListener("touchmove",this._onTouchMove.bind(this),!1),this.domElement.addEventListener("keydown",this._onKeyDown.bind(this),!1),this.update()}_intersectCameraTarget(){let e,t;switch(this._mode){case"plane":[-1,1].forEach(s=>{e||(t=new i.Ray(this.camera.position,this.target.normal.clone().multiplyScalar(s)),e=t.intersectPlane(this.target))});break;case"sphere":t=new i.Ray(this.camera.position,(new i.Vector3).subVectors(this.target.center,this.camera.position)),e=t.intersectSphere(this.target)}return{intersection:e,ray:t}}_straightDollyTrack(){this._updateDollyTrack(this._intersectCameraTarget().ray)}getZoomAlpha(){return this._zoomAlpha}reset(){this.target.copy(this.target0),this.camera.position.copy(this.position0),this.camera.zoom=this.zoom0,this.camera.updateProjectionMatrix(),this._init(),this.dispatchEvent(this._changeEvent),this.update(),this._state=this._STATES.NONE}update(){var e=new i.Vector3,t=new i.Vector3,s=this.camera.position;switch(t.copy(this._panCurrent),this._panCurrent.lerp(this._panTarget,this.panDampingAlpha),e.subVectors(this._panCurrent,t),this._mode){case"plane":this._maxZoomPosition.add(e),this._minZoomPosition.add(e);break;case"sphere":const s=new i.Vector3,n=new i.Quaternion;n.setFromAxisAngle(s.setFromMatrixColumn(this.camera.matrix,1),e.x),this._maxZoomPosition.applyQuaternion(n),this._minZoomPosition.applyQuaternion(n),n.setFromAxisAngle(s.setFromMatrixColumn(this.camera.matrix,0),e.y),this._maxZoomPosition.applyQuaternion(n),this._minZoomPosition.applyQuaternion(n)}s.lerpVectors(this._minZoomPosition,this._maxZoomPosition,this._updateZoomAlpha()),"sphere"==this._mode&&this.camera.lookAt(this.target.center)}dispose(){this.domElement.removeEventListener("contextmenu",this._onContextMenu,!1),this.domElement.removeEventListener("mousedown",this._onMouseDown,!1),this.domElement.removeEventListener("mousewheel",this._onMouseWheel,!1),this.domElement.removeEventListener("MozMousePixelScroll",this._onMouseWheel,!1),this.domElement.removeEventListener("touchstart",this._onTouchStart,!1),this.domElement.removeEventListener("touchend",this._onTouchEnd,!1),this.domElement.removeEventListener("touchmove",this._onTouchMove,!1),document.removeEventListener("mousemove",this._onMouseMove,!1),document.removeEventListener("mouseup",this._onMouseUp,!1),this.domElement.removeEventListener("keydown",this._onKeyDown,!1)}zoomToFit(e,t,s,i){t=t||e.geometry.boundingSphere.center,s=s||2*e.geometry.boundingSphere.radius,void 0===i&&(i=s),this._panTarget.copy(e.localToWorld(t.clone())),this._panCurrent.copy(this._intersectCameraTarget().intersection),this._straightDollyTrack();var n=this.camera.fov*(Math.PI/180),o=2*Math.atan(Math.tan(n/2)*this.camera.aspect),a=s/i;this._finalTargetDistance=(a>this.camera.aspect?s:i)/2/Math.tan((a>this.camera.aspect?o:n)/2)}_updateZoomAlpha(){this._finalTargetDistance=Math.max(this.minDistance,Math.min(this.maxDistance,this._finalTargetDistance));var e=this._currentTargetDistance-this._finalTargetDistance,t=this.zoomDampingAlpha;this._currentTargetDistance-=e*t;return this._zoomAlpha=Math.abs(Math.round(1e5*(1-(this._currentTargetDistance-this.minDistance)/(this.maxDistance-this.minDistance)))/1e5),this._zoomAlpha}_updateDollyTrack(e){let t;switch(this._mode){case"plane":t=e.intersectPlane(this.target);break;case"sphere":t=e.intersectSphere(this.target)}t&&(this._maxZoomPosition.addVectors(t,(new i.Vector3).subVectors(this.camera.position,t).normalize().multiplyScalar(this.minDistance)),this._minZoomPosition.copy(this._calculateMinZoom(this.camera.position,t)),this._finalTargetDistance=this._currentTargetDistance=t.clone().sub(this.camera.position).length())}_getZoomScale(){return Math.pow(.95,this.zoomSpeed)}_panLeft(e,t){var s=new i.Vector3;switch(this._mode){case"sphere":s.set(-e,0,0);break;case"plane":s.setFromMatrixColumn(t,0),s.multiplyScalar(-e)}this._panTarget.add(s)}_panUp(e,t){var s=new i.Vector3;switch(this._mode){case"sphere":s.set(0,-e,0);break;case"plane":s.setFromMatrixColumn(t,1),s.multiplyScalar(e)}this._panTarget.add(s)}_pan(e,t){var s,n=this.domElement===document?this.domElement.body:this.domElement,o=new i.Ray(this.camera.position,this._camOrientation);switch(this._mode){case"plane":s=o.distanceToPlane(this.target);break;case"sphere":const e=this._intersectCameraTarget();s=this.camera.position.distanceTo(e.intersection)}s*=Math.tan(this.camera.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.camera.matrix),this._panUp(2*t*s/n.clientHeight,this.camera.matrix)}_dollyIn(e){this._cameraOfKnownType()?this._finalTargetDistance/=e:(console.warn("WARNING: MapControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyOut(e){this._cameraOfKnownType()?this._finalTargetDistance*=e:(console.warn("WARNING: MapControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_cameraOfKnownType(){return"PerspectiveCamera"===this.camera.type}_handleUpdateDollyTrackMouse(e){var t=this._mouse.clone();if(this._mouse.set(e.offsetX/this.domElement.clientWidth*2-1,-e.offsetY/this.domElement.clientHeight*2+1),!t.equals(this._mouse)){var s=new i.Raycaster;s.setFromCamera(this._mouse,this.camera),this._updateDollyTrack(s.ray)}}_handleMouseDownDolly(e){this._handleUpdateDollyTrackMouse(e),this._dollyStart.set(e.offsetX,e.offsetY)}_handleMouseDownPan(e){this._panStart.set(e.offsetX,e.offsetY)}_handleMouseMoveDolly(e){this._handleUpdateDollyTrackMouse(e),this._dollyEnd.set(e.offsetX,e.offsetY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyIn(this._getZoomScale()):this._dollyDelta.y<0&&this._dollyOut(this._getZoomScale()),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.offsetX,e.offsetY),this._panDelta.subVectors(this._panEnd,this._panStart),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseUp(e){}_calculateMinZoom(e,t){return t.clone().add(e.clone().sub(t).normalize().multiplyScalar(this.maxDistance))}_handleMouseWheel(e){this._handleUpdateDollyTrackMouse(e);var t=0;void 0!==e.wheelDelta?t=e.wheelDelta:void 0!==e.detail&&(t=-e.detail),t>0?this._dollyOut(this._getZoomScale()):t<0&&this._dollyIn(this._getZoomScale()),this.update()}_handleKeyDown(e){switch(e.keyCode){case this.keys.UP:this._pan(0,this.keyPanSpeed),this.update();break;case this.keys.BOTTOM:this._pan(0,-this.keyPanSpeed),this.update();break;case this.keys.LEFT:this._pan(this.keyPanSpeed,0),this.update();break;case this.keys.RIGHT:this._pan(-this.keyPanSpeed,0),this.update()}}_handleUpdateDollyTrackTouch(e){var t=new i.Vector2,s=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY;t.x=e.touches[0].pageX+s/2,t.y=e.touches[0].pageY+n/2;var o=new i.Vector2;o.x=t.x/domElement.clientWidth*2-1,o.y=-t.y/domElement.clientHeight*2+1,this._updateDollyTrack(o)}_handleTouchStartDolly(e){this._handleUpdateDollyTrackTouch(e);var t=e.touches[0].pageX-e.touches[1].pageX,s=e.touches[0].pageY-e.touches[1].pageY,i=Math.sqrt(t*t+s*s);this._dollyStart.set(0,i)}_handleTouchStartPan(e){this._panStart.set(e.touches[0].pageX,e.touches[0].pageY)}_handleTouchMoveDolly(e){this._handleUpdateDollyTrackTouch(e);var t=e.touches[0].pageX-e.touches[1].pageX,s=e.touches[0].pageY-e.touches[1].pageY,i=Math.sqrt(t*t+s*s);this._dollyEnd.set(0,i),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale()):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale()),this._dollyStart.copy(this._dollyEnd),this.update()}_handleTouchMovePan(e){this._panEnd.set(e.touches[0].pageX,e.touches[0].pageY),this._panDelta.subVectors(this._panEnd,this._panStart),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleTouchEnd(e){}_onMouseDown(e){if(!1!==this.enabled){if(e.preventDefault(),e.button===this.mouseButtons.ZOOM){if(!1===this.enableZoom)return;this._handleMouseDownDolly(e),this._state=this._STATES.DOLLY}else if(e.button===this.mouseButtons.PAN){if(!1===this.enablePan)return;this._handleMouseDownPan(e),this._state=this._STATES.PAN}this._state!==this._STATES.NONE&&(document.addEventListener("mousemove",this._onMouseMove.bind(this),!1),document.addEventListener("mouseup",this._onMouseUp.bind(this),!1),this.dispatchEvent(this._startEvent))}}_onMouseMove(e){if(!1!==this.enabled)if(e.preventDefault(),this._state===this._STATES.DOLLY){if(!1===this.enableZoom)return;this._handleMouseMoveDolly(e)}else if(this._state===this._STATES.PAN){if(!1===this.enablePan)return;this._handleMouseMovePan(e)}}_onMouseUp(e){!1!==this.enabled&&(this._handleMouseUp(e),document.removeEventListener("mousemove",this._onMouseMove,!1),document.removeEventListener("mouseup",this._onMouseUp,!1),this.dispatchEvent(this._endEvent),this._state=this._STATES.NONE)}_onMouseWheel(e){!1!==this.enabled&&!1!==this.enableZoom&&this._state===this._STATES.NONE&&(e.preventDefault(),e.stopPropagation(),this._handleMouseWheel(e),this.dispatchEvent(this._startEvent),this.dispatchEvent(this._endEvent))}_onKeyDown(e){!1!==this.enabled&&!1!==this.enableKeys&&!1!==this.enablePan&&this._handleKeyDown(e)}_onTouchStart(e){if(!1!==this.enabled){switch(e.touches.length){case 1:if(!1===this.enablePan)return;this._handleTouchStartPan(e),this._state=this._STATES.TOUCH_PAN;break;case 2:if(!1===this.enableZoom)return;this._handleTouchStartDolly(e),this._state=this._STATES.TOUCH_DOLLY;break;default:this._state=this._STATES.NONE}this._state!==this._STATES.NONE&&this.dispatchEvent(this._startEvent)}}_onTouchMove(e){if(!1!==this.enabled)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(!1===this.enablePan)return;if(this._state!==this._STATES.TOUCH_PAN)return;this._handleTouchMovePan(e);break;case 2:if(!1===this.enableZoom)return;if(this._state!==this._STATES.TOUCH_DOLLY)return;this._handleTouchMoveDolly(e);break;default:this._state=this._STATES.NONE}}_onTouchEnd(e){!1!==this.enabled&&(this._handleTouchEnd(e),this.dispatchEvent(this._endEvent),this._state=this._STATES.NONE)}_onContextMenu(e){e.preventDefault()}}window&&window.THREE&&(n=n),t.default=n},,,,function(e,t,s){var i=s(0),n=s(2).default||i.MapControls;window.addEventListener("load",()=>{window.demo=new class{constructor(e){this.container=document.body,this.scene=new i.Scene,this.renderer=null,this.meshes=[],this.dims=10,this.selectedObject=null,this.controls,this.mode,this.init(),this.setMode(e),this.animate()}setMode(e){this.mode=e;const t={sphere:document.getElementById("sphere-link"),plane:document.getElementById("plane-link")};switch(t[this.mode].style.display="none",t["plane"==this.mode?"sphere":"plane"].style.display="inline-block",this.meshes.forEach(e=>{this.scene.remove(e)}),this.mode){case"sphere":this.initSphere();break;case"plane":this.initPlane()}}initSphere(){var e=new i.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1e3);e.position.z=30,this.controls=new n(e,this.renderer.domElement,{target:new i.Sphere(new i.Vector3(0,0,0),10),minDistance:1,maxDistance:30});const t=[],s=new i.SphereBufferGeometry(10,this.dims,this.dims);s.computeBoundingSphere();const o=s.getAttribute("position").array;for(var a=0;a<o.length;a+=3){var h=new i.Color,r=new i.Vector3(o[a],o[a+1],o[a+2]);h.setRGB(r.x/10+.5,r.y/10+.5,r.z/10+.5),t.push(h.r,h.g,h.b)}s.addAttribute("color",new i.Float32BufferAttribute(Float32Array.from(t),3));const l=new i.Points(s,new i.PointsMaterial({size:1,vertexColors:i.VertexColors}));this.scene.add(l),this.meshes.push(l);const c=new i.Mesh(s,new i.MeshBasicMaterial({vertexColors:i.VertexColors,transparent:!0,opacity:.2}));this.meshes.push(c),this.scene.add(c);const d=new i.Mesh(s,new i.MeshBasicMaterial({vertexColors:i.VertexColors,wireframe:!0}));this.meshes.push(d),this.scene.add(d)}initPlane(){var e=new i.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1e3);e.position.z=20,this.controls=new n(e,this.renderer.domElement,{target:new i.Plane(new i.Vector3(0,0,1),0),minDistance:2,maxDistance:20});for(var t=0;t<this.dims;t++)for(var s=0;s<this.dims;s++){var o=new i.CubeGeometry(1,1,1),a=new i.MeshNormalMaterial,h=new i.Mesh(o,a);h.position.x+=-.5*this.dims*3+3*t,h.position.y+=-.5*this.dims*3+3*s,this.meshes.push(h),this.scene.add(h),h.geometry.computeBoundingSphere()}}init(){this.renderer=new i.WebGLRenderer,this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight),this.container.appendChild(this.renderer.domElement),window.addEventListener("resize",()=>{this.onWindowResize()},!1),this.renderer.domElement.addEventListener("mousedown",e=>{this.pick(e)}),this.renderer.domElement.addEventListener("dblclick",e=>{this.zoomTo(e)})}zoomTo(){this.selectedObject&&this.controls.zoomToFit(this.selectedObject)}pick(e){var t=new i.Vector2;t.x=e.clientX/this.renderer.domElement.clientWidth*2-1,t.y=-e.clientY/this.renderer.domElement.clientHeight*2+1;var s=new i.Raycaster;s.setFromCamera(t,this.controls.camera);var n=s.intersectObjects(this.scene.children,!0);n.length>0?this.selectedObject=n[0].object:this.selectedObject=null}onWindowResize(){this.renderer.setSize(window.innerWidth,window.innerHeight),this.controls.camera.aspect=this.renderer.domElement.clientWidth/this.renderer.domElement.clientHeight,this.controls.camera.updateProjectionMatrix(),this.renderer.setSize(this.renderer.domElement.clientWidth,this.renderer.domElement.clientHeight)}animate(){requestAnimationFrame(()=>{this.animate()}),"plane"==this.mode&&this.meshes.forEach(e=>{e.rotation.x+=.005,e.rotation.y+=.01}),this.controls.update(),this.renderer.render(this.scene,this.controls.camera)}}("sphere")})}]);
//# sourceMappingURL=demo.js.map