import range from 'lodash/range';
import round from 'lodash/round'
import config from '../../config';

type MM1_2 = {
    lambda: number,
    mu: number,
    N: number,
    n?: number[]
};

function calculatePN({ lambda, mu, N, index }: MM1_2 & { index: number }): pn {
    if (lambda / mu === 1) {
        return {
            n: index,
            pn: 1 / (N + 1)
        };
    }

    const p0: p0 = (1 - lambda / mu) / (1 - Math.pow(lambda / mu, N + 1))

    return {
        n: index,
        pn: p0 * (Math.pow(lambda / mu, index))
    };
}

function calculateLS({ lambda, mu, N }: MM1_2): ls {
    const d = lambda / mu;

    const devidend = d * (1 - ((N + 1) * Math.pow(d, N)) + (N * Math.pow(d, N + 1)));
    const divisor = (1 - d) * (1 - Math.pow(d, N + 1));

    return devidend / divisor;
}

export default function MM1_2({ lambda, mu, N, n = range(0, config.maxN) }: MM1_2) {
    // 𝜆_𝑙𝑜𝑠𝑡 =𝜆 * 𝑝_𝑁
    const lambdaLost: lambdaLost = lambda * calculatePN({ lambda, mu, N, index: N }).pn;

    //𝜆_𝑒𝑓𝑓 = 𝜆 − 𝜆_𝑙𝑜𝑠𝑡
    const lambdaEff: lambdaEff = lambda - lambdaLost;

    const p0 = calculatePN({ lambda, mu, N, index: 0 }).pn;

    // The probability, pn, of n students in the system
    const pn: pn[] = n.map(i => {
        return calculatePN({ lambda, mu, N, index: i });
    })

    const ls: ls = calculateLS({ lambda, mu, N });

    const ws: ws = ls / lambdaEff;

    const wq: wq = ws - (1 / mu);

    const lq: lq = lambdaEff * wq;

    const c: c = lambdaEff / mu;

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