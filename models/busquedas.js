import fs from 'fs';

import  axios  from 'axios';

class Busquedas {

  historial = [];
  dbPath = './db/database.json';

  constructor(){
    this.leerDB();
  };

  get historialCapitalizado() {

      return this.historial.map((lugar) => {
        let palabras = lugar.split(' ');
        palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

        return palabras.join(' ')
      })
  }

  get paramsMapBox() {

    return {
      'language': 'es',
      'access_token': process.env.MAPBOX_KEY
    }

  };

  get paramsWeather () {
      return {
        appid : process.env.OPENWEATHER_KEY,
        units : 'metric',
        lang : 'es'
      }
  }

  async ciudad( lugar = '') {

    try {
       //Peticion HTTP

       const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox
       });
       const resp = await intance.get();
      // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/santiago.json?proximity=ip&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1Ijoiam9zZS0yNjkiLCJhIjoiY2w4NjYxNnpyMHdubDNucGhhdjV3N2RobiJ9.i4kSh0TsMkDsS2ivA6wF4g');

      return resp.data.features.map( lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat:lugar.center[1]
      }))

    } catch (error) {
      return [];
    }
   
  }


  async climaLugar( lat, lon) {
    


    try {

      const instance = axios.create({
        // baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.OPENWEATHER_KEY}&units=metric&lang=es`,
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon }
       });
      // intance axios.create()
       const resp = await instance.get();

       const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      }
      
    } catch (error) {
      console.log(error);
    }

  }

  agregarHistorial( lugar = '' ) {

    if ( this.historial.includes( lugar.toLocaleLowerCase() )) {
      return;
    }
    this.historial = this.historial.splice(0,5);
    this.historial.unshift( lugar.toLocaleLowerCase() );

    // Grabar DB
    this.guardarDB();
  }

  guardarDB() {

    const payload = {
      historial: this.historial
    }
    fs.writeFileSync( this.dbPath, JSON.stringify(payload) );
  }
  leerDB() {
    
    // Debe de existir
    if( !fs.existsSync(this.dbPath) ) return;

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    const data = JSON.parse( info );
    // console.log(data);
    this.historial = data.historial;

  }

};

export {Busquedas}