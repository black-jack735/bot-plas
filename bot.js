//=============================== - [ Consts ] - ===================================

const Discord = require("discord.js");
const client = new Discord.Client();
const cmd = require("node-cmd");
const http = require("http");
const express = require("express");
const app = express();
const ms = require("ms");
const fs = require("fs");
const moment = require("moment");
const request = require("request");
const dateFormat = require("dateformat");
const r1 = require("snekfetch");
const jimp = require("jimp");
const child_process = require("child_process");
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PROT);
setInterval(() => {
  http.get(`http://tonybahez.glitch.me/`);
}, 280000);
let developers = ["647089057184088066"];
const admin = "a!";
const prefix = "a!";

//=============================== - [ Bot ] - ===================================

client.on("ready", () => {
  client.user.setActivity(
    `Type: ${PREFIX}help | ${client.guilds.cache.size} Server,Users ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}   `,
    {
      type: "PLAYING"
    }
  ); ////////////////
  client.user.setStatus("ONLINE");
});

client.on("message", async message => {
  if (message.author.id !== "647089057184088066") return;
  if (message.content === admin + "restart") {
    await cmd.run("refresh");
    await message.channel.send("Done,");
  }
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.split(" ")[0].toLowerCase() === prefix + "1") {
    if (!message.channel.guild) return;

    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message
        .reply("You Need ADMINISTRATOR Permission")
        .then(message => message.delete(5000));
    message.channel
      .overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false
      })
      .then(() => {
        const e = new Discord.RichEmbed()
          .setAuthor(
            "__***✅🗝بەسەرکەوتویی داخرا***__" + message.author.username
          )
          .setColor("#36393e");

        message.channel.send(e);
      });
  }
  if (message.content.split(" ")[0].toLowerCase() === prefix + "2") {
    if (!message.channel.guild) return;

    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message
        .reply("You Need ADMINISTRATOR Permission")
        .then(message => message.delete(5000));
    message.channel
      .overwritePermissions(message.guild.id, {
        SEND_MESSAGES: true
      })
      .then(() => {
        const e = new Discord.RichEmbed()
          .setAuthor("__***بەسەرکەوتویی کرایەوە***__" + message.author.username)
          .setColor("#36393e");

        message.channel.send(e);
      });
  }
});

client.on("message", message => {
  if (message.content.split(" ")[0].toLowerCase() === prefix + "0") {
    const word = message.content;
    const number = word.slice(7, word.length);
    const int = Number(number);
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send(
        "i need to be given Manage Messages permissions to use this command "
      );
    }
    if (int >= 101) {
      return message.channel.send(
        "The max number of messages you can delete is 100"
      );
    }
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send(
        "Looks like you dont have the permissions to do that"
      );
    }
    if (int == "") {
      return message.channel.send("supply A Number to Delete");
    } else if (isNaN(int)) {
      return message.reply("Must be a number");
    }
    message.channel.bulkDelete(int).then(() => {
      return message.channel
        .send(`Cleared ${int} messages.`)
        .then(m => m.delete(5000));
    });
  }
});
// ------------ = [Voice Commands] = ------------

//=============================== - [ Security ] - ===================================

var config = {
  events: [
    {
      type: "CHANNEL_CREATE",
      logType: "CHANNEL_CREATE",
      limit: 1,
      delay: 5000
    },
    {
      type: "CHANNEL_DELETE",
      logType: "CHANNEL_DELETE",
      limit: 1,
      delay: 5000
    },
    {
      type: "GUILD_MEMBER_REMOVE",
      logType: "MEMBER_KICK",
      limit: 1,
      delay: 5000
    },
    { type: "GUILD_BAN_ADD", logType: "MEMBER_BAN_ADD", limit: 1, delay: 5000 },
    {
      type: "GUILD_ROLE_CREATE",
      logType: "ROLE_CREATE",
      limit: 1,
      delay: 5000
    },
    { type: "GUILD_ROLE_DELETE", logType: "ROLE_DELETE", limit: 1, delay: 5000 }
  ]
};
client.on("error", e => console.error(e));
client.on("raw", packet => {
  let { t, d } = packet,
    type = t,
    { guild_id } = (d = d || {});
  if (type === "READY") {
    client.startedTimestamp = new Date().getTime();
    client.captures = [];
  }
  let event = config.events.find(anEvent => anEvent.type === type);
  if (!event) return;
  let guild = client.guilds.get(guild_id);
  if (!guild) return;
  guild
    .fetchAuditLogs({ limit: 1, type: event.logType })
    .then(eventAudit => {
      let eventLog = eventAudit.entries.first();
      if (!eventLog) return;
      let executor = eventLog.executor;
      guild
        .fetchAuditLogs({ type: event.logType, user: executor })
        .then((userAudit, index) => {
          let uses = 0;
          userAudit.entries.map(entry => {
            if (
              entry.createdTimestamp > client.startedTimestamp &&
              !client.captures.includes(index)
            )
              uses += 1;
          });
          setTimeout(() => {
            client.captures[index] = index;
          }, event.delay || 2000);
          if (uses >= event.limit) {
            client.emit("reachLimit", {
              user: userAudit.entries.first().executor,
              member: guild.members.get(executor.id),
              guild: guild,
              type: event.type
            });
          }
        })
        .catch(console.error);
    })
    .catch(console.error);
});

