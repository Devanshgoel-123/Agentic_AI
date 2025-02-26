


export interface userChatWithAgent{
    quote:string;
    query:string;
    toolCalled?:boolean;
    outputString:string;
}


export interface ActiveTransactionResponse{
    quote:string;
    query:string;
    activeTransactionHash:string;
    outputString:string;
}