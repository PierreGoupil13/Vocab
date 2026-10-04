

export type SrsResult = {
    easeFactor: number;
    repetitions: number;
    intervalDays: number;
    nextReviewDate: Date;
}
/*
Je veux recalculer le ease factor et la prochaine date de révision (en tout cas dans une première version)
Comment gérer le cas ou la note est considéré en echec ?

*/
export function calculateSrs(oldSrs: SrsResult, note: number, today: Date)
{
    const newSrs: SrsResult = {...oldSrs}

    const repetitionsAfterReview = note >= 3 ? oldSrs.repetitions + 1 : 0;
    
    if (repetitionsAfterReview === 0) 
    {
        newSrs.repetitions = 0;
        newSrs.easeFactor = calculateEaseFactor(oldSrs.easeFactor, note);
        newSrs.intervalDays = 0;
        newSrs.nextReviewDate = calculateNewReviewDate(newSrs, today);
        return newSrs;
    }
    
    if (repetitionsAfterReview <= 1) {
        newSrs.easeFactor = calculateEaseFactor(oldSrs.easeFactor, note);
        newSrs.repetitions ++;
        newSrs.intervalDays = 1;
        newSrs.nextReviewDate = calculateNewReviewDate(newSrs, today);
        return newSrs;
    } else if (repetitionsAfterReview === 2) {
        newSrs.easeFactor = calculateEaseFactor(oldSrs.easeFactor, note); 
        newSrs.intervalDays = 6;
        newSrs.repetitions ++;
        newSrs.nextReviewDate = calculateNewReviewDate(newSrs, today);
        return newSrs;
    } else {
        newSrs.easeFactor = calculateEaseFactor(oldSrs.easeFactor, note); 
        newSrs.intervalDays = Math.ceil(oldSrs.intervalDays * oldSrs.easeFactor)
        newSrs.repetitions ++;
        newSrs.nextReviewDate = calculateNewReviewDate(newSrs, today);
        return newSrs;  
    }
}

export function calculateEaseFactor(oldEaseFactor: number, note: number) 
{
    return Math.max(oldEaseFactor + (0.1 - (5 - note) * ((0.08 + (5 - note) * 0.02))), 1.3);

}

export function calculateNewReviewDate(srs: SrsResult, today: Date) {
    const nextReviewDate = new Date(today);
    nextReviewDate.setDate(nextReviewDate.getDate() + srs.intervalDays);
    return nextReviewDate;
}