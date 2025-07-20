import { BaseToolkit, StructuredToolInterface, tool, ToolSchemaBase } from "@langchain/core/tools";
import z from "zod";

const addTodoParam = z.object({
    todo: z.string().min(2).max(100)
})

const getTodoParam = z.object({
    id: z.number().min(1)
})

const delTodoParam = z.object({
    id: z.number().min(1)
})

const updateTodoParam = z.object({
    id: z.number().min(1),
    todo: z.string().min(2).max(100)
})

const findTodoParam = z.object({
    query: z.string().min(1)
});

export class TodoToolkit extends BaseToolkit {

    todos: Record<number, string> = {};
    tools: StructuredToolInterface<ToolSchemaBase, any, any>[];

    #idIncrementer = 0;

    constructor() {
        super();
        this.tools = [
            tool(
                this.addTodo,
                {
                    name: "addTodo",
                    description: "Add a new todo item, it should be a string with 2-100 characters, it will return the id of the new todo item",
                    schema: addTodoParam
                }
            ),
            tool(
                this.getTodo,
                {
                    name: "getTodo",
                    description: "Get a todo item by id, it will return the todo item if found",
                    schema: getTodoParam
                }
            ),
            tool(
                this.deleteTodo,
                {
                    name: "deleteTodo",
                    description: "Delete a todo item by id, it will return true if the item was deleted",
                    schema: delTodoParam
                }
            ),
            tool(
                this.updateTodo,
                {
                    name: "updateTodo",
                    description: "Update a todo item by id, it should be a string with 2-100 characters, it will return true if the item was updated",
                    schema: updateTodoParam
                }
            ),
            tool(
                this.getAllTodos,
                {
                    name: "getAllTodos",
                    description: "Get all todo items, it will return a list of todo items",
                    schema: z.object({})
                }
            ),
            tool(
                this.clearTodos,
                {
                    name: "clearTodos",
                    description: "Clear all todo items, it will return nothing",
                    schema: z.object({})
                }
            ),
            tool(
                this.findTodo,
                {
                    name: "findTodo",
                    description: "Find todo items by query, it will return a list of todo items that match the query",
                    schema: findTodoParam,
                }
            )
        ]
    }

    getTools(): StructuredToolInterface[] {
        return this.tools;
    }

    addTodo(param: z.infer<typeof addTodoParam>): number {
        const id = this.#genId();
        this.todos[id] = param.todo;
        return id;
    }

    getTodo(param: z.infer<typeof getTodoParam>): string | undefined {
        return this.todos[param.id];
    }

    deleteTodo(param: z.infer<typeof delTodoParam>): boolean {
        if (this.todos[param.id]) {
            delete this.todos[param.id];
            return true;
        }
        return false;
    }

    updateTodo(param: z.infer<typeof updateTodoParam>): boolean {
        if (this.todos[param.id]) {
            this.todos[param.id] = param.todo;
            return true;
        }
        return false;
    }

    getAllTodos(): Record<number, string> {
        return this.todos;
    }

    clearTodos(): void {
        this.todos = {};
    }

    findTodo(param: z.infer<typeof findTodoParam>): Record<number, string> {
        const result: Record<number, string> = {};
        for (const [id, todo] of Object.entries(this.todos)) {
            if (todo.includes(param.query)) {
                result[Number(id)] = todo;
            }
        }
        return result;
    }

    #genId(): number {
        return ++this.#idIncrementer;
    }
}
