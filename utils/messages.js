function formatMessage(user, text) {
  return {
    user,
    text,
    timestamp: new Date(),
  };
}

module.exports = formatMessage;
