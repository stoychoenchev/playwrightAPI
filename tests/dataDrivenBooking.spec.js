 const {test, expect, request} = require('@playwright/test');
const bookings = require('../data/bookingData.json');
const { jsonHeaders, authHeaders } = require('../helpers/requestHeaders');

test.describe('Data-driven tests', () => {
for(const booking of bookings){
test(`Create booking for ${booking.firstname} ${booking.lastname}`, async({request}) => {

  const response = await request.post('/booking', {
    data: booking,
    headers: jsonHeaders,
  })

  const responseBody = await response.json();
  console.log(`for the client ${booking.firstname} the booking id is: ${responseBody.bookingid}`)
  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty('bookingid');
  expect(responseBody.booking).toMatchObject(booking);
})}
})



