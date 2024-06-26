import { Button, Frog, TextInput, parseEther } from 'frog'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

import { abi } from './abi.js'

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub API URL to enable frame verification.
  // hubApiUrl: 'https://api.hub.wevm.dev',
})

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    action: '/finish',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [<Button value="apple">Apple</Button>,
    <Button.Transaction target="/send-ether">Send Ether</Button.Transaction>,
    <Button.Transaction target="/create">Create</Button.Transaction>,
    <Button.Reset>Reset</Button.Reset>,
    ],
  })
})


app.frame('/finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    )
  })
})
app.transaction('/send-ether', (c) => {
  console.log('send-ether')
  // Send transaction response.
  return c.send({
    chainId: 'eip155:84532',
    to: '0xF065F8F230bFe7f2DfcfE716Bded22Ace33a7d4B',
    value: parseEther('0.01'),
  })
})

app.transaction('/create', (c) => {
  // Contract transaction response.
  return c.contract({
    abi,
    chainId: 'eip155:84532',
    functionName: 'registerNewFrame',
    args: [],
    to: '0xF065F8F230bFe7f2DfcfE716Bded22Ace33a7d4B',
    value: parseEther("0.01")
  })
})

export const GET = handle(app)
export const POST = handle(app)
