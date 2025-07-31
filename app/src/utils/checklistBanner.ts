import localStorage, { ChecklistBannerState } from './localStorage';
import { getGoalsTracked } from './localStorage/goals';
import { isReminderActive } from './reminder';
import { INDICATEURS_HUMEUR, INDICATEURS_SOMMEIL } from './liste_indicateurs.1';
import { CHECKLIST_BANNER_CONFIG } from './constants';

/**
 * Check if all checklist items are completed
 */
export const isChecklistCompleted = async (): Promise<boolean> => {
    try {
        // Check reminder
        const reminder = await isReminderActive();

        // Check goals
        const goals = await getGoalsTracked();

        // Check drugs/medical treatment
        const drugs = await localStorage.getMedicalTreatment();

        // Check custom indicators (excluding default mood and sleep indicators)
        const userIndicators = await localStorage.getIndicateurs();
        const hasCustomIndicators = !!userIndicators.filter(
            ind => ![INDICATEURS_HUMEUR.uuid, INDICATEURS_SOMMEIL.uuid].includes(ind.uuid) && ind.active
        ).length;

        // Survey is always considered done (as per original checklist logic)
        const surveyDone = true;

        // All items must be completed
        return reminder && !!goals.length && !!(drugs && drugs.length) && hasCustomIndicators && surveyDone;
    } catch (error) {
        console.error('Error checking checklist completion:', error);
        return false;
    }
};

/**
 * Calculate the delay in milliseconds for the given dismiss count
 */
export const calculateDelayMs = (dismissCount: number): number => {
    const delayDays = CHECKLIST_BANNER_CONFIG.BASE_DELAY_DAYS * Math.pow(2, dismissCount - 1);
    return delayDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
};

/**
 * Check if the banner should be shown based on all conditions
 */
export const shouldShowChecklistBanner = async (): Promise<boolean> => {
    try {
        // First check if checklist is completed
        const isCompleted = await isChecklistCompleted();
        if (isCompleted) {
            return false;
        }

        // Get banner state
        const bannerState = await localStorage.getChecklistBannerState();

        // If permanently dismissed, don't show
        if (bannerState.permanentlyDismissed) {
            return false;
        }

        // If never dismissed, show it
        if (bannerState.dismissCount === 0 || !bannerState.lastDismissedAt) {
            return true;
        }

        // Check if enough time has passed since last dismissal
        const now = Date.now();
        const delayMs = calculateDelayMs(bannerState.dismissCount);
        const timeSinceLastDismissal = now - bannerState.lastDismissedAt;

        return timeSinceLastDismissal >= delayMs;
    } catch (error) {
        console.error('Error checking if banner should show:', error);
        return false;
    }
};

/**
 * Handle the "Plus tard" button click
 */
export const handlePlusTardClick = async (): Promise<ChecklistBannerState> => {
    return await localStorage.incrementChecklistBannerDismissCount();
};

/**
 * Get the next show time for the banner (for debugging/info purposes)
 */
export const getNextShowTime = async (): Promise<Date | null> => {
    try {
        const bannerState = await localStorage.getChecklistBannerState();

        if (bannerState.permanentlyDismissed || !bannerState.lastDismissedAt) {
            return null;
        }

        const delayMs = calculateDelayMs(bannerState.dismissCount);
        return new Date(bannerState.lastDismissedAt + delayMs);
    } catch (error) {
        console.error('Error calculating next show time:', error);
        return null;
    }
};
