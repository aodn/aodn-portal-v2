import EventEmitter from "events";
import { EventName } from "./enum/EventName";
import { LoadingName } from "./enum/LoadingName";

class LoadingManager {
  private static instance: LoadingManager;
  private static loadingEmitter: EventEmitter = new EventEmitter();

  private constructor() {}

  public static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  public startLoading(loadingName: LoadingName) {
    LoadingManager.loadingEmitter.emit(EventName.START_LOADING, loadingName);
  }

  public startUniqueLoading(loadingName: LoadingName) {
    LoadingManager.loadingEmitter.emit(
      EventName.START_UNIQUE_LOADING,
      loadingName
    );
  }

  public endLoading(loadingName: LoadingName) {
    LoadingManager.loadingEmitter.emit(EventName.END_LOADING, loadingName);
  }

  public subscribe(
    eventName: EventName,
    listener: (loadingName: LoadingName) => void
  ) {
    LoadingManager.loadingEmitter.on(eventName, listener);
    return this;
  }

  public unsubscribe(
    eventName: EventName,
    listener: (loadingName: LoadingName) => void
  ) {
    LoadingManager.loadingEmitter.off(eventName, listener);
    return this;
  }
}

const loadingManager = LoadingManager.getInstance();

export default loadingManager;
