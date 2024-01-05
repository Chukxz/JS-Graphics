cwindow.parent.addEventListener("message", (event) => { console.log(`Event recieved in Script 2: ${event.data}, \nEvent Path : ${event.composedPath()}`); });

window.sharedData = "data from script 2";