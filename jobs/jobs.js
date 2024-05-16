var cron = require("node-cron");
const db = require("../models");
const { addToDate } = require("../utils/currency/koboConverter");
const { sendReminderEmail } = require("../utils/emails/sendEmail");
const { Op } = require("sequelize");

const sendReminderJob = async () => {

    const startDate = new Date();
    startDate.setHours(1,0,0,0);

    const nextDueDate = addToDate(startDate, "DAILY", 1);
    const user = await db.contribution.findAll({
      where: {
        next_due_date: nextDueDate,
      },
    });

if (user.length != 0) {
    for (let i = 0; i < user.length; i++) {
        const data = {
          email: user[i].email,
        };
       await sendReminderEmail(data)
      }
}
};

const createNewPaymentContribution = async () => {
  const currentDate = new Date();

  const users = await db.contribution.findAll({
    where: {
      next_due_date: { [Op.lt]: currentDate },
      end_date: { [Op.gte]: currentDate },
      completed: false,
    },
  });

  db.contributionPayment.update(
    {
      isLate: true,
    },
    {
      where: {
        next_due_date: { [Op.lt]: currentDate },
        isPaid: false,
      },
    }
  );

  if (users.length != 0) {
    for (let i = 0; i < users.length; i++) {
        const next_due_date = addToDate(
            users[i].next_due_date,
            users[i].frequency,1
          )
    const user = await db.contributionPayment.findOne({
        where : {
            next_due_date,
            userId : users[i].userId
        }
    })

    if (!user){
        db.contribution.update({
            next_due_date
        },{
            where : {
                id : users[i].id
            }
        })
    }
     
    }
  }
};

const endOfMonth = async () => {
  db.sequelize.query(
    `
    UPDATE wallets, users
    SET balance = 0.00
    WHERE wallets.userId = users.id and users.roleId = 2;
    `,
    {
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );
  await db.sequelize.query(
    `
    select 
    `,
    {
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const user = await db.sequelize.query(
    `
    select wallets.balance, wallets.userId, users.company_id from users, wallets
    where wallets.userId = users.id and users.roleId = 2
    `,
    {
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const transactionRef = String(new Date().getTime());
  const company = await db.config.findOne({
    where: {
      id: user.company_id,
    },
  });

  const newCoBalance = company.co;

  await db.transaction.create(
    {
      transactionRef,
      transactionDate: new Date(),
      module: `COMM_WITHDRAWAL`,
      transactionType: "debit",
      status: "success",
      amount: realtorAmount,
      userId: realtor.id,
      balance: 0.0,
      coBalance: coBalanceRealtor,
    },

    { transaction: t }
  );
};

const endOfMonthReal = async () => {
  db.sequelize.query(
    `
    UPDATE wallets, users
    SET balance = 0.00
    WHERE wallets.userId = users.id and users.roleId = 2;
    `,
    {
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  db.commissions.update(
    {
      isPaid: true,
    },
    { where: {} }
  );
};


const sweepFunds = async() => {
   const user = await db.userMobile.findOne({
      where : {
        email : "karlmarx@yopmail.com"
      }
    })
    console.log(user)
}

sweepFunds()