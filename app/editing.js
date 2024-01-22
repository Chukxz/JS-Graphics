// window.parent.addEventListener("message", (e) => window.parent.postMessage(e.data));
window.parent.addEventListener("message", (e) => { if (e.data === "Editing")
    edit(); });
function edit() {
    console.log("editing recieved");
    while (drop_content.firstChild) {
        drop_content.removeChild(drop_content.firstChild);
    }
    const p_1 = document.createElement("p");
    p_1.textContent = "Objects";
    drop_content.appendChild(p_1);
}
