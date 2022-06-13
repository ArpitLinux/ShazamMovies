export var SHAZAMOPTIONS = {
    method: "POST",
    url: "https://shazam.p.rapidapi.com/songs/v2/detect",
    params: { timezone: "America/Chicago", locale: "en-US" },
    headers: {
      "content-type": "text/plain",
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      'X-RapidAPI-Key': '0551ba44ccmsh4360411d0bed797p1ffee2jsne7655170602c'
    },
    data: null,
  };

export var GOOGLEAPIKEY = "AIzaSyCsRpjJQCVzK5fUT6MJMZPKlLTqZJ6PIB8"
export var GOOGLEAPICX = "ffd56f262e76c9bd1"