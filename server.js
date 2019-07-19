const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// remember that we have to require chatkit-server after npm i'ing it
const Chatkit = require("@pusher/chatkit-server");

const app = express()

// after requiring it above, we must INSTANTIATE chatkit; this is important because
// we NEED chatkit connected to the server (as the module name would suggest) so that
// we can listen for requests from the client
// most interactions with Chatkit will happen on the client side
const chatkit = new Chatkit.default({
  // we get both the instanceLocater and the secret key from the Pusher dashboard
  // under the credentials tab
  instanceLocater: "v1:us1:be5b78ce-ac0c-4305-84d9-50a0f286c003",
  key: "aab9bb97-b050-40aa-9ad7-23b76507b91b:WLWsaqvqXN6t5q6NkFuxpGB01ohpGjGvWCXfiRxpCv0="
})
/*
  the main PURPOSE behind this server is to accept a POST REQUEST from the CLIENT with 
  the user's USERNAME;
  when we RECEIVE that username, we want to create a CHATKIT user WITH that username;
  we have to do this on the CLIENT because it needs to happen SECURELY, and this user creation
  can only happen if you have the secret key (above), and in order for the KEY to be secret, it
  has to remain on the server
*/

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// define a route for post requests
app.post("/users", (req, res)=>{
  // as soon as this endpoint is hit, we bring up the username (via destructuring) from
  // the request body (req.body)
  const {username} = req.body;
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(()=> res.sendStatus(201)) // indicate user was created successfully
    .catch(error=>{
      // it's possible that the user enters a username that already exists
      if(error.error_type === "services/chatkit/user_already_exists"){
        res.sendStatus(200);
      } else {
        res.status(error.statusCode).json(error);
      }
    })
})

const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
