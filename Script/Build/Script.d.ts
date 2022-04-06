import f = FudgeCore;
declare namespace MadMaze {
    let locationBooleans: LocationBool[];
    class BallManager {
        private rgdbdyBall;
        private startButton;
        private toleranceFactor;
        private cameraRot;
        constructor(_rgdBdy: f.ComponentRigidbody, _startButton: HTMLElement);
        getAccelPermission: () => void;
        getMobileOperatingSystem: () => string;
        createButtons(): void;
        createArray(): void;
        deviceOrientationDistributor: (event: DeviceOrientationEvent) => void;
        applyForceAlongDirection: (event: DeviceOrientationEvent) => void;
        checkForOrientation: (event: DeviceOrientationEvent) => void;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class CameraFollow {
        private cmpCamera;
        private ballNode;
        private hasLocationChanged;
        private delayCameraX;
        private delayCameraY;
        private delayCameraZ;
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
