module.exports = function IncomingDataListener(opts) {

    const {
        mdDataHandler,
    } = opts;

    async function consume({ channel, message, payload }) {
        //ACK channel message to free consumer
        channel.ack(message);

        try {
            const save = await mdDataHandler.saveData({ payload });

            console.log('IncomingDataListener > consume > save > success ', save);

        } catch (ex) {
            console.error(`IncomingDataListener > consume > Error >`, ex);
        } 
    }

    return {
        consume,
        queue: 'x_boilerplate_request'
    }
}