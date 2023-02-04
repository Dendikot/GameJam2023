import 'phaser';

import {config} from "./objects/config"

const gameWidth = 800;
const gameHeight = 500;
const infoHeight = 30;
const debugTextAreaHeight = 0;
const margin = 10;



export const game = new Phaser.Game(config);
