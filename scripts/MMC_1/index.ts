import range from 'lodash/range';
import round from 'lodash/round'
import { factorial } from 'mathjs'
import config from '../../config';

type MMC_1 = {
    c: c,
    lambda: number,
    mu: number,
    n?: number[]
};

function calculatePN({ lambda, mu, c, index }: MMC_1 & { index: number }): pn {
    if (index <= c) {
        return {
            n: index,
            pn: (Math.pow(lambda / mu, index) * calculateP0({ lambda, mu, c })) / factorial(index)
        }
    }

    return {
        n: index,
        pn: (Math.pow(lambda, index) * calculateP0({ lambda, mu, c })) / (Math.pow(mu, c) * factorial(c) * Math.pow(c, index - c))
    }
}

function calculateP0({ lambda, mu, c }: MMC_1): p0 {
    const devidend = 1;
    const divisor = range(0, c).map((a) => {
        const d = lambda / (mu * (a + 1));

        return (Math.pow(d, a) / factorial(a)) + ((Math.pow(d, c) / factorial(c)) * (1 / (1 - d / c)));
    }).reduce((acc, cum) => acc + cum, 0);

    return devidend / divisor;
}

function calculateLQ({ lambda, mu, c }: MMC_1): lq {
    const devidend = Math.pow(lambda, c + 1);
    const divisor = Math.pow(c - (lambda / mu), c) * factorial(c - 1) * Math.pow(mu, c + 1)

    return (devidend / divisor) * calculateP0({ lambda, mu, c });
}

export default function MMC_1({ lambda, mu, c, n = range(0, config.maxN) }: MMC_1) {
    const lambdaEff: lambdaEff = lambda;

    const lambdaLost: lambdaLost = 0;

    const p0 = calculateP0({ lambda, mu, c })

    const pn: pn[] = n.map(i => calculatePN({ lambda, mu, c, index: i }));

    const lq: lq = calculateLQ({ lambda, mu, c });

    const ls: ls = lq + lambda / mu;

    const wq: wq = lq / lambda;

    const ws: ws = ls / lambda;

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