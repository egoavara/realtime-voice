import { VectorStoreToolkit, VectorStoreInfo } from "langchain/agents/toolkits";
import { BaseLanguageModelInterface } from "@langchain/core/language_models/base";
import z from "zod";
import { th } from "zod/v4/locales";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";



export class RememberToolkit extends VectorStoreToolkit {
    mcpServer: McpServer;
    mcpServerTransport: InMemoryTransport;
    mcpClientTransport: InMemoryTransport;
    
    constructor(vectorStoreInfo: VectorStoreInfo, llm: BaseLanguageModelInterface){
        super(vectorStoreInfo, llm);
        this.mcpServer = new McpServer({
            name: "remember",
            description: "This toolkit provides basic memory management functions. you can remember, forget, and recall information by human readable text.",
            version: "1.0.0",
            title: "Remember Toolkit",
        })
        for (const tool of this.getTools()) {
            this.mcpServer.tool(
                tool.name,
                tool.description,
                (tool.schema as unknown as z.ZodObject<any>).shape,
                tool.invoke as unknown as (params: any) => Promise<any>
            );
        }
        [this.mcpClientTransport, this.mcpServerTransport] = InMemoryTransport.createLinkedPair();
    }
}
