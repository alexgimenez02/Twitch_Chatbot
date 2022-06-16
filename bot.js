const tmi = require('tmi.js');


// Define configuration options
const opts = {
  identity: {
    username: "telah_bot",
    password: "oauth:5chhjlihnolsb8zy3eex2dgak32axb"
  },
  channels: [
    "Telahelsabio"
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
//client.on('message', onMessageHandler);

client.on('connected', onConnectedHandler);
client.on('chat',(channel, user, msg,self) => {
    if(self){return;}
    const commandName = msg.trim();

    if(checkCapitalLetters(commandName)){
        client.timeout(channel,user,2,"No spamming capital letters");
        client.say(channel,user + " try not to use that many capital letters next time");
    }
})
// Connect to Twitch:
client.connect();
/*
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  
  if(checkCapitalLetters(commandName)){
      client.timeout(target,msg.author,2,"No spamming capital letters");
      client.say(target, msg.author + " try not to use that many capital letters");
  }
  if(commandName == ("!dice")){
    client.say(target, "You rolled a " + (Math.floor(Math.random()*250 % 6) + 1));
  }
}*/
// Function called when the "dice" command is issued
function checkCapitalLetters (msg) {
    if(msg.length > 10){
            let caps = 0;
        for(x = 0; x < msg.length;x++){
            if(msg[x].toUpperCase() === msg[x]) caps ++;
        }
        let textCaps = (caps / msg.length) * 100
        if (textCaps >= 60){
            return true;
        }
    }
   return false;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}