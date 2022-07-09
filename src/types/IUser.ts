type IUser = {
  id?: number;
  username?: string;
  email?: string;
  auth: boolean;
  onlyLinked?: boolean;
  smartschoolCourseExport?: string;
  smartschoolTaskExport?: string;
  dailyNotification?: boolean;
  reminderNotification?: boolean;
  nowNotification?: boolean;
};

export default IUser;
