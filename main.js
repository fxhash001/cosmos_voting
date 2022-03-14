const fs = require('fs')

const requestProxy = require("request").defaults({
  proxy: "http://127.0.0.1:7890",
  rejectUnauthorized: false,
})

const query_url = 'https://lcd-chain.keplr.app/gov/proposals?limit=1000'
const proposal_url = 'https://wallet.keplr.app/#/chain/governance?detailId='
const gov_url = 'https://wallet.keplr.app/#/chain/governance'

async function sync_proposals(chain, chain1) {
  console.log('\nsync proposals for chain ' + chain + ', url: ' + gov_url.replace('chain', chain1))
  let last_ids = []
  try {
    last_ids = JSON.parse(fs.readFileSync('./cache/' + chain + '.json').toString())
  } catch(err) {

  }

  let url = query_url.replace('chain', chain)
  let body = await synchronous_request(url)
  let proposals = JSON.parse(body).result
  let updated = false
  for (let proposal of proposals) {
    if (proposal.status == 1) continue //DEPOSIT PERIOD
    let id = parseInt(proposal.id)
    let title = proposal.content.value == undefined ? proposal.content.title : proposal.content.value.title
    let status = '' + proposal.status
    if (proposal.status == 2) status = 'VOTING'
    else if (proposal.status == 3) status = 'PASSED'
    else if (proposal.status == 4) status = 'REJECTED'
    let url = proposal_url.replace('chain', chain1) + id
    
    if (!last_ids.includes(id) || status == 'VOTING') {
      if (!last_ids.includes(id)) {
        status = '**** ' + status
        last_ids.push(id)
        updated = true
      } 

      console.log('\tproposal #' + id + ', tilte: ' + title)
      console.log('\t\tstatus: ' + status + ', url: ' + url)
      
    }
  }

  if (!updated) 
    console.log('\tno new proposals since last sync')
  else 
    fs.writeFileSync('./cache/' + chain + '.json', JSON.stringify(last_ids))
}

async function main() {
  await sync_proposals('cosmoshub', 'cosmoshub')
  await sync_proposals('osmosis', 'osmosis')
  await sync_proposals('secret', 'secret')
  await sync_proposals('juno', 'juno')
  await sync_proposals('akash', 'akashnet')
  await sync_proposals('umee', 'umee')
  await sync_proposals('stargaze', 'stargaze')
  //await sync_proposals('evmos', 'evmos')
}

// helper methods
let synchronous_request = function (url) {

  let options = {
    url: url,
  }

  return new Promise(function (resolve, reject) {
    // If you don't use proxy, require("request").get(...) is ok
    // require("request").get(options, function (error, response, body) {
    requestProxy.get(options, function (error, response, body) {
          if (error) {
              reject(error)
          } else {
              resolve(body)
          }
      })
  })

}


main()