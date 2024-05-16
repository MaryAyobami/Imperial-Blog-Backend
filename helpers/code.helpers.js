const genAffiliateCode = (username) => {
    var num = Date.now() / 1000;
    num = String(num).split(".");
    num = num[0];
    num = parseInt(num).toString(16);
    var firstSlice = username.slice(0,2)
    var lastSlice = username.slice(-2)
    num = num.slice(2)
    var affiliateCode = lastSlice + num  + firstSlice
    affiliateCode = affiliateCode.toUpperCase()
    return affiliateCode
  
  };

  function generatePaystackReference() {
    const timestamp = Date.now(); 
    const randomPart = Math.floor(Math.random() * 10000); 
  
    const reference = `ref_${timestamp}_${randomPart}`;
    return reference;
  }


  module.exports = {
    genAffiliateCode,
    generatePaystackReference
  }
