import f = FudgeCore;
declare namespace MadMaze {
    class BallManager {
        private rgdbdyBall;
        private locationBooleans;
        private toleranceFactor;
        private cameraRot;
        private yAccelartion;
        private zAccelartion;
        constructor(_rgdBdy: f.ComponentRigidbody);
        getAccelPermission(): void;
        private getMobileOperatingSystem;
        private createButtons;
        private createArray;
        private deviceOrientation;
        private applyForceAlongDirection;
        private checkForOrientation;
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
