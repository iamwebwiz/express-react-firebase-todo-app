const { admin, db } = require("../utilities/admin");
const config = require("../utilities/config");

const firebase = require("firebase");

firebase.initializeApp(config);

const {
  validateLoginData,
  validateSignupData,
} = require("../utilities/validators");

exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.json({ token });
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(403)
        .json({ general: "Wrong credentials. Please try again" });
    });
};
