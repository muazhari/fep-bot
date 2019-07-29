import fs from 'fs'
import path from 'path'
import cp from 'child_process'
import { Bot } from './internal'

// base URL for webhook server
export const baseURL = process.env.BASE_URL

export const batch_list = {
  a: '22 - 27 JULI 2019',
  b: '29 JULI - 3 AGUSTUS 2019',
  c: '5 - 10 AGUSTUS 2019',
  d: '19 - 24 AGUSTUS 2019',
  e: '26 - 03 SEPTEMBER 2019',
}

export const command_prefix = '/'

const messageToCommandValidate = chat => {
  const content_command = chat[0].slice(1, chat[0].length)
  const content_args = chat.slice(1, chat.length).map(item => item.trim())

  console.log(content_command, content_args)

  return { content_command, content_args }
}

const handleCommand = (commandList, chat) => {
  const content_prefix = chat[0][0]
  if (content_prefix === command_prefix) {
    const { content_command, content_args } = messageToCommandValidate(chat)
    if (Object.keys(commandList).includes(content_command)) {
      if (commandList[content_command].length >= 1) {
        commandList[content_command](content_args)
      } else {
        commandList[content_command]()
      }
    }
  }
}

export const Handler = event => {
  console.log(event)
  // if (event.source.userId === 'U016bfe22df53b903b404a80efdd8ec65') {

  const Worker = new Bot({ event })
  // Worker.log()
  // Worker.Command.StoreAdvance.pre_store([])

  switch (event.type) {
    case 'message':
      const { message } = event
      switch (message.type) {
        case 'text':
          return handleText(Worker)
        case 'image':
          return handleImage(Worker)
        case 'video':
          return handleVideo(Worker)
        case 'audio':
          return handleAudio(Worker)
        case 'location':
          return handleLocation(Worker)
        case 'sticker':
          return handleSticker(Worker)
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`)
      }

    case 'memberJoined':
      return Worker.client.getProfile(event.joined.members[0].userId).then(profile => {
        Worker.replyText(`Welcome ${profile.displayName}! Jangan lupa cek notes di group ya!`)
      })

    case 'follow':
      return Worker.replyText('Got followed event')

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`)

    case 'join':
      return Worker.replyText(`Joined ${event.source.type}`)

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`)

    case 'postback':
      let { data } = event.postback
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`
      }
      return Worker.replyText(`Got postback: ${data}`)

    case 'beacon':
      return Worker.replyText(`Got beacon: ${event.beacon.hwid}`)

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`)
  }
  // }
}

const handleText = Bot => {
  const { message, replyToken, source } = Bot.props.event
  const { FEPList, StoreAdvance, Basic, Template } = Bot.Command

  const commandList = {
    add: FEPList.add,
    upd: FEPList.update,
    rem: FEPList.remove,
    view: FEPList.view,
    rstore: StoreAdvance.reset_store,
    pstore: StoreAdvance.pre_store,
    bstore: StoreAdvance.backup_store,
    ']]': Basic.admin,
    help: Basic.help,
    button: Template.button,
    profile: Basic.profile,
    confirm: Template.confirm,
    bifest: Template.bifest,
    greet: Basic.greet,
  }

  const chat_splitted = message.text.split(' ')
  handleCommand(commandList, chat_splitted)
}

const handleImage = async Bot => {
  const { message, replyToken } = Bot.props.event
  let getContent

  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(
      __dirname,
      '../../src/Bot/Assets/downloaded',
      `${message.id}.jpg`
    )
    const previewPath = path.join(
      __dirname,
      '../../src/Bot/Assets/downloaded',
      `${message.id}-preview.jpg`
    )

    getContent = Bot.downloadContent(message.id, downloadPath)
      .then(downloadPath => {
        console.log('premature_resolve', downloadPath)
        cp.execSync(`convert -resize 240x jpg:${downloadPath} jpg:${previewPath}`)
        return {
          originalContentUrl: `${baseURL}/downloaded/${path.basename(downloadPath)}`,
          previewImageUrl: `${baseURL}/downloaded/${path.basename(previewPath)}`,
        }
      })
      .catch(err => {
        throw err
      })
  } else if (message.contentProvider.type === 'external') {
    getContent = Promise.resolve(message.contentProvider)
  }

  return getContent.then(({ originalContentUrl, previewImageUrl }) => {
    console.log({ originalContentUrl, previewImageUrl })
    // Bot.client.replyMessage({
    //   type: "image",
    //   originalContentUrl,
    //   previewImageUrl
    // });
  })
}

const handleVideo = Bot => {
  const { message, replyToken } = Bot.props.event
  let getContent
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(
      __dirname,
      '../../src/Bot/Assets/downloaded',
      `${message.id}.mp4`
    )
    const previewPath = path.join(
      __dirname,
      '../../src/Bot/Assets/downloaded',
      `${message.id}-preview.jpg`
    )

    getContent = Bot.downloadContent(message.id, downloadPath).then(downloadPath => {
      // FFmpeg and ImageMagick is needed here to run 'convert'
      // Please consider about security and performance by yourself
      cp.execSync(`convert mp4:${downloadPath}[0] jpeg:${previewPath}`)

      return {
        originalContentUrl: `${baseURL}/downloaded/${path.basename(downloadPath)}`,
        previewImageUrl: `${baseURL}/downloaded/${path.basename(previewPath)}`,
      }
    })
  } else if (message.contentProvider.type === 'external') {
    getContent = Promise.resolve(message.contentProvider)
  }

  return getContent.then(({ originalContentUrl, previewImageUrl }) => {
    // Bot.client.replyMessage({
    //   type: "video",
    //   originalContentUrl,
    //   previewImageUrl
    // });
  })
}

const handleAudio = Bot => {
  const { message, replyToken } = Bot.props.event
  let getContent
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(
      __dirname,
      '../../src/Bot/Assets/downloaded',
      `${message.id}.m4a`
    )

    getContent = Bot.downloadContent(message.id, downloadPath).then(downloadPath => {
      return {
        originalContentUrl: `${baseURL}/downloaded/${path.basename(downloadPath)}`,
      }
    })
  } else {
    getContent = Promise.resolve(message.contentProvider)
  }

  return getContent.then(({ originalContentUrl }) => {
    // Bot.client.replyMessage({
    //   type: "audio",
    //   originalContentUrl,
    //   duration: message.duration
    // });
  })
}

const handleLocation = Bot => {
  const { message, replyToken } = Bot.props.event
  Bot.client.replyMessage({
    type: 'location',
    title: message.title,
    address: message.address,
    latitude: message.latitude,
    longitude: message.longitude,
  })
}

const handleSticker = Bot => {
  const { message, replyToken } = Bot.props.event
  // Bot.client.replyMessage({
  //   type: "sticker",
  //   packageId: message.packageId,
  //   stickerId: message.stickerId
  // });
}
