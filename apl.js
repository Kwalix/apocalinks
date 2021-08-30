const yargs = require('yargs');
const path = require('path');
const chalk = require('chalk');
const baseUrl = require('./baseUrl');
const { appendFileSync, readFileSync } = require('fs');
const emojis = require('node-emoji');
const clipboardy = require('clipboardy');
const validator = require('validator');


 /* yargs.scriptName("apl"); */

const txtFilePath = path.join(__dirname, 'links.txt');


yargs.command('add', 'page to store, ex: statistic-2020', {
    page: {
        type: 'string',
        demandOption: true,
        describe: 'Add page'
    },
    source: {
        type: 'string',
        demandOption: true,
        describe: 'Add source'
    },
    medium: {
        type: 'string',
        demandOption: false,
        describe: 'Add medium'
    },
    campaign: {
        type: 'string',
        demandOption: false,
        describe: 'Add campaign'
    }
}, argv => {
    const { page, source, medium, campaign} = argv;
    const link = `${baseUrl}${page}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;

    try {
        if (!validator.isURL(link)) {
            throw new Error('Source URL is not valid, please check and retry');
        }
    } catch (error) {
        console.log(chalk.redBright(error.message));
    }

    appendFileSync(txtFilePath, `${link}\n`);
    clipboardy.writeSync(link);

    console.log(chalk.green(emojis.emojify('Link saved and copied to clipboard ! :chains: :point_down: \n' + link)));
}).argv;


yargs.command('list', 'list all stored links', (argv) => {
    const links = [...readFileSync(txtFilePath).toString().split(/\n/)];
    for (const i in links) {
        console.log(`${emojis.emojify(':star:')}: ${links[i]}`);
    }
}).argv;