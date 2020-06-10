var request = require("request");
var cheerio = require("cheerio");
var _ = require('underscore');

module.exports = {
  titles: {
    adresse: ['Cité','Adresse','city','avenue','Pays','Ville','km','tunisie','Route','maghreb','Rue','cité','RUE','Lieu de naissance','tunis','maroc','tunisienne','Nationalité','tunisien','address','tunisia','Morocco','Ariana','Béja','Ben Arous','Bizerte','Gabès',
    'Gabès','Gafsa','Jendouba','Kairouan','Kasserine','Kébili','Goulette','Bizerte','Bizert','la marsa','Kef','Benarous','Mahdia','Manouba','Médenine','Monastir','Nabeul','Sfax','	Sidi Bouzid',
    'Siliana','Sousse','Tataouine','Tozeur','Tunis','Zaghouan','Maroc','Provence','Province','Mdiq Fnideq','Tétouan','Fahs Anjra',
    'Larache','Hoceima','Chefchaouen','Ouezzane','Oujda angad','Nador','Driouch','Jerada','Berkane','Taourirt','Guercif','Figuig','Fès','Meknès','Moulay yaacoub','Boulemane','Rabat','Tikachmirine'
    ,'Chefchaouèn','Settat','Khmissat','Larache','Ksar el Kebir','Taza','Casablanca','Jadida','Beni Mellal','Béni Mellal','Khouribga','Safi','Tetouan','Kenitra',
    'Oujda','Meknes','Tanger','Agadir','Marrakech','Salé'],
    activites: ['Interêts','interests','CENTRES D’INTERETS','bénévole','vie associative','vie associative et intérêt','intérêt','vie associative et intéret',"centres d'interets"],
    DateNaissance:['Née','Née le','Date de naissance','born','birthdate','Né','né le','naissance','DN','Naissance','Date de naissance:'],
    experience:['Parcours','Expérience','Experience','Stage','E X P E R I E N C E'],
    formation: ['education','ETUDES UNIVERSITAIRES','PROJETS','FORMATION','académique','Etudes','Projets Académiques','Formations','formation','ETUDES & DIPLOMES','etudes','Education','diplomes','formations','Éducation','Projets','PROJETS','Académiques'],
    languages: ['languages','langues','Linguistique','Compétences linguistiques'],
    skills: ['Compétences', 'Skills & Expertise', 'technology', 'technologies','COMPETENCES TECHNIQUES','competences techniques','Logiciels maîtrisés','Compétences techniques'],


 
  },
  inline: {
    skype: 'Skype'
  },
  regular: {
  
    name: [
      /([A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
    ],

    email: [
      /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
    ],
 
    
    phone: [
   /((\+|00)212|0)?([ \-_\s]*)(\d[ \-_\s]*){9,13}|(([(][+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})|(([+]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})|((?:(?:\+\s|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4})|(([+][(][(]?[0-9]{1,3}[)]?)((\+|00)216)?([0-9\s]{12}))/
    ],

    age:
    [
      /[2-9][0-9](?:[\s](ans|Ans))|[2-9][0-9]((ans|Ans))/
    ],
    
  }
};

// helper method
function download(url, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      callback(null, error)
    }
  });
}