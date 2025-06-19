// fase di preparazione

const dayCounter = document.querySelector('#days-counter');
const incrementDayButton = document.querySelector('#increment-button');
const decrementDayButton = document.querySelector('#decrement-button');
const generaItinerario = document.querySelector('#genera-itinerario');
const renderCard = document.querySelector('#render-card');
const newItineraryButton= document.querySelector('#new-itinerary');
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAEJRAsbriyjYdmvIneqh5LkZmdSRXaJXM";
const main = document.querySelector('main');
// AIzaSyAEJRAsbriyjYdmvIneqh5LkZmdSRXaJXM
let itineraryCards=[];

const destinaz = document.querySelector('#destinazione');




//fase di interazione

//incrementa giorni
incrementDayButton.addEventListener('click', function() {
    //recupero i giorni 
    const currentDay = Number(dayCounter.innerHTML);
    //incremento il giorno e lo sostituisco
    dayCounter.innerHTML= currentDay + 1;
});
//decrementa giorni
decrementDayButton.addEventListener('click', function() {
    //recupero i giorni
    const currentDay = Number(dayCounter.innerHTML);
    //decremento il giorno e lo sostituisco
    dayCounter.innerHTML= currentDay - 1;
});
//genera itinerario

generaItinerario.addEventListener('click', async function(){
    
    // recupero destinazione
    
    const destinazione =document.querySelector('#destinazione').value.trim();
    console.log(destinazione);

    //recupero tipologia
    const tripType =document.querySelector('.type-input-select:checked').value;
    

    //recupero giorni totali
    const days = dayCounter.innerHTML;
    
        
   if (destinazione != "") {
    main.className="loading";

    await getItineraryFromGemini(destinazione, tripType, days);
    //renderizzo card risultato
    renderCards();

    //mostro la schermata risultato

    main.className="result";

    
}
else{
    alert("!! Inserisci il campo destinazione !!");
    destinaz.focus();
}
});

// click nuovo itinerario
newItineraryButton.addEventListener('click', function(){
    location.reload();
})




//fase generativa

 async function getItineraryFromGemini(destinazione, tripType, days){
    // preparo il prompt da inviare a gemini
    const prompt= `Sto costruendo un'app che ha bisogno di JSON puro come output.
                    NON aggiungere alcuna formattazione, markdown o codice. 
                    Solo JSON puro nel formato seguente (nulla prima o dopo):
                    [{"day":"Giorno 1","activities":[{"title":"Musei Vaticani","text":"Esplora i Musei Vaticani e la Cappella Sistina"},{"title":"Piazza San Pietro","text":"Visita la Basilica di San Pietro e la piazza"},{"title":"Castel Sant'Angelo","text":"Scopri la storia di Castel Sant'Angelo"}]}]
                    Crea un itinerario di ${days} giorni per una vacanza di tipo ${tripType} a ${destinazione}.
                    indica anche i luoghi.`;

    // preparo i dati da inviare a gemini
    const conf = {
        method: 'POST',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents:[{parts: [{text: prompt}]}]
        })
    };
    const response = await fetch(API_ENDPOINT, conf);
    const data = await response.json();
    itineraryCards = JSON.parse(data.candidates[0].content.parts[0].text);
};

function renderCards(){
    itineraryCards.forEach(function (itinerary){

        let activitiesTemplates='';

        itinerary.activities.forEach(function(activity){
            activitiesTemplates+= `
            <div class="activity">
                    <h4>${activity.title}</h4>
                    <p>${activity.text}</p>
                </div>`;

        })
        const templateCards = `
    <div class="card">
         <h3 class="card-title card-activities-title">${itinerary.day}</h3>
             ${activitiesTemplates}
    </div>`;
    renderCard.innerHTML+= templateCards;
        
 })


    
}

