import { ActionProvider, WalletProvider, Network, CreateAction } from "@coinbase/agentkit";
import { z } from "zod";
export const MyActionSchema = z.object({
  myField: z.string(),
});

class GetAddress extends ActionProvider<WalletProvider> {
    constructor() {
        super("my-action-provider", []);
    }

    @CreateAction({
        name: "Get Address",
        description: "Gets the address",
        schema: MyActionSchema,
    })
    async myAction(walletProvider: WalletProvider, args: z.infer<typeof MyActionSchema>): Promise<string> {
        return walletProvider.getAddress()
    }

    supportsNetwork = (network: Network) => true;
}

export const myActionProvider = () => new GetAddress();