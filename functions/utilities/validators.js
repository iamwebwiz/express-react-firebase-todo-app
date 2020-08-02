const isEmpty = (string) => {
  return string.trim() === "";
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Email ust not be empty";
  if (isEmpty(data.password)) errors.password = "Password must not be  empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
