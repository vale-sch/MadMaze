import f = FudgeCore;
declare namespace MadMaze {
    let orientations: Orientation[];
    let spawnPoint: f.Vector3;
    class BallManager {
        private rgdbdyBall;
        alignment: HTMLElement;
        constructor(_rgdBdy: f.ComponentRigidbody);
        private update;
        private gamma;
        private beta;
        private speed;
        applyForceAlongDirection: (event: DeviceOrientationEvent) => void;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class CameraFollow {
        private cameraParent;
        private cmpCamera;
        private ballNode;
        private delayCameraTransX;
        private delayCameraTransZ;
        private delayCameraRotX;
        private delayCameraRotZ;
        constructor(_cmpCamera: f.Node, _cameraParent: f.Node, _ballNode: f.Node);
        private update;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class Checkpoint extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private OnTriggerEnter;
    }
}
declare namespace MadMaze {
    class DeviceManager {
        private startButton;
        private ballManager;
        private toleranceFactor;
        alignment: HTMLElement;
        constructor(_startButton: HTMLElement, _ballManager: BallManager);
        getAccelPermission: () => void;
        getMobileOperatingSystem: () => string;
        createButtons(): void;
        createArray(): void;
        deviceOrientationDistributor: (event: DeviceOrientationEvent) => void;
        checkForOrientation: (event: DeviceOrientationEvent) => void;
    }
}
declare namespace MadMaze {
    enum LevelGraph {
        LEVEL1 = "Level1",
        LEVEL2 = "Level2",
        LEVEL3 = "Level3"
    }
    class LevelManager {
        static level: number;
        static levelGraph: LevelGraph;
        constructor(_level: number, _levelGraph: LevelGraph);
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    let madeMazeGraph: f.Graph;
    let rgdbdyBall: f.ComponentRigidbody;
    let cmpCamera: f.ComponentCamera;
    let cameraParent: f.Node;
}
declare namespace MadMaze {
    import f = FudgeCore;
    class ObstaclesTranslator extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class OnTriggerStop extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private OnTriggerEnter;
        private OnTriggerExit;
    }
}
declare namespace MadMaze {
    enum Alignment {
        NORMAL = "NORMAL",
        RIGHTSIDE = "RIGHTSIDE",
        LEFTSIDE = "LEFTSIDE",
        SETUPREVERSED = "SETUPREVERSED",
        SETUPNORMAL = "SETUPNORMAL",
        OVERHEAD = "OVERHEAD",
        OVERHEADREVERSED = "OVERHEADREVERSED"
    }
    class Orientation {
        isActive: boolean;
        alignment: Alignment;
        constructor(_isActive: boolean, _alignment: Alignment);
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class Target extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private triggerEnter;
        private update;
    }
}
