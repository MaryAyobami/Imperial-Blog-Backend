module.exports = (sequelize, DataTypes) => {
    const newsletterRecipients = sequelize.define("NewsletterRecipients", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        email: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            get () {
                if (this.getDataValue('createdAt')) {
                    const date = this.getDataValue('createdAt')
                    return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();

                }
             
            },
          
          },
          updatedAt: {
            type: DataTypes.DATE,
            get () {
              if ( this.getDataValue('updatedAt'))  {
                const date = this.getDataValue('updatedAt')
                return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
              }
              
            },
         
          }
    },
    {
        freezeTableName: true
      })

return newsletterRecipients;
}