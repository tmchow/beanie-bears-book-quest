import { NextResponse } from 'next/server';
import questionsData from '@/app/data/questions.json';

export async function POST(request: Request) {
  try {
    const { usedQuestionIds } = await request.json();
    const { questions } = questionsData;
    
    // Filter out only the recent questions (max 5)
    const availableQuestions = questions.filter(q => !usedQuestionIds.includes(q.id));
    
    // Select random question from available ones, or all if none available
    const questionPool = availableQuestions.length > 0 ? availableQuestions : questions;
    const randomIndex = Math.floor(Math.random() * questionPool.length);
    const question = { ...questionPool[randomIndex] };
    
    // Process question choices
    if (question.type === 'multiple-choice') {
      const correctAnswer = question.correctAnswer;
      const otherChoices = question.choices
        .filter(choice => choice !== correctAnswer)
        .map(String);
      
      const shuffledChoices = otherChoices.sort(() => Math.random() - 0.5);
      const numberOfChoices = Math.floor(Math.random() * 3) + 2;
      const selectedChoices = shuffledChoices.slice(0, numberOfChoices);
      
      question.choices = [...selectedChoices, String(correctAnswer)]
        .sort(() => Math.random() - 0.5);
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error in random question API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random question' },
      { status: 500 }
    );
  }
} 