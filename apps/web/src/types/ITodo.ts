interface ITodo {
  id: number;
  done: boolean;
  subject: string;
  startTime: Date;
  listId?: number;
  endTime?: Date;
  isAllDay?: boolean;
  recurrenceRule?: string | undefined;
  recurrenceException?: string | undefined;
  origin?: string;
}

export default ITodo;
