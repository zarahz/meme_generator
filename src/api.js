import { backendURL } from "./config"

/** --------- USER ---------- */
export async function fetchUser() {
    let result = await fetch(backendURL + "me", {
        method: "GET",
        credentials: 'include'
    });
    const body = await result.json();

    return { status: result.status, body }
}

export async function loginUser(user) {
    let result = await fetch(backendURL + "login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
    });
    const body = await result.json();

    return { status: result.status, body };
}

export async function registerUser(user) {
    let result = await fetch(backendURL + "register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
    });
    const body = await result.json();

    return { status: result.status, body };
}

export async function isUnique(field, value) {
    let result = await fetch(backendURL + "is-unique", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value }),
    })
    const status = result.status;
    let body = {};
    if (status !== 200) {
        body = await result.json();
    }

    return { status, error: body.error };
}


/**--------- MEMES ---------- */
export async function getMemes() {
    let result = await fetch(backendURL + "memes", {
        method: "GET",
        credentials: "include",
    });
    const status = result.status;
    let memes = [];
    if (status === 200) {
        memes = await result.json();
    }
    return { status, memes };
}

export async function getUserMemes() {
    let result = await fetch(backendURL + "user-memes", {
        method: "GET",
        credentials: "include",
    });
    const status = result.status;
    let memes = [];
    if (status === 200) {
        memes = await result.json();
    }
    return { status, memes };
}

export async function getRandomMeme() {
    let result = await fetch(backendURL + "random-meme");
    const status = result.status;
    let meme = null;
    if (status === 200) {
        meme = await result.json();
    }
    return { status, meme };
}

export async function getServerMemes() {
    let result = await fetch(backendURL + "templates");
    const body = await result.json();
    return { body };
}

export async function upload(meme) {
    let result = await fetch(backendURL + "upload", {
        method: "POST",
        credentials: "include",
        body: meme,
    });
    const status = result.status;

    return { status };
}

export async function saveDraft(meme) {
    let result = await fetch(backendURL + "image-draft", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(meme),
    });
    const status = result.status;

    return { status };
}

export async function loadDraft() {
    let result = await fetch(backendURL + "image-drafts", {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });
    let body = null;
    if (result.status === 200) {
        body = await result.json();
    }
    return { body };
}

export async function renderSimpleMeme(meme) {
    let result = await fetch(backendURL + "render-simple-meme", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(meme),
    });
    const status = result.status;
    const body = await result.json();

    return { status, body };
}

export async function getWebpageScreenshot(params) {
    let result = await fetch(backendURL + "screenshot_webpage?" + new URLSearchParams(params));
    const body = await result.json();
    return { body };
}

/** -------------- Comments, Up- & Downvotes ---------- */
export async function postComment(comment) {
    let result = await fetch(backendURL + "post-comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(comment),
    });

    const status = result.status;
    let body = {};
    if (status !== 200) {
        body = await result.json();
    }

    return { status, error: body.error };
}

export async function postUpvote(upvote) {
    const result = await fetch(backendURL + "post-upvote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(upvote),
    });
    return { status: result.status }
}

export async function postDownvote(downvote) {
    let result = await fetch(backendURL + "post-downvote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(downvote),
    });
    return { status: result.status }
}

export async function getComments(params) {
    let result = await fetch(backendURL + "comments?" + new URLSearchParams(params));
    const status = result.status;
    let body = {};
    if (status === 200) {
        body = await result.json();
    }
    return { status, body }
}

export async function getUpvotes(params) {
    let result = await fetch(backendURL + "upvotes?" + new URLSearchParams(params));
    const status = result.status;
    let body = {};
    if (status === 200) {
        body = await result.json()
    }
    return { status, body }
}

export async function getDownvotes(params) {
    let result = await fetch(backendURL + "downvotes?" + new URLSearchParams(params));
    const status = result.status;
    let body = {};
    if (status === 200) {
        body = await result.json()
    }
    return { status, body }
}