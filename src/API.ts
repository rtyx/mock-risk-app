import { RiskLevel, RiskResult } from './types';

export const fetchQuestions = async () => {
    const endpoint = `https://run.mocky.io/v3/ada7c70c-8d83-4560-8c16-41ede7495fd2`;
    return await (await fetch(endpoint)).json();
};

const fetchUserLevel = (values: number[], riskLevels: RiskLevel[]) => {
    const sum = values.reduce((a, b) => a + b, 0);
    let userLevel: RiskLevel;
    if (sum > 0) {
        userLevel = riskLevels[2];
    } else if (sum < 0) {
        userLevel = riskLevels[0];
    } else {
        userLevel = riskLevels[1];
    }
    return userLevel;
};

export const fetchResults: (values: number[]) => Promise<RiskResult> = async (values: number[]) => {
    const endpoint = `https://run.mocky.io/v3/f3a6fa1e-6eb6-4699-b4d3-7f1dbce31c58`;

    const riskLevels: RiskLevel[] = await (await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(values)
    })).json();

    const userLevel = fetchUserLevel(values, riskLevels); // Let's imagine this happens in the back end

    return {riskLevels, userLevel}
};

export const postUserLevel = async (userLevel: RiskLevel) => {
    const endpoint = `https://run.mocky.io/v3/f3a6fa1e-6eb6-4699-b4d3-7f1dbce31c58`;

    const response: Response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(userLevel)
    });

    return response.status === 200;
};
