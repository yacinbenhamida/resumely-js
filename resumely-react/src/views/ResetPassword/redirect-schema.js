export default {
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64,
      minimum : 10
    }
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64,
      minimum : 10
    }
  }
};
