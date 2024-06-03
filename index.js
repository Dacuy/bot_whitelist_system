
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const admin = require('firebase-admin');
const mySecret = process.env['api-ket'];
const serviceAccount = require('./firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const DB = admin.firestore();

const intents = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
]);

const client = new Client({ intents });

const sentDocumentIds = new Set();


client.once('ready', () => {
    console.log('El bot está listo!');

    try {
        client.user.setActivity('REZANDO A DAC', { type: 'PLAYING' });
    } catch (error) {
        console.error('Ocurrió un error al establecer la actividad:', error);
    }
});


function splitFieldContent(content, maxLength) {
    const chunks = [];
    let currentChunk = '';

    content.split('\n').forEach(line => {
        if ((currentChunk + line).length <= maxLength) {
            currentChunk += line + '\n';
        } else {

            chunks.push(currentChunk);
            currentChunk = line + '\n';
        }
    });

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

async function sendNewWhitelistDocs() {
    try {
        const snapshot = await DB.collection('whitelist').get();

        snapshot.forEach(doc => {
            const docId = doc.id;
            if (!sentDocumentIds.has(docId)) {
                const { nombre, edadic, pais, socialClass, historyPj, oocage, steamurl, nomeDiscord, status } = doc.data();
                if (nombre && edadic && pais && socialClass && historyPj && oocage && steamurl && nomeDiscord && status) {
                    const embed = new MessageEmbed()
                        .setTitle('📋Nueva Whitelist Recibida:')
                        .setColor('#a0a4a7') 
                        .setThumbnail('https://cdn.discordapp.com/attachments/1234537312273170434/1236378418296131639/DacWhitelistSystemLogobyDesigner.png?ex=6637caa1&is=66367921&hm=6d17bb9291188b49bd1352d16208970fbb292758addf782b91c6a411b93a809b&') 
                        .addField('Nombre', nombre)
                        .addField('Edad IC', edadic)
                        .addField('Procedencia', pais)
                        .addField('Clase social', socialClass)
                        .addField('Historia del personaje', historyPj)
                        .addField('Edad OOC', oocage)
                        .addField('Url de Steam', steamurl)
                        .addField('Nombre de Discord', nomeDiscord)
                        .addField('Estado', status)
                        .setFooter(`🔸𝔻♞ℂ 𝕎ℍ𝕀𝕋𝔼𝕃𝕀𝕊𝕋 𝕊𝕐𝕊𝕋𝔼𝕄🔸 - ${getCurrentDateTime()}`, 'https://cdn.discordapp.com/attachments/1234537312273170434/1236378418296131639/DacWhitelistSystemLogobyDesigner.png?ex=6637caa1&is=66367921&hm=6d17bb9291188b49bd1352d16208970fbb292758addf782b91c6a411b93a809b&');

                    const maxLength = 1024;
                    Object.keys(embed.fields).forEach(key => {
                        const field = embed.fields[key];
                        if (field.value.length > maxLength) {
                            const chunks = splitFieldContent(field.value, maxLength);
                            embed.spliceFields(parseInt(key), 1);
                            chunks.forEach((chunk, index) => {
                                embed.addField(field.name + ` (Parte ${index + 1})`, chunk);
                            });
                        }
                    });

                    const approveButton = new MessageButton()
                        .setCustomId('approve_whitelist')
                        .setLabel('Aprobar Whitelist')
                        .setStyle('PRIMARY');

                    const rejectButton = new MessageButton()
                        .setCustomId('reject_whitelist')
                        .setLabel('Rechazar Whitelist')
                        .setStyle('SECONDARY');

                    const row = new MessageActionRow()
                        .addComponents(approveButton, rejectButton);

                    const channel = client.channels.cache.get('1235722562294648836');
                    if (channel && channel.isText()) {
                        channel.send({ embeds: [embed], components: [row] });
                        sentDocumentIds.add(docId);
                    } else {
                        console.error('No se pudo encontrar el canal o no es un canal de texto válido.');
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener documentos de la whitelist:', error);
    }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'approve_whitelist') {
    await interaction.deferReply();
    const docId = interaction.message.embeds[0].fields.find(field => field.name === 'Nombre de Discord').value;
    const guildMember = await interaction.guild.members.fetch({ query: docId, limit: 1 });
    if (!guildMember || !guildMember.first()) {
      console.error(`No se pudo encontrar al usuario con el nombre de Discord: ${docId}`);
      return interaction.editReply('Error: No se pudo encontrar al usuario correspondiente.');
    }
    const user = guildMember.first().user;
    await interaction.editReply('Whitelist aprobada.');

    const approvedRole = interaction.guild.roles.cache.get('1236035844822011965'); 
    const rejectedRole = interaction.guild.roles.cache.get('1236059644087242773');
    if (approvedRole && rejectedRole) {
      await guildMember.first().roles.add(approvedRole);
      await guildMember.first().roles.remove(rejectedRole);
      console.log(`Se ha agregado el rol ${approvedRole.name} y removido el rol ${rejectedRole.name} a ${user.tag}`);
    } else {
      console.error('No se encontraron los roles especificados.');
    }

    const approvedMessage = `¡Felicidades! Tu whitelist ha sido aprobada.`;
    try {
      await user.send(approvedMessage);
      console.log(`Se envió un mensaje a ${user.tag} sobre la aprobación de la whitelist.`);
    } catch (error) {
      console.error(`Error al enviar el mensaje a ${user.tag}:`, error);
    }

    const approveChannel = client.channels.cache.get('1236058451101225090');
    if (approveChannel && approveChannel.isText()) {
      approveChannel.send(`¡Felicidades! ${user}, tu whitelist ha sido aprobada.`);
    } else {
      console.error('No se pudo encontrar el canal o no es un canal de texto válido para enviar el mensaje de aprobación.');
    }

    const embed = interaction.message.embeds[0];
    embed.fields.find(field => field.name === 'Estado').value = 'Aprobada';
    interaction.message.edit({ embeds: [embed] });

    try {
      const querySnapshot = await DB.collection('whitelist').where('nomeDiscord', '==', user.tag).get();
      querySnapshot.forEach(async doc => {
        await doc.ref.update({ status: 'Aprobada' });
      });
    } catch (error) {
      console.error('Error al actualizar el estado en la base de datos:', error);
    }
  } else if (interaction.customId === 'reject_whitelist') {
    await interaction.deferReply();
    const docId = interaction.message.embeds[0].fields.find(field => field.name === 'Nombre de Discord').value;
    const guildMember = await interaction.guild.members.fetch({ query: docId, limit: 1 });
    if (!guildMember || !guildMember.first()) {
      console.error(`No se pudo encontrar al usuario con el nombre de Discord: ${docId}`);
      return interaction.editReply('Error: No se pudo encontrar al usuario correspondiente.');
    }
    const user = guildMember.first().user;

    const whitelistRole = interaction.guild.roles.cache.get('1236035844822011965'); 
    const deniedRole = interaction.guild.roles.cache.get('1236059644087242773'); 
    if (whitelistRole && deniedRole) {
      await guildMember.first().roles.remove(whitelistRole);
      await guildMember.first().roles.add(deniedRole);
      console.log(`Se ha removido el rol ${whitelistRole.name} y agregado el rol ${deniedRole.name} a ${user.tag}`);
    } else {
      console.error('No se encontraron los roles especificados.');
    }

    const rejectionMessage = 'Tu solicitud ha sido rechazada.';
    await user.send(rejectionMessage);
    console.log(`Rejection message sent to ${user.tag}: ${rejectionMessage}`);

    await interaction.editReply('Whitelist rechazada.');

    const embed = interaction.message.embeds[0];
    embed.fields.find(field => field.name === 'Estado').value = 'Rechazada';
    interaction.message.edit({ embeds: [embed] });

    try {
      const querySnapshot = await DB.collection('whitelist').where('nomeDiscord', '==', user.tag).get();
      querySnapshot.forEach(async doc => {
        await doc.ref.update({ status: 'Rechazada' });
      });
    } catch (error) {
      console.error('Error al actualizar el estado en la base de datos:', error);
    }
  }
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('/buscarwhitelist')) {
        const username = message.content.split(' ')[1];

        try {
            const querySnapshot = await DB.collection('whitelist').where('nomeDiscord', '==', username).get();

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];

                const { nombre, edadic, pais, socialClass, historyPj, oocage, steamurl, nomeDiscord, status } = doc.data();

                const embed = new MessageEmbed()
                    .setThumbnail('https://cdn.discordapp.com/attachments/1234537312273170434/1236378418296131639/DacWhitelistSystemLogobyDesigner.png?ex=6637caa1&is=66367921&hm=6d17bb9291188b49bd1352d16208970fbb292758addf782b91c6a411b93a809b&')
                    .setTitle('🔎 Información de la whitelist que pediste:')
                    .setColor('#a0a4a7')
                    .addField('Nombre', nombre)
                    .addField('Edad IC', edadic)
                    .addField('Procedencia', pais)
                    .addField('Clase social', socialClass)
                    .addField('Historia del personaje', historyPj)
                    .addField('Edad OOC', oocage)
                    .addField('Url de Steam', steamurl)
                    .addField('Nombre de Discord', nomeDiscord)
                    .addField('Estado', status)
                    .setFooter(`🔸𝔻♞ℂ 𝕎ℍ𝕀𝕋𝔼𝕃𝕀𝕊𝕋 𝕊𝕐𝕊𝕋𝔼𝕄🔸 - ${getCurrentDateTime()}`, 'https://cdn.discordapp.com/attachments/1234537312273170434/1236378418296131639/DacWhitelistSystemLogobyDesigner.png?ex=6637caa1&is=66367921&hm=6d17bb9291188b49bd1352d16208970fbb292758addf782b91c6a411b93a809b&');

                const maxLength = 1024;
                Object.keys(embed.fields).forEach(key => {
                    const field = embed.fields[key];
                    if (field.value.length > maxLength) {
                        const chunks = splitFieldContent(field.value, maxLength);
                        embed.spliceFields(parseInt(key), 1);
                        chunks.forEach((chunk, index) => {
                            embed.addField(field.name + ` (Parte ${index + 1})`, chunk);
                        });
                    }
                });

                const channel = client.channels.cache.get('1236286793406742599');
                if (channel && channel.isText()) {
                    channel.send({ embeds: [embed] });
                } else {
                    console.error('No se pudo encontrar el canal o no es un canal de texto válido.');
                }
            } else {
                message.reply(`No se encontró ninguna whitelist para el usuario ${username}.`);
            }
        } catch (error) {
            console.error('Error al buscar en la whitelist:', error);
            message.reply('Ocurrió un error al buscar en la whitelist.');
        }
    }
});

function getCurrentDateTime() {
    const now = new Date();
    const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const time = `${now.getHours()}:${now.getMinutes()}`;
    return `${date} - ${time}`;
}


client.on('error', error => {
    console.error('¡Error del cliente:', error);
});

client.login(mySecret);

setInterval(sendNewWhitelistDocs, 0.1 * 60 * 1000);
