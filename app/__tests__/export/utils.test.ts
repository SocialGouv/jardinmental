import { formatHtmlTable } from '../../src/scenes/export/utils';
// Mock the dependencies
jest.mock('../../src/utils/localStorage', () => ({
  default: {
    getIndicateurs: jest.fn(),
  },
}));

jest.mock('../../src/utils/drugs-list', () => ({
  getDrugListWithLocalStorage: jest.fn(),
}));

jest.mock('../../src/utils/date/helpers', () => ({
  getArrayOfDates: jest.fn(),
  formatDate: jest.fn(),
}));

import localStorageUtils from '../../src/utils/localStorage';
import { getDrugListWithLocalStorage } from '../../src/utils/drugs-list';
import { getArrayOfDates } from '../../src/utils/date/helpers';

describe('Export utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    (localStorageUtils.getIndicateurs as jest.Mock).mockResolvedValue([
      {
        name: 'MOOD',
        active: true,
        type: 'slider',
        order: 'ASC'
      }
    ]);
    
    (getDrugListWithLocalStorage as jest.Mock).mockResolvedValue([
      {
        id: 'test-drug',
        name: 'Test Drug'
      }
    ]);
    
    (getArrayOfDates as jest.Mock).mockReturnValue([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03'
    ]);
  });

  describe('formatHtmlTable', () => {
    test('should generate HTML table with minimal data', async () => {
      const diaryData = {
        '2024-01-01': {
          MOOD: { value: 3 }
        }
      };
      const diaryNotes = {};

      const result = await formatHtmlTable(diaryData, diaryNotes);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('<!DOCTYPE html');
      expect(result).toContain('<title>Export Jardin Mental</title>');
      expect(result).toContain('Mes données de Jardin Mental');
    });

    test('should handle empty diary data', async () => {
      const diaryData = {};
      const diaryNotes = {};

      const result = await formatHtmlTable(diaryData, diaryNotes);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('<!DOCTYPE html');
      expect(result).toContain('Mes données de Jardin Mental');
    });

    test('should include CSS styles in the output', async () => {
      const diaryData = {};
      const diaryNotes = {};

      const result = await formatHtmlTable(diaryData, diaryNotes);

      expect(result).toContain('<style type="text/css">');
      expect(result).toContain('font-size: 12px');
      expect(result).toContain('border-collapse:separate');
    });
  });
});
