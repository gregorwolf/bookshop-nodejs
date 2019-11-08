const readFunction = async (req) => {
  console.log(req.user);
  
  // try to query the users
  const users = [
        {
          username: req.user.id,
          is_admin: req.user.is("admin"),
          is_user:  req.user.is("user"),
          is_dummy: req.user.is("dummy"),
          has_admin_user:  req.user.has(["admin", "user"]),
          has_admin_dummy: req.user.has(["admin", "dummy"]),
          has_user_dummy:  req.user.has(["user", "dummy"])
        }
    ]
    return users;
};

module.exports = (srv) => {
  // console.log(srv);
  srv.on('READ', 'User', readFunction);
};