client.on("reachLimit", limit => {
  let log = limit.guild.channels.find(channel => channel.name === "logs");
  const loghack = new Discord.RichEmbed()
    .setAuthor(`${limit.user.tag}`, limit.user.avatarURL)
    .setColor("#36393e")
    .setDescription(
      ` ${limit.user.username}  ___*** ئەم کەسە هەوڵی داوە دەستکاری سێرڤەر بکات سەیری بەشی لۆگ بکا تاکو بزانیت چی کردوە***___  `
    )
    .setTimestamp();
  log.send(loghack);
  limit.guild.owner.send(
    limit.user.username +
      "___** ئەم کەسە هەوڵی داوە دەستکاری سێرڤەر بکات سەیری بەشی لۆگ بکە بزانە چی کردوە**___"
  );
  limit.member.roles.map(role => {
    limit.member.removeRole(role.id).catch(log.send);
  });
});

//=============================== - [ log ] - ===================================

client.on("guildCreate", guild => {
  var gimg;
  var gname;
  var gmemb;
  var groles;

  gname = guild.name;
  gimg = guild.iconURL;
  gmemb = guild.members.size;
  groles = guild.roles.map(r => {
    return r.name;
  });
  let channel = client.channels.get("711860003937714176");
  if (!channel) return;
  const e = new Discord.RichEmbed()
    .setColor("#36393e")
    .addField("Bot Joined Guild : ", `${guild.name}`)
    .addField("Guild id : ", `${guild.id}`)
    .addField("Guild UserCount : ", (gmemb = guild.members.size))
    .addField("Guild Owner : ", guild.owner)
    .setThumbnail(gimg)
    .setTimestamp();
  channel.send(e);
});
client.on("guildDelete", guild => {
  var gimg;
  var gname;
  var gmemb;
  var groles;

  gname = guild.name;
  gimg = guild.iconURL;
  gmemb = guild.members.size;
  groles = guild.roles.map(r => {
    return r.name;
  });
  let channel = client.channels.get("711860003937714176");
  if (!channel) return;
  const e = new Discord.RichEmbed()
    .setColor("#36393e")
    .addField("Bot Left Guild : ", `${guild.name}`)
    .addField("Guild id : ", `${guild.id}`)
    .addField("Guild UserCount : ", (gmemb = guild.members.size))
    .addField("Guild Owner : ", guild.owner)
    .setThumbnail(gimg)
    .setTimestamp();
  channel.send(e);
});

client.on("voiceStateUpdate", (oldM, newM) => {
  let m1 = oldM.serverMute;
  let m2 = newM.serverMute;
  let d1 = oldM.serverDeaf;
  let d2 = newM.serverDeaf;

  let ch = oldM.guild.channels.find("name", "logs");
  if (!ch) return;

  oldM.guild.fetchAuditLogs().then(logs => {
    let user = logs.entries.first().executor.username;

    if (m1 === false && m2 === true) {
      let embed = new Discord.RichEmbed()
        .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
        .setDescription(` ${user} میوتی فۆیس کرا     ${newM} `)
        .setColor("#36393e")
        .setTimestamp();
      ch.send(embed);
    }
    if (m1 === true && m2 === false) {
      let embed = new Discord.RichEmbed()
        .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
        .setDescription(` ${user}  میوتی ڤۆیسی کرایەوە  ${newM} `)
        .setColor("#36393e")
        .setTimestamp();
      ch.send(embed);
    }
    if (d1 === false && d2 === true) {
      let embed = new Discord.RichEmbed()
        .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
        .setDescription(` ${user}  دیفێندی ڤۆیس کرا    ${newM}`)
        .setColor("#36393e")
        .setTimestamp();

      ch.send(embed);
    }
    if (d1 === true && d2 === false) {
      let embed = new Discord.RichEmbed()
        .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
        .setDescription(` ${user}   دیڤێندی ڤۆیسی لابرا   ${newM}`)
        .setColor("#36393e")
        .setTimestamp();

      ch.send(embed);
    }
  });
});

