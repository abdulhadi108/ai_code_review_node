const db = require('../models');

async function migrate(){
  try{
    await db.sequelize.sync({ alter: true });
    console.log('Migrations applied (sync).');
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

migrate();
