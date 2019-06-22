
/** Tweens a numeric property of some object from one value to another */

export class Tween {

  /** Promise to be resolved when tween completes */
  public promise: Promise<Tween>;
  
  /** Object who's property we will be tweening */
  public ob: any;
  
  /** Key for property that we will be animating */
  public prop: string;

  /** Reference to resolver function for access within methods */
  private resolve: (instance: Tween) => any;
  
  /** Starting value */
  private from: any;
  
  /** Ending value */
  private to: any;
  
  /** Current value */
  private current: number;
  
  /** If provided with a string, parse out unit */
  private unit: string;
  
  /** Duration of the animation */
  private duration: number;
  
  /** Function called for every step of the tween */
  private onStep: (instance: Tween) => any | undefined;
  
  /** Function called when tween is finished */
  private onFinish: (instance: Tween) => any | undefined;
  
  /** Difference in start and end values */
  private change: number;
  
  /** Amount of time that has elapsed so far */
  private elapsedTime: number;
  
  /** Which ease to use */
  private ease: string;

  // For now we only need 'to' behavior.

  constructor(ob: any, prop: string, to: number, options?: {
    duration?: number;
    onStep?: (instance: Tween) => any;
    onFinish?: (instance: Tween) => any;
    ease?: "InOutQuad" | "InQuad" | "OutQuad"
  }) {
    options = options || {};
    this.ob = ob;
    this.prop = prop;
    this.from = ob[prop];
    this.to = to;
    this.duration = options.duration || 200;
    this.onStep = options.onStep as (instance: Tween) => any;
    this.onFinish = options.onFinish as (instance: Tween) => any;
    this.elapsedTime = 0;
    this.ease = options.ease || "InOutQuad";

    // Parse arguments

    if (typeof this.from === "string") {
      const unitMatch = this.from.match(/\D+$/);
      if (unitMatch !== null) {
        this.unit = unitMatch[0];
      }
      this.from = parseFloat(this.from);
      this.to = parseFloat(this.to);
    }

    this.change = this.to - this.from;    
    this.current = this.from;

    // Create a new promise to be resolved when tween is finished

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  /** Easing functions: http://gizma.com/easing/ */

  public InQuad(t: number, f: number, c: number, d: number) {
    t /= d;
    return c * t * t + f;
  }

  public OutQuad(t: number, f: number, c: number, d: number) {
    t /= d;
	  return -c * t * (t - 2) + f;
  }

  public InOutQuad(t: number, f: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) { return c / 2 * t * t + f; }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + f;
  }

  /** Advance one frame */

  public step (time: number) {
    this.elapsedTime += time;
    this.current = this[this.ease](this.elapsedTime, this.from, this.change, this.duration);
    this.ob[this.prop] = this.unit ? this.current + this.unit : this.current;
    if (this.elapsedTime >= this.duration) {
      this.ob[this.prop] = this.unit ? this.to + this.unit : this.to;
      if (this.onFinish) { this.onFinish(this); }
      this.resolve(this);
    }
    
    if (this.onStep) { this.onStep(this); }
  }
}
