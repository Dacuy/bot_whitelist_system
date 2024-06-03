# DAC_WhitelistSystem 🌟

Bienvenido a **DAC_WhitelistSystem**, una aplicación web para gestionar solicitudes de whitelist para servidores, especialmente útil para servidores de FiveM. Los datos ingresados en el formulario se almacenan en una base de datos y luego un bot de Discord procesa las solicitudes para su aprobación o rechazo.

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


## Contacto
Para cualquier consulta o sugerencia, puedes contactarme en Discord: **dac_lc**.

Besitos,
**DAC_**

