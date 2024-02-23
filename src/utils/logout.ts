import client from "../constants/apollo-client";

export const onLogout = () => {
  window.location.href = '/login';
  //router.navigate("/login");
  client.resetStore();
};
