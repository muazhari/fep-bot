
import { getStore, setStore } from './store'
import * as line from '@line/bot-sdk';
import config from './config'

// create LINE SDK client
const client = new line.Client(config.line_bot)

const batch_list = {
  a: '22 - 27 JULI 2019',
  b: '29 JULI - 3 AGUSTUS 2019',
  c: '5 - 10 AGUSTUS 2019',
  d: '19 - 24 AGUSTUS 2019',
  e: '26 - 03 SEPTEMBER 2019',
}

const command_prefix = '.'

// main channel
export const handleEvent = async event => {
  console.log(event)

  handleCommand({ event })
}

const handleCommand = props => {
  const { event } = props
  const x = new Commands(props)
  
  const connectProps = {
    fepl: new FEPlist(),
    storeAdv: new StoreAdvance(),
    basic: new Basic()
  }
  
  const { fepl, storeAdv, basic } = connectProps

  const commandList = {
    add: fepl.add,
    upd: fepl.update,
    rem: fepl.remove,
    view: fepl.view,
    rstore: storeAdv.reset_store,
    pstore: storeAdv.pre_store,
    bstore: storeAdv.backup_store,
    ']]': basic.admin,
    help: basic.help,
  }

  const content_splitted = event.message.text.split(' ')
  const content_prefix = content_splitted[0][0]
  const content_command = content_splitted[0].slice(1, content_splitted[0].length)
  const content_args = content_splitted.slice(1, content_splitted.length).map(item => item.trim())
  // content_args.push(event)

  console.log(content_splitted,content_prefix,content_command,content_args)
  console.log(commandList[content_command])

  if (content_prefix === command_prefix && Object.keys(commandList).includes(content_command)) {
    if (commandList[content_command].length > 0) {
      commandList[content_command](content_args)
    } else {
      commandList[content_command]()
    }
  }
}

class Commands {
  constructor(props) {
    this.props = props
  }

  sendMessage = msg => {
    const echo = {
      type: 'text',
      text: msg,
    }
    return client.replyMessage(this.props.event.replyToken, echo)
  }
}

class Basic extends Commands {
  constructor(props) {
    super(props)
    this.event = this.props.event
  }

  admin = args => {
    const { source } = this.event
    if (Access.whitelist_check(source.userId)) {
      this.sendMessage('privilage: {}'.format(this.event))
    }
  }

  help = () => {
    const msg =
      '\n    add <batch> <name> <campus> <room> - .add a kamu Kemanggisan 000\n    upd <batch> <number> <name> <campus> <room> - .upd a 1 kamu Kemanggisan 000\n    del <batch> <number> - .del a 1\n    view <batch> - .view a / .view\n    '
    this.sendMessage(msg)
  }
}

class Access extends Commands {
  constructor(props) {
    super(props)
    this.event = this.props.event
  }

  blacklist_check = () => {
    const { source } = this.event
    const blocked_ids = ['C7b132b65f0db5c28c4b7563bd348d168', 'C2a14eb4c73958925b6a299fe6798b67b']
    const blocked_types = []
    const validate_sender =
      blocked_ids.includes(source.userId) && blocked_types.includes(source.type)
    return validate_sender
  }

  whitelist_check = () => {
    const { source } = this.event
    const allowed_ids = ['U016bfe22df53b903b404a80efdd8ec65', 'localuser']
    const allowed_types = []
    const validate_sender =
      allowed_ids.includes(source.userId) && allowed_types.includes(source.type)
    return validate_sender
  }
}

class FEPlist extends Commands {
  constructor(props) {
    super(props)
    this.event = this.props.event
  }

  add = args => {
    if (args.length === 5) {
      const data = {
        batch: args[0],
        name: args[1],
        campus: args[2],
        room: args[3],
        user_id: this.event.source.userId,
      }
      FepStoreCRUD.set_store(data)

      FepStoreCRUD.view([args[0], args[args.length - 1]])

      Access.backup_store('silent')
    } else {
      this.sendMessage(`${command_prefix}add <batch> <name> <campus> <room>`)
    }
  }

