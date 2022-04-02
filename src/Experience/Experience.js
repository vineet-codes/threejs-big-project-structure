import * as THREE from "three";

import Camera from "./Camera";
import Renderer from "./Renderer";

import World from "./World/World";

import Resources from './Utils/Resources.js'
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Debug from "./Utils/Debug";

import sources from './sources.js';


let instance = null;

export default class Experience {

  constructor(options){
    window.experience = this;

    // Singleton
    if(instance){
      return instance;
    }
    instance = this;

    // Options
    this.canvas = options.dom;

    // setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Events

    // browser resize event
    this.sizes.on('resize', () => {
      this.resize();
    })
    // Time tick event
    this.time.on('tick', ()=> {
      this.update();
    })
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update(){
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy(){
    this.sizes.off('resize');
    this.time.off('tick');

    // traverse the whole scene
    this.scene.traverse(child => {

      if(child instanceof THREE.Mesh){
        child.geometry.dispose();

        // loop through the material properties
        for(const key in child.material){
          const value = child.material[key];

          // Test if there is a dispose function
          if( value && typeof value.dispose == 'function'){
            value.dispose();
          }
        }
      }
    })

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if(this.debug.active){
      this.debug.ui.destroy();
    }
  }
}