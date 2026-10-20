const { default: makeWASocket, useMultiFileAuthState, delay, Browsers } = require("@whiskeysockets/baileys")
const P = require("pino")
const readline = require("readline")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth')
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" }),
        browser: Browsers.macOS("Chrome"),
        printQRInTerminal: false
    })

    if (!sock.authState.creds.registered) {
        console.log("\n--- Sanuka-MD-MINI Pair Code ---\n")
        const number = await question("add your phone number (94xxxxxxxxx): ")
        const code = await sock.requestPairingCode(number.replace(/[^0-9]/g, ''))
        console.log(`\n✅ Oya Pair Code eka: ${code}\n`)
        console.log("WhatsApp -> Linked Devices -> Link with phone number -> me code eka gahanna!")
        rl.close()
    }
    sock.ev.on("creds.update", saveCreds)
}
start()
