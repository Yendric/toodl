interface ITodo {
  id: number;
  localId: number;
  done: boolean;
  subject: string;
  startTime: Date;
  listId?: number | null;
  endTime?: Date | null;
  isAllDay?: boolean | null;
  recurrenceRule?: string | null;
  recurrenceException?: string | null;
  origin?: string | null;
}

export default ITodo;
