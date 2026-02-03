import * as PIXI from "./pixi.js";
import {UI} from "./UI.js";

export default class Game {
    constructor() {
        document.body.style.margin = "0px";
        document.body.style.padding = "0px";
        document.body.style.overflow = "hidden";

        this.app = new PIXI.Application({
            background: "#1099bb",
            resizeTo: window
        })

        document.body.appendChild(this.app.view);
        this.keys = {};
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyup.bind(this));
        this.init();
    }

    onKeyDown(e) {
        this.keys[e.code] = true;
    }

    onKeyup(e) {
        this.keys[e.code] = false;
    }

    async init() {
        // alert("GAME LOADED");
        PIXI.Assets.addBundle('level-1', {
            bunny: "https://pixijs.com/assets/bunny.png",
            fighter: "https://pixijs.com/assets/spritesheet/fighter.json",
            sky: "assets/space.jpg",
            desyrel: "https://pixijs.com/assets/bitmap-font/desyrel.xml"
        })

        const assets = await PIXI.Assets.loadBundle('level-1');
        this.createBackground(assets.sky);
        this.bunny = new PIXI.Sprite(assets.bunny);
        this.bunny.x = this.app.screen.width / 2;
        this.bunny.y = this.app.screen.height / 5;
        this.bunny.scale.set(2.5);
        this.bunny.anchor.set(0.5);
        this.bunny.eventMode = "static";
        this.bunny.cursor = "pointer";
        // this.app.stage.addChild(this.bunny);

        this.ui = new UI();
        this.app.stage.addChild(this.ui);
        this.createFighter(assets.fighter);

        this.bunny.on("pointerdown", () => {
            this.ui.addScore();
        })

        this.app.ticker.add(this.update.bind(this));
    }

    update(delta) {
        // this.bunny.rotation += 0.1 * delta;
        this.bg.tilePosition.y += 2 * delta;
        const speed = 5;
        if (this.keys["ArrowUp"] || this.keys["KeyW"]) {
            this.fighter.y -= speed * delta;
        }
        if (this.keys["ArrowDown"] || this.keys["KeyS"]) {
            this.fighter.y += speed * delta;
        }
        if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
            this.fighter.x -= speed * delta;
        }
        if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
            this.fighter.x += speed * delta;
        }

        if (this.fighter.x < this.fighter.width / 2) {
            this.fighter.x = this.fighter.width / 2;
        }

        if (this.fighter.x > this.app.screen.width - this.fighter.width / 2) {
            this.fighter.x = this.app.screen.width - this.fighter.width / 2;
        }
    }

    createFighter(sheet) {
        const textures = [];
        for (let i = 0;i < 30;i++) {
            const val = i < 10 ? `000${i}` : `00${i}`;
            const frameName = `rollSequence${val}.png`;
            console.log(frameName);
            const texture = sheet.textures[frameName];
            textures.push(texture);
        }

        this.fighter = new PIXI.AnimatedSprite(textures);
        this.fighter.x = this.app.screen.width / 2;
        this.fighter.y = this.app.screen.height / 2;
        this.fighter.anchor.set(0.5);
        this.fighter.eventMode = "static";
        this.fighter.cursor = "pointer";
        this.app.stage.addChild(this.fighter);
        this.fighter.animationSpeed = 0.5;
        this.fighter.play();
    }

    createBackground(texture) {
        this.bg = new PIXI.TilingSprite(texture, this.app.screen.width, this.app.screen.height);
        this.app.stage.addChild(this.bg);
    }
}
