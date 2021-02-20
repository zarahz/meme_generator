import { backendURL } from "./config"

function get(path) {
    const fetchObj = {
        method: "GET",
        credentials: 'include'
    };
    return executeFetch(`${backendURL}${path}`, fetchObj);
}

function post(api, body, headers = { "Content-Type": "application/json" }) {
    let fetchObj = {
        method: "POST",
        credentials: "include",
        body: body,
    }
    // headers are not always needed, i.e. upload
    if (headers) fetchObj.headers = headers
    return executeFetch(`${backendURL}${api}`, fetchObj)
}

async function executeFetch(path, fetchObj) {
    let result = await fetch(path, fetchObj);

    const status = result.status;
    let response = { status }
    if (status !== 200 && status !== 204) { // error
        let json = await result.json();
        response.error = json.error;
    }
    if (status === 200) {
        let json = await result.json();
        response.body = json;
    }
    return response;
}

/** --------- USER ---------- */
export const fetchUser = () => get('me');

export const loginUser = (user) => post('login', JSON.stringify(user));

export const registerUser = (user) => post("register", JSON.stringify(user));

export const isUnique = (field, value) => post('is-unique', JSON.stringify({ field, value }));


/**--------- MEMES ---------- */
export const getMemes = () => get("memes");

export const getUserMemes = () => get("user-memes");

export const getRandomMeme = () => get("random-meme");

export const getServerMemes = () => get("templates");

export const upload = (meme) => post('upload', meme, null);

export const saveDraft = (meme) => post("image-draft", JSON.stringify(meme));

export const loadDraft = () => get("image-drafts");

export const renderSimpleMeme = (meme) => post("render-simple-meme", JSON.stringify(meme))

export const getWebpageScreenshot = (params) => get("screenshot_webpage?" + new URLSearchParams(params))

/** -------------- Comments, Up- & Downvotes ---------- */
export const postComment = (comment) => post("post-comment", JSON.stringify(comment));

export const postUpvote = (upvote) => post("post-upvote", JSON.stringify(upvote));

export const postDownvote = (downvote) => post("post-downvote", JSON.stringify(downvote));

export const getComments = (params) => get("comments?" + new URLSearchParams(params));

export const getUpvotes = (params) => get("upvotes?" + new URLSearchParams(params));

export const getDownvotes = (params) => get("downvotes?" + new URLSearchParams(params));

/** -------------- Statistics ---------- */
export const updateMultipleTemplatesViewedStats = (templates) => post("stats/templates/viewed", JSON.stringify(templates));

export const updateTemplateChosenStats = (template) => post("stats/templates/chosen", JSON.stringify(template));

export const updateTemplateGeneratedStats = (template) => post("stats/templates/generated", JSON.stringify(template));
