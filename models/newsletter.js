module.exports = (sequelize, DataTypes) => {
    const newsletter = sequelize.define("Newsletter", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        blogposts: {
            type: DataTypes.JSON,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        events: {
            type: DataTypes.STRING,
            allowNull: true,
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

return newsletter;
}