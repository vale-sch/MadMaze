namespace MadMaze {
    import f = FudgeCore;
    export class CameraFollow {

        private cmpCamera: f.ComponentCamera;
        private ballNode: f.Node;
        private hasLocationChanged: string;
        private delayCameraX: f.Control = new f.Control("delayCameraX", 1, f.CONTROL_TYPE.PROPORTIONAL, true);
        private delayCameraY: f.Control = new f.Control("delayCameraY", 1, f.CONTROL_TYPE.PROPORTIONAL, true);
        private delayCameraZ: f.Control = new f.Control("delayCameraZ", 1, f.CONTROL_TYPE.PROPORTIONAL, true);
        constructor(_cmpCamera: f.ComponentCamera, _ballNode: f.Node) {
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            this.delayCameraX.setDelay(250);
            this.delayCameraZ.setDelay(250);
            this.cmpCamera.mtxPivot.translation = new f.Vector3(0, 35, 0);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x);
            this.delayCameraY.setInput(this.ballNode.mtxWorld.translation.y);
            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z);

            //this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), 25, this.delayCameraZ.getOutput());

            locationBooleans.forEach(location => {
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
        }
    }
}