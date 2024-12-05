import {useState, useEffect}from 'react'
//import Navigation from '../components/Navigation'
//import HeroSection from '../components/HeroSection'
//import Footer from "../components/Footer"
//import styles from "../screens/MovieDetail"
import './GroupDetails.css'

const ShowTime = () => {
    const [showTime, setShowTime] = useState([])

    const url = `https://www.finnkino.fi/xml/Schedule/`
    useEffect(() => {    
    
        fetch(url)
          .then((res) => res.text()) // Parse the JSON response
          .then((data) => {
            const parser = new DOMParser();
            const dataDocument= parser.parseFromString(data, "application/xml");
            
            const showstime = Array.from(dataDocument.getElementsByTagName("Show")).map(show => ({
                title: show.getElementsByTagName("Title")[0].textContent,
                showStart: show.getElementsByTagName("dttmShowStart")[0].textContent,
                showEnd: show.getElementsByTagName("dttmShowEnd")[0].textContent,
                theatreID: show.getElementsByTagName("TheatreID")[0].textContent,
                showUrl:show.getElementsByTagName("ShowURL")[0].textContent,
                image:show.getElementsByTagName("EventMediumImagePortrait")[0].textContent
            }));
           
            setShowTime(showstime); // Set movie details to state
            console.log(`This is the detail: ${showstime}`)
           
          })
          .catch((err) => {
            console.error('Error fetching movie details:', err); // Handle errors
          });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
    

    return (
        
        <div>
            <h4>Movies</h4>
            <button className="add-movies">Add Movies</button>


            
            
            <h4>Show time</h4>
            <button className="add-showtime">Add Showtime</button> 
            <div className="movie-list-container">
              {showTime.map((item, index) => (
                <div key={index} className="show-time-container">
                <div className="show-left">
                <img src={item.image} alt={item.title} className="show-image" />
            </div>
            
            <div className="show-right">
                <span className="status-badge">
                    {new Date(item.showStart) > new Date() ? 'Coming Soon' : 'Now Showing'}
                </span>
                <h2>{item.title}</h2>
                <p>Show Time: {item.showStart}</p>
                <a href={item.showUrl} target="_blank" rel="noopener noreferrer" className="buy-ticket-button">
                    Buy Ticket
                </a>
            </div>
        </div>
    ))}

</div>

</div>

    )
}

export default ShowTime
