export interface Task {
  _id?: string;
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateTaskRequest {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
}

export interface UpdateTaskStatusRequest {
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
}
