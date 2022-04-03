"use strict";
var MadMaze;
(function (MadMaze) {
    class LocationBool {
        isActive = false;
        name = "";
        constructor(_isActive, _name) {
            this.isActive = _isActive;
            this.name = _name;
        }
    }
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    f.Project.registerScriptNamespace(MadMaze);
    let viewport;
    let madeMazeGraph;
    let rgdbdyBall;
    let cmpCamera;
    let startButton = document.getElementById("accelButton");
    if (f.Project.mode != f.MODE.EDITOR) {
        startButton.addEventListener("click", getAccelPermission);
        startButton.addEventListener("click", init);
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
                        window.addEventListener('deviceorientation', deviceOrientation);
                    }
                    else {
                        console.log("Access acceleration: " + response);
                    }
                });
                break;
            case ("Android"):
                window.addEventListener("deviceorientation", deviceOrientation);
                break;
            case ("Windows Phone"):
                console.log("not implemented yet");
                break;
        }
        createButtons();
    }
    function createButtons() {
        document.body.removeChild(startButton);
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
    let toleranceFactor = 30;
    let locationBooleans = new Array();
    for (let i = 0; i < 7; i++) {
        switch (i) {
            case 0:
                locationBooleans.push(new LocationBool(false, "normal"));
                break;
            case 1:
                locationBooleans.push(new LocationBool(false, "rightSide"));
                break;
            case 2:
                locationBooleans.push(new LocationBool(false, "leftSide"));
                break;
            case 3:
                locationBooleans.push(new LocationBool(false, "setUpReversed"));
                break;
            case 4:
                locationBooleans.push(new LocationBool(false, "setUpNormal"));
                break;
            case 5:
                locationBooleans.push(new LocationBool(false, "overHead"));
                break;
            case 6:
                locationBooleans.push(new LocationBool(false, "overHeadReversed"));
                break;
        }
    }
    function deviceOrientation(event) {
        let yAccelartion = document.getElementById("BETTA");
        let zAccelartion = document.getElementById("GAMMA");
        yAccelartion.innerHTML = "BETTA: " + (event.beta).toString();
        zAccelartion.innerHTML = "GAMMA: " + (event.gamma).toString();
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
        if (event.beta - toleranceFactor < 15 && event.beta + toleranceFactor > 15 && event.gamma - toleranceFactor < 15 && event.gamma + toleranceFactor > 15) {
            for (let location of locationBooleans) {
                if (location.name == "normal") {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                }
                else
                    location.isActive = false;
            }
        }
        if (event.gamma - toleranceFactor < 90 && event.gamma + toleranceFactor > 90) {
            for (let location of locationBooleans) {
                if (location.name == "leftSide" && location.isActive) {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                    for (let location of locationBooleans) {
                        if (location.name == "rightSide") {
                            location.isActive = false;
                        }
                    }
                    return;
                }
                if (location.name == "rightSide") {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                }
                else
                    location.isActive = false;
            }
        }
        if (event.gamma - toleranceFactor < -90 && event.gamma + toleranceFactor > -90) {
            for (let location of locationBooleans) {
                if (location.name == "rightSide" && location.isActive)
                    return;
                if (location.name == "leftSide") {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                }
                else
                    location.isActive = false;
            }
        }
        if (event.beta - toleranceFactor < -90 && event.beta + toleranceFactor > -90) {
            for (let location of locationBooleans) {
                if (location.name == "setUpReversed") {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                }
                else
                    location.isActive = false;
            }
        }
        if (event.beta - toleranceFactor < 90 && event.beta + toleranceFactor > 90) {
            for (let location of locationBooleans) {
                if (location.name == "setUpNormal") {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                }
                else
                    location.isActive = false;
            }
        }
        if (event.beta - toleranceFactor < 150 && event.beta + toleranceFactor > 150 && event.gamma - toleranceFactor < 0 && event.gamma + toleranceFactor > 0) {
            for (let location of locationBooleans) {
                if (location.name == "overHead") {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                    rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                }
                else
                    location.isActive = false;
            }
        }
        if (event.beta - toleranceFactor < -180 && event.beta + toleranceFactor > -180 && event.gamma - toleranceFactor < 0 && event.gamma + toleranceFactor > 0) {
            for (let location of locationBooleans) {
                if (location.name == "overHeadReversed") {
                    cameraRot.innerHTML = "Handy: " + location.name;
                    location.isActive = true;
                    rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                }
                else
                    location.isActive = false;
            }
        }
        //if (rgdbdyBall.getVelocity().magnitude < 20)
        locationBooleans.forEach(location => {
            switch (location.name) {
                case ("normal"):
                    if (location.isActive) {
                        rgdbdyBall.applyForce(new f.Vector3(-event.gamma, -5, -event.beta));
                    }
                    break;
                case ("rightSide"):
                    if (location.isActive) {
                        rgdbdyBall.applyForce(new f.Vector3(-event.gamma, Math.abs(event.gamma), -event.beta));
                    }
                    break;
                case ("leftSide"):
                    if (location.isActive) {
                        /* if (Math.abs(event.beta) > 100) {
                           cameraRot.innerHTML = "GIMBELLOCK1!";
                           rgdbdyBall.applyForce(new f.Vector3(Math.abs(event.gamma), Math.abs(event.gamma), -event.beta));
                         }
             
                         else*/
                        rgdbdyBall.applyForce(new f.Vector3(Math.abs(event.gamma), Math.abs(event.gamma), -event.beta));
                    }
                    break;
                case ("setUpReversed"):
                    if (location.isActive) {
                        rgdbdyBall.applyForce(new f.Vector3(-event.gamma, -event.beta / 10, -event.beta));
                    }
                    break;
                case ("setUpNormal"):
                    if (location.isActive) {
                        rgdbdyBall.applyForce(new f.Vector3(-event.gamma, event.beta / 5, -event.beta));
                    }
                    break;
                case ("overHead"):
                    if (location.isActive) {
                        rgdbdyBall.applyForce(new f.Vector3(-event.gamma, event.beta, event.beta));
                    }
                    break;
                case ("overHeadReversed"):
                    if (location.isActive) {
                        rgdbdyBall.applyForce(new f.Vector3(-event.gamma, -event.beta, -event.beta));
                    }
                    break;
            }
        });
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