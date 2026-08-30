const basePath = "http://localhost:3001/";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return undefined; // undefined = body wasn't valid JSON at all
  }
}

function buildError(status, body, kind, fallbackMessage) {
  if (body === undefined) {
    // res.json() itself threw — body wasn't parseable JSON
    return {
      kind: "technical",
      status,
      message:
        "Technical problems occurred. Please try again later or contact your administrator.",
    };
  }
  return { kind, status, message: body?.message || body?.error || fallbackMessage };
  // return { kind, status, message: body?.message || fallbackMessage };
}

export async function SignUp(form) {
  console.log("Sign up:");
  console.log("form.email: ", form.email);
  console.log("form.password:", form.password);

  let res;
  try {
    res = await fetch(`${basePath}api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });
  } catch (networkErr) {
    console.error("Network/technical error during sign up:", networkErr);
    throw {
      kind: "network",
      message: "Could not reach the server. Please try again later.",
    };
  }

  if (res.status === 200 || res.status === 201) {
    const data = await safeJson(res);
    console.log("Sign up succeeded:", data);
    return data;
  }

  if (res.status === 400) {
    const body = await safeJson(res);
    console.warn("Sign up validation failed (400):", body);
    throw buildError(400, body, "validation", "Invalid input.");
  }

  if (res.status === 409) {
    const body = await safeJson(res);
    console.warn("Sign up conflict (409):", body);
    throw buildError(
      409,
      body,
      "conflict",
      "An account with this email already exists."
    );
  }

  const body = await safeJson(res);
  console.error("Unexpected status from sign up:", res.status, body);
  throw buildError(
    res.status,
    body,
    "unknown",
    "Something went wrong. Please try again."
  );
}

export async function SignIn(form) {
  console.log("Sign in:");
  console.log("form.email: ", form.email);
  console.log("form.password:", form.password);

  let res;
  try {
    res = await fetch(`${basePath}api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });
  } catch (networkErr) {
    console.error("Network/technical error during sign in:", networkErr);
    throw {
      kind: "network",
      message: "Could not reach the server. Please try again later.",
    };
  }

  if (res.status === 200) {
    const data = await safeJson(res);
    console.log("Sign in succeeded:", data);
    return data;
  }

  if (res.status === 403) {
    const body = await safeJson(res);
    console.warn("Sign in unauthorized (403):", body);
    throw buildError(
      403,
      body,
      "unauthorized",
      "Unauthorized. Invalid or missing token. You are not registered."
    );
  }

  const body = await safeJson(res);
  console.error("Unexpected status from sign in:", res.status, body);
  throw buildError(
    res.status,
    body,
    "unknown",
    "Something went wrong. Please try again."
  );
}
