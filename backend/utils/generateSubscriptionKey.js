function generateSubscriptionKey() {
  let key = "";
  for (let i = 0; i < 16; i++) {
    key += Math.floor(Math.random() * 10);
  }
  return key;
}

module.exports = generateSubscriptionKey;
