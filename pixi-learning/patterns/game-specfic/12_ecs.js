// ECS — Entity Component System
// Game Specific
// Modern game architecture — Unity bhi ECS use karta hai! Performance best hoti hai!

// Simple matlab

// ECS = Entity (ID only) + Component (data only) + System (logic only). Sab alag!

// ENTITY — sirf ek ID
class Entity {
  static #nextId = 0;
  id = Entity.#nextId++;
}

// COMPONENTS — sirf data, no logic
class PositionComponent {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
}

class VelocityComponent {
  constructor(vx = 0, vy = 0) { this.vx = vx; this.vy = vy; }
}

class RenderComponent {
  constructor(texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.visible = true;
  }
}

class SymbolComponent {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.highlighted = false;
  }
}

// WORLD — entities + components manage karo
class World {
  #entities = new Map();
  #components = new Map();

  createEntity() {
    const entity = new Entity();
    this.#entities.set(entity.id, entity);
    return entity;
  }

  addComponent(entityId, component) {
    const type = component.constructor.name;
    if (!this.#components.has(type)) {
      this.#components.set(type, new Map());
    }
    this.#components.get(type).set(entityId, component);
  }

  getComponent(entityId, ComponentClass) {
    return this.#components
      .get(ComponentClass.name)
      ?.get(entityId);
  }

  query(...ComponentClasses) {
    const firstMap = this.#components
      .get(ComponentClasses[0].name);
    if (!firstMap) return [];

    return [...firstMap.keys()].filter(id =>
      ComponentClasses.every(C =>
        this.#components.get(C.name)?.has(id)
      )
    );
  }
}

// SYSTEMS — sirf logic, no data
class MovementSystem {
  update(world, delta) {
    const entities = world.query(
      PositionComponent, VelocityComponent
    );

    entities.forEach(id => {
      const pos = world.getComponent(id, PositionComponent);
      const vel = world.getComponent(id, VelocityComponent);
      pos.x += vel.vx * delta;
      pos.y += vel.vy * delta;
    });
  }
}

class RenderSystem {
  update(world) {
    const entities = world.query(
      PositionComponent, RenderComponent
    );
    entities.forEach(id => {
      const pos = world.getComponent(id, PositionComponent);
      const ren = world.getComponent(id, RenderComponent);
      ren.sprite.x = pos.x;
      ren.sprite.y = pos.y;
    });
  }
}

// Use karo
const world = new World();
const symbol = world.createEntity();

world.addComponent(symbol.id, new PositionComponent(100, 200));
world.addComponent(symbol.id, new VelocityComponent(0, 5));
world.addComponent(symbol.id, new RenderComponent(texture));
world.addComponent(symbol.id, new SymbolComponent('cherry', 5));

const systems = [new MovementSystem(), new RenderSystem()];
app.ticker.add(delta => systems.forEach(s => s.update(world, delta)));
// gaming_company tip: ECS advanced hai — gaming_company mein yeh jaante ho toh senior level pe samjhenge!