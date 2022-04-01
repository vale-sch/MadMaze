"use strict";
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    f.Project.registerScriptNamespace(MadMaze);
    let viewport;
    let madeMazeGraph;
    let rgdbdyBall;
    let cmpCamera;
    let accelButt = document.getElementById("accelButton");
    if (f.Project.mode != f.MODE.EDITOR) {
        accelButt.addEventListener("click", getAccelPermission);
        accelButt.addEventListener("click", init);
    }
    async function init() {
        await FudgeCore.Project.loadResources("Internal.json");
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        madeMazeGraph = (f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]);
        rgdbdyBall = madeMazeGraph.getChild(0).getComponent(f.ComponentRigidbody);
        FudgeCore.Debug.log("Graph:", madeMazeGraph);
        if (!madeMazeGraph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        cmpCamera = new FudgeCore.ComponentCamera();
        cmpCamera.mtxPivot.translateY(35);
        cmpCamera.mtxPivot.rotateX(90);
        let canvas = document.querySelector("canvas");
        viewport = new FudgeCore.Viewport();
        viewport.initialize("InteractiveViewport", madeMazeGraph, cmpCamera, canvas);
        viewport.draw();
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
        let refreshButt = document.createElement("button");
        refreshButt.style.width = "100px";
        refreshButt.style.height = "75px";
        refreshButt.innerText = "REFRESH";
        refreshButt.style.fontSize = "15px";
        refreshButt.style.fontWeight = "bold";
        refreshButt.style.position = "absolute";
        refreshButt.style.top = "0%";
        refreshButt.style.right = "0%";
        document.body.appendChild(refreshButt);
        refreshButt.addEventListener("pointerdown", (event) => {
            console.log(event);
            window.location.reload();
        });
    }
    function deviceMotion(_event) {
        //Debug Elements
        let xAccelartion = document.getElementById("x");
        let yAccelartion = document.getElementById("y");
        let zAccelartion = document.getElementById("z");
        xAccelartion.innerHTML = "X: " + (_event.gamma).toString();
        yAccelartion.innerHTML = "Y: " + (_event.alpha).toString();
        zAccelartion.innerHTML = "Z: " + (_event.beta).toString();
        /* let cameraRot: HTMLElement = document.getElementById("camera");
        cameraRot.innerHTML = "camera_rot: " + (cmpCamera.mtxPivot.rotation).toString();
        //Camera Movements
        if (cmpCamera.mtxPivot.rotation.z > -0.667 && _event.gamma < 0)
          cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
        if (cmpCamera.mtxPivot.rotation.z < 0.667 && _event.gamma > 0)
          cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
        if (cmpCamera.mtxPivot.rotation.x > 89.336 && _event.beta > 0)
          cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
        if (cmpCamera.mtxPivot.rotation.x < 90.667 && _event.beta < 0)
          cmpCamera.mtxPivot.rotateX(-_event.beta / 250);*/
        let cameraRot = document.getElementById("camera");
        cameraRot.innerHTML = "rgdbdy_fric " + rgdbdyBall.getVelocity().magnitude.toString();
        if (rgdbdyBall.getVelocity().magnitude < 20)
            rgdbdyBall.applyForce(new f.Vector3(-_event.gamma, _event.beta, -_event.beta));
    }
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class ObstaclesTranslator extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(ObstaclesTranslator);
        isCross;
        verticalNeg = false;
        verticalPos = false;
        rndRotVel;
        rndTransVel;
        constructor() {
            super();
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.rndRotVel = randomRangeFromInterval(0.5, 2);
            this.rndTransVel = randomRangeFromInterval(0.0005, 0.001) * 0.01;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    switch (this.node.name) {
                        case "cross":
                            this.isCross = true;
                            break;
                        case "vertical":
                            this.isCross = false;
                            break;
                        default: break;
                    }
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        update = () => {
            if (this.isCross) {
                this.node.getComponent(f.ComponentTransform).mtxLocal.rotateY(this.rndRotVel);
            }
            else {
                if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 1.74 && !this.verticalNeg) {
                    this.node.getComponent(f.ComponentTransform).mtxLocal.translateZ(-this.rndTransVel);
                    if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 1.75) {
                        this.verticalNeg = true;
                        this.verticalPos = false;
                    }
                }
                else if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 2.8 && !this.verticalPos) {
                    this.node.getComponent(f.ComponentTransform).mtxLocal.translateZ(+this.rndTransVel);
                    if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 2.79) {
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