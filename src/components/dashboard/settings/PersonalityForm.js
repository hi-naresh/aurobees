import React, { useState } from 'react';
import './PersonalityForm.css'; // Import the CSS file here
import { useAuth } from '../../../contexts/AuthContext';
import { firebase } from "../../../firebase";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';



const PersonalityForm = () => {
  const [activeStep, setActiveStep] = useState(0); 
  const { currentUser } = useAuth();
  const [error, setError] = useState(null); 
  const history = useHistory();
  const [isCompleted, setIsCompleted] = useState(false); 
  
  const questions = [
    { id: 1, question: "Do you drink?", options: ["Frequently", "Socially", "Rarely", "Never", "Sober", "Skip"] },
    { id: 2, question: "Do you smoke?", options: ["Socially", "Never", "Regularly", "Skip"] },
    { id: 4, question: "Do you work out?", options: ["Active", "Sometimes", "Almost never", "Skip"] },
    { id: 5, question: "What are your ideal plans for children?", options: ["Want someday", "Don’t want", "Have and want more", "Have and don’t want more", "Not sure yet", "Have kids", "Open to kids", "Skip"] },
    { id: 6, question: "What is your zodiac sign?", options: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Other"] },
    { id: 7, question: "What are your political leanings?", options: ["Apolitical", "Moderate", "Left", "Right", "Communist", "Socialist", "Skip"] },
    { id: 8, question: "Do you identify with a religion?", options: ["Agnostic", "Atheist", "Buddhist", "Catholic", "Christian", "Hindu", "Jain", "Jewish", "Other"] },
    { id: 9, question: "What is your education?", options: ["High school", "College", "University", "Masters", "PhD", "Skip"] },
    { id: 10, question: "What do you want from your dates?", options: ["Something casual", "Go with Flow", "Figuring Out", "Something serious", "Skip"] },
  ];

  const currentQuestion = questions[activeStep];

  // If the current step does not have a corresponding question, we've finished the quiz
  if (!currentQuestion) {
    // You can render a completion message or handle the quiz completion here
    return <div>Thank you for completing the personality quiz!</div>;
  }
  

  const handleSelectOption = async (option) => {
    setError(null); // Reset error state before new operation
    try {
      // Update the user's document with the selected option
      const userDocRef = firebase.firestore().collection('users').doc(currentUser.uid);
      await userDocRef.update({
        personality: firebase.firestore.FieldValue.arrayUnion({
          questionId: currentQuestion.id,
          answer: option,
        }),
      });

      if (activeStep < questions.length - 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setIsCompleted(true);
      }
    } catch (err) {
      // Handle errors, such as showing a message to the user
      console.error("Error updating personality answers: ", err);
      setError("An error occurred while saving your answers. Please try again.");
    }
  };

  const handleDone = () => {
    history.push('/swipe');
  };

  if (isCompleted) {
    // Render the "Done" screen
    return (
      <div className="question-container">
        <h1>All done!</h1>
        <p>Thank you for answering the questions.</p>
        <button onClick={handleDone}>Done</button>
      </div>
    );
  }

  return (
    <div className="personality-fill-up">
      {error && <div className="error">{error}</div>} {/* Display any error that occurred */}
      <div className="progress-bar">
        <div className="progress-bar-inner" style={{ width: `${((activeStep + 1) / questions.length) * 100}%` }}></div>
      </div>
      <div className="question-container">
        <h1>{currentQuestion.question}</h1>
        {currentQuestion.options.map((option, index) => (
          <button key={index} onClick={() => handleSelectOption(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonalityForm;
