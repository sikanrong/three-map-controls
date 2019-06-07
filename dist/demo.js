!function(e){var t={};function s(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},s.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/",s(s.s=4)}([function(e,t,s){e.exports=s(2)(0)},function(e,t){e.exports={console:{log:function(){}},document:{body:{clientWidth:1920,clientHeight:1080,addEventListener:function(){},removeEventListener:function(){}}}}},function(e,t){e.exports=vendor},function(e,t,s){"use strict";s.r(t);var i=s(0);if("undefined"==typeof window){s(1)}t.default=class extends i.EventDispatcher{constructor(e,t,s){super(),this.camera=e,this.domElement=void 0!==t?t:window.document.body,this.enabled=!0,this.target,this.minDistance=1,this.maxDistance=100,this.enableZoom=!0,this.zoomSpeed=6,this.zoomDampingAlpha=.1,this.initialZoom=0,this.enablePan=!0,this.keyPanSpeed=12,this.panDampingAlpha=.1,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ZOOM:i.MOUSE.MIDDLE,PAN:i.MOUSE.LEFT},Object.assign(this,s);let n=!1;if(void 0===this.mode)throw new Error("'mode' option must be set to either 'plane' or 'sphere'");switch(this.mode){case"plane":n=void 0!==this.target.normal&&void 0!==this.target.constant;break;case"sphere":n=void 0!==this.target.center&&void 0!==this.target.radius}if(!n)throw new Error("'target' option must be an instance of type THREE.Plane or THREE.Sphere");this._eventListeners={contextmenu:this._onContextMenu.bind(this),mousedown:this._onMouseDown.bind(this),mousewheel:this._onMouseWheel.bind(this),MozMousePixelScroll:this._onMouseWheel.bind(this),touchstart:this._onTouchStart.bind(this),touchend:this._onTouchEnd.bind(this),touchmove:this._onTouchMove.bind(this),keydown:this._onKeyDown.bind(this),mousemove:this._onMouseMove.bind(this),mouseup:this._onMouseUp.bind(this)},this._init()}_init(){if(this.target0=this.target.clone(),this.position0=this.camera.position.clone(),this.zoom0=this.camera.zoom,this._changeEvent={type:"change"},this._startEvent={type:"start"},this._endEvent={type:"end"},this._STATES={NONE:-1,DOLLY:1,PAN:2,TOUCH_DOLLY:4,TOUCH_PAN:5},0==this.target.distanceToPoint(this.camera.position))throw new Error("ORIENTATION_UNKNOWABLE: initial Camera position cannot intersect target plane.");this._state=this._STATES.NONE,this._mouse=new i.Vector2,this._finalTargetDistance=0,this._currentTargetDistance=0,this._panTarget=new i.Vector3,this._panCurrent=new i.Vector3,this._minZoomPosition=new i.Vector3,this._maxZoomPosition=new i.Vector3,this._panStart=new i.Vector2,this._panEnd=new i.Vector2,this._panDelta=new i.Vector2,this._dollyStart=new i.Vector2,this._dollyEnd=new i.Vector2,this._dollyDelta=new i.Vector2,this._camOrientation=new i.Vector2,this._zoomAlpha,this._screenWorldXform=Math.tan(this.camera.fov/2*Math.PI/180),this._straightDollyTrack(),this.camera.position.lerpVectors(this._minZoomPosition,this._maxZoomPosition,this.initialZoom),this._finalTargetDistance=this._currentTargetDistance=Math.abs(this.target.distanceToPoint(this.camera.position));const e=this._intersectCameraTarget();this.camera.lookAt(e.intersection),this._camOrientation=e.ray.direction.clone().normalize(),this._updateZoomAlpha(),["contextmenu","mousedown","mousewheel","MozMousePixelScroll","touchstart","touchend","touchmove","keydown"].forEach(e=>{this.domElement.addEventListener(e,this._eventListeners[e])}),this.update()}_intersectCameraTarget(){let e,t=new i.Vector3;switch(this.mode){case"plane":const s=new i.Vector3;this.target.projectPoint(this.camera.position,s),(e=new i.Ray(this.camera.position,(new i.Vector3).subVectors(s,this.camera.position).normalize())).intersectPlane(this.target,t);break;case"sphere":(e=new i.Ray(this.camera.position,(new i.Vector3).subVectors(this.target.center,this.camera.position).normalize())).intersectSphere(this.target,t)}return{intersection:t,ray:e}}_straightDollyTrack(){this._updateDollyTrack(this._intersectCameraTarget().ray)}getZoomAlpha(){return this._zoomAlpha}reset(){this.target.copy(this.target0),this.camera.position.copy(this.position0),this.camera.zoom=this.zoom0,this.camera.updateProjectionMatrix(),this._init(),this.dispatchEvent(this._changeEvent),this.update(),this._state=this._STATES.NONE}update(){var e=new i.Vector3,t=new i.Vector3,s=this.camera.position;switch(t.copy(this._panCurrent),this._panCurrent.lerp(this._panTarget,this.panDampingAlpha),e.subVectors(this._panCurrent,t),this.mode){case"plane":this._maxZoomPosition.add(e),this._minZoomPosition.add(e);break;case"sphere":const s=new i.Vector3,n=new i.Quaternion;n.setFromAxisAngle(s.setFromMatrixColumn(this.camera.matrix,1),e.x),this._maxZoomPosition.applyQuaternion(n),this._minZoomPosition.applyQuaternion(n),n.setFromAxisAngle(s.setFromMatrixColumn(this.camera.matrix,0),e.y),this._maxZoomPosition.applyQuaternion(n),this._minZoomPosition.applyQuaternion(n)}s.lerpVectors(this._minZoomPosition,this._maxZoomPosition,this._updateZoomAlpha()),"sphere"==this.mode&&this.camera.lookAt(this.target.center)}dispose(){Object.keys(this._eventListeners).forEach(e=>{this.domElement.removeEventListener(e,this._eventListeners[e],!1)})}zoomToFit(e,t,s,i){t=t||e.geometry.boundingSphere.center,s=s||2*e.geometry.boundingSphere.radius,void 0===i&&(i=s),this._panTarget.copy(e.localToWorld(t.clone())),this._panCurrent.copy(this._intersectCameraTarget().intersection),this._straightDollyTrack();var n=this.camera.fov*(Math.PI/180),a=2*Math.atan(Math.tan(n/2)*this.camera.aspect),o=s/i;this._finalTargetDistance=(o>this.camera.aspect?s:i)/2/Math.tan((o>this.camera.aspect?a:n)/2)}targetAreaVisible(){let e,t,s,n;switch(this.mode){case"plane":var a=new i.Ray(this.camera.position,this._camOrientation).distanceToPlane(this.target);n=this.camera.position.clone(),s=(t=this._screenWorldXform*a)*this.camera.aspect,e=new i.Box2(new i.Vector2(n.x-s,n.y-t),new i.Vector2(n.x+s,n.y+t));break;case"sphere":const o=(new i.Vector3).subVectors(this.target.center,this.camera.position),h=new i.Vector3(o.x,0,o.z),r=Math.PI/2;(n=new i.Vector2(h.angleTo(new i.Vector3(1,0,0)),o.angleTo(new i.Vector3(0,1,0)))).x=this.camera.position.z<0?2*Math.PI-n.x:n.x;const c=o.length();t=this._screenWorldXform*(c/this.target.radius-1),t=Math.min(t,r);const l=this.target.radius*Math.cos(n.y-r);s=t*this.camera.aspect*(this.target.radius/l),s=Math.min(s,r),e=new i.Box2(new i.Vector2(n.x-s-r,n.y-t-r),new i.Vector2(n.x+s-r,n.y+t-r)),["min","max"].forEach(t=>{e[t].x=e[t].x>Math.PI?-2*Math.PI+e[t].x:e[t].x})}return e}_updateZoomAlpha(){this._finalTargetDistance=Math.max(this.minDistance,Math.min(this.maxDistance,this._finalTargetDistance));var e=this._currentTargetDistance-this._finalTargetDistance,t=this.zoomDampingAlpha;return this._currentTargetDistance-=e*t,this._zoomAlpha=Math.abs(Math.round(1e5*(1-(this._currentTargetDistance-this.minDistance)/(this.maxDistance-this.minDistance)))/1e5),this._zoomAlpha}_updateDollyTrack(e){let t=new i.Vector3;switch(this.mode){case"plane":e.intersectPlane(this.target,t);break;case"sphere":e.intersectSphere(this.target,t)}t&&(this._maxZoomPosition.addVectors(t,(new i.Vector3).subVectors(this.camera.position,t).normalize().multiplyScalar(this.minDistance)),this._minZoomPosition.copy(this._calculateMinZoom(this.camera.position,t)),this._finalTargetDistance=this._currentTargetDistance=t.clone().sub(this.camera.position).length())}_getZoomScale(){return Math.pow(.95,this.zoomSpeed)}_panLeft(e,t){var s=new i.Vector3;switch(this.mode){case"sphere":s.set(-e,0,0);break;case"plane":s.setFromMatrixColumn(t,0),s.multiplyScalar(-e)}this._panTarget.add(s)}_panUp(e,t){var s=new i.Vector3;switch(this.mode){case"sphere":s.set(0,-e,0);break;case"plane":s.setFromMatrixColumn(t,1),s.multiplyScalar(e)}this._panTarget.add(s)}_pan(e,t){var s,n=this.domElement,a=new i.Ray(this.camera.position,this._camOrientation);switch(this.mode){case"plane":s=this._screenWorldXform*a.distanceToPlane(this.target);break;case"sphere":const e=(new i.Vector3).subVectors(this.camera.position,this.target.center);s=this._screenWorldXform*(e.length()/this.target.radius-1)}this._panLeft(2*e*s/n.clientHeight,this.camera.matrix),this._panUp(2*t*s/n.clientHeight,this.camera.matrix)}_dollyIn(e){this._cameraOfKnownType()?this._finalTargetDistance/=e:(console.warn("WARNING: MapControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyOut(e){this._cameraOfKnownType()?this._finalTargetDistance*=e:(console.warn("WARNING: MapControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_cameraOfKnownType(){return"PerspectiveCamera"===this.camera.type}_handleUpdateDollyTrackMouse(e){var t=this._mouse.clone();if(this._mouse.set(e.offsetX/this.domElement.clientWidth*2-1,-e.offsetY/this.domElement.clientHeight*2+1),!t.equals(this._mouse)){var s=new i.Raycaster;s.setFromCamera(this._mouse,this.camera),this._updateDollyTrack(s.ray)}}_handleMouseDownDolly(e){this._handleUpdateDollyTrackMouse(e),this._dollyStart.set(e.offsetX,e.offsetY)}_handleMouseDownPan(e){this._panStart.set(e.offsetX,e.offsetY)}_handleMouseMoveDolly(e){this._handleUpdateDollyTrackMouse(e),this._dollyEnd.set(e.offsetX,e.offsetY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyIn(this._getZoomScale()):this._dollyDelta.y<0&&this._dollyOut(this._getZoomScale()),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.offsetX,e.offsetY),this._panDelta.subVectors(this._panEnd,this._panStart),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseUp(e){}_calculateMinZoom(e,t){return t.clone().add(e.clone().sub(t).normalize().multiplyScalar(this.maxDistance))}_handleMouseWheel(e){this._handleUpdateDollyTrackMouse(e);var t=0;void 0!==e.wheelDelta?t=e.wheelDelta:void 0!==e.detail&&(t=-e.detail),t>0?this._dollyOut(this._getZoomScale()):t<0&&this._dollyIn(this._getZoomScale()),this.update()}_handleKeyDown(e){switch(e.keyCode){case this.keys.UP:this._pan(0,this.keyPanSpeed),this.update();break;case this.keys.BOTTOM:this._pan(0,-this.keyPanSpeed),this.update();break;case this.keys.LEFT:this._pan(this.keyPanSpeed,0),this.update();break;case this.keys.RIGHT:this._pan(-this.keyPanSpeed,0),this.update()}}_handleUpdateDollyTrackTouch(e){var t=new i.Vector2,s=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY;t.x=e.touches[0].pageX+s/2,t.y=e.touches[0].pageY+n/2;var a=new i.Vector2;a.x=t.x/domElement.clientWidth*2-1,a.y=-t.y/domElement.clientHeight*2+1,this._updateDollyTrack(a)}_handleTouchStartDolly(e){this._handleUpdateDollyTrackTouch(e);var t=e.touches[0].pageX-e.touches[1].pageX,s=e.touches[0].pageY-e.touches[1].pageY,i=Math.sqrt(t*t+s*s);this._dollyStart.set(0,i)}_handleTouchStartPan(e){this._panStart.set(e.touches[0].pageX,e.touches[0].pageY)}_handleTouchMoveDolly(e){this._handleUpdateDollyTrackTouch(e);var t=e.touches[0].pageX-e.touches[1].pageX,s=e.touches[0].pageY-e.touches[1].pageY,i=Math.sqrt(t*t+s*s);this._dollyEnd.set(0,i),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale()):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale()),this._dollyStart.copy(this._dollyEnd),this.update()}_handleTouchMovePan(e){this._panEnd.set(e.touches[0].pageX,e.touches[0].pageY),this._panDelta.subVectors(this._panEnd,this._panStart),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleTouchEnd(e){}_onMouseDown(e){if(!1!==this.enabled){if(e.preventDefault(),e.button===this.mouseButtons.ZOOM){if(!1===this.enableZoom)return;this._handleMouseDownDolly(e),this._state=this._STATES.DOLLY}else if(e.button===this.mouseButtons.PAN){if(!1===this.enablePan)return;this._handleMouseDownPan(e),this._state=this._STATES.PAN}this._state!==this._STATES.NONE&&(this.domElement.addEventListener("mousemove",this._eventListeners.mousemove,!1),this.domElement.addEventListener("mouseup",this._eventListeners.mouseup,!1),this.dispatchEvent(this._startEvent))}}_onMouseMove(e){if(!1!==this.enabled)if(e.preventDefault(),this._state===this._STATES.DOLLY){if(!1===this.enableZoom)return;this._handleMouseMoveDolly(e)}else if(this._state===this._STATES.PAN){if(!1===this.enablePan)return;this._handleMouseMovePan(e)}}_onMouseUp(e){!1!==this.enabled&&(this._handleMouseUp(e),this.domElement.removeEventListener("mousemove",this._eventListeners.mousemove,!1),this.domElement.removeEventListener("mouseup",this._eventListeners.mouseup,!1),this.dispatchEvent(this._endEvent),this._state=this._STATES.NONE)}_onMouseWheel(e){!1!==this.enabled&&!1!==this.enableZoom&&this._state===this._STATES.NONE&&(e.preventDefault(),e.stopPropagation(),this._handleMouseWheel(e),this.dispatchEvent(this._startEvent),this.dispatchEvent(this._endEvent))}_onKeyDown(e){!1!==this.enabled&&!1!==this.enableKeys&&!1!==this.enablePan&&this._handleKeyDown(e)}_onTouchStart(e){if(!1!==this.enabled){switch(e.touches.length){case 1:if(!1===this.enablePan)return;this._handleTouchStartPan(e),this._state=this._STATES.TOUCH_PAN;break;case 2:if(!1===this.enableZoom)return;this._handleTouchStartDolly(e),this._state=this._STATES.TOUCH_DOLLY;break;default:this._state=this._STATES.NONE}this._state!==this._STATES.NONE&&this.dispatchEvent(this._startEvent)}}_onTouchMove(e){if(!1!==this.enabled)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(!1===this.enablePan)return;if(this._state!==this._STATES.TOUCH_PAN)return;this._handleTouchMovePan(e);break;case 2:if(!1===this.enableZoom)return;if(this._state!==this._STATES.TOUCH_DOLLY)return;this._handleTouchMoveDolly(e);break;default:this._state=this._STATES.NONE}}_onTouchEnd(e){!1!==this.enabled&&(this._handleTouchEnd(e),this.dispatchEvent(this._endEvent),this._state=this._STATES.NONE)}_onContextMenu(e){e.preventDefault()}}},function(e,t,s){var i=s(0),n=s(3).default||i.MapControls;const a=10;window.addEventListener("load",()=>{window.demo=new class{constructor(e){this.container=document.body,this.scene=new i.Scene,this.renderer=null,this.meshes=[],this.dims=10,this.selectedObject=null,this.controls,this.mode,this.debugCamViewInterval,this.camViewMesh,this.camViewLines,this.init(),this.setMode(e),this.animate()}setMode(e){this.mode=e;const t={sphere:document.getElementById("sphere-link"),plane:document.getElementById("plane-link")};switch(t[this.mode].style.display="none",t["plane"==this.mode?"sphere":"plane"].style.display="inline-block",this.meshes.concat([this.camViewLines,this.camViewMesh]).forEach(e=>{void 0!==e&&(this.scene.remove(e),e.geometry.dispose())}),this.camViewLines=this.camViewMesh=void 0,this.mode){case"sphere":this.initSphere();break;case"plane":this.initPlane()}}initSphere(){var e=new i.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1e3);e.position.z=40,this.controls=new n(e,this.renderer.domElement,{target:new i.Sphere(new i.Vector3(0,0,0),a),mode:"sphere",minDistance:1,maxDistance:e.position.z});const t=[],s=new i.SphereBufferGeometry(a,this.dims,this.dims);s.computeBoundingSphere();const o=s.getAttribute("position").array;for(var h=0;h<o.length;h+=3){var r=new i.Color,c=new i.Vector3(o[h],o[h+1],o[h+2]);r.setRGB(c.x/a+.5,c.y/a+.5,c.z/a+.5),t.push(r.r,r.g,r.b)}s.addAttribute("color",new i.Float32BufferAttribute(Float32Array.from(t),3));const l=new i.Points(s,new i.PointsMaterial({size:1,vertexColors:i.VertexColors}));this.scene.add(l),this.meshes.push(l);const d=new i.Mesh(s,new i.MeshBasicMaterial({vertexColors:i.VertexColors,transparent:!0,opacity:.2}));this.meshes.push(d),this.scene.add(d);const m=new i.Mesh(s,new i.MeshBasicMaterial({vertexColors:i.VertexColors,wireframe:!0}));this.meshes.push(m),this.scene.add(m)}toggleDebugCamView(e){if(!e.target.checked)return clearInterval(this.debugCamViewInterval),this.scene.remove(this.camViewMesh),this.scene.remove(this.camViewLines),this.camViewMesh.geometry.dispose(),this.camViewLines.geometry.dispose(),this.camViewLines=this.camViewMesh=void 0,!0;this.debugCamViewInterval=setInterval(()=>{const e=this.controls.targetAreaVisible();let t,s;switch(console.log(`${e.min.x}, ${e.min.y}, ${e.max.x}, ${e.max.y}`),s=new i.Vector3(0,0,0),this.mode){case"sphere":let n=Math.abs(e.max.x-e.min.x);n>Math.PI&&(n=Math.abs(e.max.x+2*Math.PI-e.min.x)),t=new i.SphereBufferGeometry(a,this.dims,this.dims,e.min.x+Math.PI/2,n,-e.max.y+Math.PI/2,Math.abs(e.max.y-e.min.y));break;case"plane":t=new i.PlaneBufferGeometry(e.max.x-e.min.x,e.max.y-e.min.y,this.dims,this.dims),s.copy(this.controls.camera.position),s.z=0}void 0==this.camViewMesh?(this.camViewMesh=new i.Mesh(t,new i.MeshBasicMaterial({color:new i.Color(255,0,0),side:i.DoubleSide,transparent:!0,opacity:.5})),this.camViewLines=new i.Mesh(t,new i.MeshBasicMaterial({color:new i.Color(255,0,0),wireframe:!0})),this.scene.add(this.camViewMesh),this.scene.add(this.camViewLines)):(this.camViewMesh.geometry.copy(t),this.camViewLines.geometry.copy(t),t.dispose()),this.camViewMesh.geometry.computeBoundingSphere(),this.camViewMesh.position.copy(s),this.camViewLines.position.copy(s)},1e3)}initPlane(){var e=new i.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1e3);e.position.z=20,this.controls=new n(e,this.renderer.domElement,{target:new i.Plane(new i.Vector3(0,0,1),0),mode:"plane",minDistance:2,maxDistance:20});for(var t=0;t<this.dims;t++)for(var s=0;s<this.dims;s++){var a=new i.CubeGeometry(1,1,1),o=new i.MeshNormalMaterial,h=new i.Mesh(a,o);h.position.x+=-.5*this.dims*3+3*t,h.position.y+=-.5*this.dims*3+3*s,this.meshes.push(h),this.scene.add(h),h.geometry.computeBoundingSphere()}}init(){this.renderer=new i.WebGLRenderer,this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight),this.container.appendChild(this.renderer.domElement),window.addEventListener("resize",()=>{this.onWindowResize()},!1),this.renderer.domElement.addEventListener("mousedown",e=>{this.pick(e)}),this.renderer.domElement.addEventListener("dblclick",e=>{this.zoomTo(e)}),document.getElementById("toggleCamDebug").addEventListener("click",this.toggleDebugCamView.bind(this))}zoomTo(){this.selectedObject&&this.controls.zoomToFit(this.selectedObject)}pick(e){var t=new i.Vector2;t.x=e.clientX/this.renderer.domElement.clientWidth*2-1,t.y=-e.clientY/this.renderer.domElement.clientHeight*2+1;var s=new i.Raycaster;s.setFromCamera(t,this.controls.camera);var n=s.intersectObjects(this.scene.children,!0);n.length>0?this.selectedObject=n[0].object:this.selectedObject=null}onWindowResize(){this.renderer.setSize(window.innerWidth,window.innerHeight),this.controls.camera.aspect=this.renderer.domElement.clientWidth/this.renderer.domElement.clientHeight,this.controls.camera.updateProjectionMatrix(),this.renderer.setSize(this.renderer.domElement.clientWidth,this.renderer.domElement.clientHeight)}animate(){requestAnimationFrame(()=>{this.animate()}),"plane"==this.mode&&this.meshes.forEach(e=>{e.rotation.x+=.005,e.rotation.y+=.01}),this.controls.update(),this.renderer.render(this.scene,this.controls.camera)}}("sphere")})}]);
//# sourceMappingURL=demo.js.map