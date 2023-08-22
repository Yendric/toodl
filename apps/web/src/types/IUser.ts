type IUser = {
  id: number;
  username: string;
  email: string;
  onlyLinked: boolean;
  icalUrls: string[];
  dailyNotification: boolean;
  reminderNotification: boolean;
  nowNotification: boolean;
};

export default IUser;