  update = args => {
    if (args.length === 6) {
      const data = {
        batch: args[0],
        num: args[1],
        name: args[2],
        campus: args[3],
        room: args[4],
        user_id: this.event.source.userId,
      }
      FepStoreCRUD.update_store(data)
      this.sendMessage('Done!')
      StoreBackup.backup_store('silent')
    } else {
      this.sendMessage(`${command_prefix}upd <batch> <number> <name> <campus> <room>`)
    }
  }

  remove = args => {
    if (args.length === 3) {
      const data = {
        batch: args[0],
        num: args[1],
        user_id: this.event.source.userId,
      }
      FepStoreCRUD.delete_store(data)
      this.sendMessage('Done!')
      StoreBackup.backup_store('silent')
    } else {
      this.sendMessage(`${command_prefix}del <batch> <number>`)
    }
  }

  view = args => {
    if (args.length <= 2) {
      const data = {
        batch: args[0].toString().toLowerCase(),
        user_id: this.event.source.userId,
      }
      const store = getStore('fep')
      if (store) {
        const selected_batch = args.length === 0 ? Object.keys(store).sort() : [data.batch]

        if (selected_batch.every(item => Object.keys(store).includes(item))) {
          const header = 'FEP BINUSIAN IT\n(Nama - Kampus - Nomor Ruangan)\n\n'

          selected_batch.map(batch => {
            let msg = `${header} ${batch.upper()} ${batch_list[batch]}\n`

            for (let i = 0; i < store.batch.length; i += 1) {
              msg += `${i + 1}. ${store.batch[i][0]} - ${store.batch[i][1]} - ${
                store.batch[i][2]
              }\n`
            }

            msg += '\n'
            this.sendMessage(msg)
          })
        }
      }
    } else {
      this.sendMessage(`${command_prefix}view <batch>`)
    }
  }
}

class FepStoreCRUD extends Commands {
  constructor(props) {
    super(props)
    this.event = this.props.event
  }

  set_store = data => {
    if (Object.keys(batch_list).includes(data.batch)) {
      const store = getStore('fep')
      if (Object.keys(store).includes(data.batch)) {
        store[data.batch] = []
      }
      const selected_user_data = [data.name, data.campus, data.room]
      store[data.batch].push(selected_user_data)

      setStore({ fep: store })
    }
  }

  update_store = data => {
    if (Object.keys(batch_list).includes(data.batch)) {
      const store = getStore('fep')
      try {
        const selected_user_data = [data.name, data.campus, data.room]
        store[data.batch][parseInt(data.num, 10) - 1] = selected_user_data
        setStore({ fep: store })
      } catch (err) {
        this.set_store(data)
      }
    }
  }

  delete_store = data => {
    const store = getStore('fep')

    if (store[data.batch].length > 0) {
      store[data.batch].splice(parseInt(data.num, 10) - 1, 1)
    }
    setStore({ fep: store })
  }
}

class StoreAdvance extends Commands {
  constructor(props) {
    super(props)
    this.event = this.props.event
  }

  reset_store = data => {
    const { storeName } = data
    setStore({ [storeName]: {} })
    this.sendMessage('Done!')
  }

  pre_store = args => {
    if (args.length <= 2) {
      const default_url =
        'https://gist.githubusercontent.com/muazhari/38a5819eb228a20a693db0516e76bedb/raw/5fe8b969ab5d3286f31026951edbb73ea030b460/feplist'
      const data = {
        url: args.length === 1 ? default_url : args[0],
        user_id: args[args.length - 1].source.userId,
      }
      // const feplc = cleaner(data.url)
      // feplc.run()
      // const { store } = feplc
      // setStore({ fep: store })
      this.sendMessage('Done!')
    } else {
      this.sendMessage(`${command_prefix}pre_store <url>`)
    }
  }
}

class StoreBackup extends Commands {
  constructor(props) {
    super(props)
    this.event = this.props.event
  }

  backup_store = args => {
    const headers = {
      'Content-type': 'application/json',
    }

    const store = getStore()
    const { backup } = store

    if (backup.fep) {
      backup.fep = []
    } else {
      backup.fep.slice(-20)
    }
    const response = requests.post('https://paste.c-net.org/')
    if (args === null || args !== 'silent') {
      this.sendMessage(`Done!\n${response.text}`)
    }
    backup.fep.push([[Date.now(), response]])

    setStore({ ...store, backup })
  }
}
