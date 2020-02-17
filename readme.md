# StratLAN Flooding Alert Bot for Discord

This is a super-simple Discord Bot written in Node.JS and requires only two dependencies.

## Getting Started
Self-hosted:
1. Create a Bot on the Discord Developers website (guide [here](https://discordapp.com/developers/docs/topics/oauth2#bots)).
2. Clone this repo in to a place you wish to host the Bot.
3. `cd` in to the directory and run `npm install` - this will install all the required dependencies.
4. Edit the config file (mainly the `discordToken` and `discordAlertChannel` values).
5. We're ready to go. Run the command `npm start`.

Hosted:
1. Click the [here](https://discordapp.com/oauth2/authorize?client_id=678604701117448233&scope=bot&permissions=248896) to add the bot to your server.
2. Done. That's literally it.

## Config File
A break-down and explanation of what each value in the config file relates to.
* `discordToken: ''` - The Bot token provided by Discord.
* `discordAlertChannel: ''` - The channel ID which the Bot will send the flood-monitor alerts to.
* `discordCommand: '!slanriver'` - The command the Bot listens for, default is `!slanriver`.
* `riverHeight: 1.690` - The river height in metres at which flooding occurs (value provided by Gov.UK - not recommended to change).
* `apiRequestInterval: 900000` - Interval between checks for a new river height reading (value provided by Gov.UK - not recommended to change).