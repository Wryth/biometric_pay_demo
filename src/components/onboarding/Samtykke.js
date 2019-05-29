import React from 'react';
import './Samtykke.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Samtykke extends React.Component {

  render() {
    return(
    <div className="Samtykke">
        <h2>Samtykke</h2>
        <div className="SamtykkeText">
        <p>Når du signerer med BankID gir du oss tilgang til </p>
        <p><b>Navn</b><br></br>Å hente navnet ditt hos BankID slik at vi vet hvem du er</p>

        <p><b>Kontoinformasjon</b><br></br>Informasjon om dine kontoer slik at du kan velge hvilken konto du vil betale med og vi kan sjekke om du har dekning på konto</p>

        <p><b>Betaling</b><br></br>Du gir oss tilgang til å gjennomføre betalinger etter at du har godkjent dem.</p>
        
        <p><b>Ansiktsgjenkjenning</b><br></br>Bruke bildet av deg til ansiktsgjenkjenning</p>

        <form id="formInput">
            <label><input className type="checkbox" name="vehicle1" value="Bike"></input>Jeg godkjenner at dere får disse tilgangene</label>
        </form>
        </div>
      

        <Link className="linkBtn" id="betalBtn" to="/">Avbryt</Link>
        <Link className="linkBtn" id="betalBtn" to="/">Neste</Link>
    </div>
    );
  }   
}

export default Samtykke;