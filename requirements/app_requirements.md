# Project Overview
Use this guide to build a web app that is a quiz game based on books for 5th graders.  It is a single player game, but many players access it at the same time since it will be deployed.  The goal is to provide an age appropriate game, that tests their knowledge of trivia based on the books.

# Feature requirements
- The name of the app is "Beanie Bears Book Quest" which is shown at the top of the game
- Correct answers get 10 points, incorrect answers get -5 points.  It's possible to have a negative score.
- There should be a button to reset the score, otherwise it continues to keep a running score
- The quiz is based on the questions in the `app/data/questions.json` file.
- The questions json file defines meta data telling you what the books are, and how many questions there are per book.
- The quiz area asks one question at a time and are always multiple choice or true/false.  The questions json indicates what a question type is.
- Since the questions are from multiple books, you need to show the book title on top of the question to give the user context for which book it is.
- For multiple choice questions, show between 3-5 possible choices, always including the correct answer as one of the choices.
- The possible choices are always randomized so it's not easy to know a pattern of where a right answer may be
- when a correct answer is chosen, a brief cute delightful animation is played with a subtle sound indicating correct/success. Goal is to make the user feel proud.
- When an incorrect answer is chosen, there is also a brief cute sad animation with a different sound indicating incorrect/failure. Goal is to not make the user sad or upset, but just to indicate and encourage more play time but clearly communicating it was wrong.
- after the animation and confirmation shows, you should outline the user's answer and incorrect answer, if they were incorrect.  There should be a correct/incorrect confirmation on the screen at this point.
- there should be a button for "Next question" that loads a next question randomly from the question bank

# UI requirements

- Make it colorful and engaging, consider your audience is 5th graders
- Use delightful animations without being too aggressive or overbearing
- It needs to work on both touch and mouse devices (so phone and laptop)

# Other considerations

- This app should not require a database and can use localStorage or cookies if needed.
- foolproof durability of data is not required but we would like scores to save and persist across browser reloads and sessions

