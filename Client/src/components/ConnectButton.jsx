const handleConnect = () => {

  if (!user) {
    navigate("/login");
    return;
  }

  if (user.role === "watcher") {
    navigate("/create-founder-profile");
    return;
  }

  // If founder
  sendConnectionRequest();
};