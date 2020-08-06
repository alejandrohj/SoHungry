# SoHungry
## Description
This app will enable restaurants to upload their menus and receive bookings and orders automatically. It will enable users to search for restaurants and place their orders an bookings.

## Backlog

- Upload logo
- TripAdvisor API
- Bilingual page
- Payment feature

## User stories
- 404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- homepage - As a user I want to be able to access the homepage so that I can login and signup
- sign up - As a user I want to sign up on the webpage so that I can see what restaurants are around me
- sign up - As a business I want to sign up on the webpage so that I can see what restaurants are around me
- login - As a user I want to be able to log in on the webpage so that I can get back to my account
- logout - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

## API routes (back-end)

- GET /
  - renders login.hbs
  - redirect to /user if logged in as client
  - redirect to /business if logged in as business

- GET /signup
  - redirect to /user if logged in as client
  - redirect to /business if logged in as business
  - renders signup.hbs

- POST /signup
  - redirect to /
  - body: {
    - username
    - email
    - password
    - usertype
  }
   
- POST /login
  - redirect to /user if logged in as client
  - redirect to /business if logged in as business
  - body: {
    - email
    - password
    - usertype
  }
  
- POST /logout
  - redirects to /
  - body: (empty)

### User side

- GET /user
  - renders search.hbs

- POST /search
  - body: {
    - name
    - location.city
    - cuisine
  }
   

- GET /user/order/:RestId
  - render order.hbs

- POST /user/order/:RestId
  - redirects to /myorders
  - body: {
    []
  }
   - order:
    - dish1
     - name
      - price
      - quantity
    - dish2
      ...
   - status

- GET /user/booking/:RestId
  - renders booking.hbs

- POST /user/booking/:RestId
  - redirects to /user
  - body:
   - userId
   - date
   - people

- GET /user/myorders
  - renders myorders.hbs


- GET /user/mybookings
  - renders mybookings.hbs

- POST /user/booking/:BookingId
  - redirect to /user/mybookings
  - body: (empty)

### Restaurant side

- GET /business
  - renders profile.hbs

- POST /business
  - redirects to /business
  - body:
   - username
   - category
   - capacity
   - location
    - city
    - address
    - logourl

- GET /business/menu
  - renders menu.hbs

- POST /business/menu/add
  - redirects to /business/menu
  - body:
   - name
   - price

- POST /business/menu/save
  - redirects to /business/menu
  - body:
   - dishId
   - name
   - price

-POST /business/menu/delete
  - redirects to /business/menu
  - body: (empty)

- GET /business/orders
  - renders orders.hbs

- POST /business/orders/:OrderID
  - redirects to /business/orders
  - body: status

- GET /business/bookings
  - renders bookings.hbs

## Models
  - Customer Schema
    - userName (String, required, unique)
    - email (String, required, unique)
    - passwordHash (String, required)
  
  - Business Schema
    - userName (String, required, unique)
    - email (String, required, unique)
    - passwordHash (String, required)
    - logo (string)
    - location: {
      - city (string)
      - address (string)
    }
    - cuisine
    - menu[dishId]

  - Order Schema
    - user (String, ref)
    - business (String, ref)
    - order:
     - dish1
      - name (String)
      - price (number)
      - quantity (number)
      ...
      - dish10
       - name (String)
       - price (number)
       - quantity (number)
       - status(String, required, enum [done, pending])

  - Bookings Schema
    - user (String, ref)
    - business (String, ref)
    - date (Date, required)
    - people (Number, required)

  - Dish Schema
    - name
    - price
    

## Links

### Github
https://github.com/alejandrohj/SoHungry/
### Trello
(https://trello.com/b/n4Qeyh6H/sohungry)

