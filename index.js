const config = require('./config');
const axios = require('axios');
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = config.discordToken;
let getCurrentLevel = axios.get('https://environment.data.gov.uk/flood-monitoring/id/stations/2093/readings?latest');
let getHistoricLevel = axios.get('https://environment.data.gov.uk/flood-monitoring/id/stations/2093/readings?today&_sorted');
let status = {
    warn: false,
    date: null
};

let checkHistoricLevel = () => {
    getHistoricLevel.then(res => {
        res.data.items.shift();
        res.data.items.forEach(item => {
            if (item.value >= config.riverHeight) {
                warnFlood(item.value, item.dateTime);
            }
        })
    })
};

let warnFlood = (level, date) => {
    let currentDate = new Date().toDateString();
    let readingDate = new Date(date);
    if (!status.warn || status.date !== currentDate) {
        const embed = {
            "color": 16711680,
            "footer": {
                "text": "This alert is generated based on the current river level."
            },
            "fields": [
                {
                    "name": "Current River Level",
                    "value": level.toString(),
                    "inline": true
                },
                {
                    "name": "Last Updated (today)",
                    "value": readingDate.toTimeString(),
                    "inline": true
                }
            ]
        };
        bot.channels.get(config.discordAlertChannel).send("**StratLAN FLOODING ALERT** \nBe aware that the river level has gone above the flood-height in Stratford-upon-Avon.", { embed });
        status.warn = true;
        status.date = currentDate;
    }
};

bot.login(TOKEN);

bot.on('message', msg => {
    if(msg.content === config.discordCommand){
        getCurrentLevel.then((res) => {
            let readingDate = new Date(res.data.items[0].dateTime);
            if (res.data.items[0].value < config.riverHeight) {
                const embed = {
                    "color": 65280,
                    "footer": {
                        "text": "This alert is generated based on the current river level."
                    },
                    "fields": [
                        {
                            "name": "Current River Level",
                            "value": res.data.items[0].value.toString(),
                            "inline": true
                        },
                        {
                            "name": "Last Updated (today)",
                            "value": readingDate.toTimeString(),
                            "inline": true
                        }
                    ]
                };
                msg.reply("this is the current river levels in Stratford-upon-Avon.", { embed });
            } else {
                warnFlood(res.data.item[0].value, res.data.item[0].dateTime);
            }
        })
    }
});

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    checkHistoricLevel();
    setInterval(() => {
        getCurrentLevel.then(res => {
            if (res.data.items[0].value >= config.riverHeight) {
                warnFlood(res.data.items[0].value, res.data.items[0].dateTime);
            }
        })
    }, config.apiRequestInterval);
});