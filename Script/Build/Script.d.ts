import f = FudgeCore;
declare namespace MadMaze {
    let locationBooleans: LocationBool[];
    let spawnPoint: f.Vector3;
    class BallManager {
        private rgdbdyBall;
        private startButton;
        private toleranceFactor;
        alignment: HTMLElement;
        constructor(_rgdBdy: f.ComponentRigidbody, _startButton: HTMLElement);
        private update;
        getAccelPermission: () => void;
        getMobileOperatingSystem: () => string;
        createButtons(): void;
        createArray(): void;
        deviceOrientationDistributor: (event: DeviceOrientationEvent) => void;
        private gamma;
        private beta;
        applyForceAlongDirection: (event: DeviceOrientationEvent) => void;
        checkForOrientation: (event: DeviceOrientationEvent) => void;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class CameraFollow {
        private cmpCamera;
        private ballNode;
        private delayCameraX;
        private delayCameraZ;
        private delayRotX;
        private delayRotZ;
        constructor(_cmpCamera: f.ComponentCamera, _ballNode: f.Node);
        private update;
    }
}
declare namespace MadMaze {
    class LocationBool {
        isActive: boolean;
        name: string;
        constructor(_isActive: boolean, _name: string);
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    let rgdbdyBall: f.ComponentRigidbody;
    let cmpCamera: f.ComponentCamera;
}
declare namespace MadMaze {
    import f = FudgeCore;
    class ObstaclesTranslator extends f.ComponentScript {
        static readonly iSubclass: number;
        private isCross;
        private verticalNeg;
        private verticalPos;
        private rndRotVel;
        private rndTransVel;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class OnCollisionStop extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private collisionEnter;
        private collisionExit;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class OnTriggerDisable extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private triggerEnter;
        private triggerExit;
        private update;
    }
}
