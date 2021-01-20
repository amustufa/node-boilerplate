module.exports = function BootstrapMediator(opts) {

    const {
        mqMediator,
        utility,
        config,
        logger,
    } = opts;

    const { asyncForEach } = utility;

    const listeners = config.get('queues:consumers');

    const initMqListeners = async () => {
        
        logger.info('[\u2713] Initializing Queue Listeners >');

        await asyncForEach(listeners, (listener) => {
            const _listener = opts[listener];

            if (_listener) {
                await mqMediator.initializeListeners({ listener: _listener });
            }

        });

        logger.info('[\u2713] Queue Listeners Initialized >');

        return true;
    }

    async function initialize() {
        await initMqListeners();

        return true;
    }

    return {
        initialize,
    }
}