"use strict";
var MadMaze;
(function (MadMaze) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
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
    MadMaze.CustomComponentScript = CustomComponentScript;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    f.Project.registerScriptNamespace(MadMaze);
    let viewport;
    let madeMazeGraph;
    let rgdbdyBall;
    let cmpCamera;
    let winTrigger;
    let accelButt = document.getElementById("accelButton");
    accelButt.addEventListener("click", getAccelPermission);
    accelButt.addEventListener("click", init);
    async function init() {
        document.addEventListener("interactiveViewportStarted", start);
        await FudgeCore.Project.loadResourcesFromHTML();
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        madeMazeGraph = (f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]);
        winTrigger = madeMazeGraph.getChild(madeMazeGraph.nChildren - 1).getChild(0).getComponent(f.ComponentRigidbody);
        winTrigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndTriggerWin);
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
        FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
        let crosses = madeMazeGraph.getChild(2).getChild(1).getChildren();
        crosses.forEach(cross => {
            cross.addComponent(new MadMaze.ObstaclesTranslator(cross));
        });
        let verticals = madeMazeGraph.getChild(2).getChild(2).getChildren();
        verticals.forEach(vertical => {
            vertical.addComponent(new MadMaze.ObstaclesTranslator(vertical));
        });
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
    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor;
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return "iOS";
        }
        return "unknown";
    }
    let upSideDownBool = false;
    function getAccelPermission() {
        let device = getMobileOperatingSystem();
        console.log(device);
        switch (device) {
            case ("iOS"):
                DeviceMotionEvent.requestPermission().then((response) => {
                    if (response == 'granted') {
                        console.log("Access acceleration: " + response);
                        window.addEventListener('deviceorientation', deviceMotion, true);
                    }
                    else {
                        console.log("Access acceleration: " + response);
                    }
                });
                break;
            case ("Android"):
                window.addEventListener("deviceorientation", deviceMotion, true);
                break;
            case ("Windows Phone"):
                console.log("not implemented yet");
                break;
        }
        createButtons();
    }
    function createButtons() {
        document.body.removeChild(accelButt);
        let divPanel = document.getElementById("controlPanel");
        let upSideDownBut = document.createElement("button");
        upSideDownBut.style.width = "400px";
        upSideDownBut.style.height = "100px";
        upSideDownBut.innerText = "UPSIDE DOWN";
        upSideDownBut.style.fontSize = "40px";
        upSideDownBut.style.fontWeight = "bold";
        let refreshButt = document.createElement("button");
        refreshButt.style.width = "50px";
        refreshButt.style.height = "50px";
        refreshButt.innerText = "REFRESH GAME";
        refreshButt.style.fontSize = "5px";
        refreshButt.style.fontWeight = "bold";
        refreshButt.style.position = "absolute";
        refreshButt.style.top = "0%";
        refreshButt.style.right = "0%";
        divPanel.appendChild(upSideDownBut);
        document.body.appendChild(refreshButt);
        upSideDownBut.addEventListener("pointerdown", changeUpSideDown);
        refreshButt.addEventListener("pointerdown", (event) => {
            console.log(event);
            window.location.reload();
        });
    }
    let oldYAcceleration = 0;
    function deviceMotion(_event) {
        //Debug Elements
        /*let xAccelartion: HTMLElement = document.getElementById("x");
        let yAccelartion: HTMLElement = document.getElementById("y");
        let zAccelartion: HTMLElement = document.getElementById("z");
        let cameraRot: HTMLElement = document.getElementById("camera");
        xAccelartion.innerHTML = "X: " + (_event.gamma).toString();
        yAccelartion.innerHTML = "Y: " + (_event.alpha).toString();
        zAccelartion.innerHTML = "Z: " + (_event.beta).toString();
        cameraRot.innerHTML = "camera_rot: " + (cmpCamera.mtxPivot.rotation).toString();*/
        if (cmpCamera.mtxPivot.rotation.z > -0.667 && _event.gamma < 0)
            cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
        if (cmpCamera.mtxPivot.rotation.z < 0.667 && _event.gamma > 0)
            cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
        if (cmpCamera.mtxPivot.rotation.x > 89.336 && _event.beta > 0)
            cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
        if (cmpCamera.mtxPivot.rotation.x < 90.667 && _event.beta < 0)
            cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
        if (!upSideDownBool) {
            rgdbdyBall.applyForce(new f.Vector3(-_event.gamma, 0, -_event.beta));
            oldYAcceleration = _event.beta;
        }
        if (upSideDownBool)
            if (Math.abs(_event.beta - oldYAcceleration) > 10)
                rgdbdyBall.applyForce(new f.Vector3(0, _event.beta, 0));
            else
                rgdbdyBall.applyForce(new f.Vector3(0, -25, 0));
    }
    function changeUpSideDown() {
        if (!upSideDownBool)
            upSideDownBool = true;
        else
            upSideDownBool = false;
    }
    function hndTriggerWin(_event) {
        if (_event.cmpRigidbody.node.name == "Ball") {
            alert("You have won the game!");
        }
    }
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class ObstaclesTranslator extends f.ComponentScript {
        //public static readonly iSubclass: number = f.Component.registerSubclass(ObstaclesTranslator);
        isCross;
        verticalNeg = false;
        verticalPos = false;
        rndRotVel;
        rndTransVel;
        mySelf;
        constructor(_mySelf) {
            super();
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.mySelf = _mySelf;
            this.rndRotVel = randomRangeFromInterval(0.5, 2);
            this.rndTransVel = randomRangeFromInterval(0.0005, 0.001) * 0.01;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            switch (this.mySelf.name) {
                case "cross":
                    this.isCross = true;
                    break;
                case "vertical":
                    this.isCross = false;
                    break;
                default: break;
            }
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        update = () => {
            if (this.isCross) {
                this.mySelf.getComponent(f.ComponentTransform).mtxLocal.rotateY(this.rndRotVel);
            }
            else {
                if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 1.74 && !this.verticalNeg) {
                    this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translateZ(-this.rndTransVel);
                    if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 1.75) {
                        this.verticalNeg = true;
                        this.verticalPos = false;
                    }
                }
                else if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 2.8 && !this.verticalPos) {
                    this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translateZ(+this.rndTransVel);
                    if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 2.79) {
                        this.verticalNeg = false;
                        this.verticalPos = true;
                    }
                }
            }
        };
    }
    MadMaze.ObstaclesTranslator = ObstaclesTranslator;
    function randomRangeFromInterval(min, max) {
        return (Math.random() * (max - min + 1) + min);
    }
})(MadMaze || (MadMaze = {}));
//# sourceMappingURL=Script.js.map