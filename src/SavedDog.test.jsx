import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import SavedDogs from './SaveDogs'
import axios from 'axios'

// Mock axios
jest.mock('axios')

// Simple mock for useNavigate (we're not testing navigation itself)
jest.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => <div>{children}</div>,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
}))

// Sample dog data
const dogsMockData = [
  {
    _id: '1',
    name: 'Buddy',
    age: 3,
    bio: 'Friendly dog',
    friends: ['Max'],
    presentToday: true,
    dogImage: 'http://example.com/image1.jpg',
  },
  {
    _id: '2',
    name: 'Charlie',
    age: 5,
    bio: 'Loves to run',
    friends: [],
    presentToday: false,
    dogImage: '',
  },
]

describe('SavedDogs', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: dogsMockData })
    axios.delete.mockResolvedValue({})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('displays fetched dogs', async () => {
    render(<SavedDogs />)

    expect(await screen.findByText(/Buddy/)).toBeInTheDocument()
    expect(screen.getByText(/Charlie/)).toBeInTheDocument()
  })

  test('removes dog after delete', async () => {
    render(<SavedDogs />)

    const deleteButton = await screen.findAllByText(/Delete/)
    fireEvent.click(deleteButton[0])

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/dogs/1')
      expect(screen.queryByText(/Buddy/)).not.toBeInTheDocument()
    })
  })
})
test("renders a dog's friends correctly", async () => {
  render(<SavedDogs />)

  // Wait for dogs to be rendered
  await screen.findByText(/Buddy/)

  // Look for a friend of Buddy (should be 'Max')
  const friendElement = screen.getByText('Max')
  expect(friendElement).toBeInTheDocument()

  // Also ensure Charlie has no friends (empty list)
  const charlieCard = screen.getByText(/Charlie/).closest('li')
  expect(charlieCard.querySelector('.friend-list').children.length).toBe(0)
})

