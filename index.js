const {Client, Intents} = require('discord.js')
const { token, guildId } = require('./config.json');
const { joinVoiceChannel, VoiceReceiver, getVoiceConnection, SpeakingMap, VoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { on } = require('events');
const { setTimeout } = require('timers/promises');

const player = createAudioPlayer();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES] });

var user = "";
//var uid = "";
client.once('ready', () => {
    client.user.setActivity("no one", {type: "LISTENING"})
    console.log("READY");
});

client.on("messageCreate", (message)=>{
    if (message.content.startsWith("!whoasked")){
        var count = 0;
        var uidInput = "";
        user = message.content.split(" ")[1];
        var listOfMembers = message.member.voice.channel.members;
        listOfMembers.forEach(mem => 
        {
            if (mem.displayName === user){
                uidInput = mem.id;
                return;
            }
        });
        var connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            selfDeaf: false,
            adapterCreator: message.guild.voiceAdapterCreator
        })
        connection.subscribe(player);
        connection.receiver.speaking.on('start', uid => 
        {
            if (uidInput === uid){
                count += 1;
                console.log(count);
                var audio = createAudioResource(`./audio/billy${count}.ogg`);
                player.play(audio);
            }
        });
        connection.receiver.speaking.on('end', uid => 
        {
            if (count == 6){
                connection.disconnect();
                connection.destroy();
                count = 0;
            }
        }); 
    }
});

client.login(token);