module.exports = (sequelize, DataTypes) => {
    const blog = sequelize.define("Blog", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
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
        tags: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        authorBio: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        authorPicture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        coverPicture: {
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

return blog;
}