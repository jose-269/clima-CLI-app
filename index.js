import dotenv from 'dotenv';
dotenv.config();
import colors from 'colors'

import { leerInput, inquirerMenu, pausa, listarLugares } from './helpers/inquirer.js'
import { Busquedas } from './models/busquedas.js';


const main = async () => {
    
    const busquedas = new Busquedas();
    let opt;
    
    do {

        opt =  await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar lugares
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar el lugar
                const id = await listarLugares(lugares);

                if ( id === '0' ) continue;

                const lugarSel = lugares.find( l => l.id === id);

                busquedas.agregarHistorial( lugarSel.nombre )

                // Clima 
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                // Mostrar resultados
                console.clear();
                console.log('\ninformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como estáa el clima:', clima.desc.green);
                break;


                case 2:
                // busquedas.historialCapitalizado.forEach((lugar,i) => {
                // busquedas.leerDB()
                busquedas.historialCapitalizado.forEach((lugar,i) => {
                    const idx = `${ i + 1}.`.green;
                    console.log( `${idx} ${lugar}`);
                })

                break;
            }
            

        if ( opt !== 0)    await pausa();

    } while (opt !== 0);
    
    
};


main();


// "inquirer": "^8.2.4",
