const chai = require('chai')
const {expect} = require('chai')
const BN = require('bn.js')
chai.use(require('chai-bn')(BN))

describe('RandomNumberConsumer Integration Tests', async function () {

  let randomNumberConsumer, seed

  beforeEach(async () => {
      seed = 123
      const RandomNumberConsumer = await deployments.get('RandomNumberConsumer')
      randomNumberConsumer = await ethers.getContractAt('RandomNumberConsumer', RandomNumberConsumer.address)
  })

  it('Should successfully make a VRF request and get a result', async () => {
    const transaction = await randomNumberConsumer.getRandomNumber(seed)
    const tx_receipt = await transaction.wait()
    const requestId = tx_receipt.events[2].topics[1]

    //wait 30 secs for oracle to callback
    await new Promise(resolve => setTimeout(resolve, 30000))

    const result= await randomNumberConsumer.randomResult()
    console.log("VRF Result: ", new web3.utils.BN(result._hex).toString())
    expect(new web3.utils.BN(result._hex)).to.be.a.bignumber.that.is.greaterThan(new web3.utils.BN(0))
  })
})