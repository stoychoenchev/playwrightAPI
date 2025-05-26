const { jsonHeaders, authHeaders } = require('./requestHeaders');

async function authorizeUser(request) {
  const response = await request.post('/auth', {
    data: { username: 'admin', password: 'password123' },
    headers: jsonHeaders
  });
  const { token } = await response.json();
  return token;
}

async function createBooking(request, bookingData) 
{
return await request.post('/booking', {
    data: bookingData,
    headers: jsonHeaders
});
}

async function deleteBooking(request, bookingId, token) {
    return await request.delete(`/booking/${bookingId}`, {
        headers: authHeaders(token)
    });
}

async function updateBooking(request, bookingId, bookingData, token) {
    return await request.put(`/booking/${bookingId}`, {
        data: bookingData,
        headers: authHeaders(token)
    });
}

async function getBooking(request, bookingId) {
  return await request.get(`/booking/${bookingId}`);
}

module.exports = {
  createBooking,
  deleteBooking,
  updateBooking,
  getBooking,
  authorizeUser
};