import React, { useEffect, useState } from "react";
import Swipeable from "react-swipy";
import "./TinderCard.css"; // Make sure this CSS file exists and contains your styles
import { useAuth } from "../../contexts/AuthContext";
import { getSwipeableUsers } from "../../services/userService";
import { recordSwipe } from "../../services/swipeService";
import { checkForMatch, recordMatch } from "../../services/matchService";

import database from "../../firebase";
import MatchNotification from "./Match"; // Assuming this is a component you've created
import { useHistory } from "react-router-dom";
import Card from "./Card"; // Your Card component
import Button from "./Button"; // Your Button component

const appStyles = {
  height: "80vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "80vh",
  fontFamily: "sans-serif",
  overflow: "hidden",
  marginTop: "20px",
};

const wrapperStyles = {
  position: "relative",
  width: "94vw",
  height: "80vh",
};

function TinderCards() {
  const [people, setPeople] = useState([]);
  const { currentUser } = useAuth();
  const [isMatch, setIsMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState();
  const history = useHistory();

  useEffect(() => {
    const setupCards = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const potentialMatches = await getSwipeableUsers(currentUser.uid);
          setPeople(potentialMatches);
        } catch (error) {
          console.error("Error fetching potential matches:", error);
        }
      }
    };
    setupCards();
  }, [currentUser]);

  const handleSwipe = async (direction, person) => {
    try {
      await recordSwipe(currentUser.uid, person.id, direction);
      console.log(`Swiped ${direction} on user ${person.id}`);

      if (direction === "right") {
        const match = await checkForMatch(currentUser.uid, person.id);
        if (match) {
          setIsMatch(true);
          setMatchedUser(person);
          await recordMatch(currentUser.uid, person.id);
        }
      }
    } catch (error) {
      console.error("Error recording swipe:", error);
    }
  };

  const removeUserFromList = () => {
    setPeople((prevPeople) => prevPeople.slice(1));
  };

  return (
    <>
      <div className="explore-header">
        <img className="header__image" src="assets/abees.png" alt="Abees" />
        <h2>Discover</h2>
        <img
          className="header__icon"
          height={"28px"}
          src="assets/setting-4.png"
          alt="Filter"
        />
      </div>
      <MatchNotification
        isMatch={isMatch}
        matchedUser={matchedUser}
        userData={currentUser}
        onContinueSwiping={() => setIsMatch(false)}
        onStartConversation={() => history.push(`/chat/${matchedUser.id}`)}
      />
      <div style={appStyles}>
        <div style={wrapperStyles}>
          {people.length > 0 ? (
            people.map((person, index) => (
              <Swipeable
                key={person.id}
                buttons={({ right, left }) => (
                  <div>
                    <Button onClick={() => left()}>Reject</Button>
                    <Button onClick={() => right()}>Accept</Button>
                  </div>
                )}
                onAfterSwipe={() => removeUserFromList()}
                onSwipe={(dir) => handleSwipe(dir, person)}
              >
                <Card zIndex={people.length - index}>
                  {/* Card content goes here */}
                  <div className="cardContent">
                    <div className="scrollableArea">
                      {/* Image section */}
                      <div
                        className="card-image-section"
                        style={{ backgroundImage: `url(${person.photos[0]})` }}
                      >
                        <h2 className="title">
                          {person.name}, {person.age}
                        </h2>
                        {/* Other card details */}
                      </div>
                      <div className="card-bio">
                        <h3>About me</h3>
                        <p>{person.bio}</p>
                      </div>
                      <div className="card-basics">
                        <h3>My basics</h3>
                        {person.interests.split(", ").map((interest, index) => (
                          <span className="description" key={index}>
                            {interest}
                          </span>
                        ))}
                        <span className="description">{person.lookingFor}</span>
                      </div>

                      {/* Interests section */}
                      <div className="card-interests-section"></div>

                      {/* Additional image sections */}
                      {person.photos.slice(1).map((photoUrl, index) => (
                        <div
                          key={index}
                          className="card-image-section"
                          style={{ backgroundImage: `url(${photoUrl})` }}
                        ></div>
                      ))}

                      {/* Other information like department, lookingFor, etc. */}
                      <div className="card-info-section">
                        <p>Department: {person.department}</p>
                        <p>Looking for: {person.lookingFor}</p>
                        {/* ... other details */}
                      </div>
                    </div>
                  </div>
                </Card>
              </Swipeable>
            ))
          ) : (
            <div className="cardContent">
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
    </>
  );
}

export default TinderCards;
