const express = require('express')
const app = express();
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const bodyParser = require('body-parser');
// envios y dependencias de make
const axios = require('axios')
const url = 'https://hook.eu1.make.com/c0uwl889z2e50frw3db2ahvitlwewk2v'

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])
const flowGracias = addKeyword(['Gracias pronto te escribiremos'])

const flowPrincipal = addKeyword(['hola', 'ole', 'alo','buen dia','buenas tardes', 'buenas noches', 'buenos dias'])
    .addAnswer(['🙌 Hola bienvenid@ a Molino Digital','Por favor brindame tu nombre'], {capture:true}, (ctx) =>{
        var phoneMolino = ctx.from
        var nameleadMolino = ctx.body
        // Define los datos que deseas enviar en formato JSON
        const data = {
            phone: phoneMolino,
            name: nameleadMolino
          }
            axios.post(url, data)
            .then(response => {
            console.log(response.data)
            })
            .catch(error => {
            console.error(error)
            })
            console.log(data)        
    })
    .addAnswer(['Gracias pronto te escribiremos'])

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()

    /** Creacion de la API */
    
    // Traer datos desde el json
    app.use(bodyParser.json());

    /**
     * Enviar mensaje con metodos propios del provider del bot
     */
    app.post('/send-message-bot', async (req, res) => {
        //captura de varibales del json
        const message = req.body.message;
        const phone = req.body.phone;
        const dataArray = req.body;

        // Comprobamos si la petición contiene un arreglo
        if(Array.isArray(dataArray)) {
            // Si hay un arreglo, iteramos sobre cada objeto JSON
            for(let i = 0; i < dataArray.length; i++) {
            const json = dataArray[i];
            // Hacemos algo con el objeto JSON actual, por ejemplo:
            
            //Enviar datos en formato json desde un array
            await adapterProvider.sendText(`${json.phone}@c.us`, json.message);

            //Mostrar datos en consola
            //console.log(`Mensaje: ${json.message}, Teléfono: ${json.phone}`);
            }
        }else {
            // Si no hay un arreglo, asumimos que solo hay un objeto JSON
            const json = dataArray;
            await adapterProvider.sendText(`${phone}@c.us`, message);
            // Hacemos algo con el objeto JSON, por ejemplo:
            console.log(`Mensaje: ${json.message}, Teléfono: ${json.phone}`);
          }


        //envio de mensaje
        
        res.send({ data: 'enviado!' })
    })

    
    /**
     * Enviar mensajes con metodos nativos del provider
     */
    app.post('/send-message-provider', async (req, res) => {
        const id = '51938649457@c.us'
        const templateButtons = [
            {
                index: 1,
                urlButton: {
                    displayText: ':star: Star Baileys on GitHub!',
                    url: 'https://github.com/adiwajshing/Baileys',
                },
            },
            { index: 2, callButton: { displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901' } },
            {
                index: 3,
                quickReplyButton: {
                    displayText: 'This is a reply, just like normal buttons!',
                    id: 'id-like-buttons-message',
                },
            },
        ]

        const templateMessage = {
            text: "Hi it's a template message",
            footer: 'Hello World',
            templateButtons: templateButtons,
        }

        const abc = await adapterProvider.getInstance()
        await abc.sendMessage(id, templateMessage)

        res.send({ data: 'enviado!' })
    })
    const PORT = 4000
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
}

main()