import * as THREE from "three";

import EventEmitter from './EventEmitter.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// For the list of assets to load, we are going to use an array. Each resource in the array will be defined by an object composed of the following properties:

//     name: which will be used to retrieve the loaded resources.
//     type: in order to know what loader to use.
//     path: the path(s) of the file(s) to load.

// For a bigger project, this array might get a bit fat, which is why it's preferable to have it in a separate file.

export default class Resources extends EventEmitter{
    constructor(sources){
        super();

        // options
        this.sources = sources;

        // console.log(this.sources);

        // setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading(){
      for(const source of this.sources){
        if(source.type === 'gltfModel'){
          this.loaders.gltfLoader.load(
            source.path,
            (file) =>{
              this.sourceLoaded(source, file);
            }
          )
        }
        else if(source.type === 'texture'){
          this.loaders.textureLoader.load(
              source.path,
              (file) =>{
                this.sourceLoaded(source, file);
              }
          )
        }
        else if(source.type === 'cubeTexture'){
          this.loaders.cubeTextureLoader.load(
              source.path,
              (file) =>{
                this.sourceLoaded(source, file);
              }
          )
        }
      }
    }

    sourceLoaded(source, file){
      this.items[source.name] = file

      this.loaded++

      if(this.loaded === this.toLoad){
        this.trigger('ready')
      }
    }
}