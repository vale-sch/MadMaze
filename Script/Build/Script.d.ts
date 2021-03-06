/// <reference types="../../Core/FudgeCore" />
declare namespace MadMaze {
    import f = FudgeCore;
    let orientations: Orientation[];
    let spawnPoint: f.Vector3;
    let lowestBorder: number;
    class BallManager {
        private rgdbdyBall;
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
    let isCameraFly: boolean;
    let cameraFlyPoints: Array<f.ComponentTransform>;
    let flyIncrement: number;
    class CameraFollow {
        private cameraParent;
        private cameraNode;
        private ballNode;
        private delayCameraTransX;
        private delayCameraTransY;
        private delayCameraTransZ;
        private delayCameraRotX;
        private delayCameraRotY;
        private delayCameraRotZ;
        private hasCheckedSpawnPoint;
        constructor(_cmpCamera: f.Node, _cameraParent: f.Node, _ballNode: f.Node);
        private update;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class Checkpoint extends f.ComponentScript {
        static readonly iSubclass: number;
        private hasActivated;
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
        constructor(_startButton: HTMLElement, _ballManager: BallManager);
        getAccelPermission: () => void;
        getMobileOperatingSystem: () => string;
        createButtons(): void;
        createOrientationArray(): void;
        deviceOrientationDistributor: (event: DeviceOrientationEvent) => void;
        checkForOrientation: (event: DeviceOrientationEvent) => void;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    let startPoint: f.Vector3;
    let levelOverview: HTMLElement;
    enum Levels {
        LEVEL1 = "Graph|2022-05-17T15:48:20.157Z|38212",
        LEVEL2 = "Graph|2022-05-17T15:48:08.487Z|74649",
        LEVEL3 = "Graph|2022-05-17T15:39:18.443Z|44479",
        LEVEL4 = "Graph|2022-05-31T15:35:07.044Z|09570",
        LEVEL5 = "Graph|2022-05-31T15:46:28.921Z|74068"
    }
    class LevelManager {
        static level: number;
        static nextLevelGraph: Levels;
        static previousGraph: f.Graph;
        static levelOverview: HTMLElement;
        constructor();
        static loadNextLevel(): void;
        static initializeScene(): void;
        static checkForNextLevel(): void;
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
    class OnTriggerOpen extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private OnTriggerEnter;
        private OnTriggerExit;
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
    class OverlayCanvas {
        static overlayDiv: HTMLElement;
        static continueButton: HTMLElement;
        static showTrackButton: HTMLElement;
        static isInOverlayMode: boolean;
        static initializeButtons(): void;
        static showDiv(): void;
        private static hideDiv;
        static showTrack: () => void;
        static continueGame: () => void;
    }
}
declare namespace MadMaze {
    import f = FudgeCore;
    class Target extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private OnTriggerEnter;
    }
}
