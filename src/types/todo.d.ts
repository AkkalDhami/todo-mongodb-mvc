export interface ITodo {
  _id: Tstring;
  userId: Tstring;
  title: string;
  description?: string;
  completed: boolean;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

type TodoFilterType = {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: "asc" | "desc"
};