client.on("messageUpdate", (message, newMessage) => {
  if (message.content === newMessage.content) return;
  if (
    !message ||
    !message.id ||
    !message.content ||
    !message.guild ||
    message.author.bot
  )
    return;
  const channel = message.guild.channels.find("name", "logs");
  if (!channel) return;

  let embed = new Discord.RichEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURL)
    .setTitle(" دەسکاری کردنی مەسج  :  ")
    .addField("پێش دەسکاری کردن ", `${message.cleanContent}`)
    .addField(" دوای دەسکاری کردن   ", `${newMessage.cleanContent}`)
    .addField("  لەچەناڵی  ", `<#${message.channel.id}>`)
    .addField("  لەلایەن ", `<@${message.author.id}> `)
    .setColor("#36393e")
    .setTimestamp();
  channel.send({ embed: embed });
});

client.on("guildMemberAdd", member => {
  if (!member || !member.id || !member.guild) return;
  const guild = member.guild;

  const channel = member.guild.channels.find("name", "logs");
  if (!channel) return;
  let memberavatar = member.user.avatarURL;
  const fromNow = moment(member.user.createdTimestamp).fromNow();
  const isNew = new Date() - member.user.createdTimestamp < 900000 ? "🆕" : "";

  let embed = new Discord.RichEmbed()
    .setAuthor(`${member.user.tag}`, member.user.avatarURL)
    .setColor("#36393e")
    .setDescription(` <@${member.user.id}> هاتە ناو سێرڤەر `)
    .setTimestamp();
  channel.send({ embed: embed });
});

client.on("guildMemberRemove", member => {
  if (!member || !member.id || !member.guild) return;
  const guild = member.guild;

  const channel = member.guild.channels.find("name", "logs");
  if (!channel) return;
  let memberavatar = member.user.avatarURL;
  const fromNow = moment(member.joinedTimestamp).fromNow();

  let embed = new Discord.RichEmbed()
    .setAuthor(`${member.user.tag}`, member.user.avatarURL)
    .setColor("#36393e")
    .setDescription(` <@${member.user.id}>  دەرچو لە سێرڤەر  `)
    .setTimestamp();
  channel.send({ embed: embed });
});

client.on("messageDelete", message => {
  if (
    !message ||
    !message.id ||
    !message.content ||
    !message.guild ||
    message.author.bot
  )
    return;
  const channel = message.guild.channels.find("name", "logs");
  if (!channel) return;

  let embed = new Discord.RichEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURL)
    .setTitle("سڕینەوەی نامە  :   ")
    .addField(" نامە  ", `${message.cleanContent}`)
    .addField("   لە چەناڵی  ", `<#${message.channel.id}>`)
    .addField("  لەلایەن ", `<@${message.author.id}> `)
    .setColor("#36393e")
    .setTimestamp();
  channel.send({ embed: embed });
});

client.on("roleDelete", role => {
  client.setTimeout(() => {
    role.guild
      .fetchAuditLogs({
        limit: 1,
        type: 30
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username);
        try {
          let log = role.guild.channels.find("name", "logs");
          if (!log) return;
          let embed = new Discord.RichEmbed()
            .setColor("#36393e")
            .setTitle("سڕینەوەی ڕۆڵ ")
            .addField(" ناوی ڕۆڵی سڕاوە   ", role.name, true)
            .addField("  ئایدی ڕۆڵ ", role.id, true)
            .addField(" ڕەنگی ڕۆڵ  ", role.hexColor, true)
            .addField(" لەلایەن ", exec, true)
            .setColor("#36393e")
            .setTimestamp();

          log.send(embed).catch(e => {
            console.log(e);
          });
        } catch (e) {
          console.log(e);
        }
      });
  }, 1000);
});

