import React, { FunctionComponent, useState } from 'react';
import QuestionCard from './components/QuestionCard/QuestionCard';
import { fetchQuestions, fetchResults, postUserLevel } from './API';
import { Question, RiskLevel } from './types';
import ResultCard from './components/ResultCard/ResultCard';
import './App.css';

interface OwnProps {
}

type AppProps = OwnProps;

const App: FunctionComponent<AppProps> = (props) => {
    const [canContinue, setCanContinue] = useState(!!localStorage.getItem('userAnswers'));
    const [showStart, setShowStart] = useState(!canContinue);
    const [showRestart, setShowRestart] = useState(canContinue);
    const [loading, setLoading] = useState(false);
    const [showAllLevels, setShowAllLevels] = useState(false);
    const [finished, setFinished] = useState(false);

    const [number, setNumber] = useState(0);
    const [questions, setQuestions] = useState<Question[]>();
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [userLevel, setUserLevel] = useState<RiskLevel>();
    const [riskLevels, setRiskLevels] = useState<RiskLevel[]>();

    const loadQuestions = async () => {
        if (!questions) {
            setLoading(true);
            setQuestions(await fetchQuestions());
            setLoading(false);
        }
    };

    const loadRiskLevel = async () => {
        setLoading(true);
        const response = await fetchResults(userAnswers);
        setUserLevel(response.userLevel);
        setRiskLevels(response.riskLevels);
        setLoading(false);
    };

    const startQuiz = async () => {
        setShowStart(false);
        setShowRestart(false);
        await loadQuestions();
        setUserAnswers([]);
        setNumber(0);
        setUserLevel(undefined);
        setFinished(false);
        clearStorage();
    };

    const continueQuiz = async () => {
        setCanContinue(false);
        setShowRestart(false);
        await loadQuestions();
        const storedAnswers = JSON.parse(localStorage.getItem('userAnswers')!);
        setUserAnswers(storedAnswers);
        setNumber(storedAnswers.length);
    };

    const clearStorage = () => {
        localStorage.clear();
        setCanContinue(false);
    };

    const finish = async () => {
        setQuestions(undefined);
        await loadRiskLevel();
        clearStorage();
    };

    const registerAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        userAnswers[number] = +e.currentTarget.value;
        setUserAnswers(userAnswers);
        resetFocus(e);
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
        showFinish ? finish() : next();
    };

    const resetFocus = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
    };

    const confirmLevel = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        const chosenLevel: RiskLevel = riskLevels!.find(item => item.level === +e) as RiskLevel;
        await postUserLevel(chosenLevel);
        setUserLevel(chosenLevel);
        setLoading(false);
        setShowAllLevels(false);
        setFinished(true);
        setShowRestart(true);
    };

    const onShowAllLevels = () => {
        setShowAllLevels(true);
    };

    const next = () => {
        setNumber(number + 1)
    };

    const prev = () => {
        setNumber(number - 1)
    };

    const showFinish = number + 1 === questions?.length;
    const showNext = questions && questions[number + 1] && !showFinish;
    const showPrevious = questions && questions[number - 1];

    return (
        <div className="App">
            <h1>Risk Calculator</h1>

            {
                (showStart || canContinue) &&
                <p>
                    In this page you will be lead through a series of questions to assess your level of risk. You can
                    close your browser and continue at any time. To start your risk assessment, press start.
                </p>
            }

            {
                finished &&
                <div className="thanks">
                    <h2>Thanks!</h2>
                    <p>Your data has been successfully submitted.</p>
                </div>
            }

            <div className="control-buttons">
                {showStart &&
                <button className="pure-button button-success"
                        onClick={startQuiz}>
                    Start
                </button>}

                {showRestart &&
                <button className="pure-button"
                        onClick={startQuiz}>
                    Restart
                </button>}

                {canContinue &&
                <button className="pure-button button-success"
                        onClick={continueQuiz}>
                    Continue
                </button>}
            </div>

            {
                loading && <span>Loading...</span>
            }
            {
                questions &&
                <QuestionCard question={questions[number]}
                              number={number + 1}
                              callback={registerAnswer}/>
            }
            {
                userLevel && !showAllLevels &&
                <div className="results-wrapper">
                    <ResultCard callback={confirmLevel}
                                riskLevel={userLevel!}
                                recommended={true}/>

                    <button className="pure-button"
                            onClick={onShowAllLevels}>
                        Show all levels
                    </button>
                </div>
            }
            {
                userLevel && showAllLevels &&
                <div className="results-wrapper">
                    {
                        riskLevels?.map(riskLevel => {
                            return <ResultCard
                                key={riskLevel.level}
                                callback={confirmLevel}
                                riskLevel={riskLevel!}
                                recommended={riskLevel.level === userLevel?.level}
                            />;
                        })
                    }
                </div>
            }

            <div className="control-buttons">
                {
                    showPrevious &&
                    <button className="pure-button"
                            onClick={prev}>
                        Previous
                    </button>
                }
                {
                    showNext &&
                    <button className="pure-button button-success"
                            disabled={!userAnswers[number]}
                            onClick={next}>
                        Next
                    </button>
                }
                {
                    showFinish &&
                    <button className="pure-button button-success"
                            disabled={!userAnswers[number]}
                            onClick={finish}>
                        Finish
                    </button>
                }
            </div>
        </div>
    );
};

export default App;
