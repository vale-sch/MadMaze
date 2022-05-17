namespace MadMaze {
    import f = FudgeCore;
    export let cameraRotX: number = 0;
    export class CameraFollow {
        private cameraParent: f.Node;
        private cmpCamera: f.Node;
        private ballNode: f.Node;
        private delayCameraTransX: f.Control = new f.Control("delayCameraX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraTransZ: f.Control = new f.Control("delayCameraZ", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraRotX: f.Control = new f.Control("delayRotX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraRotZ: f.Control = new f.Control("delayRotZ", 1, f.CONTROL_TYPE.PROPORTIONAL);
        constructor(_cmpCamera: f.Node, _cameraParent: f.Node, _ballNode: f.Node) {
            this.cameraParent = _cameraParent;
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            this.delayCameraTransX.setDelay(0);
            this.delayCameraTransZ.setDelay(0);
            this.delayCameraRotX.setDelay(0);
            this.delayCameraRotZ.setDelay(0);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            cameraRotX = this.delayCameraRotX.getOutput();
            locationBooleans.forEach(location => {
                switch (location.alignment) {
                    case (Alignment.NORMAL):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 60, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());

                        }
                        break;
                    case (Alignment.LEFTSIDE):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x - 8);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 60, this.delayCameraTransZ.getOutput());

                            this.delayCameraRotZ.setInput(25);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(90, 0, this.delayCameraRotZ.getOutput());

                        }
                        break;
                    case (Alignment.RIGHTSIDE):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x + 8);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 60, this.delayCameraTransZ.getOutput());

                            this.delayCameraRotZ.setInput(-25);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(90, 0, this.delayCameraRotZ.getOutput());

                        }
                        break;
                    case (Alignment.SETUPREVERSED):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            if (this.ballNode.mtxWorld.translation.z > 0)
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z - 10);
                            else
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z + 10);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 60, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(65);
                            this.delayCameraRotZ.setInput(0);

                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraTransZ.getOutput());

                        }
                        break;
                    case (Alignment.SETUPNORMAL):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);



                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 60, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);

                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);

                        }
                        break;
                    case (Alignment.OVERHEAD):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 60, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());

                        }
                        break;
                    case (Alignment.OVERHEADREVERSED):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 60, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());

                        }
                        break;
                }
            });
        }
    }
}