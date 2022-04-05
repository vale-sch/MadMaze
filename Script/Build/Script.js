"use strict";
var f = FudgeCore;
var MadMaze;
(function (MadMaze) {
    MadMaze.locationBooleans = new Array();
    class BallManager {
        rgdbdyBall;
        startButton;
        toleranceFactor = 25;
        cameraRot;
        yAccelartion;
        zAccelartion;
        constructor(_rgdBdy, _startButton) {
            this.rgdbdyBall = _rgdBdy;
            this.startButton = _startButton;
            this.cameraRot = document.getElementById("camera");
            this.yAccelartion = document.getElementById("BETTA");
            this.zAccelartion = document.getElementById("GAMMA");
        }
        getAccelPermission = () => {
            let device = this.getMobileOperatingSystem();
            console.log(device);
            switch (device) {
                case ("iOS"):
                    DeviceMotionEvent.requestPermission().then((response) => {
                        if (response == 'granted') {
                            console.log("Access acceleration: " + response);
                            window.addEventListener('deviceorientation', this.deviceOrientationDistributor);
                        }
                        else {
                            console.log("Access acceleration: " + response);
                        }
                    });
                    break;
                case ("Android"):
                    window.addEventListener("deviceorientation", this.deviceOrientationDistributor);
                    console.log("GRANTED");
                    break;
                case ("Windows Phone"):
                    console.log("not implemented yet");
                    break;
            }
            this.createButtons();
            this.createArray();
        };
        getMobileOperatingSystem = () => {
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
        };
        createButtons() {
            document.body.removeChild(this.startButton);
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
        createArray() {
            for (let i = 0; i < 7; i++) {
                switch (i) {
                    case 0:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "normal"));
                        break;
                    case 1:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "rightSide"));
                        break;
                    case 2:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "leftSide"));
                        break;
                    case 3:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "setUpReversed"));
                        break;
                    case 4:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "setUpNormal"));
                        break;
                    case 5:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "overHead"));
                        break;
                    case 6:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "overHeadReversed"));
                        break;
                }
            }
        }
        deviceOrientationDistributor = (event) => {
            this.applyForceAlongDirection(event);
            //Camera Movements
            /* if (cmpCamera.mtxPivot.rotation.z > -0.667 && event.gamma < 0)
                 cmpCamera.mtxPivot.rotateY(event.gamma / 250);
             if (cmpCamera.mtxPivot.rotation.z < 0.667 && event.gamma > 0)
                 cmpCamera.mtxPivot.rotateY(event.gamma / 250);
             if (cmpCamera.mtxPivot.rotation.x > 89.336 && event.beta > 0)
                 cmpCamera.mtxPivot.rotateX(-event.beta / 250);
             if (cmpCamera.mtxPivot.rotation.x < 90.667 && event.beta < 0)
                 cmpCamera.mtxPivot.rotateX(-event.beta / 250);*/
            this.checkForOrientation(event);
        };
        applyForceAlongDirection = (event) => {
            this.yAccelartion.innerHTML = "BETTA: " + MadMaze.cmpCamera.mtxPivot.rotation.toString();
            this.zAccelartion.innerHTML = "GAMMA: " + event.gamma.toString();
            MadMaze.locationBooleans.forEach(location => {
                switch (location.name) {
                    case ("normal"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-event.gamma, -5, -event.beta));
                        break;
                    case ("rightSide"):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(event.gamma / 4, 750 / Math.abs(event.gamma), -event.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 4, event.gamma / 10, -event.beta));
                        }
                        break;
                    case ("leftSide"):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(event.gamma / 4, 750 / Math.abs(event.gamma), -event.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 4, -event.gamma / 10, -event.beta));
                        }
                        break;
                    case ("setUpReversed"):
                        if (location.isActive) {
                            if (event.beta > -90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 2, -event.beta / 8, -event.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(event.gamma / 2, -event.beta / 8, -event.beta));
                        }
                        break;
                    case ("setUpNormal"):
                        if (location.isActive) {
                            if (event.beta < 90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 2, event.beta / 8, -event.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(event.gamma / 2, event.beta / 8, -event.beta));
                        }
                        break;
                    case ("overHead"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-event.gamma, event.beta / 5, event.beta));
                        break;
                    case ("overHeadReversed"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-event.gamma, -event.beta / 5, -event.beta));
                        break;
                }
            });
        };
        checkForOrientation = (event) => {
            //normal
            if (event.beta - this.toleranceFactor < 20 && event.beta + this.toleranceFactor > 20 && event.gamma - this.toleranceFactor < 20 && event.gamma + this.toleranceFactor > 20) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "normal") {
                        this.cameraRot.innerHTML = "Handy: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //rightside
            if (event.gamma - this.toleranceFactor < 90 && event.gamma + this.toleranceFactor > 90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "rightSide") {
                        for (let location of MadMaze.locationBooleans) {
                            if (location.name == "leftSide" && location.isActive)
                                return;
                        }
                        this.cameraRot.innerHTML = "Handy: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //leftside
            if (event.gamma - this.toleranceFactor < -90 && event.gamma + this.toleranceFactor > -90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "rightSide" && location.isActive)
                        return;
                    if (location.name == "leftSide") {
                        this.cameraRot.innerHTML = "Handy: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //setUpReversed
            if (event.beta - this.toleranceFactor < -90 && event.beta + this.toleranceFactor > -90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "setUpReversed") {
                        this.cameraRot.innerHTML = "Handy: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //setUpNormal
            if (event.beta - this.toleranceFactor < 90 && event.beta + this.toleranceFactor > 90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "setUpNormal") {
                        this.cameraRot.innerHTML = "Handy: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //overhead
            if (event.beta - this.toleranceFactor < 180 && event.beta + this.toleranceFactor > 180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "overHead") {
                        this.cameraRot.innerHTML = "Handy: " + location.name;
                        location.isActive = true;
                        this.rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                    }
                    else
                        location.isActive = false;
                }
            }
            //overHeadReversed
            if (event.beta - this.toleranceFactor < -180 && event.beta + this.toleranceFactor > -180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "overHeadReversed") {
                        this.cameraRot.innerHTML = "Handy: " + location.name;
                        location.isActive = true;
                        this.rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                    }
                    else
                        location.isActive = false;
                }
            }
        };
    }
    MadMaze.BallManager = BallManager;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    class CameraFollow {
        nodeCamera;
        cmpCamera;
        ballNode;
        hasLocationChanged;
        constructor(_nodeCamera, _cmpCamera, _ballNode) {
            this.nodeCamera = _nodeCamera;
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            f.Loop.start();
        }
        update = (_event) => {
            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.ballNode.mtxWorld.translation.x, this.ballNode.mtxWorld.translation.y + 15, this.ballNode.mtxWorld.translation.z);
            MadMaze.locationBooleans.forEach(location => {
                switch (location.name) {
                    case ("normal"):
                        if (location.isActive && location.name != this.hasLocationChanged) {
                            this.hasLocationChanged = location.name;
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
                        }
                        break;
                    case ("rightSide"):
                        if (location.isActive && location.name != this.hasLocationChanged) {
                            this.hasLocationChanged = location.name;
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
                        }
                        break;
                    case ("leftSide"):
                        if (location.isActive && location.name != this.hasLocationChanged) {
                            this.hasLocationChanged = location.name;
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
                        }
                        break;
                    case ("setUpReversed"):
                        if (location.isActive && location.name != this.hasLocationChanged) {
                            this.hasLocationChanged = location.name;
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
                        }
                        break;
                    case ("setUpNormal"):
                        if (location.isActive && location.name != this.hasLocationChanged) {
                            this.hasLocationChanged = location.name;
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
                        }
                        break;
                    case ("overHead"):
                        if (location.isActive && location.name != this.hasLocationChanged) {
                            this.hasLocationChanged = location.name;
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
                        }
                        break;
                    case ("overHeadReversed"):
                        if (location.isActive && location.name != this.hasLocationChanged) {
                            this.hasLocationChanged = location.name;
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
                        }
                        break;
                }
            });
        };
    }
    MadMaze.CameraFollow = CameraFollow;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    //@ts-ignore
    class LocationBool {
        isActive = false;
        name = "";
        constructor(_isActive, _name) {
            this.isActive = _isActive;
            this.name = _name;
        }
    }
    MadMaze.LocationBool = LocationBool;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    f.Project.registerScriptNamespace(MadMaze);
    let viewport;
    let madeMazeGraph;
    let rgdbdyBall;
    let camera;
    let startButton = document.getElementById("accelButton");
    if (f.Project.mode != f.MODE.EDITOR)
        window.addEventListener("load", init);
    async function init() {
        await FudgeCore.Project.loadResources("Internal.json");
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        madeMazeGraph = (f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]);
        FudgeCore.Debug.log("Graph:", madeMazeGraph);
        if (!madeMazeGraph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        camera = madeMazeGraph.getChild(madeMazeGraph.nChildren - 1);
        MadMaze.cmpCamera = camera.getChild(0).getComponent(f.ComponentCamera);
        let canvas = document.querySelector("canvas");
        viewport = new FudgeCore.Viewport();
        viewport.initialize("InteractiveViewport", madeMazeGraph, MadMaze.cmpCamera, canvas);
        rgdbdyBall = madeMazeGraph.getChild(0).getComponent(f.ComponentRigidbody);
        let ballManager = new MadMaze.BallManager(rgdbdyBall, startButton);
        if (f.Project.mode != f.MODE.EDITOR)
            startButton.addEventListener("click", ballManager.getAccelPermission);
        new MadMaze.CameraFollow(camera, MadMaze.cmpCamera, rgdbdyBall.node);
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start();
    }
    function update(_event) {
        f.Physics.simulate();
        viewport.draw();
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