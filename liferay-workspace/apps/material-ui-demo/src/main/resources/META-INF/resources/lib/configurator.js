class Configurator {
    setConfig(config) {
        this._config = config;
    }

    getConfig() {
        return Object.assign({}, this._config);
    }
}

const configurator = new Configurator();

export default configurator;
