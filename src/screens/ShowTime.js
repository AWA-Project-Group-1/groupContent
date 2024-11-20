import {useState, useEffect}from 'react'
import Navigation from '../components/Navigation'
import HeroSection from '../components/HeroSection'
import Footer from "../components/Footer"
import styles from "../screens/TVDetail"
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
      }, []);
    

    return (
        <div>
            <div className={styles["navigation-hero-container"]} >
                <Navigation />
                <HeroSection />
            </div>
            
            {/* <div>
                { showTime.map(
                    (item)  => (
                        <div>
                            <img src={item.image} alt="" />
                            <h2>{item.title}</h2>
                            <p>ShowTime: {item.showStart}-{item.showEnd} </p>
                            <p>Bye Ticket: {item.showUrl}</p>
                            

                        </div>
                        
                    )                    
                )}
            </div> */}
            <div>
            {showTime.map((item, index) => (
                <div key={index} className={styles["show-time-container"]}>
                    <span className={styles["status-badge"]} >{new Date(item.showStart) > new Date() ? 'Coming Soon' : 'Now Showing'}</span>
                    <div className="show-left">
                        
                        <img src={item.image} alt={item.title} className={styles["show-image"]} />
                       
                    </div>
                    <div   className={styles["show-right"]}  >
                        <h2>{item.title}</h2>
                        <p>Show Time: {item.showStart} - {item.showEnd}</p>
                        <p>
                            <a href={item.showUrl} target="_blank" rel="noopener noreferrer" className="buy-ticket-button">
                                Buy Ticket
                            </a>
                        </p>
                    </div>

                    <div className={styles["show-rightmost"]}>

                    </div>
                </div>
            ))}
        </div>
        <Footer />
        </div>
    )
}

export default ShowTime
