import { BrowserDataObject } from './browser-data-object.model';

describe('LocalStoreObject', () => {
  it('should create an instance', () => {
    expect(new BrowserDataObject([], [], [], [], [], 'test')).toBeTruthy();
  });
});
