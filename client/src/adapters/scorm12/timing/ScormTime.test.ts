import { formatScormTime  } from "./ScormTime";


describe('SCORM Time', () => {

  describe('SCORM Time formatScormTime function', () => {
    it('should return not supported error', () => {
      expect(formatScormTime).toBeDefined()
    });

    
    it('should properly format valid ms input', () => {
      expect(formatScormTime(0)).toEqual('0000:00:00');
      expect(formatScormTime(115523000)).toEqual('0032:05:23');
      expect(formatScormTime(115523200)).toEqual('0032:05:23.2');
      expect(formatScormTime(3723456)).toEqual('0001:02:03.456');
    });

    it('should properly format valid ms input with double-precision floating-point numbers', () => {
      expect(formatScormTime(3723455.9999999995)).toEqual('0001:02:03.456');
      expect(formatScormTime(3723100.00000000000001)).toEqual('0001:02:03.1');
    });

  });
});
