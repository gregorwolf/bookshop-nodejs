const approuter = require("@sap/approuter");
const jwtDecode = require("jwt-decode");
const ar = approuter();

ar.beforeRequestHandler.use(async(req, res, next) => {
	
	// get the current user out of IDP
	const jwt = jwtDecode(req.user.token.accessToken);
	
  console.log(jwt);
  // res.setHeader('Authorization', `Bearer ${req.user.token.accessToken}`);
    
	next();

});

ar.start();