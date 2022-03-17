import { initListeners } from './bot';
import { bot } from './bot/bot'
import express from 'express'
import {findRequestCandidates} from './db';
import {getCandidateMessage} from './bot/replies';

const app = express()

initListeners(bot);

bot.launch().then(() => console.log('>> Bot ready'));

app.get('/', async (_, res) => {
  const candidates = await findRequestCandidates()
  for (let { offers, request } of candidates) {
    for (let offer of offers) {
      const { text, extra } = getCandidateMessage(offer, request)
      bot.telegram.sendMessage(offer.user.chatId, text, extra)
    }
  }
  res.status(200).end()
})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
