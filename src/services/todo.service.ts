import mongoose from "mongoose";
import Todo from "../models/todo.model";
import { IPagination, ITodo, TodoFilterType } from "../types/todo";
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

  static async getTodos(userId: string, filters: TodoFilterType):
    Promise<{
      todos: ITodo[],
      pagination: IPagination
    }> {

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const search = filters.search || "";
    const sortBy = filters.sortBy || "desc";

    const skip = (page - 1) * limit;

    const todos = await Todo.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        }
      },
      {
        $sort: {
          createdAt: sortBy === "asc" ? 1 : -1
        }
      },
      {
        $skip: skip

      },
      {
        $limit: limit

      },

    ])

    const total = await Todo.countDocuments({ userId });
    const pages = Math.ceil(total / limit);

    return {
      todos,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
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
