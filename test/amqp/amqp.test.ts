import { getConsumerResult } from "../fixtures/fixture";
import consume from "../../src/amqp/consumer";
consume = jest.fn().mockReturnValue(getConsumerResult());

import amqp, { IAmqpConfig } from '../../src/amqp/amqp';
import * as amqplib from "amqplib";
import { Message } from "amqplib";



//////////////////////////////////////////////////////////////////////
const config: IAmqpConfig = {
  exchangeHost: 'amqp://127.0.0.1',
  exchangeName: 'exchange-test',
  queueName: 'queue-test',
  deadLetterExchangeName: 'deadletter-exchange-test',
  deadLetterQueueName: 'deadletter-queue-test',
};

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////  MOCKS
//Mock the channel methods
const channel: any = {
  consumeCallback: Function,
  assertExchange: jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),
  assertQueue: jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),
  bindQueue: jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),
  prefetch: () => {
    return {};
  },
  consume: jest.fn().mockImplementation((queueName: string, callback: Function) => {
    channel.consumeCallback = callback.bind(amqp);
  }),
  on: jest.fn().mockImplementation(function () {
    return undefined;
  }),
  ack:  jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),
  publish:  jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),
  reject:  jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),
  sendToQueue:  jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),

};

//Mock the connection methods
const connection = {
  callbacks: {},
  createChannel: jest.fn().mockImplementation(function () {
    return Promise.resolve(channel);
  }),
  on: jest.fn().mockImplementation(function (event: string, callback: Function) {
    this.callbacks[event] = callback;
  }),
  emit: jest.fn().mockImplementation(function (event: string) {
    this.callbacks[event] && this.callbacks[event].call(amqp, new Error('My Message'));
  }),
};

//Mock the amqplib.connect
amqplib.connect = jest.fn().mockImplementation(() => {
  return Promise.resolve(connection);
});
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////  TESTS
describe('On init', () => {

  beforeEach(() => {
    return amqp.start(config);
  });

  it("it should connect via aqmp", () => {
    expect.assertions(1);
    const spy = jest.spyOn(amqplib, 'connect');

    return expect(spy).toHaveBeenCalled();
  });

  it("it should be create a channel", () => {
    return expect(connection.createChannel).toHaveBeenCalled();
  });

  it("it should configure the deadletter exchange", () => {
    expect(channel.assertExchange).toHaveBeenCalledWith(config.deadLetterExchangeName, 'topic', {
      durable: true,
      autoDelete: false
    });
    return expect(channel.assertQueue).toHaveBeenCalledWith(config.deadLetterQueueName);
  });

  it("it should configure the main exchange", () => {
    expect(channel.assertExchange).toHaveBeenLastCalledWith(config.exchangeName, 'topic');
    return expect(channel.assertQueue).toHaveBeenLastCalledWith(config.queueName, {
      arguments: {
        'x-dead-letter-exchange': config.deadLetterExchangeName
      }
    });
  });

  it("it should bind queue to the exchange", () => {
    return expect(channel.bindQueue).toHaveBeenCalled();
  });

  it("it should be ready to consume some messages", () => {
    return expect(channel.consume).toHaveBeenCalled();
  });
});


describe('On init,', () => {

  beforeEach(() => {
    return amqp.start(config);
  });

  describe('if the connection closes,', () => {
    it(" it should set the status to error", () => {
      connection.emit('close');
      expect(amqp.statusError).toBe('My Message');
      return expect(amqp.status).toBe('error');
    });
  });

  describe('if the connection has an error,', () => {
    it(" it should set the status to error", () => {
      connection.emit('error');
      expect(amqp.statusError).toBe('My Message');
      return expect(amqp.status).toBe('error');
    });
  });
});

describe('On receiving a message,', () => {

  beforeEach(() => {
    return amqp.start(config);
  });

  it("it should consume it and ack it", async () => {
    console.log(channel.consumeCallback)

    const message: Message = {
      content: new Buffer('{}'),
      fields: '',
      properties: {
      },
    };

    await channel.consumeCallback(message);

    expect(consume).toHaveBeenCalledWith(message);
    expect(channel.ack).toHaveBeenCalledWith(message);
  });


  describe('if the message properties contains replyTo', () => {
    it("it should send back a response and ack it", async () => {
      console.log(channel.consumeCallback)

      const message: Message = {
        content: new Buffer('{}'),
        fields: '',
        properties: {
          replyTo: 'qwerty',
          correlationId: 3,
        },
      };

      await channel.consumeCallback(message);

      expect(channel.ack).toHaveBeenCalledWith(message);
      expect(channel.sendToQueue).toHaveBeenCalledWith(
        'qwerty',
        new Buffer(JSON.stringify(getConsumerResult())),
        {correlationId: 3}
      );
    });
  });

  describe('if consuming a message throws an exception', () => {
    it("it should reject the message", async () => {
      console.log(channel.consumeCallback)

      const message: Message = {
        content: new Buffer('{}'),
        fields: '',
        properties: {
          replyTo: 'qwerty',
          correlationId: 3,
        },
      };

      consume = jest.fn().mockImplementation(() => {throw new Error('OMG')});

      await channel.consumeCallback(message);

      expect(channel.ack).toHaveBeenCalledWith(message);
      expect(channel.reject).toHaveBeenCalledWith(message, false);
    });
  });
});

describe('On publishing a message,', () => {
  it('it should publish the message via the channel', () => {

    const content: any = {
      data: true
    };
    amqp.publishMessage('routingKey1', content);

    expect(channel.publish).toHaveBeenCalledWith(
      "exchange-test",
      "routingKey1",
      new Buffer(JSON.stringify(content)),
      { contentType: 'application/json' },
    );
  });
});