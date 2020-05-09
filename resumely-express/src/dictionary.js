var request = require("request");
var cheerio = require("cheerio");
var _ = require('underscore');

module.exports = {
  titles: {
    adresse: ['Cité','Adresse','city','avenue','Pays','Ville','km','tunisie','Route','maghreb','Rue','cité','RUE','Lieu de naissance','tunis','maroc','tunisienne','Nationalité','tunisien','address','tunisia','Morocco','Ariana','Béja','Ben Arous','Bizerte','Gabès',
    'Gabès','Gafsa','Jendouba','Kairouan','Kasserine','Kébili','Bizerte','Bizert','la marsa','Kef','Benarous','Mahdia','Manouba','Médenine','Monastir','Nabeul','Sfax','	Sidi Bouzid',
    'Siliana','Sousse','Tataouine','Tozeur','Tunis','Zaghouan','Maroc','Provence','Province','Mdiq Fnideq','Tétouan','Fahs Anjra',
    'Larache','Hoceima','Chefchaouen','Ouezzane','Oujda angad','Nador','Driouch','Jerada','Berkane','Taourirt','Guercif','Figuig','Fès','Meknès','Moulay yaacoub','Boulemane','Rabat','Tikachmirine'
    ,'Chefchaouèn','Settat','Khmissat','Larache','Ksar el Kebir','Jadida','Beni Mellal','Béni Mellal','Khouribga','Safi','Tetouan','Kenitra',
    'Oujda','Meknes','Tanger','Agadir','Marrakech','Salé'],
   /* objective: ['objective', 'objectives'],
    nationalité: ['tunisien', 'tunisienne','nationalité'],
    summary: ['summary'],
   
    diplomes: ['diplomes','diplome'],

   
    courses: ['courses'],
    stages: ['stages','stage'],
    projetsacademique: ['PROJETS ACADEMIQUES','Autres projets académiques'],
    links: ['links'],
    contacts: ['contacts','contact'],
    positions: ['positions', 'position'],
    profiles: ['profiles', 'social connect', 'social-profiles', 'social profiles'],
    awards: ['awards'],
    honors: ['honors'],
    additional: ['additional'],
    certification: ['certification', 'certifications'],*/
    activites: ['Interêts','interests','CENTRES D’INTERETS','bénévole','vie associative','vie associative et intérêt','intérêt','vie associative et intéret',"centres d'interets"],
    DateNaissance:['Née','Née le','Date de naissance','born','birthdate','Né','naissance','DN','Naissance','Date de naissance:'],
    experience:['Parcours','Expérience','Experience','Stages'],
    formation: ['education','Formations','formation','ETUDES & DIPLOMES','etudes','Education','diplomes','formations','Éducation','Projets','PROJETS','Stages Académiques','STAGE'],
    languages: ['languages','langues','Linguistique','Compétences linguistiques'],
    skills: ['Compétences', 'Skills & Expertise', 'technology', 'technologies','COMPETENCES TECHNIQUES','competences techniques','Logiciels maîtrisés','Compétences techniques'],


 
  },
 
  profiles: [
    ['github.com', function(url, Resume, profilesWatcher) {
      download(url, function(data, err) {
        if (data) {
          var $ = cheerio.load(data),
            fullName = $('.vcard-fullname').text(),
            location = $('.octicon-location').parent().text(),
            mail = $('.octicon-mail').parent().text(),
            link = $('.octicon-link').parent().text(),
            clock = $('.octicon-clock').parent().text(),
            company = $('.octicon-organization').parent().text();

          Resume.addObject('github', {
            name: fullName,
            location: location,
            email: mail,
            link: link,
            joined: clock,
            company: company
          });
        } else {
          return console.log(err);
        }
        //profilesInProgress--;
        profilesWatcher.inProgress--;
      });
    }],
    'facebook.com',
    'bitbucket.org',
    'stackoverflow.com'
  ],
  inline: {
    //address: 'address',
    skype: 'Skype'
  },
  regular: {

  /*  DateNaissance:[
      /((((\d{1,2})[-|.|\\|\/](\d{1,2})[-|.|\\|\/](19))\d\d)|(((0[1-9]|[12][0-9]|3[01])[- \\|\/.](janvier|février|mars|avril|mai|juin|juillet|août|septembre|aout|octobre|novembre|décembre)[- \\|\/.](19))\d\d))/
    ],*/

   /* birth:[
      
      "^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"],*/
  
    name: [
      /([A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
    ],

    email: [
      /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
    ],
    /*experience: [
     /(\d+)([\s]ans[\s]d[’|']expérience)/
    ],*/
    
    phone: [
   // /((\+|00)216)?([0-9]{8})|((\+|00)212|0)?([ \-_\s]*)(\d[ \-_\s]*){9}|(([(][+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})|(([+]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/
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