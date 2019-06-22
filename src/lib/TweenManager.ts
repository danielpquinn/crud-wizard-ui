
import { Tween } from "src/lib/Tween";

/** Singleton for managing a list of tweens. */

class TweenManager {

  /** List of active tweens */
  private tweens: Tween[];

  /** Keep track of when the last step began */
  private lastStepStart: number;

  /** True if there are active tweens */
  private stepping: boolean;

  constructor() {
    this.tweens = [];
    this.stepping = false;
    
    this.step = this.step.bind(this);
  }

  /** Add tween */

  public addTween (ob: any, prop: string, to: number, options?: {
    delay?: number;
    duration?: number;
    onStep?: (instance: Tween) => any;
    onFinish?: (instance: Tween) => any;
    ease?: "InOutQuad" | "InQuad" | "OutQuad"
  }): Tween {
    options = options || {};
    const tween = new Tween(ob, prop, to, {
      duration: options.duration,
      onStep: options.onStep,
      onFinish: options.onFinish,
      ease: options.ease
    });

    // Remove tween when complete

    const removeTween = (innerTween: Tween) => {
      this.tweens.splice(this.tweens.indexOf(innerTween), 1);
    };

    // If already tweening this object and property, remove previous tween

    const existingTween = this.tweens.find((innerTween) => {
      return innerTween.ob === ob && innerTween.prop === prop;
    });
    
    if (existingTween !== undefined) {
      removeTween(existingTween);
    }

    tween.promise.then(removeTween);
    
    setTimeout(() => {

      this.tweens.push(tween);

      // Step if necessary

      if (!this.stepping) {
        this.lastStepStart = Date.now();
        this.stepping = true;
        this.step();;
      }
    }, options.delay || 0);
    
    return tween;
  }

  /** Loop through tweens, adavance each one. If no tweens set stepping false */

  private step () {
    const took = Date.now() - this.lastStepStart;
    this.lastStepStart = Date.now();
    this.tweens.forEach((tween) => {
      tween.step(took);
    });
    
    // If there are still tweens in the queue, take another step, else stop
    
    if (this.tweens.length > 0) {
      setTimeout(this.step, Math.max(16 - took, 0));
    } else {
      this.stepping = false;
    }
  }
}

let instance: TweenManager;

export const getTweenManager = () => {
  if (!instance) {
    instance = new TweenManager();
  }
  return instance;
}
