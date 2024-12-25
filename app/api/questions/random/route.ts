import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { usedQuestionIds, selectedBooks } = await request.json();
    const questionsPath = path.join(process.cwd(), 'app/data/questions.json');
    const fileContents = fs.readFileSync(questionsPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    let availableQuestions = data.questions;

    // Filter questions by selected books if provided
    if (selectedBooks && selectedBooks.length > 0) {
      availableQuestions = availableQuestions.filter((q: any) => 
        selectedBooks.includes(q.bookTitle)
      );
    }

    // Filter out recently used questions
    if (usedQuestionIds && usedQuestionIds.length > 0) {
      availableQuestions = availableQuestions.filter((q: any) => 
        !usedQuestionIds.includes(q.id)
      );
    }

    if (availableQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No more questions available' },
        { status: 404 }
      );
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = { ...availableQuestions[randomIndex] };

    // Process multiple choice questions to show random number of choices
    if (selectedQuestion.type === 'multiple-choice') {
      const correctAnswer = selectedQuestion.correctAnswer;
      const otherChoices = selectedQuestion.choices
        .filter((choice: string) => choice !== correctAnswer)
        .sort(() => Math.random() - 0.5); // Shuffle wrong answers
      
      // Random number between 3 and 5 (inclusive)
      const numberOfChoices = Math.floor(Math.random() * 3) + 3;
      
      // Take random wrong choices and add correct answer
      const selectedChoices = otherChoices.slice(0, numberOfChoices - 1);
      selectedQuestion.choices = [...selectedChoices, correctAnswer]
        .sort(() => Math.random() - 0.5); // Shuffle all choices
    }

    return NextResponse.json(selectedQuestion);
  } catch (error) {
    console.error('Error fetching random question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
} 