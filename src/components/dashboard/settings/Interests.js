import React, { useState } from "react";
import "./Interests.css";
import database from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../common/SnackBar";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const interestsData = {
  "Self care": [
    "Deep chats",
    "Mindfulness",
    "Nutrition",
    "Sex positivity",
    "Sleeping well",
    "Therapy",
    "Time offline",
  ],
  Sports: [
    "Bowling",
    "Table tennis",
    "American football",
    "Athletics",
    "Badminton",
    "Baseball",
    "Basketball",
    "Bouldering",
    "Boxing",
    "Cricket",
    "Cycling",
    "Football",
    "Go karting",
    "Golf",
    "Gym",
    "Gymnastics",
    "Handball",
    "Hockey",
    "Horse riding",
    "Martial arts",
    "Meditation",
    "Netball",
    "Pickleball",
    "Pilates",
    "Rowing",
    "Rugby",
    "Running",
    "Sailing",
    "Scuba diving",
    "Skateboarding",
    "Skiing",
    "Softball",
    "Surfing",
    "Swimming",
    "Tennis",
    "Volleyball",
    "Yoga",
  ],
  Creativity: [
    "Dancing",
    "Art",
    "Crafts",
    "Design",
    "Make-up",
    "Making videos",
    "Photography",
    "Singing",
    "Writing",
  ],
  "Going out": [
    "Stand up",
    "Bars",
    "Cafe-hopping",
    "Drag shows",
    "Festivals",
    "Gigs",
    "Karaoke",
    "LGBTQ+ nightlife",
    "Museums & galleries",
    "Nightclubs",
    "Theatre",
  ],
  "Film & TV": [
    "Action & adventure",
    "Animated",
    "Anime",
    "Bollywood",
    "Comedy",
    "Cooking shows",
    "Crime",
    "Documentaries",
    "Drama",
    "Fantasy",
    "Game shows",
    "Horror",
    "Indie",
    "K-drama",
    "Mystery",
    "Reality shows",
    "Rom-com",
    "Romance",
    "Sci-fi",
    "Superhero",
    "Thriller",
  ],
  Reading: [
    "Action & adventure",
    "Biographies",
    "Classics",
    "Comedy",
    "Comic books",
    "Crime",
    "Fantasy",
    "History",
    "Horror",
    "Manga",
    "Mystery",
    "Philosophy",
    "Poetry",
    "Psychology",
    "Romance",
    "Science",
    "Thriller",
  ],
  Music: [
    "Afro",
    "Arab",
    "Blues",
    "Classical",
    "Country",
    "Desi",
    "EDM",
    "Electronic",
    "Folk & acoustic",
    "Funk",
    "Hip hop",
    "House",
    "Indie",
    "Jazz",
    "K-pop",
    "Latin",
    "Metal",
    "Pop",
    "Punjabi",
    "Reggae",
    "R&B",
    "Rap",
    "Rock",
    "Soul",
    "Sufi",
    "Techno",
  ],
  "Food & drink": [
    "Beer",
    "Biryani",
    "Boba tea",
    "Cocktails",
    "Coffee",
    "Foodie",
    "Maggi",
    "Pizza",
    "Sushi",
    "Sweet tooth",
    "Takeout",
    "Tea",
    "Vegan",
    "Vegetarian",
    "Whisky",
    "Wine",
  ],
  Travelling: [
    "Backpacking",
    "Beaches",
    "Camping",
    "City breaks",
    "Country escapes",
    "Fishing trips",
    "Hiking trips",
    "Road trips",
    "Spa weekends",
    "Winter sports",
  ],
  Pets: ["Birds", "Cats", "Dogs", "Fish", "Turtles"],
  "Values & traits": [
    "Ambition",
    "Being active",
    "Being family-oriented",
    "Being open-minded",
    "Being romantic",
    "Confidence",
    "Creativity",
    "Empathy",
  ],
};

const InterestButton = ({ interest, onSelectInterest, isSelected }) => {
  return (
    <button
      className={`interest-button ${isSelected ? "selected" : ""}`}
      onClick={() => onSelectInterest(interest)}
    >
      {interest}
    </button>
  );
};

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const {currentUser } = useAuth();
  const { openSnackbar } = useSnackbar(); // Use the hook
  const history = useHistory();


  const handleSelectInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      // Remove interest if it's already selected
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      // Add interest if less than 7 already selected, else show alert
      if (selectedInterests.length < 7) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        openSnackbar('You can only select up to 7 interests');
      }
    }
  };

  const handleSave = async () => {
    // Implement save logic, e.g., update user profile in the backend
    if (currentUser) {
      try {
        await database.collection("users").doc(currentUser.uid).update({
          interests: selectedInterests,
        });
        console.log("Saved interests:", selectedInterests);
        history.push('/personality');
        // Optional: Show success message or navigate to another screen

      } catch (error) {
        console.error("Error updating interests:", error);
        // Optional: Show error message
      }
    } else {
      console.error("No user is logged in");
      // Optional: Redirect to login or show message
    }
  };

  return (
    <div className="interests-screen">
      <div className="settings_header">
        <h1 className="header__title">Interests</h1>
        <p className="header__notification">You can choose 7 interests</p>
      </div>
      <div className="scrollable-content">
        {Object.entries(interestsData).map(([category, interests]) => (
          <div key={category} className="interest-category">
            <h2 className="interest-category__title">{category}</h2>
            <div className="horizontal-slider">
              {interests.map((interest) => (
                <InterestButton
                  key={interest}
                  interest={interest}
                  onSelectInterest={handleSelectInterest}
                  isSelected={selectedInterests.includes(interest)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default Interests;
