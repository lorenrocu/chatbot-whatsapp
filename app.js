const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
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
}

main()