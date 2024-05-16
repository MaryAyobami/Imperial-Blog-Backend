module.exports = (sequelize, DataTypes) => {
    const blogDraft = sequelize.define("BlogDraft", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            defaultValue: null
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        authorBio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        authorPicture: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        coverPicture: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        newsletterContent: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        blogPosts: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
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

return blogDraft;
}