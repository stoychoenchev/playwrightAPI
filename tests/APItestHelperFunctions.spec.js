 const {test, expect, request} = require('@playwright/test');
const baseBookingData = {
  firstname: "Valid",
  lastname: "User",
  totalprice: 200,
  depositpaid: true,
  bookingdates: {
    checkin: "2025-01-01",
    checkout: "2025-01-10"
  },
  additionalneeds: "Breakfast"
};
const {
  authorizeUser,
  createBooking,
  deleteBooking,
  updateBooking,
  getBooking
} = require('../helpers/bookingActions');



test('E2E flow using utilies', async ({request}) => {
  const token = await authorizeUser(request);
  const createResponse = await createBooking(request, baseBookingData);
  const createJson = await createResponse.json();
  const bookingId = createJson.bookingid;

  expect(createResponse.status()).toBe(200);
  expect(createJson).toHaveProperty('bookingid');

  const updatedData = { ...baseBookingData, totalprice: 600 };
  const updateRes = await updateBooking(request, bookingId, updatedData, token);
  const updateJson = await updateRes.json();
  expect(updateRes.status()).toBe(200);
  expect(updateJson.totalprice).toBe(600);

  const getRes = await getBooking(request, bookingId);
  const getJson = await getRes.json();
  expect(getJson.firstname).toBe(`${baseBookingData.firstname}`);

  const deleteRes = await deleteBooking(request, bookingId, token);
  expect(deleteRes.status()).toBe(201);

  }

);

