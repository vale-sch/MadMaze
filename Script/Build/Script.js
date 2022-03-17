"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    let madeMazeGraph;
    let rgdbdyBall;
    let accelButt = document.getElementById("accelButton");
    accelButt.addEventListener("click", getAccel);
    document.getElementById("accelButton").addEventListener("click", init);
    async function init() {
        document.addEventListener("interactiveViewportStarted", start);
        await FudgeCore.Project.loadResourcesFromHTML();
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        madeMazeGraph = (f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]);
        rgdbdyBall = madeMazeGraph.getChild(0).getComponent(f.ComponentRigidbody);
        FudgeCore.Debug.log("Graph:", madeMazeGraph);
        if (!madeMazeGraph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new FudgeCore.ComponentCamera();
        cmpCamera.mtxPivot.translateY(80);
        cmpCamera.mtxPivot.translateX(5);
        cmpCamera.mtxPivot.rotateX(90);
        cmpCamera.mtxPivot.rotateZ(90);
        let canvas = document.querySelector("canvas");
        let viewport = new FudgeCore.Viewport();
        viewport.initialize("InteractiveViewport", madeMazeGraph, cmpCamera, canvas);
        FudgeCore.Debug.log("Viewport:", viewport);
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    }
    (document.head.querySelector("meta[autoView]").getAttribute("autoView"));
    function start(_event) {
        viewport = _event.detail;
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start();
    }
    function update(_event) {
        f.Physics.simulate();
        viewport.draw();
    }
    let upSideDownBool = false;
    function getAccel() {
        accelButt.style.visibility = 'hidden';
        let divPanel = document.getElementById("controlPanel");
        let upSideDownBut = document.createElement("button");
        upSideDownBut.style.width = "200px";
        upSideDownBut.style.height = "50px";
        divPanel.appendChild(upSideDownBut);
        upSideDownBut.innerText = "UPSIDE DOWN";
        upSideDownBut.addEventListener("click", changeUpSideDown);
        let _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
        let xAccelartion = document.getElementById("x");
        let yAccelartion = document.getElementById("y");
        let zAccelartion = document.getElementById("z");
        if (_iOSDevice)
            DeviceMotionEvent.requestPermission().then((response) => {
                if (response == 'granted') {
                    console.log("Access acceleration: " + response);
                    window.addEventListener('deviceorientation', (event) => {
                        xAccelartion.innerHTML = "X: " + (-event.gamma).toString();
                        yAccelartion.innerHTML = "Y: " + (-event.alpha).toString();
                        zAccelartion.innerHTML = "Z: " + (-event.beta).toString();
                        if (!upSideDownBool)
                            rgdbdyBall.applyForce(new f.Vector3(-event.gamma, 0, -event.beta));
                        if (upSideDownBool)
                            rgdbdyBall.applyForce(new f.Vector3(0, event.alpha, 0));
                    });
                }
                else {
                    console.log("Access acceleration: " + response);
                }
            });
    }
    function changeUpSideDown() {
        if (!upSideDownBool)
            upSideDownBool = true;
        else
            upSideDownBool = false;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map