import range from 'lodash/range';
import round from 'lodash/round'
import config from '../../config';

type MM1_1 = {
    lambda: number,
    mu: number,
    n?: number[]
};

export default function MM1_1({ lambda, mu, n = range(0, config.maxN) }: MM1_1) {
    const lambdaEff: lambdaEff = lambda;

    const lambdaLost: lambdaLost = 0;

    // The probability, pn, of n students in the system
    const pn: pn[] = n.map(i => {
        return {
            n: i,
            pn: Math.pow(lambda / mu, i) * ((mu - lambda) / mu),
        }
    })

    // The probability that there is no student visiting the advisor
    const p0: p0 = pn[0].pn;


    // The average time a student waits before seeing the advisor.
    const wq: wq = lambda / (mu * (mu - lambda));

    // The average number of students waiting to see the advisor
    const lq: lq = lambdaEff * wq;

    // The average number of students waiting to see or visiting the advisor
    const ls: ls = lambda / (mu - lambda);

    // The average time spent in the campus including queue + visit time
    const ws: ws = ls / lambda;

    // The average occupancy of the advisor
    const c: c = ls - lq;

    return {
        c: round(c, config.roundTo),
        lambdaEff: round(lambdaEff, config.roundTo),
        lambdaLost: round(lambdaLost, config.roundTo),
        lq: round(lq, config.roundTo),
        ls: round(ls, config.roundTo),
        p0: round(p0, config.roundTo),
        pn: pn.map(l => { return { ...l, pn: round(l.pn, config.roundTo) } }),
        wq: round(wq, config.roundTo),
        ws: round(ws, config.roundTo),
    };
}
