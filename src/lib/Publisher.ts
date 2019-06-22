
/**
 * Mapping from subscription IDs to message handlers and channels
 */
interface ISubscriptions<TMessage> {
  [id: string]: {
    channelId: string;
    onMessage: (message: TMessage) => any;
  }
}

/**
 * Mapping from channel name to a set of subscription IDs
 */
interface IChannels {
  [name: string]: Set<number>;
}

export class Publisher<TMessage> {
  private subscriptionCounter: number;
  private subscriptions: ISubscriptions<TMessage>;
  private channels: IChannels;

  constructor() {
    this.subscriptionCounter = 0;
    this.channels = {};
    this.subscriptions = {};
  }

  public publish(channel: string, message: TMessage): void {
    const channelInternal = this.channels[channel];

    if (!channelInternal) {
      return;
    }

    channelInternal.forEach(subscriptionId => {
      const subscription = this.subscriptions[subscriptionId];

      if (subscription) {
        subscription.onMessage(message);
      }
    });
  }

  public subscribe(channelId: string, onMessage: (message: TMessage) => any): number {
    const subscriptionId = this.subscriptionCounter;

    if (!this.channels[channelId]) {
      this.channels[channelId] = new Set<number>();
    }

    this.channels[channelId].add(subscriptionId);
    this.subscriptions[subscriptionId] = { channelId, onMessage };
    this.subscriptionCounter += 1;

    return subscriptionId;
  }

  public unsubscribe(subscriptionId: number) {
    const subscription = this.subscriptions[subscriptionId];

    if (!subscription) {
      return;
    }

    this.channels[subscription.channelId].delete(subscriptionId);
    delete this.subscriptions[subscriptionId];
  }
}
