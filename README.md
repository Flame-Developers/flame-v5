<div align="center">
  <h1>Flame</h1>
  <p>A multi-purpose Discord-bot with a lot of functionality and abilities written on <a href="https://github.com/discordjs/discord.js">discord.js</a></p>
  
  ![Stars](https://img.shields.io/github/stars/TheFerryn/Flame?color=333&logo=github&style=for-the-badge)
  ![License](https://img.shields.io/github/license/TheFerryn/Flame?color=333&logo=github&style=for-the-badge)
  ![Discord](https://img.shields.io/discord/785088147721027585?color=7289DA&label=Discord&logo=discord&style=for-the-badge)
</div>

## Getting Started
If you have any questions, please ask them at the [support server](https://discord.gg/7FUJPRCsw8). But first of all, try search for an answer in the [documentation](https://docs.flamebot.ru).
### Prerequisites
- **Node.js v14** or higher.
- **MongoDB** database.
- **Redis** server (optional).
- **Java 13** installed to your system (or just a lavalink server).
- **Git command line tools**.

## Installation
1. Clone this repository to your server and navigate to it.
```
$ git clone https://github.com/TheFerryn/Flame && cd Flame
```
2. Install required packages.
```
$ npm install
```
3. Create the `config.json` configuration file. It should look like this (replace data with yours):
```json
{
  "token": "",
  "shards": 1,
  "database": "",
  "emergency": "https://discord.com/api/webhooks/.../.../",
  "lavalink": {
    "name": "Node #1",
    "host": "localhost",
    "port": 5000,
    "auth": "youshallnotpass"
  },
  "cachingEnabled": true,
  "redis": {
    "host": "localhost",
    "port": 6379
  }
}
```
4. Startup the bot! (you can use pm2, screen or other utilities to keep it running in the background):
```
$ node .
```

**Do not forget, that we are not responsible for your bot. We can only help you with code errors — nothing else.**

## Contributing
**All contributions are welcome.** But please, do not open duplicate Pull-requests and use [Conventional Commits](https://www.conventionalcommits.org).

## License
Please notice, that this project is licensed under the [Apache License 2.0](https://github.com/TheFerryn/Flame/blob/main/LICENSE.md). You are able to use code from here for your own purposes, but **you must** provide original author of the code and a link to this repository.
