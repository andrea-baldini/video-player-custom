window.addEventListener("DOMContentLoaded", ()=>{

    //gli elementi video e la pulsantiera della barra dei controlli
    let video = document.getElementById('v1');
    let btn_volumePlus = document.getElementById('volumePlus')
    let btn_volumeMinus = document.getElementById('volumeMinus')

    

    //Intercettiamo gli eventi click sui vari pulsanti

    $(document).on("click", '#play', play)

    $(document).on("click", '#pause', pause)

    btn_volumePlus.onclick=function(){
        video.volume+=0.25
    }

    btn_volumeMinus.onclick=function(){
        video.volume-=0.25
    }

    $(document).on('click', '#volumeMuted', function(){
        video.muted=true
        $('#volumeMuted').replaceWith('<button id="volumeUnMuted" class="btn btn-info">UnMute</button>')
    })

    $(document).on('click', '#volumeUnMuted', function(){
        video.muted=false
        $('#volumeUnMuted').replaceWith('<button id="volumeMuted" class="btn btn-dark">Mute</button>')
    })



    //gestione click su elemento video

    video.addEventListener('click', (e)=>{

        document.getElementById('testFORMvideo').style.display='block'
        
        //---al click nel video faccio play o pausa in base allo stato
        if(video.paused){
            play()
        } else {
            pause()
        }

        //chiamiamo una funzione che registrerà il contesto di quel frame (minutaggio, possibilità di scrivere un commento, pulsante per salvare la configurazione nel localStorage)
        getSec(e)
    })


    //gestione dell'evento click sul pulsante Cancella tutto
    document.getElementById("cancellaTutto").addEventListener('click', (e)=>{
        //cancelliamo il contenuto del pannello di video titolazione
        if(confirm('Vuoi continuare? Il contenuto del pannello e il localStorage saranno cancellati')){
            document.getElementById("testFORMvideo").style.display ="none"
            document.getElementById("testFORMvideo").innerHTML="<h4>Video Titolazione Panel</h4>"
            //cancelliamo tutte le entries del localStorage
            localStorage.clear()
            //set counter to 1
            cont = 1
        }
    })
    
    //verifica di eventuali form nel localStorage --> se presenti vengono stampate nel dom 
    for (var i = 1; i <= localStorage.length; i++){
        let idOldForm = "formsec" + i
        let updateOldForm = localStorage.getItem(idOldForm)

        $('#testFORMvideo').append(`
            <form id="${idOldForm}">
            ${updateOldForm}
            </form>
        `)
    }

    //---mostro il div nel caso il localStorage abbia elementi
    if (localStorage.length != 0){
        document.getElementById('testFORMvideo').style.display='block'
    }

    //---funzioni di play e pausa
    function play(){
        video.play()
        $('#play').replaceWith('<button id="pause" class="btn btn-secondary">Pause</button>')
    }

    function pause(){
        video.pause()
        $('#pause').replaceWith('<button id="play" class="btn btn-success">Play</button>')
    }   

    //---funzione che al click sul tempo salvato nel commento ti permette di andare a quel preciso momento nel video
    $(document).on('click', 'form input:first-child', function(){
        let timeValue = $(this).val()
        timeValue = timeValue.replace('sec', '')
        video.currentTime = timeValue
        play();
    })

})//DomContentLoaded



//verifico se sono presenti form salvati nel localStorage e nel caso aggiorno il contatore
if (localStorage.length == 0){
    var cont = 1
    } else {
    cont = localStorage.length + 1
}


function getSec(the_video){

    //if condition per prevenire la formazione di commenti vuoti ad ogni click
    if($(`#commento${cont}`).val() != "") {

    var div=document.getElementById('testFORMvideo') //il div contenitore delle form

    //Creiamo le singole form per ogni gruppo di elementi 
    var formFigli = document.createElement('form')

    //attributi dell'elemento form creato
    var secID = "sec" + cont 
    var formIDsec = 'form' + secID

    formFigli.setAttribute('id', formIDsec);
    div.appendChild(formFigli)

    //casella di testo per registrare il minutaggio
    var inputTextSec = document.createElement('input')

    inputTextSec.setAttribute('id', secID )
    inputTextSec.setAttribute('type', 'text')
    inputTextSec.setAttribute('class', 'clickable')
    inputTextSec.setAttribute('value', `${the_video.target.currentTime.toFixed(1)} sec`)
    inputTextSec.setAttribute('readonly', true)
    formFigli.appendChild(inputTextSec)

    //casella di testo per inserire un commento

    var inputText = document.createElement('input')
    inputText.setAttribute('id', "commento" + cont )
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('size', 50 )
    inputText.setAttribute('placeholder', 'Inserisci un commento sul frame')
    formFigli.appendChild(inputText)

    //pulsante per salvare la configurazione

    var inputsalva=document.createElement('input')
    inputsalva.setAttribute('id', "btn_salva_" + cont )
    inputsalva.setAttribute('type', 'button')
    inputsalva.setAttribute('value', 'Salva breakpoint n° ' + cont)
    formFigli.appendChild(inputsalva)
    inputsalva.setAttribute('onclick', "salvaBreakPoint('" + formIDsec + "')")
    
    } 

} //getSec


//salva tutta la form nel localStorage 
function salvaBreakPoint(chiave){
    
    var commento = document.getElementById('commento' + cont).value

    if(commento =='' || commento == undefined){
        alert("Devi inserire un commento")
    }

    //visualizzo il feedback

    document.querySelector("#feedback h6").style.display="block"
    document.querySelector("#feedback h6").innerHTML = `Breakpoint n° ${cont} salvato`

    //cancello il commento e poi lo ricreo inserendo nella proprietà value la variabile commento che mi sono copiato
    document.getElementById(chiave).removeChild(document.getElementById('commento' + cont))

    //lo ricreo con l'attributo value = a quanto effettivamente scritto
    var inputText = document.createElement('input')
    inputText.setAttribute('id', "commento" + cont )
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('size', 50 )
    inputText.setAttribute('value', commento)
    document.getElementById(chiave).appendChild(inputText)

    var buttonClone = document.getElementById('btn_salva_' + cont).cloneNode()
    buttonClone.value = "Salva breakpoint n° " + cont
    console.log(buttonClone)
    document.getElementById(chiave).removeChild(document.getElementById('btn_salva_' + cont))
    document.getElementById(chiave).appendChild(buttonClone)

    //salvo tutto il contenuto della form all'interno del localStorage
    var valore = document.getElementById(chiave).innerHTML
    localStorage.setItem(chiave, valore)

    

    //faccio sperire il feedback dopo 3 secondi
    window.setTimeout(
        () => {
            document.querySelector("#feedback h6").style.display="none"
        },3000
    )

    cont++ //incremento del contatore
}


