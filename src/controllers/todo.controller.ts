import { Response, NextFunction } from "express";
import { AsyncHandler } from "../utils/async-handler";
import { TodoInputType, UpdateTodoInputType } from "../validators/todo";
import { UserRequest } from "../types/user";
import { ApiError } from "../utils/api-error";
import { TodoService } from "../services/todo.service";
import { ApiResponse } from "../utils/api-response";

//? CREATE NEW TODO
export const createTodo = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { completed, title, description }: TodoInputType = req.body;
    const userId = req?.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todo = await TodoService.createTodo({
      userId,
      title,
      description,
      completed
    });

    return ApiResponse.created(res, "Todo created successfully", {
      todo
    });
  }
);

//? GET ALL TODOS FOR A USER
export const getTodos = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todos = await TodoService.getTodos(userId.toString());
    return ApiResponse.ok(res, "Todos fetched successfully", { todos });
  }
);

//? GET A TODO BY ID
export const getTodoById = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const todoId = req.params.id;
    const todo = await TodoService.getTodoById(todoId as string);
    if (!todo) {
      return next(ApiError.notFound("Todo not found"));
    }
    return ApiResponse.ok(res, "Todo fetched successfully", { todo });
  }
);

//? UPDATE A TODO BY ID
export const updateTodo = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const data: UpdateTodoInputType = req.body;
    const todoId = req.params.id;
    if (!todoId) {
      return next(ApiError.badRequest("Todo ID is required"));
    }

    const userId = req?.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todo = await TodoService.updateTodo({
      ...data,
      userId: userId.toString(),
      todoId: todoId as string
    });

    if (!todo) {
      return next(ApiError.server("Failed to update todo"));
    }

    return ApiResponse.ok(res, "Todo updated successfully", { todo });
  }
);

//? DELETE A TODO BY ID
export const deleteTodo = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const todoId = req.params.todoId;
    console.log({ todoId });
    const userId = req?.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todo = await TodoService.deleteTodo(
      todoId as string,
      userId.toString()
    );

    if (!todo) {
      return next(ApiError.server("Failed to delete todo"));
    }

    return ApiResponse.ok(res, "Todo deleted successfully");
  }
);
