export const getPosts = async (queryParams) => {
  //JavaScript object into URL query parameters with URLSearchParams()
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )

  return await res.json()
}

//Sending a post request to backend
export const createPost = async (post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })

  return await res.json()
}
