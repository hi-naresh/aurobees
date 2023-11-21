import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import "./TinderCard.css";
import { useAuth } from "../../contexts/AuthContext";
import { getSwipeableUsers } from "../../services/userService"; // Import the function
import { recordSwipe } from "../../services/swipeService";
import { checkForMatch, recordMatch } from "../../services/matchService";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function TinderCards() {
  const [people, setPeople] = useState([]);
  const { currentUser } = useAuth(); // Use your authentication context to get the current user
  const [isMatch, setIsMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const setupCards = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const potentialMatches = await getSwipeableUsers(currentUser.uid);
          // console.log('Fetched Users: ', currentUser.uid);
          console.log(potentialMatches); // Log to inspect the structure
          setPeople(potentialMatches);
        } catch (error) {
          console.error("Error fetching potential matches:", error);
        }
      } else {
        console.log("Current user is not set");
      }
    };

    setupCards();
  }, [currentUser]);

  const swiped = async (direction, person) => {
    const personId = person.id; // Extract id from person object

    try {
      await recordSwipe(currentUser.uid, personId, direction);
      console.log(`Swiped ${direction} on user ${person.id}`, currentUser.uid);

      if (direction === "right") {
        // Check for a match after a right swipe
        const match = await checkForMatch(currentUser.uid, person.id);
        if (match) {
          //   alert(`It's a match with ${person.name}!`); // Use the name instead of ID for a friendly alert
          // Update state if you're using a custom notification component
          setIsMatch(true);
          setMatchedUser(person);
          // Record the match in both users' matches collections
          await recordMatch(currentUser.uid, person.id);
        }
      }
    } catch (error) {
      console.error("Error recording swipe:", error);
    }
  };

  const MatchNotification = () => {
    if (!isMatch || !matchedUser) return null;

    return (
      <div className="match-notification">
        <p>It's a match with {matchedUser.name}!</p>
        <button onClick={() => setIsMatch(false)}>Keep Swiping</button>
        <button
          onClick={() => {
            history.push(`/chat/${matchedUser.id}`);
          }}
        >
          Chat
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Header with the title "Explore" and a filter icon */}
      <div className="explore-header">
        <img className="header__image" src="assets/abees.png" alt="Abees" />
        <h2>Discover</h2>
        <img
          className="header__icon"
          height={"30px"}
          src="assets/setting-4.png"
          alt="Filter"
        />
      </div>

      {/* The rest of your card container as before */}
      <div className="card__container">
        <MatchNotification />
        {people.length > 0 ? (
          people.map((person) => (
            <TinderCard
              className="swipe"
              key={person.id}
              onSwipe={(dir) => swiped(dir, person)}
              preventSwipe={["up", "down"]}
            >
              <div
                style={{
                  backgroundImage: `url(${person.photos[0]})`,
                  backgroundSize: "cover",
                }}
                className="card"
              >
                <h3>{person.name + ", " + person.age}</h3>
                <br />
                <h4>{person.department + " " + person.year}</h4>
              </div>
            </TinderCard>
          ))
        ) : (
          <div className="card">
            <div className="card__no-more">
              <h2>That's everyone!</h2>
              <p>
                {" "}
                You've seen all the people nearby. <br></br>Check later for more
                matches.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TinderCards;
