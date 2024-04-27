module.exports = (sequelize, DataType) => {
    const register = sequelize.define("register", {
      driver_id: {
        type: DataType.STRING,
      },
      driver_name: {
        type: DataType.STRING,
      },
      password: {
        type: DataType.STRING,
      },
      ambulance_no: {
        type: DataType.STRING,
      },
      driver_phnumber: {
        type: DataType.STRING,
      },
    //   student_cenroll: {
    //     type: DataType.STRING,
    //   },
    });
    return register;
  };
  