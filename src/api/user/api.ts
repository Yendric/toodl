import { User } from "../../types/User";
import api from "../api";

export async function info() {
  return (await api<User>("/auth/user_data")).data;
}

export async function destroy() {
  await api.post("/auth/user_data/destroy");
}

export async function update(data: User) {
  await api.post("/auth/user_data", data);
}

export async function updatePassword(data: { oldPassword?: string; newPassword: string; confirmPassword: string }) {
  await api.post("/auth/user_data/update_password", {
    oldPassword: data.oldPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
  });
}
