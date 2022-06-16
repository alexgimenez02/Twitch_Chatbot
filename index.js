require("dotenv").config()
const token = process.env.BOT_TOKEN;
const Discord = require("discord.js")



const bot = new Discord.Client();
const fs = require('fs');

var users = lecturaTXT();

bot.on('ready', () =>{
    console.log('Esta online perros!');
})

bot.on('message', msg=>{
    if(msg.content.includes("!")){
        switch(msg.content){
            case "!dale": //Esto lo quitaria o haria algo diferente
                msg.reply('No digas pito');
        
                var coll = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 100000 });        
                coll.on('collect',msg =>{
                    if(msg.content === "pito"){
                        msg.channel.send('Marrano');

                    }
                });
                break;
            case "!bar": //Retocar el tema de productos sea un diccionario o un objeto que te devuelva la foto
                var productos = ["Coca-cola","Coca-cola light","Coca-cola Zero","Fanta Naranja","Fanta Limon","Sprite","Schweppes","Estrella Damm","Voll Damm","Aquarius Limon","Aquarius Naranja","Agua"];
                msg.reply("Que quieres guapetón?");      
                const regex = [/coca-? ?cola/gmi,/(coca-? ?cola)? (light)\b/gmi,/(coca-? ?cola)? (zero)\b/gmi,/fanta (naranja)\b/gmi,/fanta (limon\b)/gmi,/sprite/gmi,/schweppes/gmi,/estrella ?(damm)?/gmi,/voll ?(damm)?/gmi,/aquarius ?(limon)\b/gmi,/aquarius ?(naranja)\b/gmi,/agua/gmi]
                coll = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
                coll.on('collect',msg =>{
                    regex.forEach(typeRegex =>{
                        var content = msg.content;
                        if(typeRegex.test(content)){
                            var i = regex.indexOf(typeRegex);
                            msg.channel.send("Aquí tienes: ",{files:["Bebidas/"+productos[i]+".png"]});
                            var bebida = productos[i];
                            var user = String(msg.author.username);
                            if(user in users){
                                var user_dict = users[user];
                                if(bebida in users[user]){
                                    user_dict[bebida] += 1;
                                }else{
                                    user_dict[bebida] = 1;
                                }
                            }else{
                                users[user] = {};
                                var user_dict = users[user];
                                user_dict[bebida] = 1;
                            }
                        
                            escrituraArchivo(user,users[user][bebida],bebida);  
                        }
                    });
                });   
                break;
            case "!help": //Ir actualizando WIP
                msg.member.send("Esto són los comandos actuales: \n!dale \n!bar \n!foto \n!carta \n!gif \n!mememan \n!perfil");

                break;
            case "!foto": //Ahora sabemos que puede tener links de fotos y ya sirve, si se borra la foto de internet, se tendra que cambiar
                var folder = "Fotos";
                var fotos = [];
                fs.readdirSync(folder).forEach(file => {
                    fotos.push(file);
                });
                msg.channel.send("Aquí tienes tu foto: \n", {files: ["Fotos/"+fotos[(Math.random() * (fotos.length)) << 0]]}); //Para imagenes se tiene que poner el [], sino peta, si quieres ponerlas, ponlas en la carpeta fotos, asi mas facil de acceder ;)
                break;
            case "!gif":
                var gifs = ["notfunny.gif","joseph.gif"]
                msg.channel.send("Aquí tienes tu gif: \n",{files: ["Gifs/"+gifs[(Math.random() * (gifs.length)) << 0]]} )
                break;
            case "!carta":
                msg.channel.send("Esto es lo que tenemos: Coca-cola, Coca-cola light, Coca-cola Zero, Fanta de naranja, Fanta de limon, Sprite, Schweppes, Estrella Damm y Voll Damm, Aquarius de limon, Aquarius de naranja o una agüita fresquita.");
                break;
            case "!mememan":
                folder = 'Mememan';
                
                var memes = [];
                fs.readdirSync(folder).forEach(file => {
                    memes.push(file);
                });
                msg.channel.send("Que meme quieres? (envia !cuales para saber que memes hay o envia !random para enviar uno aleatorio)");
                coll = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
                coll.on('collect',msg =>{
                    if(memes.includes(msg.content)){msg.channel.send({files: ["Mememan/"+msg.content]});}
                    else if(msg.content === "!cuales"){
                        msg.member.send(memes);
                        msg.member.send("Copia el meme que quieras enviar al servidor");}
                    else if(msg.content === "!random"){msg.channel.send({files: ["Mememan/"+memes[(Math.random()*memes.length) << 0]]});}
                    else{msg.channel.send("Ese meme no lo tenemos, lo siento");}
                });
                break;
            case "!perfil":
                let embed = new Discord.MessageEmbed();
                embed.setImage(msg.author.avatarURL());
                embed.addField("Usuario",msg.author.username);
                if(msg.author.username in users){
                    const keys = Object.keys(users[msg.author.username]);
                    const user_dict = users[msg.author.username];
                    var embedarray = [];
                    var coste = 0;
                    for(i = 0;i<keys.length;i++){
                        embedarray[i]=String(keys[i])+" : " +String(user_dict[keys[i]]);
                        coste += parseInt(user_dict[keys[i]],'10') * 1.25;
                    }
                    embed.addField("Bebidas consumidas",embedarray);
                    embed.addField("Dinero gastado: ",String(coste)+'€' );
                }else{
                    embed.addField("Bebidas consumidas","Aún no has consumido nada");
                }
                
                embed.setColor('#275BF0');
                msg.channel.send(embed);
                break;
            case "!spam":
                msg.channel.send("Nice try bitch");
                //setInterval(() => msg.channel.send("Spam!"),2000);
                break;
            default:
                if(msg.author.bot){ return;} //Evita que el bot se responda a si mismo con leer un solo !
                else if(msg.mentions){return;}
                else{
                    msg.reply("Lo siento, no es un comando válido, gilipollas");
                }
                break;
        }
    }
})
/**/
function escrituraArchivo(user,numero,bebida){
    var fs = require("fs"); //Llamada a file system, sin esto no tenemos archivos a escribir
    
    try{ //Si no lee bien el archivo o si tiene algun fallo durante la ejecucion, digamos que petara
        if(fs.existsSync("Users/"+user+".txt")){ //Comprueba si existe (basicamente es una repeticion del try ahora que )
            var file = fs.readFileSync("Users/"+user+".txt", {encoding: "utf8",flag: 'r+'}); //Texto leido y para editar
            if(file.includes(bebida)){ //Si la bebida esta incluida en el texto simplemente le suma 1 al numero
                var splited_file = file.split("\n");
                var file_string = "";
                var i = 0; //Esto es para saber cual es el primer elemento, un contador sencillo
                splited_file.forEach(element =>{ //Esto va añadiendo a cada bebida la cantidad, si ha de ser cambiada, aumenta en 1
                    var keys_value = element.split(":"); 
                    if(bebida === keys_value[0]){keys_value[1] = parseInt(keys_value[1],'10') + 1;}
                    if(i === 0){file_string += keys_value[0]+":"+keys_value[1];}
                    else{file_string += "\n"+ keys_value[0]+":"+keys_value[1];}
                    i = i + 1; //Aumenta el contador, realmente no tiene otro uso que para el primer valor
                });
                fs.writeFileSync("Users/"+user+".txt",file_string); //Reescribe el archivo a partir del texto modificado
            }else{
                file += "\n"+bebida+":"+numero; //Sino simplemente añade la bebida a la lista de bebidas
                fs.writeFileSync("Users/"+user+".txt",file);
            }
        }else{
            console.log("Nuevo usuario usando el bar"); //Si es un nuevo usuario
            fs.writeFileSync("Users/"+user+".txt", bebida + ":" + numero), function(err){ //Crea el fichero con el contenido y el numero
                if(err) return console.log(err); //Si hay algun error nos lo dice por consola
            }
        }
    }catch(err){console.log(err)} //En el caso de que haya errores, se dicen por consola
}
function lecturaTXT(){ //Lee cada base de datos de cada persona
    const fs = require('fs');
    var users = {}; //Crea un diccionario para guardar cada usuario

    fs.readdirSync("Users/").forEach(file => { //Por cada fichero
        
        var actualFile = fs.readFileSync("Users/"+file,{encoding : 'utf8', flag: 'r'}); //Lo lee
        var data = actualFile.split("\n"); //Guarda los datos
        var arrayData = []; 
        data.forEach(element => {
            var secondData = element.split(":"); //Separa la llave del diccionario de el valor que tiene
            arrayData.push(secondData);
        });
        var user = file.split("."); //Hace un ultimo split para separar el txt del usuario
        if(!(user[0] in users)){users[user[0]] = {};} //Si no esta ya creado crea el diccionario del propio usuario
        
        arrayData.forEach(key =>{ //Añade cada key con su valor en el diccionario del usuario
            users[user[0]][key[0]] = parseInt(key[1],'10'); 
        });
    });
    return users; //Devuelve el diccionario
}
/**/
bot.login(token);