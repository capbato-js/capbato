import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoApiService } from './TodoApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  TodoListResponse,
  TodoResponse,
  CreateTodoRequestDto,
  UpdateTodoRequestDto,
  TOKENS
} from '@nx-starter/application-shared';

// Mock API config
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: () => ({
    endpoints: {
      todos: {
        all: '/api/todos',
        base: '/api/todos',
        byId: (id: string) => `/api/todos/${id}`,
        active: '/api/todos/active',
        completed: '/api/todos/completed'
      }
    }
  })
}));

describe('TodoApiService', () => {
  let todoService: TodoApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    todoService = new TodoApiService(mockHttpClient);
  });

  describe('getAllTodos', () => {
    it('should get all todos successfully', async () => {
      const mockResponse: TodoListResponse = {
        success: true,
        data: [
          {
            id: 'todo-1',
            title: 'Test Todo',
            description: 'Test description',
            priority: 'medium',
            completed: false,
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await todoService.getAllTodos();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/todos');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(todoService.getAllTodos()).rejects.toThrow('Failed to fetch todos');
    });
  });

  describe('createTodo', () => {
    it('should create todo successfully', async () => {
      const todoData: CreateTodoRequestDto = {
        title: 'New Todo',
        description: 'New description',
        priority: 'high',
        dueDate: new Date()
      };

      const mockResponse: TodoResponse = {
        success: true,
        data: {
          id: 'new-todo-id',
          ...todoData,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await todoService.createTodo(todoData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/todos', todoData);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when creation fails', async () => {
      const todoData: CreateTodoRequestDto = {
        title: 'New Todo',
        description: 'New description',
        priority: 'high'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(todoService.createTodo(todoData)).rejects.toThrow('Failed to create todo');
    });
  });

  describe('updateTodo', () => {
    it('should update todo successfully', async () => {
      const updateData: UpdateTodoRequestDto = {
        title: 'Updated Todo',
        completed: true
      };

      const mockResponse = { status: 200 };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await todoService.updateTodo('todo-id', updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/todos/todo-id', updateData);
    });

    it('should throw error when update fails', async () => {
      const updateData: UpdateTodoRequestDto = {
        title: 'Updated Todo'
      };

      const mockResponse = { status: 400 };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(todoService.updateTodo('todo-id', updateData)).rejects.toThrow('Failed to update todo');
    });

    it('should throw error when update returns server error', async () => {
      const updateData: UpdateTodoRequestDto = {
        title: 'Updated Todo'
      };

      const mockResponse = { status: 500 };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(todoService.updateTodo('todo-id', updateData)).rejects.toThrow('Failed to update todo');
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo successfully', async () => {
      const mockResponse = { status: 200 };
      vi.mocked(mockHttpClient.delete).mockResolvedValue(mockResponse);

      await todoService.deleteTodo('todo-id');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/todos/todo-id');
    });

    it('should throw error when delete fails', async () => {
      const mockResponse = { status: 404 };
      vi.mocked(mockHttpClient.delete).mockResolvedValue(mockResponse);

      await expect(todoService.deleteTodo('todo-id')).rejects.toThrow('Failed to delete todo');
    });
  });

  describe('getTodoById', () => {
    it('should get todo by id successfully', async () => {
      const mockResponse: TodoResponse = {
        success: true,
        data: {
          id: 'todo-1',
          title: 'Test Todo',
          description: 'Test description',
          priority: 'medium',
          completed: false,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ 
        data: mockResponse,
        status: 200
      });

      const result = await todoService.getTodoById('todo-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/todos/todo-1');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when todo not found (404 status)', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ 
        data: { success: false },
        status: 404
      });

      await expect(todoService.getTodoById('non-existent')).rejects.toThrow('Todo not found');
    });

    it('should throw error when request fails (non-success response)', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ 
        data: { success: false },
        status: 200
      });

      await expect(todoService.getTodoById('todo-1')).rejects.toThrow('Failed to fetch todo');
    });

    it('should handle 404 errors from http client', async () => {
      const error = new Error('Request failed with status code 404');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      await expect(todoService.getTodoById('non-existent')).rejects.toThrow('Todo not found');
    });

    it('should re-throw non-404 errors', async () => {
      const error = new Error('Network error');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      await expect(todoService.getTodoById('todo-1')).rejects.toThrow('Network error');
    });
  });

  describe('getActiveTodos', () => {
    it('should get active todos successfully', async () => {
      const mockResponse: TodoListResponse = {
        success: true,
        data: [
          {
            id: 'todo-1',
            title: 'Active Todo',
            description: 'Active description',
            priority: 'high',
            completed: false,
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await todoService.getActiveTodos();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/todos/active');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(todoService.getActiveTodos()).rejects.toThrow('Failed to fetch active todos');
    });
  });

  describe('getCompletedTodos', () => {
    it('should get completed todos successfully', async () => {
      const mockResponse: TodoListResponse = {
        success: true,
        data: [
          {
            id: 'todo-1',
            title: 'Completed Todo',
            description: 'Completed description',
            priority: 'low',
            completed: true,
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await todoService.getCompletedTodos();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/todos/completed');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(todoService.getCompletedTodos()).rejects.toThrow('Failed to fetch completed todos');
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: null });

      await expect(todoService.getAllTodos()).rejects.toThrow();
    });

    it('should handle undefined response data', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: undefined });

      await expect(todoService.getAllTodos()).rejects.toThrow();
    });
  });
});