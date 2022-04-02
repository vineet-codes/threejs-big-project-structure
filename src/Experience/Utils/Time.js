import EventEmitter from './EventEmitter'


// very useful class is the one handling the time. This class will work a bit like the Clock class of Three.js.

// `start` will contain the timestamp when the experience starts and will stay the same.
// `current` will contain the current timestamp and will change on each frame.
// `elapsed` will contain how much time was spent since the start of the experience.
// `delta` will contain how much time was spent since the previous frame. We set it as 16 by default which is close to how many milliseconds 
// there is between two frames at 60fps.

// The class will also trigger an event on each frame so that we can listen to that event and update the whole experience.

export default class Time extends EventEmitter {

  constructor(){
    super();

    // setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick();
    })
  }

  tick() {
    console.log('tick');
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger('tick');

    window.requestAnimationFrame(()=>{
      this.tick();
    });
  };
}