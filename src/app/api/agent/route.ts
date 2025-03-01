import {
    AgentKit,
    CdpWalletProvider,
    wethActionProvider,
    walletActionProvider,
    erc20ActionProvider,
    cdpApiActionProvider,
    cdpWalletActionProvider,
    pythActionProvider,
  } from "@coinbase/agentkit";
  import { ViemWalletProvider } from "@coinbase/agentkit";
  import { Network } from "@coinbase/agentkit";
  import { http } from "viem";
  import { getLangChainTools } from "@coinbase/agentkit-langchain";
  import { HumanMessage } from "@langchain/core/messages";
  import { MemorySaver } from "@langchain/langgraph";
  import { createReactAgent } from "@langchain/langgraph/prebuilt";
  import * as fs from "fs";
  import { ChatOpenAI } from "@langchain/openai";
  import * as dotenv from "dotenv";
  import { SYSTEM_PROMPT } from "@/utils/systemPrompt";
  import { createWalletClient } from "viem";
  import { z } from "zod";
  import { swapTool,fecthTokenAddressTool,fetchTokenDetailsTool,fetchTokenPriceInUsdTool } from "@/app/ActionProviders/Tools";
  import { baseSepolia, base} from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
  dotenv.config();

  export const MyActionSchema = z.object({
    myField: z.string(),
  });
  


  function validateEnvironment(): void {
    const missingVars: string[] = [];
    const requiredVars = [
      "OPENAI_API_KEY",
      "CDP_API_KEY_NAME",
      "CDP_API_KEY_PRIVATE_KEY",
    ];
    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });
  
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`,
      );
    }
  
    if (!process.env.NETWORK_ID) {
      console.warn("NETWORK_ID not set, defaulting to base-sepolia testnet");
    }
  }
  
  // File to persist wallet data
  const WALLET_DATA_FILE = "wallet_data.txt";
  
  // Initialize agent (runs once when the module is loaded)
  let agent: any;
  let agentConfig: any;
  let agentInitialized = false;
  let initializationPromise: Promise<void> | null = null; // Store the promise
  
  async function initializeAgent() {
    try {
      validateEnvironment();
    //   const llm = new ChatGoogleGenerativeAI({
    //     model: "gemini-1.5-flash",
    //     temperature: 0,
    //     apiKey: "AIzaSyDcw5-ryFamU1ljw1D5WuDNl7aNxvcGOFo", // Consider moving to process.env.GOOGLE_API_KEY
    //     maxRetries: 2,
    //     disableStreaming: false,
    //   });
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
      }).bindTools([swapTool,fetchTokenDetailsTool,fetchTokenPriceInUsdTool,fecthTokenAddressTool]);
   

      const account=privateKeyToAccount(
        `${process.env.PRIVATE_KEY_WALLET}` as `0x${string}`
      )
      const client = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http(),
      });
      
      // Load or initialize wallet data
      let walletDataStr: string | null = null;
      if (fs.existsSync(WALLET_DATA_FILE)) {
        try {
          walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
        } catch (error) {
          console.error("Error reading wallet data:", error);
        }
      }
  
      const config = {
        apiKeyName: process.env.CDP_API_KEY_NAME!,
        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        networkId: process.env.NETWORK_ID || "base-sepolia",
      };
  
      const walletProvider = new ViemWalletProvider(client)
      const agentkit = await AgentKit.from({
        walletProvider,
        actionProviders: [
          wethActionProvider(),
          pythActionProvider(),
          walletActionProvider(),
          erc20ActionProvider(),
          cdpApiActionProvider({
            apiKeyName: process.env.CDP_API_KEY_NAME!,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY!.replace(/\\n/g, "\n"),
          }),
          cdpWalletActionProvider({
            apiKeyName: process.env.CDP_API_KEY_NAME!,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY!.replace(/\\n/g, "\n"),
          }),
        ],
        
      });

      const tools = await getLangChainTools(agentkit);
      const memory = new MemorySaver();
      agentConfig = {
        configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
      };
  
      agent = createReactAgent({
        llm,
        checkpointSaver: memory,
        prompt: SYSTEM_PROMPT,
        tools
      });
  
      agentInitialized = true; // Mark as initialized
      console.log("Agent initialized successfully");
    } catch (error) {
      console.error("Failed to initialize agent:", error);
      throw error;
    }
  }
  
  initializationPromise = initializeAgent().catch((error) => {
    console.error("Agent initialization failed:", error);
  });
  
  export async function POST(request: Request) {
    if (!agentInitialized && initializationPromise) {
      console.log("Waiting for agent to initialize...");
      await initializationPromise;
    }

    if (!agent || !agentConfig) {
      return new Response(JSON.stringify({ error: "Agent not initialized" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const body = await request.json();
      console.log("Request body:", body); // Log the body
  
      const { prompt } = body;
      if (!prompt || typeof prompt !== "string") {
        return new Response(
          JSON.stringify({ error: "Prompt is required and must be a string" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
  
      const stream = await agent.stream(
        { messages: [new HumanMessage(prompt)] },
        agentConfig,
      );
  
      let response = "";
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          response += chunk.agent.messages[0].content;
        } else if ("tools" in chunk) {
          response += chunk.tools.messages[0].content;
        }
      }
  
      return new Response(JSON.stringify({ response }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  