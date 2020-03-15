var request = require("request");
var cheerio = require("cheerio");
var _ = require('underscore');

module.exports = {
  titles: {
    adresse: ['Adresse','km','tunisie','Route','maghreb','Rue','maroc','address','tunisia','Morocco','Ariana','Béja','Ben Arous','Bizerte','Gabès',
    'Gabès','Gafsa','Jendouba','Kairouan','Kasserine','Kébili','Kef','Mahdia','Manouba','Médenine','Monastir','Nabeul','Sfax','	Sidi Bouzid',
    'Siliana','Sousse','Tataouine','Tozeur','Tunis','Zaghouan'],
    objective: ['objective', 'objectives'],
    nationalité: ['tunisien', 'tunisienne','nationalité'],
    summary: ['summary'],
    experience: ['experience','EXPERIENCES PROFESSIONNELLES'],
    formation: ['education','formation','ETUDES & DIPLOMES','etudes','diplomes','formations'],
    diplomes: ['diplomes'],
    skills: ['Compétences', 'Skills & Expertise', 'technology', 'technologies','COMPETENCES TECHNIQUES','competences techniques','Logiciels maîtrisés'],
    languages: ['languages','langues','Linguistique'],
    courses: ['courses'],
    stages: ['stages','stage'],
    projetsacademique: ['PROJETS ACADEMIQUES','Autres projets académiques'],
    experience:['EXPÉRIENCE PROFESSIONNELLE','experience','experiences','professionnelles'],
    links: ['links'],
    contacts: ['contacts','contact'],
    positions: ['positions', 'position'],
    profiles: ['profiles', 'social connect', 'social-profiles', 'social profiles'],
    awards: ['awards'],
    honors: ['honors'],
    additional: ['additional'],
    certification: ['certification', 'certifications'],
    activites: ['interests','CENTRES D’INTERETS','vie associative','vie associative et intérêt','intérêt','vie associative et intéret',"centres d'interets"],
    DateNaissance:['Date de Naissance','Né','birthdate','born'],
    age:['age','ans']
 
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
   /* birth:[
      
      "^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"],*/
  
    name: [
      /([A-Z][a-z]*)(\s[A-Z][a-z]*)/
    ],
   /* adresse:[
      /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/gm
    ],*/
    email: [
      /([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/
    ],
    phone: [
      /(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/
    ]
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