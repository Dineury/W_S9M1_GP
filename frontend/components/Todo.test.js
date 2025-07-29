import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import server from '../../backend/mock-server'
import { resetTodos } from '../../backend/helpers'

import Todo from './Todo'

describe('Todos Component', () => {
  let user, laundry, dishes, groceries, input

  afterEach(() => { server.resetHandlers() })
  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })
  beforeEach(async () => {
    resetTodos()
render(<Todo/>)
    user = userEvent.setup()
      await waitFor(() => {
      laundry = screen.getByText('laundry')
      dishes = screen.getByText('dishes')
      groceries = screen.getByText('groceries')
      input = screen.getByPlaceholderText('type todo')
    })
  })

  test('all todos are present', async () => {
    expect(laundry).toBeVisible()
    expect(dishes).toBeVisible()
    expect(groceries).toBeVisible()
    

  })
  test('can do and undo todos', async () => {
    const tasks = ['laundry', 'dishes', 'groceries']
    for(const  task of tasks) {
      let elem = screen.getByText(task)
      await userEvent.click(elem)
      expect(await screen.findByText(`${task} ✔️`)).toBeVisible()
      await userEvent.click(elem)
      expect(await screen.findByText(`${task}`)).toBeVisible()
      expect(screen.queryByText(`${task} ✔️`)).not.toBeInTheDocument()
    }
  })
  test('can delete todos', async () => {
 const tasks = ['laundry', 'dishes', 'groceries']
    for(const  task of tasks) {
      let span = screen.getByText(task)
      await user.click(span.nextSibling)
     await waitFor(()=> {
      expect(span).not.toBeInTheDocument()
    })
    }
  })
  test('can create a new todo, complete it and delete it', async () => {
    let learnJS
    await user.type(input, 'learn javascript')
    await user.keyboard('[ENTER]')
    await waitFor(() => {
    learnJS = screen.getByText('learn javascript')
    })  
    await user.click(learnJS)
     await waitFor(() => {
     expect(screen.queryByText('learn javascript')).not.toBeInTheDocument()
      screen.getByText('learn javascript ✔️')
    })
    await user.click(learnJS.nextSibling)
    await waitFor(() => {
      expect(learnJS).not.toBeInTheDocument()
    })
  })
})
