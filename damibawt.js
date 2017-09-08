/* damibawt.js
 * just a small irc bot to test my node.js skills
 * - 
 * requires modules:
 * - console-stamp
 */

// include irc
var irc = require('irc');
var util = require('util');

// set up the console timestamp
require('console-stamp')(console, 'HH:MM:ss');

// configure the robot
var config = {
  channels: ['#meerkat', '#nictitate'],
  server: 'stable.nictitate.net',
  nickname: 'damibawt',
  username: 'damibawt',
  realname: 'node.js bot'
};

var botinfo = {
  status: 0, // 0=not connected, 1=connected, 2=gathered initial detail
  nickname: null,
  username: null,
  realname: null,
  hostname: null,
  server: null,
  channels: []
}

// set up the robot
var bot = new irc.Client(
  config.server,
  config.nickname,
  {
    channels: config.channels,
    userName: config.username,
    realName: config.realname
  }
);

// custom functions
function array2text(items) {
  for (let item of items) {
    console.log(item)
  }

}

function debug(text) {
  console.log('> ' + text);
}

function debuga(text) {
  console.log('> ' + util.inspect(text, { breakLength: Infinity }));
}

bot.addListener('registered', function(msg) {
  console.log('*** Connected to server: ', msg.server);
  
  botinfo.status = 1;
});

bot.addListener('names', function(chan, nicks) {
  console.log('% Names for %s: ', chan, nicks);
});

bot.addListener('topic', function(chan, nick, text) {
  console.log('*** Topic on %s has been changed by %s: %s', chan, nick, text);
});

bot.addListener('join', function(chan, nick) {
  console.log('*** Join: %s has joined %s', nick, chan);
  
  // if the bot joined
  if (nick == botinfo.nickname) {
    botinfo.channels.push(chan);
    bot.say(chan, 'I am here! ' + botinfo.nickname + '!' + botinfo.username + '@' + botinfo.hostname + ' .. connected to ' + botinfo.server + '.');
    bot.say(chan, 'Currently sitting in the following channels: ' + botinfo.channels);
  }
});

bot.addListener('part', function(chan, nick, text, msg) {
  console.log('*** Part: ' + nick + ' has parted ' + chan + ' ('+ text + ')');
});

bot.addListener('quit', function(nick, text, chans, msg) {
  console.log('*** Quit: ' + nick + ' has quit irc (' + text + ') [chans: ' + chans + ']');
});

bot.addListener('kick', function(chan, knick, nick, text, msg) {
  console.log('*** Kick: %s has kicked %s from %s (%s)', nick, knick, chan, text);
});

bot.addListener('kill', function(nick, text, chans, msg) {
  console.log('*** Kill: %s has been killed (%s) [chans: %s]', nick, text, chans);
});

bot.addListener('message#', function(nick, chan, text, msg) {
  console.log('<%s:%s> %s', nick, chan, text);
});

bot.addListener('notice', function(nick, chan, text, msg) {
  if (chan.substring(0, 1) == '#') {
    console.log('-%s:%s- %s', nick, chan, text);
  } else {
    console.log('-%s- %s', nick, text);
  }
});

bot.addListener('pm', function(nick, text, msg) {
  console.log('<%s> %s', nick, text);
});

bot.addListener('ctcp-notice', function(nick, chan, text, msg) {
  console.log('[%s %s reply] %s', nick, text.split(' ')[0].toUpperCase(), text.split(' ').slice(1, text.split(' ').length).join(' '));
});

bot.addListener('ctcp-privmsg', function(nick, chan, text, msg) {
  if (chan.substring(0, 1) == '#') {
    console.log('[%s:%s %s] %s', nick, chan, text.split(' ')[0], text.split(' ').slice(1, text.split(' ').length).join(' '));
  } else {
    console.log('[%s %s] %s', nick, text.split(' ')[0], text.split(' ').slice(1, text.split(' ').length).join(' '));
  }
});

bot.addListener('ctcp-version', function(nick, chan, msg) {
  bot.ctcp(nick, 'NOTICE', 'VERSION damibawt node.js v0.0.1 [2017]');
});

bot.addListener('nick', function(nick, newnick, chans, msg) {
  console.log('*** Nick: %s has changed their nickname to %s [%s]', nick, newnick, chans);
});

bot.addListener('invite', function(chan, nick, msg) {
  console.log('*** Client has been invited to %s by %s', chan, nick);
});

bot.addListener('+mode', function(chan, nick, mode, mnick, message) {
  console.log('*** Mode: %s has set mode +%s to %s on %s', nick, mode, mnick, chan);
});

bot.addListener('-mode', function(chan, by, mode, argument, message) {
  console.log('*** Mode: %s has set mode -%s to %s on %s', nick, mode, mnick, chan);
});

bot.addListener('whois', function(info) {
  
  if ((botinfo.status == 1) && (info.nick.toLowerCase() == config.nickname)) {
    botinfo.nickname = info.nick;
    botinfo.username = info.user;
    botinfo.hostname = info.host;
    botinfo.server = info.server;
  }
  
  debuga(info);
});

bot.addListener('action', function(from, to, text, msg) {
  console.log('* %s:%s %s', nick, chan, text)
});
