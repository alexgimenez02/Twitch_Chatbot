const tmi = require('tmi.js');

const options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "telah_bot",
        password: process.env.BOT_TOKEN
    },
    channels: ["Telahelsabio"]
};
var client = new tmi.client(options)
var messageNum = 0;
var count = 0;
var malo = lecturaManqueadas();
const msgs = ["Para saber que comandos hay, utiliza el comando !commands","En este canal no se toleran insultos hacia otros espectadores, solo insultos momentaneos a Telah","Evitar en lo máximo de lo posible poner muchas mayúsculas, yo mismo, @telah_bot, os metere un timeout sin dudar ni un segundo","No se tolerara NINGUNA broma racista o homofoba en este canal"];
const comandos = ["!steam,","!league,","!racha,","!discord,","!amigos,","!manco"];
client.connect();

client.on('connected', onConnectedHandler);

client.on('chat',(channel,target, msg, self) => {
    if(self){return}
    const msgContent = msg.trim();

    /*if(checkCapitalLetters(msgContent)){
        client.say(channel, "/timeout "+target.username+" 60 Spamming capital letters");
        client.say(channel,target.username + " don't spam capital letters!");
    }*/
    
    if(msgContent.startsWith("!")){
        let command = msgContent
        switch (command){
            case "!steam":
                client.say(channel, "Mi usuario de steam es: https://steamcommunity.com/id/Telahelsabio/");
                break;
            case "!league":
                client.say(channel,"Mis stats los puedes encontrar aquí: https://euw.op.gg/summoner/userName=Telah");
                break;
            case "!commands":
                var fullCommands = "Comandos actuales: ";
                comandos.forEach(com => {
                    fullCommands += com
                    fullCommands += " ";
                });
                client.say(channel,fullCommands);
                break;
            case "!racha":
                client.say(channel,"Telah esta intentando conseguir 20 victorias con todos los ADC de League of Legends, si quieres saber como lleva cada racha, compruebalo en: https://docs.google.com/spreadsheets/d/17qm6V1vV2lWD1JdYX8G-HiI1iMAx9tkooIHJpsHZZY4/edit?usp=sharing ");
                break;
            case "!discord":
                client.say(channel,"Entra en la cueva de los sabios que estan en el discord: https://discord.gg/BDxXtgQ5b2 ");
                break;
            case "!amigos":
                client.say(channel,"Visita el canal de nuestros amig@s: bego_8: https://www.twitch.tv/bego_8 natttchu: https://www.twitch.tv/natttchu ");
                break;
            case "!manco":
                malo++;
                client.say(channel,`Telah ha manqueado ${malo} veces`);
                escrituraManqueadas(malo);
                break;
            default:
                client.say(channel,`${target.username} ese comando no existe todavia, puedes ver los existentes en !commands`);
                break;
        }
    }else{
        count++;
        if(count == 15){
            count = 0;
            messageNum++;
            setTimeout(() => client.say(channel,msgs[messageNum%msgs.length]),10000);
        }
    }
})




//console.log(client.getChannels());
/*setInterval(statusMessages(),600000);
function statusMessages(){
    messageNum = (messageNum++)%msgs.length;
    client.on('chat',(channel, self) =>{
        client.say(channel,msgs[messageNum]);
    })
}*/
//Detect excess of CapitalLetters
function checkCapitalLetters (msg) {
    if(msg.length > 20){
            let caps = 0;
        for(x = 0; x < msg.length;x++){
            if(msg[x].toUpperCase() === msg[x]) caps++;
        }
        let textCaps = (caps / msg.length) * 100
        if (textCaps >= 80){
            return true;
        }
    }
   return false;
}
//Message that indicates the bot is online
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }

function escrituraManqueadas(val){
    const fs = require("fs"); 
    
    try{ 
        var fileString = ""+val;
        fs.writeFileSync("manco.txt",fileString);
    }catch(err){console.log(err)} 
}
function lecturaManqueadas(){ 
    const fs = require('fs');
    
        var actualFile = fs.readFileSync("manco.txt",{encoding : 'utf8', flag: 'r'}); 
        var data = parseInt(actualFile.split("\n")); 
        
        
        
    return data; //Devuelve el diccionario
}