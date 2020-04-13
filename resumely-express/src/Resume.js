var _ = require('underscore');
const human = require('humanparser');
let mongoose = require('mongoose');
const nlp = require('compromise');
const person = require('people-names')

module.exports = function() {
  return new Resume();
};

function Resume() {
  // generic resume format
  this.parts = {};
}
function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }

  return true;
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
  if(!isEmpty(this.parts)) 
  {
    console.log("experiennceeee"+this.parts.experience)
  let name= this.parts.name
  if(this.parts.adresse!=undefined)
  { 
  let n = this.parts.adresse.toLowerCase().match(/(ariana|béja|ben arous|bizerte|gabès|gafsa|jendouba|kairouan|kasserine|kébili|kef|mahdia|manouba|médenine|monastir|nabeul|sfax|sidi bouzid|siliana|sousse|tataouine|tozeur|zaghouan|benarous|la marsa|petite ariana|tunis)(?!tunisie)(?!tunisia)(?!tunisienne)(?!tunisien)/);
  let p = this.parts.adresse.toLowerCase().match(/(chefchaouèn|salé|settat|khmissat|larache|ksar el kebir|jadida|beni mellal|khouribga|safi|mdiq fnideq|tétouan|fahs anjra|larache|hoceima|chefchaouen|ouezzane|oujda|nador|driouch|jerada|berkane|taourirt|guercif|figuig|fès|meknès|moulay yaacoub|boulemane|rabat|tikachmirine|casablanca|marrakech|agadir|tanger|kenitra)/)

  if(n!=null&&p==null)
  {
  this.parts.adresse=String(n[0].charAt(0).toUpperCase()+n[0].slice(1)+" Tunisie");
  }
  if (n==null&&p!=null)
  {
  this.parts.adresse=String(p[0].charAt(0).toUpperCase()+p[0].slice(1)+ " Maroc");
  }
  if(n==null&&p==null)
  {
    let s=this.parts.adresse.toLowerCase().match(/(tunisie|tunisienne|tunisien|tunisie )/)
    if(s!=null)
  {
    this.parts.adresse=String("Tunisie");
  }
  else{
    this.parts.adresse=" "
  }
  }

}

  if(this.parts.DateNaissance!=undefined)
  {
  let d=this.parts.DateNaissance.toLowerCase().match(/((((\d{1,2})[-|.|\\|\/](\d{1,2})[-|.|\\|\/](19))\d\d)|(((0[1-9]|[12][0-9]|3[01])[- \\|\/.](janvier|février|mars|avril|mai|juin|juillet|août|septembre|aout|octobre|novembre|décembre)[- \\|\/.](19))\d\d))/)
  if(d!=null)
  {
  this.parts.DateNaissance=String(d[0])
  }
  else 
  this.parts.DateNaissance=""
  }
  /*if(this.parts.experience!=undefined)
  {
    let e=this.experience.toLowerCase.match(/((\d+)([\s]ans))/)
    if(e!=null)
    {
      this.parts.experience=String[e[0]]
    }
  }*/
  if(this.parts.name!=undefined)
  {
  let myfirst= human.parseName(name)
  let t=String(myfirst.firstName)
  let doc = nlp(t)
  if(person.isPersonName(t)==true||doc.people().length!=0)
  {
  let str_pos = this.parts.name.indexOf("rue");
  let str_pos2 = this.parts.name.indexOf("route'");
  if(str_pos>-1 || str_pos2>-1)
  {
  if(this.parts.email!=undefined)
  {
  let test = this.parts.email.replace(/@.*$/,"");
  test=test.replace(/[0-9]/g, "");
  test=test.split('.').join(" ");
  test=test.split('-').join(" ");
  test=test.split('_').join(" ");
  this.parts.name= human.parseName(test)
  }
  }
  else{
   this.parts.name= human.parseName(name)
  }
  }
  else
  {
  if(this.parts.email!=undefined)
  {
  let test = this.parts.email.replace(/@.*$/,"");
  test=test.replace(/[0-9]/g, "");
  test=test.split('.').join(" ");
  test=test.split('-').join(" ");
  test=test.split('_').join(" ");
  this.parts.name= human.parseName(test)
  }
  else 
  {
  this.parts.name= human.parseName(name) 
  }
  }
  }

  if(this.parts.name==undefined)
  {
  if(this.parts.email!=undefined)
  {
  var test = this.parts.email.replace(/@.*$/,"");
  test=test.replace(/[0-9]/g, "");
  test=test.split('.').join(" ");
  test=test.split('-').join(" ");
  test=test.split('_').join(" ");
  this.parts.name= human.parseName(test)
  }
  else {
  this.parts.name= human.parseName(name)
  }
  }

  let res = {}
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
}
else {
  let res = {}
  res['name'] =human.parseName('Inconnu');
  res['email'] = '';
  res['adresse'] = '';
  res['phone'] = '';
  res['DateNaissance'] ='';
  res['age'] ='';
  res['experience'] = '';
  let json= JSON.stringify(res);
  json = json.replace(/\\n/g, ' ');
  return json

}
};