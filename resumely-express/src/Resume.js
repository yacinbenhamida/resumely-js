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


function totalmonths(T1,T2)
{
  let today=new Date().getFullYear();
  let total=0;
  if(T1.length%2!=0)
  {
    T1.splice(-1,1)
  }
  if(T2.length%2!=0)
  {
    T2.splice(-1,1)
  }
  for(let i=0;i<T1.length;i+=2)
  {
  //  console.log("tableeee"+T1[i+1]+"isoustraction"+T1[i])
    total+=(T1[i+1]-T1[i]);
  }
  for(let i=0;i<T2.length;i++)
  {
    if(T2[i]==today&&T2[i]>T2[i+1])
    {
      let temp=T2[i+1];
      T2[i+1]=T2[i];
      T2[i]=temp;
    }
  }
  for(let i=0;i<T2.length;i+=2)
  {
   
   
    if(T2[i+1]>=T2[i])
    {
      total+=((T2[i+1]-T2[i])*12); 
    }
  }
return total;
}

let monthsConverter={
'january':1,
 'janvier':1,
 'february':2,
 'février':2,
 'march':3,
 'mars':3,
 'april':4,
 'avril':4,
 'mai':5,
 'may':5,
 'june':6,
 'juin':6,
 'juillet':7,
 'july':7,
 'august':8,
 'aout':8,
 'août':8,
 'september':9,
 'septembre':9,
 'october':10,
 'octobre':10,
 'november':11,
 'novembre':11,
 'december':12,
 'décembre':12,
 '01/':1,
 '02/':2,
 '03/':3,
 '04/':4,
 '05/':5,
 '06/':6,
 '07/':7,
 '08/':8,
 '09/':9,
 '10/':10,
 '11/':11,
 '12/':12,
 'aujourd':new Date().getMonth()+1,
 'today':new Date().getMonth()+1,
 'now':new Date().getMonth()+1,
 'since':new Date().getMonth()+1,
 'depuis':new Date().getMonth()+1,
 'présent':new Date().getMonth()+1,
 'maintenat':new Date().getMonth()+1,
}

  //december|november|october|september|august|july|june|may|april|march|february|january|janvier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|décembre|depuis|since)[-!$%^&*()_–+|~=`{}\[\]:";'<>?,.\/\s]{1,4}(19|20)\d{2}|(en cours|a aujourd’hui|a ce jour|now|present)
  
  





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
  
  let name= this.parts.name
  if(this.parts.adresse!=undefined)
  { 
  let n = this.parts.adresse.toLowerCase().match(/(ariana|béja|ben arous|bizerte|bizert|gabès|gafsa|jendouba|kairouan|kasserine|kébili|kef|mahdia|manouba|médenine|monastir|nabeul|sfax|sidi bouzid|siliana|sousse|tataouine|tozeur|zaghouan|benarous|la marsa|petite ariana|tunis)(?!tunisie)(?!tunisia)(?!tunisienne)(?!tunisien)/);
  let p = this.parts.adresse.toLowerCase().match(/(chefchaouèn|salé|béni mellal|settat|khmissat|larache|ksar el kebir|jadida|beni mellal|khouribga|safi|mdiq fnideq|tétouan|fahs anjra|larache|hoceima|chefchaouen|ouezzane|oujda|nador|driouch|jerada|berkane|taourirt|guercif|figuig|fès|meknès|moulay yaacoub|boulemane|rabat|tikachmirine|casablanca|marrakech|agadir|tanger|kenitra)/)

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
  let d=this.parts.DateNaissance.toLowerCase().match(/((((\d{1,2})[-|.|\\|\/](\d{1,2})[-|.|\\|\/](19))\d\d)|(((0[1-9]|[12][0-9]|3[01])[- \\|\/.](janvier|février|mars|avril|mai|juin|juillet|août|septembre|aout|octobre|novembre|décembre)[- \\|\/.](19))\d\d))|\d{4}/)
  if(d!=null)
  {
  this.parts.DateNaissance=String(d[0])
  let year=d[0].match(/\d{4}/)
  if(year!=null)
  {
    let age=new Date().getFullYear()-year
    this.parts.age=age
  }
  }
  else 
  this.parts.DateNaissance=""
  }
  if(this.parts.DateNaissance==undefined)
  {
    if(this.parts.age!=null)
    {
      let agee=this.parts.age.match(/\d{2}/)
      if(agee!=null){
        let age=agee[0]
        let year=new Date().getFullYear()-age
        this.parts.DateNaissance=String(year)
      }
    }
  }
 
  if(this.parts.experience!=undefined)
{
// console.log(this.parts.experience) 

let regex = /(december|november|october|september|august|july|june|may|april|march|february|january|janvier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|décembre|depuis|since)[\s|\s\s]{0,2}[à|-|\-!$%^&*()_–+|~=`{}\[\]:";'<>?,.\/\s][\s]{0,1}(?:\d{2})?[\s]{0,1}(december|november|october|september|august|july|june|may|april|march|february|january|janvier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|décembre|depuis|since)[-!$%^&*()_–+|~=`{}\[\]:";'<>?,.\/\s]{1,4}(19|20)\d{2}|\d{4}[\s]{0,2}[-|_|\s|à][\s]{0,2}(\d{4}|en cours|aujourd|a ce jour|now|présent|since|depuis|maintenat)|(\d{2}[\/](19|20)\d{2}|((19|20)\d{2}|december|november|october|september|august|july|june|may|april|march|february|january|janvier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|décembre|depuis|since)[-!$%^&*()_–+|~=`{}\[\]:";'<>?,.\/\s]{1,4}(19|20)\d{2}|(en cours|aujourd|a ce jour|now|présent|since|depuis|maintenat))|((december|november|october|september|august|july|june|may|april|march|february|january|janvier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|décembre|depuis|since)[-|_|\s|à][\s]{0,2}(december|november|october|september|august|july|june|may|april|march|february|january|janvier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|décembre|depuis|since)[-|_|\s|à][\s]{0,2}(19|20)\d{2})/g
let matches = [];
let months = [];
let years = [];

let match;
do {
  match =regex.exec(this.parts.experience.toLowerCase());
  if (match) {
    matches.push(match[0]);
    }
} while (match);

if(matches!=null)
{
  for(let i=0;i<matches.length;i++)
  { 
  let reg1=/[a-zA-Zéû]+|\d{2}[\/]/g
  let k
   
  let reg=/\d{4}|aujourd|today|now|since|depuis|présent|maintenat/g
   
  let kk;
  do {
    k =reg1.exec(matches[i]);
    if (k) {
    var monthNumber = monthsConverter[k[0]]
     months.push(monthNumber)
      }
  } while (k);


  do {
  kk=  reg.exec(matches[i]);
  if (kk) {
  let cc=kk[0].match(/aujourd|today|now|since|depuis|présent|maintenat/)
  if(cc!=null)
  {
  kk[0]=new Date().getFullYear();
  }
  years.push(kk[0])
      }
  } while (kk);

  
  if(kk!=null){
  let cc=kk[0].match(/aujourd|today|now|since|depuis|présent|maintenant/)
  if(cc!=null)
  {
  kk[0]=new Date().getFullYear();
  }
   
}
  }
  
 /* months.forEach(element => console.log("moisssssssss"+element));*/
  years.forEach(element => console.log("yearsss"+element));
this.parts.experience=String(matches)+' total months'+totalmonths(months,years)
}

  }
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