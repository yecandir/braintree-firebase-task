# This is a simple implementation for firebase wallet and braintree sandbox.

I was planning deploying functions on a server will reduce costs. But as requested all functions deployed to firebase and protected by auth.

## General System

1. System build on firestore no external service is used.

2. You can view db schema on this link <https://dbdocs.io/yemrecandir/yec-midas-task> with password `task1234`

## Running the application

You can run application through web folder and <code>npm run dev</code>

Or you can use docker

In web folder
<code>docker build .</code> -> image-id
<code>docker run -p 5173:5173 {image-id}</code>

## Flows

### User register

User registration through any channel (only google provided a the moment)
will create a new user in firestore by using a trigger function on firbase
functions named "newUserToFirestore". this functions is triggered when a
new user registered to the sytem and it creates a new document in firestore users.

### Payment

An authorized user can start a payment. It will write the necessary data to transactions table
and increase the balance in corresponding users. I have set a general pay_in setup while saving
you can view the function "start-payment".

I didnt implement purchase transaction. But it is simple we will reduce user balance
and add item to users wallet or another table.

## Security

All system is behind firebase auth system. Also firestore is protected by rules.
Without auth no one can access firestore or payment.
