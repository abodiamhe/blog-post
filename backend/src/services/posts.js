import { Post } from '../db/models/post.js'

// 🔹🔹 function to create and return a new post
export async function createPost({ title, author, contents, tags }) {
  const post = new Post({ title, author, contents, tags })

  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  //[sortBy] resolve the string to a key name = createdAt
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

// 🔹🔹 function to list posts
export async function listAllPosts(options) {
  return await listPosts({}, options)
}

// 🔹🔹 function to list posts by author
export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}

// 🔹🔹 function to list posts by tags
export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

// 🔹🔹 function to get single post by ID
export async function getPostById(postId) {
  return await Post.findById(postId)
}

// 🔹🔹 function to update single post by ID
export async function updatePost(postId, { title, author, contents, tags }) {
  console.log(postId)
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags } },
    { new: true }, //returns the modified object
  )
}

// 🔹🔹 function to delete single post by ID
export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}
