import client from "../constants/apollo-client";

export const onLogout = () => {
  window.location.href = '/login';
  //srouter.navigate("/login");
  client.resetStore();
};