client.on("roleCreate", role => {
  client.setTimeout(() => {
    role.guild
      .fetchAuditLogs({
        limit: 1,
        type: 30
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username);
        try {
          let log = role.guild.channels.find("name", "logs");
          if (!log) return;
          let embed = new Discord.RichEmbed()
            .setTitle("ڕۆڵ دروست کردن    ")
            .addField("  ناوی ڕۆڵ  ", role.name, true)
            .addField("  ئایدی ڕۆڵ ", role.id, true)
            .addField("  ڕەنگی ڕۆڵ ", role.hexColor, true)
            .addField(" لەلایەن ", exec, true)
            .setColor("#36393e")
            .setTimestamp();

          log.send(embed).catch(e => {
            console.log(e);
          });
        } catch (e) {
          console.log(e);
        }
      });
  }, 1000);
});

client.on("guildBanAdd", (guild, member) => {
  client.setTimeout(() => {
    guild
      .fetchAuditLogs({
        limit: 1,
        type: 22
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username);
        try {
          let log = guild.channels.find("name", "logs");
          if (!log) return;
          client.fetchUser(member.id).then(myUser => {
            let embed = new Discord.RichEmbed()
              .setAuthor("باند کراو :  ")
              .setColor("#36393e")
              .setThumbnail(myUser.avatarURL)
              .addField("   ", `**${myUser.username}**`, true)
              .addField("   ", `**${exec}**`, true)
              .setFooter(myUser.username, myUser.avatarURL)
              .setTimestamp();
            log.send(embed).catch(e => {
              console.log(e);
            });
          });
        } catch (e) {
          console.log(e);
        }
      });
  }, 1000);
});

client.on("guildBanRemove", (guild, member) => {
  client.setTimeout(() => {
    guild
      .fetchAuditLogs({
        limit: 1,
        type: 22
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username);
        try {
          let log = guild.channels.find("name", "logs");
          if (!log) return;
          client.fetchUser(member.id).then(myUser => {
            let embed = new Discord.RichEmbed()
              .setAuthor("     ")
              .setColor("#36393e")
              .setThumbnail(myUser.avatarURL)
              .addField("   ", `**${myUser.username}**`, true)
              .addField("   ", `**${exec}**`, true)
              .setFooter(myUser.username, myUser.avatarURL)
              .setTimestamp();
            log.send(embed).catch(e => {
              console.log(e);
            });
          });
        } catch (e) {
          console.log(e);
        }
      });
  }, 1000);
});

const db = require("quick.db"); // npm i quick.db

client.on("message", async message => {
  const prefix = "a!"; //comand

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  let antibot = await db.fetch(`antibot_${message.guild.id}`);
  if (antibot === null) antibot = "off";

  if (cmd === "antibot") {
    if (!message.guild.member(message.author).hasPermission("Owner"))
      return message.reply(`Only ADMINISTRATOR can use this command`);
    if (!args[0])
      return message.reply(
        `___***دەتەوێت بۆت بێتە ژوروە یان نەیەت؟***___ \`off / on\``
      );

    if (args[0] === "on") {
      db.set(`antibot_${message.guild.id}`, "on");
      message.reply(`__***ئێستا بۆت ناتوانێ جۆینی سێرڤەر بکات***__`);
    }

    if (args[0] === "off") {
      db.set(`antibot_${message.guild.id}`, "off");
      message.reply(`___***ئێستا بۆت دەتوانێ جۆینی سێرڤەر بکات***__`);
    }
  }
});
client.on("guildMemberAdd", async member => {
  let antibot = await db.fetch(`antibot_${member.guild.id}`);
  if (antibot === "on") {
    if (member.user.bot) member.kick("Anti bot is on !");
  }

  let channel = member.guild.channels.find("name", "logs");

  if (channel) {
    let embed = new Discord.RichEmbed().setTitle(`  (Member join)`)
      .setDescription(`
        ** Mmember Name: ** ${member.user.username}
        ** Mmeber ID: ** ${member.id}`);

    channel.send(embed);
  }
  member.guild.owner.send("embed");
});

