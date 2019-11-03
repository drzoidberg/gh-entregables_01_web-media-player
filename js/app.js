'use strict'

document.addEventListener('DOMContentLoaded', (event) => {

    // arranca el objeto SoundCloud para realizar búsquedas
    SC.initialize({
        client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
    });

    const busqueda = {
        q: '',
        limit: ''
    }

    // crea el container y lo inyecta en el DOM
    const div = document.createElement('div');
    div.setAttribute('id', 'iframeSCPlayerContainer');

    // crea el iframe con sus props y lo inyecta en el DOM
    const iframeSCObjectStart = new IframeSC();
    iframeSCObjectStart.src += formatURIParams(iframeSCURIParams)
    const iframeSCPlayer = createNode('iframe', iframeSCObjectStart );
    iframeSCPlayer.setAttribute('id', 'iframeSCPlayer');
    document.body.appendChild(iframeSCPlayer);

    // crea el div 'dropzone' y lo inyecta en el DOM
    const divSCDropzone = createNode('div', { id: 'divSCDropzone', class: 'dropzone', style: 'width: 332px; height: 166px; background: grey; display: inline-block' });
    document.body.appendChild(divSCDropzone);

    // y así sucesivamente…
    const inputSCTextSearch = createNode('input', { type: 'text', id: 'inputSCTextSearch', placeholder: 'type in your query' } );
    document.body.appendChild(inputSCTextSearch);

    const numResultsSC = createNode('input', { type: 'number', id: 'numResultsSC', min: 1, max: 30, step: 2, value: 10, placeholder: 'number of search results' } );
    document.body.appendChild(numResultsSC);

    const searchSCButton = createNode('button', { type: 'button', id: 'searchSCButton' } );
    searchSCButton.innerText = 'Search';
    document.body.appendChild(searchSCButton);

    let resultTmp = '';

    // cuando se hace click en el botón 'Search' se realiza la búsqueda…
    searchSCButton.addEventListener('click', (event) => {
        busqueda.q = inputSCTextSearch.value;
        busqueda.limit = numResultsSC.value;

        SC
            .get('/tracks/', busqueda)
            .then( (results) => {
                let contador = 1;
                results.forEach( result => {
                    resultTmp = createNode('p', { class: 'result', id: `result${contador}`, draggable: true, 'data-trackid':`${result.id}` });
                    resultTmp.innerHTML = `${result.user.username}: ${result.title}`;
                    document.body.appendChild(resultTmp);
                    contador++;
                })
            })
            // .then( (results) => console.log(results[0].id) )
            .catch( (error) => console.log(error))
    })

    ////// DRAG & DROP
    // --> https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
    // --> https://jsfiddle.net/zfnj5rv4/

    let dragged;
    let dropzone = document.querySelector('#divSCDropzone');

    // escucha eventos sobre el objetivo dragabble
    document.addEventListener('drag', (event) => {

    });

    // guarda la referencia del elemento dragged cuando empieza el drag y manipula el estilo
    document.addEventListener('dragstart', (event) => {
        dragged = event.target;
        event.target.style.opacity = .5;
        dropzone.style.background = 'red';
    });

    // cuando acaba el drag resetea el estilo del 'dropabble'
    document.addEventListener('dragend', (event) => {
        event.target.style.opacity = '';
        dropzone.style.background = 'grey';
    });

    // eventos de los elementos 'droppable'
    document.addEventListener('dragover', (event) => {
        // preventdefault para permitir el drop
        event.preventDefault();
    });

    document.addEventListener('dragenter', (event) => {
        // marcar el dropzone cuando el elemento draggable entre en la dropzone
        if ( event.target.className == 'dropzone' ) {
            event.target.style.background = 'purple';
            // cambiar estilo css
        }

    });

    document.addEventListener('dragleave', (event) => {
        // resetea el background al estilo 'dragstart' de dropzone objetivo cuando el elemento draggable lo abandona
        if ( event.target.className == 'dropzone' ) {
            event.target.style.background = 'red';
        }

    });

    document.addEventListener('drop', (event) => {
        event.preventDefault();
        if ( event.target.className == 'dropzone' ) {
            event.target.style.background = '';
        }

    });

})



// SC.stream('/tracks/293').then(function(player){
//     player.play();
// });