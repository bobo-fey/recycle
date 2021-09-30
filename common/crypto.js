import CryptoJS from '../node_modules/crypto-js/crypto-js.js'

module.exports = {
	getAesString(data,key,iv){//加密
     var key  = CryptoJS.enc.Utf8.parse(key);
     var iv   = CryptoJS.enc.Utf8.parse(iv);
     var encrypted =CryptoJS.AES.encrypt(data,key,
      {
       iv:iv,
       mode:CryptoJS.mode.CBC,
       padding:CryptoJS.pad.Pkcs7
      });
     return encrypted.toString();    //返回的是base64格式的密文
    },
    getDAesString(encrypted,key,iv){//解密
     var key  = CryptoJS.enc.Utf8.parse(key);
     var iv   = CryptoJS.enc.Utf8.parse(iv);
     var decrypted =CryptoJS.AES.decrypt(encrypted,key,
      {
       iv:iv,
       mode:CryptoJS.mode.CBC,
       padding:CryptoJS.pad.Pkcs7
      });
     return decrypted.toString(CryptoJS.enc.Utf8);     
    },
 
    getAES(data){ //加密
     var key  = 'zhishang$wangluo';  //密钥
     var iv   = '9113017161623210';
     var encrypted =this.getAesString(data,key,iv); //密文
     var encrypted1 =CryptoJS.enc.Utf8.parse(encrypted);
     return encrypted;
    },
 
     getDAes(data){//解密
     var key  = 'zhishang$wangluo';  //密钥
     var iv   = '9113017161623210';
     var decryptedStr =this.getDAesString(data,key,iv);
     return decryptedStr;
    }
  
    //  console.log(getAES('123456'));
    // console.log(getDAes(getAES('123456')));
 }