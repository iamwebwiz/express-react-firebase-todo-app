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

exports.signup = (request, response) => {
  const newUser = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    phoneNumber: request.body.phoneNumber,
    country: request.body.country,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    username: request.body.username,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return response.status(400).json(errors);

  let token, userId;

  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ username: "this username is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      token = idtoken;

      const userCredentials = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
        country: newUser.country,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };

      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email already in use" });
      } else {
        return response
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

exports.uploadProfilePhoto = (request, response) => {
  //
};
