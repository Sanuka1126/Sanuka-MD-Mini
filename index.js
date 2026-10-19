const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// BOT NAME
const BOT_NAME = "Sanuka-MD-Mini 🔥";

app.use(express.json());

// Pair Website Frontend - Gojo Theme
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>${BOT_NAME} - Pair Code</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{background:#0a0a0f;color:#fff;font-family:Arial;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
.card{background:#151520;padding:30px;border-radius:20px;box-shadow:0 0 20px #7c3aed;width:90%;max-width:400px;text-align:center;border:1px solid #7c3aed}
input{width:90%;padding:12px;border-radius:10px;border:none;margin:15px 0;background:#222;color:#fff}
button{background:#7c3aed;color:#fff;padding:12px 25px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;width:100%}
button:hover{background:#a855f7}
.code{margin-top:20px;font-size:28px;letter-spacing:3px;color:#a855f7;font-weight:bold}
</style>
</head>
<body>
<div class="card">
<h2>💜 ${BOT_NAME}</h2>
<p>Enter Your WhatsApp Number</p>
<input id="num" placeholder="9476xxxxxxx (country code ekka)" />
<button onclick="getCode()">Get Pair Code</button>
<div id="result" class="code"></div>
<p style="font-size:12px;margin-top:15px;color:#aaa">WhatsApp > Linked Devices > Link with phone number > Code eka danna</p>
</div>
<script>
async function getCode(){
  const n=document.getElementById('num').value;
  const r=document.getElementById('result');
  if(!n){r.innerText='Number eka danna!';return}
  r.innerText='Generating...⏳';
  const res=await fetch('/pair?number='+n);
  const data=await res.json();
  if(data.code){r.innerText=data.code} else {r.innerText=data.error||'Error!' }
}
</script>
</body>
</html>
  `);
});

// Pair Code Generator API
app.get('/pair', async (req, res) => {
  let num = req.query.number;
  if(!num) return res.json({error:'Number one!'});
  num = num.replace(/[^0-9]/g,'');
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_'+num);
    const sock = makeWASocket({
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"]
    });
    
    if(!sock.authState.creds.registered){
      let code = await sock.requestPairingCode(num);
      code = code.match(/.{1,4}/g).join('-');
      res.json({code: code});
    } else {
      res.json({error:'Already Paired!'});
    }
  } catch(e){
    res.json({error: e.message});
  }
});

app.listen(PORT, ()=> console.log(BOT_NAME + ' Live on port '+PORT));

// Bot Core - Start after pair (basic tagall sample)
async function startBot(){
  // Full bot logic eka meken passe add karamu
}

console.log(BOT_NAME + ' Pair Server Ready!');
