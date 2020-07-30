import React, { FunctionComponent } from 'react';
import { RiskLevel } from '../../types';
import './ResultCard.css'

interface OwnProps {
    callback: any;
    riskLevel: RiskLevel;
    recommended: boolean;
}

type Props = OwnProps;

const ResultCard: FunctionComponent<Props> = ({riskLevel, callback, recommended}) => {

    return (
        <div className={recommended ? 'ResultCard recommended' : 'ResultCard'}>
            <h2>Level {riskLevel.level}</h2>
            <h3>{riskLevel.title}</h3>
            <p>{riskLevel.description}</p>
            <button className={recommended ? 'pure-button button-success' : 'pure-button'}
                    onClick={callback}
                    value={riskLevel.level}>
                Select level {riskLevel.level}
            </button>
            {recommended &&
            <p>(recommended)</p>
            }
        </div>
    );
};

export default ResultCard;
