namespace MadMaze {
    import f = FudgeCore;
    export class CameraFollow {

        private nodeCamera: f.Node;
        private cmpCamera: f.ComponentCamera;
        private ballNode: f.Node;
        private hasLocationChanged: string;
        constructor(_nodeCamera: f.Node, _cmpCamera: f.ComponentCamera, _ballNode: f.Node) {
            this.nodeCamera = _nodeCamera;
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.ballNode.mtxWorld.translation.x, this.ballNode.mtxWorld.translation.y + 15, this.ballNode.mtxWorld.translation.z);

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