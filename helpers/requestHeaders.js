// requestHelpers.js

const jsonHeaders = {
  "Content-Type": "application/json"
};

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  "Cookie": `token=${token}`,
  "Accept": "application/json"
});

module.exports = {
  jsonHeaders,
  authHeaders,
};
