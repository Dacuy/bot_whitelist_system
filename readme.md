# DAC_WhitelistSystem 🌟

Bienvenido a **DAC_WhitelistSystem**, una aplicación web para gestionar solicitudes de whitelist para servidores, especialmente útil para servidores de FiveM. Los datos ingresados en el formulario se almacenan en una base de datos y luego un bot de Discord procesa las solicitudes para su aprobación o rechazo.


<img src="https://cdn.discordapp.com/attachments/1235722562294648836/1247282019080077504/image.png?ex=665f7566&is=665e23e6&hm=480391bd02e7b790b178cb8a28a08cf5e7846c569bbaee64bf97eb5b8047f200&" alt="Texto Alternativo">
<img src="https://cdn.discordapp.com/attachments/1236012837034266644/1247282239629168741/image.png?ex=665f759b&is=665e241b&hm=50dd357700e08b7f10c4b05472b6c5c4edb6c0360385acf90e8ae6498261d19f&" alt="Texto Alternativo">

## Funcionalidades

### Recepción de nuevas solicitudes de whitelist:

- El bot monitorea la colección `whitelist` en Firebase y envía un mensaje con la nueva solicitud al canal específico de Discord cuando se detecta un nuevo documento.
- El mensaje incluye botones para aprobar o rechazar la solicitud.

### Aprobación y rechazo de whitelist:

- Al presionar los botones correspondientes, el bot procesa la solicitud:
  - Si se aprueba, asigna el rol correspondiente al usuario en el servidor de Discord y le envía un mensaje de confirmación.
  - Si se rechaza, asigna un rol de rechazo al usuario y le envía un mensaje de rechazo.

### Búsqueda de whitelist:

- Comando `/buscarwhitelist <nombreDiscord>` permite buscar la información de una whitelist específica basada en el nombre de usuario de Discord.

## Licencia
Proyecto de uso personal: No hace falta hacer mención al autor.
Proyecto de uso comercial (Cualquier proyecto que involucre a + de 5 personas que vayan a usar el sistema): Hacer mención al autor y colocar link al repositorio.

## Requisitos
- Credenciales de Firebase para el almacenamiento de datos.

## Seguridad
**Importante**: Asegúrate de implementar medidas de seguridad adecuadas para ocultar tus credenciales de Firebase. De lo contrario, podrían quedar expuestas al público. Esto es crucial para proteger la integridad y seguridad de tu aplicación.

## Instalación
1. Clona el repositorio:
    ```bash
    git clone https://github.com/Dacuy/bot_whitelist_system.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd BOT_WHITELIST_SYSTEM

4. Agrega tus credenciales de Firebase en el archivo de configuración correspondiente, y escondela para evitar problemas.

## Configuración del webSide
https://github.com/Dacuy/Dac_Whitelist_System---Libre

### Prerequisitos

- Node.js y npm instalados.
- Una cuenta de Firebase con Firestore habilitado.
- Un servidor de Discord con permisos para crear y gestionar roles y canales.


## Contacto
Para cualquier consulta o sugerencia, puedes contactarme en Discord: **dac_lc**.

Besitos,
**©All Rights Reserved: DAC_**

