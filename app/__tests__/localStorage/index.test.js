import AsyncStorage from "@react-native-async-storage/async-storage";
import localStorage from "../../src/utils/localStorage/index";
import {
  STORAGE_KEY_INDICATEURS,
  STORAGE_KEY_IS_FIRST_LAUNCH,
  STORAGE_KEY_SYMPTOMS,
  STORAGE_KEY_NOTES_VERSION,
  STORAGE_KEY_NPS_PRO_CONTACT,
  STORAGE_KEY_VISIT_PRO_NPS,
  STORAGE_KEY_SUPPORTED,
  STORAGE_KEY_CUSTOM_DRUGS,
  STORAGE_KEY_MEDICAL_TREATMENT,
  STORAGE_KEY_CUSTOM_SYMPTOMS,
  STORAGE_KEY_ONBOARDING_STEP,
  STORAGE_KEY_ONBOARDING_DONE,
} from "../../src/utils/constants";

describe("localStorage utils", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe("Symptoms management", () => {
    test("should get symptoms from storage", async () => {
      const mockSymptoms = [{ id: 1, name: "Anxiété", level: 3 }];
      AsyncStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(mockSymptoms));

      const result = await localStorage.getSymptoms();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_SYMPTOMS);
      expect(result).toEqual(mockSymptoms);
    });

    test("should return undefined when no symptoms in storage", async () => {
      AsyncStorage.setItem(STORAGE_KEY_SYMPTOMS, null);

      const result = await localStorage.getSymptoms();

      expect(result).toBeUndefined();
    });

    test("should set symptoms in storage", async () => {
      const symptoms = [{ id: 1, name: "Anxiété", level: 3 }];

      await localStorage.setSymptoms(symptoms);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_SYMPTOMS, JSON.stringify(symptoms));
    });
  });

  describe("Indicateurs management", () => {
    test("should get indicateurs from storage", async () => {
      const indicateurs = [{ id: 1, name: "Humeur", type: "slider" }];
      AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(indicateurs));
      const result = await localStorage.getIndicateurs();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_INDICATEURS);
      expect(result).toEqual([
        {
          ...indicateurs[0],
          version: 2,
        },
      ]);
    });

    test("should migrate from symptoms to indicateurs if no indicateurs exist", async () => {
      const symptoms = [{ id: 1, name: "Anxiété" }];
      // we add symptoms to storage
      AsyncStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(symptoms)); // Has symptoms

      const result = await localStorage.getIndicateurs();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_INDICATEURS);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_SYMPTOMS);

      // Vérifier le deuxième appel spécifiquement
      expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(
        2, // Le deuxième appel
        STORAGE_KEY_INDICATEURS,
        expect.stringContaining('"name":"Anxiété"') // Vérifie que symptoms[0] est inclus
      );
    });

    test("should add new indicateur", async () => {
      const existingIndicateurs = [{ id: 1, name: "Humeur" }];
      const newIndicateur = { id: 2, name: "Énergie" };

      AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(existingIndicateurs));

      await localStorage.addIndicateur(newIndicateur);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_INDICATEURS, JSON.stringify([...existingIndicateurs, newIndicateur]));
    });
  });

  describe("Onboarding management", () => {
    test("should get first app launch status", async () => {
      AsyncStorage.setItem(STORAGE_KEY_IS_FIRST_LAUNCH, "false");
      const result = await localStorage.getIsFirstAppLaunch();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_IS_FIRST_LAUNCH);
      expect(result).toBe("false");
    });

    test("should set first app launch status", async () => {
      await localStorage.setIsFirstAppLaunch(false);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_IS_FIRST_LAUNCH, JSON.stringify(false));
    });

    test("should get onboarding step", async () => {
      AsyncStorage.setItem(STORAGE_KEY_ONBOARDING_STEP, "step2");

      const result = await localStorage.getOnboardingStep();

      expect(result).toBe("step2");
    });

    test("should set onboarding step", async () => {
      await localStorage.setOnboardingStep("step3");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_ONBOARDING_STEP, "step3");
    });

    test("should get onboarding done status", async () => {
      AsyncStorage.setItem(STORAGE_KEY_ONBOARDING_DONE, JSON.stringify(true));

      const result = await localStorage.getOnboardingDone();

      expect(result).toBe(true);
    });

    test("should return undefined when onboarding done is not set", async () => {
      const result = await localStorage.getOnboardingDone();

      expect(result).toBeUndefined();
    });
  });

  describe("Custom symptoms management", () => {
    test("should get custom symptoms", async () => {
      const mockCustomSymptoms = [{ id: "custom1", name: "Mon symptôme" }];
      AsyncStorage.setItem(STORAGE_KEY_CUSTOM_SYMPTOMS, JSON.stringify(mockCustomSymptoms));

      const result = await localStorage.getCustomSymptoms();

      expect(result).toEqual(mockCustomSymptoms);
    });

    test("should return empty array when no custom symptoms", async () => {
      AsyncStorage.setItem(STORAGE_KEY_CUSTOM_SYMPTOMS, null);

      const result = await localStorage.getCustomSymptoms();

      expect(result).toEqual([]);
    });

    test("should add custom symptom", async () => {
      const existingSymptoms = [{ id: "custom1", name: "Symptôme 1" }];
      const newSymptom = { id: "custom2", name: "Symptôme 2" };

      AsyncStorage.setItem(STORAGE_KEY_CUSTOM_SYMPTOMS, JSON.stringify(existingSymptoms));

      await localStorage.addCustomSymptoms(newSymptom);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_CUSTOM_SYMPTOMS, JSON.stringify([...existingSymptoms, newSymptom]));
    });
  });

  describe("Medical treatment management", () => {
    test("should get medical treatment", async () => {
      const mockTreatment = [{ id: 1, name: "Médicament A", dosage: "10mg" }];
      AsyncStorage.setItem(STORAGE_KEY_MEDICAL_TREATMENT, JSON.stringify(mockTreatment));

      const result = await localStorage.getMedicalTreatment();

      expect(result).toEqual(mockTreatment);
    });

    test("should set medical treatment", async () => {
      const treatment = [{ id: 1, name: "Médicament A", dosage: "10mg" }];

      await localStorage.setMedicalTreatment(treatment);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_MEDICAL_TREATMENT, JSON.stringify(treatment));
    });

    test("should remove drug from treatment", async () => {
      const treatment = [
        { id: 1, name: "Médicament A" },
        { id: 2, name: "Médicament B" },
      ];
      AsyncStorage.setItem(STORAGE_KEY_MEDICAL_TREATMENT, JSON.stringify(treatment));

      const result = await localStorage.removeDrugFromTreatment(1);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_MEDICAL_TREATMENT, JSON.stringify([{ id: 2, name: "Médicament B" }]));
      expect(result).toEqual([{ id: 2, name: "Médicament B" }]);
    });
  });

  describe("Custom drugs management", () => {
    test("should get custom drugs", async () => {
      const mockDrugs = [{ id: "drug1", name: "Mon médicament" }];
      AsyncStorage.setItem(STORAGE_KEY_CUSTOM_DRUGS, JSON.stringify(mockDrugs));

      const result = await localStorage.getCustomDrugs();

      expect(result).toEqual(mockDrugs);
    });

    test("should return empty array when no custom drugs", async () => {
      AsyncStorage.setItem(STORAGE_KEY_CUSTOM_DRUGS, null);

      const result = await localStorage.getCustomDrugs();

      expect(result).toEqual([]);
    });

    test("should add custom drug", async () => {
      const existingDrugs = [{ id: "drug1", name: "Médicament 1" }];
      const newDrug = { id: "drug2", name: "Médicament 2" };

      AsyncStorage.setItem(STORAGE_KEY_CUSTOM_DRUGS, JSON.stringify(existingDrugs));

      const result = await localStorage.addCustomDrug(newDrug);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_CUSTOM_DRUGS, JSON.stringify([...existingDrugs, newDrug]));
      expect(result).toEqual([...existingDrugs, newDrug]);
    });
  });

  describe("NPS and support management", () => {
    test("should get and set supported status", async () => {
      const supportedData = { isSupported: true, date: "2024-01-01" };

      await localStorage.setSupported(supportedData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_SUPPORTED, JSON.stringify(supportedData));

      const result = await localStorage.getSupported();
      expect(result).toEqual(supportedData);
    });

    test("should get and set visit pro NPS", async () => {
      const npsData = { score: 8, comment: "Très bien" };

      await localStorage.setVisitProNPS(npsData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_VISIT_PRO_NPS, JSON.stringify(npsData));

      const result = await localStorage.getVisitProNPS();
      expect(result).toEqual(npsData);
    });

    test("should get and set NPS pro contact", async () => {
      const contactData = { email: "test@example.com", contacted: true };

      await localStorage.setNpsProContact(contactData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_NPS_PRO_CONTACT, JSON.stringify(contactData));

      const result = await localStorage.getNpsProContact();
      expect(result).toEqual(contactData);
    });
  });

  describe("Notes version management", () => {
    test("should get and set notes version", async () => {
      const version = { version: "1.2.0", updated: true };

      await localStorage.setNotesVersion(version);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_NOTES_VERSION, JSON.stringify(version));

      const result = await localStorage.getNotesVersion();
      expect(result).toEqual(version);
    });
  });
});
