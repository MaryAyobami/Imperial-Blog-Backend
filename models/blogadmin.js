module.exports = (sequelize, DataTypes) => {
    const blogadmin = sequelize.define("BlogAdmin", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        password: {
            type: DataTypes.STRING,
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

return blogadmin;
}