import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

const functions = getFunctions(app);

export const submitPost = httpsCallable(functions, "submitPost");
export const prepareEmbed = httpsCallable(functions, "prepareEmbed");
export const registerLike = httpsCallable(functions, "registerLike");
export const registerView = httpsCallable(functions, "registerView");
export const createComment = httpsCallable(functions, "createComment");
