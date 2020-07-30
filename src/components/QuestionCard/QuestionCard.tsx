import React, { FunctionComponent } from 'react';
import { Question } from '../../types';
import './QuestionCard.css'

interface OwnProps {
    question: Question;
    number: number;
    callback: any;
}

type QuestionCardProps = OwnProps;

const QuestionCard: FunctionComponent<QuestionCardProps> = ({question, number, callback}) => {
    return (
        <div className="QuestionCard">
            <h2 className="number">{number}</h2>
            <p className="question">{question.text}</p>
            <ul className="answers">
                {question.answers.map(answer =>
                    (
                        <li key={answer.text}>
                            <button className="pure-button" value={answer.value}
                                    onClick={callback}>{answer.text}</button>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default QuestionCard;
