export interface TaskToSend {
  projectId: number,
  title: string,
  description?: string,
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'normal' | 'high';
  assigneeId: number,
  dueDate: string,
  orderIndex: 0
}


export interface TaskFromServer {
  id?: number;
  project_id: number;   
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'normal' | 'high';
  assignee_id: number;      
  due_date: string;         
  order_index: number;      
  created_at?: string;      
  updated_at?: string;      
}


export interface UpdateTask {
  status: string,
  priority?: string
}
