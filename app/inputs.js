// window.addEventListener("load",() => {
//     const _BasicSettings = new BasicSettings();
//     _BasicSettings.setGlobalAlpha(0.6);
//     const _DrawCanvas = new DrawCanvas();
//     console.log(MODIFIED_PARAMS)
//     console.log(_CAMERA.camera_objects_array[0])
//     //_CAMERA.camera_objects_array[0].setLookAtPos_nonIncremental([0,0,0]);
//     const _ObjectRendering = new ObjectRendering();
//       console.log(_ObjectRendering)
//       const a_f = new CreateCuboid();
//       const e_f = new CreateCuboid();
//       const i_f = new CreatePyramid();
//       _ObjectRendering.addObjects(a_f);
//       console.log(_ObjectRendering.instance)
//       _ObjectRendering.addObjects(e_f);
//       console.log(_ObjectRendering.instance)
//       _ObjectRendering.addObjects(i_f);
//       console.log(_ObjectRendering.instance)
//       _ObjectRendering.changeCurrentObjectInstance(2);
//       _ObjectRendering.renderLocal();
//     _ObjectRendering.scaleObject([5,5,1])
//     //   _ObjectRendering.translateObject([5,12,-3])
//     //   _ObjectRendering.revolveObject([0,1,0],10)
//     //   _ObjectRendering.rotateObject([0,0,1],-10)
//       console.log(_ObjectRendering.instance_number_to_list_map)
//       // _ObjectRendering.translateObject([103,124,145])
//       // _ObjectRendering.rotateObject([0,1,0],45);
//       const rendered_object = _ObjectRendering.renderObject();
//       console.log(rendered_object);
//       console.log(_ObjectRendering);
//       new Draw().drawObject(rendered_object);
// })
// window.addEventListener("click",()=>{
//   console.log(MODIFIED_PARAMS)
//   console.log(_CAMERA.camera_objects_array[0])
//   //_CAMERA.camera_objects_array[0].setLookAtPos_nonIncremental([0,0,0]);
//   const _ObjectRendering = new ObjectRendering();
//     console.log(_ObjectRendering)
//     const a_f = new CreateCuboid();
//     const e_f = new CreateCuboid();
//     const i_f = new CreatePyramid();
//     _ObjectRendering.addObjects(a_f);
//     _ObjectRendering.addObjects(e_f);
//     _ObjectRendering.addObjects(i_f);
//     _ObjectRendering.changeCurrentObjectInstance(1);
//     console.log(_ObjectRendering.instance_number_to_list_map)
//     _ObjectRendering.renderWorld()
//     // _ObjectRendering.translateObject([103,124,145])
//     // _ObjectRendering.rotateObject([0,1,0],45);
//     const rendered_object = _ObjectRendering.renderObject();
//     console.log(rendered_object);
//     console.log(_ObjectRendering);
//     new Draw().drawObject(rendered_object);
// })
