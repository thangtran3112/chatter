/* eslint-disable @typescript-eslint/no-explicit-any */
export const extractErrorMessage = (err: any) => {
  //this can be figured out in Signup component, when console.log(err) or by debuggin VSCode
  const errorMessage = err.graphQLErrors[0]?.extensions?.originalError?.message;

  if (!errorMessage) {
    return;
  }

  if (Array.isArray(errorMessage)) {
    return formatErrorMessage(errorMessage[0]);
  } else {
    return formatErrorMessage(errorMessage);
  }
};

//capitalize the first letter in error message
//example: "password is not strong enough" => "Password is not strong enough"
export const formatErrorMessage = (errorMessage: string) => {
  return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
};
