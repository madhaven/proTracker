jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(), on: jest.fn(), send: jest.fn() }
}));

const { contextBridge } = require('electron');
require('./ePreload');

describe('ePreload', () => {
  it('should expose "comms" channel', () => {
    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith(
      'comms',
      expect.objectContaining({
        editProject: expect.any(Function),
        newTask: expect.any(Function),
        toggleTask: expect.any(Function),
        editTask: expect.any(Function),
        newHabit: expect.any(Function),
        editHabit: expect.any(Function),
        habitDone: expect.any(Function),
        deleteHabit: expect.any(Function),
        loadData: expect.any(Function),
        exportData: expect.any(Function),
        registerListener: expect.any(Function)
      })
    );
  });

  it('should expose "stateComm" channel', () => {
    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith(
      'stateComm',
      expect.objectContaining({
        notifyUIEvent: expect.any(Function),
        requestUIChange: expect.any(Function),
        registerListener: expect.any(Function)
      })
    );
  });
});
