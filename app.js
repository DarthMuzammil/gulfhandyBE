const ClientUser = require('./model/ClientUser')
const ServiceRequest = require('./model/ServiceRequest')
const Service = require('./model/Services')
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

const mongoose = require('mongoose');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions))
app.get('/', (req, res) => {
  console.log('g')
    res.send('Hello World!')
})

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username in the database
  const user = await ClientUser.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found'});
  }

  // Compare the provided password with the stored hashed password
  const passwordMatch = password === user.password

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // If the credentials are valid, you can generate a JWT or set a session here
  // For simplicity, we'll just send a success message
  res.status(200).json({ message: 'Login successful' , id: user.id, status: 200 });
});

app.post('/add-service', (req, res) => {
  console.log(req.body)
  let service = new Service({
    title: req.body.title,
    description: req.body.description,
    pricePerUnit: req.body.pricePerUnit,
    unitType: req.body.unitType
  });
  service.save().then((doc) => {
    res.send(doc)
   })
   .catch((err) => {
     console.error(err);
   });
})

app.get('/get-service-requests', (req, res) => {
  //ServiceRequest.find({}).then(rr => {res.send(rr)}).catch(e => res.send(e))
  // Define your aggregation pipeline
const pipeline = [
  {
    $lookup: {
      from: 'services', // The name of the services collection in your database
      localField: 'serviceId',
      foreignField: '_id',
      as: 'serviceDetails',
    },
  },
  {
    $unwind: '$serviceDetails', // Unwind the array created by $lookup (optional)
  },
  {
    $project: {
      _id: 1,
      userId: 1,
      address: 1,
      serviceId: 1,
      status: 1,
      handyMan: 1,
      serviceDetails: 1,
    },
  },
  {
    $lookup: {
      from: 'clientuserschemas', // The name of the services collection in your database
      localField: 'userId',
      foreignField: '_id',
      as: 'userDetails',
    },
  },
  {
    $unwind: '$serviceDetails', // Unwind the array created by $lookup (optional)
  },
  {
    $project: {
      _id: 1,
      userId: 1,
      address: 1,
      serviceId: 1,
      status: 1,
      handyMan: 1,
      serviceDetails: 1,
      userDetails: 1
    },
  },
];

// Execute the aggregation pipeline
ServiceRequest.aggregate(pipeline)
  .exec()
  .then((result) => {
    res.send(result)
  })
  .catch((error) => {
    console.error(error);
  });
})

app.get('/get-services', (req, res) => {
  Service.find({}).then(rr => {res.send(rr)}).catch(e => res.send(e))
})

// GET a single service by ID
app.get('/get-service/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a single service by ID
app.get('/get-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await ClientUser.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/assign-handy-man', (req, res) => {

})

app.post('/create-client-user', (req, res) => {
  let clientUser = new ClientUser({
    username: req.body.username,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email
  });
  clientUser.save().then((doc) => res.send(doc)).catch(e => res.send(e));
})

app.post('/add-service-request', (req, res) => {
    let serviceRequest = new ServiceRequest({
        userId: req.body.userId,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        serviceId: req.body.serviceId,
        status: 0,
        handyMan: ""
       })
       serviceRequest.save()
       .then((doc) => {
        console.log("Service Request Added Successfully!")
        res.send(doc)
       })
       .catch((err) => {
         console.error(err);
       });
})

app.listen(port, () => {
    mongoose.connect('mongodb+srv://abc:abc@sandbox.ue4rv.mongodb.net/smilehandy').then(() => {
    console.log("Connected")
})
    console.log(`Example app listening on port ${port}`)
})
