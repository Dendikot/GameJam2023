import 'phaser'
import './styles/main.scss'
import spidy from './assets/spidy.png'

import {ExtPoint} from "../objects/ext-point";
//import spider from "../assets/spidy.png"

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

let test = new ExtPoint();

test.testMethod();

let test2 = test.createWithCoordinates(2,5);

function preload ()
{
    //this.load.image("spider", spider);

    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
    
}

function create ()
{
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    /*let spidey = this.physics.add.image(200,200, "spider");
    spidey.setVelocity(100, 200);
    spidey.setBounce(1, 1);
    spidey.setCollideWorldBounds(true);*/

    emitter.startFollow(logo);
}

console.log("hello");

// add spidey
// check project hierarchy
// create basic architecture - basic game loop way
// check out phaser projects
// put it to the git
// install on rue side
// 