export const checkAndRenewToken = (res, req, next) => {
  const accessToken = req.cookies.access;
  const refreshToken = req.cookies.refresh;



//   loggin the cookies
console.log("the access token", accessToken)
console.log("the refresh", refreshToken)

 
};
