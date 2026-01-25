import { Router } from "express";
import { verifyAuthentication } from "../middlewares/verify-auth";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo
} from "../controllers/todo.controller";
import { validateRequest } from "../middlewares/validate-request";
import { TodoSchema, UpdateTodoSchema } from "../validators/todo";
import { checkUserAccountRestriction } from "../middlewares/user-account-restriction";
import { validateObjectId } from "../middlewares/validate-id";
const router = Router();

router.post(
  "/",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateRequest(TodoSchema),
  createTodo
);

router.get("/", verifyAuthentication, checkUserAccountRestriction, getTodos);

router.get(
  "/:todoId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("todoId"),
  getTodoById
);

router.patch(
  "/:todoId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("todoId"),
  validateRequest(UpdateTodoSchema),
  updateTodo
);

router.delete(
  "/:todoId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("todoId"),
  deleteTodo
);

export default router;
