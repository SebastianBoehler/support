const Discord = require("discord.js");
const client = new Discord.Client();

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

var prefix = "?";
var token = "NTY2MTk4MjA4MzA5NDkzNzY5.XMB0kw.nhHFAEzl-KOG_9dQiELCx2QuVF0";

client.on("ready", () => {
  console.log("Logged in! Server count: ${client.guilds.size}");
  client.user.setGame(`?help / ?new for support`);
});

client.on("guildCreate", (guild) => {
client.user.setGame(`?help / ?new for support`);
    guild.owner.user.send(`Hello! I'm RetailSZN Support Bot!\nThanks for adding me to your guild!\n\nView all of my commands with \`?help\`.\nLearn more about me with \`?about\`.\n\n**About:**I am a simple Discord support ticket bot that aims to provide easy to use mod and support functions for all servers!\n\n\Enjoy! ~RETAILSZN Team\*Need help? Just message us`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: Support`)
    .setColor(0xCF40FA)
    .setDescription(`Hello! I'm the Support Bot, the Discord bot for super cool support ticket stuff and more! Here are my commands:`)
    .addField(`Tickets`, `[${prefix}new]() > Opens up a new ticket and tags the Support Team\n[${prefix}close]() > Closes a ticket that has been resolved or been opened by accident`)
    .addField(`Other`, `[${prefix}help]() > Shows you this help menu your reading\n[${prefix}ping]() > Pings the bot to see how long it takes to react\n[${prefix}about]() > Tells you all about myself`)
    message.channel.send({ embed: embed });
  }

  if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`Hoold on!`).then(m => {
    m.edit(`:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` + (m.createdTimestamp - message.createdTimestamp) + `ms, Discord API heartbeat is ` + Math.round(client.ping) + `ms.`);
    });
}

if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Moderator")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`You already have a ticket open.`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Moderator");
        let role2 = message.guild.roles.find("name", "@everyone");
        let role3 = message.guild.roles.find("name", "Support Bot");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false,
            VIEW_CHANNEL: false,
            READ_MESSAGE_HISTORY: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true
        });
         c.overwritePermissions(role3, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: Your ticket has been created, #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Hey @${message.author.tag} !`, `Please try explain why you opened this ticket with as much detail as possible. Our **Support Team** will be here soon to help.`)
        .setTimestamp();
        c.send({ embed: embed });
        c.setParent(`570592756515340289`);
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);

    message.channel.send(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`-confirm\`. This will time out in 20 seconds and be cancelled.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-confirm', {
        max: 1,
        time: 20000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});

client.login(token);
