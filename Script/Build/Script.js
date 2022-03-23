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
    let cmpCamera;
    let accelButt = document.getElementById("accelButton");
    let cmpTrigger;
    accelButt.addEventListener("click", getAccelPermission);
    document.getElementById("accelButton").addEventListener("click", init);
    async function init() {
        document.addEventListener("interactiveViewportStarted", start);
        await FudgeCore.Project.loadResourcesFromHTML();
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        madeMazeGraph = (f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]);
        cmpTrigger = madeMazeGraph.getChild(madeMazeGraph.nChildren - 1).getChild(0).getComponent(f.ComponentRigidbody);
        cmpTrigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndTrigger);
        rgdbdyBall = madeMazeGraph.getChild(0).getComponent(f.ComponentRigidbody);
        FudgeCore.Debug.log("Graph:", madeMazeGraph);
        if (!madeMazeGraph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        cmpCamera = new FudgeCore.ComponentCamera();
        cmpCamera.mtxPivot.translateY(18.5);
        cmpCamera.mtxPivot.rotateX(90);
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
    function getAccelPermission() {
        accelButt.style.visibility = 'hidden';
        let divPanel = document.getElementById("controlPanel");
        let upSideDownBut = document.createElement("button");
        upSideDownBut.style.width = "200px";
        upSideDownBut.style.height = "50px";
        upSideDownBut.innerText = "UPSIDE DOWN";
        let refreshButt = document.createElement("button");
        refreshButt.style.width = "200px";
        refreshButt.style.height = "50px";
        refreshButt.innerText = "REFRESH GAME";
        divPanel.appendChild(upSideDownBut);
        divPanel.appendChild(refreshButt);
        upSideDownBut.addEventListener("click", changeUpSideDown);
        refreshButt.addEventListener("click", (event) => {
            console.log(event);
            window.location.reload();
        });
        let _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
        if (_iOSDevice)
            DeviceMotionEvent.requestPermission().then((response) => {
                if (response == 'granted') {
                    console.log("Access acceleration: " + response);
                    window.addEventListener('deviceorientation', deviceMotion);
                }
                else {
                    console.log("Access acceleration: " + response);
                }
            });
    }
    function deviceMotion(_event) {
        let xAccelartion = document.getElementById("x");
        let yAccelartion = document.getElementById("y");
        let zAccelartion = document.getElementById("z");
        let cameraRot = document.getElementById("camera");
        let oldYAcceleration = 0;
        xAccelartion.innerHTML = "X: " + (_event.gamma).toString();
        yAccelartion.innerHTML = "Y: " + (_event.alpha).toString();
        zAccelartion.innerHTML = "Z: " + (_event.beta).toString();
        cameraRot.innerHTML = "camera_rot: " + (cmpCamera.mtxPivot.rotation).toString();
        if (!upSideDownBool) {
            rgdbdyBall.applyForce(new f.Vector3(-_event.gamma, 0, -_event.beta));
            oldYAcceleration = _event.alpha;
            if (cmpCamera.mtxPivot.rotation.z > -.5 && _event.gamma < 0)
                cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
            if (cmpCamera.mtxPivot.rotation.z < .5 && _event.gamma > 0)
                cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
            if (cmpCamera.mtxPivot.rotation.x > 89.5 && _event.beta > 0)
                cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
            if (cmpCamera.mtxPivot.rotation.x < 90.5 && _event.beta < 0)
                cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
        }
        if (upSideDownBool)
            if (Math.abs(_event.alpha - oldYAcceleration) > 20)
                rgdbdyBall.applyForce(new f.Vector3(0, _event.alpha, 0));
    }
    function changeUpSideDown() {
        if (!upSideDownBool)
            upSideDownBool = true;
        else
            upSideDownBool = false;
    }
    function hndTrigger(_event) {
        if (_event.cmpRigidbody.node.name == "Ball") {
            document.write("YOU HAVE WONE THE GAME");
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map