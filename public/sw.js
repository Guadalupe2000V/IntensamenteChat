importScripts("https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js");
importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/Intensamente.ico',
    'img/avatars/Alegria.jpg',
    'img/avatars/Desagrado.jpg',
    'img/avatars/Furia.jpg',
    'img/avatars/Temor.jpg',
    'img/avatars/Tristeza.jpg',
    'js/app.js',
    'js/sw-utils.js',
    'js/libs/plugins/mdtoast.min.js',
    'js/libs/plugins/mdtoast.min.css'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js'
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});





self.addEventListener( 'fetch', e => {
let respuesta;
    if(e.request.url.includes('/api')){
        //Metodo de manejo de mensajes
        respuesta= manejoApiMensajes(DYNAMIC_CACHE,e.request);
    }

    else{
        respuesta = caches.match( e.request ).then( res => {

            if ( res ) {
                
                actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
            } else {
    
                return fetch( e.request ).then( newRes => {
    
                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
                });
            }
        });
    }
    e.respondWith( respuesta );
});

//tareas asincronas
self.addEventListener('sync', e=>{

    console.log('SW: Sync');
    
        if (e.tag==='nuevo-post'){
            //postearlo en la db cuando haya conexion
            const respuesta = postearMensajes();
            e.waitUntil(respuesta);
        }

});

//escucha push
self.addEventListener('push', e=>{
    //console.log(e);
    // console.log(e.data.text());

    const data = JSON.parse (e.data.text());
    console.log(data);

    const title =e.data.titulo();
    const options = {
        body: data.cuerpo,
        icon: `img/avatars/${data.usuario}.jpg`,
        badge: 'img/favicon.ico',
        image: 'https://iycoalition.org/wp-content/uploads/inside-out.jpg',
        vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
        openUrl: '/'
    };

    e.waitUntil(self.registration.showNotification(title,options));
});