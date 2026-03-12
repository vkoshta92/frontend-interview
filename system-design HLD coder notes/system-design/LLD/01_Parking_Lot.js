/**
 * Question Name: Parking Lot System Design (LLD)
 * Target Companies: Amazon, Microsoft, Google
 * Language: JavaScript (OOP)
 */

/**
 * Hinglish Explanation:
 * Parking Lot design karne ke liye humein 'Objects' aur unke 'Relationships' pe focus karna hai.
 * 
 * Requirements:
 * 1. Parking lot mein multiple floors honge.
 * 2. Har floor pe multiple parking spots honge.
 * 3. Spots different types ke ho sakte hain (Small, Medium, Large - for Bike, Car, Truck).
 * 4. Entry point pe ticket issue hoga, aur Exit point pe payment calculate hogi.
 * 
 * Objects Identifed:
 * - ParkingLot (Singleton: Poore system mein ek hi hoga).
 * - Floor (Multiple floors).
 * - ParkingSpot (Small, Medium, Large).
 * - Vehicle (Bike, Car, Truck).
 * - Ticket (Entry/Exit details).
 */

// Vehicle Types (Enum style)
const VehicleType = {
    BIKE: 'BIKE',
    CAR: 'CAR',
    TRUCK: 'TRUCK'
};

class Vehicle {
    constructor(licensePlate, type) {
        this.licensePlate = licensePlate;
        this.type = type;
    }
}

class ParkingSpot {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.isOccupied = false;
        this.vehicle = null;
    }

    park(vehicle) {
        this.isOccupied = true;
        this.vehicle = vehicle;
    }

    unpark() {
        this.isOccupied = false;
        this.vehicle = null;
    }
}

class ParkingFloor {
    constructor(floorNumber, spotCounts) {
        this.floorNumber = floorNumber;
        this.spots = [];
        // spotCounts could be {BIKE: 10, CAR: 20, TRUCK: 5}
        for (let type in spotCounts) {
            for (let i = 0; i < spotCounts[type]; i++) {
                this.spots.push(new ParkingSpot(`${floorNumber}-${type}-${i}`, type));
            }
        }
    }

    findAvailableSpot(vehicleType) {
        return this.spots.find(spot => !spot.isOccupied && spot.type === vehicleType);
    }
}

class ParkingLot {
    constructor(name, floorsConfig) {
        this.name = name;
        this.floors = floorsConfig.map((config, index) => new ParkingFloor(index + 1, config));
    }

    parkVehicle(vehicle) {
        for (let floor of this.floors) {
            let spot = floor.findAvailableSpot(vehicle.type);
            if (spot) {
                spot.park(vehicle);
                console.log(`Vehicle ${vehicle.licensePlate} parked at spot ${spot.id}`);
                return true;
            }
        }
        console.log(`No available spot for ${vehicle.type}`);
        return false;
    }

    unparkVehicle(vehicleLicensePlate) {
        // Logic to find spot by license plate and unpark
        for (let floor of this.floors) {
            let spot = floor.spots.find(s => s.vehicle && s.vehicle.licensePlate === vehicleLicensePlate);
            if (spot) {
                spot.unpark();
                console.log(`Vehicle ${vehicleLicensePlate} unparked from spot ${spot.id}`);
                return true;
            }
        }
        return false;
    }
}

// Test Case
const myParkingLot = new ParkingLot("FAANG Plaza", [
    { BIKE: 2, CAR: 2 }, // Floor 1
    { CAR: 5 }         // Floor 2
]);

const car1 = new Vehicle("DL-123", VehicleType.CAR);
myParkingLot.parkVehicle(car1);
myParkingLot.unparkVehicle("DL-123");
