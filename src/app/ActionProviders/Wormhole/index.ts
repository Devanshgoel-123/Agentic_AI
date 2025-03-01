const {
    QueryRequest,
    PerChainQueryRequest,
    EthCallQueryRequest,
 } = require('@wormhole-foundation/wormhole-query-sdk');
const { default: axios } = require('axios');
const web3 = require('web3');
    
async function getBalance(chainId: any, userAddress: any, tokenAddress: any, blockNumber: any) {
    const erc20Abi = [
    {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
    },
];
    
    const contract = new web3.Contract(erc20Abi, tokenAddress);
    const data = contract.methods.balanceOf(userAddress).encodeABI();
    console.log(data);
    const callData = {
    to: tokenAddress,
    data: data,
    }
    // Form the query request
     const request=new QueryRequest(
        0,
        [
            new PerChainQueryRequest(
                chainId,
                new EthCallQueryRequest(blockNumber,[callData])
            )
        ]
     );
  console.log(JSON.stringify(request,undefined,2))
    }

export default getBalance;