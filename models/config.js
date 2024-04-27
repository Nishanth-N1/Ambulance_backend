module.exports = {
  HOST: "ep-morning-limit-a1h4bcsx.ap-southeast-1.aws.neon.tech",
  USER: "ambulance_owner",
  PASSWORD: "opXH5ACL1KEF",
  DB: "ambulance",
  dialect: "postgres",
     dialectOptions: { ssl: true },
  pool: {
    max: 5,
    min: 0,
    acquire: 50000,
    idle: 5432,
  },
};
