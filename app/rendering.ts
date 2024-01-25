window.parent.addEventListener("message",(e) => { if(e.data === "Rendering") render() });

function render() {
  while(main_menu.firstChild) {
    console.log(main_menu.firstChild);
    main_menu.removeChild(main_menu.firstChild);
  }
}
