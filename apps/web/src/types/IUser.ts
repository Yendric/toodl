type IUser = {
  id?: number;
  username?: string;
  email?: string;
  auth: boolean;
  onlyLinked?: boolean;
  smartschoolCourseExport?: string;
  smartschoolTaskExport?: string;
};

export default IUser;
