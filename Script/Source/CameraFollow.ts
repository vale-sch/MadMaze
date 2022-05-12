namespace MadMaze {
    import f = FudgeCore;
    export class CameraFollow {
        private cmpCamera: f.ComponentCamera;
        private ballNode: f.Node;
        private delayCameraX: f.Control = new f.Control("delayCameraX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraZ: f.Control = new f.Control("delayCameraZ", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayRotX: f.Control = new f.Control("delayRotX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayRotZ: f.Control = new f.Control("delayRotZ", 1, f.CONTROL_TYPE.PROPORTIONAL);
        constructor(_cmpCamera: f.ComponentCamera, _ballNode: f.Node) {
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            this.delayCameraX.setDelay(350);
            this.delayCameraZ.setDelay(350);
            this.delayRotX.setDelay(500);
            this.delayRotZ.setDelay(500);
            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, 0);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            locationBooleans.forEach(location => {
                switch (location.name) {
                    case ("normal"):
                        if (location.isActive) {
                            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z - 5);
                            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraZ.getOutput());
                            this.delayRotX.setInput(50);
                            this.delayRotZ.setInput(0);
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(this.delayRotX.getOutput(), 0, this.delayRotZ.getOutput());

                        }
                        break;
                    case ("leftSide"):
                        if (location.isActive) {
                            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x - 8);
                            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraZ.getOutput());

                            this.delayRotZ.setInput(25);
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, this.delayRotZ.getOutput());

                        }
                        break;
                    case ("rightSide"):
                        if (location.isActive) {
                            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x + 8);
                            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraZ.getOutput());

                            this.delayRotZ.setInput(-25);
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(90, 0, this.delayRotZ.getOutput());

                        }
                        break;
                    case ("setUpReversed"):
                        if (location.isActive) {
                            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z - 10);
                            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraZ.getOutput());
                            this.delayRotX.setInput(65);
                            this.delayRotZ.setInput(0);

                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(this.delayRotX.getOutput(), 0, this.delayCameraZ.getOutput());

                        }
                        break;
                    case ("setUpNormal"):
                        if (location.isActive) {
                            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z + 10);
                            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraZ.getOutput());
                            this.delayRotX.setInput(65);
                            this.delayRotZ.setInput(0);

                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(this.delayRotX.getOutput(), 0, this.delayCameraZ.getOutput());

                        }
                        break;
                    case ("overHead"):
                        if (location.isActive) {
                            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraZ.getOutput());
                            this.delayRotX.setInput(90);
                            this.delayRotZ.setInput(0);
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(this.delayRotX.getOutput(), 0, this.delayRotZ.getOutput());

                        }
                        break;
                    case ("overHeadReversed"):
                        if (location.isActive) {
                            this.delayCameraX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cmpCamera.mtxPivot.translation = new f.Vector3(this.delayCameraX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraZ.getOutput());
                            this.delayRotX.setInput(90);
                            this.delayRotZ.setInput(0);
                            this.cmpCamera.mtxPivot.rotation = new f.Vector3(this.delayRotX.getOutput(), 0, this.delayRotZ.getOutput());

                        }
                        break;
                }
            });
        }
    }
}