client.on("message", message => {
  if (message.content == prefix + "bot") {
    message.channel.send({
      embed: new Discord.RichEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setThumbnail(client.user.avatarURL)
        .setColor("RANDOM")
        .setTitle("``INFO Bot`` ")
        .addField(
          "``My Ping``",
          [`${Date.now() - message.createdTimestamp}` + "MS"],
          true
        )
        .addField(
          "``RAM Usage``",
          `[${(process.memoryUsage().rss / 1048576).toFixed()}MB]`,
          true
        )
        .addField("``servers``", [client.guilds.size], true)
        .addField("``channels``", `[ ${client.channels.size} ]`, true)
        .addField("``Users``", `[ ${client.users.size} ]`, true)
        .addField("``My Name``", `[ ${client.user.tag} ]`, true)
        .addField("``My ID``", `[ ${client.user.id} ]`, true)
        .addField("``My Prefix``", `[ a! ]`, true)
        .addField("``My Language``", `[ Java Script ]`, true)
        .setFooter("By | ALFA ")
    });
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", message => {
  if (message.content === "slaw") {
    message.channel.send("Slaw baxer bey");
    message.channel.sendFile("");
  }
});

client.on("message", m => {
  if (m.content === prefix + "help") {
    let Dashboard = `
esh krdne botka dabit to chnlik drust blaet ba naue { logs } awkata dst ba esh dakat

a!lock
a!unlock

a!invite
a!about
a!server 

Best Discord __AntiSpam__
Best Discord __AntiShare Everyone & Here & Link .__`;
    var addserver = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2080374975`;
    var SUPPORT = `https://discord.gg/XpuNszK`;
    let embed = new Discord.RichEmbed()
      .setTitle(`${m.author.username}`)

      .setDescription(
        `**${Dashboard}**
  **[Add To Your Server ](${addserver})** | **[ Server Support](${SUPPORT})**`
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/829001879706927136/835105064388526090/SPOILER_20210423_052519.gif"
      );
    m.react("✅");
    m.channel.send(embed);
  }
});

client.on("message", m => {
  if (m.content === "a!linkbot") {
    let Dashboard = " ";
    var addserver =
      "https://discord.com/api/oauth2/authorize?client_id=743261617625497621&permissions=8&scope=bot ";
    var SUPPORT = "   ";
    let embed = new Discord.RichEmbed(`By ALFA`).setTitle(`لینکی بۆت`)
      .setDescription(`                                                                                                               
(${addserver})**    
**[Dashboard](${Dashboard})**
**[ Server Support](${SUPPORT})**`);
    m.react("✅");
    m.author.send(embed);
  }
});

client.on("message", message => {
  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  // +say
  if (command === "say") {
    if (!message.channel.guild)
      return message.channel
        .send("ببورە ئەم ئەمرە تەنها بۆ سێرفەرە")
        .then(m => m.delete(5000));
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("ببورە ئەم دەسەڵاتەت نیە ADMINISTRATOR");
    message.delete();
    message.channel.sendMessage(args.join(" "));
  }

  if (command == "embed") {
    if (!message.channel.guild)
      return message.channel
        .send("ببورە ئەم ئەمرە تەنها بۆ سێرفەرە")
        .then(m => m.delete(5000));
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send("ببورە ئەم دەسەڵاتەت نیە MANAGE_MESSAGES");
    let say = new Discord.RichEmbed()
      .setDescription(args.join("  "))
      .setColor(0x23b2d6);
    message.channel.sendEmbed(say);
    message.delete();
  }
});

client.on("message", async message => {
  var prefix = "a!"; // البرفكس
  if (message.content.includes("discord.gg")) {
    if (message.member.hasPermission("MANAGE_MASSAGES")) return;
    if (!message.channel.guild) return;
    message.delete();
  }
});

client.on("message", async message => {
  if (message.content.startsWith(prefix + "invite")) {
    let invite = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setThumbnail(message.author.avatarURL)
      .setTitle(
        "**__کلیک لێرە بکە بۆ ئەوەی بۆت ئەکە ئینڤاتی سێرڤەری خۆت بکەی:sparkling_heart:__**"
      )
      .setURL(
        `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`
      );
    message.channel.sendEmbed(invite);
  }
});

// ======== { • anti reklam • }======== //
client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.content.includes("http777")) {
    if (msg.member.hasPermission("MANAGE_EMOJIS")) return;
    if (!msg.channel.guild) return;
    msg.delete();
    msg.reply("```You cant send link .```");
  }
});

////////

//lera chiw pe xosha bele/
// ======== { • anti everyone • }======== //
client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.content.includes("@everyone")) {
    if (msg.member.hasPermission("MENTION_EVERYONE")) return;
    if (!msg.channel.guild) return;
    msg.delete();
    msg.reply("```You cant send everyone .```");
  }
});
// ======== { • anti here • }======== //
client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.content.includes("@here")) {
    if (msg.member.hasPermission("MENTION_EVERYONE")) return;
    if (!msg.channel.guild) return;
    msg.delete();
    msg.reply("```You cant send here .```");
  }
});

