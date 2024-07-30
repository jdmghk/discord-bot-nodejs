require('dotenv').config();


const { Client, WebhookClient } = require('discord.js');
const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN,
)

const PREFIX = "$";

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    console.log(`[${message.author.tag}]: ${message.content}`);
    if (message.content === 'Hello') {
        const greetings = ['Hello there!', 'Hey there!', 'Hi!', 'Howdy!', "What's up?", "hello", "Hello", "How far"];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        message.channel.send(randomGreeting);
    }
    if (message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        
        if (CMD_NAME === 'kick'){ 
            if (message.member.hasPermission('KICK_MEMBERS'))
                return message.reply('You do not have permissions to use that command');
            if (args.length === 0) return message.reply('Please provide an ID');
            const member = message.guild.members.cache.get(args[0]);
            if (member) {
                member
                    .kick()
                    .then((member) => message.send(`${member} was kicked.`))
                    .catch((err) => message.channel.send(`I cannot kick this user :( `));
            }else{
                message.channel.send('That member was not found');
            }
        } else if (CMD_NAME === 'ban'){ 
            if (!message.member.hasPermission('BAN_MEMBERS'))
                return message.reply('You do not have permissions to use that command');
            if (args.length === 0) return message.reply('Please provide an ID');

            try{
                const user = await message.guild.members.ban(args[0]);
                message.channel.send('User was banned successfully');
            } catch (err) {
                message.channel.send('An error occured. Either I do not have permissions or the user was not found');
            }    
        }   else if (CMD_NAME === 'announcee'){
            console.log(args);
            const msg = args.join(' ');
            console.log(msg);
            WebhookClient.send(msg);
        }
    }
});


client.on('messageReactionAdd', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id)
    if (reaction.message.id === '1267952027636338730') {
        switch (name) {
            case '🍎':
                member.roles.add('1267951519173705898');
                break;
            case '🍌':
                member.roles.add('1267956720186036355');
                break;
            case '🍇':
                member.roles.add('1267956537230364672');
                break;
            case '🍑':
                member.roles.add('1267956836087369771');
                break;
        }
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id)
    if (reaction.message.id === '1267952027636338730') {
        switch (name) {
            case '🍎':
                member.roles.remove('1267951519173705898');
                break;
            case '🍌':
                member.roles.remove('1267956720186036355');
                break;
            case '🍇':
                member.roles.remove('1267956537230364672');
                break;
            case '🍑':
                member.roles.remove('1267956836087369771');
                break;
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);