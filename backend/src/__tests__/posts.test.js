import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts'
import { Post } from '../db/models/post'

// 🔹🔹 Defining test case for the createPost service function
describe('creating posts', () => {
  test('creating post with all the parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose',
      author: 'Daniel Bugl',
      contents: 'This post is stored in a mongoDB database using mongoose',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId) //returns a post with an ID

    const foundPost = await Post.findById(createdPost._id)
    //expect the post to contain at least the properties of the original post object
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date) //to have the createdAt timeStamps
    expect(foundPost.updatedAt).toBeInstanceOf(Date) //to have the createdAt timeStamps
  })

  test('without title should fail', async () => {
    const post = {
      author: 'Daniel Bugl',
      contents: 'This post is stored in a mongoDB database using mongoose',
      tags: ['empty'],
    }

    //to catch error through during fail
    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError) //tells title is required
      expect(err.message).toContain('`title` is required')
    }
  })

  // Creating post with only the required parameter should succeed
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only title',
    }

    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn react hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-stack react projects',
    author: 'Daniel Bugl',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]

//Populated with the created posts
let createdSamplePosts = []

//Execute code before each test case is executed
beforeEach(async () => {
  await Post.deleteMany({}) //first clear all posts from database
  createdSamplePosts = [] //Clear the arrays

  for (const post of samplePosts) {
    //to ensure our unit tests is independent from each other, We insert posts into the database directly
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

// 🔹🔹 Defining test case for list posts
describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    //Sort the array manually by createdAt (descending)
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )

    //we cant compare the arrays with each other because mongoose return documents with additional info
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })

    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl')
    expect(posts.length).toBe(3)
  })

  test('should be able to filter posts by tags', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})

// 🔹🔹 Defining test case for getting a post by ID
describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    //we use .toObject() to convert the mongoose object to plain old javascript object(POJO)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

// 🔹🔹 Defining test case for updating a post by ID
describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(createdSamplePosts[0].id, { author: 'Test Author' })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
  })

  test('should not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update the updatedAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost('000000000000000000000000', {
      author: 'Test Author',
    })
    expect(post).toEqual(null)
  })
})

// 🔹🔹 Defining test case for deleting a post by ID
describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)

    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
