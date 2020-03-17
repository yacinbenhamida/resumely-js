var _ = require('underscore');
const human = require('humanparser');
let mongoose = require('mongoose')

module.exports = function() {
  return new Resume();
};

function Resume() {
  // generic resume format
  this.parts = {};
}

Resume.prototype.addKey = function(key, value) {
  value = value || '';
  value = value.trim();
  // reject falsy values
  if (value) {
    if (_.has(this.parts, key)) {
      value = this.parts[key] + value;
    }

    this.parts[key] = value;
  }
};

Resume.prototype.addObject = function(key, options) {
  var self = this;

  if (!_.has(this.parts, key)) {
    this.parts[key] = {};
  }

  _.forEach(options, function(optionVal, optionName) {
    if (optionVal) {
      self.parts[key][optionName] = optionVal;
     
    }
  });
};

/**
 *
 * @returns {String}
 */
Resume.prototype.jsoned = function() { 
 //console.log(this.parts)
  
 // console.log(this.parts)
  //json = json.replace(this.parts.adresse,addressit(this.parts.adresse))
  if(this.parts.adresse!=undefined)
  {
   var n = this.parts.adresse.toLowerCase().match(/(tunis|ariana|béja|ben arous|bizerte|gabès|gafsa|jendouba|kairouan|kasserine|kébili|kef|mahdia|manouba|médenine|monastir|nabeul|sfax|sidi bouzid|siliana|sousse|tataouine|tozeur|zaghouan)(?!tunisie)/);
     if(n!=null)
     {
      this.parts.adresse=String(n[0]+" Tunisie");
     }
     else if (n==null)
     {
      var p = this.parts.adresse.toLowerCase().match(/(tunisie|tunisia|tunisienne|tunisien)/)
      this.parts.adresse=String("Tunisie");

     }
  }
  if(this.parts.email!=undefined)
  {
    var test = this.parts.email.replace(/@.*$/,"");
    test=test.replace(/[0-9]/g, "");
    test=test.split('.').join(" ");
    test=test.split('-').join(" ");
    test=test.split('_').join(" ");
   this.parts.name= human.parseName(test)
  }
  //delete this.parts['languages','projetsacademique','formation','skills']
  var res = {}
  res['name'] = this.parts.name;
  res['email'] = this.parts.email;
  res['adresse'] = this.parts.adresse;
  res['phone'] = this.parts.phone;
  res['DateNaissance'] = this.parts.DateNaissance;
  res['age'] = this.parts.age;
  res['experience'] = this.parts.experience;
  
  let json= JSON.stringify(res);
  json = json.replace(/\\n/g, ' ');
  
 


  return json;
};
