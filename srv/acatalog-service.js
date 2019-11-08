const readFunction = async (req) => {
  console.log(req.user);
  
  // try to query the users
  const users = [
        {
          username: req.user.id
        }
    ]
    return users;
};

module.exports = (srv) => {
  // console.log(srv);
  srv.on('READ', 'User', readFunction);
};