client.on("message", async message => {
  if (message.content.startsWith(prefix + "lock")) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return;
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false
    }); ////////////////mrfix
    message.channel.send(` **has been locked.**`);
  }
});
////////////////mrfix
client.on("message", async message => {
  if (message.content.startsWith(prefix + "unlock")) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return;
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    });
    message.channel.send(` **has been unlocked.**`);
  }
});

client.on("message", message => {
  let command = message.content.split(" ")[0];
  if (command == prefix + "about") {
    const bot = new Discord.RichEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setColor("RANDOM")
      .addField(
        "**Bot Ping** : ",
        `» ${Date.now() - message.createdTimestamp}` + " ms",
        true
      )
      .addField("**Servers** :  ", `» ${client.guilds.size}`, true)
      .addField("**Bot Name** :  ", `» ${client.user.tag} `, true)
      .addField("**Bot Owner** :  ", `»  <@647089057184088066>`, true) // تعديل مهم عدل هذا الرقم لايدي حسابك
      .setImage("")
      .setFooter(message.author.username, message.author.avatarURL);
    message.channel.send(bot);
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "server")) {
    if (!message.channel.guild)
      return message.channel.send(` | This Command is used only in servers!`);
    const millis = new Date().getTime() - message.guild.createdAt.getTime();
    const now = new Date();
    const verificationLevels = ["None", "Low", "Medium", "Insane", "Extreme"];
    const days = millis / 1000 / 60 / 60 / 24;
    var embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL)
      .addField(":id:✽** Server ID:**", `» ${message.guild.id} `, true)
      .addField(
        ":calendar:✽** Created On**",
        `» ${message.guild.createdAt.toLocaleString()}`,
        true
      )
      .addField(":crown: ✽**Server Owner**", `**${message.guild.owner}**`, true)
      .addField(
        `✽** Members ** [${message.guild.members.size}]`,
        `**${
          message.guild.members.filter(c => c.presence.status !== "offline")
            .size
        }** **Online**`,
        true
      )
      .addField(
        ":speech_balloon:✽** Channels **",
        `» **${message.guild.channels.filter(m => m.type === "text").size}**` +
          " TexT | VoicE  " +
          `**${message.guild.channels.filter(m => m.type === "voice").size}** `,
        true
      )
      .addField(":earth_africa:✽** Region **", ` ${message.guild.region}`, true)
      .setImage("")
      .setColor("RANDOM");
    message.channel.sendEmbed(embed);
  }
});

var fox = "By !            <ᵉᵈᵗ/A>ᵇᵃᵇᵃALFA𖤍:black_heart: "; // ممنوع اللمس
var perfi = "By !            <ᵉᵈᵗ/A>ᵇᵃᵇᵃALFA𖤍:black_heart: ";
console.log(
  "Code BC By !            <ᵉᵈᵗ/A>ᵇᵃᵇᵃALFA𖤍:black_heart:  Embed and Avatar "
);
client.on("message", message => {
  // BY KillerFox or ALphaCodes
  if (message.author.id === client.user.id) return; // BY KillerFox or ALphaCodes
  if (message.guild) {
    // BY KillerFox or ALphaCodes
    let embed = new Discord.RichEmbed();
    let args = message.content
      .split(" ")
      .slice(1)
      .join(" "); // BY KillerFox or ALphaCodes
    if (message.content.split(" ")[0] == "bc") {
      // غير امر او برفكس
      if (!args[1]) {
        // BY KillerFox or ALphaCodes
        message.channel.send("**bc <Messages> :incoming_envelope:  **"); // ممنوع المس
        return;
      }
      message.guild.members.forEach(m => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return; // ممنوع اللمس
        var bc = new Discord.RichEmbed()
          .setThumbnail(client.user.avatarURL)
          .addField(
            ":beginner: Server :beginner: :twisted_rightwards_arrows: ",
            `${message.guild.name}`
          )
          .addField(
            ":heartpulse:  Sender :heartpulse: :twisted_rightwards_arrows: ",
            `${message.author.username}#${message.author.discriminator}`
          )
          .addField(
            ":scroll: Message :scroll: :twisted_rightwards_arrows: ",
            args
          )
          .setFooter("!            <ᵉᵈᵗ/A>ᵇᵃᵇᵃALFA𖤍:black_heart: ") // حط اي شي تبيه
          .setColor("RANDOM");
        // m.send(`[${m}]`);
        m.send(`${m}`, { embed: bc });
      });
    }
  } else {
    return;
  }
});

client.login("gxNTc0MTMxNzQ0ODIw.X8FjFw.1n7JsP4iBILoYXkqDOa0WXDY8U0");
