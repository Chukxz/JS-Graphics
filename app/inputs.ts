



window.addEventListener("load", ()=>{
  const _BasicSettings = new BasicSettings();
  _BasicSettings.setGlobalAlpha(0.6);
  const _DrawCanvas = new DrawCanvas();

  console.log(MODIFIED_PARAMS)

  console.log(_OPTICAL_ELEMS.optical_element_array[0])

  const _ObjectRendering = new ObjectRendering();

    console.log(_ObjectRendering)

    const a_f = new CreateCuboid();
    const e_f = new CreateCuboid();
    const i_f = new CreatePyramid();

    _ObjectRendering.addObjects(a_f);
    _ObjectRendering.addObjects(e_f);
    _ObjectRendering.addObjects(i_f)

    _ObjectRendering.changeCurrentObjectInstance(1);

    console.log(_ObjectRendering.instance_number_to_list_map)

    _ObjectRendering.renderWorld()
    // _ObjectRendering.translateObject([103,124,145])
    // _ObjectRendering.rotateObject([0,1,0],45);
    console.log(_ObjectRendering.renderObject())

    console.log(_ObjectRendering)
})