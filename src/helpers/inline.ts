// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
const fuzzysearch = require('fuzzysearch')

export function setupInline(bot: Telegraf<ContextMessageUpdate>) {
  bot.on('inline_query', async ({ inlineQuery, answerInlineQuery, dbuser }) => {
    const offset = parseInt(inlineQuery.offset) || 0
    let templates = dbuser.templates
    if (inlineQuery.query) {
      templates = templates.filter(t => fuzzysearch(inlineQuery.query, t.text))
    }
    templates = templates.splice(offset, 30)
    const results = templates.map(template => ({
      type: 'article',
      id: template.name,
      title: template.name,
      description: template.text,
      input_message_content: {
        message_text: template.text,
      },
      is_personal: true,
    }))
    return answerInlineQuery(results, { next_offset: `${offset + 30}` })
  })
}
