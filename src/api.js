export async function fetchUser() {
    let result = await fetch("http://localhost:3000/me", {
        method: "GET",
        credentials: 'include'
    });
    const body = await result.json();

    return { status: result.status, body }
}

export async function loginUser(user) {
    let result = await fetch("http://localhost:3000/login", {
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
    let result = await fetch("http://localhost:3000/register", {
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
    let result = await fetch("http://localhost:3000/is-unique", {
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