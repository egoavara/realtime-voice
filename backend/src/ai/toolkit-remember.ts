import { VectorStoreToolkit, VectorStoreInfo } from "langchain/agents/toolkits";
import { BaseLanguageModelInterface } from "@langchain/core/language_models/base";



export class RememberToolkit extends VectorStoreToolkit {
    constructor(vectorStoreInfo: VectorStoreInfo, llm: BaseLanguageModelInterface){
        super(vectorStoreInfo, llm);
    }
}
