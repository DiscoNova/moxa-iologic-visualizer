import fetch from 'node-fetch';
import logDate from './logDate.js';
import chalk from 'chalk';

import quickFetch from './quickFetch.js';

class Moxa {
    isAvailable = undefined;
    serverLabel = undefined;
    serverAddress = '127.0.0.1'
    serverSecure = false;
    serverText = '';
    msPollInterval = undefined;
    sysInfo = undefined;
    constructor (serverConfiguration, msPollInterval) {
        this.msPollInterval = msPollInterval; // Once the server is available...
        this.serverAddress = serverConfiguration.address;
        this.serverSecure = serverConfiguration.secure;
        this.serverLabel = serverConfiguration.label;
        this.serverText = `Moxa @ ${this.serverAddress}`;
        if (this.serverLabel) {
            this.serverText = `${this.serverText} (${this.serverLabel})`;
        }
        console.log(`${logDate()}${this.selfText()} configured; is the server responding?`);
        this.checkServer(); // Might eventually set this.isAvailable to truthy value
    };

    selfText = () => chalk.yellowBright(this.serverText);
    checkServer = async () => {
        const oldAvailable = this.isAvailable;
        // When this method needs to be called, we must assume that we don't know and thus it must be "falsy" initially
        this.isAvailable = undefined;
        console.log(`${logDate()}${this.selfText()} ${chalk.cyan('Checking whether the server is responding')}`);
        const apiEndpoint = `http${this.serverSecure ? 's' : ''}://${this.serverAddress}/api/slot/0/sysInfo`;
        // Note: There are supposedly slots other than "0", but ... frankly, I've never seen any in practice?
        const urlCheck = `${chalk.cyan('Check response from')} ${apiEndpoint}`;
        console.log(`${logDate()}${this.selfText()} ${urlCheck}`);
        try {
            console.log(`${logDate()}${this.selfText()} Requesting ${apiEndpoint}`);
            const rawData = await quickFetch(apiEndpoint, { timeout: 5000 });
            const jsonData = await rawData.json();
            if (!jsonData) { throw new Error('No JSON data received.'); }
            if (!jsonData.sysInfo) { throw new Error('No SysInfo received in JSON data.'); }
            this.sysInfo = jsonData.sysInfo;
            if (!this.sysInfo.device || !this.sysInfo.device.length) { throw new Error('No device information included in the SysInfo received from JSON data.'); }
            console.log(`${logDate()}${this.selfText()} ${chalk.cyan('Moxa ioLogic Server')} => `, JSON.stringify(this.sysInfo.device[0], null, 2));
            this.isAvailable = true;
        } catch (theError) {
            if (theError.type && theError.type === 'aborted') {
                console.log(`${logDate()}${this.selfText()} did not respond to SysInfo request for ${apiEndpoint}. Assuming ${this.selfText()} is currently unavailable.`);
                this.isAvailable = undefined
            } else {
                console.log(`${logDate()}${this.selfText()} error while requesting SysInfo for ${apiEndpoint}. Assuming ${this.selfText()} is currently unavailable. ${chalk.red(JSON.stringify(theError, null, 2))}`);
                this.isAvailable = oldAvailable;
            }
        }
    };

    getStatus = () => {
        // TODO: Return current (formatted) status of all ports
    };
}

export default Moxa;
