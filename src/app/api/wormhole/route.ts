import getBalance from "@/app/ActionProviders/Wormhole";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { chainId, userAddress, tokenAddress, blockNumber } = req.body;

    if (!chainId || !userAddress || !tokenAddress || !blockNumber) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const balance = await getBalance(chainId, userAddress, tokenAddress, blockNumber);
        return res.status(200).json({ balance });
    } catch (error) {
        return res.status(500).json({ error: error || 'Internal Server Error' });
    }
}
