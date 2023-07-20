export const durationScrollTo = (y: number, duration = 1000, degree= 2) => {
    const originY = window.scrollY;
    const k = (y-originY) / FIntegral(duration);

    function FIntegral(x : number) {
        if (degree==4)
            return (1/3) * Math.pow(duration, 2) * Math.pow(x, 3) - (1/2) * duration * Math.pow(x, 4) + (1/5) * Math.pow(x, 5);
        if (degree==6)
            return (-1/7) * Math.pow(x, 7) + (1/2) * duration * Math.pow(x, 6) - (3/5) * Math.pow(duration,2) * Math.pow(x, 5) + (1/4) * Math.pow(duration, 3) * Math.pow(x, 4);
        return (-(1/3) * Math.pow(x, 3) + (1/2) * duration * Math.pow(x, 2));
    }
    function Integral(x : number) {
        return k * FIntegral(x);
    }

    const startTime = new Date().getTime();

    const scrollInterval = setInterval(() => {
        const nowTime = new Date().getTime() - startTime;
        window.scrollTo({ top: (originY + Integral(nowTime))});

        if (duration <= nowTime) {
            clearInterval( scrollInterval );
        }
    }, 1);
};
