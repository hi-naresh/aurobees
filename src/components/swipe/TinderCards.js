import React, { useEffect, useRef, useState } from "react";
import Swipeable from "react-swipy";
import "./TinderCard.css"; // Make sure this CSS file exists and contains your styles
import { useAuth } from "../../contexts/AuthContext";
import { getSwipeableUsers } from "../../services/userService";
import { recordSwipe } from "../../services/swipeService";
import { checkForMatch, recordMatch } from "../../services/matchService";
import MatchNotification from "./Match"; // Assuming this is a component you've created
import { useHistory } from "react-router-dom";
import Card from "./Card"; // Your Card component
import RightIcon from "../../icons/right.svg";
import LeftIcon from "../../icons/wrong.svg";


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

  const [swipeDirection, setSwipeDirection] = useState(null);
  const currentCardRef = useRef(null);

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

  // This effect triggers every time swipeDirection changes
  useEffect(() => {
    if (swipeDirection && currentCardRef.current) {
      // This is where you would add your animation logic
      const cardElement = currentCardRef.current;
      // Trigger CSS animation based on the swipe direction
      cardElement.style.transition = "transform 0.5s ease-out";
      cardElement.style.transform = `translateX(${
        swipeDirection === "right" ? 1000 : -1000
      }px)`;

      // After the animation completes, reset everything
      setTimeout(() => {
        removeUserFromList(); // Remove the user from the list
        cardElement.style.transition = "none";
        cardElement.style.transform = "none"; // Reset transform for the next card
        setSwipeDirection(null); // Reset swipe direction
      }, 500); // Match your CSS animation duration
    }
  }, [swipeDirection]);

  const removeUserFromList = () => {
    setPeople((prevPeople) => prevPeople.slice(1));
  };

  const handleManualSwipe = async (direction) => {
    if (people.length > 0) {
      const person = people[0]; // Get the top card (current card)
      await handleSwipe(direction, person); // Use your existing swipe handler

      // Animate the card swipe
      if (currentCardRef.current) {
        const cardElement = currentCardRef.current;
        cardElement.style.transition = "transform 0.5s ease-out";
        cardElement.style.transform = `translateX(${
          direction === "right" ? 1000 : -1000
        }px)`;

        // After the animation, proceed as if the card was swiped
        setTimeout(() => {
          removeUserFromList();
          cardElement.style.transition = "none";
          cardElement.style.transform = "none";
        }, 500); // Should match your CSS animation duration
      }
    }
  };

  const renderCards = () => {
    return people.map((person, index) => (
      <Swipeable
        key={person.id}
        onAfterSwipe={() => removeUserFromList()}
        onSwipe={(dir) => handleSwipe(dir, person)}
      >
        <Card zIndex={people.length - index} id={`card-${person.id}`}>
          {/* Card content goes here */}
          <div
            div
            ref={index === 0 ? currentCardRef : null}
            key={person.id}
            className="cardContent"
          >
            <div className="scrollableArea">
              {/* Image section */}
              <div
                className="card-image-section"
                style={{ backgroundImage: `url(${person.photos[0]})` }}
              >
                <h2 className="title">
                  {person.name}, {person.age}
                  <p>
                    {person.department}-{person.year}
                  </p>
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
              <div className="card-info-section"></div>
            </div>
          </div>
        </Card>
      </Swipeable>
    ));
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
          {people.length > 0 ? renderCards() : (
            <div className="cardContent">
              <div className="card__no-more">
                <h2>That's everyone!</h2>
                <p>
                  {" "}
                  You've seen all the people nearby. <br></br>Check later for
                  more matches.
                </p>
              </div>
            </div>
          )}
        </div>

        {people.length > 0 && ( // Only show buttons if there are cards
          <div className="like-dislike-btn-container">
            <button
              className="like-btn"
              onClick={() => handleManualSwipe("right")}
            >
              <img height={"30px"} src={RightIcon} alt="Like" />
            </button>
            <button
              className="dislike-btn"
              onClick={() => handleManualSwipe("left")}
            >
              <img height={"24px"} src={LeftIcon} alt="Dislike" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default TinderCards;
