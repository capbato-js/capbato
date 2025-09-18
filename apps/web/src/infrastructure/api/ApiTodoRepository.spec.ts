import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiTodoRepository } from './ApiTodoRepository';
import { ITodoApiService } from './ITodoApiService';
import { 
  TodoListResponse, 
  TodoResponse, 
  TodoDto
} from '@nx-starter/application-shared';
import { Todo, Specification } from '@nx-starter/domain';

describe('ApiTodoRepository', () => {
  let repository: ApiTodoRepository;
  let mockApiService: ITodoApiService;

  const mockTodoDto: TodoDto = {
    id: '550e8400e29b41d4a716446655440001',
    title: 'Test Todo',
    completed: false,
    priority: 'medium',
    createdAt: '2023-01-01T00:00:00Z',
    dueDate: '2023-01-31T00:00:00Z'
  };

    // Mock domain entities
  const mockTodo = new Todo(
    'Buy groceries',
    false,
    new Date('2023-01-01'),
    '550e8400e29b41d4a716446655440000', // Valid UUID (32 hex chars without hyphens)
    'high',
    new Date('2024-12-31')
  );

  beforeEach(() => {
    mockApiService = {
      getAllTodos: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      getTodoById: vi.fn(),
      getActiveTodos: vi.fn(),
      getCompletedTodos: vi.fn()
    };

    repository = new ApiTodoRepository(mockApiService);
  });

  describe('getAll', () => {
    it('should get all todos and map them to domain entities', async () => {
      const mockResponse: TodoListResponse = {
        success: true,
        data: [mockTodoDto]
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(mockApiService.getAllTodos).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].title.value).toBe('Test Todo');
      expect(result[0].completed).toBe(false);
      expect(result[0].priority.level).toBe('medium');
      expect(result[0].stringId).toBe('550e8400e29b41d4a716446655440001');
    });

    it('should handle empty response', async () => {
      const mockResponse: TodoListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(result).toHaveLength(0);
    });

    it('should handle todos with missing optional fields', async () => {
      const todoWithoutOptionals: TodoDto = {
        id: '550e8400e29b41d4a716446655440002',
        title: 'Simple Todo',
        completed: true,
        createdAt: '2023-01-01T00:00:00Z'
      };

      const mockResponse: TodoListResponse = {
        success: true,
        data: [todoWithoutOptionals]
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].title.value).toBe('Simple Todo');
      expect(result[0].completed).toBe(true);
      expect(result[0].priority.level).toBe('medium'); // Default priority
      expect(result[0].dueDate).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create todo and return ID', async () => {
      const mockResponse: TodoResponse = {
        success: true,
        data: { ...mockTodoDto, id: '550e8400e29b41d4a716446655440003' }
      };

      vi.mocked(mockApiService.createTodo).mockResolvedValue(mockResponse);

      const result = await repository.create(mockTodo);

      expect(mockApiService.createTodo).toHaveBeenCalledWith({
        title: 'Buy groceries',
        priority: 'high',
        dueDate: '2024-12-31T00:00:00.000Z'
      });
      expect(result).toBe('550e8400e29b41d4a716446655440003');
    });

    it('should create todo without due date', async () => {
      const todoWithoutDueDate = new Todo(
        'Todo without due date',
        false,
        new Date('2023-01-01'),
        undefined,
        'high'
      );

      const mockResponse: TodoResponse = {
        success: true,
        data: { ...mockTodoDto, id: '550e8400e29b41d4a716446655440004' }
      };

      vi.mocked(mockApiService.createTodo).mockResolvedValue(mockResponse);

      const result = await repository.create(todoWithoutDueDate);

      expect(mockApiService.createTodo).toHaveBeenCalledWith({
        title: 'Todo without due date',
        priority: 'high',
        dueDate: undefined
      });
      expect(result).toBe('550e8400e29b41d4a716446655440004');
    });
  });

  describe('update', () => {
    it('should update todo with all fields', async () => {
      const changes: Partial<Todo> = {
        title: { value: 'Updated Title' } as Todo['title'],
        completed: true,
        priority: { level: 'high' } as Todo['priority'],
        dueDate: new Date('2023-02-01')
      };

      vi.mocked(mockApiService.updateTodo).mockResolvedValue();

      await repository.update('1', changes);

      expect(mockApiService.updateTodo).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        completed: true,
        priority: 'high',
        dueDate: '2023-02-01T00:00:00.000Z'
      });
    });

    it('should update todo with simple string title', async () => {
      const changes: Partial<Todo> = {
        title: 'Simple string title' as unknown as Todo['title']
      };

      vi.mocked(mockApiService.updateTodo).mockResolvedValue();

      await repository.update('1', changes);

      expect(mockApiService.updateTodo).toHaveBeenCalledWith('1', {
        title: 'Simple string title'
      });
    });

    it('should update todo with simple priority level', async () => {
      const changes: Partial<Todo> = {
        priority: 'low' as unknown as Todo['priority']
      };

      vi.mocked(mockApiService.updateTodo).mockResolvedValue();

      await repository.update('1', changes);

      expect(mockApiService.updateTodo).toHaveBeenCalledWith('1', {
        priority: 'low'
      });
    });

    it('should handle undefined due date', async () => {
      const changes: Partial<Todo> = {
        dueDate: undefined
      };

      vi.mocked(mockApiService.updateTodo).mockResolvedValue();

      await repository.update('1', changes);

      expect(mockApiService.updateTodo).toHaveBeenCalledWith('1', {
        dueDate: undefined
      });
    });

    it('should update only completed status', async () => {
      const changes: Partial<Todo> = {
        completed: false
      };

      vi.mocked(mockApiService.updateTodo).mockResolvedValue();

      await repository.update('1', changes);

      expect(mockApiService.updateTodo).toHaveBeenCalledWith('1', {
        completed: false
      });
    });

    it('should handle empty changes', async () => {
      const changes: Partial<Todo> = {};

      vi.mocked(mockApiService.updateTodo).mockResolvedValue();

      await repository.update('1', changes);

      expect(mockApiService.updateTodo).toHaveBeenCalledWith('1', {});
    });
  });

  describe('delete', () => {
    it('should delete todo', async () => {
      vi.mocked(mockApiService.deleteTodo).mockResolvedValue();

      await repository.delete('1');

      expect(mockApiService.deleteTodo).toHaveBeenCalledWith('1');
    });
  });

  describe('getById', () => {
    it('should get todo by ID', async () => {
      const mockResponse: TodoResponse = {
        success: true,
        data: mockTodoDto
      };

      vi.mocked(mockApiService.getTodoById).mockResolvedValue(mockResponse);

      const result = await repository.getById('1');

      expect(mockApiService.getTodoById).toHaveBeenCalledWith('1');
      expect(result).toBeDefined();
      expect(result?.title.value).toBe('Test Todo');
      expect(result?.stringId).toBe('550e8400e29b41d4a716446655440001');
    });

    it('should return undefined when todo not found', async () => {
      const error = new Error('Todo not found');
      vi.mocked(mockApiService.getTodoById).mockRejectedValue(error);

      const result = await repository.getById('nonexistent');

      expect(result).toBeUndefined();
    });

    it('should rethrow non-"not found" errors', async () => {
      const error = new Error('Network error');
      vi.mocked(mockApiService.getTodoById).mockRejectedValue(error);

      await expect(repository.getById('1')).rejects.toThrow('Network error');
    });
  });

  describe('getActive', () => {
    it('should get active todos', async () => {
      const activeTodo: TodoDto = {
        ...mockTodoDto,
        completed: false
      };

      const mockResponse: TodoListResponse = {
        success: true,
        data: [activeTodo]
      };

      vi.mocked(mockApiService.getActiveTodos).mockResolvedValue(mockResponse);

      const result = await repository.getActive();

      expect(mockApiService.getActiveTodos).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(false);
    });

    it('should handle empty active todos', async () => {
      const mockResponse: TodoListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockApiService.getActiveTodos).mockResolvedValue(mockResponse);

      const result = await repository.getActive();

      expect(result).toHaveLength(0);
    });
  });

  describe('getCompleted', () => {
    it('should get completed todos', async () => {
      const completedTodo: TodoDto = {
        ...mockTodoDto,
        completed: true
      };

      const mockResponse: TodoListResponse = {
        success: true,
        data: [completedTodo]
      };

      vi.mocked(mockApiService.getCompletedTodos).mockResolvedValue(mockResponse);

      const result = await repository.getCompleted();

      expect(mockApiService.getCompletedTodos).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
    });
  });

  describe('findBySpecification', () => {
    it('should filter todos by specification', async () => {
      const mockGetAllResponse: TodoListResponse = {
        success: true,
        data: [
          {
            id: '550e8400e29b41d4a716446655440005',
            title: 'High priority todo',
            completed: false,
            priority: 'high',
            createdAt: new Date().toISOString()
          },
          {
            id: '550e8400e29b41d4a716446655440006',
            title: 'Medium priority todo',
            completed: false,
            priority: 'medium',
            createdAt: new Date().toISOString()
          },
          {
            id: '550e8400e29b41d4a716446655440007',
            title: 'Low priority todo',
            completed: false,
            priority: 'low',
            createdAt: new Date().toISOString()
          }
        ]
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockGetAllResponse);

      // Mock specification that only returns high priority todos
      class MockHighPrioritySpecification extends Specification<Todo> {
        isSatisfiedBy(todo: Todo): boolean {
          return todo.priority.level === 'high';
        }
      }

      const mockSpecification = new MockHighPrioritySpecification();

      const result = await repository.findBySpecification(mockSpecification);

      expect(mockApiService.getAllTodos).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].priority.level).toBe('high');
    });

    it('should return empty array when no todos match specification', async () => {
      const mockGetAllResponse: TodoListResponse = {
        success: true,
        data: [
          {
            id: '550e8400e29b41d4a716446655440008',
            title: 'Medium priority todo',
            completed: false,
            priority: 'medium',
            createdAt: new Date().toISOString()
          }
        ]
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockGetAllResponse);

      // Mock specification that never matches
      class MockNeverMatchSpecification extends Specification<Todo> {
        isSatisfiedBy(): boolean {
          return false;
        }
      }

      const mockSpecification = new MockNeverMatchSpecification();

      const result = await repository.findBySpecification(mockSpecification);

      expect(result).toHaveLength(0);
    });
  });

  describe('mapDtoToTodo', () => {
    it('should map DTO with all fields correctly', async () => {
      const fullDto: TodoDto = {
        id: '550e8400e29b41d4a716446655440009',
        title: 'Test mapping',
        completed: true,
        priority: 'high',
        createdAt: '2023-01-01T00:00:00Z',
        dueDate: '2023-01-31T00:00:00Z'
      };

      const mockResponse: TodoListResponse = {
        success: true,
        data: [fullDto]
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockResponse);

      const result = await repository.getAll();
      const todo = result[0];

      expect(todo.title.value).toBe('Test mapping');
      expect(todo.completed).toBe(true);
      expect(todo.priority.level).toBe('high');
      expect(todo.stringId).toBe('550e8400e29b41d4a716446655440009');
      expect(todo.createdAt).toEqual(new Date('2023-01-01T00:00:00Z'));
      expect(todo.dueDate).toEqual(new Date('2023-01-31T00:00:00Z'));
    });

    it('should handle missing priority with default', async () => {
      const dtoWithoutPriority: TodoDto = {
        id: '550e8400e29b41d4a71644665544000a',
        title: 'No priority todo',
        completed: false,
        createdAt: '2023-01-01T00:00:00Z'
      };

      const mockResponse: TodoListResponse = {
        success: true,
        data: [dtoWithoutPriority]
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockResponse);

      const result = await repository.getAll();
      const todo = result[0];

      expect(todo.priority.level).toBe('medium'); // Default priority
    });

    it('should handle missing due date', async () => {
      const dtoWithoutDueDate: TodoDto = {
        id: '550e8400e29b41d4a71644665544000b',
        title: 'No due date todo',
        completed: false,
        createdAt: '2023-01-01T00:00:00Z'
      };

      const mockResponse: TodoListResponse = {
        success: true,
        data: [dtoWithoutDueDate]
      };

      vi.mocked(mockApiService.getAllTodos).mockResolvedValue(mockResponse);

      const result = await repository.getAll();
      const todo = result[0];

      expect(todo.dueDate).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle API errors in getAll', async () => {
      vi.mocked(mockApiService.getAllTodos).mockRejectedValue(new Error('API Error'));

      await expect(repository.getAll()).rejects.toThrow('API Error');
    });

    it('should handle API errors in create', async () => {
      vi.mocked(mockApiService.createTodo).mockRejectedValue(new Error('Create Error'));

      await expect(repository.create(mockTodo)).rejects.toThrow('Create Error');
    });

    it('should handle API errors in update', async () => {
      vi.mocked(mockApiService.updateTodo).mockRejectedValue(new Error('Update Error'));

      await expect(repository.update('1', {})).rejects.toThrow('Update Error');
    });

    it('should handle API errors in delete', async () => {
      vi.mocked(mockApiService.deleteTodo).mockRejectedValue(new Error('Delete Error'));

      await expect(repository.delete('1')).rejects.toThrow('Delete Error');
    });

    it('should handle API errors in getActive', async () => {
      vi.mocked(mockApiService.getActiveTodos).mockRejectedValue(new Error('Active Error'));

      await expect(repository.getActive()).rejects.toThrow('Active Error');
    });

    it('should handle API errors in getCompleted', async () => {
      vi.mocked(mockApiService.getCompletedTodos).mockRejectedValue(new Error('Completed Error'));

      await expect(repository.getCompleted()).rejects.toThrow('Completed Error');
    });

    it('should handle API errors in findBySpecification', async () => {
      vi.mocked(mockApiService.getAllTodos).mockRejectedValue(new Error('Specification Error'));

      class MockSpecification extends Specification<Todo> {
        isSatisfiedBy(): boolean {
          return false;
        }
      }

      const mockSpecification = new MockSpecification();

      await expect(repository.findBySpecification(mockSpecification)).rejects.toThrow('Specification Error');
    });
  });
});