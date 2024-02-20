import { makeAutoObservable } from "mobx";
import { HTTPData } from "../model/data_http";

export default class ApplicationState {
  //

  httpData: HTTPData | null = null;

  constructor() {
    makeAutoObservable(this);
  }
}

export const applicationState = new ApplicationState();
