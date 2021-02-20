import { backendURL, frontendURL } from "./config";

export function getBackendMemeURL(image) {
    return backendURL + "static/" + image.nameAndFileType;
}

export function getFrontendMemeURL(image) {
    return frontendURL + "meme/" + image._id;
}