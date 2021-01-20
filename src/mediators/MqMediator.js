module.exports = function MqMediator({ queue }) {

    const { primary } = queue;

    const { channel } = primary;

    const { mqconfig } = primary;

    async function initializeListeners({ listener }) {
        const { consumer, queue } = listener;

        consume({ queue, callback: consumer });

        return true;
    }

    async function send({ queue, payload }) {
        const _queue = mqconfig.queues[queue];

        channel.assertQueue(_queue, { durable: true });

        channel.sendToQueue(_queue, payload, { persistent: true, contentType: 'application/json' });
    }

    async function consume({ queue, callback }) {
        const _queue = mqconfig.queues[queue];

        channel.assertQueue(_queue, { durable: true });

        channel.prefetch(1);

        channel.consume(_queue, (payload) => {

            try {
                const json = JSON.parse(payload.content.toString());

                callback({ channel, payload, json });
            } catch (ex) {
                callback(channel, payload, { error: ex });
            }

        }, { noAck: false });

    }

    return {
        send,
        consume,
        initializeListeners,
    }
} 