 const {test, expect, request} = require('@playwright/test');
 const Ajv = require('ajv');
 const addFormats = require('ajv-formats');
const bookingSchema = require('../schemas/bookingSchema');
const { jsonHeaders, authHeaders } = require('../helpers/requestHeaders');
let token; 
let dynamicBookingId;

test.beforeAll('Authorize atomic', async({ request }) => {
    const responseAuth = await request.post(`/auth`, {
    data: { "username": "admin", "password": "password123" },
    headers: jsonHeaders
  });
  expect(responseAuth.status()).toBe(200);
  const authResponse = await responseAuth.json();
  expect(authResponse).toHaveProperty('token');
  expect(typeof authResponse.token).toBe('string');
  expect(authResponse.token.length).toBeGreaterThan(0);
  console.log("Token is: ",authResponse.token);
  token = authResponse.token;
});

test.beforeEach('create Id', async ({ request }) => {
  const response = await request.post('/booking', {
    data: {
      firstname: "Dynamic",
      lastname: "User",
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: "2025-01-01",
        checkout: "2025-02-01"
      },
      additionalneeds: "None"
    },
    headers: jsonHeaders,
  });

  const json = await response.json();
  dynamicBookingId = json.bookingid;
  expect(dynamicBookingId).toBeDefined();
});

test('Get books atomic', async({ request }) => {
      const ajv = new Ajv({ allErrors: true });
       addFormats(ajv);
const validate = ajv.compile(bookingSchema);
     const responseGetBooking = await request.get(`/booking/${dynamicBookingId}`);
    const responseGetBody = await responseGetBooking.json();
    console.log("rspns: ", responseGetBody);
    const valid = validate(responseGetBody);

    if(!valid){
        console.error('Schema validation errors: ', validate.errors);
    }
        expect(responseGetBooking.status()).toBe(200);
        expect(valid).toBe(true);

});



test('CreateBooking atomic', async ({request}) => {
  const bookingData = {
    firstname: "Stoychou",
    lastname: "Enchef",
    totalprice: 2001,
    depositpaid: true,
    bookingdates: {
      checkin: "2025-01-01",
      checkout: "2026-01-01"
    },
    additionalneeds: "peace"
  };
  const createBooking = await request.post(`/booking`, 
    {
        data: bookingData,
        headers:  jsonHeaders
    }
  )

  const responseCreateBooking = await createBooking.json();
  expect(createBooking.status()).toBe(200);
  console.log("Create response is: ", responseCreateBooking);
  expect(responseCreateBooking).toHaveProperty('bookingid');
  const bookingId = responseCreateBooking.bookingid;
  console.log("Your booking id is: ", bookingId);

  expect(responseCreateBooking.booking).toEqual(bookingData);
})

test('UpdateBooking atomic', async({ request }) => {
  const updateBooking = await request.put(`/booking/${dynamicBookingId}`,
    {
      data: {
        "firstname" : "Stoyan",
    "lastname" : "Brown",
    "totalprice" : 567,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2023-01-01",
        "checkout" : "2024-01-01"
    },
    "additionalneeds" : "Breakfast"
      },
    headers:  authHeaders(token)
     
  
    }
  )
console.log("Token is: ",token)
  const responseUpdateBooking = await updateBooking.json();
  expect(updateBooking.status()).toBe(200);
  console.log("Update response is: ", responseUpdateBooking);
  expect(responseUpdateBooking.totalprice).toBe(567);
})

test('Delete booking atomic', async ({request}) => {

  const deleteBooking = await request.delete(`/booking/${dynamicBookingId}`, 
    {
      headers: authHeaders(token)
    }
  )
  expect (deleteBooking.status()).toBe(201)
}
)

test('End2End', async ({ request }) => {
    //Auth
  const responseAuth = await request.post(`/auth`, {
    data: { "username": "admin", "password": "password123" },
    headers: { "Content-Type": "application/json"
      
     }
  });
  expect(responseAuth.status()).toBe(200);
  const authData = await responseAuth.json();
  const token = authData.token;
  console.log("Token: ", token);

  //Create Booking
  const responseCreatBooking = await request.post(`/booking`, 
    {
        data: {
    "firstname" : "Stoycho",
    "lastname" : "Enchev",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"},
        headers: { "Content-Type": "application/json" }
    }
  )
  expect(responseCreatBooking.status()).toBe(200);
  const responseJsonCreate = await responseCreatBooking.json();
  console.log('Create response is: ',responseJsonCreate);
  const createId = responseJsonCreate.bookingid;

  // Get booking after create
  const responseGetBooking = await request.get(`/booking/${createId}`);
  const getBookingResponse = await responseGetBooking.json()
  console.log('Get response is: ', getBookingResponse);
   expect(getBookingResponse.firstname).toBe('Stoycho');
  expect(responseGetBooking.status()).toBe(200);


  // Update booking
  const responseUpdateBooking = await request.put(`/booking/${createId}`,
    {
      data: {
        "firstname" : "Stoyan",
    "lastname" : "Brown",
    "totalprice" : 567,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2023-01-01",
        "checkout" : "2024-01-01"
    },
    "additionalneeds" : "Breakfast"
      },
    headers: { "Content-Type": "application/json",
                "Cookie": `token=${token}`,
                "Accept": "application/json"
     }
  
    }
  )

  const jsonResponseUpdate = await responseUpdateBooking.json();
    console.log('Update response is: ', jsonResponseUpdate);
      expect(responseUpdateBooking.status()).toBe(200);





      // Get booking after update 
      const responseGetBooking2 = await request.get(`/booking/${createId}`);
  const getBookingResponse2 = await responseGetBooking2.json()
  console.log('Get response is: ', getBookingResponse2);
      expect(getBookingResponse2.firstname).toBe("Stoyan");
expect(getBookingResponse2.lastname).toBe("Brown");
expect(getBookingResponse2.totalprice).toBe(567);

console.log("Craete id is: ",createId);

const deleteBooking = await request.delete(`/booking/${createId}`, 
    {
      headers: {"Cookie": `token=${token}`,
                "Content-Type": "application/json"

      }
    }
  )
  expect (deleteBooking.status()).toBe(201)


});