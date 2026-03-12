/**
 * Question Name: Elevator System Design (LLD)
 * Target Companies: Amazon, Microsoft
 */

/**
 * Hinglish Explanation:
 * Ek multi-elevator system design karna hai jisme efficiency sabse zyada ho.
 * 
 * Key Logic (SCAN Algorithm style):
 * 1. Elevator direction (UP, DOWN, IDLE) track karega.
 * 2. Requests ko queue mein rakhega.
 * 3. Hamesha woh elevator pick hoga jo sabse nazdik ho aur sahi direction mein ja raha ho.
 * 
 * Objects:
 * - Elevator: Move, Open Door, Close Door.
 * - Request: Floor number, Direction.
 * - ElevatorController: Sabse main dimag, jo requests assign karta hai.
 */

const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    IDLE: 'IDLE'
};

class Elevator {
    constructor(id) {
        this.id = id;
        this.currentFloor = 0;
        this.direction = Direction.IDLE;
        this.requests = []; // Scheduled floors
    }

    moveTo(floor) {
        console.log(`Elevator ${this.id} moving from ${this.currentFloor} to ${floor}`);
        this.currentFloor = floor;
        // Logic to update direction and status
    }
}

class InternalRequest {
    constructor(destinationFloor) {
        this.destinationFloor = destinationFloor;
    }
}

class ExternalRequest {
    constructor(sourceFloor, direction) {
        this.sourceFloor = sourceFloor;
        this.direction = direction;
    }
}

class ElevatorController {
    constructor(numElevators) {
        this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i + 1));
    }

    handleRequest(floor, direction) {
        // Find best elevator strategy
        // Simplest: Pick first idle or nearest
        let bestElevator = this.elevators[0];
        console.log(`Assigning floor ${floor} to Elevator ${bestElevator.id}`);
        bestElevator.moveTo(floor);
    }
}

// Test
const controller = new ElevatorController(3);
controller.handleRequest(5, Direction.UP);
