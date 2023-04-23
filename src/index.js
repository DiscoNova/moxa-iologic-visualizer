#!/usr/bin/env node

import clear from 'clear';
import chalk from 'chalk';

import logDate from './logDate.js';
import logAction from './logAction.js';

import configuration from './config.js';
import Moxa from './moxa.js';

let initializeErrorMessage = undefined;

if (!configuration) {
    initializeErrorMessage = 'No configuration provided?'
} else if (!configuration.ioLogicServers || !configuration.ioLogicServers.length) {
    initializeErrorMessage = 'No ioLogic servers provided?'
}

if (initializeErrorMessage) {
    clear();
    console.error(`${logDate()}${chalk.redBright(initializeErrorMessage)}`);
    console.log(`${logAction()}${chalk.cyan('Exiting.')}`);
    process.exit();
}

const msServerPollInterval =
    configuration.msServerPollInterval &&
    Number.isFinite(configuration.msServerPollInterval) &&
    configuration.msServerPollInterval > 0
        ? configuration.msServerPollInterval
        : 500;

clear();

const ioLogicServers = configuration.ioLogicServers.map(serverConfiguration => new Moxa(serverConfiguration, msServerPollInterval));

const ioLogicServerPoll = () => {
    console.log(`${logAction()}${chalk.greenBright('POLL...')}`);
    ioLogicServers.forEach((ioLogicServer) => {
        console.log(`${logAction()}${chalk.greenBright('=>')}`, ioLogicServer.getStatus());
    });
};

console.log(`${logAction()}${chalk.cyan(`Poll each server every ${msServerPollInterval} milliseconds...`)}`);

setInterval(ioLogicServerPoll, msServerPollInterval * 10); // For debugging 1/10th speed...
