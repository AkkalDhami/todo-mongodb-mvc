export interface ITodo {
  _id: Tstring;
  userId: Tstring;
  title: string;
  description?: string;
  completed: boolean;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}
