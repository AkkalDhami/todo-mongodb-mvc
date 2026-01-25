import Todo from "../models/todo.model";
import { ITodo } from "../types/todo";
import { ApiError } from "../utils/api-error";
import { UpdateTodoInputType } from "../validators/todo";

export class TodoService {
  static async createTodo({
    userId,
    title,
    description,
    completed
  }: Omit<ITodo, "createdAt" | "updatedAt" | "_id">): Promise<ITodo> {
    const todo = await Todo.create({ userId, title, description, completed });
    return todo;
  }

  static async getTodos(userId: string): Promise<ITodo[]> {
    const todos = await Todo.find({ userId });
    return todos;
  }

  static async getTodoById(todoId: string): Promise<ITodo | null> {
    const todo = await Todo.findById(todoId);
    return todo;
  }

  static async updateTodo(
    data: UpdateTodoInputType & { todoId: string; userId: string }
  ): Promise<ITodo | null> {
    const { todoId, userId, ...updateData } = data;

    const todo = await Todo.findById(todoId);
    if (!todo) {
      throw ApiError.notFound("Todo not found");
    }

    if (!todo || todo.userId.toString() !== userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    return await Todo.findByIdAndUpdate(todoId, updateData, {
      new: true
    });
  }

  static async deleteTodo(
    todoId: string,
    userId: string
  ): Promise<ITodo | null> {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      throw ApiError.notFound("Todo not found");
    }

    if (!todo || todo.userId.toString() !== userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    return await Todo.findByIdAndDelete(todoId);
  }
}
