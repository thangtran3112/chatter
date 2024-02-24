import client from "../constants/apollo-client";
import { authenticatedVar } from "../constants/authenticated";

export const onLogout = () => {
  authenticatedVar(false);
  window.location.href = '/login';
  //router.navigate("/login");
  client.resetStore();
};
